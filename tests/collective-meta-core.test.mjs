import test from "node:test";
import assert from "node:assert/strict";

import { collectiveMetaCore } from "../collective_meta_core.ts";

const metrics = { alpha: 0.8, Q: 0.9, T: 0.85, IY: 0.75, Cm: 0.8 };
const base = {
  id: "field-1",
  created_at: "2026-07-20T00:00:00.000Z",
  created_by: "a",
  subject_ids: ["a", "b"],
  trust_links: [
    { from: "a", to: "b", object: "o", image: "i", tx: "t", metrics, timestamp: "1" },
    { from: "b", to: "a", object: "o", image: "i", tx: "t", metrics, timestamp: "1" },
  ],
  shared_objects: [{ label: "shared", object: "o", image: "i", geometry: "field", point_type: "meeting", metrics, created_by: "a", timestamp: "1" }],
};

test("Collective Meta Core allows a mutually trusted conductive field", () => {
  const result = collectiveMetaCore(base);
  assert.equal(result.allow, true);
  assert.equal(result.gate, "ok");
  assert.equal(result.links_verified, true);
});

test("Collective Meta Core names the trust gate when a link is absent", () => {
  const result = collectiveMetaCore({ ...base, trust_links: base.trust_links.slice(0, 1) });
  assert.equal(result.allow, false);
  assert.equal(result.gate, "trust");
});

test("Collective Meta Core names the metrics gate when the field is weak", () => {
  const weak = { ...metrics, Q: 0.5 };
  const result = collectiveMetaCore({ ...base, shared_objects: [{ ...base.shared_objects[0], metrics: weak }] });
  assert.equal(result.allow, false);
  assert.equal(result.gate, "metrics");
});

test("Collective Meta Core does not treat one subject as a collective", () => {
  const result = collectiveMetaCore({ ...base, subject_ids: ["a"], trust_links: [] });
  assert.equal(result.allow, false);
  assert.equal(result.gate, "trust");
});
