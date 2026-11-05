// The proof section's behaviour: the inbox opens its chats, a card opens its message in a sheet,
// the numbers count up, the strip drifts, and a finger shows once that the chats open.
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Construct the observer, arm, then observe. No entry within a second means it is broken: reveal.
function watch(els, onEnter, onLeave, arm, reveal) {
  if (!els.length) return;
  let io;
  try {
    io = new IntersectionObserver(entries => entries.forEach(e => {
      e.target._seen = true;
      if (e.isIntersecting) onEnter(e.target); else if (onLeave) onLeave(e.target);
    }), { threshold: 0.25 });
  } catch { els.forEach(reveal || onEnter); return; }
  els.forEach(el => { if (arm) arm(el); io.observe(el); });
  setTimeout(() => els.forEach(el => { if (!el._seen) (reveal || onEnter)(el); }), 1000);
}

// ---------- WhatsApp ----------
const sheet = document.getElementById('wa-sheet');
function markRead(id) {
  document.querySelectorAll(`.wa-row[data-chat="${id}"]`).forEach(r => {
    r.classList.remove('is-unread');
    r.querySelector('.wa-badge')?.remove();
  });
  document.querySelectorAll('.wa').forEach(wa => {
    const uc = wa.querySelector('.wa-uc');
    if (uc) uc.textContent = wa.querySelectorAll('.wa-row.is-unread').length || '';
  });
}
function initWa(wa) {
  const list = wa.querySelector('.wa-list');
  let current = null, lastRow = null;
  // A one-screen phone is no taller than its list: no empty band under the last chat.
  if (!wa.hasAttribute('data-sheet')) {
    const rows = wa.querySelector('.wa-rows');
    const natural = list.clientHeight - rows.clientHeight + rows.scrollHeight;
    if (natural < wa.clientHeight) wa.style.height = Math.ceil(natural + (wa.offsetHeight - wa.clientHeight)) + 'px';
  }
  function open(id, msg, instant) {
    const chat = wa.querySelector(`.wa-chat[data-chat="${id}"]`);
    if (!chat) return;
    if (current && current !== chat) { current.classList.remove('is-open'); current.hidden = true; }
    wa.classList.toggle('no-anim', !!instant);
    chat.hidden = false;
    chat.offsetWidth; // let the hidden screen take its start position before it moves
    chat.classList.add('is-open');
    wa.classList.add('in-chat');
    list.inert = true; chat.inert = false;
    current = chat;
    markRead(id);
    const body = chat.querySelector('.wa-body');
    const m = msg && body.querySelector(`[data-msg="${msg}"]`);
    body.scrollTop = m ? Math.max(0, m.offsetTop - 70) : 0;
    if (m && !RM) { m.classList.remove('flash'); m.offsetWidth; m.classList.add('flash'); }
    chat.querySelector('.wa-back').focus({ preventScroll: true });
  }
  function back() {
    if (!current) return;
    if (wa.hasAttribute('data-sheet')) { sheet.close(); return; }
    wa.classList.remove('no-anim', 'in-chat');
    const chat = current;
    chat.classList.remove('is-open');
    chat.inert = true; list.inert = false;
    const done = () => { if (!chat.classList.contains('is-open')) chat.hidden = true; };
    RM ? done() : setTimeout(done, 380);
    current = null;
    lastRow?.focus({ preventScroll: true });
  }
  function reset() {
    if (!current) return;
    current.classList.remove('is-open'); current.hidden = true; current.inert = true;
    wa.classList.remove('in-chat'); list.inert = false; current = null;
  }
  wa.addEventListener('click', e => {
    const row = e.target.closest('.wa-row');
    if (row) { lastRow = row; open(row.dataset.chat); return; }
    if (e.target.closest('.wa-back')) back();
  });
  wa.addEventListener('keydown', e => { if (e.key === 'Escape' && current && !wa.hasAttribute('data-sheet')) back(); });
  wa._open = open; wa._reset = reset;
}
document.querySelectorAll('[data-wa]').forEach(initWa);

// A card opens the real message in a sheet.
if (sheet) {
  const swa = sheet.querySelector('.wa');
  let opener = null;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open]');
    if (!t || sheet.contains(t)) return;
    if (t.closest('.drift')?._dragged) return;
    const [chat, msg] = t.dataset.open.split(':');
    opener = t;
    sheet.showModal();
    swa._open(chat, msg, true);
  });
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('close', () => { swa._reset(); opener?.focus({ preventScroll: true }); });
}

// ---------- numbers count up when they arrive ----------
const counters = [...document.querySelectorAll('[data-count]')];
if (!RM) watch(counters, box => {
  if (box._played) return; box._played = true;
  box.querySelectorAll('.n[data-to]').forEach(n => {
    const to = +n.dataset.to, v = n.querySelector('.v'), t0 = performance.now(), dur = 1400;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      v.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, null, box => box.querySelectorAll('.n[data-to] .v').forEach(v => { v.textContent = '0'; }),
box => box.querySelectorAll('.n[data-to]').forEach(n => { n.querySelector('.v').textContent = n.dataset.to; }));

// ---------- the strip: a real scroller, drifted slowly; a finger or a mouse takes over ----------
// RTL scrollers count scrollLeft from 0 at the start down to negative; lowering it moves the cards right.
function initDrift(d) {
  const track = d.querySelector('.drift-track'), set = track.firstElementChild;
  for (let k = 0; k < 2; k++) {
    const c = set.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('button').forEach(b => { b.tabIndex = -1; });
    track.appendChild(c);
  }
  d.classList.add('js-armed');
  const speed = +d.dataset.speed || 26;
  let w = set.getBoundingClientRect().width;
  let pos = -w, running = false, holdUntil = 0, last = 0;
  d.scrollLeft = pos;
  const wrap = () => {
    let shifted = false;
    while (pos <= -2 * w) { pos += w; shifted = true; }
    while (pos > -0.5 * w) { pos -= w; shifted = true; }
    return shifted;
  };
  const hold = ms => { holdUntil = Math.max(holdUntil, performance.now() + ms); };
  function frame(t) {
    if (!running) return;
    const dt = last ? Math.min(64, t - last) : 0;
    last = t;
    if (t > holdUntil) {
      pos -= speed * dt / 1000;
      wrap();
      d.scrollLeft = pos;
    }
    requestAnimationFrame(frame);
  }
  const start = () => { if (!running) { running = true; last = 0; requestAnimationFrame(frame); } };
  const stop = () => { running = false; };
  // Anything that moves the row other than the drift is a person: follow them, then wait.
  d.addEventListener('scroll', () => {
    if (Math.abs(d.scrollLeft - pos) > 2) {
      pos = d.scrollLeft;
      hold(2500);
      if (wrap()) d.scrollLeft = pos;
    }
  }, { passive: true });
  d.addEventListener('touchstart', () => hold(1e9), { passive: true });
  d.addEventListener('touchend', () => { holdUntil = 0; hold(2500); }, { passive: true });
  d.addEventListener('wheel', () => hold(2500), { passive: true });
  d.addEventListener('mouseenter', () => hold(1e9));
  d.addEventListener('mouseleave', () => { holdUntil = 0; hold(600); });
  // A mouse drags the row like a finger would.
  let drag = null;
  d.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, sl: d.scrollLeft, moved: false };
    d._dragged = false;
  });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; d.classList.add('is-dragging'); }
    if (drag.moved) {
      pos = drag.sl - dx;
      const before = pos;
      if (wrap()) drag.sl += pos - before;
      d.scrollLeft = pos;
      hold(2500);
    }
  });
  window.addEventListener('pointerup', () => {
    if (!drag) return;
    d._dragged = drag.moved;
    setTimeout(() => { d._dragged = false; }, 0);
    d.classList.remove('is-dragging');
    drag = null;
  });
  window.addEventListener('resize', () => { w = set.getBoundingClientRect().width; });
  return { start, stop };
}
const drifts = [...document.querySelectorAll('[data-drift]')];
if (!RM) watch(drifts, d => d._drift.start(), d => d._drift.stop(), d => { d._drift = initDrift(d); });

// ---------- once, when the phone is well in view: a finger taps the first chat twice ----------
// Shows that the chats open. Never repeats, and a reader who touches the phone first cancels it.
const demoWa = document.querySelector('.inbox-wrap .wa[data-demo]');
if (demoWa && !RM) {
  let done = false;
  demoWa.addEventListener('pointerdown', () => { done = true; }, { once: true });
  try {
    const io = new IntersectionObserver(es => {
      if (done || !es.some(e => e.isIntersecting)) return;
      io.disconnect();
      setTimeout(() => { if (!done) tapDemo(demoWa); }, 700);
    }, { threshold: 0.6 });
    io.observe(demoWa);
  } catch {}
}
function tapDemo(wa) {
  const row = wa.querySelector('.wa-list:not([inert]) .wa-row');
  if (!row) return;
  const hand = document.createElement('span');
  hand.className = 'wa-hand';
  hand.textContent = '👆';
  hand.setAttribute('aria-hidden', 'true');
  const wr = wa.getBoundingClientRect(), rr = row.getBoundingClientRect();
  hand.style.left = (rr.left - wr.left + rr.width * 0.45) + 'px';
  hand.style.top = (rr.top - wr.top + rr.height * 0.5) + 'px';
  wa.appendChild(hand);
  hand.classList.add('go');
  const tap = () => { row.classList.remove('wa-tap'); row.offsetWidth; row.classList.add('wa-tap'); };
  setTimeout(tap, 600);
  setTimeout(tap, 2200);
  setTimeout(() => { hand.remove(); row.classList.remove('wa-tap'); }, 3300);
}
