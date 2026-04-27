# BIP47DB Publisher — Web Tool Documentation

## Overview

The BIP47DB Publisher is a client-side web tool for inscribing BIP47 reusable payment codes onto the Bitcoin blockchain using Ordinals inscriptions. All cryptographic operations, transaction construction, and data handling run entirely in the browser — no server-side processing, no data leaves the user's machine.

The tool has two main tabs: **INSCRIBE** (publish payment codes on-chain) and **BROWSE** (view and verify existing inscriptions).

---

## Network Support

The tool supports both **Testnet4** and **Mainnet**, selectable via toggle buttons in the navigation bar. Each network has its own:

- Bitcoin network parameters (address prefixes, BIP32 keys)
- Canonical NUMS deposit address
- mempool.space API endpoint
- IndexedDB database (`bip47db_testnet4` / `bip47db_mainnet`)

Switching to Mainnet requires confirmation ("This uses real bitcoin"). Switching networks resets the inscribe form and clears the browse display since each network has a separate database. There is no cross-contamination between networks.

**Canonical deposit addresses:**

| Network  | Address |
|----------|---------|
| Mainnet  | `bc1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xs99gx5z` |
| Testnet4 | `tb1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xsjd7fwd` |

These are NUMS (Nothing-Up-My-Sleeve) addresses derived from `SHA-256(SHA-256("BIP47DB/v1"))`, used as a Taproot x-only public key with BIP-341 taptweak. All BIP47DB inscriptions are sent to these addresses, which serve as an indexing anchor — anyone can discover all inscriptions by scanning transactions to this address.

---

## INSCRIBE Tab

The inscription process follows six steps. Each step is presented as a card that becomes active as the user progresses.

### Step 1 · Payment Codes to Inscribe

A textarea with a line-numbered gutter where payment codes are entered one per line (PM8T... format). Text wrapping is disabled so line numbers always align with codes on all screen sizes. The textarea also accepts JSON pasted directly — if the content starts with `{` or `[`, it is automatically parsed and codes are extracted.

**Fetching from PayNym.rs:**

The "Fetch from PayNym.rs" button queries the PayNym.rs API (`GET /api/v1/nyms?page=N&limit=200`) via a CORS proxy (`corsproxy.io`). The tool paginates through the API until the requested limit is reached or the API returns no more data.

Two parameters control the fetch:

- **Start from** — the 1-indexed nym record number to begin fetching from. Default is 1. For subsequent batches after inscribing the first set of codes, set this to the record number after the last one fetched (e.g., if the first fetch covered records 1–5000, set Start from to 5001 for the next batch).
- **Limit** — the maximum number of codes to fetch. Default is 200, maximum is 5000 (the per-batch inscription limit).

**Segwit code preference:**

When the API response includes segwit metadata (which PayNym.rs does), the parser applies per-nym filtering:

- If a nym has both a segwit and a non-segwit (legacy) payment code, only the segwit code is extracted.
- If a nym has only a legacy code (no segwit variant), the legacy code is included.
- If no segwit metadata is present (e.g., manually pasted plain PM8T strings), all codes pass through unfiltered.

**Manual JSON paste:**

If the CORS proxy fails (or for users who prefer not to route through a third-party proxy), the "Paste JSON manually" button reveals a secondary textarea. The inline link (`paynym.rs/api/v1/nyms`) dynamically reflects the current "Start from" and "Limit" values — opening it points to the exact API page the tool would query. Users can open that URL in a browser tab, copy the JSON response, and paste it back. The parser handles the PayNym.rs response format: an array of nym objects, each containing a `codes` array of `{code, segwit, claimed}` objects.

**Prepare batch:**

If a previous batch's flow has left artifacts visible (Step 4 hash, Step 5 signature, Step 6 commit PSBT, or the reveal-success block), clicking "Prepare batch" clears them in the same spirit as the "New inscription" button — without touching the codes the user has just loaded, their publisher PM, or the Start from / Limit / Fee rate settings. UTXO fields are cleared (the previous UTXO was spent).

The button then performs four operations in sequence:

1. **Syncs from chain** — queries the canonical deposit address via mempool.space to discover any batches inscribed since the last sync.
2. **Deduplicates** — removes codes that are duplicates within the input, or that are already inscribed on-chain (found in the local IndexedDB).
3. **Filters** — removes unparseable entries.
4. **Trims** — if the remaining codes exceed 5,000 (the maximum per batch), the list is truncated to 5,000.

The status message reports all operations: "✓ 5000 ready to inscribe. 23814 found. 22 already inscribed. 18792 trimmed to batch limit of 5000."

When trimming occurs, the message reports the last record number *included in this batch* (not the last record fetched, which could be much further into the sequence) and suggests the "Start from" value for the next batch. The calculation accounts for codes removed during intra-batch deduplication and the on-chain "already inscribed" filter, so the suggested next-batch start is the record immediately after the last one actually kept.

When the most recent Fetch exhausted the PayNym.rs database (the API returned fewer records than requested), the message surfaces an additional signal:

- If trimming occurred: *"End of PayNym.rs reached — N records remain for subsequent batches."*
- If no trimming occurred: *"End of PayNym.rs reached — no more records to inscribe after this batch."*

This signal is tied to the most recent Fetch action. It is invalidated when the user manually edits the textarea, uses "Paste JSON manually", resets the form, or switches networks.

### Step 2 · Publisher Identity

The publisher enters their own BIP47 payment code (PM8T...). The tool derives:

- The compressed public key (bytes 2–34 of the 80-byte payment code)
- The BIP47 notification address (P2PKH address of the 0th child key derived from the payment code's public key and chain code using `@scure/bip32`)

The notification address is displayed with instructions to sign the payload hash using this address's private key.

### Step 3 · Funding UTXO

The user provides a UTXO they control to fund the commit transaction:

- **UTXO reference** (TXID:VOUT) — with a "Fetch" button that retrieves the raw hex and value from mempool.space
- **Value in sats**
- **Raw transaction hex**
- **Change address**
- **Fee rate** (sats/vB) — with a "Fetch" button that retrieves the current recommended fee rate from mempool.space

All input fields have `autocomplete="off"` to prevent browser autofill interference.

### Step 4 · Generate Signing Request

Clicking "Generate message hash" performs the following:

1. Validates the code count (must be between 1 and 5,000)
2. Parses all payment codes from the textarea
3. Constructs the BIP47DB binary payload:
   - **Header** (8 bytes): magic `0x47DB`, version `0x01`, record count (4 bytes big-endian), flags `0x01`
   - **Body**: N × 81 bytes (80-byte payment code + 1-byte per-record flags)
4. Computes SHA-256 of the header + body concatenation
5. Generates an **ephemeral secp256k1 keypair** (used for the commit/reveal Taproot output; discarded after broadcast)
6. Displays the message hash (hex) for the user to sign

The user is instructed to sign this hash using their BIP47 notification address key via their wallet's "Sign Message" function (BIP-137 format).

### Step 5 · Paste Signature

The user pastes the base64 BIP-137 signature from their wallet. Clicking "Build commit PSBT":

1. Decodes the 65-byte signature (1 header byte + 64 bytes ECDSA)
2. Recovers the public key using secp256k1 key recovery
3. Verifies the recovered key matches the publisher's notification address
4. If verification fails, the error is shown but `buildState` is not mutated — the user can fix the signature and retry without restarting
5. On success, constructs the trailer (4-byte checksum + 1-byte recovery flag + 64-byte signature)
6. Compresses the full payload using zlib (pako)
7. Validates decompression limits (2 MB max, 50:1 max ratio)
8. Splits compressed data into ≤520-byte chunks for Ordinals envelope encoding
9. Constructs the Taproot leaf script with canonical Ordinals envelope (`OP_FALSE OP_IF ... OP_ENDIF`)
10. **Runtime weight check** — estimates the reveal transaction's weight as `script_length + 500 WU` and refuses to proceed if it exceeds 380,000 WU (5% margin under Bitcoin's 400,000 WU standardness limit). This is a belt-and-braces guard behind the static 5,000-record cap: the static cap keeps realistic batches well within standardness, and the runtime check catches any pathological case where compression came out unusually badly on a particular batch. Failing this check before any `buildState` mutation means the user can reduce the record count and retry without restarting.
11. Builds the P2TR commit output
12. Creates the commit PSBT with the funding UTXO as input, the P2TR output, and change

### Step 6 · Sign and Broadcast

The user copies the commit PSBT, signs it in their wallet, broadcasts it, and pastes the commit TXID. At this point there are two paths — direct broadcast, and save-for-later — that share the same signing logic but differ in what happens to the signed hex.

**Broadcast reveal transaction (normal path):**

1. Constructs the reveal transaction spending the commit output
2. Signs the reveal input with the ephemeral key (Schnorr signature)
3. Sets the reveal output to 546 sats sent to the canonical NUMS deposit address
4. Zeroes out and nullifies the ephemeral private key — it's no longer needed, since the signed transaction hex is fully self-contained
5. Broadcasts via mempool.space API
6. On success, displays a link to the transaction and disables the Broadcast and Save buttons to prevent re-signing (which would no longer be possible anyway)
7. A "New inscription" button in the success card resets the entire form for the next batch

**Broadcast failure fallback:**

If signing succeeds but the broadcast request fails (for example, `too-long-mempool-chain` — the mempool is refusing the reveal because the commit transaction is still unconfirmed and Bitcoin Core's default descendant-chain limit of 25 is already saturated by a prior inscription from the same publisher), the signed reveal hex is automatically downloaded to the user's device and displayed on-screen. The user is shown an alert explaining that the reveal has been saved and can be broadcast later from the "Broadcast a previously-saved reveal" section on the same card, once the commit has confirmed. This fallback is critical: because the ephemeral key has already been destroyed by the time the fetch is attempted, a silent broadcast failure would otherwise strand the commit output permanently.

**Save signed reveal for later (explicit path):**

A "Save signed reveal for later" button below the Broadcast button triggers the same sign-and-destroy-key flow, but instead of broadcasting, the signed hex is downloaded as a `.txt` file with comment headers identifying the network, commit TXID, and save timestamp. The hex is also shown inline with a Copy button in case the browser blocks the download or the user wants a second copy channel.

This is the recommended path whenever the user anticipates broadcast problems: for example, when a prior commit from the same publisher is still in the mempool, or when inscribing multiple batches in a short span where each commit will have to fully confirm before the next reveal can relay.

The saved file contains a header like:

```
# BIP47DB signed reveal transaction
# network:     testnet4
# commit txid: 64c20871c66af340fbdffe0e7c284cd760a277a96bcecf87637509772e3b293b
# saved at:    2026-04-24T10:30:45.123Z
# ...
<hex on final line>
```

Filename format: `bip47db-reveal-<network>-<commit-prefix>-<timestamp>.txt`.

**Broadcast a previously-saved reveal:**

A collapsible section at the bottom of the Step 6 card accepts pasted hex (including the commented file contents verbatim — comment lines and whitespace are stripped) and broadcasts it via mempool.space. No wallet signing, no ephemeral key, no `buildState` required — the hex is a complete finalized transaction. This means the broadcast works after a page refresh, browser restart, or even on a different device, provided the user still has the saved file.

**Safety properties:**

- The ephemeral private key never leaves volatile memory and is zeroed immediately after signing. The signed reveal hex does not contain the key, only a Schnorr signature produced from it.
- Anyone with the saved hex file can broadcast the reveal, but the reveal only sends 546 sats to the canonical NUMS deposit address — it has no ability to redirect funds elsewhere, so the "capability" the file represents is limited to completing or not completing this one specific inscription.
- If the user loses the saved file before broadcasting *and* the ephemeral key is no longer in memory (because either the broadcast-with-fallback or save path has run), the commit output is stranded. This is the failure mode the feature exists to prevent. The prominent warning in the success card is deliberate.

---

## BROWSE Tab

### Sync & Index

The "Sync batches" button queries the canonical deposit address on mempool.space, paginating through all transactions. For each transaction:

1. Extracts the Ordinals envelope from the witness data by scanning for the `OP_FALSE OP_IF 0x036f7264` marker
2. Identifies the MIME type (`application/x-bip47db`)
3. Decompresses the payload (zlib via pako)
4. Decodes the batch: header, body (payment codes), and trailer (checksum + signature)
5. Stores decoded batches and individual codes in IndexedDB

**Incremental sync:** only fetches transaction IDs not already in the database. Previously-seen transactions in the mempool are checked for block confirmations and updated accordingly.

**Backward compatibility:** the decoder handles both the current 8-byte header and the legacy 40-byte header (which included a `prev_txid` field) by detecting the header size from the total payload length.

### Signature Verification

Each batch undergoes multi-level verification:

1. **VALID** (green badge) — the 4-byte checksum (SHA-256 of header+body, truncated) matches the trailer. This confirms data integrity.
2. **VERIFIED** (purple badge) — the recovered public key from the ECDSA signature matches a known payment code's notification address, either within the same batch or across all batches in the database. This confirms the publisher's identity.
3. **UNVERIFIED** (yellow badge) — checksum is valid but the recovered key doesn't match any known payment code. The signature is cryptographically valid but the signer is unknown.

The tool attempts both BIP-137 (Bitcoin Signed Message with double-SHA256 prefix) and raw SHA-256 signature recovery to maximise compatibility.

**Cross-batch publisher matching:** after syncing, the tool checks all batches with an unmatched publisher key against every code in the entire database. If a match is found in a different batch, the publisher's payment code is linked and the batch is upgraded to VERIFIED.

### Batch Detail View

Each batch is displayed as a collapsible card with four sub-tabs:

**Codes** — lists all payment codes in the batch. The publisher's own code is marked with a "publisher" badge. Segwit-flagged codes show a "segwit" badge.

**Header / Trailer** — a structured table showing version, record count, flags, header size (with legacy indicator), checksum validity, recovery flag, raw signature hex, signature format (BIP-137 or raw), message hash, publisher pubkey, publisher payment code, and verification status.

**Hex Dump** — an annotated two-column view breaking down every field:
- Header: magic, version, record count, flags (and prev_txid for legacy headers)
- Body: each record individually decoded showing payment code (click-to-copy), version, features, pubkey, chain code, reserved bytes, and record flag
- Trailer: checksum, recovery flag, signature
- A collapsible raw hex view at the bottom

**Verify** — a focused verification view with all fields needed for independent verification: status, message hash, publisher payment code, notification address, base64 signature, and signature format. All fields are click-to-copy with a green toast notification.

### Search

Search by payment code (PM8T...), notification address, or publisher pubkey hex. Results show the matching code, its notification address, block height, and a link to the batch transaction on mempool.space.

### Import / Export / Clear

- **Export DB** — downloads the full IndexedDB contents as a JSON file, named with the current network and timestamp (e.g., `bip47db-testnet4-2026-04-22T19-00-00.json`). The export includes schema version, network, canonical deposit address, and all batches and codes.
- **Import JSON** — loads a previously exported JSON file, merging new batches/codes into the existing database without overwriting duplicates. Reports counts of imported vs skipped records.
- **Clear** — deletes all cached data from IndexedDB (with confirmation dialog).

---

## Technical Details

### Dependencies

| Package | Purpose |
|---------|---------|
| `bitcoinjs-lib` | Bitcoin transaction construction, P2TR, PSBT |
| `tiny-secp256k1` | Elliptic curve operations (WASM) |
| `@noble/secp256k1` | ECDSA signature verification and key recovery |
| `@scure/bip32` | HD key derivation for BIP47 notification addresses |
| `bs58check` | Base58Check encoding/decoding for payment codes |
| `pako` | Zlib compression/decompression |

### Build

The tool is a Vite application. Development:

```bash
npm install
npx vite
```

Production build:

```bash
npx vite build
```

The `dist/` folder contains the static files for deployment.

### Binary Format (v1)

**Header (8 bytes):**

| Offset | Size | Field |
|--------|------|-------|
| 0–1 | 2 | Magic: `0x47DB` |
| 2 | 1 | Version: `0x01` |
| 3–6 | 4 | Record count (big-endian uint32) |
| 7 | 1 | Flags |

**Body (N × 81 bytes):**

Each record is an 80-byte raw BIP47 v1 payment code followed by a 1-byte per-record flags field.

**Trailer (69 bytes):**

| Offset | Size | Field |
|--------|------|-------|
| 0–3 | 4 | Checksum: SHA-256(header ‖ body)[0:4] |
| 4 | 1 | ECDSA recovery flag (0–3) |
| 5–68 | 64 | ECDSA signature (compact, r ‖ s) |

### Limits

| Parameter | Value | Reason |
|-----------|-------|--------|
| Max codes per batch | 5,000 | Bitcoin standardness tops out at 400,000 WU; 5,000 records leaves ample headroom across compression variance |
| Reveal weight safety cap | 380,000 WU | Runtime check before commit; refuses to proceed if the estimated reveal weight would breach the 400,000 WU standardness limit. Acts as a belt-and-braces guard behind the static 5,000-record cap. |
| Max uncompressed size | 2 MB | Decompression safety |
| Max compression ratio | 50:1 | Zip bomb protection |

### CORS Proxy

The PayNym.rs API does not include CORS headers, so browser-based `fetch()` calls are blocked by same-origin policy. The tool routes API requests through `corsproxy.io` as a workaround. Users can bypass this entirely by using the "Paste JSON manually" option.

### IndexedDB Schema

Two object stores per network database:

**`batches`** (keyPath: `txid`) — stores decoded batch metadata including version, count, flags, header size, checksum validity, publisher key, publisher payment code, signature, verification status, block height, and the full raw hex.

Indexes: `blockHeight`, `publisherKey`.

**`codes`** (keyPath: `[batchTxid, paymentCode]`) — stores individual payment codes with their notification address, segwit flag, block height, and publisher key reference.

Indexes: `paymentCode`, `notificationAddress`, `publisherKey`.

---

## Workflow Summary

### Publishing a batch

1. Fetch codes from PayNym.rs (or paste PM8T codes manually)
2. Click "Prepare batch" to deduplicate, sync chain, and trim to 5,000
3. Enter your publisher payment code
4. Provide a funding UTXO and fee rate
5. Generate the message hash
6. Sign the hash with your BIP47 notification address key (in Sparrow, Samourai/Ashigaru, or any BIP-137 compatible wallet)
7. Paste the signature → commit PSBT is generated
8. Sign and broadcast the commit PSBT in your wallet
9. Paste the commit TXID, then either: click "Broadcast reveal transaction" to broadcast immediately (with automatic save-to-file fallback if the mempool rejects), or click "Save signed reveal for later" if a prior commit is still unconfirmed and you want to avoid `too-long-mempool-chain` errors
10. (If saved) broadcast the saved reveal hex via the collapsible section once the commit has confirmed, or via any Bitcoin node / mempool.space's broadcast form
11. For additional batches, set "Start from" to the next record and repeat

### Browsing inscriptions

1. Switch to the BROWSE tab
2. Click "Sync batches"
3. Expand any batch to view codes, headers, hex dumps, and verification details
4. Use Search to find specific payment codes or addresses
5. Export the database for backup or sharing
