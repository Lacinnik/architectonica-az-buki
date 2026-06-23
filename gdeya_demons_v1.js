
// gdeya_demons_v1.js
// Демоны Любви (Анима) и Меры (Анимус)
// Шкала метрик: 0.0 / 0.25 / 0.5 / 0.75 / 1.0

export const GATE_THRESH = {
  "РЕСУРС": {
    love:    { Q: 0.50, T: 0.75, alpha: 0.50 },
    measure: { IY: 0.50, Cm: 0.50, alpha: 0.50 },
  },
  "ВЛАСТЬ": {
    love:    { Q: 0.75, T: 0.50, alpha: 0.75 },
    measure: { IY: 0.75, Cm: 0.50, alpha: 0.75 },
  },
  "ОТНОШЕНИЯ": {
    love:    { Q: 0.75, T: 0.75, alpha: 0.50 },
    measure: { IY: 0.50, Cm: 0.75, alpha: 0.75 },
  },
  "РЕЗУЛЬТАТ": {
    love:    { Q: 0.50, T: 0.50, alpha: 0.75 },
    measure: { IY: 0.75, Cm: 0.75, alpha: 0.75 },
  },
};

export function parseMetrics(m) {
  const num = (x) => {
    const v = Number(String(x ?? "").replace(",", "."));
    return Number.isFinite(v) ? v : null;
  };
  return {
    alpha: num(m.alpha),
    IY:    num(m.IY),
    Cm:    num(m.Cm),
    Q:     num(m.Q),
    T:     num(m.T),
  };
}

export function loveTier(metrics) {
  const minLove = Math.min(metrics.Q, metrics.T, metrics.alpha);
  if (minLove >= 0.75) return "high";
  if (minLove >= 0.50) return "mid";
  return "low";
}

export function adjustMeasureThresholds(base, tier) {
  if (tier === "high") return base;
  if (tier === "mid") {
    return {
      IY: base.IY + 0.25,
      Cm: base.Cm,
      alpha: base.alpha + 0.25,
    };
  }
  return base;
}

export function evaluateGates({ plate, metrics }) {
  const thr = GATE_THRESH[plate] || GATE_THRESH["РЕСУРС"];
  const m = parseMetrics(metrics);

  if (m.Q == null || m.T == null || m.alpha == null) {
    return { love: { pass: false, reason: "Q/T/α not set" } };
  }

  const lovePass =
    m.Q >= thr.love.Q &&
    m.T >= thr.love.T &&
    m.alpha >= thr.love.alpha;

  const tier = loveTier(m);

  if (!lovePass) {
    return {
      love: {
        pass: false,
        tier,
        reason: `Need Q≥${thr.love.Q}, T≥${thr.love.T}, α≥${thr.love.alpha}`,
      },
    };
  }

  if (m.IY == null || m.Cm == null || m.alpha == null) {
    return {
      love: { pass: true, tier },
      measure: { pass: false, reason: "IY/Cm/α not set" },
    };
  }

  const adj = adjustMeasureThresholds(thr.measure, tier);

  const measurePass =
    m.IY >= adj.IY &&
    m.Cm >= adj.Cm &&
    m.alpha >= adj.alpha;

  return {
    love: { pass: true, tier },
    measure: {
      pass: measurePass,
      thresholds: adj,
      reason: measurePass ? "" : `Need IY≥${adj.IY}, Cm≥${adj.Cm}, α≥${adj.alpha}`,
    },
  };
}

export function makeAttempt({ ts, plate, card, metrics, gate, allowed, reason, tier, measurePassed }) {
  return {
    ts,
    kind: "attempt",
    plate,
    card,
    metrics,
    gate,
    allowed,
    reason: reason || "",
    invariant: {
      loveTier: tier ?? null,
      measurePassed: measurePassed ?? null,
    },
  };
}

export function computeFunnel(diary) {
  const attempts = (diary || []).filter(d => d?.kind === "attempt");
  const entries  = (diary || []).filter(d => d?.kind === "entry" || d?.kind == null);

  const loveAttempts = attempts.filter(a => a.gate === "love");
  const lovePasses   = loveAttempts.filter(a => a.allowed);

  const measureAttempts = attempts.filter(a => a.gate === "measure");
  const measurePasses   = measureAttempts.filter(a => a.allowed);

  const pct = (n, d) => d > 0 ? Math.round((n/d)*100) : 0;

  const byTier = (tier) => {
    const a = measureAttempts.filter(x => x?.invariant?.loveTier === tier);
    const p = a.filter(x => x.allowed);
    return { attempts: a.length, passes: p.length, pct: pct(p.length, a.length) };
  };

  return {
    entries: entries.length,
    love: {
      attempts: loveAttempts.length,
      passes: lovePasses.length,
      pct: pct(lovePasses.length, loveAttempts.length),
    },
    measure: {
      attempts: measureAttempts.length,
      passes: measurePasses.length,
      pct: pct(measurePasses.length, measureAttempts.length),
    },
    tier: {
      high: byTier("high"),
      mid: byTier("mid"),
      low: byTier("low"),
    },
  };
}
