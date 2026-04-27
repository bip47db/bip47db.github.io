# Contributing to BIP47DB

Thank you for your interest in improving BIP47DB. This repository holds four related but distinct things, and the contribution process is slightly different for each. Please read the relevant section below before opening a PR.

## Repository layout

```
/                      Landing page (index.html)
/paper/                Protocol whitepaper (content + rendered site)
/docs/                 Publisher app documentation (content + rendered site)
/app/                  Built publisher web app (static bundle — do not edit directly)
/app-src/              Publisher app source (edit here, rebuild to /app/)
favicon.svg, *.png     Shared icons used across the pages
LICENSE                MIT
README.md              Project overview
CONTRIBUTING.md        This file
```

## Deciding where to contribute

| You want to…                                           | Edit this                           |
|--------------------------------------------------------|-------------------------------------|
| Propose a change to the BIP47DB protocol               | `paper/whitepaper.md`               |
| Fix a typo or improve wording in the whitepaper        | `paper/whitepaper.md`               |
| Document a feature or usage of the Publisher app       | `docs/PUBLISHER.md`                 |
| Change the landing page copy, buttons, or layout       | `index.html`                        |
| Change how the Publisher app behaves                   | `app-src/main.js` (and rebuild)     |
| Change the Publisher app's UI                          | `app-src/index.html`, `app-src/` CSS (and rebuild) |
| Change the styling of paper/docs pages (typography, colours, code blocks) | `paper/style.css` **and** `docs/style.css` (keep in sync) |
| Change the paper/docs rendering behaviour (TOC, copy buttons, scroll spy) | `paper/script.js` **and** `docs/script.js` (keep in sync) |

The stylesheet and renderer are duplicated across `paper/` and `docs/` on purpose — GitHub Pages doesn't handle shared asset folders cleanly, and `../` paths from subfolders get fragile. If you change one, change the other to match. A PR that only updates one copy will get review feedback asking for the other.

## How to contribute

### Reporting issues

If you find an error, have a question, or want to suggest an improvement, please [open an issue](https://github.com/bip47db/bip47db.github.io/issues/new). Include as much context as possible — which page you were on, which file is affected, what you expected versus what happened.

### Submitting changes

1. **Fork** this repository
2. **Create a branch** with a descriptive name following the pattern `<type>/<short-description>`:
   - `fix/typo-in-section-5` for corrections
   - `improve/cost-analysis-assumptions` for content improvements
   - `add/rust-reference-implementation` for new content
   - `app/handle-too-long-mempool-chain` for app behaviour changes
3. **Edit the right files** (see the table above)
4. **For app source changes, rebuild before committing** (see the next section)
5. **Submit a pull request** with:
   - A clear title describing the change
   - Context on why the change is needed
   - References to any relevant issues
   - For app changes, a note confirming you ran the build and tested locally

### Contributing to the publisher app

The app at `/app/` is a built artifact. Editing its files directly won't get merged — they're minified and will be overwritten on the next build. Instead, edit the source in `/app-src/` and rebuild.

The app is a plain Vite project. From the repo root:

```bash
cd app-src
npm install
npm run dev          # local dev server at http://localhost:5173/
```

When you're happy with the change:

```bash
npm run build        # outputs to app-src/dist/
```

Then copy the contents of `app-src/dist/` over the top of `/app/` in the repo root, and commit both the source change and the rebuilt bundle in the same PR. A PR that commits only source without the matching build won't deploy correctly and won't get merged until the build is included.

Before opening the PR, sanity-check that:

- The dev server rendered your change correctly
- `npm run build` completed without warnings you introduced
- The built `/app/index.html` opens in a browser (you can open the built file directly; it doesn't need a server)
- You tested against **testnet4** before assuming it'll work on mainnet — the inscription flow involves broadcasting real transactions and the app's ephemeral-key model means broadcast mistakes can be irrecoverable

Contributors who know their way around GitHub Actions are welcome to propose a CI workflow that auto-builds the app on push so this manual step goes away. Until then, please rebuild manually.

### What we're looking for

For the **protocol**:

- **Protocol review** — edge cases, security concerns, optimisations to the binary format
- **Technical accuracy** — BIP47 references, cost calculations at current fee rates, test vectors
- **Clarity** — anything confusing or ambiguous, explanations that could be improved
- **Additional comparisons** — other data storage approaches on Bitcoin
- **Real-world testing** — results from inscribing test batches on testnet or mainnet

For the **app**:

- **Bug fixes** — broadcast failures, parsing edge cases, UI glitches
- **UX improvements** — clearer error messages, better flow between steps, mobile polish
- **New features** — additional wallet integrations, export formats, verification modes
- **Security review** — any concern about the ephemeral-key handling, signature verification, or reveal transaction construction is especially welcome

For the **docs**:

- **Clarifying missing behaviour** — anything in the app that isn't documented or is documented inaccurately
- **Recovery procedures** — what to do when things go wrong (broadcast failures, lost UTXOs, stuck transactions)
- **Integration guides** — how to use the app alongside specific wallets

## Style guide

Applies to protocol whitepaper, app docs, and landing copy:

- British English spelling (decentralised, not decentralized)
- Technical language should be precise but accessible — a competent Bitcoin developer shouldn't need to look anything up to read it, but it also shouldn't read like a tutorial
- Reference claims with numbered citations in the format `<sup>[N]</sup>`
- Fenced code blocks with language identifiers (`javascript`, `sql`, `text`)

For app source:

- Plain JavaScript, browser-compatible, no Node.js-specific APIs beyond what Vite polyfills
- Match the existing indentation and comment style in `app-src/main.js`
- When adding a comment, explain *why* the code does what it does, not *what* it does — the "what" is usually readable from the code itself
- New dependencies need justification in the PR description; the current dependency set is intentionally minimal

## Questions?

Open an issue or reach out via OpenPGP email.
