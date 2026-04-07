// BIP47DB Whitepaper — client-side markdown renderer
// Loads whitepaper.md, renders via marked.js, builds sidebar TOC

var COPY_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z"/></svg>';
var CHECK_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>';

document.addEventListener('DOMContentLoaded', init);

function isMobile() {
  return window.innerWidth <= 900;
}

function init() {
  // Set up sidebar toggle
  var toggleBtn = document.getElementById('toc-toggle');
  var toc = document.getElementById('toc');
  var content = document.getElementById('content');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      if (isMobile()) {
        // Mobile: slide in/out as overlay
        toc.classList.toggle('open');
        toc.classList.remove('collapsed');
      } else {
        // Desktop: collapse/expand with content reflow
        var isCollapsed = toc.classList.toggle('collapsed');
        content.classList.toggle('expanded', isCollapsed);
      }
    });
  }

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', function(e) {
    if (isMobile() && toc.classList.contains('open')) {
      if (!toc.contains(e.target) && e.target !== toggleBtn) {
        toc.classList.remove('open');
      }
    }
  });

  // Load whitepaper
  fetch('whitepaper.md')
    .then(function(res) {
      if (!res.ok) throw new Error('Failed to load whitepaper.md (' + res.status + ')');
      return res.text();
    })
    .then(function(md) {
      // Extract abstract from comment markers in raw markdown
      var abstractRegex = /<!--\s*abstract\s*-->([\s\S]*?)<!--\s*\/abstract\s*-->/;
      var absMatch = md.match(abstractRegex);
      if (absMatch) {
        document.getElementById('abstract').innerHTML =
          '<strong>Abstract:</strong> ' + absMatch[1].trim();
      }

      // Remove abstract block from markdown so it doesn't render in the article
      var cleanMd = md.replace(abstractRegex, '').trim();

      // Render markdown to HTML
      document.getElementById('article').innerHTML = marked.parse(cleanMd);

      // Build sidebar TOC
      buildTOC();

      // Add copy-to-clipboard buttons on code blocks
      addCopyButtons();

      // Style protocol/technical blocks differently
      applyCodeStyling();

      // Scroll spy for active TOC highlighting
      initScrollSpy();
    })
    .catch(function(err) {
      document.getElementById('article').innerHTML =
        '<p style="color:#f85149">Error loading whitepaper: ' + err.message + '</p>';
    });
}

function buildTOC() {
  var headings = document.querySelectorAll('#article h2, #article h3');
  var tocList = document.getElementById('toc-list');
  var toc = document.getElementById('toc');
  tocList.innerHTML = '';

  headings.forEach(function(h) {
    if (!h.id) {
      h.id = h.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    var li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.addEventListener('click', function() {
      // Close sidebar on mobile after clicking a link
      if (isMobile()) {
        toc.classList.remove('open');
      }
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });
}

function addCopyButtons() {
  document.querySelectorAll('#article pre').forEach(function(pre) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = COPY_SVG;
    btn.title = 'Copy to clipboard';
    btn.addEventListener('click', function() {
      var code = pre.querySelector('code');
      if (!code) return;
      navigator.clipboard.writeText(code.textContent).then(function() {
        btn.classList.add('copied');
        btn.innerHTML = CHECK_SVG + ' Copied';
        setTimeout(function() {
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
  document.querySelectorAll('#article pre code').forEach(function(code) {
    if (code.className && code.className.indexOf('language-text') !== -1) {
      code.parentElement.classList.add('language-text');
    }
  });
}

function initScrollSpy() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        document.querySelectorAll('#toc a').forEach(function(a) {
          a.classList.remove('active');
        });
        var link = document.querySelector('#toc a[href="#' + entry.target.id + '"]');
        if (link) {
          link.classList.add('active');
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  document.querySelectorAll('#article h2[id], #article h3[id]').forEach(function(h) {
    observer.observe(h);
  });
}
