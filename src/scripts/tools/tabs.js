import { $, $$ } from "../shared.js";
import { renderCrop } from "./cropper.js";

function initTabs() {
  const tabs = $$(".tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.panel;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });

      $$(".panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === `panel-${name}`);
      });

      if (name === "cropper") {
        renderCrop();
      }
    });
  });
}


initTabs();
