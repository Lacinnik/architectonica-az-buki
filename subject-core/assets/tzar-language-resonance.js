import { compileArchitectonicaLanguage, TZAR_LANGUAGE_ID, TZAR_LANGUAGE_VERSION } from "./tzar-language-core.js";

globalThis.ArchitectonicaLanguage = Object.freeze({
  id: TZAR_LANGUAGE_ID,
  version: TZAR_LANGUAGE_VERSION,
  profile: "subject-core",
  compile(input) { return compileArchitectonicaLanguage("subject-core", input); },
});

function mountBoundary() {
  if (document.querySelector("[data-tzar-language-resonance]")) return;
  const badge = document.createElement("aside");
  badge.dataset.tzarLanguageResonance = "subject-core";
  badge.setAttribute("aria-label", "Граница авторской языковой модели");
  badge.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:50;max-width:290px;padding:10px 12px;border:1px solid rgba(250,204,21,.28);border-radius:12px;background:rgba(2,6,23,.92);color:#fde68a;font:10px/1.45 system-ui;box-shadow:0 12px 36px rgba(0,0,0,.35)";
  badge.textContent = `${TZAR_LANGUAGE_ID} · Subject Core · O→S→I→R_g@C · Q=null`;
  document.body.append(badge);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountBoundary, { once: true });
else mountBoundary();
