/* Page translation: Korean is written in the HTML; other languages replace it here.
   Each translatable element is found by its Korean text, so the HTML needs no keys:
   the outermost element with Korean text of its own, keyed by its inner HTML with
   whitespace collapsed and any inline <svg> replaced by {svg}. */
(() => {
  const HANGUL = /[가-힣]/;
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const T = window.I18N || {};

  /* ---------- find the Korean text on the page ---------- */
  /* inline icons are left alone, but the labels of an SVG diagram (<text>) are translated */
  const skip = el => el.closest('script,style,[data-no-i18n]') || (el.closest('svg') && !el.closest('text'));
  function targets(){
    const found = new Set();
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = tw.nextNode());) {
      if (!HANGUL.test(n.nodeValue)) continue;
      const el = n.parentElement;
      if (el && !skip(el)) found.add(el);
    }
    /* keep only the outermost ones; a nested <strong> travels with its paragraph */
    return [...found].filter(el => ![...found].some(o => o !== el && o.contains(el)));
  }
  function keyOf(el){
    const c = el.cloneNode(true);
    c.querySelectorAll('svg').forEach(s => s.replaceWith('{svg}'));
    return norm(c.innerHTML);
  }
  const ATTRS = ['alt', 'aria-label', 'title'];

  const items = targets().map(el => ({
    el, key: keyOf(el), ko: el.innerHTML,
    svgs: [...el.querySelectorAll('svg')].map(s => s.outerHTML),
  }));
  const attrs = [];
  document.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => {
    if (skip(el) && !el.matches('svg[aria-label]')) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v && HANGUL.test(v)) attrs.push({el, a, key: norm(v), ko: v});
    }
  });
  const meta = document.querySelector('meta[name="description"]');
  const head = {title: document.title, desc: meta ? meta.content : ''};

  /* for building the dictionary: every Korean string in page order */
  window.__i18nKeys = () => ({
    text: items.map(i => i.key),
    attrs: attrs.map(i => i.key),
    head: [norm(head.title), norm(head.desc)],
  });

  /* ---------- fonts for the scripts Pretendard does not cover ---------- */
  const G = 'https://fonts.googleapis.com/css2?display=swap&family=';
  const FONTS = {
    ja: [G + 'Noto+Sans+JP:wght@400..800', G + 'Noto+Serif+JP:wght@700'],
    'zh-Hans': [G + 'Noto+Sans+SC:wght@400..800', G + 'Noto+Serif+SC:wght@700'],
    'zh-Hant': [G + 'Noto+Sans+TC:wght@400..800', G + 'Noto+Serif+TC:wght@700'],
  };
  const loaded = new Set();
  function loadFonts(lang){
    for (const href of FONTS[lang] || []) {
      if (loaded.has(href)) continue;
      loaded.add(href);
      const l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = href;
      document.head.append(l);
    }
  }

  /* ---------- apply a language ---------- */
  const LANGS = ['ko', 'en', 'ja', 'zh-Hans', 'zh-Hant'];
  let current = 'ko';
  function apply(lang){
    if (!LANGS.includes(lang)) lang = 'ko';
    const d = T[lang] || {};
    loadFonts(lang);
    for (const it of items) {
      let html = lang === 'ko' ? null : d[it.key];
      if (html == null) { it.el.innerHTML = it.ko; continue; }
      let k = 0;
      it.el.innerHTML = html.replace(/\{svg\}/g, () => it.svgs[k++] || '');
    }
    for (const it of attrs) {
      const v = lang === 'ko' ? null : d[it.key];
      it.el.setAttribute(it.a, v == null ? it.ko : v);
    }
    document.title = (lang !== 'ko' && d[norm(head.title)]) || head.title;
    if (meta) meta.content = (lang !== 'ko' && d[norm(head.desc)]) || head.desc;
    document.documentElement.lang = lang;
    current = lang;

    /* switcher state */
    const box = document.getElementById('lang');
    if (box) {
      box.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-selected', b.dataset.lang === lang));
      const cur = box.querySelector('[data-lang="' + lang + '"]');
      box.querySelector('.lang-now').textContent = cur ? cur.textContent : '';
    }
    document.dispatchEvent(new CustomEvent('i18n:change', {detail: {lang}}));
  }

  /* ---------- the switcher ---------- */
  function store(lang){ try { localStorage.setItem('lang', lang); } catch (e) {} }
  function stored(){ try { return localStorage.getItem('lang'); } catch (e) { return null; } }

  const box = document.getElementById('lang');
  if (box) {
    const btn = box.querySelector('.lang-btn');
    const open = v => { box.classList.toggle('open', v); btn.setAttribute('aria-expanded', v); };
    btn.addEventListener('click', e => { e.stopPropagation(); open(!box.classList.contains('open')); });
    box.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
      open(false);
      if (b.dataset.lang === current) return;
      store(b.dataset.lang);
      const u = new URL(location.href);
      if (b.dataset.lang === 'ko') u.searchParams.delete('lang'); else u.searchParams.set('lang', b.dataset.lang);
      history.replaceState(null, '', u);
      apply(b.dataset.lang);
    }));
    document.addEventListener('click', e => { if (!box.contains(e.target)) open(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { open(false); } });
  }

  const q = new URLSearchParams(location.search).get('lang');
  const start = LANGS.includes(q) ? q : (LANGS.includes(stored()) ? stored() : 'ko');
  if (start !== 'ko') apply(start); else if (box) apply('ko');
  window.i18n = {apply, get lang(){ return current; }};
})();
