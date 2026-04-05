// BIP47DB Whitepaper — client-side markdown renderer
// Loads whitepaper.md, renders via marked.js, builds sidebar TOC

const COPY_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/></svg>';
const CHECK_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const res = await fetch('whitepaper.md');
    if (!res.ok) throw new Error('Failed to load whitepaper.md');
    const md = await res.text();

    // Extract abstract (first paragraph after any heading)
    const absMatch = md.match(/^(?:.*\n)*?(.+?)(?=\n\n## )/s);

    // Render markdown
    const html = marked.parse(md);
    document.getElementById('article').innerHTML = html;

    // Extract abstract from <!-- abstract --> markers in the source markdown
    const absMatch = md.match(/<!-- abstract -->\s*([\s\S]*?)\s*<!-- \/abstract -->/);
    if (absMatch) {
      document.getElementById('abstract').innerHTML =
        '<strong>Abstract:</strong> ' + absMatch[1].trim();
      // Remove the abstract paragraph from the rendered article
      // (it renders as the first <p> since it's plain text between comments)
      const firstP = document.querySelector('#article > p:first-child');
      if (firstP && firstP.textContent.startsWith('This document proposes')) {
        firstP.remove();
      }
    }

    // Build TOC from rendered headings
    buildTOC();

    // Add copy buttons to code blocks
    addCopyButtons();

    // Apply language-specific styling
    applyCodeStyling();

    // Start scroll spy
    initScrollSpy();

  } catch (err) {
    document.getElementById('article').innerHTML =
      '<p style="color:#f85149">Error loading whitepaper: ' + err.message + '</p>';
  }
}

function buildTOC() {
  const headings = document.querySelectorAll('#article h2, #article h3');
  const tocList = document.getElementById('toc-list');
  tocList.innerHTML = '';

  headings.forEach(h => {
    // Generate ID if missing
    if (!h.id) {
      h.id = h.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', () => {
      document.getElementById('toc').classList.remove('open');
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

function addCopyButtons() {
  document.querySelectorAll('#article pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = COPY_SVG;
    btn.title = 'Copy to clipboard';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = CHECK_SVG + ' Copied';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = COPY_SVG;
        }, 2000);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

function applyCodeStyling() {
  // marked.js adds class="language-xxx" to <code> inside <pre>
  // Apply the green accent to text/protocol blocks
  document.querySelectorAll('#article pre code').forEach(code => {
    if (code.className.includes('language-text')) {
      code.parentElement.classList.add('language-text');
    }
  });
}

function initScrollSpy() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('#toc a').forEach(a => a.classList.remove('active'));
        const link = document.querySelector('#toc a[href="#' + entry.target.id + '"]');
        if (link) {
          link.classList.add('active');
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  document.querySelectorAll('#article h2[id], #article h3[id]').forEach(h => {
    observer.observe(h);
  });
}
