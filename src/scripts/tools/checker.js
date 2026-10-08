import { $, formatBytes, isImage, readImage, bindFilePicker } from "../shared.js";
import "./platform-selects.js";
import { SOCIAL_SPECS } from "../../data/platforms.js";

const ch = {
  file: null,
  img: null,
  url: null
};

bindFilePicker("chDrop", "chFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (ch.url) URL.revokeObjectURL(ch.url);

    ch.file = file;
    ch.img = data.img;
    ch.url = data.url;

    runChecker();
  } catch (error) {
    alert("Could not load image.");
  }
});

$("#chPlatform").addEventListener("change", runChecker);

function evaluateSpec(spec, img, file) {
  const width = img.naturalWidth;
  const height = img.naturalHeight;

  const actualRatio = width / height;
  const expectedRatio = spec.width / spec.height;

  const ratioOK =
    Math.abs(actualRatio - expectedRatio) <= Math.max(0.005, expectedRatio * 0.015);

  const resolutionOK = width >= spec.width && height >= spec.height;
  const exact = width === spec.width && height === spec.height;
  const typeOK = spec.types.includes(file.type);
  const sizeOK = file.size <= spec.maxMB * 1024 * 1024;

  const notes = [];
  let status = "success";
  let label = "Ready";

  if (!typeOK) {
    status = "danger";
    label = "File type issue";
    notes.push(`Use ${spec.types.map((type) => type.split("/")[1].toUpperCase()).join(" or ")}.`);
  }

  if (!sizeOK) {
    status = "danger";
    label = "Too large";
    notes.push(`Keep under ${spec.maxMB} MB.`);
  }

  if (exact && ratioOK && resolutionOK) {
    if (status === "success") label = "Perfect";
    notes.push("Exact recommended dimensions.");
  } else if (ratioOK && resolutionOK) {
    if (status === "success") label = "Good";
    notes.push("Aspect ratio and minimum resolution look good.");
  } else if (ratioOK && !resolutionOK) {
    status = "warning";
    label = "Low resolution";
    notes.push(`Recommended at least ${spec.width}×${spec.height}.`);
  } else {
    status = "danger";
    label = "Wrong ratio";
    notes.push(`Needs ${spec.width}×${spec.height} (${expectedRatio.toFixed(3)}).`);
  }

  if (!notes.length) {
    notes.push("Meets basic requirements.");
  }

  return {
    statusClass: status,
    label,
    notes
  };
}

function runChecker() {
  const tbody = $("#chBody");
  const summary = $("#chSummary");

  if (!ch.img || !ch.file) {
    tbody.innerHTML = `<tr><td colspan="6">Upload an image to check platform requirements.</td></tr>`;
    summary.innerHTML = "";
    return;
  }

  const selected = $("#chPlatform").value;
  const specs = selected === "all" ? SOCIAL_SPECS : SOCIAL_SPECS.filter((spec) => spec.id === selected);

  let ok = 0;
  let warn = 0;
  let fail = 0;

  const rows = specs
    .map((spec) => {
      const result = evaluateSpec(spec, ch.img, ch.file);

      if (result.statusClass === "success") ok++;
      else if (result.statusClass === "warning") warn++;
      else fail++;

      return `
        <tr>
          <td><strong>${spec.name}</strong></td>
          <td>${spec.width}×${spec.height}</td>
          <td>${ch.img.naturalWidth}×${ch.img.naturalHeight}</td>
          <td>${formatBytes(ch.file.size)} • ${(ch.file.type.replace("image/", "") || "FILE").toUpperCase()}</td>
          <td><span class="status ${result.statusClass}">${result.label}</span></td>
          <td>${result.notes.join("<br>")}</td>
        </tr>
      `;
    })
    .join("");

  tbody.innerHTML = rows;

  summary.innerHTML = `
    <span class="status success">${ok} ready</span>
    <span class="status warning">${warn} warnings</span>
    <span class="status danger">${fail} issues</span>
  `;
}

/* Init */

runChecker();
