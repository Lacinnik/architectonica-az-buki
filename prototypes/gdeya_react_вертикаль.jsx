import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

// GDEYA · React ядро (v1)
// Основано на офлайн-прототипе HTML: 96 карт, 4 плиты, 6 карт на цикл, дневник, экспорт CSV/JSON.
// Визуальный стиль — тёмно‑синий фон и золотая геометрия.

// ======= ДАННЫЕ (перенос из офлайн-прототипа) =======
const CARDS_96 = [
  {"id":"R-01","plate":"РЕСУРС","process":"БАЗОВЫЕ ПОТРЕБНОСТИ","arabic":1,"roman":"I"},{"id":"R-02","plate":"РЕСУРС","process":"БАЗОВЫЕ ПОТРЕБНОСТИ","arabic":1,"roman":"II"},{"id":"R-03","plate":"РЕСУРС","process":"БАЗОВЫЕ ПОТРЕБНОСТИ","arabic":1,"roman":"III"},{"id":"R-04","plate":"РЕСУРС","process":"БАЗОВЫЕ ПОТРЕБНОСТИ","arabic":1,"roman":"IV"},{"id":"R-05","plate":"РЕСУРС","process":"ДОБЫВАТЬ ЗАЩИТУ","arabic":2,"roman":"I"},{"id":"R-06","plate":"РЕСУРС","process":"ДОБЫВАТЬ ЗАЩИТУ","arabic":2,"roman":"II"},{"id":"R-07","plate":"РЕСУРС","process":"ДОБЫВАТЬ ЗАЩИТУ","arabic":2,"roman":"III"},{"id":"R-08","plate":"РЕСУРС","process":"ДОБЫВАТЬ ЗАЩИТУ","arabic":2,"roman":"IV"},{"id":"R-09","plate":"РЕСУРС","process":"ПРОДОЛЖАТЬ РОД","arabic":3,"roman":"I"},{"id":"R-10","plate":"РЕСУРС","process":"ПРОДОЛЖАТЬ РОД","arabic":3,"roman":"II"},{"id":"R-11","plate":"РЕСУРС","process":"ПРОДОЛЖАТЬ РОД","arabic":3,"roman":"III"},{"id":"R-12","plate":"РЕСУРС","process":"ПРОДОЛЖАТЬ РОД","arabic":3,"roman":"IV"},{"id":"R-13","plate":"РЕСУРС","process":"УЛУЧШАТЬ УСЛОВИЯ","arabic":4,"roman":"I"},{"id":"R-14","plate":"РЕСУРС","process":"УЛУЧШАТЬ УСЛОВИЯ","arabic":4,"roman":"II"},{"id":"R-15","plate":"РЕСУРС","process":"УЛУЧШАТЬ УСЛОВИЯ","arabic":4,"roman":"III"},{"id":"R-16","plate":"РЕСУРС","process":"УЛУЧШАТЬ УСЛОВИЯ","arabic":4,"roman":"IV"},{"id":"R-17","plate":"РЕСУРС","process":"РАЗВИВАТЬ ТЕХНИКУ","arabic":5,"roman":"I"},{"id":"R-18","plate":"РЕСУРС","process":"РАЗВИВАТЬ ТЕХНИКУ","arabic":5,"roman":"II"},{"id":"R-19","plate":"РЕСУРС","process":"РАЗВИВАТЬ ТЕХНИКУ","arabic":5,"roman":"III"},{"id":"R-20","plate":"РЕСУРС","process":"РАЗВИВАТЬ ТЕХНИКУ","arabic":5,"roman":"IV"},{"id":"R-21","plate":"РЕСУРС","process":"ДОБИВАТЬСЯ УСПЕХА","arabic":6,"roman":"I"},{"id":"R-22","plate":"РЕСУРС","process":"ДОБИВАТЬСЯ УСПЕХА","arabic":6,"roman":"II"},{"id":"R-23","plate":"РЕСУРС","process":"ДОБИВАТЬСЯ УСПЕХА","arabic":6,"roman":"III"},{"id":"R-24","plate":"РЕСУРС","process":"ДОБИВАТЬСЯ УСПЕХА","arabic":6,"roman":"IV"},
  {"id":"P-01","plate":"ВЛАСТЬ","process":"ОБЕСПЕЧЬ БЕЗОПАСНОСТЬ","arabic":1,"roman":"I"},{"id":"P-02","plate":"ВЛАСТЬ","process":"ОБЕСПЕЧЬ БЕЗОПАСНОСТЬ","arabic":1,"roman":"II"},{"id":"P-03","plate":"ВЛАСТЬ","process":"ОБЕСПЕЧЬ БЕЗОПАСНОСТЬ","arabic":1,"roman":"III"},{"id":"P-04","plate":"ВЛАСТЬ","process":"ОБЕСПЕЧЬ БЕЗОПАСНОСТЬ","arabic":1,"roman":"IV"},{"id":"P-05","plate":"ВЛАСТЬ","process":"СОХРАНИ СЕМЬЮ","arabic":2,"roman":"I"},{"id":"P-06","plate":"ВЛАСТЬ","process":"СОХРАНИ СЕМЬЮ","arabic":2,"roman":"II"},{"id":"P-07","plate":"ВЛАСТЬ","process":"СОХРАНИ СЕМЬЮ","arabic":2,"roman":"III"},{"id":"P-08","plate":"ВЛАСТЬ","process":"СОХРАНИ СЕМЬЮ","arabic":2,"roman":"IV"},{"id":"P-09","plate":"ВЛАСТЬ","process":"ЗАЩИТИ РОД","arabic":3,"roman":"I"},{"id":"P-10","plate":"ВЛАСТЬ","process":"ЗАЩИТИ РОД","arabic":3,"roman":"II"},{"id":"P-11","plate":"ВЛАСТЬ","process":"ЗАЩИТИ РОД","arabic":3,"roman":"III"},{"id":"P-12","plate":"ВЛАСТЬ","process":"ЗАЩИТИ РОД","arabic":3,"roman":"IV"},{"id":"P-13","plate":"ВЛАСТЬ","process":"ВОССТАНОВИ ВНИМАНИЕ","arabic":4,"roman":"I"},{"id":"P-14","plate":"ВЛАСТЬ","process":"ВОССТАНОВИ ВНИМАНИЕ","arabic":4,"roman":"II"},{"id":"P-15","plate":"ВЛАСТЬ","process":"ВОССТАНОВИ ВНИМАНИЕ","arabic":4,"roman":"III"},{"id":"P-16","plate":"ВЛАСТЬ","process":"ВОССТАНОВИ ВНИМАНИЕ","arabic":4,"roman":"IV"},{"id":"P-17","plate":"ВЛАСТЬ","process":"ЦЕНИ РАВЕНСТВО","arabic":5,"roman":"I"},{"id":"P-18","plate":"ВЛАСТЬ","process":"ЦЕНИ РАВЕНСТВО","arabic":5,"roman":"II"},{"id":"P-19","plate":"ВЛАСТЬ","process":"ЦЕНИ РАВЕНСТВО","arabic":5,"roman":"III"},{"id":"P-20","plate":"ВЛАСТЬ","process":"ЦЕНИ РАВЕНСТВО","arabic":5,"roman":"IV"},{"id":"P-21","plate":"ВЛАСТЬ","process":"ОТВЕЧАЙ НА ЧУВСТВА","arabic":6,"roman":"I"},{"id":"P-22","plate":"ВЛАСТЬ","process":"ОТВЕЧАЙ НА ЧУВСТВА","arabic":6,"roman":"II"},{"id":"P-23","plate":"ВЛАСТЬ","process":"ОТВЕЧАЙ НА ЧУВСТВА","arabic":6,"roman":"III"},{"id":"P-24","plate":"ВЛАСТЬ","process":"ОТВЕЧАЙ НА ЧУВСТВА","arabic":6,"roman":"IV"},
  {"id":"C-01","plate":"ОТНОШЕНИЯ","process":"БРОСАТЬ ВЫЗОВ","arabic":1,"roman":"I"},{"id":"C-02","plate":"ОТНОШЕНИЯ","process":"БРОСАТЬ ВЫЗОВ","arabic":1,"roman":"II"},{"id":"C-03","plate":"ОТНОШЕНИЯ","process":"БРОСАТЬ ВЫЗОВ","arabic":1,"roman":"III"},{"id":"C-04","plate":"ОТНОШЕНИЯ","process":"БРОСАТЬ ВЫЗОВ","arabic":1,"roman":"IV"},{"id":"C-05","plate":"ОТНОШЕНИЯ","process":"УТВЕРЖДАТЬ СЕБЯ","arabic":2,"roman":"I"},{"id":"C-06","plate":"ОТНОШЕНИЯ","process":"УТВЕРЖДАТЬ СЕБЯ","arabic":2,"roman":"II"},{"id":"C-07","plate":"ОТНОШЕНИЯ","process":"УТВЕРЖДАТЬ СЕБЯ","arabic":2,"roman":"III"},{"id":"C-08","plate":"ОТНОШЕНИЯ","process":"УТВЕРЖДАТЬ СЕБЯ","arabic":2,"roman":"IV"},{"id":"C-09","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К ДЕЙСТВИЮ","arabic":3,"roman":"I"},{"id":"C-10","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К ДЕЙСТВИЮ","arabic":3,"roman":"II"},{"id":"C-11","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К ДЕЙСТВИЮ","arabic":3,"roman":"III"},{"id":"C-12","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К ДЕЙСТВИЮ","arabic":3,"roman":"IV"},{"id":"C-13","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К РАВНОВЕСИЮ","arabic":4,"roman":"I"},{"id":"C-14","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К РАВНОВЕСИЮ","arabic":4,"roman":"II"},{"id":"C-15","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К РАВНОВЕСИЮ","arabic":4,"roman":"III"},{"id":"C-16","plate":"ОТНОШЕНИЯ","process":"СТРЕМИТЬСЯ К РАВНОВЕСИЮ","arabic":4,"roman":"IV"},{"id":"C-17","plate":"ОТНОШЕНИЯ","process":"СОЗДАВАТЬ СИСТЕМЫ","arabic":5,"roman":"I"},{"id":"C-18","plate":"ОТНОШЕНИЯ","process":"СОЗДАВАТЬ СИСТЕМЫ","arabic":5,"roman":"II"},{"id":"C-19","plate":"ОТНОШЕНИЯ","process":"СОЗДАВАТЬ СИСТЕМЫ","arabic":5,"roman":"III"},{"id":"C-20","plate":"ОТНОШЕНИЯ","process":"СОЗДАВАТЬ СИСТЕМЫ","arabic":5,"roman":"IV"},{"id":"C-21","plate":"ОТНОШЕНИЯ","process":"ЦЕНИТЬ ЕСТЕСТВЕННОСТЬ","arabic":6,"roman":"I"},{"id":"C-22","plate":"ОТНОШЕНИЯ","process":"ЦЕНИТЬ ЕСТЕСТВЕННОСТЬ","arabic":6,"roman":"II"},{"id":"C-23","plate":"ОТНОШЕНИЯ","process":"ЦЕНИТЬ ЕСТЕСТВЕННОСТЬ","arabic":6,"roman":"III"},{"id":"C-24","plate":"ОТНОШЕНИЯ","process":"ЦЕНИТЬ ЕСТЕСТВЕННОСТЬ","arabic":6,"roman":"IV"},
  {"id":"O-01","plate":"РЕЗУЛЬТАТ","process":"АДАПТИРОВАТЬСЯ К ВЕРОВАНИЯМ","arabic":1,"roman":"I"},{"id":"O-02","plate":"РЕЗУЛЬТАТ","process":"АДАПТИРОВАТЬСЯ К ВЕРОВАНИЯМ","arabic":1,"roman":"II"},{"id":"O-03","plate":"РЕЗУЛЬТАТ","process":"АДАПТИРОВАТЬСЯ К ВЕРОВАНИЯМ","arabic":1,"roman":"III"},{"id":"O-04","plate":"РЕЗУЛЬТАТ","process":"АДАПТИРОВАТЬСЯ К ВЕРОВАНИЯМ","arabic":1,"roman":"IV"},{"id":"O-05","plate":"РЕЗУЛЬТАТ","process":"ЖЕРТВОВАТЬ ИНТЕРЕСАМИ","arabic":2,"roman":"I"},{"id":"O-06","plate":"РЕЗУЛЬТАТ","process":"ЖЕРТВОВАТЬ ИНТЕРЕСАМИ","arabic":2,"roman":"II"},{"id":"O-07","plate":"РЕЗУЛЬТАТ","process":"ЖЕРТВОВАТЬ ИНТЕРЕСАМИ","arabic":2,"roman":"III"},{"id":"O-08","plate":"РЕЗУЛЬТАТ","process":"ЖЕРТВОВАТЬ ИНТЕРЕСАМИ","arabic":2,"roman":"IV"},{"id":"O-09","plate":"РЕЗУЛЬТАТ","process":"СОБЛЮДАТЬ ДИСЦИПЛИНУ","arabic":3,"roman":"I"},{"id":"O-10","plate":"РЕЗУЛЬТАТ","process":"СОБЛЮДАТЬ ДИСЦИПЛИНУ","arabic":3,"roman":"II"},{"id":"O-11","plate":"РЕЗУЛЬТАТ","process":"СОБЛЮДАТЬ ДИСЦИПЛИНУ","arabic":3,"roman":"III"},{"id":"O-12","plate":"РЕЗУЛЬТАТ","process":"СОБЛЮДАТЬ ДИСЦИПЛИНУ","arabic":3,"roman":"IV"},{"id":"O-13","plate":"РЕЗУЛЬТАТ","process":"БЫТЬ В МОДЕЛИ ЦЕЛОГО","arabic":4,"roman":"I"},{"id":"O-14","plate":"РЕЗУЛЬТАТ","process":"БЫТЬ В МОДЕЛИ ЦЕЛОГО","arabic":4,"roman":"II"},{"id":"O-15","plate":"РЕЗУЛЬТАТ","process":"БЫТЬ В МОДЕЛИ ЦЕЛОГО","arabic":4,"roman":"III"},{"id":"O-16","plate":"РЕЗУЛЬТАТ","process":"БЫТЬ В МОДЕЛИ ЦЕЛОГО","arabic":4,"roman":"IV"},{"id":"O-17","plate":"РЕЗУЛЬТАТ","process":"СОЕДИНЯТЬ ТОЧКИ","arabic":5,"roman":"I"},{"id":"O-18","plate":"РЕЗУЛЬТАТ","process":"СОЕДИНЯТЬ ТОЧКИ","arabic":5,"roman":"II"},{"id":"O-19","plate":"РЕЗУЛЬТАТ","process":"СОЕДИНЯТЬ ТОЧКИ","arabic":5,"roman":"III"},{"id":"O-20","plate":"РЕЗУЛЬТАТ","process":"СОЕДИНЯТЬ ТОЧКИ","arabic":5,"roman":"IV"},{"id":"O-21","plate":"РЕЗУЛЬТАТ","process":"ВОССТАНАВЛИВАТЬ ДУХОВНОСТЬ","arabic":6,"roman":"I"},{"id":"O-22","plate":"РЕЗУЛЬТАТ","process":"ВОССТАНАВЛИВАТЬ ДУХОВНОСТЬ","arabic":6,"roman":"II"},{"id":"O-23","plate":"РЕЗУЛЬТАТ","process":"ВОССТАНАВЛИВАТЬ ДУХОВНОСТЬ","arabic":6,"roman":"III"},{"id":"O-24","plate":"РЕЗУЛЬТАТ","process":"ВОССТАНАВЛИВАТЬ ДУХОВНОСТЬ","arabic":6,"roman":"IV"}
];

const AZ = [
  { id: "A1", title: "Азъ (А)" }, { id: "A2", title: "Буки (Б)" }, { id: "A3", title: "Веди (В)" }, { id: "A4", title: "Глаголь (Г)" },
  { id: "A5", title: "Добро (Д)" }, { id: "A6", title: "Есть (Е)" }, { id: "A7", title: "Живѣтє (Ж)" }, { id: "A8", title: "Зело (З)" },
  { id: "A9", title: "Земля (Ѕ)" }, { id: "A10", title: "Иже (И)" }, { id: "A11", title: "И (І)" }, { id: "A12", title: "Како (К)" },
  { id: "A13", title: "Люди (Л)" }, { id: "A14", title: "Мыслете (М)" }, { id: "A15", title: "Наш (Н)" }, { id: "A16", title: "Он (О)" },
  { id: "A17", title: "Покой (П)" }, { id: "A18", title: "Рцы (Р)" }, { id: "A19", title: "Слово (С)" }, { id: "A20", title: "Твердо (Т)" }
];

const BUKI = [
  { id: "B1", symbol: "⊕", title: "Суперпозиция" }, { id: "B2", symbol: "∅", title: "Пустота" }, { id: "B3", symbol: "τ", title: "Пластичность времени" },
  { id: "B4", symbol: "Ψ", title: "Волновая форма" }, { id: "B5", symbol: "C^{⊕}", title: "⊕‑Капитал" }, { id: "B6", symbol: "Σ", title: "Сумма резонансов" },
  { id: "B7", symbol: "φ", title: "Фаза пробуждения" }, { id: "B8", symbol: "R_f", title: "Резонанс с будущим" }, { id: "B9", symbol: "∇", title: "Градиент" },
  { id: "B10", symbol: "I_{Я}", title: "Интеграция ядра" }, { id: "B11", symbol: "⊗", title: "Точка кристаллизации" }, { id: "B12", symbol: "F_s", title: "Поток смысла" },
  { id: "B13", symbol: "λ", title: "Длина волны" }, { id: "B14", symbol: "A", title: "Амплитуда переживания" }, { id: "B15", symbol: "∆S", title: "Изменение смысла" },
  { id: "B16", symbol: "Q", title: "Качество отклика" }, { id: "B17", symbol: "T", title: "Текучесть" }, { id: "B18", symbol: "S_f", title: "Структурная форма" },
  { id: "B19", symbol: "C_m", title: "Контейнер смыслов" }, { id: "B20", symbol: "E^{⊕}", title: "Энтропическая энергия" }, { id: "B21", symbol: "α", title: "Коэффициент соответствия" },
  { id: "B22", symbol: "k", title: "Плотность восприятия" }, { id: "B23", symbol: "ω", title: "Частота обновления" }, { id: "B24", symbol: "⊕(Σ)", title: "Суперпозиция систем" }
];

const TX = [
  { id: "TX1", title: "Ядро" }, { id: "TX2", title: "Орбита" }, { id: "TX3", title: "Резонанс" }, { id: "TX4", title: "Мост" },
  { id: "TX5", title: "Материализация" }, { id: "TX6", title: "Интеграция" }, { id: "TX7", title: "Перезапуск" }
];

const GEOM = [
  { id: 'Euclid', label: 'Евклид' }, { id: 'Lobachevsky', label: 'Лобачевский' }, { id: 'Riemann', label: 'Риман' }, { id: 'Projective', label: 'Проектив' }, { id: 'Supra', label: 'Сверх' }
];

const PT = [
  { id: "Разрыв", hint: "Сшить порог" }, { id: "Залипание", hint: "Дать движение" }, { id: "Вход", hint: "Принять сигнал" }, { id: "Интеграция", hint: "Встроить и закрыть" }
];

const PT2TX = { "Разрыв": ["TX1","TX7"], "Залипание": ["TX2","TX3"], "Вход": ["TX3","TX4"], "Интеграция": ["TX6","TX5"] };

// ======= УТИЛИТЫ =======
const shuffle = (a) => { const r = a.slice(); for (let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; };
const fmtTS = () => new Date().toLocaleString();
const toCSV = (rows) => {
  if (!rows.length) return "";
  const head = Object.keys(rows[0]);
  const esc = (v) => { const s = String(v ?? ""); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s; };
  const lines = [head.join(",")];
  for (const r of rows) lines.push(head.map(k => esc(r[k])).join(","));
  return lines.join("\n");
};

// ======= КОМПОНЕНТЫ БАЗОВОГО UI =======
function Chip({ children }){
  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded-md border border-yellow-300/30 bg-yellow-300/10 mr-1 mb-1">
      {children}
    </span>
  );
}

function Pane({ className = "", children }){
  return (
    <div className={"rounded-2xl p-4 border border-yellow-200/20 bg-black/20 " + className}>{children}</div>
  );
}

// ======= РЕЗОНАНСНЫЙ ОТЧЁТ (новый компонент) =======
function aggregateResonance(items) {
  const total = items.length;
  const byPlate = {};
  const byProcess = {};

  for (const d of items) {
    const plate = d.plate || "—";
    byPlate[plate] = (byPlate[plate] || 0) + 1;

    const proc = d.card?.process || "—";
    byProcess[proc] = (byProcess[proc] || 0) + 1;
  }

  return { total, byPlate, byProcess };
}

// Простые тест-кейсы для aggregateResonance (исполняются только в test-окружении)
function runAggregateResonanceTests() {
  const sample = [
    { plate: "РЕСУРС", card: { process: "X" } },
    { plate: "РЕСУРС", card: { process: "Y" } },
    { plate: "РЕЗУЛЬТАТ", card: { process: "X" } },
  ];
  const agg = aggregateResonance(sample);
  console.assert(agg.total === 3, "total должен быть 3");
  console.assert(agg.byPlate["РЕСУРС"] === 2, "РЕСУРС должен быть 2");
  console.assert(agg.byProcess["X"] === 2, "process X должен быть 2");
}

if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test") {
  runAggregateResonanceTests();
}

function ResonanceReport({ items }) {
  if (!items || items.length === 0) {
    return <div className="text-xs text-yellow-200/70">Пока нет данных для резонансного отчёта.</div>;
  }

  const { total, byPlate, byProcess } = aggregateResonance(items);

  const plateOrder = ["РЕСУРС", "ВЛАСТЬ", "ОТНОШЕНИЯ", "РЕЗУЛЬТАТ"];
  const plateEntries = Object.entries(byPlate).sort((a, b) => {
    const ai = plateOrder.indexOf(a[0]);
    const bi = plateOrder.indexOf(b[0]);
    if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const processEntries = Object.entries(byProcess)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="text-xs text-yellow-100/85 space-y-2">
      <div>
        <span className="text-yellow-200/80">Всего записей:</span> {total}
      </div>
      <div>
        <div className="text-yellow-200/80 mb-1">По плитам</div>
        <div className="flex flex-wrap gap-2">
          {plateEntries.map(([plate, count]) => (
            <span
              key={plate}
              className="inline-flex items-center gap-1 rounded-full border border-yellow-300/30 px-2 py-0.5"
            >
              <span className="text-[10px] uppercase tracking-wide text-yellow-200/80">{plate}</span>
              <span className="text-[11px] bg-yellow-300 text-black rounded-full px-1.5 py-0.5 min-w-[1.5rem] text-center">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="text-yellow-200/80 mb-1">Топ процессов</div>
        {processEntries.length === 0 ? (
          <div className="text-yellow-200/70">Недостаточно данных.</div>
        ) : (
          <ul className="list-disc list-inside space-y-0.5">
            {processEntries.map(([proc, count]) => (
              <li key={proc}>
                <span className="text-yellow-100/90">{proc}</span>
                <span className="text-yellow-200/70"> · {count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ======= ОСНОВНОЕ ЯДРО ЦИКЛА КАРТ =======
export function GDEYAReactCore(){
  // Цикл и карточки
  const SEQ = ["РЕСУРС","ВЛАСТЬ","ОТНОШЕНИЯ","РЕЗУЛЬТАТ"];
  const [plateIdx, setPlateIdx] = useState(0);
  const [drawn, setDrawn] = useState([]);
  const [cardIdx, setCardIdx] = useState(0);

  // Формула материализации
  const [chosenAz, setChosenAz] = useState(null);
  const [chosenBuka, setChosenBuka] = useState(null);
  const [chosenTx, setChosenTx] = useState(null);
  const [chosenGeom, setChosenGeom] = useState(GEOM[0].id);
  const [chosenPt, setChosenPt] = useState(PT[0].id);

  // Состояния, сингулярная точка и метрики
  const [statesRaw, setStatesRaw] = useState("");
  const states = useMemo(() => statesRaw.split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean), [statesRaw]);
  const [obj, setObj] = useState("");
  const [img, setImg] = useState("");
  const superpos = useMemo(() => (obj?.trim() || img?.trim()) ? `${obj?.trim()||"…"} ⊕ ${img?.trim()||"…"}` : "", [obj,img]);
  const [metrics, setMetrics] = useState({ alpha:"", IY:"", Cm:"", Q:"", T:"" });

  // Дневник
  const [diary, setDiary] = useState([]);

  // Инициализация плиты
  useEffect(()=>{ startPlate(0); /* первый запуск */ }, []);

  function startPlate(idx){
    const plate = SEQ[idx];
    const batch = shuffle(CARDS_96.filter(c=>c.plate===plate)).slice(0,6);
    setPlateIdx(idx);
    setDrawn(batch);
    setCardIdx(0);
    resetEntry(false);
  }

  function resetEntry(clearForm=true){
    if (clearForm){
      setChosenAz(null); setChosenBuka(null); setChosenTx(null);
      setStatesRaw(""); setObj(""); setImg(""); setMetrics({ alpha:"", IY:"", Cm:"", Q:"", T:"" });
      setChosenGeom(GEOM[0].id); setChosenPt(PT[0].id);
    }
  }

  const current = drawn[cardIdx];
  const needN = current?.arabic ?? 0;
  const canSave = !!(current && chosenAz && chosenBuka && chosenTx && states.length === needN);

  function choosePt(id){
    setChosenPt(id);
    const rec = (PT2TX[id]||[])[0];
    if (rec){ const tx = TX.find(t=>t.id===rec); setChosenTx(tx); }
  }

  function saveEntry(){
    if (!canSave) return;
    const item = {
      ts: fmtTS(), plate: SEQ[plateIdx], card: current, states: states.slice(0, needN),
      az: chosenAz, buka: chosenBuka, tx: chosenTx,
      superposition: superpos, geometry: chosenGeom, pointType: chosenPt,
      metrics: { ...metrics }
    };
    setDiary(prev => [item, ...prev]);
    nextStep();
  }

  function nextStep(){
    if (cardIdx < 5){ setCardIdx(cardIdx+1); resetEntry(); return; }
    if (plateIdx < SEQ.length-1){ startPlate(plateIdx+1); return; }
    alert("Цикл завершён. Открой резонансный отчёт ниже.");
  }

  function exportCSV(){
    const rows = diary.map(d=>({
      ts:d.ts, plate:d.plate, card_id:d.card.id, process:d.card.process, roman:d.card.roman, arabic:d.card.arabic,
      az:d.az?.title||"", buka: d.buka ? `${d.buka.symbol} ${d.buka.title}` : "", tx:d.tx?.title||"",
      superposition:d.superposition||"", geometry:d.geometry||"", pointType:d.pointType||"",
      metrics: JSON.stringify(d.metrics||{}), states:(d.states||[]).join(" | ")
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `gdeya_diary_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify(diary,null,2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `gdeya_diary_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  // ======= UI =======
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-yellow-50">
      <style>{`
        .gold{color:#facc15}
        .btn{border-radius:10px;border:1px solid rgba(250,204,21,.35);padding:6px 10px}
        .btn:hover{background:rgba(250,204,21,.1)}
        input,textarea{background:rgba(0,0,0,.3);border:1px solid rgba(250,204,21,.2);color:#fff;border-radius:12px;padding:8px}
        ::placeholder{color:rgba(250,204,21,.4)}
      `}</style>

      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a0f1c]/70 border-b border-yellow-200/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,.8)]" />
            <div className="font-semibold tracking-wide">ГДЕЯ · React ядро</div>
          </div>
          <div className="text-xs text-yellow-200/70">Цикл: 4 плиты × 6 карт</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Pane className="mb-4">
          <div className="text-xl gold font-semibold">Плита: <span>{SEQ[plateIdx]}</span></div>
          <div className="text-sm text-yellow-200/70 mt-1">Карта: <span>{(cardIdx+1)}</span> / 6</div>
        </Pane>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Карта */}
          <Pane>
            <div className="text-xs text-yellow-200/70">КАРТА</div>
            <div className="mt-1 text-2xl font-semibold gold">{current? current.process : '—'}</div>
            <div className="mt-2 text-yellow-100/85">
              Римская: <span className="font-medium">{current?.roman||'—'}</span>
              <span className="opacity-60"> · </span>
              Арабская: <span className="font-medium">{current?.arabic||0}</span>
            </div>

            <div className="mt-4">
              <div className="text-xs text-yellow-200/70 mb-1">Состояния — назови ровно <span>{needN}</span></div>
              <textarea rows={3} value={statesRaw} onChange={(e)=>setStatesRaw(e.target.value)} placeholder="впиши состояния через запятую или с новой строки" />
              <div className="mt-1 text-xs text-yellow-200/70">Сейчас: <span>{states.length}</span>/<span>{needN}</span></div>
            </div>

            <div className="mt-3 flex gap-2 items-center">
              <button className={`btn ${canSave? 'bg-yellow-300 text-black font-medium' : 'opacity-40'}`} disabled={!canSave} onClick={saveEntry}>Сохранить запись и перейти</button>
              <div className="text-xs text-yellow-200/60">Требуется: Аз + Бука + Передача и N состояний</div>
            </div>
          </Pane>

          {/* Формула материализации */}
          <Pane>
            <div className="text-sm text-yellow-200/85 font-medium mb-3">Формула материализации</div>

            {/* Аз */}
            <div>
              <div className="text-xs text-yellow-200/70 mb-1">Аз (внутренняя частота)</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button className="btn" onClick={()=>setChosenAz(AZ[Math.floor(Math.random()*AZ.length)])}>Случайный Аз</button>
                <div className="text-xs text-yellow-100/90">{chosenAz? `Выбрано: ${chosenAz.title}` : ''}</div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-auto pr-1">
                {AZ.map(a=> (
                  <button key={a.id} className="btn text-xs text-left" onClick={()=>setChosenAz(a)}>{a.title}</button>
                ))}
              </div>
            </div>

            {/* Бука */}
            <div className="mt-4">
              <div className="text-xs text-yellow-200/70 mb-1">Бука (внешняя форма)</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <button className="btn" onClick={()=>setChosenBuka(BUKI[Math.floor(Math.random()*BUKI.length)])}>Случайная Бука</button>
                <div className="text-xs text-yellow-100/90">{chosenBuka? `Выбрано: ${chosenBuka.symbol} ${chosenBuka.title}` : ''}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-1">
                {BUKI.map(b=> (
                  <button key={b.id} className="btn text-xs text-left" onClick={()=>setChosenBuka(b)}>{b.symbol} {b.title}</button>
                ))}
              </div>
            </div>

            {/* Передачи и тип точки */}
            <div className="mt-4">
              <div className="text-xs text-yellow-200/70 mb-1">Передача (фаза ⊕‑движения)</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {TX.map(t => (
                  <button key={t.id} onClick={()=>setChosenTx(t)} className={`btn text-xs ${chosenTx?.id===t.id? 'bg-yellow-300 text-black' : ''}`}>{t.title}</button>
                ))}
              </div>
              <div className="text-[11px] text-yellow-200/60 mb-1">Тип точки</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {PT.map(p => (
                  <button key={p.id} title={p.hint} onClick={()=>choosePt(p.id)} className={`btn text-xs ${chosenPt===p.id? 'bg-yellow-300/20' : ''}`}>{p.id}</button>
                ))}
              </div>
            </div>

            {/* Сингулярная точка */}
            <Pane className="mt-4">
              <div className="text-xs text-yellow-200/70 mb-2">⊕ Сингулярная точка</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input value={obj} onChange={(e)=>setObj(e.target.value)} placeholder="Объект" />
                <input value={img} onChange={(e)=>setImg(e.target.value)} placeholder="Образ" />
              </div>
              {superpos && <div className="text-xs text-yellow-100/85 mb-2">⊕ {superpos}</div>}
              <div className="flex flex-wrap gap-2 mb-2">
                {GEOM.map(g => (
                  <button key={g.id} onClick={()=>setChosenGeom(g.id)} className={`btn text-xs ${chosenGeom===g.id? 'bg-yellow-300/20' : ''}`}>{g.label}</button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <input value={metrics.alpha} onChange={(e)=>setMetrics(v=>({...v, alpha:e.target.value}))} placeholder="α" />
                <input value={metrics.IY} onChange={(e)=>setMetrics(v=>({...v, IY:e.target.value}))} placeholder="I_{Я}" />
                <input value={metrics.Cm} onChange={(e)=>setMetrics(v=>({...v, Cm:e.target.value}))} placeholder="C_m" />
                <input value={metrics.Q} onChange={(e)=>setMetrics(v=>({...v, Q:e.target.value}))} placeholder="Q" />
                <input value={metrics.T} onChange={(e)=>setMetrics(v=>({...v, T:e.target.value}))} placeholder="T" />
              </div>
            </Pane>
          </Pane>
        </div>

        {/* ДНЕВНИК */}
        <Pane className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-yellow-200/85 font-medium">Дневник <span className="opacity-70">({diary.length})</span></div>
            <div className="flex gap-2">
              <button className="btn text-xs" onClick={exportCSV}>Экспорт CSV</button>
              <button className="btn text-xs" onClick={exportJSON}>Экспорт JSON</button>
            </div>
          </div>

          {/* Резонансный отчёт */}
          <Pane className="mt-4">
            <div className="text-sm text-yellow-200/85 font-medium mb-2">Резонансный отчёт</div>
            <ResonanceReport items={diary} />
          </Pane>

          <div className="mt-4 grid md:grid-cols-2 gap-3">
            {diary.length===0 ? (
              <div className="text-sm text-yellow-200/70">Записей пока нет.</div>
            ) : diary.map((d, idx) => (
              <Pane key={idx}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-yellow-200/60">{d.ts}</div>
                  <div className="text-[11px] text-yellow-200/70">{d.plate}</div>
                </div>
                <div className="mt-1 text-sm">
                  <span className="text-yellow-200/80">Карта: </span>
                  <span className="text-yellow-100/90">{d.card.process}</span>
                  <span className="text-yellow-200/60"> · </span>
                  <span className="text-yellow-200/80">I–IV:</span> {d.card.roman}
                  <span className="text-yellow-200/60"> · </span>
                  <span className="text-yellow-200/80">N:</span> {d.card.arabic}
                </div>
                <div className="mt-1 text-xs text-yellow-100/80">
                  <span className="text-yellow-200/80">Формула:</span> {d.az?.title} × {d.buka ? `${d.buka.symbol} ${d.buka.title}` : ''} → {d.tx?.title}
                </div>
                {d.superposition && (
                  <div className="mt-1 text-xs text-yellow-200/70">⊕ {d.superposition} • {d.geometry} • {d.pointType}</div>
                )}
                <div className="mt-1 text-xs text-yellow-100/80">
                  {(d.states||[]).map((s,i)=> <Chip key={i}>{s}</Chip>)}
                </div>
              </Pane>
            ))}
          </div>
        </Pane>
      </main>

      <footer className="py-8 text-center text-xs text-yellow-200/50">© {new Date().getFullYear()} Архитектоника психики · GDEYA ⊗ React ядро</footer>
    </div>
  );
}

// =====================
// ПРОСТЫЕ ЗАГЛУШКИ ПАНЕЛЕЙ ДЛЯ ТАБОВ (чтобы не было ReferenceError)
// =====================
function AzBukiPanel() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Панель «Аз × Буки» пока подключена как заглушка. Логика может быть доинтегрирована из отдельного модуля.
    </div>
  );
}

function TacticsPanel() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Тактический модуль (7 micro-шагов) пока подключён как заглушка.
    </div>
  );
}

function SourcePhaseDiagnostics() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Диагностика фаз Источника I₁–I₁₂ пока представлена заглушкой.
    </div>
  );
}

function MetricsPanel() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Модуль метрик цикла τ / λ пока в виде заглушки.
    </div>
  );
}

function CreatorCorePanel() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Ядро Творца подключено как заглушка. Подробная логика может быть перенесена из отдельного файла.
    </div>
  );
}

function EmptyAlgebraInfoPanel() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-yellow-100/85">
      Справочный модуль «Пустотная алгебра» M⁷–M¹² пока представлен заглушкой.
    </div>
  );
}

// =====================
// Позиции P1–P4 и их маппинг к ролям / инструкциям
// =====================
const POSITION_OPTIONS = [
  {
    id: 'P1',
    label: 'P1 · Наблюдатель',
    description: 'Смотрю на поле, без давления на решение.'
  },
  {
    id: 'P2',
    label: 'P2 · Оператор',
    description: 'Работаю с задачей и действием, нужен конкретный шаг.'
  },
  {
    id: 'P3',
    label: 'P3 · Архитектор',
    description: 'Собираю структуру, связи, принципы системы.'
  },
  {
    id: 'P4',
    label: 'P4 · Источник',
    description: 'Двигаю рамку, парадигму, уровень игры.'
  }
];

const PositionToRole = {
  P1: 'Interpreter',
  P2: 'Operator',
  P3: 'Architect',
  P4: 'Navigator'
};

const InstructionsByPosition = {
  P1: 'Сохраняй режим наблюдателя. Анализируй поле, не дави на решения.',
  P2: 'Сформулируй конкретные действия и шаги. Кратко и операционально.',
  P3: 'Определи структуру, связи и принципы. Минимум воды.',
  P4: 'Работай на уровне рамки и парадигмы. Обозначай направления и новые формулировки.'
};

// =====================
// Обёртка с табами: Цикл карт | Аз×Буки | Тактика | Источник | Метрики | Творец | M⁷–M¹²
// =====================
export default function GDEYAAppTabs(){
  const [tab, setTab] = useState('core');
  const [position, setPosition] = useState('P1');

  const tabs = [
    { id: 'core', label: 'Цикл карт' },
    { id: 'azbuki', label: 'Аз × Буки' },
    { id: 'tactics', label: 'Тактика' },
    { id: 'source', label: 'Источник I₁–I₁₂' },
    { id: 'metrics', label: 'Метрики' },
    { id: 'creator', label: 'Творец' },
    { id: 'empty', label: 'M⁷–M¹²' },
  ];

  const activePosition = POSITION_OPTIONS.find(p => p.id === position) ?? POSITION_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-yellow-50">
      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a0f1c]/80 border-b border-yellow-200/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,.8)]" />
              <div className="font-semibold tracking-wide text-sm md:text-base">ГДЕЯ · ядро субъекта</div>
            </div>
            <nav className="flex flex-wrap gap-1.5 text-[11px] md:text-xs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={clsx(
                    'px-2.5 py-1.5 rounded-lg border',
                    tab === t.id
                      ? 'bg-yellow-300 text-black border-yellow-300'
                      : 'border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[11px] md:text-[11px]">
            <div className="flex flex-col gap-0.5 max-w-md">
              <div className="text-yellow-200/70 uppercase tracking-[0.18em]">Позиция субъекта</div>
              <div className="text-yellow-100/80">
                {activePosition.label}: {activePosition.description}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POSITION_OPTIONS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosition(p.id)}
                  className={clsx(
                    'px-2.5 py-1.5 rounded-lg border text-[11px]',
                    position === p.id
                      ? 'bg-yellow-300 text-black border-yellow-300 shadow'
                      : 'border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10'
                  )}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      {tab === 'core' && <GDEYAReactCore />}
      {tab === 'azbuki' && <AzBukiPanel />}
      {tab === 'tactics' && <TacticsPanel />}
      {tab === 'source' && <SourcePhaseDiagnostics />}
      {tab === 'metrics' && <MetricsPanel />}
      {tab === 'creator' && <CreatorCorePanel />}
      {tab === 'empty' && <EmptyAlgebraInfoPanel />}
    </div>
  );
}
