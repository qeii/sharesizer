import { $, pad, toggleFullscreen } from "./core.js";
const t = $("#t"), go = $("#go"), lap = $("#lap"), reset = $("#reset"), list = $("#laps"), stage = $("#stage");
let running = false, startAt = 0, acc = 0, raf = 0, laps = [], lastLap = 0;
const elapsed = () => acc + (running ? performance.now() - startAt : 0);
const fmt = (ms) => {
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, cs = Math.floor((ms % 1000) / 10);
  return { main: `${h ? pad(h) + ":" : ""}${pad(m)}:${pad(s)}`, cs: pad(cs) };
};
const plain = (ms) => { const f = fmt(ms); return `${f.main}.${f.cs}`; };
const draw = () => { const f = fmt(elapsed()); t.innerHTML = `${f.main}<small>.${f.cs}</small>`; };
const frame = () => { draw(); raf = requestAnimationFrame(frame); };
const buttons = () => {
  go.textContent = running ? "Stop" : acc ? "Resume" : "Start";
  lap.disabled = !running; reset.disabled = running || !acc;
};
const renderLaps = () => {
  const splits = laps.map((l) => l.split), min = Math.min(...splits), max = Math.max(...splits);
  list.innerHTML = laps.slice().reverse().map((l) => `<li class="${laps.length > 2 ? (l.split === min ? "fast" : l.split === max ? "slow" : "") : ""}"><span>#${l.n}</span><span>${plain(l.split)}</span><span>${plain(l.total)}</span></li>`).join("");
};
go.onclick = () => {
  if (running) { acc = elapsed(); running = false; cancelAnimationFrame(raf); draw(); }
  else { startAt = performance.now(); running = true; raf = requestAnimationFrame(frame); }
  buttons();
};
lap.onclick = () => { const total = elapsed(); laps.push({ n: laps.length + 1, split: total - lastLap, total }); lastLap = total; renderLaps(); };
reset.onclick = () => { acc = 0; lastLap = 0; laps = []; list.innerHTML = ""; draw(); buttons(); };
$("#fs").onclick = () => toggleFullscreen(stage);
document.addEventListener("keydown", (e) => {
  if (e.target !== document.body) return;
  if (e.code === "Space") { e.preventDefault(); go.click(); }
  else if (e.key === "l" && !lap.disabled) lap.click();
  else if (e.key === "r" && !reset.disabled) reset.click();
});
draw(); buttons();
