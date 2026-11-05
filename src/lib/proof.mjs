// The home page's proof: a WhatsApp inbox of the alumni's real messages, a drifting strip of what
// they built, and the numbers. Rendered at build time from src/data/proof.json.

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Text in bubbles is plain; Latin runs get <bdi> so they never fuse with a number beside them.
const bubbleText = s => esc(s).replace(/(?<![&A-Za-z])([A-Za-z](?:[A-Za-z0-9.\-]*[A-Za-z0-9])?(?: [A-Za-z](?:[A-Za-z0-9.\-]*[A-Za-z0-9])?)*)/g, '<bdi>$1</bdi>');

const I = {
  person: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="7" fill="#fff"/><path d="M6 36c1.5-8 7-12 14-12s12.5 4 14 12" fill="#fff"/></svg>',
  group: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="15" cy="16" r="5.5" fill="#fff"/><circle cx="26" cy="15" r="5" fill="#fff" opacity=".85"/><path d="M4 33c1-6 5.5-9 11-9s10 3 11 9" fill="#fff"/><path d="M22 23.5c1.3-.4 2.6-.5 4-.5 5 0 9 2.8 10 8.5h-8" fill="#fff" opacity=".85"/></svg>',
  cam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5.5" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="18.5" r="1.8" fill="currentColor"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="12" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 11l6-3v8l-6-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  smile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="10" r="1.1" fill="currentColor"/><circle cx="15" cy="10" r="1.1" fill="currentColor"/><path d="M8.5 14a4 4 0 0 0 7 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  clip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12.5l6.5-6.5a3 3 0 0 1 4.2 4.2l-8 8a5 5 0 0 1-7-7L11 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  ticks: '<svg viewBox="0 0 18 11" aria-hidden="true"><path d="M1 6l3 3 6-7M7 9l1 1 6-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  navChats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5l1.2-3.6A8 8 0 1 1 8 18.6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  navUpd: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="11 2.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  navComm: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.5" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 19c.8-3.5 3-5 5.5-5s4.7 1.5 5.5 5M14 15c.8-.5 1.6-.7 2.5-.7 2 0 3.7 1.3 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  navCalls: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
};

export function renderProof(D) {
  const P = D.people;

  // ---------- the WhatsApp inbox ----------
  const chatTitle = c => c.group ? c.title : P[c.who].name;
  // A face appears only once its owner consents (a `photo` in the data); until then, the grey silhouette.
  const waAv = (c, cls = '') => {
    const photo = !c.group && P[c.who].photo;
    return `<span class="wa-av ${cls}">${photo ? `<img src="${photo}" alt="" loading="lazy">` : c.group ? I.group : I.person}</span>`;
  };
  const unreadOf = c => {
    let n = 0;
    for (const m of c.msgs) { if (!m.from) continue; n = m.from === 'guy' ? 0 : n + 1; }
    return n;
  };
  const previewOf = c => {
    const last = [...c.msgs].reverse().find(m => m.from);
    const first = last.text.split('\n')[0];
    if (last.from === 'guy') return `<span class="wa-tk">${I.ticks}</span>${bubbleText(first)}`;
    return (c.group ? `${esc(P[last.from].name)}: ` : '') + bubbleText(first);
  };
  const waList = total => {
    const rows = D.chats.map(c => {
      const u = unreadOf(c);
      return `<li><button type="button" class="wa-row${u ? ' is-unread' : ''}" data-chat="${c.id}">${waAv(c)}
        <span class="wa-mid"><span class="wa-l1"><span class="wa-name">${esc(chatTitle(c))}</span><span class="wa-time">${c.when}</span></span>
        <span class="wa-l2"><span class="wa-pv">${previewOf(c)}</span>${u ? `<span class="wa-badge" aria-label="${u} הודעות שלא נקראו">${u}</span>` : ''}</span></span></button></li>`;
    }).join('');
    return `<div class="wa-screen wa-list"><div class="wa-top"><span class="wa-brand">WhatsApp</span><span class="wa-icons"><span class="wa-ic">${I.cam}</span><span class="wa-ic">${I.dots}</span></span></div>
      <div class="wa-search">${I.search}<span>חיפוש</span></div>
      <div class="wa-chips"><span class="on">הכל</span><span>לא נקראו <b class="wa-uc">${total}</b></span><span>מועדפים</span><span>קבוצות</span></div>
      <ul class="wa-rows">${rows}</ul>
      <nav class="wa-nav" aria-hidden="true"><span class="on"><i>${I.navChats}</i>צ'אטים</span><span><i>${I.navUpd}</i>עדכונים</span><span><i>${I.navComm}</i>קהילות</span><span><i>${I.navCalls}</i>שיחות</span></nav></div>`;
  };
  const waChat = c => {
    let prev = null;
    const body = c.msgs.map(m => {
      if (m.d) { prev = null; return `<div class="wa-date"><span>${m.d}</span></div>`; }
      const out = m.from === 'guy';
      const first = prev !== m.from;
      prev = m.from;
      const name = c.group && !out && first ? `<span class="wa-from" style="color:${P[m.from].wa}">${esc(P[m.from].name)}</span>` : '';
      // In a group, the sender's face sits beside the first message of each run, as WhatsApp draws it.
      const face = c.group && !out && first ? `<span class="wa-gav" aria-hidden="true">${P[m.from].photo ? `<img src="${P[m.from].photo}" alt="" loading="lazy">` : I.person}</span>` : '';
      return `<div class="wa-msg ${out ? 'out' : 'in'}${first ? ' tail' : ''}"${m.id ? ` data-msg="${m.id}"` : ''}>${face}${name}<span class="wa-text">${bubbleText(m.text)}</span><span class="wa-meta">${m.t}${out ? `<span class="wa-tk">${I.ticks}</span>` : ''}</span></div>`;
    }).join('');
    const sub = bubbleText(c.group ? c.sub : (P[c.who].trade || 'בוגר הסדנה'));
    return `<div class="wa-screen wa-chat" data-chat="${c.id}" hidden>
      <div class="wa-head"><button type="button" class="wa-back" aria-label="חזרה לרשימת השיחות">${I.back}</button>${waAv(c, 'sm')}
        <span class="wa-hid"><span class="wa-hname">${esc(chatTitle(c))}</span><span class="wa-hsub">${sub}</span></span>
        <span class="wa-icons"><span class="wa-ic">${I.video}</span><span class="wa-ic">${I.phone}</span><span class="wa-ic">${I.dots}</span></span></div>
      <div class="wa-body" tabindex="0" aria-label="ההודעות">${body}</div>
      <div class="wa-input" aria-hidden="true"><span class="wa-field"><span class="wa-ic">${I.smile}</span><span class="wa-ph">הודעה</span><span class="wa-ic">${I.clip}</span><span class="wa-ic">${I.cam}</span></span><span class="wa-mic">${I.mic}</span></div></div>`;
  };
  // `attrs` marks the copy on the page (data-demo, the one-time tap) or the one in the sheet (data-sheet).
  const inbox = attrs => {
    const total = D.chats.filter(c => unreadOf(c)).length;
    return `<div class="wa wa-android" ${attrs} data-wa>${waList(total)}${D.chats.map(waChat).join('')}</div>`;
  };

  // ---------- what they built, and the numbers ----------
  const whoLine = who => `<span class="who"><span class="av" aria-hidden="true">${P[who].ini}</span><span class="who-t"><b class="nm">${esc(P[who].first)}</b>${P[who].trade ? `<span class="tr">${esc(P[who].trade)}</span>` : ''}</span></span>`;
  const go = short => `<span class="go go-link"><span>${short ? 'להודעה' : 'לקרוא את ההודעה המקורית'}</span><span aria-hidden="true">←</span></span>`;
  const bcard = b => `<button type="button" class="card bcard" data-open="${b.open}">${whoLine(b.who)}<span class="bc-text">${b.text}</span>${go(false)}</button>`;
  const strip = `<div class="drift" data-drift data-speed="28"><div class="drift-track"><div class="drift-set">${D.builds.map(b => bcard(b)).join('')}</div></div></div>`;
  const numVal = n => n.unit ? `<span class="v">${n.to}</span>${n.suffix}<small>${n.unit}</small>` : `<span class="v">${n.to}</span>${n.suffix}`;
  const nums = `<ul class="nums" data-count>${D.nums.map(n => `<li class="num"><button type="button" data-open="${n.open}"><span class="n" data-to="${n.to}">${numVal(n)}</span>
    <span class="num-t">${n.text}</span><span class="num-who">${esc(P[n.who].first)}${go(true)}</span></button></li>`).join('')}</ul>`;

  return {
    inbox: `<div class="inbox-wrap">${inbox('data-demo')}</div><p class="honest">ההודעות מתפרסמות בשמם ובאישורם.</p>`,
    strip,
    nums,
    sheet: inbox('data-sheet'),
  };
}
