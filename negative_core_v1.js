// Negative Core v1.0.0 — fail-closed stop gate.

const RISK = Object.freeze({ low: 0, medium: 1, high: 2, critical: 3 });

function halt(reason) {
  return { halt: true, reason };
}

export const activateNegativeCore = ({ maxPromptTokens = 16000, maxFailures = 3 } = {}) => Object.freeze({
  schema: "architectonica.negative-core/1.0.0",
  role: "Negative",
  activated: true,
  shouldHalt({ risk = "low", attempt = {}, state = {}, prompt_tokens_hint = 0 } = {}) {
    if (state?.stop === true || attempt?.cancelled === true) return halt("explicit stop");
    if ((RISK[risk] ?? RISK.critical) >= RISK.critical) return halt("critical risk");
    if (Number(prompt_tokens_hint) > maxPromptTokens) return halt("context budget exceeded");
    if (Number(state?.consecutiveFailures ?? 0) >= maxFailures) return halt("failure limit reached");
    return { halt: false, reason: "" };
  },
});
