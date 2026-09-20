/* Manual journey companion: no location permission or live train data required. */
let companionJourney = null;
function journeyProgress(roadmap, index) {
  const current = roadmap[index];
  const remaining = roadmap.length - index - 1;
  const transferIndex = roadmap.findIndex((step, i) => i >= index && step.hasTransfer);
  return {current, next: roadmap[index + 1], remaining, arrived: remaining === 0,
    completed: index, total: roadmap.length - 1,
    transfer: transferIndex < 0 ? null : roadmap[transferIndex],
    untilTransfer: transferIndex < 0 ? null : transferIndex - index};
}
function companionEscape(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function prepareJourney(roadmap) {
  companionJourney = {roadmap, index: 0, started: false};
  renderCompanion();
}
function clearJourney() {
  companionJourney = null;
}
function startJourney() {
  if (!companionJourney) return;
  companionJourney.started = true;
  renderCompanion();
}
function moveJourney(delta) {
  if (!companionJourney || !companionJourney.started) return;
  companionJourney.index = Math.max(0, Math.min(companionJourney.roadmap.length - 1, companionJourney.index + delta));
  renderCompanion();
}
function restartJourney() {
  if (!companionJourney) return;
  companionJourney.index = 0;
  companionJourney.started = false;
  renderCompanion();
}
function renderCompanion() {
  const host = document.getElementById('journey-companion');
  if (!host || !companionJourney) return;
  // Keep the keyboard on the same control after updating progress.
  const focusedAction = host.contains(document.activeElement) ? document.activeElement.dataset.action : null;
  const {roadmap, index, started} = companionJourney;
  const p = journeyProgress(roadmap, index);
  const name = value => companionEscape(value);
  let hint = 'Stay on this train until your destination.';
  if (p.transfer) hint = p.untilTransfer === 0
    ? `Change here to ${name(p.transfer.transferTo)} before continuing.`
    : `Change in ${p.untilTransfer} stop${p.untilTransfer === 1 ? '' : 's'} at ${name(p.transfer.stationName)} to ${name(p.transfer.transferTo)}.`;
  if (p.current.currentLine === 'Walking transfer' && p.next) hint = `Walk to ${name(p.next.stationName)}. Leave the paid area and buy the onward operator’s ticket; allow about 8 minutes.`;
  if (p.arrived) hint = 'Your journey is complete. Check station signs for your exit.';
  host.innerHTML = `
    <p class="companion-eyebrow">Metro. / Journey companion</p>
    <div role="status" aria-live="polite" aria-atomic="true">
      <h3>${!started ? 'Your ride, one stop at a time.' : p.arrived ? 'You’ve arrived.' : name(p.current.stationName)}</h3>
      ${!started ? `<p>Keep your place through every stop and line change. Ready to start at <strong>${name(p.current.stationName)}</strong>?</p>` : `
        <p>${p.remaining} stop${p.remaining === 1 ? '' : 's'} to ${name(roadmap.at(-1).stationName)}</p>
        <progress value="${p.completed}" max="${p.total}" aria-label="Journey progress"></progress>
        ${p.next ? `<div class="companion-next"><span>NEXT STATION</span><strong>${name(p.next.stationName)}</strong></div>` : ''}
        <p class="${p.transfer && p.untilTransfer <= 1 ? 'companion-transfer' : ''}">${hint}</p>`}
    </div>
    <div class="companion-actions">
      ${!started ? '<button type="button" data-action="start" onclick="startJourney()">Start my journey ↗</button>' : `
      <button type="button" class="secondary" data-action="back" onclick="moveJourney(-1)" ${index === 0 ? 'disabled' : ''}>Previous stop</button>
      ${!p.arrived ? '<button type="button" data-action="next" onclick="moveJourney(1)">Reached next stop →</button>' : ''}
      <button type="button" class="secondary" data-action="restart" onclick="restartJourney()">${p.arrived ? 'Start again' : 'Reset'}</button>`}
    </div>
    <p class="companion-note">Manual stop tracking. Tap when you reach each station; this does not use GPS or live train updates.</p>`;
  document.querySelectorAll('#roadmap-timeline .roadmap-step-row').forEach((row, i) => {
    row.classList.toggle('is-current', started && i === index);
    row.classList.toggle('is-passed', started && i < index);
    if (started && i === index) row.setAttribute('aria-current', 'step');
    else row.removeAttribute('aria-current');
  });
  if (focusedAction) {
    const control = host.querySelector(`[data-action="${focusedAction}"]:not(:disabled)`) || host.querySelector('button:not(:disabled)');
    control?.focus({preventScroll:true});
  }
}
if (typeof module !== 'undefined') module.exports = {journeyProgress};
