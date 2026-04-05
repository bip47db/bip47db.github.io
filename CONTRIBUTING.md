# Contributing to BIP47DB

Thank you for your interest in improving the BIP47DB protocol specification. This document is a community effort and we welcome contributions of all kinds.

## Repository structure

The whitepaper content lives in **`whitepaper.md`** — this is the file most contributors will edit. The site rendering (HTML shell, CSS, JavaScript) is separated into `index.html`, `style.css`, and `script.js` so that content changes don't conflict with design changes.

## How to contribute

### Reporting issues

If you find an error, have a question, or want to suggest an improvement, please [open an issue](https://github.com/bip47db/bip47db.github.io/issues/new). Include as much context as possible.

### Submitting changes

1. **Fork** this repository
2. **Create a branch** with a descriptive name:
   - `fix/typo-in-section-5` for corrections
   - `improve/cost-analysis-assumptions` for content improvements
   - `add/rust-reference-implementation` for new content
3. **Edit `whitepaper.md`** for content changes, or the relevant file for styling/functionality changes
4. **Submit a pull request** with:
   - A clear title describing the change
   - Context on why the change is needed
   - References to any relevant issues

### What we're looking for

- **Protocol review** — Are there edge cases we haven't considered? Security concerns? Optimisations to the binary format?
- **Technical accuracy** — Are the BIP47 specification references correct? Are the cost calculations accurate at current fee rates?
- **Clarity** — Is anything confusing or ambiguous? Could an explanation be improved?
- **Implementation work** — Reference implementations, indexer code, inscription tooling, wallet integration guides
- **Additional comparisons** — Comparisons with other data storage approaches on Bitcoin
- **Real-world testing** — Results from actually inscribing test batches on testnet/mainnet

### Style guide

- Use British English spelling (decentralised, not decentralized)
- Keep technical language precise but accessible
- Reference claims with numbered citations in the format `<sup>[N]</sup>`
- Code samples should be plain JavaScript (browser-compatible, no Node.js-specific APIs)
- Use fenced code blocks with language identifiers (`javascript`, `sql`, `text`)

## Questions?

Open an issue or reach out via OpenPGP email.
