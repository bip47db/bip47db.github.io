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

This problem is further compounded by wallet implementations that allow users to send to a BIP47 payment code without first broadcasting a notification transaction. This issue was first identified in Sparrow Wallet shortly after it introduced BIP47 support, where a user could pay directly to a payment code that had already connected *to them* (i.e. where the peer initiated the connection via a notification transaction) without requiring the user to send their own notification transaction in return. <sup>[13]</sup> That specific case was resolved shortly after Sparrow released PayNym support; however, the underlying issue persists in a related form. It remains possible to send to a BIP47 payment code in Sparrow without a notification transaction being created under certain circumstances. <sup>[14]</sup> While this saves the cost of an additional on-chain transaction, it means there is no outgoing notification transaction recorded on the blockchain for the wallet to discover during recovery. If the user subsequently restores their wallet from seed, there is no on-chain evidence that they ever sent payments to that peer’s payment code. The funds are not lost — they remain spendable by the recipient — but the sender’s transaction history becomes incomplete and the outgoing payment channel is invisible to the restored wallet. A decentralised on-chain directory of payment codes, as proposed by BIP47DB, would provide an additional recovery path in this scenario by allowing the wallet to resolve notification addresses to payment codes without depending on the existence of a corresponding outgoing notification transaction.

Additionally, both Samourai and Ashigaru support the ability to "refund" a BIP47 payment back to the original sender without requiring a new notification transaction, since the sender’s payment code was already received via the incoming notification. This further illustrates that not all BIP47 payment flows create the on-chain notification trail that seed-only recovery depends upon.

### 3.2 Single Point of Failure

The PayNym directory at paynym.is was the only widely-used source of this mapping data. Its dependence on centralised infrastructure created a real risk of data loss for thousands of users. While no funds were at risk (the private keys remain with users), the loss of connection metadata means users cannot identify or track their own outgoing transactions without re-establishing connections from scratch.

### 3.3 Centralisation Risk

Even with Ashigaru’s replacement directory at paynym.rs (and their control of the paynym.is domain, which now redirects to it), the fundamental problem remains: any centralised server can be seized, go offline, suffer data corruption, or be denied to users in certain jurisdictions. The BIP47 protocol itself is decentralised, but the directory infrastructure is not.

## 4. Protocol Specification: BIP47DB

BIP47DB is an open protocol for storing BIP47 payment codes on the Bitcoin blockchain via Ordinals inscriptions. <sup>[7]</sup> The protocol has the following properties:

**Permissionless writes:** Anyone can create a BIP47DB inscription. There is no gatekeeper, registration process, or required identity. A wallet, a directory operator, or any community member can publish payment codes.

**Client-side verifiable:** Every payment code in a BIP47DB inscription can be independently validated by checking that the embedded public key is a valid point on the secp256k1 curve. <sup>[3]</sup> Invalid entries are simply discarded by the client.

**Append-only:** Inscriptions are immutable once confirmed. New batches reference previous ones via a chain of inscription IDs, forming a verifiable append-only log.

**Compressed binary encoding:** Payment codes are stored in their raw 80-byte binary form with a 1-byte per-record flags field (81 bytes per record), then batch-compressed with zlib to minimise on-chain footprint. Redundant fields (notification addresses) are not stored, as they are derivable from the payment code. PayNym nicknames and avatars are also omitted, as these are server-operator-assigned identifiers that directory operators can regenerate from the payment code data. The per-record flags field captures implementation-specific extensions such as Segwit support signalling.

## 5. On-Chain Data Format

### 5.1 Batch Structure

Each BIP47DB inscription contains a single compressed binary blob with the following uncompressed structure:

**Header (40 bytes):**

| **Field**      | **Size** | **Description**                                                                                                   |
|----------------|----------|-------------------------------------------------------------------------------------------------------------------|
| Magic          | 2 bytes  | 0x47DB — compact format identifier                                                                                |
| Format version | 1 byte   | Protocol version (currently 0x01)                                                                                 |
| Record count   | 4 bytes  | Number of payment codes in this batch (big-endian uint32)                                                         |
| Flags          | 1 byte   | Bit 0: 1 = v1 codes; Bit 1: 1 = v2 codes; Bits 2–7: reserved                                                      |
| Prev txid      | 32 bytes | Raw txid of the previous batch’s reveal transaction (0x00...00 for first batch). Inscriptions MUST be at index 0. |

*The publisher’s public key is not stored in the header. It is recoverable from the Schnorr signature in the trailer (see Section 5.3), saving 33 bytes per batch.*

### 5.2 Body

The body consists of N concatenated 81-byte records, where N equals the record count field. Each record comprises the 80-byte raw BIP47 payment code followed by a 1-byte per-record flags field:

| **Field**    | **Size** | **Description**                                                                                      |
|--------------|----------|------------------------------------------------------------------------------------------------------|
| Payment code | 80 bytes | Raw BIP47 v1/v2 payment code (version, features, pubkey, chain code, padding)                        |
| Record flags | 1 byte   | Bit 0: Samourai/Ashigaru Segwit extension (features byte signals Segwit support); Bits 1–7: reserved |

The per-record flags byte addresses the Samourai/Ashigaru practice of using a custom features byte to signal Segwit support. The BIP47 spec defines the features byte (offset 1) with all bits as zero except for Bitmessage notification. Samourai extended this by setting a feature bit to indicate the wallet supports receiving to Segwit-derived addresses. This means the same wallet seed can produce two different 80-byte payment codes — one spec-compliant with features byte 0x00, and one with the Segwit flag set. Both contain identical public key material and derive the same notification address. The per-record flags byte allows the canonical spec-compliant payment code to be stored alongside a Segwit capability signal, without duplicating records. Indexers can reconstruct both the standard and extended payment codes from a single 81-byte record.

### 5.3 Trailer

| **Field**     | **Size** | **Description**                                              |
|---------------|----------|--------------------------------------------------------------|
| Checksum      | 4 bytes  | First 4 bytes of SHA-256(header + body)                      |
| Recovery flag | 1 byte   | Schnorr signature recovery byte for publisher key extraction |
| Signature     | 64 bytes | Schnorr signature over SHA-256(header + body)                |

**Total trailer size: 69 bytes**

The publisher’s public key is recovered from the Schnorr signature and recovery flag rather than being stored explicitly in the header. This saves 33 bytes per batch while still allowing clients to verify that a batch was published by a known entity and to filter by publisher reputation.

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
| Header + trailer               | 40 + 69 = 109 bytes     |
| Uncompressed total             | 8,209 bytes             |
| Compressed (~45%)              | \~4,515 bytes           |
| Envelope overhead (~6%)        | \~270 bytes             |
| Total witness data             | \~4,750 bytes           |
| Effective vBytes (witness ÷ 4) | \~1,188 vB              |
| Cost at 5 sat/vB               | \~5,940 sats (\~\$3.92) |
| Cost at 20 sat/vB              | \~23,760 sats (\~\$15.68) |

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
prev_txid BLOB NOT NULL, -- 32-byte raw txid
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
| 100         | 8,150           | 4,750        | 1,188      | \$3.13        | \$15.68         |
| 1,000       | 80,150          | 46,700       | 11,675     | \$30.82       | \$154.10        |
| 5,000       | 400,150         | 233,100      | 58,275     | \$153.85      | \$769.23        |
| 10,000      | 800,150         | 466,100      | 116,525    | \$307.63      | \$1,538.13      |
| 17,500      | 1,400,150       | 815,700      | 203,925    | \$538.36      | \$2,691.80      |

At 1 sat per byte, the entire known PayNym database of approximately 17,500 codes could be inscribed for around \$538. Periodic delta updates of a few hundred new codes would cost just a few dollars each.

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
| On-chain size (10K)  | ~2.5 MB (txn overhead)            | ~466 KB                                 |
| Cost @ 1 sat/B (10K) | ~\$1,650 (no witness discount)    | ~\$308 (witness discount)               |
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

Additionally, the batch signature (Schnorr, with the publisher’s key recoverable from the signature and recovery flag) allows clients to verify that a batch was published by a known entity, should they choose to filter by publisher reputation. However, this is optional — the data validity rests on secp256k1 verification, not publisher identity.

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
3. Parse header (40 bytes):
- Verify magic == 0x47DB
- Read format version, record count, flags
- Read prev_txid (raw txid of prior batch)
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
- Recover publisher key from signature + recovery flag
- Verify Schnorr signature
6. Follow prev_txid chain to link batches
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

**Bulk inscription:** Ashigaru could inscribe its entire database of ~17,500 payment codes in a single batch for approximately \$538 at 1 sat/byte, creating a permanent on-chain backup of the directory it laboriously reconstructed from Samourai’s infrastructure.

**Ongoing deltas:** As new PayNyms are claimed through the Ashigaru app, the server could batch new codes and inscribe periodic updates (weekly or monthly), costing just a few dollars per batch.

**Recovery fallback:** The Ashigaru wallet’s “Sync all payment codes” feature could be enhanced to query BIP47DB indexers as a fallback when the primary paynym.rs server is unavailable.

### 12.3 Sparrow Wallet Integration

Sparrow Wallet, as a desktop application that already supports BIP47, <sup>[2]</sup> could integrate BIP47DB as follows:

**Indexer query:** Sparrow already queries PayNym directories to resolve payment codes. Adding BIP47DB indexer endpoints as an additional (or fallback) data source requires minimal code changes — the API returns the same payment code data.

**Local indexing:** As a desktop application with access to a full node (via Electrum server or Bitcoin Core), Sparrow could optionally build a local BIP47DB index, providing fully sovereign PayNym resolution with zero server dependencies.

**Publication:** Sparrow could offer a “Publish to blockchain” button in its PayNym management interface, creating a single-code inscription at the user’s discretion.

### 12.4 Other Wallet Implementations

Any wallet implementing BIP47 (Stack Wallet, or future implementations) can adopt BIP47DB by adding inscription creation capabilities or by querying public BIP47DB indexers. The protocol imposes no wallet-specific requirements; it operates at the data layer.

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

Since anyone can publish a BIP47DB inscription, malicious actors could inscribe invalid or fabricated payment codes. The client-side validation described in Section 10 mitigates this: invalid public keys are rejected, and fabricated-but-valid keys will simply result in payment codes that no one controls. Indexers can further filter by publisher reputation (using the Schnorr signature in the trailer) and by cross-referencing with known notification transactions on-chain.

### 15.3 Replay and Duplication

The same payment code may appear in multiple batches from different publishers. This is expected and harmless — indexers deduplicate by raw payment code bytes. The batch chain (prev_inscription linkage) provides ordering within a single publisher’s series.

When the same payment code appears in multiple batches with different record flags, indexers SHOULD merge flags using bitwise OR. Capability flags (such as the Segwit extension bit) represent permanent wallet properties — once a wallet supports Segwit, it does not lose that capability. A flag set to 1 by any publisher is treated as authoritative, since the absence of a flag in another batch more likely reflects incomplete publisher knowledge than a negative capability assertion. This is consistent with how capability bits work across protocol design generally: they are additive, and any peer advertising a capability is sufficient evidence that it exists.

The OR strategy is further justified by the practical reality of BIP47 Segwit support across wallet implementations. BlueWallet, for example, implements BIP47 but does not set the Samourai Segwit feature flag, yet its default wallet type is Segwit — meaning users can receive to Segwit-derived addresses regardless of the flag’s absence. Ashigaru, unlike the original Samourai Wallet implementation, sends to Segwit-derived addresses regardless of whether the recipient’s payment code includes the Segwit flag, presumably for privacy reasons (Segwit transactions produce a more uniform on-chain footprint). In practice, the Segwit flag has become a vestige of an earlier era when not all wallets supported Segwit. Every major BIP47 implementation today either explicitly signals Segwit capability or implicitly supports it. A false negative (failing to flag Segwit when the wallet supports it) is therefore far more likely than a false positive, and OR-ing the flags corrects for this without introducing trust assumptions about which publisher is authoritative.

## 16. Future Work

**BIP47 v3/v4 support:** Future payment code versions with different byte layouts would require a new flags bit and potentially different record sizes. The format version field in the header accommodates this.

**Connection metadata:** A future extension could optionally store following/follower relationships (encrypted to the relevant parties) to enable full connection recovery. This is considerably more complex and is deferred to a subsequent proposal.

**Notification-free payment channels:** BIP47DB could serve as a foundation for removing the need for notification transactions entirely. If a wallet can query a comprehensive on-chain directory of payment codes, it could derive payment addresses for any listed payment code without first sending a notification transaction. The sender would simply look up the recipient’s payment code from BIP47DB, derive the shared secret and payment addresses locally, and send directly. The recipient’s wallet, also querying BIP47DB, would know to watch for payments from any listed payment code. This would eliminate the notification transaction cost and its associated privacy concerns, though it requires careful consideration of scanning overhead and the trust assumptions involved in relying on the directory for payment channel establishment.

## 17. Conclusion

The seizure of Samourai Wallet’s infrastructure in April 2024 exposed a fundamental contradiction in the BIP47 ecosystem: a decentralised payment protocol dependent on a centralised directory. <sup>[6]</sup> The Ashigaru project’s remarkable effort to reconstruct the PayNym database demonstrated both the value of this data and the fragility of its custodianship. <sup>[4]</sup>

BIP47DB resolves this contradiction by anchoring payment code data to the Bitcoin blockchain itself. At a cost of roughly \$310 for 10,000 records (at 1 sat/byte, \$66,000/BTC), this is not merely feasible — it is inexpensive enough that multiple independent parties could publish overlapping copies, creating a mesh of redundancy that no single seizure, server failure, or censorship action could disrupt.

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
```

### A.2 Encoding a BIP47DB Batch

```javascript
// Requires: pako (e.g. <script src="https://cdn.jsdelivr.net/
// npm/pako@2/dist/pako.min.js"></script>)
const MAGIC = new Uint8Array([0x47, 0xDB]); // 2 bytes
const FORMAT_VERSION = 1;
async function encodeBatch(paymentCodes, recordFlags,
prevTxid = new Uint8Array(32)) {
// Header (40 bytes)
const header = concat(
MAGIC, // 2 bytes
new Uint8Array([FORMAT_VERSION]), // 1 byte
writeUint32BE(paymentCodes.length), // 4 bytes
new Uint8Array([0x01]), // 1 byte flags
prevTxid // 32 bytes
);
// Body: 81-byte records (80-byte code + 1-byte flags)
const records = paymentCodes.map((code, i) =>
concat(code, new Uint8Array([recordFlags[i] || 0]))
);
const body = concat(...records);
// Trailer
const payload = concat(header, body);
const fullHash = await sha256(payload);
const checksum = fullHash.slice(0, 4);
const signature = new Uint8Array(64); // placeholder
const uncompressed = concat(payload, checksum, signature);
return pako.deflate(uncompressed, { level: 9 });
}
```

### A.3 Decoding a BIP47DB Batch

```javascript
async function decodeBatch(compressed, ecc) {
const raw = pako.inflate(compressed);
// Verify magic
if (raw[0] !== 0x47 || raw[1] !== 0xDB)
throw new Error('Invalid magic');
// Parse header (40 bytes)
const version = raw[2];
const count = readUint32BE(raw, 3);
const flags = raw[7];
const prevTxid = raw.slice(8, 40);
// Parse body (81 bytes per record)
const codes = [];
let offset = 40;
for (let i = 0; i < count; i++) {
const code = raw.slice(offset, offset + 80);
const recFlags = raw[offset + 80];
offset += 81;
if (isValidPaymentCode(code, ecc)) {
codes.push({ code, segwitExt: !!(recFlags & 0x01) });
}
}
// Verify checksum
const payload = raw.slice(0, 40 + count * 81);
const checksum = raw.slice(offset, offset + 4);
const expected = (await sha256(payload)).slice(0, 4);
for (let i = 0; i < 4; i++) {
if (checksum[i] !== expected[i])
throw new Error('Checksum mismatch');
}
return { version, count, codes, prevTxid };
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

## Appendix B: References

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
