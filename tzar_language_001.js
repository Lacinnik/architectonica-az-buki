export const TZAR_LANGUAGE_ID = "TZAR-LANGUAGE-001";
export const TZAR_LANGUAGE_VERSION = "0.2.0-candidate";

export const PRODUCT_PROFILES = Object.freeze({
  architectonica: Object.freeze({ voice: "system", az: ["A40", "Точка"], buka: ["B24", "⊕Σ", "Суперпозиция систем"], tx: ["TX6", "⊕", "Интеграция"] }),
  "az-buki": Object.freeze({ voice: "artifact", az: ["A33", "Я"], buka: ["B12", "Fₛ", "Поток смысла"], tx: ["TX5", "◆", "Материализация"] }),
  "subject-core": Object.freeze({ voice: "subject", az: ["A33", "Я"], buka: ["B10", "IЯ", "Интеграция ядра"], tx: ["TX1", "⊙", "Ядро"] }),
  "meta-core-v2": Object.freeze({ voice: "system", az: ["A45", "Суть"], buka: ["B21", "α", "Коэффициент соответствия"], tx: ["TX6", "⊕", "Интеграция"] }),
  "collective-meta-core": Object.freeze({ voice: "collective", az: ["A13", "Люди"], buka: ["B24", "⊕Σ", "Суперпозиция систем"], tx: ["TX3", "≈", "Резонанс"] }),
});

const clean = value => String(value ?? "").replace(/\s+/gu, " ").trim();

export function compileArchitectonicaLanguage(profileId, input = {}) {
  const profile = PRODUCT_PROFILES[profileId];
  if (!profile) throw new Error(`TZAR_LANGUAGE_PROFILE_UNKNOWN:${profileId}`);
  const O = clean(input.object);
  if (!O) return Object.freeze({ modelId: TZAR_LANGUAGE_ID, modelVersion: TZAR_LANGUAGE_VERSION, profile: profileId, status: "HOLD-INPUT", reason: "OBJECT_REQUIRED", tensor: { O: null, S: null, I: null, R_g: null, C: null, Q: null, evidence: "HOLD-DATA" } });
  const S = clean(input.subjectTrace) || "след субъекта не предъявлен";
  const I = clean(input.image) || "отражённый образ не сформирован";
  const R_g = clean(input.targetRelation) || "проверить следующий переход";
  const C = clean(input.context) || profileId;
  const Q = input.observedQ ?? null;
  if (Q !== null && Q !== 0 && Q !== 1) throw new Error("TZAR_LANGUAGE_Q_MUST_BE_OBSERVED_BINARY");
  const statements = {
    subject: `Я удерживаю объект «${O}» отдельно от образа «${I}». Мой предъявленный след: ${S}. Целевая связь: ${R_g}.`,
    collective: `Поле удерживает общий объект «${O}», отдельность голосов «${S}» и образ «${I}». Целевая связь: ${R_g}.`,
    system: `Контур удерживает объект «${O}», субъектный след «${S}» и отражённый результат «${I}». Целевая связь: ${R_g}.`,
    artifact: `Артефакт проводит объект «${O}» через предъявленный след «${S}» к образу «${I}». Целевая связь: ${R_g}.`,
  };
  return Object.freeze({
    modelId: TZAR_LANGUAGE_ID,
    modelVersion: TZAR_LANGUAGE_VERSION,
    kind: "authorial-singular-alphabet-language-model",
    technicalBoundary: "deterministic-symbolic-compiler-not-a-trained-neural-llm",
    profile: profileId,
    status: "candidate-subject-confirmation-required",
    formula: `${profile.az[1]} × ${profile.buka[1]} ${profile.buka[2]} → ${profile.tx[1]} ${profile.tx[2]}`,
    selection: { az: { id: profile.az[0], title: profile.az[1] }, buka: { id: profile.buka[0], symbol: profile.buka[1], title: profile.buka[2] }, transmission: { id: profile.tx[0], symbol: profile.tx[1], title: profile.tx[2] } },
    layers: { publicStatement: statements[profile.voice] },
    tensor: { O, S, I, R_g, C, Q, evidence: Q === null ? "HOLD-DATA" : "observed" },
    boundary: { diagnosis: "not-performed", prediction: "not-performed", observedQ: Q, subjectConfirmationRequired: true },
  });
}
