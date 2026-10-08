import { $, formatBytes, isImage, makeFileName, readImage, canvasToBlob, bindFilePicker, bindQuality } from "../shared.js";

const cp = {
  img: null,
  file: null,
  url: null,
  resultUrl: null
};

bindFilePicker("cpDrop", "cpFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    if (cp.url) URL.revokeObjectURL(cp.url);
    if (cp.resultUrl) URL.revokeObjectURL(cp.resultUrl);

    cp.file = file;
    cp.img = data.img;
    cp.url = data.url;

    $("#cpFileSize").textContent = formatBytes(file.size);
    $("#cpOrig").textContent = `${data.img.naturalWidth} × ${data.img.naturalHeight}`;
    $("#cpPreview").innerHTML = `<img src="${data.url}" alt="Preview" />`;
    $("#cpResult").classList.add("hidden");
  } catch (error) {
    alert("Could not load image.");
  }
});

$("#cpButton").addEventListener("click", async () => {
  if (!cp.img) {
    alert("Upload an image first.");
    return;
  }

  const format = $("#cpFormat").value;
  const quality = parseFloat($("#cpQuality").value);

  const canvas = document.createElement("canvas");
  canvas.width = cp.img.naturalWidth;
  canvas.height = cp.img.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(cp.img, 0, 0);

  const blob = await canvasToBlob(canvas, format, format === "image/png" ? undefined : quality);

  if (!blob) {
    alert("This browser cannot export that format. Try PNG or JPEG.");
    return;
  }

  if (cp.resultUrl) URL.revokeObjectURL(cp.resultUrl);
  cp.resultUrl = URL.createObjectURL(blob);

  const savings = (1 - blob.size / cp.file.size) * 100;

  $("#cpPreview").innerHTML = `<img src="${cp.resultUrl}" alt="Compressed preview" />`;
  $("#cpResultSize").textContent = `${formatBytes(blob.size)} • ${format.split("/")[1].toUpperCase()}`;
  $("#cpSavings").textContent = savings >= 0 ? `${savings.toFixed(1)}% smaller` : `${Math.abs(savings).toFixed(1)}% larger`;

  const dl = $("#cpDownload");
  dl.href = cp.resultUrl;
  dl.download = makeFileName(cp.file && cp.file.name, "compressed", format);

  $("#cpResult").classList.remove("hidden");
});


bindQuality("cpFormat", "cpQuality", "cpQualityValue");
