import { $, pad, getParts, fmtTime, fmtDate, store, unlockAudio, startRing, stopRing } from "./core.js";
const t = $("#t"), ap = $("#ap"), d = $("#d"), listEl = $("#alarms"), ring = $("#ring");
let alarms = store("ss-alarms") || [];
let snooze = null, fired = "", ringing = false;
const save = () => store("ss-alarms", alarms);
const to12 = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`; };
const RP = { once: "Once", daily: "Every day", weekdays: "Weekdays" };
const dayOk = (a, day) => a.repeat !== "weekdays" || (day >= 1 && day <= 5);

function nextRing(a) {
  const [h, m] = a.time.split(":").map(Number), now = new Date();
  for (let i = 0; i < 8; i++) {
    const c = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m, 0, 0);
    if (c > now && dayOk(a, c.getDay())) return c;
  }
  return null;
}
const until = (c) => {
  const mins = Math.ceil((c - new Date()) / 60000), h = Math.floor(mins / 60), m = mins % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
};
function render() {
  if (!alarms.length) { listEl.innerHTML = '<li class="am" style="justify-content:center">No alarms yet. Add one above.</li>'; return; }
  listEl.innerHTML = alarms.map((a) => {
    const n = a.on ? nextRing(a) : null;
    return `<li class="${a.on ? "" : "off"}"><div><div class="at">${to12(a.time)}</div><div class="am">${a.label ? a.label.replace(/</g, "&lt;") + " · " : ""}${RP[a.repeat]}${n ? " · rings in " + until(n) : ""}</div></div><div class="row-actions"><button class="chip" data-tg="${a.id}" aria-pressed="${a.on}">${a.on ? "On" : "Off"}</button><button class="chip" data-rm="${a.id}" aria-label="Delete alarm">Delete</button></div></li>`;
  }).join("");
}
function show(label) {
  ringing = true; const n = new Date(); $("#ringT").textContent = to12(label.time || `${pad(n.getHours())}:${pad(n.getMinutes())}`).replace(" ", ""); $("#ringL").textContent = label.text;
  ring.hidden = false; startRing(); document.title = "⏰ Alarm! | Sharesizer";
}
function stop() { ringing = false; ring.hidden = true; stopRing(); document.title = "Online Alarm Clock | Sharesizer"; }

$("#af").addEventListener("submit", (e) => {
  e.preventDefault(); unlockAudio();
  alarms.push({ id: Date.now().toString(36), time: $("#atime").value, label: $("#alabel").value.trim().slice(0, 40), repeat: $("#arepeat").value, on: true });
  alarms.sort((a, b) => a.time.localeCompare(b.time)); save(); render(); $("#alabel").value = "";
});
listEl.addEventListener("click", (e) => {
  const tg = e.target.dataset.tg, rm = e.target.dataset.rm;
  if (tg) { const a = alarms.find((x) => x.id === tg); a.on = !a.on; unlockAudio(); }
  else if (rm) alarms = alarms.filter((x) => x.id !== rm);
  else return;
  save(); render();
});
$("#stop").onclick = stop;
$("#snooze").onclick = () => { stop(); snooze = { at: Date.now() + 5 * 60000 }; };

function tick() {
  const now = new Date(), p = getParts(now), f = fmtTime(p);
  t.textContent = f.text; ap.textContent = f.ap; d.textContent = fmtDate(p);
  const key = `${now.toDateString()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if (!ringing) {
    if (snooze && Date.now() >= snooze.at) { snooze = null; show({ text: "Snooze is over" }); return; }
    if (key !== fired) {
      const hit = alarms.find((a) => a.on && a.time === `${pad(now.getHours())}:${pad(now.getMinutes())}` && dayOk(a, now.getDay()));
      if (hit) { fired = key; if (hit.repeat === "once") { hit.on = false; save(); render(); } show({ time: hit.time, text: hit.label || "Alarm" }); }
    }
  }
  if (now.getSeconds() === 0) render();
}
const nx = new Date(); $("#atime").value = `${pad((nx.getHours() + 1) % 24)}:00`;
render(); tick(); setInterval(tick, 500);
