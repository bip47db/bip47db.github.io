import { Buffer } from 'buffer';
window.Buffer = Buffer;
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import * as secp256k1 from '@noble/secp256k1';
import { HDKey } from '@scure/bip32';
import pako from 'pako';
import bs58check from 'bs58check';

bitcoin.initEccLib(ecc);

const NETWORKS = {
  testnet4: {
    label: 'Testnet4',
    bitcoin: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'tb',
      bip32: { public: 0x043587cf, private: 0x04358394 },
      pubKeyHash: 0x6f, scriptHash: 0xc4, wif: 0xef,
    },
    canonicalDeposit: 'tb1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xsjd7fwd',
    mempoolApi: 'https://mempool.space/testnet4/api',
    mempoolTx: 'https://mempool.space/testnet4/tx',
    dbName: 'bip47db_testnet4',
  },
  mainnet: {
    label: 'Mainnet',
    bitcoin: {
      messagePrefix: '\x18Bitcoin Signed Message:\n',
      bech32: 'bc',
      bip32: { public: 0x0488b21e, private: 0x0488ade4 },
      pubKeyHash: 0x00, scriptHash: 0x05, wif: 0x80,
    },
    canonicalDeposit: 'bc1pn2zjxaax22ex4akv5v9j0rw22hyr4td3550jr4gf5ttf6zdsp5xs99gx5z',
    mempoolApi: 'https://mempool.space/api',
    mempoolTx: 'https://mempool.space/tx',
    dbName: 'bip47db_mainnet',
  },
};

let currentNet = 'mainnet';
function NET() { return NETWORKS[currentNet]; }

const LEAF_VERSION_TAPSCRIPT = 0xc0;
const MAX_UNCOMPRESSED = 2 * 1024 * 1024;
const MAX_RATIO = 50;
const DB_VERSION = 1;
const MAX_CODES_PER_BATCH = 5000;
const HEADER_SIZE = 8;
const HEADER_SIZE_V1_OLD = 40;
const TRAILER_SIZE = 69;

let buildState = {};

// If the user closes or refreshes the tab while an ephemeral reveal key is
// live in memory (Step 4 generated, Step 6 reveal not yet broadcast-or-saved),
// the key is lost. If they've already broadcast a commit to the P2TR address
// signed by that key, the commit output is permanently stranded — there is
// no backup, by design. Warn them before they do that. Note: modern browsers
// show a generic "Leave site?" prompt; our returned string is not displayed,
// but is required to trigger the prompt at all.
window.addEventListener('beforeunload', (e) => {
  if (buildState.ephPriv) {
    e.preventDefault();
    e.returnValue =
      'You have an active inscription with an in-memory signing key. ' +
      'Refreshing or closing this tab will destroy the key, and if a commit ' +
      'transaction has already been broadcast, its output will be stranded.';
    return e.returnValue;
  }
});
// Set true when the most recent Fetch from PayNym.rs broke out of its loop
// because the API returned fewer records than requested — i.e. we've reached
// the end of the PayNym.rs database. Reset by any action that makes the
// textarea no longer reflect a single clean fetch result (manual edits,
// manual JSON paste, form reset, network switch).
let fetchedAllRemaining = false;

/* ═══════════════════════════════════════════════════════════════
   IndexedDB
   ═══════════════════════════════════════════════════════════════ */

function openDB() {
  return new Promise((ok, no) => {
    const r = indexedDB.open(NET().dbName, DB_VERSION);
    r.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('batches')) {
        const s = db.createObjectStore('batches', { keyPath: 'txid' });
        s.createIndex('blockHeight', 'blockHeight');
        s.createIndex('publisherKey', 'publisherKey');
      }
      if (!db.objectStoreNames.contains('codes')) {
        const s = db.createObjectStore('codes', { keyPath: ['batchTxid', 'paymentCode'] });
        s.createIndex('paymentCode', 'paymentCode');
        s.createIndex('notificationAddress', 'notificationAddress');
        s.createIndex('publisherKey', 'publisherKey');
      }
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
}

async function dbPut(s, v) {
  const db = await openDB();
  return new Promise((ok, no) => {
    const t = db.transaction(s, 'readwrite');
    t.objectStore(s).put(v);
    t.oncomplete = ok;
    t.onerror = () => no(t.error);
  });
}

async function dbGetAll(s) {
  const db = await openDB();
  return new Promise((ok, no) => {
    const t = db.transaction(s, 'readonly');
    const r = t.objectStore(s).getAll();
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
}

async function dbGetByIndex(s, i, v) {
  const db = await openDB();
  return new Promise((ok, no) => {
    const t = db.transaction(s, 'readonly');
    const r = t.objectStore(s).index(i).getAll(v);
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  });
}

async function dbClear() {
  const db = await openDB();
  return new Promise((ok, no) => {
    const t = db.transaction(['batches', 'codes'], 'readwrite');
    t.objectStore('batches').clear();
    t.objectStore('codes').clear();
    t.oncomplete = ok;
    t.onerror = () => no(t.error);
  });
}

/* ═══════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */

function encodePush(d) {
  if (d.length < 0x4c) return Buffer.concat([Buffer.from([d.length]), d]);
  if (d.length <= 0xff) return Buffer.concat([Buffer.from([0x4c, d.length]), d]);
  const b = Buffer.alloc(3);
  b[0] = 0x4d;
  b.writeUInt16LE(d.length, 1);
  return Buffer.concat([b, d]);
}

function pmToB58(r) {
  return bs58check.encode(Buffer.concat([Buffer.from([0x47]), r]));
}

function parsePM(s) {
  const t = s.trim();
  if (/^[0-9a-fA-F]{160}$/.test(t)) return Buffer.from(t, 'hex');
  return Buffer.from(bs58check.decode(t).subarray(1, 81));
}

function pmPubkey(r) { return Buffer.from(r.subarray(2, 35)); }
function pmChainCode(r) { return Buffer.from(r.subarray(35, 67)); }

function bip47Child0(raw80, net) {
  const pk = pmPubkey(raw80), cc = pmChainCode(raw80);
  const vb = Buffer.alloc(4);
  vb.writeUInt32BE(net.bip32.public, 0);
  const xp = bs58check.encode(Buffer.concat([
    vb, Buffer.from([0x03]), Buffer.alloc(4), Buffer.alloc(4), cc, pk,
  ]));
  const hd = HDKey.fromExtendedKey(xp, {
    private: net.bip32.private,
    public: net.bip32.public,
  });
  return Buffer.from(hd.deriveChild(0).publicKey);
}

function bip47Notif(raw80, net) {
  const c = bip47Child0(raw80, net);
  return bitcoin.address.toBase58Check(
    bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(c)),
    net.pubKeyHash,
  );
}

function bsmHash(msg) {
  const p = Buffer.from('\x18Bitcoin Signed Message:\n', 'utf8');
  const m = Buffer.from(msg, 'utf8');
  const v = m.length < 0xfd
    ? Buffer.from([m.length])
    : (() => { const b = Buffer.alloc(3); b[0] = 0xfd; b.writeUInt16LE(m.length, 1); return b; })();
  return bitcoin.crypto.hash256(Buffer.concat([p, v, m]));
}

function decodeSig(b64) {
  const cleaned = b64.trim().replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/]+=*$/.test(cleaned))
    throw new Error('Invalid base64 encoding. Check for typos or extra characters.');
  let b;
  try { b = Buffer.from(cleaned, 'base64'); }
  catch (e) { throw new Error('Base64 decode failed: ' + e.message); }
  if (b.length !== 65)
    throw new Error(`Signature must be exactly 65 bytes (got ${b.length}).`);
  const h = b[0];
  if (h < 27 || h > 34)
    throw new Error(`Invalid signature header byte: ${h}. Expected 27–34.`);
  return { recoveryId: (h - 27) & 3, signature: Buffer.from(b.subarray(1, 65)) };
}

function genEphemeral() {
  let p;
  do { p = Buffer.from(crypto.getRandomValues(new Uint8Array(32))); }
  while (!ecc.isPrivate(p));
  const pk = Buffer.from(ecc.pointFromScalar(p, true));
  return { priv: p, xonly: Buffer.from(pk.subarray(1, 33)) };
}

async function sha256(d) {
  return Buffer.from(await crypto.subtle.digest('SHA-256', d));
}

function showCopied() {
  const t = document.createElement('div');
  t.className = 'copy-toast';
  t.textContent = 'Copied!';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}
window.showCopied = showCopied;

/* ═══════════════════════════════════════════════════════════════
   Network switching
   ═══════════════════════════════════════════════════════════════ */

function switchNetwork(net) {
  currentNet = net;
  buildState = {};

  // Update nav buttons
  document.getElementById('netMainnet').className =
    net === 'mainnet' ? 'net-active-mainnet' : '';
  document.getElementById('netTestnet').className =
    net === 'testnet4' ? 'net-active-testnet' : '';

  // Update banner — shown only on testnet4 as a "funny-money" indicator.
  // Mainnet has no banner (the active nav button already conveys network).
  const banner = document.getElementById('netBanner');
  if (net === 'mainnet') {
    banner.style.display = 'none';
  } else {
    banner.style.display = '';
    banner.className = 'net-banner net-' + net;
    banner.textContent = NET().label;
  }

  // Reset inscribe form
  resetInscribeForm();

  // Clear browse display (different DB)
  document.getElementById('batchList').innerHTML =
    '<div class="empty">Switched to ' + NET().label + '. Click Sync to load batches.</div>';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('searchResult').innerHTML = '';
}

document.getElementById('netMainnet').addEventListener('click', () => {
  if (currentNet === 'mainnet') return;
  switchNetwork('mainnet');
});

document.getElementById('netTestnet').addEventListener('click', () => {
  if (currentNet === 'testnet4') return;
  switchNetwork('testnet4');
});

/* ═══════════════════════════════════════════════════════════════
   Tabs
   ═══════════════════════════════════════════════════════════════ */

document.querySelectorAll('.tab').forEach((b) =>
  b.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-' + b.dataset.tab).classList.add('active');
    if (b.dataset.tab === 'browse') renderFromDb();
  }),
);

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 1: fetch, paste JSON, line numbers
   ═══════════════════════════════════════════════════════════════ */

const CORS_PROXY = 'https://corsproxy.io/?';

// Build the PayNym.rs URL that reflects the current Start from / Limit inputs,
// used (a) as the href of the "Paste JSON manually" link so a user can open the
// right page directly, and (b) in the error-fallback message when the CORS
// fetch fails. The internal perPage is fixed at 200, so we translate startFrom
// to a page number; the user's limit flows through as the `limit` parameter.
function paynymApiUrl() {
  const startFrom = parseInt(document.getElementById('nymStart').value) || 1;
  const limit = parseInt(document.getElementById('nymLimit').value) || 200;
  const page = Math.max(1, Math.ceil(startFrom / 200));
  return `https://paynym.rs/api/v1/nyms?page=${page}&limit=${limit}`;
}

function updatePaynymApiLink() {
  const link = document.getElementById('paynymApiLink');
  if (link) link.href = paynymApiUrl();
}

function extractCodesFromJson(data) {
  const results = [];
  const seen = new Set();

  function addCode(c) {
    if (c && typeof c === 'string' && c.startsWith('PM') && !seen.has(c)) {
      seen.add(c); results.push(c);
    }
  }

  function processEntry(entry) {
    if (typeof entry === 'string') { addCode(entry); return; }
    if (!entry || typeof entry !== 'object') return;
    // Nested codes array (PayNym.rs format: {nymName, codes:[{code, segwit}]})
    if (Array.isArray(entry.codes)) {
      const hasSegwitMeta = entry.codes.some(c => typeof c === 'object' && 'segwit' in c);
      if (hasSegwitMeta) {
        const segwitCodes = [];
        const legacyCodes = [];
        for (const c of entry.codes) {
          if (c && typeof c === 'object') {
            const code = c.code || c.payment_code || null;
            if (code) { (c.segwit ? segwitCodes : legacyCodes).push(code); }
          }
        }
        // Prefer segwit; fall back to legacy if no segwit code exists for this nym
        const toAdd = segwitCodes.length > 0 ? segwitCodes : legacyCodes;
        for (const code of toAdd) addCode(code);
      } else {
        for (const c of entry.codes) {
          if (typeof c === 'string') addCode(c);
          else if (c && typeof c === 'object') addCode(c.code || c.payment_code || null);
        }
      }
      return;
    }
    // Direct code field (no segwit filtering possible)
    addCode(entry.code || entry.payment_code || entry.paymentCode || entry.pcode || null);
  }

  if (Array.isArray(data)) { for (const e of data) processEntry(e); }
  else if (data && typeof data === 'object') {
    const arr = data.codes || data.nyms || data.data || data.results;
    if (Array.isArray(arr)) { for (const e of arr) processEntry(e); }
    else processEntry(data);
  }
  return results;
}

function addCodesToInput(newCodes) {
  const existing = document.getElementById('inputCodes').value.trim();
  const existingSet = new Set(existing ? existing.split('\n').map(l => l.trim()).filter(l => l) : []);
  const filtered = newCodes.filter(c => !existingSet.has(c));
  if (filtered.length) {
    document.getElementById('inputCodes').value =
      existing ? existing + '\n' + filtered.join('\n') : filtered.join('\n');
    updateLineNumbers();
  }
  return { added: filtered.length, dupes: newCodes.length - filtered.length };
}

function updateLineNumbers() {
  const ta = document.getElementById('inputCodes');
  const ln = document.getElementById('lineNumbers');
  const count = Math.max(ta.value.split('\n').length, 1);
  let html = '';
  for (let i = 1; i <= count; i++) html += i + '\n';
  ln.textContent = html;
  ln.scrollTop = ta.scrollTop;
}

document.getElementById('inputCodes').addEventListener('input', () => {
  fetchedAllRemaining = false;
  updateLineNumbers();
});
document.getElementById('inputCodes').addEventListener('scroll', () => {
  document.getElementById('lineNumbers').scrollTop = document.getElementById('inputCodes').scrollTop;
});
updateLineNumbers();

// Keep the "Paste JSON manually" link href in sync with the Start from /
// Limit inputs. Listens on 'input' so typing, stepping, or programmatic value
// changes via dispatchEvent all propagate.
document.getElementById('nymStart').addEventListener('input', updatePaynymApiLink);
document.getElementById('nymLimit').addEventListener('input', updatePaynymApiLink);
updatePaynymApiLink();

// Auto-detect JSON pasted into main textarea
document.getElementById('inputCodes').addEventListener('paste', (e) => {
  setTimeout(() => {
    const val = document.getElementById('inputCodes').value.trim();
    if (val.startsWith('{') || val.startsWith('[')) {
      try {
        const codes = extractCodesFromJson(JSON.parse(val));
        if (codes.length) {
          document.getElementById('inputCodes').value = codes.join('\n');
          updateLineNumbers();
          document.getElementById('dedupResult').innerHTML =
            `<span class="kept">✓ Detected JSON — extracted ${codes.length} payment codes.</span>`;
        }
      } catch (e) { /* not JSON */ }
    }
    updateLineNumbers();
  }, 0);
});

// Fetch via CORS proxy
document.getElementById('btnFetchNyms').addEventListener('click', async () => {
  const res = document.getElementById('dedupResult');
  const limit = parseInt(document.getElementById('nymLimit').value) || 200;
  const startFrom = parseInt(document.getElementById('nymStart').value) || 1;
  const btn = document.getElementById('btnFetchNyms');
  btn.disabled = true;
  btn.textContent = 'Fetching...';
  res.innerHTML = '<span style="color:var(--accent)">Fetching from record ' + startFrom + '...</span>';
  try {
    const allCodes = [];
    const perPage = 200;
    // Start from is 1-indexed nym record number
    // page = ceil(startFrom / perPage), e.g. record 201 → page 2
    let page = Math.ceil(startFrom / perPage);
    // How many records to skip on the first page
    const skipOnFirstPage = (startFrom - 1) % perPage;
    let isFirstPage = true;
    let totalNymsFetched = 0;
    let reachedEnd = false;
    while (allCodes.length < limit) {
      const apiUrl = `https://paynym.rs/api/v1/nyms?page=${page}&limit=${perPage}`;
      const response = await fetch(CORS_PROXY + encodeURIComponent(apiUrl));
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const rawData = await response.json();
      const rawLength = Array.isArray(rawData) ? rawData.length : 0;
      if (rawLength === 0) { reachedEnd = true; break; }
      // Skip records on first page if start offset is mid-page
      let nymsToProcess = rawData;
      if (isFirstPage && skipOnFirstPage > 0) {
        nymsToProcess = rawData.slice(skipOnFirstPage);
        isFirstPage = false;
      }
      totalNymsFetched += nymsToProcess.length;
      const codes = extractCodesFromJson(nymsToProcess);
      for (const c of codes) { allCodes.push(c); if (allCodes.length >= limit) break; }
      if (rawLength < perPage) { reachedEnd = true; break; }
      page++;
    }
    fetchedAllRemaining = reachedEnd;
    if (!allCodes.length) {
      res.innerHTML = '<span class="removed">No codes returned. API format may have changed.</span>';
      return;
    }
    const lastNymRecord = startFrom + totalNymsFetched - 1;
    const { added, dupes } = addCodesToInput(allCodes);
    let msg = `<span class="kept">✓ Fetched ${allCodes.length} codes from ${totalNymsFetched} nyms (records ${startFrom}–${lastNymRecord}), added ${added} new.</span>`;
    if (dupes) msg += ` <span class="removed">${dupes} already in field.</span>`;
    msg += ` <span style="color:var(--text-muted)">Click "Prepare batch" to dedupe and trim to batch size.</span>`;
    res.innerHTML = msg;
  } catch (e) {
    console.error(e);
    res.innerHTML = `<span class="removed">Fetch failed: ${e.message}.</span> ` +
      `<span style="color:var(--text-muted)">Try "Paste JSON manually" — open ` +
      `<a href="${paynymApiUrl()}" target="_blank" style="color:var(--link)">the API</a> ` +
      `in a new tab, copy the response, and paste it.</span>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Fetch from PayNym.rs';
  }
});

// Manual JSON paste toggle + parser
document.getElementById('btnPasteJson').addEventListener('click', () => {
  const area = document.getElementById('jsonPasteArea');
  area.style.display = area.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('btnParseJson').addEventListener('click', () => {
  const res = document.getElementById('dedupResult');
  const raw = document.getElementById('jsonInput').value.trim();
  if (!raw) { res.innerHTML = '<span class="removed">Paste the JSON response first.</span>'; return; }
  try {
    const codes = extractCodesFromJson(JSON.parse(raw));
    if (!codes.length) { res.innerHTML = '<span class="removed">No PM8T codes found in JSON.</span>'; return; }
    fetchedAllRemaining = false; // manual paste invalidates any prior end-of-API signal
    const { added, dupes } = addCodesToInput(codes);
    let msg = `<span class="kept">✓ Parsed ${codes.length} codes, added ${added} new.</span>`;
    if (dupes) msg += ` <span class="removed">${dupes} already in field.</span>`;
    res.innerHTML = msg;
    document.getElementById('jsonInput').value = '';
    document.getElementById('jsonPasteArea').style.display = 'none';
  } catch (e) { res.innerHTML = `<span class="removed">JSON parse error: ${e.message}</span>`; }
});

document.getElementById('btnDedup').addEventListener('click', async () => {
  const res = document.getElementById('dedupResult');
  const btn = document.getElementById('btnDedup');
  const lines = document.getElementById('inputCodes').value
    .split('\n').map((x) => x.trim()).filter((x) => x);
  if (!lines.length) { res.innerHTML = '<span class="removed">No codes.</span>'; return; }

  // If a previous batch's flow has left artifacts visible (hash shown, sig
  // pasted, commit PSBT built, or reveal broadcast), clear them so this new
  // Prepare Batch starts from a clean slate — same spirit as the "New
  // inscription" button. Preserved across the reset: the codes the user just
  // loaded for this batch, the publisher PM (likely reused across batches),
  // fee rate, nymStart, nymLimit, and fetchedAllRemaining (from the latest
  // fetch). Cleared: UTXO fields (previous one was spent) and all Step 4–6
  // fields and card visibilities.
  const priorBatchVisible = ['hashSection', 'sigCard', 'commitPsbtCard', 'revealSection']
    .some((id) => document.getElementById(id).style.display !== 'none');
  if (priorBatchVisible) {
    ['utxoRef', 'utxoValue', 'utxoHex', 'changeAddress',
     'msgToSign', 'sparrowSig', 'psbtOutput', 'commitTxid',
     'savedRevealHex', 'savedRevealInput',
    ].forEach((id) => { document.getElementById(id).value = ''; });
    document.getElementById('savedRevealResult').innerHTML = '';
    ['hashSection', 'sigCard', 'commitPsbtCard', 'revealSection',
     'savedRevealSection',
    ].forEach((id) => { document.getElementById(id).style.display = 'none'; });
    ['btnBroadcastReveal', 'btnSaveReveal'].forEach((id) => {
      document.getElementById(id).disabled = false;
    });
    buildState = {};
  }

  btn.disabled = true; btn.textContent = 'Preparing...';
  res.innerHTML = '<span style="color:var(--accent)">Syncing from chain...</span>';
  try { await syncBatches(); } catch (e) { console.warn('Sync failed, using local DB:', e.message); }

  const norm = [], errs = [];
  // Track lineIdx so we can translate the final kept entry back to its
  // original position in the fetched list — needed for a correct "Start
  // from" suggestion when trimming occurs (otherwise the suggestion skips
  // over the records that were trimmed out of this batch).
  for (let i = 0; i < lines.length; i++) {
    try { norm.push({ pm: pmToB58(parsePM(lines[i])), lineIdx: i }); }
    catch (e) { errs.push(lines[i]); }
  }
  const seen = new Set(), uniq = [];
  for (const n of norm) { if (!seen.has(n.pm)) { seen.add(n.pm); uniq.push(n); } }
  const dup = norm.length - uniq.length;
  const ex = new Set();
  for (const n of uniq) {
    if ((await dbGetByIndex('codes', 'paymentCode', n.pm)).length > 0) ex.add(n.pm);
  }
  const afterDedup = uniq.filter((n) => !ex.has(n.pm));
  const trimmed = afterDedup.length > MAX_CODES_PER_BATCH ? afterDedup.length - MAX_CODES_PER_BATCH : 0;
  const kept = afterDedup.slice(0, MAX_CODES_PER_BATCH);
  document.getElementById('inputCodes').value = kept.map((n) => n.pm).join('\n');
  updateLineNumbers();

  const total = norm.length + errs.length;
  let m = `<span class="kept">✓ ${kept.length} ready to inscribe.</span>`;
  if (total !== kept.length) {
    const parts = [];
    if (dup) parts.push(`${dup} duplicates`);
    if (ex.size) parts.push(`${ex.size} already inscribed`);
    if (trimmed) parts.push(`${trimmed} trimmed to batch limit of ${MAX_CODES_PER_BATCH}`);
    if (errs.length) parts.push(`${errs.length} unparseable`);
    m += ` <span class="removed">${total} found. ${parts.join('. ')}.</span>`;
  }
  if (trimmed && kept.length > 0) {
    const nextStart = parseInt(document.getElementById('nymStart').value) || 1;
    // kept preserves object refs through uniq / afterDedup / slice, so
    // kept[last].lineIdx is the 0-based position in the fetched list of the
    // final record included in this batch. Translate to 1-based record:
    //   record = nextStart + lineIdx
    // Next batch starts from the record AFTER that.
    const lastKeptLineIdx = kept[kept.length - 1].lineIdx;
    const lastRecord = nextStart + lastKeptLineIdx;
    m += ` <span style="color:var(--text-muted)">Last record in batch: ${lastRecord}. Set "Start from" to ${lastRecord + 1} for the next batch.</span>`;
  }
  if (fetchedAllRemaining) {
    if (trimmed) {
      m += ` <span class="kept">End of PayNym.rs reached — ${trimmed} record${trimmed === 1 ? '' : 's'} remain for subsequent batches.</span>`;
    } else {
      m += ` <span class="kept">End of PayNym.rs reached — no more records to inscribe after this batch.</span>`;
    }
  }
  res.innerHTML = m;
  btn.disabled = false; btn.textContent = 'Prepare batch';
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 2: publisher info
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('publisherPM').addEventListener('input', (e) => {
  const info = document.getElementById('pubInfo'), s = e.target.value.trim();
  if (!s) { info.style.display = 'none'; return; }
  try {
    const r = parsePM(s), pk = pmPubkey(r), na = bip47Notif(r, NET().bitcoin);
    info.innerHTML = `<strong>Pubkey:</strong> <code>${pk.toString('hex')}</code><br>` +
      `<strong>Notification address:</strong> <code>${na}</code><br>` +
      `<span style="color:var(--yellow)">Sign the payload hash with this address.</span>`;
    info.style.display = 'block';
  } catch (err) {
    info.innerHTML = `<span style="color:var(--red)">${err.message}</span>`;
    info.style.display = 'block';
  }
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 3: UTXO fetch + fee fetch
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('btnFetch').addEventListener('click', async () => {
  const ref = document.getElementById('utxoRef').value.trim();
  if (!ref.includes(':')) return alert('Format: TXID:VOUT');
  const [txid, vout] = ref.split(':');
  try {
    const hex = await (await fetch(`${NET().mempoolApi}/tx/${txid}/hex`)).text();
    const tx = await (await fetch(`${NET().mempoolApi}/tx/${txid}`)).json();
    document.getElementById('utxoHex').value = hex;
    document.getElementById('utxoValue').value = tx.vout[parseInt(vout)].value;
    alert('Fetched!');
  } catch (e) { alert('Fetch failed.'); }
});

document.getElementById('btnFetchFee').addEventListener('click', async () => {
  try {
    const res = await fetch(`${NET().mempoolApi}/v1/fees/recommended`);
    const fees = await res.json();
    // Clamp to the same 1000 sat/vB ceiling enforced at build-commit time so
    // the displayed value is always usable.
    const recommended = fees.fastestFee || fees.halfHourFee || 1;
    document.getElementById('feeRate').value = Math.min(recommended, 1000);
  } catch (e) { alert('Failed to fetch fee rate.'); }
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 4: generate hash + ephemeral key
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('btnGenerateHash').addEventListener('click', async () => {
  try {
    const cl = document.getElementById('inputCodes').value
      .split('\n').map((x) => x.trim()).filter((x) => x);
    if (!cl.length) throw new Error('No codes');
    if (cl.length > MAX_CODES_PER_BATCH) throw new Error(
      `Too many codes: ${cl.length}. Maximum ${MAX_CODES_PER_BATCH} per batch due to Bitcoin transaction size limits. Split into ${Math.ceil(cl.length / MAX_CODES_PER_BATCH)} batches.`);
    const pm = document.getElementById('publisherPM').value.trim();
    if (!pm) throw new Error('Publisher code required');
    // Step 3 field presence checks. Mirrors the Publisher code pattern above
    // — each check names its own field so the user knows what to fix. Format
    // validation (TXID:VOUT shape, numeric ranges) stays downstream.
    const utxoRef = document.getElementById('utxoRef').value.trim();
    if (!utxoRef) throw new Error('UTXO reference required (txid:vout)');
    const utxoValue = document.getElementById('utxoValue').value.trim();
    if (!utxoValue) throw new Error('UTXO value required (sats)');
    const utxoHex = document.getElementById('utxoHex').value.trim();
    if (!utxoHex) throw new Error('Raw transaction hex required');
    const changeAddress = document.getElementById('changeAddress').value.trim();
    if (!changeAddress) throw new Error('Change address required');
    const feeRate = document.getElementById('feeRate').value.trim();
    if (!feeRate) throw new Error('Fee rate required (sats/vB)');
    const pr = parsePM(pm), pp = pmPubkey(pr);
    const rawCodes = cl.map(parsePM);

    const header = Buffer.alloc(HEADER_SIZE);
    header[0] = 0x47; header[1] = 0xDB; header[2] = 0x01;
    header.writeUInt32BE(rawCodes.length, 3);
    header[7] = 0x01;

    const body = Buffer.concat(rawCodes.map((c) =>
      Buffer.concat([c, Buffer.from([0x00])])));
    const hAndB = Buffer.concat([header, body]);
    const msgHash = await sha256(hAndB);
    const eph = genEphemeral();

    buildState = { rawCodes, header, body, msgHash, publisherPubkey: pp,
      ephPriv: eph.priv, ephXonly: eph.xonly };

    document.getElementById('msgToSign').value = msgHash.toString('hex');
    document.getElementById('hashSection').style.display = 'block';

    const na = bip47Notif(pr, NET().bitcoin);
    document.getElementById('signInstructions').innerHTML =
      `<strong>Ephemeral key generated.</strong><br><br>` +
      `<strong>Sign the hash with your notification address:</strong><br>` +
      `1. Open your Ashigaru or Samourai wallet. Sign Message using the BIP47 notification address private key.<br>` +
      `2. Address: <code>${na}</code><br>` +
      `3. Paste the hash above as the message<br>` +
      `4. Copy the base64 signature → Step 5`;
    document.getElementById('sigCard').style.display = 'block';
  } catch (e) { console.error(e); alert(e.message); }
});

document.getElementById('btnCopyHash').addEventListener('click', () => {
  document.getElementById('msgToSign').select();
  document.execCommand('copy');
  showCopied();
});

document.getElementById('btnCopyPsbt').addEventListener('click', () => {
  document.getElementById('psbtOutput').select();
  document.execCommand('copy');
  showCopied();
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 5: verify sig, build commit PSBT
   (doesn't mutate buildState until success → retryable)
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('btnBuildCommit').addEventListener('click', async () => {
  try {
    const b64 = document.getElementById('sparrowSig').value.trim();
    if (!b64) throw new Error('Paste signature');
    if (!buildState.msgHash) throw new Error('Complete Step 4');

    const { recoveryId, signature } = decodeSig(b64);
    const mhHex = buildState.msgHash.toString('hex');
    const sh = bsmHash(mhHex);
    const sig = secp256k1.Signature.fromCompact(signature).addRecoveryBit(recoveryId);
    const rp = Buffer.from(sig.recoverPublicKey(sh).toRawBytes(true));
    const ra = bitcoin.address.toBase58Check(
      bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(rp)), NET().bitcoin.pubKeyHash);
    const pm = document.getElementById('publisherPM').value.trim();
    const pr = parsePM(pm);
    const ena = bip47Notif(pr, NET().bitcoin);
    if (ra !== ena)
      throw new Error(
        `Signature verification failed.\nRecovered address: ${ra}\nExpected address: ${ena}\n\nFix the signature in Step 5 and try again.`);

    // Build everything into locals first
    const trailer = Buffer.concat([
      buildState.msgHash.subarray(0, 4),
      Buffer.from([recoveryId]),
      signature,
    ]);
    const unc = Buffer.concat([buildState.header, buildState.body, trailer]);
    if (unc.length > MAX_UNCOMPRESSED) throw new Error('>2MB');
    const comp = Buffer.from(pako.deflate(unc, { level: 9 }));
    if (unc.length / comp.length > MAX_RATIO) throw new Error('>50:1');

    const chunks = [];
    for (let i = 0; i < comp.length; i += 520)
      chunks.push(Buffer.from(comp.subarray(i, i + 520)));

    const prefix = bitcoin.script.compile([
      buildState.ephXonly, bitcoin.opcodes.OP_CHECKSIG,
    ]);
    const env = Buffer.concat([
      Buffer.from([0x00, 0x63]),
      encodePush(Buffer.from('ord')),
      encodePush(Buffer.from([0x01])),
      encodePush(Buffer.from('application/x-bip47db')),
      encodePush(Buffer.from([0x00])),
      ...chunks.map((c) => encodePush(c)),
      Buffer.from([0x68]),
    ]);
    const ls = Buffer.concat([prefix, env]);

    // Runtime weight check. The reveal transaction is dominated by the
    // leaf script in the witness; overall weight ≈ ls.length + ~500 WU
    // of fixed tx overhead. Bitcoin standardness tops out at 400,000 WU,
    // and broadcast failure here is unrecoverable because the ephemeral
    // reveal key is about to be discarded — so refuse with 5% margin.
    const MAX_REVEAL_WEIGHT = 380_000;
    const estRevealWeight = ls.length + 500;
    if (estRevealWeight > MAX_REVEAL_WEIGHT) {
      throw new Error(
        `Batch too large: estimated reveal weight ${estRevealWeight} WU ` +
        `exceeds the ${MAX_REVEAL_WEIGHT} WU safety limit ` +
        `(Bitcoin standardness is 400000 WU). ` +
        `Reduce the number of payment codes and try again.`);
    }

    const p2tr = bitcoin.payments.p2tr({
      internalPubkey: buildState.ephXonly,
      scriptTree: { output: ls },
      redeem: { output: ls, redeemVersion: LEAF_VERSION_TAPSCRIPT },
      network: NET().bitcoin,
    });
    if (!p2tr.address || !p2tr.output || !p2tr.witness) throw new Error('P2TR failed');

    const tapLeaf = {
      leafVersion: LEAF_VERSION_TAPSCRIPT,
      script: ls,
      controlBlock: p2tr.witness[p2tr.witness.length - 1],
    };
    const fr = parseFloat(document.getElementById('feeRate').value);
    // Belt-and-braces guard. The HTML input has max="1000" but that only
    // fires on form submission, which the tool never does. A user could
    // paste a higher value or have it set programmatically. 1000 sat/vB
    // is already ~50× current typical mainnet rates and would make a
    // 5,000-record batch cost north of $5,000 — almost certainly a typo.
    if (!isFinite(fr) || fr <= 0) throw new Error('Fee rate must be a positive number');
    if (fr > 1000) throw new Error('Fee rate is capped at 1000 sat/vB. If you really need a higher rate, edit the cap in the source.');
    const rvs = 160 + Math.ceil(ls.length / 4);
    const rf = Math.ceil(rvs * fr);
    const commitAmt = 546 + rf;
    const commitFee = Math.ceil(155 * fr);

    const psbt = new bitcoin.Psbt({ network: NET().bitcoin });
    const [txid, vout] = document.getElementById('utxoRef').value.trim().split(':');
    const uv = parseInt(document.getElementById('utxoValue').value);
    const ca = uv - commitAmt - commitFee;
    if (ca < 546)
      throw new Error(`UTXO too small: need ${commitAmt + commitFee + 546}, got ${uv}`);

    psbt.addInput({
      hash: txid,
      index: parseInt(vout),
      nonWitnessUtxo: Buffer.from(document.getElementById('utxoHex').value.trim(), 'hex'),
    });
    psbt.addOutput({ address: p2tr.address, value: commitAmt });
    psbt.addOutput({
      address: document.getElementById('changeAddress').value.trim(),
      value: ca,
    });

    // Only now commit to buildState
    buildState.p2tr = p2tr;
    buildState.tapLeafScript = tapLeaf;
    buildState.commitAmt = commitAmt;
    buildState.commitFee = commitFee;

    document.getElementById('psbtOutput').value = psbt.toBase64();
    document.getElementById('commitPsbtCard').style.display = 'block';
  } catch (e) { console.error(e); alert('Build error: ' + e.message); }
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Step 6: broadcast reveal
   ═══════════════════════════════════════════════════════════════ */

// Build & sign the reveal transaction from the current buildState and the
// pasted commit TXID. Returns the signed tx hex. MUTATES buildState.ephPriv
// (zeroed and nulled) — so this can only be called ONCE per inscription cycle.
// Callers are either "broadcast now" or "save for later"; both paths converge
// here so the two code paths can never drift.
function buildAndSignReveal() {
  const ct = document.getElementById('commitTxid').value.trim();
  if (!ct || !/^[0-9a-fA-F]{64}$/.test(ct)) throw new Error('Invalid TXID');
  if (!buildState.p2tr || !buildState.ephPriv) {
    // Diagnose WHY the active inscription state is missing and suggest the
    // right recovery path. The three scenarios that land here in practice:
    //   A) Tab was refreshed since Steps 4–5 were completed (all state gone).
    //   B) A previous broadcast or save-for-later has already consumed the
    //      ephemeral key in THIS tab (p2tr set, ephPriv null).
    //   C) User jumped to Step 6 without completing Steps 4 or 5 (nothing set).
    // Having a signed reveal file from a prior session is the appropriate fix
    // only for B, and only if the user actually saved the hex.
    const hasP2tr = !!buildState.p2tr;
    const keyConsumed = hasP2tr && !buildState.ephPriv;
    if (keyConsumed) {
      throw new Error(
        'Reveal already signed — the ephemeral key has been consumed and ' +
        'cannot sign a second reveal transaction.\n\n' +
        'If you saved the hex earlier, paste it into "Broadcast a previously-' +
        'saved reveal" below. If you did not save it and the broadcast did ' +
        'not succeed, the commit output is unfortunately stranded — you will ' +
        'need to start a fresh inscription (new Step 4, new commit UTXO).');
    }
    throw new Error(
      'No active inscription state. This usually means the tab was refreshed ' +
      'after completing Steps 4 and 5, which wipes the ephemeral signing key ' +
      'from memory.\n\n' +
      'If you already broadcast a commit transaction for this inscription, ' +
      'its output cannot be spent without the matching ephemeral key. You ' +
      'will need to start a fresh inscription: go back to Step 4 (Generate ' +
      'message hash), then Step 5 (Build commit PSBT) with a new funding UTXO, ' +
      'and broadcast the new commit.\n\n' +
      'If you saved the signed reveal hex to a file before refreshing, paste ' +
      'it into "Broadcast a previously-saved reveal" below — that path does ' +
      'not need buildState.');
  }

  const psbt = new bitcoin.Psbt({ network: NET().bitcoin });
  psbt.addInput({
    hash: ct, index: 0,
    witnessUtxo: { value: buildState.commitAmt, script: buildState.p2tr.output },
    tapLeafScript: [buildState.tapLeafScript],
  });
  psbt.addOutput({ address: NET().canonicalDeposit, value: 546 });
  psbt.signInput(0, {
    publicKey: Buffer.concat([Buffer.from([0x02]), buildState.ephXonly]),
    signSchnorr: (h) => Buffer.from(ecc.signSchnorr(h, buildState.ephPriv)),
  });
  psbt.finalizeInput(0);

  const hex = psbt.extractTransaction().toHex();

  // Zero ephemeral key now — regardless of whether we're about to broadcast
  // or hand the user a saved hex. The signed hex is fully self-contained, so
  // the key is no longer needed for either path, and keeping it around is
  // pure risk.
  buildState.ephPriv.fill(0);
  buildState.ephPriv = null;

  return { hex, commitTxid: ct };
}

// Offer a signed reveal hex as a downloadable file to the user. Called from
// both the explicit "Save signed reveal for later" button and the broadcast
// fallback path. Inline display of the hex is handled by the caller.
function offerSignedRevealDownload(hex, commitTxid) {
  const net = (typeof currentNet !== 'undefined' && currentNet) || 'bitcoin';
  const ts = new Date().toISOString().replace(/[:.]/g, '-').replace(/T/, '_').slice(0, 19);
  const filename = `bip47db-reveal-${net}-${commitTxid.slice(0, 8)}-${ts}.txt`;
  const fileBody =
    `# BIP47DB signed reveal transaction\n` +
    `# network:     ${net}\n` +
    `# commit txid: ${commitTxid}\n` +
    `# saved at:    ${new Date().toISOString()}\n` +
    `# \n` +
    `# Broadcast this hex to the Bitcoin network (bitcoin-cli sendrawtransaction,\n` +
    `# mempool.space's broadcast form, or the "Broadcast a previously-saved reveal"\n` +
    `# section of the BIP47DB publisher) once the commit transaction has confirmed.\n` +
    `\n${hex}\n`;
  const blob = new Blob([fileBody], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('btnBroadcastReveal').addEventListener('click', async () => {
  let signed;
  try {
    signed = buildAndSignReveal();  // consumes ephPriv
  } catch (e) {
    console.error(e);
    alert('Broadcast error: ' + e.message);
    return;
  }

  // Signing succeeded — key has been destroyed, hex is self-contained.
  // If the broadcast itself fails (e.g. too-long-mempool-chain because
  // the commit is still unconfirmed), we MUST surface the signed hex to
  // the user, because they can still broadcast it later but we can no
  // longer regenerate it. Silent loss here would strand the commit.
  try {
    const res = await fetch(`${NET().mempoolApi}/tx`, { method: 'POST', body: signed.hex });
    const txt = await res.text();
    if (!res.ok) throw new Error(txt);

    document.getElementById('revealLink').href = `${NET().mempoolTx}/${txt}`;
    document.getElementById('revealLink').innerText = `View: ${txt}`;
    document.getElementById('revealSection').style.display = 'block';
    document.getElementById('btnBroadcastReveal').disabled = true;
    document.getElementById('btnSaveReveal').disabled = true;
  } catch (e) {
    console.error(e);
    // Auto-fallback to save-for-later so the user doesn't lose the signed
    // hex to a transient broadcast failure.
    offerSignedRevealDownload(signed.hex, signed.commitTxid);
    document.getElementById('savedRevealHex').value = signed.hex;
    document.getElementById('savedRevealSection').style.display = 'block';
    document.getElementById('btnBroadcastReveal').disabled = true;
    document.getElementById('btnSaveReveal').disabled = true;
    alert(
      'Broadcast failed: ' + e.message + '\n\n' +
      'The signed reveal has been saved to a file and is shown on-screen. ' +
      'Broadcast it later using the "Broadcast a previously-saved reveal" ' +
      'section below, once the commit transaction has confirmed.');
  }
});

document.getElementById('btnSaveReveal').addEventListener('click', () => {
  try {
    if (!buildState.p2tr || !buildState.ephPriv) {
      throw new Error('Nothing to save. If you already saved a reveal, ' +
        'use "Broadcast a previously-saved reveal" below.');
    }
    const { hex, commitTxid } = buildAndSignReveal();
    offerSignedRevealDownload(hex, commitTxid);

    // Also show the hex inline so the user can copy-paste if the download
    // is blocked, intercepted by the browser, or they want a second channel.
    document.getElementById('savedRevealHex').value = hex;
    document.getElementById('savedRevealSection').style.display = 'block';

    // Remove the two "do it again" buttons — the key is gone, these cannot
    // be used meaningfully a second time.
    document.getElementById('btnBroadcastReveal').disabled = true;
    document.getElementById('btnSaveReveal').disabled = true;
  } catch (e) {
    console.error(e);
    alert('Save error: ' + e.message);
  }
});

document.getElementById('btnCopySavedReveal').addEventListener('click', () => {
  const ta = document.getElementById('savedRevealHex');
  ta.select();
  document.execCommand('copy');
});

document.getElementById('btnBroadcastSavedReveal').addEventListener('click', async () => {
  const btn = document.getElementById('btnBroadcastSavedReveal');
  const resultEl = document.getElementById('savedRevealResult');
  try {
    // Accept the file contents verbatim: strip # comment lines and
    // surrounding whitespace, leaving the hex.
    const hex = document.getElementById('savedRevealInput').value
      .split('\n').filter((line) => !line.trim().startsWith('#')).join('')
      .replace(/\s+/g, '');
    if (!hex) throw new Error('Paste the signed reveal hex first.');
    if (!/^[0-9a-fA-F]+$/.test(hex)) throw new Error('After stripping comments, the remaining content is not valid hex.');

    btn.disabled = true; btn.textContent = 'Broadcasting...';
    resultEl.innerHTML = '';
    const res = await fetch(`${NET().mempoolApi}/tx`, { method: 'POST', body: hex });
    const txt = await res.text();
    if (!res.ok) throw new Error(txt);

    resultEl.innerHTML = `<span style="color: var(--green)">✓ Broadcast. ` +
      `<a href="${NET().mempoolTx}/${txt}" target="_blank">View: ${txt}</a></span>`;
  } catch (e) {
    console.error(e);
    resultEl.innerHTML = `<span style="color: var(--yellow)">Error: ${e.message}</span>`;
  } finally {
    btn.disabled = false; btn.textContent = 'Broadcast saved reveal';
  }
});

/* ═══════════════════════════════════════════════════════════════
   INSCRIBE — Reset
   ═══════════════════════════════════════════════════════════════ */

function resetInscribeForm() {
  ['inputCodes', 'publisherPM', 'utxoRef', 'utxoValue', 'utxoHex',
   'changeAddress', 'msgToSign', 'sparrowSig', 'psbtOutput', 'commitTxid',
   'savedRevealHex', 'savedRevealInput',
  ].forEach((id) => { document.getElementById(id).value = ''; });
  document.getElementById('feeRate').value = '1';
  document.getElementById('nymLimit').value = '200';
  document.getElementById('nymStart').value = '1';
  document.getElementById('dedupResult').innerHTML = '';
  document.getElementById('savedRevealResult').innerHTML = '';
  document.getElementById('pubInfo').style.display = 'none';
  ['hashSection', 'sigCard', 'commitPsbtCard', 'revealSection',
   'savedRevealSection',
  ].forEach((id) => { document.getElementById(id).style.display = 'none'; });
  ['btnBroadcastReveal', 'btnSaveReveal'].forEach((id) => {
    document.getElementById(id).disabled = false;
  });
  buildState = {};
  fetchedAllRemaining = false;
  // Programmatic value assignments above don't fire 'input' events, so the
  // dependent paynym URL link needs an explicit refresh.
  updatePaynymApiLink();
}
document.getElementById('btnReset').addEventListener('click', resetInscribeForm);

/* ═══════════════════════════════════════════════════════════════
   BROWSE — envelope extraction
   ═══════════════════════════════════════════════════════════════ */

function extractPayload(wh) {
  if (!wh || wh.length < 2) return null;
  const sh = wh[wh.length - 2];
  if (!sh) return null;
  const sc = Buffer.from(sh, 'hex');
  const mk = Buffer.from([0x00, 0x63, 0x03, 0x6f, 0x72, 0x64]);
  let st = -1;
  for (let i = 0; i <= sc.length - mk.length; i++) {
    if (sc.subarray(i, i + mk.length).equals(mk)) { st = i + mk.length; break; }
  }
  if (st < 0) return null;
  let pos = st, mime = null;
  while (pos < sc.length) {
    const b = sc[pos];
    if (b === 0x00) { pos++; break; }
    if (b === 0x01 && sc[pos + 1] === 0x00) { pos += 2; break; }
    if (b === 0x68) return null;
    let ct = false;
    if (b === 0x51) { ct = true; pos++; }
    else if (b === 0x01 && sc[pos + 1] === 0x01) { ct = true; pos += 2; }
    if (ct) {
      const op = sc[pos]; pos++;
      let len;
      if (op >= 1 && op <= 0x4b) len = op;
      else if (op === 0x4c) { len = sc[pos]; pos++; }
      else if (op === 0x4d) { len = sc.readUInt16LE(pos); pos += 2; }
      else return null;
      mime = sc.subarray(pos, pos + len).toString();
      pos += len;
    } else { pos++; pos += 1 + sc[pos]; }
  }
  if (mime !== 'application/x-bip47db') return null;
  const dc = [];
  while (pos < sc.length && sc[pos] !== 0x68) {
    const op = sc[pos]; pos++;
    let len;
    if (op >= 1 && op <= 0x4b) len = op;
    else if (op === 0x4c) { len = sc[pos]; pos++; }
    else if (op === 0x4d) { len = sc.readUInt16LE(pos); pos += 2; }
    else if (op === 0x4e) { len = sc.readUInt32LE(pos); pos += 4; }
    else return null;
    dc.push(sc.subarray(pos, pos + len));
    pos += len;
  }
  return Buffer.concat(dc);
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — batch decoder (8-byte and 40-byte header compat)
   ═══════════════════════════════════════════════════════════════ */

async function decodeBatch(compressed) {
  const inf = new pako.Inflate();
  inf.push(compressed, true);
  if (inf.err) throw new Error('Decompress failed');
  const raw = Buffer.from(inf.result);
  if (raw.length > MAX_UNCOMPRESSED) throw new Error('>2MB');
  if (raw.length / compressed.length > MAX_RATIO) throw new Error('>50:1');
  if (raw.length < 8) throw new Error('Truncated');
  if (raw[0] !== 0x47 || raw[1] !== 0xDB) throw new Error('Bad magic');

  const version = raw[2], count = raw.readUInt32BE(3), flags = raw[7];

  // Detect header size
  let headerSize = HEADER_SIZE;
  const total8 = HEADER_SIZE + count * 81 + TRAILER_SIZE;
  const total40 = HEADER_SIZE_V1_OLD + count * 81 + TRAILER_SIZE;
  if (raw.length === total40) headerSize = HEADER_SIZE_V1_OLD;
  else if (raw.length === total8) headerSize = HEADER_SIZE;
  else if (raw.length >= total40) headerSize = HEADER_SIZE_V1_OLD;
  else if (raw.length >= total8) headerSize = HEADER_SIZE;
  else throw new Error('Truncated');

  const codes = [];
  for (let i = 0; i < count; i++) {
    const o = headerSize + i * 81;
    codes.push({
      code: Buffer.from(raw.subarray(o, o + 80)),
      segwitExt: !!(raw[o + 80] & 0x01),
    });
  }

  const to = headerSize + count * 81;
  const checksum = raw.subarray(to, to + 4);
  const recoveryFlag = raw[to + 4];
  const signature = raw.subarray(to + 5, to + 69);

  const payload = raw.subarray(0, to);
  const expected = await sha256(payload);
  let checksumValid = true;
  for (let i = 0; i < 4; i++) if (checksum[i] !== expected[i]) checksumValid = false;
  const msgHashHex = expected.toString('hex');

  // Signature verification: BIP-137 first, then raw
  const sig = secp256k1.Signature.fromCompact(signature).addRecoveryBit(recoveryFlag);
  let bip137Key = null, rawKey = null;
  try {
    const ph = bsmHash(expected.toString('hex'));
    const r = sig.recoverPublicKey(ph);
    const p = Buffer.from(r.toRawBytes(true));
    if (secp256k1.verify(signature, ph, p)) bip137Key = p;
  } catch (e) {}
  try {
    const r = sig.recoverPublicKey(expected);
    const p = Buffer.from(r.toRawBytes(true));
    if (secp256k1.verify(signature, expected, p)) rawKey = p;
  } catch (e) {}

  function keyMatch(k) {
    if (!k) return false;
    for (const c of codes) {
      if (Buffer.from(c.code.subarray(2, 35)).equals(k)) return true;
      try { if (bip47Child0(c.code, NET().bitcoin).equals(k)) return true; } catch (e) {}
    }
    return false;
  }

  let publisherKey = null, sigFormat = null;
  if (bip137Key && keyMatch(bip137Key)) { publisherKey = bip137Key; sigFormat = 'bip137'; }
  else if (rawKey && keyMatch(rawKey)) { publisherKey = rawKey; sigFormat = 'raw'; }
  else if (bip137Key) { publisherKey = bip137Key; sigFormat = 'bip137'; }
  else if (rawKey) { publisherKey = rawKey; sigFormat = 'raw'; }

  let publisherPaymentCode = null, verified = false;
  if (publisherKey) {
    for (const c of codes) {
      if (Buffer.from(c.code.subarray(2, 35)).equals(publisherKey)) {
        publisherPaymentCode = pmToB58(c.code); verified = true; break;
      }
      try {
        if (bip47Child0(c.code, NET().bitcoin).equals(publisherKey)) {
          publisherPaymentCode = pmToB58(c.code); verified = true; break;
        }
      } catch (e) {}
    }
  }

  return { raw, version, count, flags, headerSize, codes, checksum, recoveryFlag,
    signature, checksumValid, publisherKey, publisherPaymentCode, sigFormat,
    msgHashHex, verified };
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — cross-batch publisher matching
   ═══════════════════════════════════════════════════════════════ */

async function findPubCrossDb(pkHex) {
  if (!pkHex) return null;
  const pk = Buffer.from(pkHex, 'hex');
  const all = await dbGetAll('codes');
  const seen = new Set();
  for (const c of all) {
    if (seen.has(c.paymentCode)) continue;
    seen.add(c.paymentCode);
    const r = parsePM(c.paymentCode);
    if (Buffer.from(r.subarray(2, 35)).equals(pk)) return c.paymentCode;
    try { if (bip47Child0(r, NET().bitcoin).equals(pk)) return c.paymentCode; } catch (e) {}
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — sync (with block height updates for mempool batches)
   ═══════════════════════════════════════════════════════════════ */

async function syncBatches() {
  const list = document.getElementById('batchList');
  list.innerHTML = '<div class="loading">Querying deposit address...</div>';

  const allTxs = [];
  let last = '';
  while (true) {
    const url = last
      ? `${NET().mempoolApi}/address/${NET().canonicalDeposit}/txs/chain/${last}`
      : `${NET().mempoolApi}/address/${NET().canonicalDeposit}/txs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const txs = await res.json();
    if (!txs.length) break;
    allTxs.push(...txs);
    last = txs[txs.length - 1].txid;
    if (txs.length < 25) break;
  }
  if (!allTxs.length) {
    list.innerHTML = '<div class="empty">No batches found.</div>';
    return;
  }

  // Update block heights for previously-mempool batches
  const ex = await dbGetAll('batches');
  const exMap = new Map(ex.map((b) => [b.txid, b]));
  for (const tx of allTxs) {
    const existing = exMap.get(tx.txid);
    if (existing && !existing.blockHeight && tx.status.block_height) {
      existing.blockHeight = tx.status.block_height;
      existing.timestamp = tx.status.block_time || existing.timestamp;
      await dbPut('batches', existing);
      const codes = await dbGetAll('codes');
      for (const c of codes) {
        if (c.batchTxid === tx.txid && !c.blockHeight) {
          c.blockHeight = tx.status.block_height;
          await dbPut('codes', c);
        }
      }
    }
  }

  const eset = new Set(exMap.keys());
  const nw = allTxs.filter((t) => !eset.has(t.txid));
  if (!nw.length) { await renderFromDb(); return; }

  list.innerHTML = `<div class="loading">Decoding ${nw.length} tx(s)...</div>`;

  for (const tx of nw) {
    let payload = null;
    for (const vin of tx.vin) {
      if (vin.witness && vin.witness.length > 0) {
        const p = extractPayload(vin.witness);
        if (p) { payload = p; break; }
      }
    }
    const br = {
      txid: tx.txid,
      blockHeight: tx.status.block_height || null,
      timestamp: tx.status.block_time || Date.now() / 1000,
    };
    if (!payload) { br.error = 'No BIP47DB envelope'; await dbPut('batches', br); continue; }
    try {
      const d = await decodeBatch(payload);
      Object.assign(br, {
        rawHex: d.raw.toString('hex'), version: d.version, count: d.count,
        flags: d.flags, headerSize: d.headerSize,
        checksum: d.checksum.toString('hex'), recoveryFlag: d.recoveryFlag,
        signature: d.signature.toString('hex'), checksumValid: d.checksumValid,
        publisherKey: d.publisherKey ? d.publisherKey.toString('hex') : null,
        publisherPaymentCode: d.publisherPaymentCode, sigFormat: d.sigFormat,
        msgHashHex: d.msgHashHex, verified: d.verified,
      });
      await dbPut('batches', br);
      for (const c of d.codes) {
        const pm = pmToB58(c.code);
        await dbPut('codes', {
          batchTxid: tx.txid, paymentCode: pm,
          rawHex: Buffer.from(c.code).toString('hex'),
          notificationAddress: bip47Notif(c.code, NET().bitcoin),
          segwitExt: c.segwitExt,
          blockHeight: tx.status.block_height || null,
          publisherKey: br.publisherKey,
        });
      }
    } catch (e) { br.error = e.message; await dbPut('batches', br); }
  }

  // Cross-batch publisher enrichment
  const all2 = await dbGetAll('batches');
  for (const b of all2) {
    if (b.publisherKey && !b.publisherPaymentCode) {
      const pm = await findPubCrossDb(b.publisherKey);
      if (pm) { b.publisherPaymentCode = pm; b.verified = true; await dbPut('batches', b); }
    }
  }
  await renderFromDb();
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — render from DB
   ═══════════════════════════════════════════════════════════════ */

async function renderFromDb() {
  const list = document.getElementById('batchList');
  const batches = await dbGetAll('batches');
  if (!batches.length) {
    list.innerHTML = '<div class="empty">No batches. Click Sync.</div>';
    document.getElementById('stats').style.display = 'none';
    return;
  }
  batches.sort((a, b) => {
    if (a.blockHeight === null) return -1;
    if (b.blockHeight === null) return 1;
    return b.blockHeight - a.blockHeight;
  });
  let vc = 0, verc = 0, tc = 0;
  for (const b of batches) {
    if (!b.error && b.checksumValid) vc++;
    if (b.verified) verc++;
    tc += (b.count || 0);
  }
  document.getElementById('stats').style.display = 'flex';
  document.getElementById('statBatches').textContent = batches.length;
  document.getElementById('statValid').textContent = vc;
  document.getElementById('statVerified').textContent = verc;
  document.getElementById('statCodes').textContent = tc;

  const allCodes = await dbGetAll('codes');
  list.innerHTML = '';

  for (const b of batches) {
    const myCodes = allCodes.filter((c) => c.batchTxid === b.txid);
    const div = document.createElement('div');
    div.className = 'batch';
    let badges, mh;

    if (b.error) {
      badges = '<span class="batch-status status-invalid">INVALID</span>';
      mh = `<div><strong>TX:</strong> <a class="txid" href="${NET().mempoolTx}/${b.txid}" target="_blank" onclick="event.stopPropagation()">${b.txid}</a></div>` +
        `<div><strong>Block:</strong> ${b.blockHeight || 'mempool'}</div>` +
        `<div style="color:var(--red);margin-top:4px">${b.error}</div>`;
    } else {
      const sc = b.checksumValid ? 'status-valid' : 'status-invalid';
      badges = `<span class="batch-status ${sc}">${b.checksumValid ? 'VALID' : 'BAD CHECKSUM'}</span>`;
      if (b.checksumValid) {
        badges += b.verified
          ? '<span class="batch-status status-verified">VERIFIED</span>'
          : '<span class="batch-status status-warn">UNVERIFIED</span>';
      }
      let pl;
      if (b.publisherPaymentCode)
        pl = `<span style="color:var(--green)">${b.publisherPaymentCode.slice(0, 12)}...</span>`;
      else if (b.publisherKey)
        pl = b.publisherKey.slice(0, 16) + '...';
      else pl = 'unknown';
      mh = `<div><strong>TX:</strong> <a class="txid" href="${NET().mempoolTx}/${b.txid}" target="_blank" onclick="event.stopPropagation()">${b.txid}</a></div>` +
        `<div><strong>Block:</strong> ${b.blockHeight || 'mempool'} · <strong>Codes:</strong> ${b.count} · <strong>Publisher:</strong> ${pl}</div>`;
    }

    const bdy = b.error
      ? `<div style="color:var(--red)">${b.error}</div>`
      : renderTabs(b, myCodes);
    div.innerHTML =
      `<div class="batch-header"><div class="batch-meta">${mh}</div>` +
      `<div class="batch-badges">${badges}</div></div>` +
      `<div class="batch-body">${bdy}</div>`;
    div.querySelector('.batch-header').addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      div.querySelector('.batch-body').classList.toggle('open');
    });
    list.appendChild(div);
  }

  // Wire up sub-tabs
  document.querySelectorAll('.batch-body').forEach((bd) => {
    bd.querySelectorAll('.subtab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const t = btn.dataset.subtab;
        bd.querySelectorAll('.subtab').forEach((x) => x.classList.remove('active'));
        bd.querySelectorAll('.subpanel').forEach((x) => x.classList.remove('active'));
        btn.classList.add('active');
        bd.querySelector(`.subpanel[data-subpanel="${t}"]`).classList.add('active');
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — sub-tab renderers
   ═══════════════════════════════════════════════════════════════ */

function renderTabs(b, codes) {
  const ch = codes.length === 0 ? '<div class="empty">No codes</div>'
    : '<div class="code-list">' + codes.map((c) => {
        const ip = c.paymentCode === b.publisherPaymentCode;
        return `<div class="row"><span class="pm">${c.paymentCode}</span>` +
          `${ip ? '<span class="badge-pub">publisher</span>' : ''}` +
          `${c.segwitExt ? '<span class="badge-sw">segwit</span>' : ''}</div>`;
      }).join('') + '</div>';

  const mt = '<table class="meta-table">' +
    `<tr><td>Version</td><td>${b.version}</td></tr>` +
    `<tr><td>Count</td><td>${b.count}</td></tr>` +
    `<tr><td>Flags</td><td>0x${(b.flags || 0).toString(16).padStart(2, '0')}</td></tr>` +
    `<tr><td>Header size</td><td>${b.headerSize || '?'} bytes${b.headerSize === 40 ? ' (legacy)' : ''}</td></tr>` +
    `<tr><td>Checksum</td><td>${b.checksum} ${b.checksumValid ? '✓' : '✗'}</td></tr>` +
    `<tr><td>Recovery flag</td><td>${b.recoveryFlag}</td></tr>` +
    `<tr><td>Signature</td><td>${b.signature}</td></tr>` +
    `<tr><td>Message hash</td><td style="color:var(--accent)">${b.msgHashHex || '(re-sync)'}</td></tr>` +
    `<tr><td>Publisher pubkey</td><td>${b.publisherKey || '(unmatched)'}</td></tr>` +
    '</table>';

  return '<div class="subtabs">' +
    `<button class="subtab active" data-subtab="codes">Codes (${b.count})</button>` +
    '<button class="subtab" data-subtab="meta">Header / Trailer</button>' +
    '<button class="subtab" data-subtab="hex">Hex Dump</button>' +
    '<button class="subtab" data-subtab="verify">Verify</button>' +
    '</div>' +
    `<div class="subpanel active" data-subpanel="codes">${ch}</div>` +
    `<div class="subpanel" data-subpanel="meta">${mt}</div>` +
    `<div class="subpanel" data-subpanel="hex">${renderHex(b)}</div>` +
    `<div class="subpanel" data-subpanel="verify">${renderVerify(b)}</div>`;
}

function renderVerify(b) {
  if (!b.rawHex) return '<div class="empty">No data</div>';
  const msgHash = b.msgHashHex || '(clear DB and re-sync)';
  let notifAddr = '(publisher unmatched)', pubPM = '(unknown)';
  if (b.publisherPaymentCode) {
    pubPM = b.publisherPaymentCode;
    try { notifAddr = bip47Notif(parsePM(b.publisherPaymentCode), NET().bitcoin); } catch (e) {}
  }
  let sigB64 = '';
  try {
    const sb = Buffer.from(b.signature, 'hex');
    sigB64 = Buffer.concat([Buffer.from([31 + b.recoveryFlag]), sb]).toString('base64');
  } catch (e) { sigB64 = '(error)'; }

  const vs = b.verified
    ? '<span style="color:#818cf8;font-weight:600">✓ VERIFIED</span> — signed by the publisher\'s BIP-47 notification address key.'
    : '<span style="color:var(--yellow);font-weight:600">✗ UNVERIFIED</span> — signature does not match any known payment code.';

  function cp(val) {
    const escaped = val.replace(/'/g, "\\'");
    return `<span style="cursor:pointer" title="Click to copy" onclick="navigator.clipboard.writeText('${escaped}');showCopied()">${val}</span>`;
  }

  return '<table class="meta-table">' +
    `<tr><td>Status</td><td>${vs}</td></tr>` +
    `<tr><td>Message hash</td><td style="color:var(--accent);font-weight:600">${cp(msgHash)}</td></tr>` +
    `<tr><td>Publisher Payment Code</td><td>${cp(pubPM)}</td></tr>` +
    `<tr><td>Notification address</td><td>${cp(notifAddr)}</td></tr>` +
    `<tr><td>Signature (base64)</td><td style="color:var(--link)">${cp(sigB64)}</td></tr>` +
    `<tr><td>Sig format</td><td>${b.sigFormat === 'bip137' ? 'BIP-137 (standard Bitcoin signmessage)' : 'raw SHA-256'}</td></tr>` +
    '</table>';
}

function renderHex(b) {
  if (!b.rawHex) return '<div class="empty">No hex</div>';
  const headerSize = b.headerSize || HEADER_SIZE;
  const hs = headerSize * 2, bs = b.count * 81 * 2;
  const hx = b.rawHex.slice(0, hs);
  const bx = b.rawHex.slice(hs, hs + bs);
  const tx = b.rawHex.slice(hs + bs);
  const raw = b.rawHex;

  let ann = '';

  // Header
  ann += `<div class="hex-section"><div class="hex-section-label">Header (${headerSize} bytes)</div><table class="meta-table">`;
  ann += `<tr><td style="width:170px;white-space:nowrap">Magic [0–1]</td><td><span class="hex-header">${raw.slice(0, 4)}</span> (0x47DB)</td></tr>`;
  ann += `<tr><td style="white-space:nowrap">Version [2]</td><td><span class="hex-header">${raw.slice(4, 6)}</span> (${parseInt(raw.slice(4, 6), 16)})</td></tr>`;
  ann += `<tr><td style="white-space:nowrap">Record count [3–6]</td><td><span class="hex-header">${raw.slice(6, 14)}</span> (${parseInt(raw.slice(6, 14), 16)})</td></tr>`;
  ann += `<tr><td style="white-space:nowrap">Flags [7]</td><td><span class="hex-header">${raw.slice(14, 16)}</span></td></tr>`;
  if (headerSize === 40)
    ann += `<tr><td style="white-space:nowrap">Prev txid [8–39]</td><td style="font-size:11px;word-break:break-all"><span class="hex-header">${raw.slice(16, 80)}</span> (legacy)</td></tr>`;
  ann += '</table></div>';

  // Body
  ann += `<div class="hex-section"><div class="hex-section-label">Body (${b.count} records × 81 bytes)</div>`;
  ann += '<div style="max-height:400px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent">';
  ann += '<table class="meta-table">';
  for (let i = 0; i < b.count; i++) {
    const rs = hs + i * 81 * 2;
    const cH = raw.slice(rs, rs + 160);
    const fH = raw.slice(rs + 160, rs + 162);
    const fV = parseInt(fH, 16);
    const sw = !!(fV & 1);
    let pm = '';
    try { pm = pmToB58(Buffer.from(cH, 'hex')); } catch (e) { pm = '(error)'; }

    ann += `<tr><td colspan="2" style="color:var(--accent);font-weight:600;border-bottom:none;padding-bottom:2px">Record ${i + 1}</td></tr>`;
    ann += `<tr><td style="width:170px;white-space:nowrap">Payment code</td><td style="font-size:12px;word-break:break-all"><span class="hex-body" style="cursor:pointer" title="Click to copy" onclick="navigator.clipboard.writeText('${pm}');showCopied()">${pm}</span></td></tr>`;
    ann += `<tr><td style="white-space:nowrap">Version [0]</td><td><span class="hex-body">${cH.slice(0, 2)}</span> (${parseInt(cH.slice(0, 2), 16)})</td></tr>`;
    ann += `<tr><td style="white-space:nowrap">Features [1]</td><td><span class="hex-body">${cH.slice(2, 4)}</span></td></tr>`;
    ann += `<tr><td style="white-space:nowrap">Pubkey [2–34]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${cH.slice(4, 70)}</span></td></tr>`;
    ann += `<tr><td style="white-space:nowrap">Chain code [35–66]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${cH.slice(70, 134)}</span></td></tr>`;
    const res = cH.slice(134, 160);
    if (res !== '0'.repeat(26))
      ann += `<tr><td style="white-space:nowrap">Reserved [67–79]</td><td style="font-size:11px;word-break:break-all"><span class="hex-body">${res}</span></td></tr>`;
    ann += `<tr><td style="white-space:nowrap">Record flag</td><td><span class="hex-body">${fH}</span> (${sw ? 'segwit' : 'standard'})</td></tr>`;
  }
  ann += '</table></div></div>';

  // Trailer
  const ckH = tx.slice(0, 8), rfH = tx.slice(8, 10), sH = tx.slice(10, 138);
  ann += '<div class="hex-section"><div class="hex-section-label">Trailer (69 bytes)</div><table class="meta-table">';
  ann += `<tr><td style="width:170px;white-space:nowrap">Checksum [0–3] ${b.checksumValid ? '✓' : '✗'}</td><td><span class="hex-trailer">${ckH}</span></td></tr>`;
  ann += `<tr><td style="white-space:nowrap">Recovery flag [4]</td><td><span class="hex-trailer">${rfH}</span> (${parseInt(rfH, 16)})</td></tr>`;
  ann += `<tr><td style="white-space:nowrap">Signature [5–68]</td><td style="font-size:11px;word-break:break-all"><span class="hex-trailer">${sH}</span></td></tr>`;
  ann += '</table></div>';

  // Raw hex (collapsed)
  function fmt(h) {
    let o = '';
    for (let i = 0; i < h.length; i += 2) {
      o += h.slice(i, i + 2);
      if ((i + 2) % 32 === 0) o += '\n'; else o += ' ';
    }
    return o.trim();
  }
  ann += '<div class="hex-section" style="margin-top:16px">' +
    '<div class="hex-section-label" style="cursor:pointer" ' +
    'onclick="const el=this.nextElementSibling;el.style.display=el.style.display===\'none\'?\'block\':\'none\'">Raw hex (click to expand)</div>' +
    '<div style="display:none"><div class="hex-dump">' +
    `<div class="hex-section"><div class="hex-section-label">Header</div><pre class="hex-header" style="margin:0;white-space:pre-wrap;word-break:break-all">${fmt(hx)}</pre></div>` +
    `<div class="hex-section"><div class="hex-section-label">Body</div><pre class="hex-body" style="margin:0;white-space:pre-wrap;word-break:break-all">${fmt(bx)}</pre></div>` +
    `<div class="hex-section"><div class="hex-section-label">Trailer</div><pre class="hex-trailer" style="margin:0;white-space:pre-wrap;word-break:break-all">${fmt(tx)}</pre></div>` +
    '</div></div></div>';

  return `<div style="font-family:'JetBrains Mono',monospace;font-size:12px">${ann}</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   BROWSE — Search
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('btnSearch').addEventListener('click', async () => {
  const q = document.getElementById('searchInput').value.trim();
  const r = document.getElementById('searchResult');
  if (!q) { r.innerHTML = ''; return; }
  let m = [];
  try {
    if (q.startsWith('PM'))
      m = await dbGetByIndex('codes', 'paymentCode', q);
    else if (q.startsWith('tb1') || q.startsWith('m') || q.startsWith('n'))
      m = await dbGetByIndex('codes', 'notificationAddress', q);
    else if (/^[0-9a-fA-F]+$/.test(q))
      m = await dbGetByIndex('codes', 'publisherKey', q);
  } catch (e) {
    r.innerHTML = `<div class="search-result" style="color:var(--red)">${e.message}</div>`;
    return;
  }
  if (!m.length) { r.innerHTML = '<div class="search-result">No matches.</div>'; return; }
  r.innerHTML = '<div class="search-result">' +
    `<strong>${m.length}</strong> match(es):<br><br>` +
    m.map((x) =>
      `<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle)">` +
      `<strong>${x.paymentCode}</strong><br>` +
      `<span style="color:var(--text-muted)">Notif: ${x.notificationAddress}</span><br>` +
      `<span style="color:var(--text-muted)">Block: ${x.blockHeight || 'mempool'} · ` +
      `<a href="${NET().mempoolTx}/${x.batchTxid}" target="_blank">${x.batchTxid.slice(0, 16)}...</a></span>` +
      `${x.segwitExt ? ' <span style="color:var(--yellow)">[segwit]</span>' : ''}</div>`,
    ).join('') + '</div>';
});

/* ═══════════════════════════════════════════════════════════════
   BROWSE — Sync / Export / Import / Clear
   ═══════════════════════════════════════════════════════════════ */

document.getElementById('btnLoadBatches').addEventListener('click', async () => {
  const b = document.getElementById('btnLoadBatches');
  b.disabled = true; b.textContent = 'Syncing...';
  try { await syncBatches(); }
  catch (e) {
    console.error(e);
    document.getElementById('batchList').innerHTML =
      `<div class="empty" style="color:var(--red)">${e.message}</div>`;
  } finally { b.disabled = false; b.textContent = 'Sync batches'; }
});

document.getElementById('btnExportDb').addEventListener('click', async () => {
  try {
    const batches = await dbGetAll('batches');
    const codes = await dbGetAll('codes');
    const dump = {
      schema: `bip47db_${currentNet}/v1`,
      exportedAt: new Date().toISOString(),
      network: currentNet,
      canonicalDeposit: NET().canonicalDeposit,
      batchCount: batches.length,
      codeCount: codes.length,
      batches, codes,
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bip47db-${currentNet}-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) { alert('Export failed: ' + e.message); }
});

document.getElementById('btnImportDb').addEventListener('click', () => {
  document.getElementById('importFileInput').click();
});

document.getElementById('importFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data.batches && !data.codes) throw new Error('Invalid: no batches or codes');
    let ib = 0, ic = 0, sb = 0, sc = 0;
    if (data.batches && Array.isArray(data.batches)) {
      const ex = new Set((await dbGetAll('batches')).map((b) => b.txid));
      for (const b of data.batches) {
        if (b.txid && !ex.has(b.txid)) { await dbPut('batches', b); ib++; }
        else sb++;
      }
    }
    if (data.codes && Array.isArray(data.codes)) {
      const ex = new Set(
        (await dbGetAll('codes')).map((c) => c.batchTxid + '|' + c.paymentCode));
      for (const c of data.codes) {
        if (!ex.has(c.batchTxid + '|' + c.paymentCode)) { await dbPut('codes', c); ic++; }
        else sc++;
      }
    }
    alert(`Imported: ${ib} batches, ${ic} codes.\nSkipped: ${sb} batches, ${sc} codes.`);
    await renderFromDb();
  } catch (err) { console.error(err); alert('Import failed: ' + err.message); }
  e.target.value = '';
});

document.getElementById('btnClearDb').addEventListener('click', async () => {
  if (!confirm('Delete all cached data?')) return;
  await dbClear();
  document.getElementById('batchList').innerHTML = '<div class="empty">Cleared.</div>';
  document.getElementById('stats').style.display = 'none';
  document.getElementById('searchResult').innerHTML = '';
});
