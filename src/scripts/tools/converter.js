import { $, formatBytes, isImage, makeFileName, readImage, canvasToBlob, bindFilePicker, bindQuality } from "../shared.js";

const cv = {
  img: null,
  file: null,
  url: null,
  resultUrl: null
};

bindFilePicker("cvDrop", "cvFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (cv.url) URL.revokeObjectURL(cv.url);
    if (cv.resultUrl) URL.revokeObjectURL(cv.resultUrl);

    cv.file = file;
    cv.img = data.img;
    cv.url = data.url;

    $("#cvFileSize").textContent = formatBytes(file.size);
    $("#cvOrig").textContent = `${data.img.naturalWidth} × ${data.img.naturalHeight}`;
    $("#cvPreview").innerHTML = `<img src="${data.url}" alt="Preview" />`;
    $("#cvResult").classList.add("hidden");
  } catch (error) {
    alert("Could not load image.");
  }
});

$("#cvButton").addEventListener("click", async () => {
  if (!cv.img) {
    alert("Upload an image first.");
    return;
  }

  const format = $("#cvFormat").value;
  const quality = parseFloat($("#cvQuality").value);

  const canvas = document.createElement("canvas");
  canvas.width = cv.img.naturalWidth;
  canvas.height = cv.img.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(cv.img, 0, 0);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);

  if (!blob) {
    alert("This browser cannot export that format. Try PNG or JPEG.");
    return;
  }

  if (cv.resultUrl) URL.revokeObjectURL(cv.resultUrl);
  cv.resultUrl = URL.createObjectURL(blob);

  $("#cvPreview").innerHTML = `<img src="${cv.resultUrl}" alt="Converted preview" />`;
  $("#cvResultSize").textContent = `${cv.img.naturalWidth} × ${cv.img.naturalHeight} • ${formatBytes(blob.size)}`;

  const dl = $("#cvDownload");
  dl.href = cv.resultUrl;
  dl.download = makeFileName(cv.file && cv.file.name, "converted", format);

  $("#cvResult").classList.remove("hidden");
});

/* Aspect Ratio Calculator */
let arDecimal = 0;

bindQuality("cvFormat", "cvQuality", "cvQualityValue");
