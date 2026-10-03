import React, { useState } from "react";

/* =========================================================
   VOID OCR — v0
   Целостный компонент: логика + UX + хранение
   Назначение: протокол допуска из Пустоты
   ========================================================= */

const PRE_BEFORE = [
  "рассеянность",
  "напряжение",
  "неопределённость",
  "перегруз",
  "остановка",
  "фоновый шум",
];

const PRE_AFTER = [
  "ясность",
  "тишина",
  "устойчивость",
  "собранность",
  "направленность",
  "простота",
];

const DELTAS = [
  { id: "density_shift", label: "Плотность", quadrant: "resource" },
  { id: "impulse_break", label: "Прерывание", quadrant: "power" },
  { id: "distance_collapse", label: "Схлопывание", quadrant: "relations" },
  { id: "auto_form", label: "Самоформа", quadrant: "result" },
];

const STORAGE_KEY = "void_ocr_traces";

export default function VoidOCR() {
  const [trigger, setTrigger] = useState("");
  const [paused, setPaused] = useState(false);
  const [pauseLock, setPauseLock] = useState(false);

  const [pre, setPre] = useState(null);
  const [post, setPost] = useState(null);
  const [delta, setDelta] = useState(null);
  const [stability, setStability] = useState(1);

  const [decision, setDecision] = useState(null);

  function startPause() {
    setPaused(true);
    setPauseLock(true);
    setTimeout(() => setPauseLock(false), 4000);
  }

  function canCommit() {
    return (
      trigger.trim().split(/\s+/).length >= 3 &&
      pre &&
      post &&
      delta &&
      stability !== null
    );
  }

  function commitTrace() {
    const trace = {
      ts: Date.now(),
      trigger: trigger.trim(),
      pre_state: pre,
      post_state: post,
      delta_type: delta.id,
      quadrant: delta.quadrant,
      stability,
    };

    const traces =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([trace, ...traces])
    );

    setDecision(stability >= 2 ? "ALLOW" : "DENY");
  }

  function resetCycle() {
    setTrigger("");
    setPaused(false);
    setPauseLock(false);
    setPre(null);
    setPost(null);
    setDelta(null);
    setStability(1);
    setDecision(null);
  }

  if (decision) {
    return (
      <div className="void-root">
        <Style />
        <div className="panel">
          <div className="result-text">
            {decision === "ALLOW"
              ? "Допуск получен."
              : "Действие не допускается."}
          </div>
          <button className="action" onClick={resetCycle}>
            {decision === "ALLOW"
              ? "Перейти к шагу"
              : "Вернуться в Пустоту"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="void-root">
      <Style />
      {pauseLock && <div className="pause-overlay" />}
      <div className="panel">
        <input
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="Что стало ⊕ ?"
        />

        {!paused && (
          <button onClick={startPause}>Пауза</button>
        )}

        {paused && !pauseLock && (
          <>
            <Section title="До">
              {PRE_BEFORE.map((p) => (
                <Choice
                  key={p}
                  selected={pre === p}
                  onClick={() => setPre(p)}
                >
                  {p}
                </Choice>
              ))}
            </Section>

            <Section title="После">
              {PRE_AFTER.map((p) => (
                <Choice
                  key={p}
                  selected={post === p}
                  onClick={() => setPost(p)}
                >
                  {p}
                </Choice>
              ))}
            </Section>

            <Section title="Δ">
              {DELTAS.map((d) => (
                <Choice
                  key={d.id}
                  selected={delta?.id === d.id}
                  onClick={() => setDelta(d)}
                >
                  {d.label}
                </Choice>
              ))}
            </Section>

            <Section title="Устойчивость">
              {[0, 1, 2, 3].map((v) => (
                <Choice
                  key={v}
                  selected={stability === v}
                  onClick={() => setStability(v)}
                >
                  {v}
                </Choice>
              ))}
            </Section>

            <button
              className="action"
              disabled={!canCommit()}
              onClick={commitTrace}
            >
              Сохранить след
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      {children}
    </div>
  );
}

function Choice({ selected, onClick, children }) {
  return (
    <button
      className={selected ? "choice selected" : "choice"}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Style() {
  return (
    <style>{`
      .void-root {
        background: #0e0e0e;
        color: #b8b8b8;
        min-height: 100vh;
        padding: 24px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
      }

      .panel {
        background: #141414;
        border: 1px solid #2a2a2a;
        padding: 16px;
        max-width: 420px;
      }

      input {
        width: 100%;
        background: #1b1b1b;
        border: 1px solid #2a2a2a;
        color: #b8b8b8;
        padding: 8px;
        margin-bottom: 12px;
      }

      button {
        display: block;
        width: 100%;
        background: #1b1b1b;
        border: 1px solid #2a2a2a;
        color: #8a8a8a;
        padding: 6px;
        margin-top: 6px;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .action {
        opacity: 0.7;
      }

      .section {
        margin-top: 12px;
      }

      .section-title {
        font-size: 12px;
        color: #8a8a8a;
        margin-bottom: 4px;
      }

      .choice.selected {
        background: #141414;
        color: #b8b8b8;
      }

      .pause-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10,10,10,0.9);
        z-index: 999;
      }

      .result-text {
        margin-bottom: 12px;
      }
    `}</style>
  );
}
