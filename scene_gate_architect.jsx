import React, { useState } from "react";
import VoidOCR from "./VoidOCR"; // ⊕-OCR как точка допуска

export default function SceneGate() {
  const [triggered, setTriggered] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [sceneAction, setSceneAction] = useState(null);

  function handleSceneClick() {
    setTriggered(true);
    setShowOCR(true);
  }

  function handleOCRResult(decision) {
    setShowOCR(false);
    if (decision === "ALLOW") {
      setSceneAction("⊕ Переход разрешён: активируем эффект");
    } else {
      setSceneAction("⊘ Переход отклонён: возврат к сцене");
    }
  }

  return (
    <div className="scene-gate">
      <div className="scene" onClick={handleSceneClick}>
        <p>Сцена: нажми на элемент, чтобы инициировать ⊕</p>
        <div className="pattern">●</div>
      </div>

      {showOCR && (
        <VoidOCRWrapper onResult={handleOCRResult} />
      )}

      {sceneAction && (
        <div className="action-result">{sceneAction}</div>
      )}

      <style>{`
        .scene-gate {
          font-family: system-ui, sans-serif;
          padding: 20px;
          background: #101010;
          color: #ccc;
          min-height: 100vh;
        }
        .scene {
          border: 2px dashed #444;
          padding: 40px;
          text-align: center;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .pattern {
          font-size: 48px;
          margin-top: 10px;
        }
        .action-result {
          background: #1b1b1b;
          padding: 12px;
          border: 1px solid #333;
        }
      `}</style>
    </div>
  );
}

function VoidOCRWrapper({ onResult }) {
  const [decision, setDecision] = useState(null);

  return (
    <div>
      <VoidOCR />
      {decision && onResult(decision)}
    </div>
  );
}
