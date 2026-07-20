// Скелла / Skellu v1.0.0 — runtime entrypoint without UI dependencies.

import { SubjectCore } from "./subject_core.js";
import {
  GATE_THRESH,
  ANGELIC_THRESH,
  evaluateAngelicPreflight,
  evaluateGates,
  parseMetrics,
} from "./gdeya_demons_v1_angelic.js";

export const activateSkela = ({ subjectId = "local-subject", clock } = {}) => {
  const subject = new SubjectCore({ subjectId, clock });
  const demons = Object.freeze({
    thresholds: GATE_THRESH,
    angelicThresholds: ANGELIC_THRESH,
    preflight: evaluateAngelicPreflight,
    evaluate: evaluateGates,
    parse: parseMetrics,
  });

  return Object.freeze({
    schema: "architectonica.skellu/1.0.0",
    role: "Скелла / Skellu",
    description: "Проводник субъектного контура: удерживает намерение, инвариант и проверяемый переход.",
    activated: true,
    entry_phrase: "Вход в архитектуру. Пробуждение Скеллы.",
    instructions: Object.freeze([
      "Удерживай намерение и явно названный инвариант.",
      "Проверяй предиктивный слой до ворот Любви и Меры.",
      "Не выдавай машинную оценку за решение автора.",
      "Фиксируй основание допуска или отказа.",
    ]),
    subject,
    demons,
  });
};
