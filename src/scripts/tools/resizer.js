import { $, formatBytes, isImage, makeFileName, readImage, canvasToBlob, bindFilePicker, bindQuality } from "../shared.js";

const rz = {
  img: null,
  file: null,
  url: null,
  resultUrl: null,
  ratio: 1
};

bindFilePicker("rzDrop", "rzFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (rz.url) URL.revokeObjectURL(rz.url);
    if (rz.resultUrl) URL.revokeObjectURL(rz.resultUrl);

    rz.file = file;
    rz.img = data.img;
    rz.url = data.url;
    rz.ratio = data.img.naturalWidth / data.img.naturalHeight;

    $("#rzFileSize").textContent = formatBytes(file.size);
    $("#rzOrig").textContent = `${data.img.naturalWidth} × ${data.img.naturalHeight}`;
    $("#rzWidth").value = data.img.naturalWidth;
    $("#rzHeight").value = data.img.naturalHeight;
    $("#rzPreview").innerHTML = `<img src="${data.url}" alt="Preview" />`;
    $("#rzResult").classList.add("hidden");
  } catch (error) {
    alert("Could not load image.");
  }
});

let rzSync = false;

$("#rzWidth").addEventListener("input", () => {
  if (rzSync) return;

  const width = parseInt($("#rzWidth").value, 10);

  if ($("#rzLock").checked && rz.ratio && width > 0) {
    rzSync = true;
    $("#rzHeight").value = Math.max(1, Math.round(width / rz.ratio));
    rzSync = false;
  }
});

$("#rzHeight").addEventListener("input", () => {
  if (rzSync) return;

  const height = parseInt($("#rzHeight").value, 10);

  if ($("#rzLock").checked && rz.ratio && height > 0) {
    rzSync = true;
    $("#rzWidth").value = Math.max(1, Math.round(height * rz.ratio));
    rzSync = false;
  }
});

$("#rzButton").addEventListener("click", async () => {
  if (!rz.img) {
    alert("Upload an image first.");
    return;
  }

  const width = parseInt($("#rzWidth").value, 10);
  const height = parseInt($("#rzHeight").value, 10);

  if (!width || !height || width < 1 || height < 1) {
    alert("Enter valid width and height.");
    return;
  }

  const format = $("#rzFormat").value;
  const quality = parseFloat($("#rzQuality").value);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(rz.img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);

  if (!blob) {
    alert("This browser cannot export that format. Try PNG or JPEG.");
    return;
  }

  if (rz.resultUrl) URL.revokeObjectURL(rz.resultUrl);
  rz.resultUrl = URL.createObjectURL(blob);

  $("#rzPreview").innerHTML = `<img src="${rz.resultUrl}" alt="Resized preview" />`;
  $("#rzResultSize").textContent = `${width} × ${height} • ${formatBytes(blob.size)}`;

  const dl = $("#rzDownload");
  dl.href = rz.resultUrl;
  dl.download = makeFileName(rz.file && rz.file.name, "resized", format);

  $("#rzResult").classList.remove("hidden");
});


bindQuality("rzFormat", "rzQuality", "rzQualityValue");
