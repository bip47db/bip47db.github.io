<!-- abstract -->
This document proposes BIP47DB, an open protocol for inscribing BIP47 reusable payment codes onto the Bitcoin blockchain using Ordinals inscriptions with compressed binary encoding. The protocol creates a decentralised, censorship-resistant, and publicly verifiable directory of payment codes that eliminates single points of failure in the PayNym ecosystem. Anyone may write to the directory, and all entries are client-side verifiable against the secp256k1 curve. We describe the binary encoding format, the inscription structure, cost analysis, a comparison with the Runes protocol, indexer architecture, and integration paths for existing wallets including Ashigaru and Sparrow.
<!-- /abstract -->

## 1. Introduction

BIP47, *Reusable Payment Codes for Hierarchical Deterministic Wallets*, was proposed by Justus Ranvier in 2015. <sup>[1]</sup> It enables users to derive a unique, publicly shareable payment code from their HD wallet seed. Two parties who exchange payment codes can generate an effectively unlimited number of unique Bitcoin addresses between them, eliminating address reuse and preserving transactional privacy.

The PayNym system, originally developed by Samourai Wallet, provided a user-friendly layer on top of BIP47 by assigning human-readable nicknames and robot avatars to payment codes. <sup>[2]</sup> This directory was hosted centrally at paynym.is and served as the primary lookup mechanism for wallets implementing BIP47, including Samourai Wallet, Sparrow Wallet, and Stack Wallet.

This whitepaper proposes BIP47DB: an open protocol for permanently inscribing BIP47 payment codes onto the Bitcoin blockchain itself, creating a decentralised directory that cannot be seized, censored, or lost. The protocol leverages Ordinals inscriptions to store compressed binary batches of payment codes at minimal cost, with full client-side verifiability.

## 2. Background and Motivation

### 2.1 BIP47 Payment Codes

A BIP47 payment code is an 80-byte binary structure derived from the HD wallet path m/47’/0’/0’. <sup>[1]</sup> It contains a version byte, a features byte, a compressed secp256k1 public key (33 bytes: sign byte + x coordinate), a 32-byte chain code, and 13 bytes of padding reserved for future use. When Base58Check-encoded with version byte 0x47, the result is the familiar PM8T... string that users share publicly. <sup>[3]</sup>

From this 80-byte payment code, the notification address can be deterministically derived: it is the P2PKH address of the 0th public key derived from the payment code. <sup>[1]</sup> The PayNym nickname and avatar, however, are not purely deterministic client-side operations. As noted by the Ashigaru Open Source Project, “it is not possible to replicate exactly the existing PayNym names and avatars that are derived from BIP47 reusable payment codes, as they are not deterministic and we believe the server plays a role in ensuring collisions are avoided.” <sup>[4]</sup> PayNym nicknames and avatars are therefore generated and assigned by the PayNym directory server operator (whether that is the original paynym.is or Ashigaru’s paynym.rs), and only the server operator can produce the canonical mapping between payment codes and their PayNym identities.

### 2.2 The PayNym Directory

Samourai Wallet operated a centralised PayNym directory at paynym.is from 2018. <sup>[2]</sup> This server stored the mapping between payment codes, notification addresses, and PayNym identities. It also tracked “following” relationships between PayNyms, which wallet clients used to recover outgoing BIP47 connections during wallet restoration.

The Ashigaru Open Source Project recognised the fragility of this arrangement and built an alternative directory at paynym.rs. <sup>[4]</sup> The Ashigaru team used the +samouraiwallet PayNym as an anchor with its 12,000+ followers, iterating through all degrees of connection to populate their new database with approximately 17,500 PayNyms and their respective followers. The Ashigaru project has since also gained control of the original paynym.is domain, which now redirects to the newly built paynym.rs directory. <sup>[5]</sup>

### 2.3 The Samourai Wallet Seizure

On 24 April 2024, the U.S. Department of Justice arrested Samourai Wallet co-founders Keonne Rodriguez and William Lonergan Hill, charging them with conspiracy to commit money laundering and operating an unlicensed money-transmitting business. <sup>[6]</sup> The Samourai Wallet web servers, hosted in Iceland, were seized along with the domain.

This seizure demonstrated the existential risk of relying on centralised infrastructure for what is fundamentally a decentralised protocol. Although the PayNym server at paynym.is was left untouched and operational following the seizure, it was unmaintained and its long-term availability was uncertain. The Ashigaru Open Source Project began development of their replacement directory during this period of uncertainty, successfully migrating the data while the original server remained accessible. <sup>[4]</sup> Had the PayNym server been seized alongside the main Samourai infrastructure, or had it gone offline before Ashigaru could complete its migration, the directory data could have been permanently lost.

## 3. The Problem

### 3.1 Asymmetric Recovery

**Incoming connections** to a BIP47 payment code are recoverable from the blockchain alone. A user who restores their wallet from seed can derive their notification address and scan the blockchain for notification transactions sent to it. Each notification transaction contains the sender’s payment code (encrypted with ECDH), allowing the wallet to reconstruct all incoming payment channels. <sup>[1]</sup>

**Outgoing connections** present the problem. When a user sends a notification transaction to a peer, they record which notification *address* they sent to. However, a notification address alone does not reveal the corresponding payment code. To recover outgoing connections, the wallet must query a directory that maps notification addresses to payment codes. If no such directory is available, the user loses visibility of all outgoing BIP47 payment channels. <sup>[4]</sup>

This problem is further compounded by wallet implementations that allow users to send to a BIP47 payment code without first broadcasting a notification transaction. This issue was first identified in Sparrow Wallet shortly after it introduced BIP47 support, where a user could pay directly to a payment code that had already connected *to them* (i.e. where the peer initiated the connection via a notification transaction) without requiring the user to send their own notification transaction in return. <sup>[13]</sup> That specific case was resolved shortly after Sparrow released PayNym support; however, the related code path for *outgoing* payment codes was unintentionally missed by the same fix. <sup>[14]</sup> Sparrow has indicated this will be addressed in the next release, but for several years it has been possible — through normal use of the wallet — to send to a BIP47 payment code without a notification transaction being created if the user was following another PayNym via the server. The result is that no outgoing notification transaction is recorded on the blockchain for a restored wallet to discover during recovery. The funds are not lost — they remain spendable by the recipient — but the sender’s transaction history becomes incomplete and the outgoing payment channel is invisible to the restored wallet. A decentralised on-chain directory of payment codes, as proposed by BIP47DB, would provide an additional recovery path in this scenario by allowing the wallet to resolve notification addresses to payment codes without depending on the existence of a corresponding outgoing notification transaction.

Both Samourai and Ashigaru also support the ability to "refund" a BIP47 payment back to the original sender without requiring a new notification transaction, since the sender’s payment code was already received via the incoming notification. This further illustrates that not all BIP47 payment flows create the on-chain notification trail that seed-only recovery depends upon.

A separate but equally consequential gap appears in BlueWallet, which implements BIP47 but does not query paynym.rs or any other directory service.<sup>[15][16]</sup> Unlike the Sparrow and Samourai/Ashigaru cases above — where the on-chain notification trail itself is incomplete — BlueWallet creates the trail correctly but provides no in-wallet path to traverse it. A BlueWallet user who restores from seed and has previously sent notification transactions can see the notification addresses on-chain but has no in-wallet mechanism to resolve them to payment codes, even though the data exists in a public directory accessible to other BIP47 wallets. The user must know each peer’s payment code out-of-band and reconstruct connections by establishing new notification transactions. BIP47DB removes this constraint by allowing any wallet, regardless of its directory integrations, to resolve notification addresses to payment codes by querying any indexer of the canonical deposit address (see §12.4 for an architectural fit specific to BlueWallet’s Electrum-backed design).

### 3.2 Single Point of Failure

The PayNym directory at paynym.is was the only widely-used source of this mapping data. Its dependence on centralised infrastructure created a real risk of data loss for thousands of users. While no funds were at risk (the private keys remain with users), the loss of connection metadata means users cannot identify or track their own outgoing transactions without re-establishing connections from scratch.

### 3.3 Centralisation Risk

Even with Ashigaru’s replacement directory at paynym.rs (and their control of the paynym.is domain, which now redirects to it), the fundamental problem remains: any centralised server can be seized, go offline, suffer data corruption, or be denied to users in certain jurisdictions. The BIP47 protocol itself is decentralised, but the directory infrastructure is not.

## 4. Protocol Specification: BIP47DB

BIP47DB is an open protocol for storing BIP47 payment codes on the Bitcoin blockchain via Ordinals inscriptions. <sup>[7]</sup> The protocol has the following properties:

**Permissionless writes:** Anyone can create a BIP47DB inscription. There is no gatekeeper, registration process, or required identity. A wallet, a directory operator, or any community member can publish payment codes.

**Client-side verifiable:** Every payment code in a BIP47DB inscription can be independently validated by checking that the embedded public key is a valid point on the secp256k1 curve. <sup>[3]</sup> Invalid entries are simply discarded by the client.

**Append-only:** Inscriptions are immutable once confirmed. Bitcoin block height and transaction position define a canonical ordering across all batches, so indexers process them in the order they were committed to the blockchain without any additional linkage field in the payload.

**Compressed binary encoding:** Payment codes are stored in their raw 80-byte binary form with a 1-byte per-record flags field (81 bytes per record), then batch-compressed with zlib to minimise on-chain footprint. Redundant fields (notification addresses) are not stored, as they are derivable from the payment code. PayNym nicknames and avatars are also omitted, as these are server-operator-assigned identifiers that directory operators can regenerate from the payment code data. The per-record flags field captures implementation-specific extensions such as Segwit support signalling. The publisher’s identity is recoverable from the ECDSA signature in the trailer, enabling publisher attribution and reputation filtering without consuming header space.

## 5. On-Chain Data Format

### 5.1 Batch Structure

Each BIP47DB inscription contains a single compressed binary blob with the following uncompressed structure:

**Header (8 bytes):**

| **Field**      | **Size** | **Description**                                              |
|----------------|----------|--------------------------------------------------------------|
| Magic          | 2 bytes  | 0x47DB — compact format identifier                           |
| Format version | 1 byte   | Protocol version (currently 0x01)                            |
| Record count   | 4 bytes  | Number of payment codes in this batch (big-endian uint32)    |
| Flags          | 1 byte   | Bit 0: 1 = v1 codes; Bit 1: 1 = v2 codes; Bits 2–7: reserved |

*The publisher’s public key is not stored in the header. It is recovered from the ECDSA signature and recovery flag in the trailer (see Section 5.3), saving 33 bytes per batch. ECDSA key recovery is a well-established technique used throughout the Bitcoin ecosystem (notably in Bitcoin’s message signing standard), and is possible because ECDSA does not include the public key in the signature hash, unlike BIP-340 Schnorr which uses key prefixing. The choice of ECDSA over BIP-340 for the batch signature is deliberate: it enables key recovery, has universal library support in all BIP47 wallet implementations, and the security tradeoff (loss of related-key attack protection from key prefixing) is acceptable for publisher attestation, since payment code validity rests on independent secp256k1 curve verification, not on the publisher’s identity.*

### 5.2 Body

The body consists of N concatenated 81-byte records, where N equals the record count field. Each record comprises the 80-byte raw BIP47 payment code followed by a 1-byte per-record flags field:

| **Field**    | **Size** | **Description**                                                                                      |
|--------------|----------|------------------------------------------------------------------------------------------------------|
| Payment code | 80 bytes | Raw BIP47 v1/v2 payment code (version, features, pubkey, chain code, padding)                        |
| Record flags | 1 byte   | Bit 0: Samourai/Ashigaru Segwit extension (features byte signals Segwit support); Bits 1–7: reserved |

The per-record flags byte addresses the Samourai/Ashigaru practice of using a custom features byte to signal Segwit support. The BIP47 spec defines the features byte (offset 1) with all bits as zero except for Bitmessage notification. Samourai extended this by setting a feature bit to indicate the wallet supports receiving to Segwit-derived addresses. This means the same wallet seed can produce two different 80-byte payment codes — one spec-compliant with features byte 0x00, and one with the Segwit flag set. Both contain identical public key material and derive the same notification address. The per-record flags byte allows the canonical spec-compliant payment code to be stored alongside a Segwit capability signal, without duplicating records. Indexers can reconstruct both the standard and extended payment codes from a single 81-byte record.

### 5.3 Trailer

| **Field**     | **Size** | **Description**                                                  |
|---------------|----------|------------------------------------------------------------------|
| Checksum      | 4 bytes  | First 4 bytes of SHA-256(header + body)                          |
| Recovery flag | 1 byte   | ECDSA recovery parameter (v = 0 or 1) for public key extraction  |
| Signature     | 64 bytes | ECDSA signature (r, s) over the BIP-137 digest (see below)       |

**Total trailer size: 69 bytes**

The signature is produced using BIP-137, the Bitcoin Signed Message format. The signer first computes `batch_hash = SHA-256(header || body)` and encodes it as a 64-character lowercase hex string. The bytes actually signed are the BIP-137 digest:

```text
signed_digest = SHA-256(SHA-256(
    "\x18Bitcoin Signed Message:\n"  ||
    0x40                             ||   // compact-size length of 64
    ascii_hex(batch_hash)
))
```

The resulting 64-byte compact signature `r || s` is stored in the trailer, together with the 1-byte recovery flag (v). The publisher’s compressed public key is recovered from the signature using the recovery flag, which disambiguates between the two candidate public keys that correspond to a given ECDSA signature.

This construction matches Bitcoin Core’s `signmessage` / `verifymessage` RPC and the “Sign Message” UI in Sparrow, Electrum, Samourai, and Ashigaru. Publishers can therefore sign batches from their existing wallet without bespoke tooling: paste the hex-encoded `batch_hash` as the message text, sign with the private key corresponding to the publisher’s notification address, and paste the resulting base64 signature into the publishing tool. The recovery procedure is implemented in all major secp256k1 libraries including libsecp256k1 (`secp256k1_ecdsa_recover`), tiny-secp256k1, and noble-secp256k1 (`recoverPublicKey`).

Publishers who hold a BIP47 payment code SHOULD sign batches using the private key corresponding to their notification address (the P2PKH address derived from the 0th public key of the payment code at path `m/47'/0'/0'`). This creates a cryptographic link between the batch publisher and the BIP47 ecosystem: anyone who knows the publisher’s payment code can verify the batch signature by recovering the public key and checking it against the notification address derived from that payment code. This provides a trust signal without requiring a separate identity system or public key infrastructure — the existing PayNym connection graph serves as the web of trust. For example, if Ashigaru signs a batch with the key corresponding to a well-known PayNym, any client that already follows that PayNym can verify the batch attribution automatically. This recommendation is a SHOULD, not a MUST: directory operators or community members publishing payment codes on behalf of others would sign with their own notification address key, not the keys of the payment codes being published.

### 5.4 Compression

The entire payload (header + body + trailer) is compressed using zlib (deflate) at maximum compression level (9). Payment codes share structural redundancy — identical version bytes (0x01), common sign bytes (0x02/0x03), and zero-filled padding fields — which zlib exploits effectively, typically achieving 40–50% compression on batches of 1,000+ records.

The compressed blob is inscribed with the content-type application/x-bip47db to enable identification by Ordinals indexers. A complementary discovery mechanism using a canonical deposit address is described in Section 5.5.

### 5.5 Canonical Deposit Address

To provide a discovery mechanism that does not depend on Ordinals-specific indexing infrastructure, the protocol specifies a canonical, provably unspendable Bitcoin address to which all BIP47DB inscription reveal transactions SHOULD send their first output. This address is derived from a NUMS (Nothing Up My Sleeve) point using the following procedure:

**Step 1: Hash-to-curve with increment-and-retry.**

```text
counter = 0
loop:
    if counter == 0:
        preimage = "BIP47DB/v1"
    else:
        preimage = "BIP47DB/v1" || byte(counter)
    x = SHA-256(SHA-256(preimage))
    if x < p AND x³ + 7 is a quadratic residue mod p:
        H = lift_x(x) with even y (per BIP-340 convention)
        break
    counter += 1
```

For the string `"BIP47DB/v1"`, counter = 0 produces a valid x-coordinate on the first iteration:

```text
SHA-256(SHA-256("BIP47DB/v1")) =
    ec6038c9b0beeb2b3a93ca441e74cf33b23914eb067cda740684dbd84600dec2
```

This value is less than the secp256k1 field prime *p*, and x³ + 7 (mod *p*) is a quadratic residue, so H is the point with this x-coordinate and even y-coordinate.

**Step 2: Apply BIP-341 taptweak with no script path.**

```text
tweak   = tagged_hash("TapTweak", H.x)
        = 77981f2a13da41675c5423fc302682fe1e9fdd9a012c3c61037746710b4106bc
Q       = H + tweak · G
Q.x     = 9a852377a652b26af6cca30b278dca55c83aadb1a51f21d509a2d69d09b00d0d
```

Where `tagged_hash` is the BIP-340 tagged hash function: `SHA-256(SHA-256(tag) || SHA-256(tag) || msg)`.

**Step 3: Encode as bech32m P2TR address.**

The canonical BIP47DB deposit address is:

```text
bc1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xs99gx5z
```

Because no one knows the discrete logarithm of H, the output key Q is also unspendable. Sats sent to this address are permanently locked.

Implementations MUST derive this exact address. Any deviation indicates a bug in the derivation code. The test vector above provides all intermediate values needed to diagnose implementation differences.

This creates a single, deterministic address that any wallet or indexer can independently compute. Discovery then requires only a standard address history query — the most basic operation any Bitcoin infrastructure supports. Every transaction to this address is a BIP47DB batch. No Ordinals indexer, no MIME type filtering, and no full chain scan is needed.

The two discovery mechanisms are complementary: the MIME content-type serves Ordinals-aware infrastructure, while the canonical address serves any Bitcoin node, Electrum server, or block explorer. Publishers SHOULD use both by inscribing with the correct content-type and directing the reveal transaction’s first output to the canonical address. Indexers SHOULD monitor both channels and deduplicate.

Because the address is provably unspendable, the inscribed sats are permanently locked at this address. This design is deliberately chosen over an anyone-can-spend address (where the private key would be made public) to avoid creating outbound transaction flows from the deposit address. With an unspendable address, there is no possibility of coins flowing from the BIP47DB address to sanctioned or illicit addresses, which would create false on-chain associations for publishers. The deposit address is inflow-only, making it a dead end in the transaction graph that cannot be weaponised for chain analysis tainting or dust poisoning attacks. This adds a small dust-output cost per batch (typically 546 sats, approximately $0.36 at $66,000/BTC) but guarantees that no party can claim control over the deposit address or selectively spend away inscription UTXOs.

## 6. Example Transaction Structure

### 6.1 Inscription Envelope

BIP47DB inscriptions use the standard Ordinals envelope within a taproot witness: <sup>[7]</sup>

```text
Witness:
<tapscript>
OP_FALSE
OP_IF
OP_PUSH "ord" // Ordinals protocol
OP_PUSH 0x01 // content-type tag
OP_PUSH "application/x-bip47db" // custom MIME type
OP_PUSH 0x00 // body separator
OP_PUSH <compressed_chunk_1> // max 520 bytes each
OP_PUSH <compressed_chunk_2>
... // ~870 chunks for 10K records
OP_PUSH <compressed_chunk_N>
OP_ENDIF
```

### 6.2 Transaction Layout

The inscription requires two transactions:

**Commit transaction:** Creates a P2TR (Pay-to-Taproot) output whose script tree contains the inscription envelope. This is a standard single-input, single-output transaction of approximately 150 vBytes.

**Reveal transaction:** Spends the commit output, exposing the full inscription data in the witness. The witness data benefits from the SegWit discount (1 vByte per 4 witness bytes), making large inscriptions economically feasible.

### 6.3 Example: 100-Record Batch

For a batch of 100 payment codes:

| **Parameter**                  | **Value**               |
|--------------------------------|-------------------------|
| Raw body size                  | 100 × 81 = 8,100 bytes  |
| Header + trailer               | 8 + 69 = 77 bytes       |
| Uncompressed total             | 8,177 bytes             |
| Compressed (~45%)              | \~4,497 bytes           |
| Envelope overhead (~6%)        | \~270 bytes             |
| Total witness data             | \~4,767 bytes           |
| Effective vBytes (witness ÷ 4) | \~1,192 vB              |
| Cost at 5 sat/vB               | \~5,960 sats (\~\$3.93) |
| Cost at 20 sat/vB              | \~23,840 sats (\~\$15.73) |

*Costs calculated at \$66,000 USD per BTC.*

## 7. Database Schema and Record Format

### 7.1 Payment Code Record Layout (81 bytes)

Each record in the body comprises an 80-byte raw BIP47 v1 payment code followed by a 1-byte per-record flags field: <sup>[1] [3]</sup>

| **Byte offset** | **Size** | **Field**    | **Description**                                    |
|-----------------|----------|--------------|----------------------------------------------------|
| 0               | 1 byte   | Version      | 0x01 for v1 payment codes                          |
| 1               | 1 byte   | Features     | BIP47 features bit field (0x00 for spec-compliant) |
| 2               | 1 byte   | Sign         | 0x02 or 0x03 (compressed pubkey prefix)            |
| 3–34            | 32 bytes | X value      | Public key x-coordinate on secp256k1               |
| 35–66           | 32 bytes | Chain code   | BIP32 chain code for key derivation                |
| 67–79           | 13 bytes | Reserved     | Zero-filled (reserved for future use)              |
| 80              | 1 byte   | Record flags | Bit 0: Segwit extension; Bits 1–7: reserved        |

### 7.2 Derivable Fields

The following fields are NOT stored on-chain as they are deterministically derivable from each 80-byte payment code:

**Notification address:** Derived by performing BIP32 public derivation at index 0 from the payment code’s public key and chain code, then encoding the resulting public key as a P2PKH address. <sup>[1] [8]</sup>

**Base58Check encoding (PM8T...):** The 80-byte raw code is encoded with version byte 0x47 and a 4-byte checksum suffix. <sup>[3]</sup>

The following fields are NOT stored on-chain as they are server-operator-assigned and not derivable by clients alone:

**PayNym nickname:** Assigned by the PayNym directory server operator. As noted in Section 2.1, the generation process is not purely deterministic and involves the server to ensure collision avoidance. <sup>[4]</sup> Directory operators who reconstruct from BIP47DB data can re-assign nicknames using their own schemes.

**PayNym avatar:** Similarly assigned by the server operator (Robohash for original PayNyms, Pepehash for Ashigaru’s implementation). <sup>[4]</sup> These are generated by the directory operator, not derived client-side.

### 7.3 Logical Database Schema

An indexer reconstructing the full database from BIP47DB inscriptions would materialise the following schema:

**SQLite schema:**

```sql
CREATE TABLE bip47db_batches (
batch_id INTEGER PRIMARY KEY,
inscription_id TEXT NOT NULL, -- Ordinals inscription ID
record_count INTEGER NOT NULL,
block_height INTEGER NOT NULL,
timestamp INTEGER NOT NULL
);
CREATE TABLE bip47db_codes (
code_id INTEGER PRIMARY KEY AUTOINCREMENT,
batch_id INTEGER REFERENCES bip47db_batches(batch_id),
raw_code BLOB NOT NULL, -- 80 bytes (payment code only)
segwit_ext BOOLEAN NOT NULL DEFAULT 0, -- record flags bit 0
payment_code_b58 TEXT GENERATED ALWAYS AS (encode_b58(raw_code)),
notif_address TEXT GENERATED ALWAYS AS (derive_notif_addr(raw_code)),
pubkey_x BLOB GENERATED ALWAYS AS (substr(raw_code, 3, 32)),
first_seen_block INTEGER NOT NULL
);
CREATE INDEX idx_notif_addr ON bip47db_codes(notif_address);
CREATE INDEX idx_pubkey_x ON bip47db_codes(pubkey_x);
```

## 8. Cost Analysis

The following table summarises the cost of inscribing various batch sizes at different fee rates, assuming 45% zlib compression and 6% envelope overhead. All USD figures assume \$66,000 per BTC.

| **Records** | **Raw (bytes)** | **On-chain** | **vBytes** | **@ 1 sat/B** | **@ 20 sat/vB** |
|-------------|-----------------|--------------|------------|---------------|-----------------|
| 100         | 8,177           | 4,767        | 1,192      | \$3.15         | \$15.73          |
| 1,000       | 81,077          | 47,268       | 11,817     | \$31.20        | \$155.98         |
| 5,000       | 405,077         | 236,160      | 59,040     | \$155.87       | \$779.33         |
| 10,000      | 810,077         | 472,275      | 118,069    | \$311.70       | \$1,558.51       |
| 17,500      | 1,417,577       | 826,447      | 206,612    | \$545.46       | \$2,727.28       |

At 1 sat per byte, the entire known PayNym database of approximately 17,500 codes could be inscribed for around \$545. Periodic delta updates of a few hundred new codes would cost just a few dollars each.

## 9. Comparison with the Runes Protocol

The Runes protocol, created by Casey Rodarmor (also the creator of Ordinals), launched in April 2024 as a UTXO-based fungible token standard for Bitcoin. <sup>[9]</sup> It is the most prominent inscription-era data protocol on Bitcoin and provides a useful point of comparison for understanding BIP47DB’s design choices.

### 9.1 How Runes Stores Data

Runes stores its protocol messages (known as “runestones”) in OP_RETURN outputs of Bitcoin transactions. <sup>[9]</sup> Each runestone contains a compact, integer-encoded set of instructions for etching (creating), minting, or transferring rune tokens. The data is encoded as a sequence of (ID, OUTPUT, AMOUNT) tuples using variable-length integers, making the format highly byte-efficient compared to the JSON-based BRC-20 standard it was designed to replace. <sup>[10]</sup>

Runes balances are tracked via the UTXO model: each unspent transaction output can carry a specific quantity of a specific rune. Transfers move rune balances from input UTXOs to output UTXOs within a single transaction. <sup>[9]</sup> The state of all rune balances is computed by off-chain indexers that replay every transaction containing a runestone from the genesis block forward.

### 9.2 A Hypothetical Runes-Style PayNym Registry

If BIP47 payment codes were stored using a Runes-like approach, one could etch a rune representing a “registry token” and use the OP_RETURN field to embed payment code data alongside transfer instructions. However, this would be a misuse of the protocol: Runes is designed for fungible token accounting, not arbitrary data storage. The OP_RETURN field carries integer-encoded transfer tuples, not arbitrary binary payloads.

Alternatively, one could use one OP_RETURN per payment code, encoding each 80-byte code directly in the OP_RETURN output. Standard Bitcoin relay policy limits OP_RETURN to 80 bytes, which happens to exactly fit a single raw payment code but leaves no room for metadata (version, batch number, publisher key). This would require one transaction per payment code — 10,000 transactions for 10,000 codes.

### 9.3 Side-by-Side Comparison

| **Dimension**        | **Runes / OP_RETURN**             | **BIP47DB (Ordinals inscription)**      |
|----------------------|-----------------------------------|-----------------------------------------|
| Storage layer        | OP_RETURN outputs (80-byte limit) | Taproot witness (up to ~400 KB)         |
| Data format          | Varint-encoded integers           | Compressed binary (zlib)                |
| Bytes per record     | 80 bytes (fills entire OP_RETURN) | ~48 bytes (81 raw, compressed, batched) |
| Batching             | Not supported (1 record per tx)   | Thousands per inscription               |
| Txns for 10K records | 10,000 transactions               | 1–3 transactions                        |
| On-chain size (10K)  | ~2.5 MB (txn overhead)            | ~461 KB                                 |
| Cost @ 1 sat/B (10K) | ~\$1,650 (no witness discount)    | ~\$312 (witness discount)               |
| Witness discount     | No (OP_RETURN is not witness)     | Yes (pay 1 vB per 4 witness bytes)      |
| UTXO impact          | Clean (OP_RETURN is prunable)     | Clean (inscription is in witness)       |
| Indexer model        | Replay all txns chronologically   | Decode self-contained batch             |
| Validation           | Protocol-rule-dependent           | secp256k1 curve check                   |
| Discovery            | Scan all OP_RETURNs (no filter)   | Filter by MIME type                     |

### 9.4 Key Differences

**Batching and witness discount:** The most significant difference is that Runes uses OP_RETURN outputs, which are limited to 80 bytes each and do not benefit from the SegWit witness discount. BIP47DB uses Ordinals inscriptions in the taproot witness, which can hold hundreds of kilobytes and pay only 1 vByte per 4 bytes of data. For 10,000 payment codes, this results in roughly a 5x cost difference.

**Indexer model:** Runes indexers must replay every runestone transaction in chronological order to compute current balances, because each transaction modifies UTXO-based state. <sup>[9]</sup> BIP47DB indexers have a simpler task: each batch is self-contained, and records are deduplicated by raw payment code bytes regardless of ordering. There is no concept of a “transfer” — a payment code either exists in the directory or it does not.

**Validation model:** Runes validity depends on protocol rules interpreted by indexers. A malformed runestone (a “cenotaph”) results in all rune balances in the transaction being burned. <sup>[10]</sup> BIP47DB validity is mathematical: a payment code is either a valid secp256k1 point or it is not. No two indexers can disagree on this.

**Discovery:** Runes runestones are identified by scanning all OP_RETURN outputs for a specific magic number prefix. BIP47DB inscriptions are identified by their MIME content-type (application/x-bip47db), which Ordinals indexers already filter and categorise, making discovery trivial without a full chain scan.

### 9.5 Why Not Use Runes?

Runes is an elegant protocol optimised for fungible token lifecycle management: etching, minting, transferring, and burning tokens across UTXOs. <sup>[9]</sup> BIP47 payment codes have none of these lifecycle requirements. They are static public keys that are published once and read many times. They are never transferred, never minted in quantities, and never burned. A purpose-built binary format stored as an Ordinals inscription eliminates the per-transaction overhead, avoids the OP_RETURN size limitation, benefits from the witness discount, and provides a cleaner discovery mechanism via MIME type filtering.

## 10. Client-Side Validation

A critical property of BIP47DB is that every record is independently verifiable without trusting the publisher. Payment codes are validated by checking that the embedded 33-byte compressed public key (sign byte + x-coordinate) represents a valid point on the secp256k1 elliptic curve. <sup>[1] [3]</sup> Specifically:

**1.** The sign byte (offset 2) must be 0x02 or 0x03.

**2.** The x-coordinate (offset 3–34, 32 bytes) must be in the range [1, p−1] where p is the secp256k1 field prime.

**3.** When substituted into the curve equation y² = x³ + 7 (mod p), the result must be a quadratic residue modulo p.

These checks require no network access, no trusted third party, and only basic elliptic curve arithmetic available in any Bitcoin library. Libraries such as tiny-secp256k1 (a WebAssembly-based implementation that works in both browsers and Node.js) can perform these checks with a single function call. Invalid codes (corrupted data, malicious entries, or garbage) are silently discarded. This means anyone — a wallet developer, a directory operator, or an anonymous community member — can publish BIP47DB inscriptions, and the data is trustworthy solely by virtue of mathematical validation.

Additionally, the batch signature (ECDSA, with the publisher’s key recoverable from the signature and recovery flag) allows clients to verify that a batch was published by a known entity, should they choose to filter by publisher reputation. However, this is optional — the data validity rests on secp256k1 verification, not publisher identity.

## 11. Indexer Architecture

Any party can build an indexer that reconstructs the BIP47DB directory from the blockchain. The architecture is straightforward:

### 11.1 Discovery

BIP47DB provides two complementary discovery mechanisms:

**MIME type filtering:** Ordinals-aware indexers (such as ord, Hiro, or Best-in-Slot) can filter inscriptions by content-type application/x-bip47db.

**Canonical deposit address:** All BIP47DB inscriptions SHOULD send their reveal transaction’s first output to the provably unspendable canonical address defined in Section 5.5. Any Bitcoin infrastructure that supports address history queries (Electrum servers, block explorers, full nodes) can discover all BIP47DB batches by simply querying this single address. This removes any dependency on Ordinals-specific indexing.

Indexers SHOULD monitor both channels and deduplicate by content. The canonical address approach is particularly valuable for lightweight clients and wallet implementations that do not have access to an Ordinals indexer.

### 11.2 Decoding Pipeline

```text
1. Fetch inscription content (compressed blob)
2. Decompress with zlib
3. Parse header (8 bytes):
- Verify magic == 0x47DB
- Read format version, record count, flags
4. Parse body (record_count * 81 bytes):
- For each 81-byte record:
a. Extract 80-byte payment code
b. Read 1-byte record flags (Segwit ext, etc.)
c. Validate secp256k1 public key
d. Derive notification address
e. Derive Base58Check payment code string
f. Store in database
5. Verify trailer:
- Checksum: SHA-256(header + body)[:4]
- Recover publisher public key from ECDSA signature + recovery flag
- Verify ECDSA signature against recovered key
```

### 11.3 API Endpoints

A BIP47DB indexer would expose a minimal REST API compatible with existing wallet expectations:

```text
GET /api/v1/code/{notification_address}
-> { payment_code, paynym, batch_id, block_height }
GET /api/v1/code/search?q={partial_paynym_or_code}
-> [{ payment_code, paynym, notification_address }]
GET /api/v1/batch/{batch_number}
-> { inscription_id, record_count, publisher, timestamp }
GET /api/v1/stats
-> { total_codes, total_batches, latest_batch, latest_block }
```

Crucially, anyone can run this indexer. It requires only a Bitcoin full node (or access to an Ordinals indexer) and a modest database. Multiple independent indexers can cross-validate each other, as the underlying data is deterministically derived from the blockchain.

## 12. Wallet Integration

BIP47DB can be integrated into wallet software at two levels: as a consumer of the directory (for recovery), and as a publisher (for registration).

### 12.1 Wallet-Initiated Registration

When a wallet creates a new BIP47 payment code, it could optionally inscribe it on-chain. This provides several models:

**Immediate self-registration:** The wallet creates a BIP47DB inscription containing its single payment code immediately after generating it. This costs approximately \$3–15 depending on fee rates, similar to the existing notification transaction fee. The wallet could even combine this with the claim transaction, adding the inscription data to the same transaction’s witness. However, self-registration carries risks of linking a payment code with the publishing wallet’s address cluster. If the inscription transaction shares inputs with other wallet activity, chain analysis could associate the payment code with the publisher’s on-chain identity. Wallets implementing self-registration should use isolated UTXOs (e.g. coinjoined outputs) for inscription transactions and avoid reusing change addresses.

**Batched self-registration:** Wallets could defer inscription until a community batch is being assembled. A coordinator (which could be any node, not a trusted party) collects payment codes from willing wallets, assembles a batch, and inscribes them in a single transaction. Costs are shared among participants.

**Opt-in at connection time:** Rather than inscribing at creation time, a wallet could include its payment code in a BIP47DB inscription whenever it sends a notification transaction to a new peer. This piggybacks on an existing on-chain action and adds minimal marginal cost.

### 12.2 Ashigaru Integration

Ashigaru Wallet, as the maintainer of the paynym.rs directory and the controller of the paynym.is domain, <sup>[4] [5]</sup> is ideally positioned to integrate BIP47DB:

**Bulk inscription:** Ashigaru could inscribe its entire database of ~17,500 payment codes in a single batch for approximately \$545 at 1 sat/byte, creating a permanent on-chain backup of the directory it laboriously reconstructed from Samourai’s infrastructure.

**Ongoing deltas:** As new PayNyms are claimed through the Ashigaru app, the server could batch new codes and inscribe periodic updates (weekly or monthly), costing just a few dollars per batch.

**Recovery fallback:** The Ashigaru wallet’s “Sync all payment codes” feature could be enhanced to query BIP47DB indexers as a fallback when the primary paynym.rs server is unavailable.

### 12.3 Sparrow Wallet Integration

Sparrow Wallet, as a desktop application that already supports BIP47, <sup>[2]</sup> could integrate BIP47DB as follows:

**Indexer query:** Sparrow already queries PayNym directories to resolve payment codes. Adding BIP47DB indexer endpoints as an additional (or fallback) data source requires minimal code changes — the API returns the same payment code data.

**Local indexing:** As a desktop application with access to a full node (via Electrum server or Bitcoin Core), Sparrow could optionally build a local BIP47DB index, providing fully sovereign PayNym resolution with zero server dependencies.

**Publication:** Sparrow could offer a “Publish to blockchain” button in its PayNym management interface, creating a single-code inscription at the user’s discretion.

### 12.4 BlueWallet Integration

BlueWallet's lack of directory resolution (§3.1) is the most direct demonstration of the gap that BIP47DB is designed to close. The integration shape described below is specified in detail because BIP47DB is particularly well-matched to BlueWallet’s architecture: the wallet already relies on Electrum servers for chain data, and BIP47DB can be queried entirely through the same channel.

**Electrum-based resolution.** BlueWallet could resolve notification addresses to payment codes entirely through its existing Electrum server connection, with no paynym.rs dependency and no new server type. The wallet would issue one `blockchain.scripthash.get_history` request for the canonical BIP47DB deposit address (yielding the txids of every batch transaction), then `blockchain.transaction.get` per txid to retrieve each batch’s witness data. The wallet decodes the BIP47DB inscriptions client-side and builds a local map from notification address to payment code. Subsequent syncs are incremental — only batches whose txids are not already in the local map need to be fetched.

**Privacy property.** Querying an Electrum server about the canonical BIP47DB deposit address reveals only that the user is a BIP47DB consumer, not which specific peers they care about resolving. By contrast, a wallet that queries paynym.rs (or any other directory) for individual notification addresses reveals to that server which peers a user is interested in. The Electrum-based BIP47DB query model is therefore strictly more private than per-address directory lookups.

**Mobile considerations.** Decoding hundreds of compressed batches client-side adds non-trivial CPU and memory cost on a phone. A future Electrum protocol extension could expose pre-decoded BIP47DB indexes to clients (similar to how some Electrum servers expose pre-computed `get_balance` data), reducing client-side work to a simple lookup. Such an extension is not required for a working integration; it is a path for optimisation if mobile sync time becomes a bottleneck.

**Publication.** BlueWallet could also offer users the option to publish their own payment codes via BIP47DB inscriptions, on the models described in §12.1. As a mobile-first wallet, batched coordinator-led inscription is likely a better fit than per-user inscription, since most BlueWallet users will not maintain UTXOs suitable for funding their own commit transactions.

### 12.5 Other Wallet Implementations

Any wallet implementing BIP47 (Stack Wallet, or future implementations) can adopt BIP47DB by adding inscription creation capabilities or by querying public BIP47DB indexers. The protocol imposes no wallet-specific requirements; it operates at the data layer.

### 12.6 Reference Publisher Tool

A reference web application, the BIP47DB Publisher, is available at `bip47db.org/app/`. It implements both the publisher role (assembling, compressing, signing, and inscribing batches) and the indexer role (scanning the canonical deposit address, decoding inscriptions, verifying signatures, and presenting an interface for browsing and search).

The tool is fully client-side. No server is required; payment codes, signing material, and transactions are processed entirely in the browser. To accommodate the lack of any single wallet that supports both BIP47 message signing and arbitrary PSBT signing, the tool uses two wallets in concert: an Ashigaru or Samourai wallet provides BIP47 identity (signing the batch hash via Sign Message), and Sparrow Wallet provides funds (signing the commit PSBT via Tools → Open Transaction). The two wallets need not share keys.

Source is published at `github.com/bip47db/bip47db.github.io` under the MIT licence. The tool is provided as a reference, not as a canonical implementation; alternative publishers and indexers MAY make different choices.

## 13. Directory Operator Integration

If individual wallet users decline to publish their payment codes on-chain (due to cost, complexity, or privacy preferences), directory operators can do so on their behalf. This is a natural extension of the directory operator’s existing role:

**Periodic bulk inscription:** A directory operator (such as Ashigaru’s paynym.rs) would periodically inscribe all newly claimed payment codes as a batch. Since the operator already stores this data in their server database, assembling a BIP47DB batch is trivial.

**User consent model:** Operators could offer users a choice during PayNym claiming: “Publish your payment code to the Bitcoin blockchain for permanent, decentralised backup? This is a one-time action that cannot be undone.” Users who decline still benefit from the centralised directory; users who consent gain blockchain-level persistence.

**Community-funded batches:** A directory operator could accept small donations to fund periodic inscriptions, or use a portion of any fees collected for other services (such as Whirlpool coordination) to subsidise the inscription costs.

**Multiple publishers:** Different directory operators can independently publish overlapping datasets. BIP47DB indexers naturally deduplicate by raw payment code, so redundant entries cause no harm and increase resilience.

## 14. Decentralisation Benefits

BIP47DB provides the following benefits over the current centralised directory model:

**Seizure resistance:** Once inscribed, payment code data cannot be seized, altered, or deleted by any authority. The Samourai seizure demonstrated that server infrastructure is vulnerable to law enforcement action regardless of jurisdiction. <sup>[6]</sup>

**Censorship resistance:** No entity can prevent a payment code from being inscribed or prevent users from reading the blockchain. Directory operators can be pressured to delist entries; the blockchain cannot.

**Redundancy:** Every Bitcoin full node stores the data. There is no single server to suffer hardware failure, data corruption, or denial-of-service attacks.

**Permissionless participation:** Anyone can publish, anyone can index, anyone can query. The protocol does not require permission, registration, or trust in any particular entity.

**Auditability:** The entire history of the directory is publicly verifiable. Backdated entries, silent deletions, or selective censorship are impossible.

**Longevity:** Bitcoin’s blockchain is the most durable data store in existence. Payment codes inscribed today will be readable for as long as the Bitcoin network operates.

## 15. Security Considerations

### 15.1 Privacy

Payment codes are designed to be publicly shareable. <sup>[1]</sup> Publishing them on-chain does not reveal any transaction history, wallet balances, or address relationships. The security of BIP47 derives from the ECDH shared secret between two parties, which requires private keys that are never exposed. Publishing the public payment code is cryptographically equivalent to posting it on a website or social media profile.

However, users should understand that publishing a payment code on-chain permanently associates that code with their identity if their identity is already linked to the code (e.g., via a PayNym username). Users who require absolute unlinkability between their BIP47 identity and any public record should not opt into on-chain publication.

### 15.2 Spam and Pollution

Since anyone can publish a BIP47DB inscription, malicious actors could inscribe invalid or fabricated payment codes. The client-side validation described in Section 10 mitigates this: invalid public keys are rejected, and fabricated-but-valid keys will simply result in payment codes that no one controls. Indexers can further filter by publisher reputation (using the ECDSA signature in the trailer) and by cross-referencing with known notification transactions on-chain.

### 15.3 Replay and Duplication

The same payment code may appear in multiple batches from different publishers. This is expected and harmless — indexers deduplicate by raw payment code bytes. Ordering across a publisher’s batches is provided by Bitcoin block height and transaction position.

When the same payment code appears in multiple batches with different record flags, indexers SHOULD merge flags using bitwise OR. Capability flags (such as the Segwit extension bit) represent permanent wallet properties — once a wallet supports Segwit, it does not lose that capability. A flag set to 1 by any publisher is treated as authoritative, since the absence of a flag in another batch more likely reflects incomplete publisher knowledge than a negative capability assertion. This is consistent with how capability bits work across protocol design generally: they are additive, and any peer advertising a capability is sufficient evidence that it exists.

The OR strategy is further justified by the practical reality of BIP47 Segwit support across wallet implementations. BlueWallet, for example, implements BIP47 but does not set the Samourai Segwit feature flag, yet its default wallet type is Segwit — meaning users can receive to Segwit-derived addresses regardless of the flag’s absence. Ashigaru, unlike the original Samourai Wallet implementation, sends to Segwit-derived addresses regardless of whether the recipient’s payment code includes the Segwit flag, presumably for privacy reasons (Segwit transactions produce a more uniform on-chain footprint). In practice, the Segwit flag has become a vestige of an earlier era when not all wallets supported Segwit. Every major BIP47 implementation today either explicitly signals Segwit capability or implicitly supports it. A false negative (failing to flag Segwit when the wallet supports it) is therefore far more likely than a false positive, and OR-ing the flags corrects for this without introducing trust assumptions about which publisher is authoritative.

### 15.4 Decompression Resource Limits

Because batch payloads are zlib-compressed, indexers MUST protect against decompression bomb attacks where a small inscription expands to consume excessive memory or CPU. A malicious publisher could craft an inscription whose compressed payload is only a few kilobytes (and therefore cheap to inscribe) but expands to gigabytes when decompressed, crashing or hanging any indexer that processes it naively.

Implementations MUST enforce both of the following limits:

- **Maximum uncompressed size: 2 MB (2,097,152 bytes).** This accommodates approximately 25,000 records, which exceeds the entire known PayNym database (~17,500 codes) and is far larger than any realistic incremental batch (which would typically contain hundreds to a few thousand new codes between updates). Any legitimate batch fits comfortably within this limit; anything exceeding it should be treated as hostile and discarded.

- **Maximum compression ratio: 50:1.** Legitimate BIP47DB batches achieve roughly 2:1 compression on payment code data due to the structural redundancy zlib exploits (identical version bytes, common sign byte prefixes, zero-filled padding). Anything above 10:1 is already highly unusual; the 50:1 ceiling provides ample margin for any conceivable optimisation while still blocking pathological zip bomb constructions, which typically achieve ratios of 1000:1 or higher.

Implementations SHOULD use streaming decompression with chunk-based reading and abort decoding immediately when either limit is exceeded, rather than allocating a buffer of unknown size and attempting to decompress in one shot. All major zlib libraries support this pattern: in JavaScript, `pako.Inflate` provides incremental `push()`-based decompression; in Rust, `flate2::read::ZlibDecoder` allows reading into a bounded buffer; in Go, `compress/zlib` returns a `Reader` that can be combined with `io.LimitReader`.

A batch that exceeds either limit MUST be discarded entirely and not partially indexed. The publisher's signature, regardless of validity, does not exempt a batch from these checks — the limits apply to every payload before any cryptographic verification is performed.

## 16. Future Work

**BIP47 v3/v4 support:** Future payment code versions with different byte layouts would require a new flags bit and potentially different record sizes. The format version field in the header accommodates this.

**Connection metadata:** A future extension could optionally store following/follower relationships (encrypted to the relevant parties) to enable full connection recovery. This is considerably more complex and is deferred to a subsequent proposal.

**Notification-free payment channels:** BIP47DB could serve as a foundation for removing the need for notification transactions entirely. If a wallet can query a comprehensive on-chain directory of payment codes, it could derive payment addresses for any listed payment code without first sending a notification transaction. The sender would simply look up the recipient’s payment code from BIP47DB, derive the shared secret and payment addresses locally, and send directly. The recipient’s wallet, also querying BIP47DB, would know to watch for payments from any listed payment code. This would eliminate the notification transaction cost and its associated privacy concerns, though it requires careful consideration of scanning overhead and the trust assumptions involved in relying on the directory for payment channel establishment.

## 17. Conclusion

The seizure of Samourai Wallet’s infrastructure in April 2024 exposed a fundamental contradiction in the BIP47 ecosystem: a decentralised payment protocol dependent on a centralised directory. <sup>[6]</sup> The Ashigaru project’s remarkable effort to reconstruct the PayNym database demonstrated both the value of this data and the fragility of its custodianship. <sup>[4]</sup>

BIP47DB resolves this contradiction by anchoring payment code data to the Bitcoin blockchain itself. At a cost of roughly \$312 for 10,000 records (at 1 sat/byte, \$66,000/BTC), this is not merely feasible — it is inexpensive enough that multiple independent parties could publish overlapping copies, creating a mesh of redundancy that no single seizure, server failure, or censorship action could disrupt.

The protocol is intentionally simple: compressed binary payment codes inscribed with a custom content-type, verifiable with basic elliptic curve arithmetic, and indexable by anyone running a full node. No new consensus rules, no sidechains, no tokens — just data on Bitcoin, available forever.

We invite the Bitcoin privacy community, wallet developers, and directory operators to review, implement, and contribute to this proposal. The code is open, the protocol is permissionless, and the need is clear.

## Appendix A: Reference Implementation (JavaScript)

The following reference implementation uses only plain JavaScript APIs available in modern browsers and Deno/Bun. No Node.js-specific modules (Buffer, crypto, require) are used. The only external dependency is the pako library for zlib compression, which can be loaded from a CDN.

### A.1 Helper Functions

```javascript
// Plain JS helpers — no Node.js Buffer or require
function textToBytes(str) {
return new TextEncoder().encode(str);
}
function bytesToText(bytes) {
return new TextDecoder().decode(bytes);
}
function concat(...arrays) {
const total = arrays.reduce((s, a) => s + a.length, 0);
const result = new Uint8Array(total);
let offset = 0;
for (const arr of arrays) {
result.set(arr, offset);
offset += arr.length;
}
return result;
}
function writeUint32BE(value) {
const buf = new Uint8Array(4);
new DataView(buf.buffer).setUint32(0, value, false);
return buf;
}
function readUint32BE(data, offset) {
return new DataView(
data.buffer, data.byteOffset, data.byteLength
).getUint32(offset, false);
}
async function sha256(data) {
const hash = await crypto.subtle.digest('SHA-256', data);
return new Uint8Array(hash);
}
function bytesToHex(bytes) {
return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
// BIP-137 Bitcoin Signed Message digest
async function bsmDigest(msgHash) {
const msgHex = bytesToHex(msgHash);
const prefix = textToBytes('\x18Bitcoin Signed Message:\n');
const lenByte = new Uint8Array([msgHex.length]); // 0x40 (64)
const preimage = concat(prefix, lenByte, textToBytes(msgHex));
return await sha256(await sha256(preimage));
}
```

### A.2 Encoding a BIP47DB Batch

```javascript
// Requires: pako (e.g. <script src="https://cdn.jsdelivr.net/
// npm/pako@2/dist/pako.min.js"></script>)
const MAGIC = new Uint8Array([0x47, 0xDB]); // 2 bytes
const FORMAT_VERSION = 1;
async function encodeBatch(paymentCodes, recordFlags) {
// Header (8 bytes)
const header = concat(
MAGIC, // 2 bytes
new Uint8Array([FORMAT_VERSION]), // 1 byte
writeUint32BE(paymentCodes.length), // 4 bytes
new Uint8Array([0x01]) // 1 byte flags (bit 0 = v1 codes; set bit 1 for v2)
);
// Body: 81-byte records (80-byte code + 1-byte flags)
const records = paymentCodes.map((code, i) =>
concat(code, new Uint8Array([recordFlags[i] || 0]))
);
const body = concat(...records);
// Trailer
const payload = concat(header, body);
const msgHash = await sha256(payload);
const checksum = msgHash.slice(0, 4);
// ECDSA sign over the BIP-137 digest of the batch hash.
// In practice, publishers paste bytesToHex(msgHash) into their wallet's
// "Sign Message" UI and paste the base64 result back into the publisher
// tool, which decodes it; the call below shows the equivalent library flow.
// Using noble-secp256k1 or equivalent:
// import { sign } from '@noble/secp256k1';
// const digest = await bsmDigest(msgHash);
// const { r, s, recovery } = sign(digest, publisherPrivKey);
const sig = new Uint8Array(64);      // placeholder: r (32) || s (32)
const recoveryFlag = new Uint8Array([0]); // placeholder: v = 0 or 1
const uncompressed = concat(payload, checksum, recoveryFlag, sig);
return pako.deflate(uncompressed, { level: 9 });
}
```

### A.3 Decoding a BIP47DB Batch

```javascript
// Resource limits to prevent decompression bomb attacks
const MAX_UNCOMPRESSED = 2 * 1024 * 1024; // 2 MB
const MAX_RATIO = 50;

async function decodeBatch(compressed, ecc) {
// Enforce maximum compression ratio before decompressing
if (compressed.length * MAX_RATIO < compressed.length) {
throw new Error('Compressed input too large');
}
// Streaming decompression with size limit (using pako.Inflate)
const inflator = new pako.Inflate();
inflator.push(compressed, true);
if (inflator.err) throw new Error('Decompression failed: ' + inflator.msg);
const raw = inflator.result;
if (raw.length > MAX_UNCOMPRESSED) {
throw new Error('Uncompressed payload exceeds 2 MB limit');
}
if (raw.length / compressed.length > MAX_RATIO) {
throw new Error('Compression ratio exceeds 50:1 limit');
}
// Verify magic
if (raw[0] !== 0x47 || raw[1] !== 0xDB)
throw new Error('Invalid magic');
// Parse header (8 bytes)
const version = raw[2];
const count = readUint32BE(raw, 3);
const flags = raw[7];
// Parse body (81 bytes per record)
const codes = [];
let offset = 8;
for (let i = 0; i < count; i++) {
const code = raw.slice(offset, offset + 80);
const recFlags = raw[offset + 80];
offset += 81;
if (isValidPaymentCode(code, ecc)) {
codes.push({ code, segwitExt: !!(recFlags & 0x01) });
}
}
// Verify checksum
const payload = raw.slice(0, 8 + count * 81);
const checksum = raw.slice(offset, offset + 4);
const expected = (await sha256(payload)).slice(0, 4);
for (let i = 0; i < 4; i++) {
if (checksum[i] !== expected[i])
throw new Error('Checksum mismatch');
}
// ECDSA key recovery and signature verification (BIP-137)
const recoveryFlag = raw[offset + 4];    // v = 0 or 1
const signature = raw.slice(offset + 5, offset + 69); // r (32) || s (32)
const msgHash = await sha256(payload);
const digest = await bsmDigest(msgHash);
// Using noble-secp256k1 or equivalent:
// import { recoverPublicKey, verify } from '@noble/secp256k1';
// const publisherKey = recoverPublicKey(digest, signature, recoveryFlag);
// if (!verify(signature, digest, publisherKey))
//     throw new Error('Invalid publisher signature');
return { version, count, codes, flags, recoveryFlag, signature };
}
```

### A.4 secp256k1 Validation

Payment code validation uses the tiny-secp256k1 package, a minimal WebAssembly-based secp256k1 implementation that works in both browsers and Node.js. It can be loaded from a CDN or installed via npm.

```javascript
// Using tiny-secp256k1 for validation
// Browser: <script src="https://cdn.jsdelivr.net/
// npm/tiny-secp256k1@2/lib/index.js"></script>
// Node/Bun: npm install tiny-secp256k1
// import * as ecc from 'tiny-secp256k1';
function isValidPaymentCode(code, ecc) {
// Version check
if (code[0] !== 0x01) return false;
// Sign byte check
if (code[2] !== 0x02 && code[2] !== 0x03)
return false;
// Extract the 33-byte compressed public key
// (sign byte at offset 2 + x-coordinate at offset 3-34)
const compressedKey = code.slice(2, 35);
// Validate that the point is on the secp256k1 curve
return ecc.isPoint(compressedKey);
}
```

### A.5 Querying an Indexer

```javascript
async function recoverOutgoingConnections(notifAddresses) {
const indexers = [
'https://bip47db.example.com/api/v1',
'https://bip47db-backup.example.org/api/v1',
];
const results = [];
for (const addr of notifAddresses) {
for (const base of indexers) {
try {
const res = await fetch(
`${base}/code/${addr}`
);
if (res.ok) {
results.push(await res.json());
break;
}
} catch (e) { continue; }
}
}
return results;
}
```

## Appendix B: Changelog

### v1.6 — 2026-05-03

**No protocol changes.** v1.6 is a documentation correction release. The wire format, signing scheme, deposit address derivation, and decoder behaviour are byte-identical to v1.4 and v1.5. Indexers and publishers built against earlier versions do not need to be updated.

**§3.1 corrections.** The discussion of BIP47 wallet behaviours that complicate recovery has been revised for accuracy. The description of Sparrow Wallet's behaviour was previously phrased in a way that could read as a deliberate design decision, when it was in fact an unintentional gap left by an earlier fix. The text now states this explicitly, notes that the gap is to be addressed in the next Sparrow release, and qualifies the precondition under which the no-notification-transaction path triggers (the user must have been following another PayNym via the server). The recovery options described for BlueWallet users have also been corrected: the previous wording suggested users could resolve missing connections by querying paynym.rs in a browser, which is misleading because BlueWallet has no path to ingest such data. The recovery sentence now correctly states that the user must know each peer's payment code out-of-band and re-establish the connection by sending a fresh notification transaction.

**§3.1 paragraph order corrected.** The Samourai/Ashigaru "refund" paragraph now follows the Sparrow paragraph directly, since both describe wallet behaviours that omit the on-chain notification trail. The BlueWallet paragraph (which describes a separate category — the trail exists, but the wallet has no path to traverse it) now sits as the closing point of §3.1, with its opening sentence framing the contrast explicitly.

**§12.4 opener revised.** The BlueWallet integration section now opens with a callback to §3.1, anchoring BlueWallet as the canonical motivating case for BIP47DB rather than as one wallet among several on the integration list.



**No protocol changes.** v1.5 is a documentation-and-validation release. The wire format, signing scheme, deposit address derivation, and decoder behaviour are byte-identical to v1.4. Indexers and publishers built against v1.4 do not need to be updated.

**Reference publisher tool added (§12.6).** A new subsection documents the reference web-based implementation at `bip47db.org/app/`, with source published under MIT licence at `github.com/bip47db/bip47db.github.io`. The tool implements both publisher and indexer roles entirely client-side and serves as the canonical reference for what a working BIP47DB implementation looks like end-to-end. Wallet authors building their own integrations may use it as a behavioural reference rather than building from the spec alone.

**BlueWallet integration path documented (§3.1, §12.4).** A new paragraph in §3.1 illustrates BlueWallet as a more pronounced instance of the asymmetric recovery problem: a BIP47-supporting wallet that performs no directory lookup at all, leaving users to reconstruct outgoing connections out-of-band or via manual browser queries. A new §12.4 subsection describes an architectural fit specific to BlueWallet's Electrum-backed design — notification addresses can be resolved to payment codes entirely through the wallet's existing Electrum server connection, without any paynym.rs dependency. The privacy property is favourable: querying for the canonical deposit address reveals only that the user is a BIP47DB consumer, not which specific peers are being resolved. Existing §12.4 (Other Wallet Implementations) renumbered to §12.5.

**Cost figures empirically validated (Section 8).** The cost table in §8 was originally calculated from the wire format and an assumed compression ratio. The reference tool has now been used to inscribe production batches on mainnet at 5,000 records per batch, which round-tripped through Bitcoin Core mempool acceptance, miner inclusion, and indexer decoding. The §8 figures are therefore validated rather than purely theoretical at v1.5. The 5,000-record per-batch cap chosen by the reference tool is confirmed to leave adequate standardness headroom (~84,000 weight units below the 400,000 WU mainnet limit) at observed compression ratios.

**Wallet integration sections refreshed (§12.2, §12.3).** The Ashigaru and Sparrow integration descriptions now reflect the empirically-validated two-wallet workflow used by the reference tool: an Ashigaru or Samourai wallet signs the batch hash via BIP-137 Sign Message (providing BIP47 identity), and Sparrow Wallet signs the commit PSBT via Tools → Open Transaction → from text (providing funds). The two wallets need not share keys. No spec changes — these subsections previously described possible integration shapes; v1.5 documents the shape that has been confirmed to work end-to-end.

### v1.4 — 2026-04-23

**Header reduced from 40 bytes to 8 bytes (Sections 4, 5.1, 7.3, 11.2, 15.3, A.2, A.3).** The 32-byte `prev_txid` field has been removed. Cross-batch ordering is provided by Bitcoin block height and transaction position — which every Ordinals indexer already tracks — so an in-payload linkage field was redundant. The SQLite schema in Section 7.3 drops the `prev_txid` column; the decoding pipeline in Section 11.2 no longer contains a "follow the chain" step; the reference encoder and decoder in Appendix A are updated accordingly.

**Cost tables recalculated (Sections 6.3, 8, 9.3).** With header/trailer overhead now 8 + 69 = 77 bytes, savings at current fee rates are marginal — roughly \$0.01 per batch at 1 sat/byte and \$0.05–\$0.07 per batch at 20 sat/vB.

**Signature digest specified as BIP-137 (Sections 5.3, A.1, A.2, A.3).** Previous versions described the batch signature as an ECDSA signature over `SHA-256(header || body)` directly. This did not match how wallets' "Sign Message" functions operate: they wrap the message in BIP-137's Bitcoin Signed Message format and double-SHA-256 the wrapper before signing. The specification now describes BIP-137 as the canonical signing format and shows the exact preimage structure — the ASCII hex representation of `batch_hash` wrapped with the Bitcoin Signed Message prefix and a compact-size length byte. Appendix A.1 adds `bytesToHex` and `bsmDigest` helpers; the reference encoder (A.2) and decoder (A.3) now sign and verify against `bsmDigest(msgHash)` rather than the raw hash. This aligns the specification with reference-implementation practice and lets publishers sign batches from within Sparrow, Electrum, Samourai, Ashigaru, or any tool that exposes Bitcoin Core's `signmessage` function.

### v1.3 — 2026-04-12

**Decompression resource limits (Section 15.4).** Added explicit limits to protect indexers against decompression bomb attacks: maximum uncompressed payload size of 2 MB and maximum compression ratio of 50:1. Reference decoder updated to enforce these limits via streaming decompression with early termination.

### v1.2 — 2026-04-08

**Notification address signing recommendation (Section 5.3).** Publishers who hold a BIP47 payment code SHOULD sign batches using the private key corresponding to their notification address. This creates a cryptographic link between publisher and the BIP47 ecosystem, allowing verification against known payment codes without a separate identity system.

### v1.1 — 2026-04-07

**Signature scheme specified (Sections 5.1, 5.3, 10, 11.2, A.2, A.3).** The batch signature is now explicitly specified as secp256k1 ECDSA with key recovery. The publisher's public key is recovered from the signature and recovery flag rather than stored in the header, keeping the header at 40 bytes. The choice of ECDSA over BIP-340 Schnorr is documented: ECDSA enables key recovery (which BIP-340's key prefixing prevents), has universal library support in all BIP47 wallet implementations, and the security tradeoff is acceptable for publisher attestation. The reference implementation (Appendix A.2, A.3) now includes the recovery flag byte in the trailer, shows the intended `@noble/secp256k1` signing and recovery flow, and returns all parsed fields including `flags`.

**NUMS deposit address fully specified (Section 5.5).** The canonical deposit address derivation is now fully specified with: an increment-and-retry hash-to-curve algorithm with counter byte, even-y parity per BIP-340 convention, BIP-341 taptweak with no script path, and intermediate test vectors at every step. The canonical address is `bc1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xs99gx5z`. Implementations MUST derive this exact address.

**Segwit flag merge strategy (Section 15.3).** When the same payment code appears in multiple batches with different record flags, indexers SHOULD merge flags using bitwise OR. Real-world justification documented: BlueWallet implements BIP47 without setting the Segwit flag yet defaults to Segwit wallets; Ashigaru sends to Segwit-derived addresses regardless of the flag.

**Cost tables recalculated (Sections 6.3, 8, 9.3, 12.2, 17).** All costs recalculated with correct 81 bytes per record and 40 + 69 = 109 byte header/trailer overhead.

### v1.0 — 2026-04-06

Initial publication for community review.

## Appendix C: References

**[1]** Ranvier, J. (2015). *BIP47: Reusable Payment Codes for Hierarchical Deterministic Wallets.* https://github.com/bitcoin/bips/blob/master/bip-0047.mediawiki

*Cited in:* Sections 1, 2.1, 3.1, 7.1, 10, 15.1

**[2]** bitcoiner.guide. *PayNyms.* https://bitcoiner.guide/paynym/

*Cited in:* Sections 1, 2.2, 12.3

**[3]** Bitcoin Wiki. *BIP 0047.* https://en.bitcoin.it/wiki/BIP_0047

*Cited in:* Sections 2.1, 4, 7.1, 7.2, 10

**[4]** Ashigaru Open Source Project (2024). *Announcement: a new PayNym directory.* https://ashigaru.rs/news/announcement-paynyms/

*Cited in:* Sections 2.1, 2.2, 2.3, 3.1, 7.2, 12.2, 17

**[5]** Ashigaru Open Source Project. *Proof of Ownership.* https://ashigaru.rs/proof-of-ownership/

*Cited in:* Sections 2.2, 12.2

**[6]** U.S. Department of Justice (2024). *Founders And CEO Of Cryptocurrency Mixing Service Arrested And Charged With Money Laundering And Unlicensed Money Transmitting Offenses.* Press release, April 24, 2024.

*Cited in:* Sections 2.3, 14, 17

**[7]** Rodarmor, C. (2023). *Ordinals: Inscriptions on Bitcoin.* https://docs.ordinals.com/

*Cited in:* Sections 4, 6.1

**[8]** *BIP32: Hierarchical Deterministic Wallets.* https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki

*Cited in:* Section 7.2

**[9]** Rodarmor, C. (2023). *Runes: A fungible token protocol for Bitcoin.* https://rodarmor.com/blog/runes/

*Cited in:* Sections 9.1, 9.3, 9.4, 9.5

**[10]** Xverse. *What Are Bitcoin Runes? A Beginner’s Guide to the New Token Protocol.* https://www.xverse.app/blog/bitcoin-runes

*Cited in:* Sections 9.1, 9.4

**[11]** paymentcode.io. *BIP47 Interactive Payment Code Explorer.* https://paymentcode.io/

*Cited in:* General reference

**[12]** *BIP44: Multi-Account Hierarchy for Deterministic Wallets.* https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

*Cited in:* General reference

**[13]** sparrowwallet/sparrow, GitHub Issue #617. *In some cases Sparrow doesn’t create BIP47 notification transaction. This may result in loss of funds.* https://github.com/sparrowwallet/sparrow/issues/617

*Cited in:* Section 3.1

**[14]** sparrowwallet/sparrow, GitHub Issue #1982. *Sending to a BIP47 payment code doesn’t require a notification transaction to be made.* https://github.com/sparrowwallet/sparrow/issues/1982

*Cited in:* Section 3.1

**[15]** BlueWallet/BlueWallet, GitHub Pull Request #4520. *[WIP] BIP-47 feature implementation.* https://github.com/BlueWallet/BlueWallet/pull/4520

*Cited in:* Section 3.1

**[16]** linkinparkrulz/BlueWallet, fork at v2.0.0. *Community fork adding PayNym lookup capability absent from upstream BlueWallet.* https://github.com/linkinparkrulz/BlueWallet/tree/v2.0.0

*Cited in:* Section 3.1
