export const $ = (s, r = document) => r.querySelector(s);
export const pad = (n, l = 2) => String(n).padStart(l, "0");

// Time pieces for a date, optionally in another time zone.
export function getParts(d, tz) {
  const o = { hourCycle: "h23", hour: "numeric", minute: "numeric", second: "numeric", weekday: "short", month: "short", day: "numeric", year: "numeric" };
  if (tz) o.timeZone = tz;
  let p;
  try { p = Object.fromEntries(new Intl.DateTimeFormat("en-US", o).formatToParts(d).map((x) => [x.type, x.value])); }
  catch { return getParts(d); }
  return { h: Number(p.hour) % 24, m: Number(p.minute), s: Number(p.second), wd: p.weekday.toUpperCase(), mon: p.month.toUpperCase(), day: Number(p.day), year: p.year };
}
export function fmtTime(p, { h24 = false, sec = true } = {}) {
  let h = p.h, ap = "";
  if (!h24) { ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; } else h = pad(h);
  return { text: `${h}:${pad(p.m)}${sec ? ":" + pad(p.s) : ""}`, ap };
}
export const fmtDate = (p) => `${p.wd} - ${p.mon} ${p.day}. ${p.year}`;

export function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify(val));
  } catch { return null; }
}
export function toggleFullscreen(el) {
  if (document.fullscreenElement) document.exitFullscreen();
  else if (el.requestFullscreen) el.requestFullscreen();
}

// Alarm sound made with the Web Audio API (no audio file needed).
let ctx = null, ringTimer = 0;
export function unlockAudio() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch {}
}
function beep(at) {
  if (!ctx) return;
  const t0 = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "square"; o.frequency.value = 880;
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
  o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.2);
}
export function startRing() {
  unlockAudio(); stopRing();
  const burst = () => [0, 0.25, 0.5].forEach(beep);
  burst(); ringTimer = setInterval(burst, 1400);
}
export function stopRing() { clearInterval(ringTimer); ringTimer = 0; }
