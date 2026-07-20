// Subject Core v1.0.0
// Pure runtime contract for a subject moving an invariant through transitions.

const METRIC_KEYS = ["alpha", "IY", "Cm", "Q", "T"];

function cleanText(value) {
  return String(value ?? "").trim();
}

function normalizeMetric(value) {
  const number = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(1, number));
}

function normalizeMetrics(metrics = {}) {
  return Object.fromEntries(METRIC_KEYS.map((key) => [key, normalizeMetric(metrics[key])]));
}

export class SubjectCore {
  constructor({ subjectId = "local-subject", clock = () => new Date().toISOString() } = {}) {
    this.subjectId = cleanText(subjectId) || "local-subject";
    this.clock = clock;
    this.intent = "";
    this.invariant = "";
    this.context = "personal";
    this.transitions = [];
    this.state = "idle";
  }

  begin({ intent, invariant, context = "personal" } = {}) {
    const nextIntent = cleanText(intent);
    const nextInvariant = cleanText(invariant);
    if (nextIntent.length < 3) throw new Error("SUBJECT_INTENT_REQUIRED");
    if (nextInvariant.length < 3) throw new Error("SUBJECT_INVARIANT_REQUIRED");

    this.intent = nextIntent;
    this.invariant = nextInvariant;
    this.context = cleanText(context) || "personal";
    this.transitions = [];
    this.state = "active";
    return this.snapshot();
  }

  registerTransition({ plate, formula = {}, metrics = {}, axis = "review", note = "" } = {}) {
    if (this.state !== "active") throw new Error("SUBJECT_NOT_ACTIVE");
    const normalizedPlate = cleanText(plate);
    if (!normalizedPlate) throw new Error("SUBJECT_PLATE_REQUIRED");

    const record = Object.freeze({
      id: `${this.subjectId}:${this.transitions.length + 1}`,
      ts: this.clock(),
      plate: normalizedPlate,
      formula: {
        az: cleanText(formula.az),
        buka: cleanText(formula.buka),
        transmission: cleanText(formula.transmission ?? formula.tx),
      },
      metrics: normalizeMetrics(metrics),
      axis: ["preserved", "review", "rupture"].includes(axis) ? axis : "review",
      note: cleanText(note),
    });

    this.transitions.push(record);
    return record;
  }

  complete() {
    if (this.state !== "active") throw new Error("SUBJECT_NOT_ACTIVE");
    if (!this.transitions.length) throw new Error("SUBJECT_TRANSITION_REQUIRED");
    this.state = "completed";
    return this.snapshot();
  }

  snapshot() {
    return Object.freeze({
      schema: "architectonica.subject-core/1.0.0",
      subjectId: this.subjectId,
      state: this.state,
      intent: this.intent,
      invariant: this.invariant,
      context: this.context,
      transitions: this.transitions.map((transition) => ({ ...transition })),
    });
  }
}

export function createSubjectCore(options) {
  return new SubjectCore(options);
}
