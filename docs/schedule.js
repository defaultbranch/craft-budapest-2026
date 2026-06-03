const DATA_URL = 'craft-budapest-schedule.json';
const STORAGE_KEY = 'craft2026_planned';

let events = [];
let planned = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

const STAGE_ORDER = [
  'Main Stage', 'Platform 2', 'Focus Platform', 'Yellow Stage',
  'Telekom Stage', 'Purple Stage', 'Green Stage', 'Innovation Stage',
  'Podcast Stage', "Tech Leaders' Lounge", 'Central Workshop Area',
  'Train Tracks', 'Sponsor Arena'
];

const SESSION_TYPES = ['keynote','talk','workshop','social','ceremony','other'];

function savePlanned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...planned]));
  document.getElementById('planned-count').textContent = planned.size;
}

function togglePlanned(id) {
  if (planned.has(id)) { planned.delete(id); } else { planned.add(id); }
  savePlanned();
  render();
}

document.addEventListener('click', function(e) {
  const card = e.target.closest('.card[data-eid]');
  if (!card) return;
  if (e.target.closest('a')) return; // let title links through
  if (e.target.closest('.card-plan-btn')) {
    togglePlanned(card.dataset.eid);
    return;
  }
  // clicking anywhere else on the card opens the session URL
  const url = card.dataset.url;
  if (url) window.open(url, '_blank', 'noopener');
});

function eventId(e) {
  return e.day + '|' + e.start + '|' + (e.stage||'') + '|' + e.title;
}

function cardHTML(e, showStage) {
  const id = eventId(e);
  const isPlanned = planned.has(id);
  const filterOn = document.getElementById('filter-planned').checked;
  if (filterOn && !isPlanned && SESSION_TYPES.includes(e.type)) return '';
  const cardClass = [
    'card',
    isPlanned ? 'planned' : '',
    e.type === 'keynote' ? 'keynote-type' : '',
    e.type === 'workshop' ? 'workshop-type' : ''
  ].filter(Boolean).join(' ');
  const titleHTML = e.url
    ? `<a href="${e.url}" target="_blank" rel="noopener">${e.title}</a>`
    : e.title;
  const eid = id.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  const urlAttr = e.url ? ` data-url="${e.url}"` : '';
  const cardTitle = e.url ? `Click to open session page` : `Click ✓ to add to plan`;
  return `<div class="${cardClass}" data-eid="${eid}"${urlAttr} title="${cardTitle}">
    <button class="card-plan-btn" aria-label="${isPlanned?'Remove from':'Add to'} plan">✓</button>
    ${e.type !== 'talk' ? `<div class="card-type ${e.type}">${e.type}</div>` : ''}
    ${showStage ? `<div class="stage-label">${e.stage}</div>` : ''}
    <div class="card-title">${titleHTML}</div>
    ${e.speakers && e.speakers.length ? `<div class="card-speakers">${e.speakers.join(', ')}</div>` : ''}
    <div class="card-time">${e.start}–${e.end}</div>
  </div>`;
}

function renderDesktop(dayDate, containerId) {
  const container = document.getElementById(containerId);
  const dayEvents = events.filter(e => e.day === dayDate);
  const filterOn = document.getElementById('filter-planned').checked;

  const stages = STAGE_ORDER.filter(s => dayEvents.some(e => e.stage === s));
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

    if (filterOn) {
      const hasVisible = slotEvents.some(e => SESSION_TYPES.includes(e.type) && planned.has(eventId(e)));
      if (!hasVisible) continue;
    }

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
  const filterOn = document.getElementById('filter-planned').checked;
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

  if (planned.size === 0) {
    container.innerHTML = '<div class="planned-empty">No talks planned yet.<br>Click any session card to add it to your plan.</div>';
    return;
  }

  let html = '';
  for (const { date, label } of days) {
    const dayPlanned = events
      .filter(e => e.day === date && planned.has(eventId(e)))
      .sort((a, b) => a.start.localeCompare(b.start));
    if (dayPlanned.length === 0) continue;
    html += `<div class="planned-day"><h3>${label}</h3><div class="planned-list">`;
    html += dayPlanned.map(e => cardHTML(e, true)).join('');
    html += '</div></div>';
  }
  container.innerHTML = html || '<div class="planned-empty">No talks planned yet.</div>';
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
    document.getElementById('planned-count').textContent = planned.size;
    render();
  })
  .catch(err => {
    document.getElementById('desktop-day1').innerHTML = `<p style="color:red;padding:20px">Failed to load schedule: ${err.message}</p>`;
  });
