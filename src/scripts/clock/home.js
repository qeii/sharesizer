import { $, getParts, fmtTime, fmtDate } from "./core.js";
const t = $("#hc-t"), ap = $("#hc-ap"), d = $("#hc-d");
if (t) {
  const tick = () => {
    const p = getParts(new Date()), f = fmtTime(p);
    t.textContent = f.text; ap.textContent = f.ap; d.textContent = fmtDate(p);
  };
  tick(); setInterval(tick, 500);
}
