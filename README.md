# BIP47DB

**A Decentralised On-Chain Directory for BIP47 Payment Codes**

---

## Overview

BIP47DB is an open protocol for inscribing BIP47 reusable payment codes onto the Bitcoin blockchain using Ordinals inscriptions with compressed binary encoding. It creates a decentralised, censorship-resistant, and publicly verifiable directory of payment codes that eliminates single points of failure in the PayNym ecosystem.

The protocol was motivated by the seizure of Samourai Wallet's infrastructure in April 2024, which exposed the fragility of centralised PayNym directory servers, and the Ashigaru Open Source Project's subsequent effort to reconstruct the database.

## Key Properties

- **Permissionless** — anyone can publish payment codes to the directory
- **Client-side verifiable** — every entry is validated against the secp256k1 curve
- **Censorship resistant** — data lives on the Bitcoin blockchain permanently
- **Cost effective** — ~$156 for a 5,000 record batch at 1 sat/byte ($66K/BTC)
- **Dual discovery** — MIME type filtering + canonical provably-unspendable deposit address

## Repository Structure

```
├── index.html          # Page shell (loads whitepaper.md)
├── whitepaper.md       # Whitepaper content (edit this to contribute)
├── style.css           # Dark theme styling
├── script.js           # TOC generation, copy buttons, scroll spy
├── favicon.svg         # Favicon (SVG)
├── 192x192.png         # App icon (192px)
├── 512x512.png         # App icon (512px)
├── og-image.png        # Social preview image
├── README.md           # This file
├── CONTRIBUTING.md     # How to contribute
└── LICENSE             # MIT License
```

## Contributing

We welcome contributions from the Bitcoin privacy community, wallet developers, and anyone interested in decentralised infrastructure. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Ways to contribute

- **Review the protocol** — identify edge cases, security concerns, or optimisations
- **Improve the writing** — fix errors, clarify language, add missing context
- **Add implementation details** — inscription tooling, indexer code, wallet integration guides
- **Build on it** — create an indexer, integrate into a wallet, or publish a batch

### Quick start

1. Fork this repository
2. Create a branch (`git checkout -b fix/clarify-segwit-extension`)
3. Edit `whitepaper.md` (the whitepaper content)
4. Submit a pull request with a clear description of the change

## Status

**DRAFT** — This whitepaper is under active development and community review. The protocol specification may change based on feedback.

## License

This work is released under the [MIT License](LICENSE).
