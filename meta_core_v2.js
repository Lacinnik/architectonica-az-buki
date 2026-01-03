// meta_core_v2.js
// META CORE v2: единый оркестратор (Skela + Demons + Gov + Neg)
// Назначение: ЕДИНСТВЕННАЯ точка допуска/запрета следующего шага.
// Последнее обновление: 2025-12-30

import { activateSkela } from "./skela_full_activation.js";
import { evaluateGates, parseMetrics, makeAttempt } from "./gdeya_demons_v1.js";
import { activateGovernanceCore, GOV_CONTEXT, IMPACT } from "./governance_core_v1.js";
import { activateNegativeCore } from "./negative_core_v1.js";

// -----------------------------
// Фазы и контексты (канон)
// -----------------------------
export const PHASE = Object.freeze({
  LOVE: "love",
  MEASURE: "measure",
  MATERIALIZE: "materialize",
});

export const CONTEXT = Object.freeze({
  PERSONAL: "personal",
  ORG: "org",
  PUBLIC: "public",
  UNKNOWN: "unknown",
});

// -----------------------------
// META POLICY (минимум)
// -----------------------------
export const META_POLICY = Object.freeze({
  defaults: {
    public:  { allow: false, reason: "public: default deny" },
    unknown: { allow: false, reason: "unknown context: deny" },
    org:     { allow: true,  reason: "" },
    personal:{ allow: true,  reason: "" },
  },
  by_phase: {
    love:        { require: ["love_gate"] },
    measure:     { require: ["love_gate", "measure_gate"] },
    materialize: { require: ["love_gate", "measure_gate"] },
  },
});

// -----------------------------
// Вспомогательные политики
// -----------------------------
function ctxPolicy(context) {
  return META_POLICY.defaults[context] || META_POLICY.defaults.unknown;
}
function phasePolicy(phase) {
  return META_POLICY.by_phase[phase] || META_POLICY.by_phase.love;
}

// -----------------------------
// META CAN ACTIVATE (единая логика)
// Порядок приоритета:
// 1) NEG  (иммунитет/стоп)
// 2) GOV  (право/ответственность)
// 3) META (контекст/фаза)
// 4) DEMONS (метрики)
// -----------------------------
export function metaCanActivate({
  ts = new Date().toISOString(),
  plate,
  card = null,
  metrics,
  phase = PHASE.LOVE,
  context = CONTEXT.PERSONAL,
  impact = IMPACT.DRAFT,
  owner = null,
  explicit = {},
  negState = null,
  negAttempt = {},
  prompt_tokens_hint = 0,
  risk = "low", // low|medium|high|critical
}) {
  // --- NEGATIVE CORE (стоп-режим) ---
  const neg = activateNegativeCore();
  const negRes = neg.shouldHalt({
    context,
    risk,
    attempt: negAttempt,
    state: negState,
    prompt_tokens_hint,
  });
  if (negRes.halt) {
    return { allow: false, gate: "neg", reason: negRes.reason };
  }

  // --- GOVERNANCE CORE (право/ответственность) ---
  const gov = activateGovernanceCore();
  const govRes = gov.canActivate({
    context: context === CONTEXT.UNKNOWN ? GOV_CONTEXT.UNKNOWN : context,
    impact,
    owner,
    explicit,
  });
  if (!govRes.allow) {
    return { allow: false, gate: govRes.gate, reason: govRes.reason };
  }

  // --- META (контекст по умолчанию) ---
  const ctx = ctxPolicy(context);
  if (!ctx.allow) {
    return { allow: false, gate: "meta/context", reason: ctx.reason };
  }

  // --- DEMONS (метрики и пороги) ---
  const gateState = evaluateGates({ plate, metrics });
  const m = parseMetrics(metrics);
  const req = phasePolicy(phase).require;

  if (req.includes("love_gate") && !gateState?.love?.pass) {
    const reason = gateState?.love?.reason || "love gate failed";
    makeAttempt({ ts, plate, card, metrics: m, gate: "love", allowed: false, reason });
    return { allow: false, gate: "love", reason, gateState };
  }

  if (req.includes("measure_gate") && !gateState?.measure?.pass) {
    const reason = gateState?.measure?.reason || "measure gate failed";
    makeAttempt({ ts, plate, card, metrics: m, gate: "measure", allowed: false, reason });
    return { allow: false, gate: "measure", reason, gateState };
  }

  // --- УСПЕХ ---
  const gate = req.includes("measure_gate") ? "measure" : "love";
  makeAttempt({ ts, plate, card, metrics: m, gate, allowed: true, reason: "" });
  return { allow: true, gate, reason: "", gateState };
}

// -----------------------------
// ACTIVATE META CORE
// -----------------------------
export const activateMetaCore = () => {
  const skela = activateSkela();
  const gov = activateGovernanceCore();
  const neg = activateNegativeCore();

  return {
    role: "Meta",
    description: "Мета-ядро v2: право допуска. Оркестрирует Skela + Demons + Gov + Neg.",
    activated: true,
    POLICY: META_POLICY,
    PHASE,
    CONTEXT,
    skela,
    subject: skela.subject,
    demons: skela.demons,
    gov,
    neg,
    canActivate: metaCanActivate,
  };
};
