import test from "node:test";
import assert from "node:assert/strict";

import { SubjectCore } from "../subject_core.js";
import { activateSkela } from "../skela_full_activation.js";
import { CONTEXT, PHASE, activateMetaCore, metaCanActivate } from "../meta_core_v2.js";

const strong = { alpha: 1, IY: 1, Cm: 1, Q: 1, T: 1 };

test("Subject Core requires intent and invariant and records a transition", () => {
  const core = new SubjectCore({ subjectId: "s1", clock: () => "2026-07-20T00:00:00.000Z" });
  assert.throws(() => core.begin({ intent: "Я", invariant: "ось" }), /SUBJECT_INTENT_REQUIRED/);
  core.begin({ intent: "Провести форму", invariant: "Сохранить авторство" });
  const transition = core.registerTransition({ plate: "РЕСУРС", formula: { az: "Азъ", buka: "Поле", tx: "Импульс" }, metrics: strong, axis: "preserved" });
  assert.equal(transition.metrics.alpha, 1);
  assert.equal(core.complete().state, "completed");
});

test("Skellu activates a pure Subject Core without React imports", () => {
  const skellu = activateSkela({ subjectId: "s2" });
  assert.equal(skellu.activated, true);
  assert.equal(skellu.subject.subjectId, "s2");
  assert.equal(typeof skellu.demons.evaluate, "function");
});

test("Meta Core denies unknown/public defaults and critical risk", () => {
  assert.equal(metaCanActivate({ plate: "РЕСУРС", metrics: strong, context: CONTEXT.UNKNOWN }).gate, "gov/context");
  assert.equal(metaCanActivate({ plate: "РЕСУРС", metrics: strong, context: CONTEXT.PUBLIC }).gate, "gov/owner");
  assert.equal(metaCanActivate({ plate: "РЕСУРС", metrics: strong, risk: "critical" }).gate, "neg");
});

test("Meta Core exposes evidence for a successful materialization gate", () => {
  const result = metaCanActivate({ plate: "РЕЗУЛЬТАТ", metrics: strong, phase: PHASE.MATERIALIZE, context: CONTEXT.PERSONAL });
  assert.equal(result.allow, true);
  assert.equal(result.gate, "measure");
  assert.equal(result.attempt.allowed, true);
  assert.equal(result.attempt.invariant.measurePassed, null);
});

test("Meta Core reports the failed metric gate", () => {
  const result = metaCanActivate({ plate: "РЕСУРС", metrics: { ...strong, Q: 0.25 }, context: CONTEXT.PERSONAL });
  assert.equal(result.allow, false);
  assert.equal(result.gate, "love");
  assert.equal(result.attempt.allowed, false);
});

test("activated Meta Core exposes all four runtime roles", () => {
  const meta = activateMetaCore();
  assert.equal(meta.activated, true);
  assert.equal(meta.skela.activated, true);
  assert.equal(meta.gov.activated, true);
  assert.equal(meta.neg.activated, true);
});
