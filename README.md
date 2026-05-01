# BIP47DB

**A Decentralised On-Chain Directory for BIP47 Payment Codes**

This repository is the source for the BIP47DB project website at [bip47db.org](https://bip47db.org/). It holds the protocol whitepaper, the Publisher web app, and the documentation, all deployed via GitHub Pages with a custom domain.

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

## What lives here

| Live URL                             | Source                   | Description                                     |
|--------------------------------------|--------------------------|-------------------------------------------------|
| [`bip47db.org/`](https://bip47db.org/)        | `index.html`             | Landing page                                    |
| [`bip47db.org/paper/`](https://bip47db.org/paper/)   | `paper/whitepaper.md`    | Protocol whitepaper (current draft: v1.4)       |
| [`bip47db.org/docs/`](https://bip47db.org/docs/)    | `docs/PUBLISHER.md`      | Publisher app documentation                     |
| [`bip47db.org/app/`](https://bip47db.org/app/)     | `app-src/` → built to `app/` | Publisher web app (inscribe & browse tool)  |

## Repository structure

```
├── index.html          # Landing page
├── favicon.svg         # Favicon (SVG)
├── 192x192.png         # App icon (192px)
├── 512x512.png         # App icon (512px)
├── og-image.png        # Social preview image
├── paper/              # Protocol whitepaper
│   ├── index.html      # Markdown-renderer shell
│   ├── whitepaper.md   # Whitepaper content
│   ├── style.css       # Shared styling (duplicated in docs/)
│   ├── script.js       # TOC, copy buttons, scroll spy (duplicated in docs/)
│   └── *.png, *.svg    # Page icons
├── docs/               # Publisher app documentation
│   ├── index.html      # Markdown-renderer shell
│   ├── PUBLISHER.md    # Documentation content
│   ├── style.css       # Shared styling (duplicated from paper/)
│   ├── script.js       # Shared renderer (duplicated from paper/)
│   └── *.png, *.svg    # Page icons
├── app/                # Built Vite bundle — do not edit directly
│   ├── index.html
│   └── assets/
├── app-src/            # Publisher app source — edit here, rebuild to app/
│   ├── index.html      # App shell
│   ├── main.js         # App logic
│   ├── package.json
│   └── vite.config.js
├── README.md           # This file
├── CONTRIBUTING.md     # How to contribute
└── LICENSE             # MIT License
```

## Contributing

Contributions are welcome from the Bitcoin privacy community, wallet developers, and anyone interested in decentralised infrastructure. The process differs slightly depending on what you're changing — please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

In brief:

- **Protocol changes** edit `paper/whitepaper.md`
- **Documentation changes** edit `docs/PUBLISHER.md`
- **App changes** edit `app-src/`, rebuild, commit source + build together

## Status

**DRAFT** — The protocol specification is at v1.5 and under active community review. The specification may change based on feedback. The Publisher app is functional and has been used for testnet4 inscriptions; mainnet use is at your own risk.

## License

This work is released under the [MIT License](LICENSE).
