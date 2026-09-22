import test from "node:test";
import assert from "node:assert/strict";
import { SubjectCore } from "../subject_core.js";
import { activateSkela } from "../skela_full_activation.js";
const keys = ["alpha", "IY", "Cm", "Q", "T"];
function active(core = new SubjectCore()) {
  core.begin({ intent: "Проверить неизвестное", invariant: "Не подставлять оценку" });
  return core;
}
test("missing metrics remain unknown through completion and JSON export", () => {
  const core = active();
  for (const metrics of [undefined, null, {}]) {
    const record = core.registerTransition({ plate: "РЕСУРС", metrics });
    assert.deepEqual(record.metrics, Object.fromEntries(keys.map(key => [key, null])));
  }
  const saved = JSON.parse(JSON.stringify(core.complete()));
  assert.equal(saved.language.tensor.Q, null);
  for (const record of saved.transitions) for (const key of keys) assert.equal(record.metrics[key], null);
});
test("blank and invalid inputs cannot become zero or invoke custom coercion", () => {
  const core = active();
  for (const value of [undefined,null,""," ","\t\n",NaN,Infinity,-Infinity,true,false,[],[0],{}, {toString(){throw Error("must not coerce");}},"not a number"]) {
    const record = core.registerTransition({ plate: "РЕСУРС", metrics: Object.fromEntries(keys.map(key => [key,value])) });
    for (const key of keys) assert.equal(record.metrics[key], null);
  }
});
test("explicit zero and existing numeric normalization are preserved", () => {
  const core = active();
  for (const [value,expected] of [[0,0],["0",0],[" 0 ",0],["0,75",0.75],[0.5,0.5],["1",1],[-1,0],[2,1]]) {
    const record = core.registerTransition({ plate: "РЕСУРС", metrics: {Q:value} });
    assert.equal(record.metrics.Q, expected);
    assert.equal(record.metrics.alpha, null);
  }
});
test("Skellu uses the corrected contract without inventing an observed return", () => {
  const core = active(activateSkela().subject);
  core.registerTransition({ plate: "РЕСУРС", metrics: {alpha:1,Q:""} });
  const snapshot = core.complete();
  assert.equal(snapshot.transitions[0].metrics.Q, null);
  assert.equal(snapshot.transitions[0].metrics.alpha, 1);
  assert.equal(snapshot.language.tensor.Q, null);
});
