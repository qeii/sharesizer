import { $, $$, isImage, readImage, bindFilePicker } from "../shared.js";

const co = {
  history: []
};

bindFilePicker("coDrop", "coFile", async (file) => {
  if (!isImage(file)) {
    alert("Please choose an image file.");
    return;
  }

  try {
    const data = await readImage(file);

    const canvas = $("#coCanvas");
    const max = 1800;
    const scale = Math.min(1, max / Math.max(data.img.naturalWidth, data.img.naturalHeight));

    canvas.width = Math.max(1, Math.round(data.img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(data.img.naturalHeight * scale));

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(data.img, 0, 0, canvas.width, canvas.height);

    URL.revokeObjectURL(data.url);

    $("#coEmpty").classList.add("hidden");
    canvas.classList.remove("hidden");
  } catch (error) {
    alert("Could not load image.");
  }
});

$("#coCanvas").addEventListener("click", (event) => {
  const canvas = event.currentTarget;

  if (!canvas.width) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

  const ctx = canvas.getContext("2d");
  const d = ctx.getImageData(x, y, 1, 1).data;

  setColor({ r: d[0], g: d[1], b: d[2] });
});

function setColor(rgb) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  $("#coSwatch").style.background = hex;
  $("#coHex").textContent = hex;
  $("#coRgb").textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  $("#coHsl").textContent = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

  addColorHistory(hex);
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 2 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function addColorHistory(hex) {
  if (co.history[0] === hex) return;

  co.history = [hex, ...co.history.filter((color) => color !== hex)].slice(0, 12);
  renderColorHistory();
}

function renderColorHistory() {
  const wrap = $("#coHistory");
  if (!wrap) return;

  wrap.innerHTML = co.history
    .map(
      (hex) =>
        `<button class="swatch" style="background:${hex}" title="${hex}" data-hex="${hex}" aria-label="Use ${hex}"></button>`
    )
    .join("");

  $$("#coHistory .swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const hex = btn.dataset.hex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      setColor({ r, g, b });
    });
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function flashCopy(button) {
  const old = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = old;
  }, 900);
}

$("#coCopyHex").addEventListener("click", async function () {
  await copyText($("#coHex").textContent);
  flashCopy(this);
});

$("#coCopyRgb").addEventListener("click", async function () {
  await copyText($("#coRgb").textContent);
  flashCopy(this);
});

$("#coCopyHsl").addEventListener("click", async function () {
  await copyText($("#coHsl").textContent);
  flashCopy(this);
});

