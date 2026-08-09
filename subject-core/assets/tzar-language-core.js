export const TZAR_LANGUAGE_ID = "TZAR-LANGUAGE-001";
export const TZAR_LANGUAGE_VERSION = "0.2.0-candidate";

const clean = value => String(value ?? "").replace(/\s+/gu, " ").trim();

export function compileArchitectonicaLanguage(profileId, input = {}) {
  if (profileId !== "subject-core") throw new Error(`TZAR_LANGUAGE_PROFILE_UNKNOWN:${profileId}`);
  const O = clean(input.object);
  if (!O) return { modelId: TZAR_LANGUAGE_ID, modelVersion: TZAR_LANGUAGE_VERSION, profile: profileId, status: "HOLD-INPUT", tensor: { O: null, S: null, I: null, R_g: null, C: null, Q: null, evidence: "HOLD-DATA" } };
  const S = clean(input.subjectTrace) || "след субъекта не предъявлен";
  const I = clean(input.image) || "отражённый образ не сформирован";
  const R_g = clean(input.targetRelation) || "проверить следующий переход";
  const C = clean(input.context) || "subject-core";
  const Q = input.observedQ ?? null;
  if (Q !== null && Q !== 0 && Q !== 1) throw new Error("TZAR_LANGUAGE_Q_MUST_BE_OBSERVED_BINARY");
  return {
    modelId: TZAR_LANGUAGE_ID,
    modelVersion: TZAR_LANGUAGE_VERSION,
    kind: "authorial-singular-alphabet-language-model",
    technicalBoundary: "deterministic-symbolic-compiler-not-a-trained-neural-llm",
    profile: profileId,
    status: "candidate-subject-confirmation-required",
    formula: "Я × IЯ Интеграция ядра → ⊙ Ядро",
    layers: { publicStatement: `Я удерживаю объект «${O}» отдельно от образа «${I}». Мой предъявленный след: ${S}. Целевая связь: ${R_g}.` },
    tensor: { O, S, I, R_g, C, Q, evidence: Q === null ? "HOLD-DATA" : "observed" },
    boundary: { diagnosis: "not-performed", prediction: "not-performed", observedQ: Q, subjectConfirmationRequired: true },
  };
}
