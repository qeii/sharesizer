// Find & replace (Ctrl+H style), space clean-up, and add text in front/back. Runs entirely in the browser.
const $ = (id) => document.getElementById(id);
const ta = $("frText");
if (ta) {
  const undo = [];
  let statusT = 0;

  const say = (msg, bad) => {
    const el = $("frStatus"); el.textContent = msg; el.className = "fr-status" + (bad ? " bad" : "");
    clearTimeout(statusT); statusT = setTimeout(() => (el.textContent = ""), 4000);
  };
  const plural = (n, w) => `${n.toLocaleString()} ${n === 1 ? w : w + (/(ch|sh|s|x)$/.test(w) ? "es" : "s")}`;
  const stats = () => {
    const v = ta.value;
    const words = (v.match(/\S+/g) || []).length;
    const lines = v === "" ? 0 : v.split(/\r\n|\r|\n/).length;
    $("frStats").textContent = `${plural(v.length, "character")} · ${plural(words, "word")} · ${plural(lines, "line")}`;
  };
  const setText = (v, msg) => {            // every tool change goes through here, so Undo always works
    if (v === ta.value) { say("Nothing to change."); return; }
    undo.push(ta.value); if (undo.length > 50) undo.shift();
    ta.value = v; $("frUndo").disabled = false; stats(); count(); if (msg) say(msg);
  };

  // ---- build the search pattern from the options ----
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function pattern(flagsExtra = "") {
    const q = $("frFind").value;
    if (!q) return null;
    const regex = $("frRegex").checked;
    let src = regex ? q : esc(q);
    if ($("frWord").checked) src = `(?<![\\p{L}\\p{N}_])(?:${src})(?![\\p{L}\\p{N}_])`;
    const flags = "u" + ($("frCase").checked ? "" : "i") + (regex ? "m" : "") + flagsExtra;
    return new RegExp(src, flags);       // throws on a bad regular expression
  }
  const replacement = () => {
    const r = $("frRepl").value;
    return $("frRegex").checked ? r.replace(/\\n/g, "\n").replace(/\\t/g, "\t") : null;
  };
  const doReplace = (text, re) => {
    const regexMode = $("frRegex").checked, r = $("frRepl").value;
    return regexMode ? text.replace(re, replacement()) : text.replace(re, () => r);
  };

  function count() {
    const el = $("frCount"); el.className = "fr-count";
    if (!$("frFind").value) { el.textContent = ""; return; }
    try {
      const re = pattern("g"); let n = 0, m;
      while ((m = re.exec(ta.value)) && n < 100000) { n++; if (m[0] === "") re.lastIndex++; }
      el.textContent = n === 0 ? "No matches" : `${plural(n, "match")}${n >= 100000 ? "+" : ""}`;
    } catch (e) { el.textContent = "That regular expression is not valid."; el.className = "fr-count bad"; }
  }

  // ---- Find next / Replace / Replace all ----
  function select(start, end, back) {
    const prev = document.activeElement;
    ta.focus({ preventScroll: false });
    ta.setSelectionRange(start, end);
    // keep the highlight and scroll position, but return the cursor to where the user was typing
    if (back && prev && prev !== ta && prev.focus) prev.focus({ preventScroll: true });
  }
  function findNext(fromEnd = true) {
    let re;
    try { re = pattern("g"); } catch (e) { say("That regular expression is not valid.", true); return false; }
    if (!re) { say("Type something to find.", true); $("frFind").focus(); return false; }
    const text = ta.value;
    re.lastIndex = fromEnd ? ta.selectionEnd : ta.selectionStart;
    let m = re.exec(text);
    if (m && m[0] === "" && fromEnd) { re.lastIndex = ta.selectionEnd + 1; m = re.exec(text); }
    let wrapped = false;
    if (!m) { re.lastIndex = 0; m = re.exec(text); wrapped = true; }
    if (!m) { say("No matches found.", true); return false; }
    select(m.index, m.index + m[0].length, true);
    if (wrapped) say("Reached the end, started again from the top.");
    return true;
  }
  $("frNext").onclick = () => findNext();
  $("frFind").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); findNext(); } });

  $("frOne").onclick = () => {
    let re;
    try { re = pattern(); } catch (e) { say("That regular expression is not valid.", true); return; }
    if (!re) { say("Type something to find.", true); $("frFind").focus(); return; }
    const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e);
    // only replace when the highlighted text is exactly a match
    const exact = new RegExp(`^(?:${re.source})$`, re.flags.replace("m", ""));
    if (sel && exact.test(sel)) {
      const rep = doReplace(sel, new RegExp(re.source, re.flags.replace("m", "") + "g"));
      const before = ta.value;
      setText(before.slice(0, s) + rep + before.slice(e));
      ta.setSelectionRange(s + rep.length, s + rep.length);
    }
    findNext();
  };

  $("frAll").onclick = () => {
    let re;
    try { re = pattern("g"); } catch (e) { say("That regular expression is not valid.", true); return; }
    if (!re) { say("Type something to find.", true); $("frFind").focus(); return; }
    const n = (ta.value.match(re) || []).length;
    if (!n) { say("No matches found.", true); return; }
    setText(doReplace(ta.value, re), `Replaced ${plural(n, "match")}.`);
  };

  // ---- remove spaces ----
  const SPACE = "[^\\S\\r\\n]";           // any whitespace except line breaks
  const CLEAN = {
    all: (t) => t.replace(new RegExp(`${SPACE}+`, "g"), ""),
    collapse: (t) => t.replace(new RegExp(`${SPACE}{2,}`, "g"), " "),
    trim: (t) => t.split(/\r\n|\r|\n/).map((l) => l.trim()).join("\n"),
    blank: (t) => t.split(/\r\n|\r|\n/).filter((l) => l.trim() !== "").join("\n"),
  };
  const DONE = { all: "Removed all spaces.", collapse: "Collapsed extra spaces.", trim: "Trimmed the edges of each line.", blank: "Removed blank lines." };
  document.querySelectorAll("[data-clean]").forEach((b) => b.addEventListener("click", () => {
    if (!ta.value) { say("Add some text first.", true); return; }
    setText(CLEAN[b.dataset.clean](ta.value), DONE[b.dataset.clean]);
  }));

  // ---- add in front / at the end ----
  $("frAdd").onclick = () => {
    const f = $("frFront").value, k = $("frBack").value;
    if (!f && !k) { say("Type what to add in front or at the end.", true); return; }
    if (!ta.value) { say("Add some text first.", true); return; }
    const scope = $("frScope").value, skip = $("frSkip").checked;
    let out;
    if (scope === "lines") out = ta.value.split(/\r\n|\r|\n/).map((l) => (skip && l.trim() === "" ? l : f + l + k)).join("\n");
    else if (scope === "words") out = ta.value.replace(/\S+/g, (w) => f + w + k);
    else out = f + ta.value + k;
    setText(out, "Added your text.");
  };

  // ---- toolbar ----
  $("frUndo").onclick = () => {
    if (!undo.length) return;
    ta.value = undo.pop(); $("frUndo").disabled = undo.length === 0; stats(); count(); say("Undone.");
  };
  $("frCopy").onclick = async () => {
    if (!ta.value) { say("Nothing to copy.", true); return; }
    try { await navigator.clipboard.writeText(ta.value); say("Copied to your clipboard."); }
    catch (e) { ta.focus(); ta.select(); say(document.execCommand("copy") ? "Copied to your clipboard." : "Copy was blocked. Press Ctrl+C.", false); }
  };
  $("frClear").onclick = () => { if (ta.value) setText("", "Cleared. You can Undo."); ta.focus(); };

  ta.addEventListener("input", () => { stats(); count(); });
  ["frFind", "frCase", "frWord", "frRegex"].forEach((id) => $(id).addEventListener("input", count));
  stats();
}
