import qrcode from "qrcode-generator";
qrcode.stringToBytes = (s) => Array.from(new TextEncoder().encode(s)); // proper UTF-8 (v2 default drops non-ASCII)

const $ = (id) => document.getElementById(id);
const cv = $("qrCanvas");
let logoURL = null, logoImg = null;

const esc = (s) => s.replace(/([\\;,:"])/g, "\\$1");
function payload() {
  const m = $("qrMode").value;
  if (m === "wifi") {
    const sec = $("qrSec").value;
    return `WIFI:T:${sec};S:${esc($("qrSsid").value)};${sec === "nopass" ? "" : `P:${esc($("qrPass").value)};`}H:${$("qrHidden").checked};;`;
  }
  if (m === "email") {
    const q = [["subject", $("qrSubj").value], ["body", $("qrBody").value]].filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
    return `mailto:${$("qrTo").value.trim()}${q ? "?" + q : ""}`;
  }
  return $("qrText").value;
}

function matrix() {
  const data = payload();
  if (!data.trim()) return { err: "Type something to generate a code." };
  try {
    const q = qrcode(0, logoImg ? "H" : $("qrEcc").value);
    q.addData(data); q.make();
    const n = q.getModuleCount();
    return { n, dark: (r, c) => q.isDark(r, c) };
  } catch { return { err: "This text is too long for a QR code. Shorten it or lower the error correction." }; }
}

const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };

function render() {
  const note = $("qrNote"), m = matrix();
  note.className = "hint";
  if (m.err) { note.textContent = m.err; note.classList.add("warn"); const g = cv.getContext("2d"); g.clearRect(0, 0, cv.width, cv.height); return; }
  const fg = $("qrFg").value, bg = $("qrBg").value, margin = Number($("qrMargin").value), size = Number($("qrSize").value);
  const total = m.n + margin * 2, cell = size / total, g = cv.getContext("2d");
  cv.width = size; cv.height = size;
  g.fillStyle = bg; g.fillRect(0, 0, size, size); g.fillStyle = fg;
  const round = $("qrShape").value === "round";
  for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) {
    if (!m.dark(r, c)) continue;
    const x0 = Math.round((c + margin) * cell), y0 = Math.round((r + margin) * cell);
    const w = Math.round((c + margin + 1) * cell) - x0, h = Math.round((r + margin + 1) * cell) - y0;
    if (round) { g.beginPath(); g.roundRect(x0, y0, w, h, w * 0.32); g.fill(); } else g.fillRect(x0, y0, w, h);
  }
  if (logoImg) {
    const box = size * 0.22, x = (size - box) / 2, pad = box * 0.12;
    g.fillStyle = bg; g.beginPath(); g.roundRect(x - pad, x - pad, box + pad * 2, box + pad * 2, box * 0.16); g.fill();
    const k = Math.min(box / logoImg.width, box / logoImg.height), lw = logoImg.width * k, lh = logoImg.height * k;
    g.drawImage(logoImg, (size - lw) / 2, (size - lh) / 2, lw, lh);
  }
  const l1 = lum(fg), l2 = lum(bg), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  if (l1 > l2) { note.textContent = "Light code on a dark background may not scan on some apps."; note.classList.add("warn"); }
  else if (ratio < 3) { note.textContent = "Low contrast — this code may be hard to scan."; note.classList.add("warn"); }
  else note.textContent = `${m.n}×${m.n} modules` + (logoImg ? " · error correction set to High for the logo" : "");
}

function svgString() {
  const m = matrix(); if (m.err) return null;
  const margin = Number($("qrMargin").value), total = m.n + margin * 2, round = $("qrShape").value === "round";
  let body = "";
  for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c))
    body += round ? `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" rx=".32"/>` : `M${c + margin} ${r + margin}h1v1h-1z`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${$("qrSize").value}" height="${$("qrSize").value}"><rect width="${total}" height="${total}" fill="${$("qrBg").value}"/>`;
  s += round ? `<g fill="${$("qrFg").value}">${body}</g>` : `<path fill="${$("qrFg").value}" d="${body}"/>`;
  if (logoImg) { const box = total * 0.22, x = (total - box) / 2, pad = box * 0.12;
    s += `<rect x="${x - pad}" y="${x - pad}" width="${box + pad * 2}" height="${box + pad * 2}" rx="${box * 0.16}" fill="${$("qrBg").value}"/><image href="${logoURL}" x="${x}" y="${x}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid meet"/>`; }
  return s + "</svg>";
}

function save(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }

$("qrMode").addEventListener("change", () => { ["text", "wifi", "email"].forEach((k) => ($("qrf-" + k).hidden = k !== $("qrMode").value)); render(); });
document.querySelector("#panel-qr").addEventListener("input", render);
$("qrLogoFile").addEventListener("change", (e) => {
  const f = e.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => { const im = new Image(); im.onload = () => { logoURL = rd.result; logoImg = im; render(); }; im.src = rd.result; };
  rd.readAsDataURL(f); e.target.value = "";
});
$("qrLogoClear").onclick = () => { logoImg = logoURL = null; render(); };
$("qrPng").onclick = () => { if (matrix().err) return; cv.toBlob((b) => b && save(b, "sharesizer-qr.png")); };
$("qrSvg").onclick = () => { const s = svgString(); if (s) save(new Blob([s], { type: "image/svg+xml" }), "sharesizer-qr.svg"); };
render();
