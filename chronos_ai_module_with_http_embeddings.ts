/**
 * chronos_ai_module.ts
 *
 * Production-oriented Chronos AI module:
 * - temporal memory
 * - semantic feature interface
 * - trajectory analysis
 * - branch prediction
 * - loop detection
 * - sequence analysis
 * - outcome feedback / calibration hooks
 *
 * This module is intentionally framework-agnostic.
 */

export type Plate = "РЕСУРС" | "ВЛАСТЬ" | "ОТНОШЕНИЯ" | "РЕЗУЛЬТАТ";
export type TrajectoryType = "T_self" | "T_social" | "hybrid";
export type RecommendedMode = "hold" | "observe" | "stabilize" | "continue" | "shift";

export interface ChronosMetrics {
  alpha?: number | null;
  IY?: number | null;
  Cm?: number | null;
  Q?: number | null;
  T?: number | null;
}

export interface ChronosEventInput {
  ts?: string;
  userId?: string;

  plate?: Plate;
  azId?: string | null;
  bukaId?: string | null;
  txId?: string | null;
  pointType?: string | null;
  geometry?: string | null;

  note?: string;
  induction?: string;
  inversion?: string;
  objectLabel?: string;
  imageLabel?: string;

  metrics?: ChronosMetrics;

  metadata?: Record<string, unknown>;
}

export interface SemanticFeatures {
  noteSignal: number;
  inductionSignal: number;
  inversionSignal: number;
  objectSignal: number;
  imageSignal: number;

  selfSemantic: number;
  socialSemantic: number;
  coherence: number;
  ambiguity: number;
  tension: number;
}

export interface ChronosStateVector {
  conductance: number;
  containment: number;
  preflight: number;

  selfDrive: number;
  socialDrive: number;
  delta: number;

  coherence: number;
  ambiguity: number;
  tension: number;

  eventMagnitude: number;
}

export interface ChronosStepResult {
  ts: string;
  state: ChronosStateVector;

  trajectoryType: TrajectoryType;
  dominantArrow: "I_now->E_future" | "E_past->I_future" | "balanced";

  branchProbability: number;
  shiftProbability: number;
  continuationProbability: number;

  recommendedMode: RecommendedMode;
  reasons: string[];

  sourceEvent: ChronosEventInput;
}

export interface ChronosOutcomeRecord {
  ts?: string;
  userId?: string;
  predictedMode: RecommendedMode;
  chosenMode?: RecommendedMode | null;
  realizedTrajectory?: TrajectoryType | null;
  realizedBranch?: boolean | null;
  successScore?: number | null; // 0..1
  notes?: string;
}

export interface ChronosProfile {
  baselineSelf: number;
  baselineSocial: number;
  baselineConductance: number;
  volatility: number;
  branchSensitivity: number;
  lastUpdatedAt: string | null;
}

export interface LoopDetectionResult {
  isLoop: boolean;
  loopKind: "none" | "oscillation" | "stagnation" | "repetition";
  confidence: number;
  windowSize: number;
  reasons: string[];
}

export interface SequenceAnalysisResult {
  latest: ChronosStepResult | null;
  trend: {
    deltaSlope: number;
    conductanceSlope: number;
    branchSlope: number;
    dominant: "self" | "social" | "balanced";
  };
  loop: LoopDetectionResult;
  count: number;
  recent: ChronosStepResult[];
}

export interface ChronosMemory {
  events: ChronosStepResult[];
  profile: ChronosProfile;
  outcomes: ChronosOutcomeRecord[];
  calibration: {
    shiftBias: number;
    continueBias: number;
    stabilizeBias: number;
  };
}

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

/**
 * Fallback deterministic embedder.
 * Good enough for development, not for production semantics.
 */
export class NullEmbeddingProvider implements EmbeddingProvider {
  async embed(text: string): Promise<number[]> {
    const clean = (text || "").trim().toLowerCase();
    if (!clean) return new Array(24).fill(0);

    const out = new Array(24).fill(0);
    for (let i = 0; i < clean.length; i++) {
      out[i % out.length] += clean.charCodeAt(i) / 255;
    }

    const norm = Math.sqrt(out.reduce((s, x) => s + x * x, 0)) || 1;
    return out.map((x) => x / norm);
  }
}

/**
 * Generic HTTP embedding provider.
 *
 * Expects a JSON API that returns either:
 * - { embedding: number[] }
 * - { data: [{ embedding: number[] }] }
 *
 * Example adapter usage:
 *   new HttpEmbeddingProvider({
 *     endpoint: process.env.EMBEDDING_URL!,
 *     apiKey: process.env.EMBEDDING_API_KEY,
 *     model: "text-embedding-3-small",
 *   })
 */
export class HttpEmbeddingProvider implements EmbeddingProvider {
  private endpoint: string;
  private apiKey?: string;
  private model?: string;
  private headers?: Record<string, string>;
  private inputBuilder?: (text: string, model?: string) => Record<string, unknown>;

  constructor(options: {
    endpoint: string;
    apiKey?: string;
    model?: string;
    headers?: Record<string, string>;
    inputBuilder?: (text: string, model?: string) => Record<string, unknown>;
  }) {
    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.headers = options.headers;
    this.inputBuilder = options.inputBuilder;
  }

  async embed(text: string): Promise<number[]> {
    const clean = (text || "").trim();
    if (!clean) return new Array(24).fill(0);

    const payload = this.inputBuilder
      ? this.inputBuilder(clean, this.model)
      : {
          input: clean,
          ...(this.model ? { model: this.model } : {}),
        };

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        ...(this.headers || {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Embedding request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json() as
      | { embedding?: number[]; data?: Array<{ embedding?: number[] }> }
      | Record<string, unknown>;

    const embedding =
      Array.isArray((json as { embedding?: number[] }).embedding)
        ? (json as { embedding: number[] }).embedding
        : Array.isArray((json as { data?: Array<{ embedding?: number[] }> }).data) &&
          Array.isArray((json as { data: Array<{ embedding?: number[] }> }).data[0]?.embedding)
          ? (json as { data: Array<{ embedding?: number[] }> }).data[0].embedding!
          : null;

    if (!embedding || !embedding.length) {
      throw new Error("Embedding response did not contain a valid embedding vector");
    }

    return this.normalizeEmbedding(embedding);
  }

  private normalizeEmbedding(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((s, x) => s + x * x, 0)) || 1;
    return vector.map((x) => x / norm);
  }
}

const ANGELIC_THRESH = { alpha: 0.75, Q: 0.75, T: 0.75 };

const GATE_THRESH: Record<Plate, {
  love: { Q: number; T: number; alpha: number };
  measure: { IY: number; Cm: number; alpha: number };
}> = {
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

function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function mean(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function num(x: unknown): number | null {
  const v = Number(String(x ?? "").replace(",", "."));
  return Number.isFinite(v) ? v : null;
}

function safeText(x?: string): string {
  return (x || "").trim();
}

function textStrength(x?: string, max = 200): number {
  const t = safeText(x);
  return clamp01(t.length / max);
}

function cosine(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

function l1Distance(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 1;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

function normalizeMetrics(metrics: ChronosMetrics = {}): Required<ChronosMetrics> {
  return {
    alpha: num(metrics.alpha) ?? 0,
    IY:    num(metrics.IY) ?? 0,
    Cm:    num(metrics.Cm) ?? 0,
    Q:     num(metrics.Q) ?? 0,
    T:     num(metrics.T) ?? 0,
  };
}

function defaultProfile(): ChronosProfile {
  return {
    baselineSelf: 0.5,
    baselineSocial: 0.5,
    baselineConductance: 0.5,
    volatility: 0.2,
    branchSensitivity: 0.5,
    lastUpdatedAt: null,
  };
}

function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const xs = Array.from({ length: n }, (_, i) => i);
  const meanX = mean(xs);
  const meanY = mean(values);

  let nume = 0;
  let deno = 0;

  for (let i = 0; i < n; i++) {
    nume += (xs[i] - meanX) * (values[i] - meanY);
    deno += (xs[i] - meanX) ** 2;
  }

  if (deno === 0) return 0;
  return nume / deno;
}

function round3(x: number): number {
  return Math.round(x * 1000) / 1000;
}

export class ChronosAI {
  private embedding: EmbeddingProvider;
  private memory: Map<string, ChronosMemory>;
  private maxEvents: number;

  constructor(options?: {
    embeddingProvider?: EmbeddingProvider;
    maxEvents?: number;
  }) {
    this.embedding = options?.embeddingProvider ?? new NullEmbeddingProvider();
    this.memory = new Map();
    this.maxEvents = Math.max(10, options?.maxEvents ?? 300);
  }

  getMemory(userId: string): ChronosMemory {
    if (!this.memory.has(userId)) {
      this.memory.set(userId, {
        events: [],
        profile: defaultProfile(),
        outcomes: [],
        calibration: {
          shiftBias: 0,
          continueBias: 0,
          stabilizeBias: 0,
        },
      });
    }
    return this.memory.get(userId)!;
  }

  async analyze(event: ChronosEventInput): Promise<ChronosStepResult> {
    const userId = event.userId || "default";
    const ts = event.ts || new Date().toISOString();
    const plate = event.plate || "РЕСУРС";

    const memory = this.getMemory(userId);
    const semantic = await this.extractSemanticFeatures(event);
    const state = this.computeStateVector(event, semantic, memory.profile, plate);
    const result = this.resolveTrajectory(state, event, memory, ts);

    memory.events.push(result);
    if (memory.events.length > this.maxEvents) {
      memory.events.shift();
    }

    memory.profile = this.updateProfile(memory.profile, result, ts);
    return result;
  }

  async analyzeSequence(events: ChronosEventInput[], userId = "default"): Promise<SequenceAnalysisResult> {
    const results: ChronosStepResult[] = [];
    for (const event of events) {
      const result = await this.analyze({ ...event, userId: event.userId || userId });
      results.push(result);
    }

    const recent = this.getMemory(userId).events.slice(-12);
    const latest = recent.length ? recent[recent.length - 1] : null;

    const trend = {
      deltaSlope: round3(linearSlope(recent.map((e) => e.state.delta))),
      conductanceSlope: round3(linearSlope(recent.map((e) => e.state.conductance))),
      branchSlope: round3(linearSlope(recent.map((e) => e.branchProbability))),
      dominant: this.detectDominantTrend(recent),
    };

    return {
      latest,
      trend,
      loop: this.detectLoop(userId),
      count: recent.length,
      recent,
    };
  }

  async recordOutcome(outcome: ChronosOutcomeRecord): Promise<void> {
    const userId = outcome.userId || "default";
    const memory = this.getMemory(userId);
    const ts = outcome.ts || new Date().toISOString();

    memory.outcomes.push({ ...outcome, ts });
    if (memory.outcomes.length > this.maxEvents) {
      memory.outcomes.shift();
    }

    // Простая онлайн-калибровка. Не обучение модели, а смещение режимов.
    const success = clamp01(outcome.successScore ?? 0.5);
    const chosen = outcome.chosenMode ?? outcome.predictedMode;
    const predicted = outcome.predictedMode;

    const delta = success - 0.5;
    const lr = 0.05;

    if (predicted === "shift" || chosen === "shift") {
      memory.calibration.shiftBias = clamp01(0.5 + (memory.calibration.shiftBias + lr * delta)) - 0.5;
    }
    if (predicted === "continue" || chosen === "continue") {
      memory.calibration.continueBias = clamp01(0.5 + (memory.calibration.continueBias + lr * delta)) - 0.5;
    }
    if (predicted === "stabilize" || chosen === "stabilize") {
      memory.calibration.stabilizeBias = clamp01(0.5 + (memory.calibration.stabilizeBias + lr * delta)) - 0.5;
    }
  }

  detectLoop(userId = "default", windowSize = 8): LoopDetectionResult {
    const memory = this.getMemory(userId);
    const recent = memory.events.slice(-windowSize);

    if (recent.length < 4) {
      return {
        isLoop: false,
        loopKind: "none",
        confidence: 0,
        windowSize: recent.length,
        reasons: ["недостаточно истории"],
      };
    }

    const deltas = recent.map((e) => e.state.delta);
    const modes = recent.map((e) => e.recommendedMode);
    const branches = recent.map((e) => e.branchProbability);

    const reasons: string[] = [];

    // oscillation: знак дельты часто меняется
    let signFlips = 0;
    for (let i = 1; i < deltas.length; i++) {
      if (Math.sign(deltas[i]) !== Math.sign(deltas[i - 1]) && Math.abs(deltas[i]) > 0.04 && Math.abs(deltas[i - 1]) > 0.04) {
        signFlips++;
      }
    }
    const oscillationScore = clamp01(signFlips / Math.max(1, deltas.length - 1));

    // stagnation: все дельты маленькие, conductance средний/низкий
    const meanAbsDelta = mean(deltas.map((d) => Math.abs(d)));
    const meanConductance = mean(recent.map((e) => e.state.conductance));
    const stagnationScore = clamp01((0.18 - meanAbsDelta) / 0.18) * clamp01((0.75 - meanConductance) / 0.75);

    // repetition: повтор одного режима
    const modeCounts = new Map<string, number>();
    for (const mode of modes) modeCounts.set(mode, (modeCounts.get(mode) || 0) + 1);
    const maxModeCount = Math.max(...Array.from(modeCounts.values()));
    const repetitionScore = clamp01(maxModeCount / modes.length);

    const branchMean = mean(branches);

    let loopKind: LoopDetectionResult["loopKind"] = "none";
    let confidence = 0;

    if (oscillationScore >= 0.6) {
      loopKind = "oscillation";
      confidence = oscillationScore;
      reasons.push("частая смена знака дельты");
    } else if (stagnationScore >= 0.55) {
      loopKind = "stagnation";
      confidence = stagnationScore;
      reasons.push("слабое движение при невысокой проводимости");
    } else if (repetitionScore >= 0.75 && branchMean < 0.45) {
      loopKind = "repetition";
      confidence = repetitionScore;
      reasons.push("повтор одного режима без признака развилки");
    }

    return {
      isLoop: loopKind !== "none",
      loopKind,
      confidence: round3(confidence),
      windowSize: recent.length,
      reasons: reasons.length ? reasons : ["признаков цикла не найдено"],
    };
  }

  humanizeResult(result: ChronosStepResult | null): string {
    if (!result) return "no-data";
    return [
      result.trajectoryType,
      result.dominantArrow,
      `mode=${result.recommendedMode}`,
      `branch=${round3(result.branchProbability)}`,
      `delta=${round3(result.state.delta)}`,
      `conductance=${round3(result.state.conductance)}`
    ].join(" · ");
  }

  private async extractSemanticFeatures(event: ChronosEventInput): Promise<SemanticFeatures> {
    const note = safeText(event.note);
    const induction = safeText(event.induction);
    const inversion = safeText(event.inversion);
    const objectLabel = safeText(event.objectLabel);
    const imageLabel = safeText(event.imageLabel);

    const noteEmb = await this.embedding.embed(note);
    const inductionEmb = await this.embedding.embed(induction);
    const inversionEmb = await this.embedding.embed(inversion);
    const objectEmb = await this.embedding.embed(objectLabel);
    const imageEmb = await this.embedding.embed(imageLabel);

    const inductionVsInversion = cosine(inductionEmb, inversionEmb);
    const objectVsImage = cosine(objectEmb, imageEmb);
    const noteVsInduction = cosine(noteEmb, inductionEmb);
    const noteVsInversion = cosine(noteEmb, inversionEmb);

    const semanticGap = l1Distance(inductionEmb, inversionEmb);

    const selfSemantic = clamp01(
      0.40 * textStrength(induction) +
      0.16 * textStrength(note) +
      0.14 * clamp01((noteVsInduction + 1) / 2) +
      0.12 * textStrength(imageLabel) +
      0.18 * (1 - clamp01((inductionVsInversion + 1) / 2))
    );

    const socialSemantic = clamp01(
      0.40 * textStrength(inversion) +
      0.18 * textStrength(objectLabel) +
      0.10 * textStrength(imageLabel) +
      0.14 * clamp01((noteVsInversion + 1) / 2) +
      0.18 * clamp01((objectVsImage + 1) / 2)
    );

    const coherence = clamp01(
      0.52 * clamp01((noteVsInduction + 1) / 2) +
      0.48 * clamp01((objectVsImage + 1) / 2)
    );

    const ambiguity = clamp01(
      0.6 * (1 - semanticGap) +
      0.4 * Math.min(selfSemantic, socialSemantic)
    );

    const tension = clamp01(
      0.45 * semanticGap +
      0.25 * Math.abs(selfSemantic - socialSemantic) +
      0.30 * (1 - coherence)
    );

    return {
      noteSignal: textStrength(note),
      inductionSignal: textStrength(induction),
      inversionSignal: textStrength(inversion),
      objectSignal: textStrength(objectLabel),
      imageSignal: textStrength(imageLabel),

      selfSemantic,
      socialSemantic,
      coherence,
      ambiguity,
      tension,
    };
  }

  private computeStateVector(
    event: ChronosEventInput,
    semantic: SemanticFeatures,
    profile: ChronosProfile,
    plate: Plate
  ): ChronosStateVector {
    const metrics = normalizeMetrics(event.metrics);
    const thr = GATE_THRESH[plate];

    const preflight = mean([metrics.alpha, metrics.Q, metrics.T]);
    const containment = mean([metrics.IY, metrics.Cm, metrics.alpha]);
    const conductance = clamp01(0.6 * preflight + 0.4 * containment);

    const txBias = this.txBias(event.txId);
    const pointBias = this.pointBias(event.pointType);
    const bukaBias = this.bukaBias(event.bukaId);

    const selfDrive = clamp01(
      0.30 * semantic.selfSemantic +
      0.18 * txBias.self +
      0.12 * pointBias.self +
      0.10 * bukaBias.self +
      0.15 * conductance +
      0.15 * semantic.coherence
    );

    const socialDrive = clamp01(
      0.30 * semantic.socialSemantic +
      0.18 * txBias.social +
      0.12 * pointBias.social +
      0.10 * bukaBias.social +
      0.12 * semantic.ambiguity +
      0.18 * semantic.tension
    );

    const centeredSelf = clamp01(0.7 * selfDrive + 0.3 * (selfDrive - profile.baselineSelf + 0.5));
    const centeredSocial = clamp01(0.7 * socialDrive + 0.3 * (socialDrive - profile.baselineSocial + 0.5));

    const delta = centeredSelf - centeredSocial;
    const eventMagnitude = clamp01(
      0.45 * conductance +
      0.22 * Math.max(centeredSelf, centeredSocial) +
      0.15 * semantic.tension +
      0.18 * semantic.coherence
    );

    const passPreflight =
      metrics.alpha >= ANGELIC_THRESH.alpha &&
      metrics.Q >= ANGELIC_THRESH.Q &&
      metrics.T >= ANGELIC_THRESH.T;

    const passContainment =
      metrics.IY >= thr.measure.IY &&
      metrics.Cm >= thr.measure.Cm &&
      metrics.alpha >= thr.measure.alpha;

    const penalty = (!passPreflight && !passContainment) ? 0.65 : (!passPreflight ? 0.85 : 1.0);

    return {
      conductance: clamp01(conductance * penalty),
      containment: round3(containment),
      preflight: round3(preflight),

      selfDrive: clamp01(centeredSelf * penalty),
      socialDrive: clamp01(centeredSocial * penalty),
      delta: round3(delta * penalty),

      coherence: round3(semantic.coherence),
      ambiguity: round3(semantic.ambiguity),
      tension: round3(semantic.tension),

      eventMagnitude: round3(clamp01(eventMagnitude * penalty)),
    };
  }

  private resolveTrajectory(
    state: ChronosStateVector,
    event: ChronosEventInput,
    memory: ChronosMemory,
    ts: string
  ): ChronosStepResult {
    const recent = memory.events.slice(-6);
    const recentDelta = recent.length ? mean(recent.map((e) => e.state.delta)) : 0;
    const recentMagnitude = recent.length ? mean(recent.map((e) => e.state.eventMagnitude)) : 0;
    const recentConductance = recent.length ? mean(recent.map((e) => e.state.conductance)) : 0;
    const recentBranch = recent.length ? mean(recent.map((e) => e.branchProbability)) : 0;

    const smoothedDelta = 0.62 * state.delta + 0.38 * recentDelta;
    const smoothedMagnitude = 0.7 * state.eventMagnitude + 0.3 * recentMagnitude;

    let trajectoryType: TrajectoryType = "hybrid";
    let dominantArrow: "I_now->E_future" | "E_past->I_future" | "balanced" = "balanced";

    if (smoothedDelta >= 0.10) {
      trajectoryType = "T_self";
      dominantArrow = "I_now->E_future";
    } else if (smoothedDelta <= -0.10) {
      trajectoryType = "T_social";
      dominantArrow = "E_past->I_future";
    }

    const volatility = this.computeVolatility(recent, state);
    const nearBoundary = 1 - clamp01(Math.abs(smoothedDelta) / 0.25);

    const branchProbability = clamp01(sigmoid(
      2.25 * nearBoundary +
      1.35 * state.tension +
      1.15 * smoothedMagnitude +
      0.95 * volatility +
      0.35 * recentBranch -
      1.45
    ));

    const shiftProbability = clamp01(sigmoid(
      2.0 * Math.max(0, smoothedDelta) +
      1.15 * state.conductance +
      0.75 * state.coherence +
      memory.calibration.shiftBias -
      1.25
    ));

    const continuationProbability = clamp01(sigmoid(
      2.0 * Math.max(0, -smoothedDelta) +
      0.9 * recentConductance +
      0.75 * state.coherence +
      memory.calibration.continueBias -
      1.05
    ));

    let recommendedMode: RecommendedMode = "observe";
    const reasons: string[] = [];

    if (state.conductance < 0.45) {
      recommendedMode = "hold";
      reasons.push("низкая проводимость");
    } else if (branchProbability + memory.calibration.stabilizeBias >= 0.68) {
      recommendedMode = "stabilize";
      reasons.push("высокая вероятность ветвления");
    } else if (trajectoryType === "T_self" && shiftProbability >= 0.58) {
      recommendedMode = "shift";
      reasons.push("доминирует внутренний сдвиг");
    } else if (trajectoryType === "T_social" && continuationProbability >= 0.58) {
      recommendedMode = "continue";
      reasons.push("внешняя линия устойчива");
    } else {
      recommendedMode = "observe";
      reasons.push("мало определённости");
    }

    if (state.ambiguity > 0.7) reasons.push("высокая неоднозначность сигнала");
    if (volatility > 0.55) reasons.push("повышенная волатильность");
    if (recent.length < 3) reasons.push("история ещё короткая");

    return {
      ts,
      state,
      trajectoryType,
      dominantArrow,
      branchProbability: round3(branchProbability),
      shiftProbability: round3(shiftProbability),
      continuationProbability: round3(continuationProbability),
      recommendedMode,
      reasons,
      sourceEvent: event,
    };
  }

  private updateProfile(profile: ChronosProfile, result: ChronosStepResult, ts: string): ChronosProfile {
    const lr = 0.08;
    const nextSelf = (1 - lr) * profile.baselineSelf + lr * result.state.selfDrive;
    const nextSocial = (1 - lr) * profile.baselineSocial + lr * result.state.socialDrive;
    const nextCond = (1 - lr) * profile.baselineConductance + lr * result.state.conductance;
    const nextVol = clamp01((1 - lr) * profile.volatility + lr * Math.abs(result.state.delta));
    const nextBranchSensitivity = clamp01(
      (1 - lr) * profile.branchSensitivity + lr * result.branchProbability
    );

    return {
      baselineSelf: round3(nextSelf),
      baselineSocial: round3(nextSocial),
      baselineConductance: round3(nextCond),
      volatility: round3(nextVol),
      branchSensitivity: round3(nextBranchSensitivity),
      lastUpdatedAt: ts,
    };
  }

  private computeVolatility(recent: ChronosStepResult[], current: ChronosStateVector): number {
    const deltas = recent.map((e) => e.state.delta);
    deltas.push(current.delta);

    if (deltas.length < 2) return Math.abs(current.delta);

    const meanDelta = mean(deltas);
    const variance = mean(deltas.map((d) => (d - meanDelta) ** 2));
    return clamp01(Math.sqrt(variance) / 0.5);
  }

  private detectDominantTrend(recent: ChronosStepResult[]): "self" | "social" | "balanced" {
    if (!recent.length) return "balanced";
    const avgDelta = mean(recent.map((e) => e.state.delta));
    if (avgDelta >= 0.08) return "self";
    if (avgDelta <= -0.08) return "social";
    return "balanced";
  }

  private txBias(txId?: string | null): { self: number; social: number } {
    const selfTx = new Set(["TX1", "TX4", "TX5", "TX6", "TX7"]);
    const socialTx = new Set(["TX2", "TX3"]);

    return {
      self: selfTx.has(txId || "") ? 1 : 0,
      social: socialTx.has(txId || "") ? 1 : 0,
    };
  }

  private pointBias(pointType?: string | null): { self: number; social: number } {
    const selfPoint = new Set(["Разрыв", "Интеграция"]);
    const socialPoint = new Set(["Залипание", "Вход"]);

    return {
      self: selfPoint.has(pointType || "") ? 1 : 0,
      social: socialPoint.has(pointType || "") ? 1 : 0,
    };
  }

  private bukaBias(bukaId?: string | null): { self: number; social: number } {
    const selfBuki = new Set(["B10", "B11", "B12", "B18", "B19", "B21"]);
    const socialBuki = new Set(["B8", "B9", "B6", "B24"]);

    return {
      self: selfBuki.has(bukaId || "") ? 1 : 0,
      social: socialBuki.has(bukaId || "") ? 1 : 0,
    };
  }
}


/**
 * Example factory for OpenAI-compatible embedding APIs.
 * Adjust endpoint if your gateway differs.
 */
export function createOpenAICompatibleEmbeddingProvider(options: {
  endpoint: string;
  apiKey: string;
  model: string;
}): EmbeddingProvider {
  return new HttpEmbeddingProvider({
    endpoint: options.endpoint,
    apiKey: options.apiKey,
    model: options.model,
  });
}

/**
 * Small helper for quick demos / UI.
 */
export async function demoChronosSequence(): Promise<SequenceAnalysisResult> {
  const chronos = new ChronosAI();

  const events: ChronosEventInput[] = [
    {
      plate: "РЕСУРС",
      azId: "A1",
      bukaId: "B11",
      txId: "TX4",
      pointType: "Интеграция",
      note: "Собираю разрозненные части в один фокус.",
      induction: "Есть внутреннее движение к упрощению.",
      inversion: "Внешний шум всё ещё тянет меня распыляться.",
      objectLabel: "рабочий стол",
      imageLabel: "лучи сходятся в центр",
      metrics: { alpha: 0.82, IY: 0.63, Cm: 0.61, Q: 0.78, T: 0.84 },
    },
    {
      plate: "РЕСУРС",
      azId: "A1",
      bukaId: "B18",
      txId: "TX5",
      pointType: "Интеграция",
      note: "Становится меньше хаоса и больше структуры.",
      induction: "Внутренний вектор удерживается увереннее.",
      inversion: "Мир уже меньше разрывает внимание.",
      objectLabel: "ноутбук",
      imageLabel: "чистая ось",
      metrics: { alpha: 0.84, IY: 0.66, Cm: 0.67, Q: 0.80, T: 0.83 },
    },
    {
      plate: "РЕСУРС",
      azId: "A1",
      bukaId: "B24",
      txId: "TX3",
      pointType: "Вход",
      note: "Внешняя среда снова усилила требования.",
      induction: "Я хочу сохранить внутренний курс.",
      inversion: "Наружные сигналы втягивают в реактивность.",
      objectLabel: "чат",
      imageLabel: "раскрытый канал",
      metrics: { alpha: 0.78, IY: 0.60, Cm: 0.58, Q: 0.77, T: 0.79 },
    },
  ];

  return chronos.analyzeSequence(events, "demo-user");
}
