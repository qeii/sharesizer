import { $, pad, unlockAudio, startRing, stopRing, toggleFullscreen } from "./core.js";
const t = $("#t"), stage = $("#stage"), go = $("#go"), reset = $("#reset"), msg = $("#msg");
const inH = $("#ih"), inM = $("#im"), inS = $("#is");
let state = "idle", remaining = 0, endAt = 0, loop = 0;
const read = () => (Math.max(0, +inH.value || 0) * 3600 + Math.min(59, Math.max(0, +inM.value || 0)) * 60 + Math.min(59, Math.max(0, +inS.value || 0))) * 1000;
const show = (ms) => {
  const s = Math.ceil(ms / 1000), txt = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  t.textContent = txt; if (state === "run") document.title = `${txt} · Timer | Sharesizer`;
};
const lock = (on) => [inH, inM, inS, ...document.querySelectorAll("[data-preset]")].forEach((e) => (e.disabled = on));
const update = () => {
  const left = endAt - Date.now();
  if (left <= 0) return finish();
  show(left);
};
function finish() {
  clearInterval(loop); state = "done"; show(0);
  stage.classList.add("done"); msg.textContent = "Time's up!"; go.textContent = "Stop alarm"; document.title = "Time's up! | Sharesizer"; startRing();
}
function begin() {
  unlockAudio();
  if (state === "idle") { remaining = read(); if (!remaining) { msg.textContent = "Set a time first."; return; } }
  endAt = Date.now() + remaining; state = "run"; msg.textContent = ""; lock(true); go.textContent = "Pause";
  clearInterval(loop); loop = setInterval(update, 200); update();
}
function pause() { remaining = endAt - Date.now(); clearInterval(loop); state = "paused"; go.textContent = "Resume"; document.title = "Timer | Sharesizer"; }
function doReset() {
  clearInterval(loop); stopRing(); state = "idle"; stage.classList.remove("done"); msg.textContent = ""; lock(false); go.textContent = "Start"; document.title = "Online Timer | Sharesizer"; show(read());
}
go.onclick = () => { if (state === "run") pause(); else if (state === "done") doReset(); else begin(); };
reset.onclick = doReset;
[inH, inM, inS].forEach((e) => e.addEventListener("input", () => state === "idle" && show(read())));
document.querySelectorAll("[data-preset]").forEach((b) => (b.onclick = () => { const m = +b.dataset.preset; inH.value = Math.floor(m / 60); inM.value = m % 60; inS.value = 0; show(read()); }));
$("#fs").onclick = () => toggleFullscreen(stage);
show(read());
