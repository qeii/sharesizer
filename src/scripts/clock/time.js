import { $, getParts, fmtTime, fmtDate, store, toggleFullscreen } from "./core.js";
const prefs = Object.assign({ h24: false, sec: true, tz: "" }, store("ss-clock") || {});
const t = $("#t"), ap = $("#ap"), d = $("#d"), zone = $("#zone"), tzSel = $("#tz"), stage = $("#stage");
const local = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
let zones = [];
try { zones = Intl.supportedValuesOf("timeZone"); } catch { zones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Tokyo", "Australia/Sydney"]; }
tzSel.innerHTML = `<option value="">My time zone (${local})</option>` + zones.map((z) => `<option value="${z}">${z.replace(/_/g, " ")}</option>`).join("");
tzSel.value = prefs.tz;
if (tzSel.value !== prefs.tz) prefs.tz = "";
const save = () => store("ss-clock", prefs);
const sync = () => {
  $("#h24").setAttribute("aria-pressed", String(prefs.h24)); $("#h24").textContent = prefs.h24 ? "24-hour" : "12-hour";
  $("#sec").setAttribute("aria-pressed", String(prefs.sec)); $("#sec").textContent = prefs.sec ? "Seconds: on" : "Seconds: off";
  tick();
};
const tick = () => {
  const p = getParts(new Date(), prefs.tz || undefined), f = fmtTime(p, prefs);
  t.textContent = f.text; ap.textContent = f.ap; d.textContent = fmtDate(p); zone.textContent = prefs.tz ? prefs.tz.replace(/_/g, " ") : local.replace(/_/g, " ");
};
$("#h24").onclick = () => { prefs.h24 = !prefs.h24; save(); sync(); };
$("#sec").onclick = () => { prefs.sec = !prefs.sec; save(); sync(); };
tzSel.onchange = () => { prefs.tz = tzSel.value; save(); tick(); };
$("#fs").onclick = () => toggleFullscreen(stage);
sync(); setInterval(tick, 250);
