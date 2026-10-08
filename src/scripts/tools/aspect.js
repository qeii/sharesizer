import { $ } from "../shared.js";


function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));

  while (b) {
    [a, b] = [b, a % b];
  }

  return a || 1;
}

function nearestCommonRatio(decimal) {
  const presets = [
    [1, 1],
    [4, 3],
    [3, 4],
    [16, 9],
    [9, 16],
    [3, 2],
    [2, 3],
    [5, 4],
    [4, 5],
    [21, 9],
    [9, 21],
    [2, 1],
    [1, 2],
    [3, 1],
    [1, 3]
  ];

  let best = [1, 1];
  let bestDiff = Infinity;

  for (const [a, b] of presets) {
    const value = a / b;
    const diff = Math.abs(decimal - value);

    if (diff < bestDiff) {
      bestDiff = diff;
      best = [a, b];
    }
  }

  return best;
}

function updateAspect() {
  const width = parseFloat($("#arWidth").value);
  const height = parseFloat($("#arHeight").value);

  if (width > 0 && height > 0) {
    arDecimal = width / height;

    const integers = Number.isInteger(width) && Number.isInteger(height);
    let ratioText = "—";

    if (integers) {
      const g = gcd(width, height);
      ratioText = `${width / g}:${height / g}`;
    }

    const common = nearestCommonRatio(arDecimal);

    $("#arRatio").textContent = ratioText;
    $("#arDecimal").textContent = arDecimal.toFixed(4);
    $("#arCommon").textContent = `${common[0]}:${common[1]}`;
    $("#arMP").textContent = `${((width * height) / 1_000_000).toFixed(2)} MP`;
  } else {
    arDecimal = 0;
    $("#arRatio").textContent = "—";
    $("#arDecimal").textContent = "—";
    $("#arCommon").textContent = "—";
    $("#arMP").textContent = "—";
  }
}

$("#arWidth").addEventListener("input", updateAspect);
$("#arHeight").addEventListener("input", updateAspect);

$("#arTargetWidth").addEventListener("input", () => {
  const value = parseFloat($("#arTargetWidth").value);
  if (value > 0 && arDecimal > 0) {
    $("#arTargetHeight").value = Math.round(value / arDecimal);
  }
});

$("#arTargetHeight").addEventListener("input", () => {
  const value = parseFloat($("#arTargetHeight").value);
  if (value > 0 && arDecimal > 0) {
    $("#arTargetWidth").value = Math.round(value * arDecimal);
  }
});


updateAspect();
