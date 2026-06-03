const DATA_URL = 'craft-budapest-schedule.json';
const STORAGE_KEY = 'craft2026_planned';

// States ordered low → high
const STATES = ['not-interested', 'neutral', 'interested', 'going'];

let events = [];
let plannedMap = new Map();

// Load saved data; migrate old array-of-IDs format → new {id: state} object
(function () {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed.forEach(id => plannedMap.set(id, 'going'));
    } else {
      Object.entries(parsed).forEach(([id, state]) => {
        if (STATES.includes(state)) plannedMap.set(id, state);
      });
    }
  } catch { /* ignore corrupt data */ }
}());

const STAGE_ORDER = [
  'Main Stage', 'Platform 2', 'Focus Platform', 'Yellow Stage',
  'Telekom Stage', 'Purple Stage', 'Green Stage', 'Innovation Stage',
  'Podcast Stage', "Tech Leaders' Lounge", 'Central Workshop Area',
  'Train Tracks', 'Sponsor Arena'
];

const SESSION_TYPES = ['keynote', 'talk', 'workshop', 'social', 'ceremony', 'other'];

function getState(id) {
  return plannedMap.get(id) || 'neutral';
}

function setState(id, state) {
  if (state === 'neutral') {
    plannedMap.delete(id);
  } else {
    plannedMap.set(id, state);
  }
  savePlanned();
  render();
}

function promote(id) {
  const idx = STATES.indexOf(getState(id));
  if (idx < STATES.length - 1) setState(id, STATES[idx + 1]);
}

function demote(id) {
  const idx = STATES.indexOf(getState(id));
  if (idx > 0) setState(id, STATES[idx - 1]);
}

function savePlanned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(plannedMap)));
  const count = [...plannedMap.values()].filter(s => s === 'interested' || s === 'going').length;
  document.getElementById('planned-count').textContent = count || '';
}

document.addEventListener('click', function (e) {
  const card = e.target.closest('.card[data-eid]');
  if (!card) return;
  if (e.target.closest('a')) return; // let title links through
  if (e.target.closest('.card-up-btn')) { promote(card.dataset.eid); return; }
  if (e.target.closest('.card-down-btn')) { demote(card.dataset.eid); return; }
  // card body click does nothing — use the Details button to navigate
});

function eventId(e) {
  return e.day + '|' + e.start + '|' + (e.stage || '') + '|' + e.title;
}

function isSessionVisible(e) {
  if (!SESSION_TYPES.includes(e.type)) return false;
  const state = getState(eventId(e));
  if (document.getElementById('filter-interesting').checked && state !== 'interested' && state !== 'going') return false;
  if (document.getElementById('filter-hide-ni').checked && state === 'not-interested') return false;
  return true;
}

function cardHTML(e, showStage) {
  if (!isSessionVisible(e)) return '';
  const id = eventId(e);
  const state = getState(id);
  const cardClass = [
    'card',
    'state-' + state,
    e.type === 'keynote' ? 'keynote-type' : '',
    e.type === 'workshop' ? 'workshop-type' : ''
  ].filter(Boolean).join(' ');
  const titleHTML = e.url
    ? `<a href="${e.url}" target="_blank" rel="noopener">${e.title}</a>`
    : e.title;
  const eid = id.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const urlAttr = e.url ? ` data-url="${e.url}"` : '';
  const downActive = state === 'not-interested' ? ' active' : '';
  const upExtra = state === 'going' ? ' going' : state === 'interested' ? ' interested' : '';
  const downTitle = state === 'not-interested' ? 'Not interested – click to restore' : 'Click to mark as not interested';
  const upTitle = state === 'going' ? 'Going – click to demote' : state === 'interested' ? 'Interested – click to promote to Going' : 'Click to mark as interested';
  const detailsBtn = e.url ? `<a class="card-details-btn" href="${e.url}" target="_blank" rel="noopener">Details ↗</a>` : '';
  return `<div class="${cardClass}" data-eid="${eid}"${urlAttr}>
    <div class="card-header">
      <div class="card-main">
        ${e.type !== 'talk' ? `<div class="card-type ${e.type}">${e.type}</div>` : ''}
        ${showStage && e.stage ? `<div class="stage-label">${e.stage}</div>` : ''}
        <div class="card-title">${e.title}</div>
      </div>
      <div class="card-state-btns">
        <button class="card-down-btn${downActive}" title="${downTitle}" aria-label="${downTitle}">▼</button>
        <button class="card-up-btn${upExtra}" title="${upTitle}" aria-label="${upTitle}">▲</button>
      </div>
    </div>
    ${e.speakers && e.speakers.length ? `<div class="card-speakers">${e.speakers.join(', ')}</div>` : ''}
    <div class="card-time">${e.start}–${e.end}</div>
    ${detailsBtn}
  </div>`;
}

function renderDesktop(dayDate, containerId) {
  const container = document.getElementById(containerId);
  const dayEvents = events.filter(e => e.day === dayDate);

  // Only show stages that have at least one visible session
  const stages = STAGE_ORDER.filter(s => dayEvents.some(e => e.stage === s && isSessionVisible(e)));
  const timeSlots = [...new Set(dayEvents.map(e => e.start))].sort();

  let html = '<div class="grid-wrap"><table class="schedule"><thead><tr>';
  html += '<th class="time-col">Time</th>';
  stages.forEach(s => { html += `<th>${s}</th>`; });
  html += '</tr></thead><tbody>';

  for (const time of timeSlots) {
    const slotEvents = dayEvents.filter(e => e.start === time);
    const isBreak = slotEvents.every(e => !SESSION_TYPES.includes(e.type));

    if (isBreak) {
      const be = slotEvents[0];
      html += `<tr><td class="time-cell">${time}</td><td colspan="${stages.length}" class="break-cell">${be.title} (${be.start}–${be.end})</td></tr>`;
      continue;
    }

    if (!slotEvents.some(e => isSessionVisible(e))) continue;

    html += `<tr><td class="time-cell">${time}</td>`;
    for (const stage of stages) {
      const stageEvents = slotEvents.filter(e => e.stage === stage);
      if (stageEvents.length === 0) {
        html += '<td class="empty-cell"></td>';
      } else {
        html += '<td>' + stageEvents.map(e => cardHTML(e, false)).join('') + '</td>';
      }
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function renderMobile(dayDate, containerId) {
  const container = document.getElementById(containerId);
  const dayEvents = events.filter(e => e.day === dayDate);
  const timeSlots = [...new Set(dayEvents.map(e => e.start))].sort();

  let html = '';
  for (const time of timeSlots) {
    const slotEvents = dayEvents.filter(e => e.start === time);
    const isBreak = slotEvents.every(e => !SESSION_TYPES.includes(e.type));

    const sessionCards = slotEvents
      .filter(e => SESSION_TYPES.includes(e.type))
      .map(e => cardHTML(e, true))
      .filter(Boolean)
      .join('');

    if (isBreak) {
      html += `<div class="time-block"><div class="time-label">${time}</div>
        <div class="break-card">${slotEvents[0].title} (${slotEvents[0].start}–${slotEvents[0].end})</div></div>`;
      continue;
    }

    if (!sessionCards) continue;

    html += `<div class="time-block"><div class="time-label">${time}</div>${sessionCards}</div>`;
  }
  container.innerHTML = html;
}

function renderPlanned() {
  const container = document.getElementById('planned-view');
  const days = [
    { date: '2026-06-04', label: 'Day 1 – Thursday, June 4' },
    { date: '2026-06-05', label: 'Day 2 – Friday, June 5' }
  ];

  const hasAny = [...plannedMap.values()].some(s => s === 'interested' || s === 'going');
  if (!hasAny) {
    container.innerHTML = '<div class="planned-empty">No sessions marked yet.<br>Use ▲ on any session to mark it as Interested or Going.</div>';
    return;
  }

  let html = '';
  for (const { date, label } of days) {
    for (const [state, stateLabel] of [['going', '✓ Going'], ['interested', '★ Interested']]) {
      const group = events
        .filter(e => e.day === date && getState(eventId(e)) === state)
        .sort((a, b) => a.start.localeCompare(b.start));
      if (group.length === 0) continue;
      html += `<div class="planned-day"><h3>${label} — ${stateLabel}</h3><div class="planned-list">`;
      html += group.map(e => cardHTML(e, true)).join('');
      html += '</div></div>';
    }
  }
  container.innerHTML = html || '<div class="planned-empty">No sessions marked yet.</div>';
}

function render() {
  renderDesktop('2026-06-04', 'desktop-day1');
  renderMobile('2026-06-04', 'mobile-day1');
  renderDesktop('2026-06-05', 'desktop-day2');
  renderMobile('2026-06-05', 'mobile-day2');
  renderPlanned();
}

let currentTab = 'day1';
function showTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
  document.querySelectorAll('.tab').forEach((el, i) => {
    el.classList.toggle('active', ['day1','day2','planned'][i] === tab);
  });
  document.querySelector('.controls').style.display = tab === 'planned' ? 'none' : 'flex';
}

fetch(DATA_URL)
  .then(r => r.json())
  .then(data => {
    events = data.events;
    savePlanned();
    render();
  })
  .catch(err => {
    document.getElementById('desktop-day1').innerHTML = `<p style="color:red;padding:20px">Failed to load schedule: ${err.message}</p>`;
  });
