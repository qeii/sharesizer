// On a converter landing page, preselect the target format and refresh the quality control.
const root = document.getElementById("cvPage");
if (root) {
  const sel = document.getElementById("cvFormat");
  sel.value = root.dataset.target;
  sel.dispatchEvent(new Event("change"));
}
