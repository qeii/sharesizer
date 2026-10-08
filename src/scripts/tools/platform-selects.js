import { $ } from "../shared.js";
import { SOCIAL_SPECS } from "../../data/platforms.js";

export function populateSocialSelects() {
  const sm = $("#smPlatform");
  if (sm) {
    sm.innerHTML = SOCIAL_SPECS
      .map((spec) => `<option value="${spec.id}">${spec.name} — ${spec.width}×${spec.height}</option>`)
      .join("");
  }

  const ch = $("#chPlatform");
  if (ch) {
    ch.innerHTML =
      `<option value="all">All platforms</option>` +
      SOCIAL_SPECS
        .map((spec) => `<option value="${spec.id}">${spec.name} — ${spec.width}×${spec.height}</option>`)
        .join("");
  }
}


populateSocialSelects();
