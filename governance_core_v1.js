// Governance Core v1.0.0 — explicit right and responsibility gate.

export const GOV_CONTEXT = Object.freeze({
  PERSONAL: "personal",
  ORG: "org",
  PUBLIC: "public",
  UNKNOWN: "unknown",
});

export const IMPACT = Object.freeze({
  DRAFT: "draft",
  LOCAL: "local",
  SHARED: "shared",
  PUBLIC: "public",
  IRREVERSIBLE: "irreversible",
});

function deny(gate, reason) {
  return { allow: false, gate, reason };
}

export const activateGovernanceCore = () => Object.freeze({
  schema: "architectonica.governance-core/1.0.0",
  role: "Governance",
  activated: true,
  canActivate({ context = GOV_CONTEXT.UNKNOWN, impact = IMPACT.DRAFT, owner = null, explicit = {} } = {}) {
    if (context === GOV_CONTEXT.UNKNOWN) return deny("gov/context", "unknown context: deny");
    if (impact === IMPACT.IRREVERSIBLE) return deny("gov/impact", "irreversible impact: deny");

    const external = [IMPACT.SHARED, IMPACT.PUBLIC].includes(impact) || context === GOV_CONTEXT.PUBLIC;
    if (external && !String(owner ?? "").trim()) return deny("gov/owner", "owner required");
    if (external && explicit.authorized !== true) return deny("gov/authorization", "explicit authorization required");
    if (context === GOV_CONTEXT.ORG && explicit.responsible !== true) return deny("gov/responsibility", "responsible party required");

    return { allow: true, gate: "gov/ok", reason: "" };
  },
});
