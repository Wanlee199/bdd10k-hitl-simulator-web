/* BDD10K ActiveLab — shared behaviour: navigation, math, master–detail, tabs, filters,
   lightbox, copy, and a small set of SVG chart builders. Exposes window.AL. */
(() => {
'use strict';
const root = document.documentElement;
root.classList.add('js');
if (!root.lang) root.lang = 'vi';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const SVGNS = 'http://www.w3.org/2000/svg';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
function el(tag, attrs, parent, text) {
  const n = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (text != null) n.textContent = text;
  if (parent) parent.appendChild(n);
  return n;
}
const f = (v, d = 2) => (v == null ? '—' : v.toFixed(d));
const sg = (v, d = 2) => (v == null ? '—' : (v < -1e-9 ? '−' : '+') + Math.abs(v).toFixed(d));
const int = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ---------- math (KaTeX loads async; plain TeX shows until it arrives) ---------- */
function renderMath() {
  $$('.tex[data-tex]').forEach(n => {
    if (n.dataset.done) return;
    const tex = n.getAttribute('data-tex');
    if (window.katex) {
      try { window.katex.render(tex, n, { output: 'mathml', displayMode: true, throwOnError: false }); n.dataset.done = '1'; return; } catch (e) { /* fall back */ }
    }
    if (!n.firstChild) { const c = document.createElement('code'); c.textContent = tex; n.appendChild(c); }
  });
}

/* ---------- nav: scroll edge + scrollspy ---------- */
function initNav() {
  const nav = $('#nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const links = $$('.nav-links a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map(a => [a.hash.slice(1), a]));
  let cur = null;
  const set = id => {
    if (id === cur) return;
    cur = id;
    links.forEach(a => a.removeAttribute('aria-current'));
    const a = byId.get(id);
    if (!a) return;
    a.setAttribute('aria-current', 'true');
    const list = a.parentElement;
    if (list.scrollWidth > list.clientWidth + 2) {
      const left = list.scrollLeft + a.getBoundingClientRect().left - list.getBoundingClientRect().left - 8;
      list.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  };
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(e.target.id); }), { rootMargin: '-35% 0px -60% 0px' });
  const watch = $$('main > section[id]');
  watch.forEach(s => spy.observe(s));
}

/* ---------- points rail ---------- */
function initRail() {
  const cur = $('.rail .pt[aria-current="page"]');
  if (!cur) return;
  const ol = cur.closest('ol');
  if (ol && ol.scrollWidth > ol.clientWidth + 2) ol.scrollLeft = Math.max(0, cur.offsetLeft - 12);
}

/* ---------- master–detail ---------- */
function initMD(box) {
  const btns = $$('.stage-btn', box);
  if (!btns.length) return;
  const panels = btns.map(b => document.getElementById(b.getAttribute('aria-controls')));
  const list = btns[0].parentElement;
  let cur = Math.max(0, btns.findIndex(b => b.getAttribute('aria-pressed') === 'true'));
  function select(i, how) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    const prev = panels[cur];
    const focusGo = prev && prev.contains(document.activeElement) ? document.activeElement.dataset.go : null;
    cur = i;
    btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    panels.forEach((p, k) => { const on = k === i; p.classList.toggle('on', on); p.inert = !on; });
    const go = $$('[data-go]', panels[i]);
    go.forEach(b => { const d = Number(b.dataset.go); b.disabled = (d < 0 && i === 0) || (d > 0 && i === panels.length - 1); });
    if (focusGo) { const same = go.find(b => b.dataset.go === focusGo && !b.disabled) || go.find(b => !b.disabled); if (same) same.focus({ preventScroll: true }); }
    if (how === 'step' && list.scrollWidth > list.clientWidth + 2) {
      const b = btns[i];
      const left = list.scrollLeft + b.getBoundingClientRect().left - list.getBoundingClientRect().left - 4;
      list.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
    box.dispatchEvent(new CustomEvent('md:change', { detail: { index: i } }));
  }
  btns.forEach((b, k) => b.addEventListener('click', () => select(k)));
  list.addEventListener('keydown', e => {
    const k = btns.indexOf(document.activeElement);
    if (k < 0) return;
    let n = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = k + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = k - 1;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = btns.length - 1;
    if (n == null) return;
    e.preventDefault();
    n = Math.max(0, Math.min(btns.length - 1, n));
    select(n, 'step');
    btns[n].focus();
  });
  $$('[data-go]', box).forEach(b => b.addEventListener('click', () => select(cur + Number(b.dataset.go), 'step')));
  select(cur);
}

/* ---------- segmented tabs with static panels ---------- */
function initSeg(box) {
  const seg = $('.seg', box);
  if (!seg) return;
  const tabs = $$('[role="tab"]', seg);
  const thumb = $('.thumb', seg);
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
  let cur = Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'));
  function move(animate) {
    const b = tabs[cur];
    if (!thumb || !b || !b.offsetWidth) return;
    const instant = !animate || reduced.matches;
    if (instant) thumb.style.transition = 'none';
    thumb.style.width = b.offsetWidth + 'px';
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
    if (instant) { thumb.getBoundingClientRect(); thumb.style.transition = ''; }
  }
  function select(i, animate) {
    cur = i;
    tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    panels.forEach((p, k) => { if (p) p.hidden = k !== i; });
    move(animate);
    box.dispatchEvent(new CustomEvent('seg:change', { detail: { index: i } }));
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => select(k, true)));
  seg.addEventListener('keydown', e => {
    let i = cur;
    if (e.key === 'ArrowRight') i = Math.min(tabs.length - 1, cur + 1);
    else if (e.key === 'ArrowLeft') i = Math.max(0, cur - 1);
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = tabs.length - 1;
    else return;
    e.preventDefault();
    select(i, true);
    tabs[i].focus();
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => move(false)).observe(seg);
  select(cur, false);
}

/* ---------- filter chips + "show more" ---------- */
function initList(list) {
  const id = list.id;
  const items = $$(':scope > [data-tags]', list);
  const chips = $$(`[data-filter-for="${id}"] .chip`);
  const more = $(`[data-more-for="${id}"]`);
  const limit = Number(list.dataset.limit) || 0;
  let tag = (chips.find(c => c.getAttribute('aria-pressed') === 'true') || { dataset: { f: 'all' } }).dataset.f;
  let open = false;
  function apply() {
    const match = items.filter(it => tag === 'all' || it.dataset.tags.split(' ').includes(tag));
    items.forEach(it => { it.hidden = true; });
    match.forEach((it, i) => { it.hidden = !open && limit > 0 && i >= limit; });
    if (more) {
      const rest = match.length - limit;
      more.hidden = open || !limit || rest <= 0;
      more.textContent = (more.dataset.label || 'Hiện thêm {n} mục').replace('{n}', rest);
    }
  }
  chips.forEach(c => c.addEventListener('click', () => {
    tag = c.dataset.f;
    chips.forEach(x => x.setAttribute('aria-pressed', String(x === c)));
    open = false;
    apply();
  }));
  if (more) more.addEventListener('click', () => { open = true; apply(); });
  apply();
}

/* ---------- copy ---------- */
function initCopy() {
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => {
    const t = $(b.dataset.copy);
    if (!t) return;
    const text = t.textContent.trim();
    const fallback = () => {
      const r = document.createRange();
      r.selectNodeContents(t);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      toast('Đã chọn sẵn, nhấn Ctrl/⌘ + C để chép');
    };
    try {
      navigator.clipboard.writeText(text).then(() => toast(b.dataset.done || 'Đã sao chép'), fallback);
    } catch (e) { fallback(); }
  }));
}

/* ---------- lightbox ---------- */
const ICON = {
  left: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
};
function initLightbox() {
  const links = $$('[data-lb]');
  if (!links.length) return;
  const dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', 'Xem ảnh lớn');
  dlg.innerHTML = '<div class="lb-in"><div class="lb-img"><img alt=""></div><div class="lb-bar"><p class="lb-cap"></p><div class="lb-actions"><a class="lb-orig" target="_blank" rel="noopener">Mở bản gốc ↗</a><button class="lb-btn lb-prev" type="button" aria-label="Ảnh trước">' + ICON.left + '</button><button class="lb-btn lb-next" type="button" aria-label="Ảnh sau">' + ICON.right + '</button><button class="lb-btn lb-close" type="button" aria-label="Đóng">' + ICON.close + '</button></div></div></div>';
  document.body.appendChild(dlg);
  const img = $('.lb-img img', dlg), cap = $('.lb-cap', dlg), orig = $('.lb-orig', dlg);
  const prev = $('.lb-prev', dlg), next = $('.lb-next', dlg);
  let group = [], idx = 0;
  function show(i) {
    idx = i;
    const a = group[i];
    const thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = (thumb && thumb.alt) || '';
    cap.textContent = '';
    if (a.dataset.title) { const b = document.createElement('b'); b.textContent = a.dataset.title + ' '; cap.appendChild(b); }
    if (a.dataset.cap) cap.appendChild(document.createTextNode(a.dataset.cap));
    if (a.dataset.orig) { orig.href = a.dataset.orig; orig.hidden = false; } else { orig.hidden = true; }
    const solo = group.length < 2;
    prev.hidden = next.hidden = solo;
    prev.disabled = i === 0;
    next.disabled = i === group.length - 1;
  }
  links.forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    if (typeof dlg.showModal !== 'function') return;
    e.preventDefault();
    const name = a.dataset.lb;
    group = $$('[data-lb]').filter(x => x.dataset.lb === name && (x === a || x.getClientRects().length > 0));
    show(Math.max(0, group.indexOf(a)));
    dlg.showModal();
  }));
  prev.addEventListener('click', () => idx > 0 && show(idx - 1));
  next.addEventListener('click', () => idx < group.length - 1 && show(idx + 1));
  $('.lb-close', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && idx > 0) { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight' && idx < group.length - 1) { e.preventDefault(); show(idx + 1); }
  });
  dlg.addEventListener('close', () => { img.removeAttribute('src'); });
}

/* ---------- figures: fall back to a plain link when an image is missing ---------- */
function initFigures() {
  $$('.fig-card img').forEach(img => {
    const mark = () => img.closest('.fig-card').classList.add('noimg');
    img.addEventListener('error', mark);
    if (img.complete && img.getAttribute('src') && img.naturalWidth === 0) mark();
  });
}

/* ---------- chart helpers ---------- */
function tipFor(host) {
  let t = $(':scope > .tip', host);
  if (!t) { t = document.createElement('div'); t.className = 'tip'; t.setAttribute('aria-hidden', 'true'); host.appendChild(t); }
  return t;
}
function fillTip(tip, head, rows, foot) {
  tip.textContent = '';
  const h = document.createElement('div'); h.className = 'h'; h.textContent = head; tip.appendChild(h);
  (rows || []).forEach(([color, label, value, dashed]) => {
    const r = document.createElement('div'); r.className = 'r';
    const i = document.createElement('i');
    if (dashed) { i.style.height = '0'; i.style.borderTop = '1.5px dashed ' + color; } else { i.style.background = color; }
    const s = document.createElement('span'); s.textContent = label;
    const b = document.createElement('b'); b.textContent = value;
    r.append(i, s, b); tip.appendChild(r);
  });
  if (foot) { const fo = document.createElement('div'); fo.className = 'f'; fo.textContent = foot; tip.appendChild(fo); }
}
function placeTip(host, tip, x, y) {
  const W = host.clientWidth, tw = tip.offsetWidth, th = tip.offsetHeight;
  let left = x + 14;
  if (left + tw > W) left = x - tw - 14;
  if (left < 0) left = Math.max(0, Math.min(W - tw, x - tw / 2));
  let top = y - th - 10;
  if (top < -6) top = y + 16;
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}
function hideTip(tip) { tip.classList.remove('on'); }
function observe(host, draw) {
  let last = -1;
  const run = () => {
    const w = Math.round(host.clientWidth);
    if (w > 40 && w !== last) { last = w; draw(w); }
  };
  if ('ResizeObserver' in window) new ResizeObserver(run).observe(host);
  else window.addEventListener('resize', run);
  run();
  return () => { last = -1; run(); };
}
function freshSvg(host, W, H, label) {
  const old = $(':scope > svg', host);
  if (old) old.remove();
  const svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': label || '' });
  host.insertBefore(svg, $(':scope > .tip', host));
  return svg;
}
function scale(domain, range, log) {
  const [d0, d1] = domain, [r0, r1] = range;
  if (log) {
    const l0 = Math.log10(d0), l1 = Math.log10(d1);
    return v => r0 + (Math.log10(Math.max(v, d0)) - l0) / (l1 - l0) * (r1 - r0);
  }
  return v => r0 + (v - d0) / (d1 - d0) * (r1 - r0);
}
/* horizontal bar from xa to xb with a 4px rounded data end */
function hpath(xa, xb, y, h, r) {
  const w = Math.abs(xb - xa);
  r = Math.min(r, w, h / 2);
  if (w < 0.5) return `M${xa},${y}V${y + h}`;
  if (xb >= xa) return `M${xa},${y}H${xb - r}Q${xb},${y} ${xb},${y + r}V${y + h - r}Q${xb},${y + h} ${xb - r},${y + h}H${xa}Z`;
  return `M${xa},${y}H${xb + r}Q${xb},${y} ${xb},${y + r}V${y + h - r}Q${xb},${y + h} ${xb + r},${y + h}H${xa}Z`;
}
/* vertical bar from baseline y0 to y1 with a 4px rounded data end */
function vpath(cx, w, y0, y1, r) {
  const x = cx - w / 2, h = Math.abs(y1 - y0);
  r = Math.min(r, h, w / 2);
  if (h < 0.5) return `M${x},${y0}H${x + w}`;
  if (y1 < y0) return `M${x},${y0}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 + r}V${y0}Z`;
  return `M${x},${y0}V${y1 - r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 - r}V${y0}Z`;
}
function rowHover(g, host, tip, make) {
  g.addEventListener('pointerenter', () => { make(); tip.classList.add('on'); });
  g.addEventListener('pointerleave', () => hideTip(tip));
}
const COLORS = { a: 'var(--accent)', b: 'var(--base)', t: 'var(--ink-2)' };

/* hbar — horizontal bars. rows: [{label, value | values[], hl, head, foot}] */
function hbar(host, o) {
  const tip = tipFor(host);
  return observe(host, W => {
    const ns = o.series ? o.series.length : 1;
    const lw = Math.round(Math.min(o.labelW || 170, W * (W < 520 ? 0.4 : 0.32)));
    const bh = ns > 1 ? 9 : 14, gap = 2, rowH = o.rowH || (ns > 1 ? 32 : 30);
    const m = { t: 4, r: o.padR || 60, b: 26, l: lw + 12 };
    const H = m.t + o.rows.length * rowH + m.b;
    const x0 = m.l, x1 = W - m.r;
    const X = scale(o.domain, [x0, x1], o.log);
    const svg = freshSvg(host, W, H, o.aria);
    o.ticks.forEach(t => {
      el('line', { x1: X(t), x2: X(t), y1: m.t, y2: H - m.b, class: 'c-grid' }, svg);
      el('text', { x: X(t), y: H - m.b + 17, class: 'c-tick', 'text-anchor': 'middle' }, svg, o.tickFmt ? o.tickFmt(t) : String(t));
    });
    el('line', { x1: x0, x2: x0, y1: m.t, y2: H - m.b, class: 'c-axis' }, svg);
    o.rows.forEach((r, i) => {
      const yc = m.t + i * rowH + rowH / 2;
      const g = el('g', { class: 'c-row' }, svg);
      el('rect', { x: 0, y: yc - rowH / 2 + 1, width: W, height: rowH - 2, rx: 6, class: 'c-rowbg' }, g);
      el('text', { x: x0 - 10, y: yc + 4, class: 'c-cls' + (r.hl ? ' strong' : ''), 'text-anchor': 'end' }, g, r.label);
      const vals = ns > 1 ? r.values : [r.value];
      vals.forEach((v, s) => {
        const y = yc - (ns * bh + (ns - 1) * gap) / 2 + s * (bh + gap);
        const cls = ns > 1 ? o.series[s].cls : (r.hl ? 'b-pos' : 'b-base');
        el('path', { d: hpath(x0, X(v), y, bh, 4), class: cls }, g);
        if (ns === 1 || o.labelAll) el('text', { x: X(v) + 6, y: y + bh / 2 + 4, class: 'c-val' + (r.hl || (ns > 1 && s === 0) ? '' : ' muted') }, g, o.fmt(v));
      });
      rowHover(g, host, tip, () => {
        const rows = ns > 1 ? o.series.map((s, k) => [s.color, s.name, o.fmt(r.values[k])]) : [[r.hl ? COLORS.a : COLORS.b, o.valueName || 'Giá trị', o.fmt(r.value)]];
        fillTip(tip, r.head || r.label, rows, r.foot);
        placeTip(host, tip, Math.min(X(Math.max(...vals)), x1), yc - 6);
      });
    });
  });
}

/* dumbbell — two values per row (a accent, b base), optional target tick t */
function dumbbell(host, o) {
  const tip = tipFor(host);
  return observe(host, W => {
    const narrow = W < 440;
    const m = { t: 4, r: o.padR || 50, b: 28, l: Math.round(Math.min(o.labelW || (narrow ? 84 : 112), W * 0.36)) };
    const rowH = o.rowH || 27, H = m.t + o.rows.length * rowH + m.b;
    const x0 = m.l, x1 = W - m.r;
    const X = scale(o.domain, [x0, x1], o.log);
    const svg = freshSvg(host, W, H, o.aria);
    o.ticks.forEach((t, i) => {
      el('line', { x1: X(t), x2: X(t), y1: m.t, y2: H - m.b, class: i === 0 ? 'c-axis' : 'c-grid' }, svg);
      if (!narrow || i % 2 === 0) el('text', { x: X(t), y: H - m.b + 18, class: 'c-tick', 'text-anchor': 'middle' }, svg, o.tickFmt ? o.tickFmt(t) : String(t));
    });
    o.rows.forEach((r, k) => {
      const yc = m.t + k * rowH + rowH / 2;
      const g = el('g', { class: 'c-row' }, svg);
      el('rect', { x: 0, y: yc - rowH / 2 + 1, width: W, height: rowH - 2, rx: 6, class: 'c-rowbg' }, g);
      el('text', { x: x0 - 10, y: yc + 4, class: 'c-cls', 'text-anchor': 'end' }, g, r.label);
      const lo = Math.min(r.a, r.b), hi = Math.max(r.a, r.b);
      if (X(hi) - X(lo) > 1) el('line', { x1: X(lo), x2: X(hi), y1: yc, y2: yc, class: 'c-track' }, g);
      if (r.t != null) el('line', { x1: X(r.t), x2: X(r.t), y1: yc - 7, y2: yc + 7, class: 'c-tgt' }, g);
      el('circle', { cx: X(r.b), cy: yc, r: 4, class: 'm-r' }, g);
      el('circle', { cx: X(r.a), cy: yc, r: 5, class: 'm-a' }, g);
      if (r.right != null) el('text', { x: W - 2, y: yc + 4, class: 'c-dl', 'text-anchor': 'end' }, g, r.right);
      rowHover(g, host, tip, () => {
        const rows = [[COLORS.a, o.aName, o.fmt(r.a)], [COLORS.b, o.bName, o.fmt(r.b)]];
        if (r.t != null) rows.push([COLORS.t, o.tName, o.fmt(r.t), true]);
        fillTip(tip, r.head || r.label, rows, r.foot);
        placeTip(host, tip, X(Math.max(r.a, r.b, r.t == null ? -Infinity : r.t)), yc - 4);
      });
    });
  });
}

/* strip — many points per group on one axis (deterministic jitter) */
function strip(host, o) {
  const tip = tipFor(host);
  return observe(host, W => {
    const m = { t: o.band ? 22 : 6, r: 14, b: 28, l: Math.round(Math.min(o.labelW || 76, W * 0.3)) };
    const rowH = o.rowH || 46, H = m.t + o.groups.length * rowH + m.b;
    const x0 = m.l, x1 = W - m.r;
    const X = scale(o.domain, [x0, x1], o.log);
    const svg = freshSvg(host, W, H, o.aria);
    if (o.band) {
      const [lo, hi, label] = o.band;
      el('rect', { x: X(lo), y: m.t, width: Math.max(0, X(hi) - X(lo)), height: H - m.t - m.b, class: 'c-band' }, svg);
      if (label) el('text', { x: (X(lo) + X(hi)) / 2, y: m.t - 7, class: 'c-note', 'text-anchor': 'middle' }, svg, label);
    }
    o.ticks.forEach(t => {
      el('line', { x1: X(t), x2: X(t), y1: m.t, y2: H - m.b, class: 'c-grid' }, svg);
      el('text', { x: X(t), y: H - m.b + 18, class: 'c-tick', 'text-anchor': 'middle' }, svg, o.tickFmt ? o.tickFmt(t) : String(t));
    });
    const pts = [];
    o.groups.forEach((gp, gi) => {
      const yc = m.t + gi * rowH + rowH / 2;
      el('line', { x1: x0, x2: x1, y1: yc, y2: yc, class: 'c-grid' }, svg);
      el('text', { x: x0 - 10, y: yc + 4, class: 'c-cls', 'text-anchor': 'end' }, svg, gp.label);
      gp.pts.forEach((p, j) => {
        const jy = (((j * 0.6180339887) % 1) - 0.5) * (rowH - 20);
        const cx = X(p.v), cy = yc + jy;
        el('circle', { cx, cy, r: 4, class: gp.cls || 'm-a' }, svg);
        pts.push({ cx, cy, p, gp });
      });
    });
    const ov = el('rect', { x: 0, y: 0, width: W, height: H, fill: 'transparent' }, svg);
    ov.addEventListener('pointermove', ev => {
      const r = svg.getBoundingClientRect();
      const px = ev.clientX - r.left, py = ev.clientY - r.top;
      let best = null, bd = 18 * 18;
      pts.forEach(q => { const d = (q.cx - px) ** 2 + (q.cy - py) ** 2; if (d < bd) { bd = d; best = q; } });
      if (!best) { hideTip(tip); return; }
      fillTip(tip, best.p.head, best.p.rows, best.p.foot);
      placeTip(host, tip, best.cx, best.cy);
      tip.classList.add('on');
    });
    ov.addEventListener('pointerleave', () => hideTip(tip));
  });
}

/* diverge — signed bars around zero */
function diverge(host, o) {
  const tip = tipFor(host);
  return observe(host, W => {
    const m = { t: 4, r: 48, b: 26, l: Math.round(Math.min(o.labelW || 104, W * 0.34)) };
    const rowH = o.rowH || 26, bh = 14, H = m.t + o.rows.length * rowH + m.b;
    const x0 = m.l, x1 = W - m.r;
    const X = scale(o.domain, [x0, x1]);
    const svg = freshSvg(host, W, H, o.aria);
    o.ticks.forEach(t => {
      el('line', { x1: X(t), x2: X(t), y1: m.t, y2: H - m.b, class: t === 0 ? 'c-axis' : 'c-grid' }, svg);
      el('text', { x: X(t), y: H - m.b + 17, class: 'c-tick', 'text-anchor': 'middle' }, svg, o.tickFmt ? o.tickFmt(t) : String(t));
    });
    o.rows.forEach((r, i) => {
      const yc = m.t + i * rowH + rowH / 2;
      const g = el('g', { class: 'c-row' }, svg);
      el('rect', { x: 0, y: yc - rowH / 2 + 1, width: W, height: rowH - 2, rx: 6, class: 'c-rowbg' }, g);
      el('text', { x: x0 - 10, y: yc + 4, class: 'c-cls', 'text-anchor': 'end' }, g, r.label);
      el('path', { d: hpath(X(0), X(r.v), yc - bh / 2, bh, 4), class: r.v >= 0 ? 'b-pos' : 'b-neg' }, g);
      const right = r.v >= 0;
      el('text', { x: X(r.v) + (right ? 6 : -6), y: yc + 4, class: 'c-val', 'text-anchor': right ? 'start' : 'end' }, g, o.fmt(r.v));
      rowHover(g, host, tip, () => {
        fillTip(tip, r.head || r.label, r.rows || [[r.v >= 0 ? COLORS.a : COLORS.b, o.valueName || 'Chênh lệch', o.fmt(r.v)]], r.foot);
        placeTip(host, tip, X(r.v), yc - 6);
      });
    });
  });
}

/* ---------- boot ---------- */
function boot() {
  initNav();
  initRail();
  renderMath();
  const ks = $('script[src*="katex"]');
  if (!window.katex && ks) ks.addEventListener('load', renderMath);
  $$('[data-md]').forEach(initMD);
  $$('[data-seg]').forEach(initSeg);
  $$('[data-list]').forEach(initList);
  initCopy();
  initFigures();
  initLightbox();
}

window.AL = { $, $$, el, f, sg, int, toast, tipFor, fillTip, placeTip, hideTip, observe, freshSvg, scale, hpath, vpath, hbar, dumbbell, strip, diverge, renderMath, reduced, COLORS };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
