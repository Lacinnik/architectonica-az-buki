// collectiveMetaCore.ts
// Над-субъектный Meta-движок допуска ⊕-встреч
// Использует sharedField как вход и выдаёт решение: можно ли переход

export type SubjectID = string;

export type MetricsSet = {
  alpha: number;
  Q: number;
  T: number;
  IY?: number;
  Cm?: number;
};

export type TrustLink = {
  from: SubjectID;
  to: SubjectID;
  object: string;
  image: string;
  tx: string;
  metrics: MetricsSet;
  timestamp: string;
};

export type SharedObj = {
  label: string;
  object: string;
  image: string;
  geometry: string;
  point_type: string;
  metrics: MetricsSet;
  created_by: SubjectID;
  timestamp: string;
};

export type SharedField = {
  id: string;
  created_at: string;
  created_by: SubjectID;
  subject_ids: SubjectID[];
  trust_links: TrustLink[];
  shared_objects: SharedObj[];
  active_phase?: string;
  meta?: {
    title?: string;
    description?: string;
    geometry?: string;
    metrics?: MetricsSet;
  };
};

export type MetaDecision = {
  allow: boolean;
  gate: "trust" | "metrics" | "sync" | "ok";
  reason: string;
  synthesis_ready: boolean;
  avg_metrics: MetricsSet;
  links_verified: boolean;
  subjects: SubjectID[];
  shared_id: string;
};

export function collectiveMetaCore(field: SharedField): MetaDecision {
  const subs = field.subject_ids;
  const links = field.trust_links || [];
  const metrics = (field.shared_objects || []).map(o => o.metrics).filter(Boolean);

  const avg = (key: keyof MetricsSet): number => {
    const values = metrics.map(m => m[key]).filter((n): n is number => typeof n === "number");
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  const avgMetrics: MetricsSet = {
    alpha: avg("alpha"),
    Q: avg("Q"),
    T: avg("T"),
    IY: avg("IY"),
    Cm: avg("Cm"),
  };

  const linksVerified = subs.every(a =>
    subs.some(b => b !== a && links.some(l => l.from === a && l.to === b))
  );

  const synthesisReady =
    avgMetrics.alpha >= 0.75 &&
    avgMetrics.Q >= 0.75 &&
    avgMetrics.T >= 0.75 &&
    linksVerified;

  return {
    allow: synthesisReady,
    gate: synthesisReady ? "ok" : "metrics",
    reason: synthesisReady ? "" : "Недостаточная проводимость или доверие",
    synthesis_ready: synthesisReady,
    avg_metrics: avgMetrics,
    links_verified: linksVerified,
    subjects: subs,
    shared_id: field.id,
  };
}
