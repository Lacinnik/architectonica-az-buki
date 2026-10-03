import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// ======= КОМПОНЕНТЫ =======
function Chip({ children }){ return <span className="inline-block text-xs px-2 py-0.5 rounded-md border border-yellow-300/30 bg-yellow-300/10 mr-1 mb-1">{children}</span>; }

function Pane({ className="", children }){ return (
  <div className={"rounded-2xl p-4 border border-yellow-200/20 bg-black/20 "+className}>{children}</div>
); }

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
// МОДУЛЬ «Аз × Буки» — продвинутая панель (интеграция)
// =====================

// Хелперы и утилиты (локальные для панели)
const todayKeyX = () => new Date().toISOString().slice(0, 10);
const tsX = () => new Date().toLocaleString();
const clsX = (...a) => a.filter(Boolean).join(" ");
const uuidX = () => (globalThis.crypto?.randomUUID?.() ?? ("id-" + Math.random().toString(36).slice(2)));
const randomPickX = (list) => (Array.isArray(list) && list.length ? list[Math.floor(Math.random() * list.length)] : null);

// Расширенные данные Аз/Буки/Передач для панели (без конфликтов имён)
const AZX = [
  { id: "A1", title: "Азъ (А)", short: "Присутствие × Пустота = Я. Центр и начало сборки формы." },
  { id: "A2", title: "Буки (Б)", short: "Масса внимания. Бытийность. Основание реальности." },
  { id: "A3", title: "Веди (В)", short: "Видение и вектор внимания. Мост восприятия и смысла." },
  { id: "A4", title: "Глаголь (Г)", short: "Проявление. Речь как форма творения. Смысл × Воля." },
  { id: "A5", title: "Добро (Д)", short: "Выбор + Целостность = Созидание. Этический вектор." },
  { id: "A6", title: "Есть (Е)", short: "Наблюдение = Материализация. Удержание проявленного." },
  { id: "A7", title: "Живѣтє (Ж)", short: "Жизнь-циркуляция. Связь и протекание энергии." },
  { id: "A8", title: "Зело (З)", short: "Интенсивность ⊕. Концентрация энергии." },
  { id: "A9", title: "Земля (Ѕ)", short: "Материальность. Заземление. Приём массы." },
  { id: "A10", title: "Иже (И)", short: "Коммуникация. Архитектура взаимодействий." },
  { id: "A11", title: "И (І)", short: "Вход. Принятие. Пустота + Доверие = Приём." },
  { id: "A12", title: "Како (К)", short: "Качество. Структура. Уточнение формы." },
  { id: "A13", title: "Люди (Л)", short: "Встреча Я ↔ Ты. Создание межполевого пространства." },
  { id: "A14", title: "Мыслете (М)", short: "Мышление. Сбор и навигация смыслов." },
  { id: "A15", title: "Наш (Н)", short: "Принадлежность. Интеграция в систему." },
  { id: "A16", title: "Он (О)", short: "Перспектива. Различение. Другой как отражение." },
  { id: "A17", title: "Покой (П)", short: "Центрирование. Я = 0. Сброс лишнего." },
  { id: "A18", title: "Рцы (Р)", short: "Манифестация. Прямая вибрация смысла." },
  { id: "A19", title: "Слово (С)", short: "Мост: внутреннее → наружное. Связь миров." },
  { id: "A20", title: "Твердо (Т)", short: "Фиксация. Образ + Воля = Форма." },
  { id: "A21", title: "Ук (У)", short: "Удержание. Сфокусированное движение. Намерение." },
  { id: "A22", title: "Ферт (Ф)", short: "Светоносность. Излучение присутствия." },
  { id: "A23", title: "Хер (Х)", short: "Перекрёсток. Навигация. Выбор в многовариантности." },
  { id: "A24", title: "Ци (Ц)", short: "Энергетический ток. Направление жизни." },
  { id: "A25", title: "Червь (Ч)", short: "Глубинный импульс. Трансформация бессознательного." },
  { id: "A26", title: "Ша (Ш)", short: "Широта. Расширение. Распаковка масштаба." },
  { id: "A27", title: "Ща (Щ)", short: "Точечная глубина. Многогранность восприятия." },
  { id: "A28", title: "Твёрдый знак (Ъ)", short: "Порог. Пауза. Структурная граница." },
  { id: "A29", title: "Ы", short: "Внутренний ток. Тело говорит «я чувствую»." },
  { id: "A30", title: "Мягкий знак (Ь)", short: "Мягкое касание. Ласка формы." },
  { id: "A31", title: "Э", short: "Эхо. Узнавание себя в другом." },
  { id: "A32", title: "Ю", short: "Проникающее Я. Сжатие и вхождение." },
  { id: "A33", title: "Я", short: "Совокупное Я. Резонансный источник." },
  { id: "A34", title: "⊕", short: "Суперпозиция. Смыслы в одной точке." },
  { id: "A35", title: "∴", short: "Следствие. Неизбежное проявление." },
  { id: "A36", title: "∞", short: "Волна. Дыхание вне формы." },
  { id: "A37", title: "Резон", short: "Ответ поля. Диалог реальности." },
  { id: "A38", title: "Явь", short: "Проявленность. Масса × Внимание." },
  { id: "A39", title: "Поле", short: "Невидимая матрица возможностей." },
  { id: "A40", title: "Точка", short: "Порог ⊕. Ноль + Воля = Запуск." },
  { id: "A41", title: "Архе", short: "Исток. Довременное основание." },
  { id: "A42", title: "Тень", short: "Скрытое притяжение. Алхимическая материя." },
  { id: "A43", title: "Врата", short: "Переход. Завершение + Готовность." },
  { id: "A44", title: "Лик", short: "Персонифицированный смысл. Образ Я." },
  { id: "A45", title: "Суть", short: "Ядровое качество. Снятие лишнего." },
  { id: "A46", title: "Глас", short: "Голос источника. Я + Истина." },
  { id: "A47", title: "Дыхание", short: "Вдох + Выдох = Ритм жизни." },
  { id: "A48", title: "Вибрация", short: "Частота присутствия. Движение = Влияние." },
  { id: "A49", title: "Свет", short: "Ясность. Знание × Любовь." },
];

const BUKIX = [
  { id: "B1", symbol: "⊕", title: "Суперпозиция", short: "Совпадение психики, поля и формы в одной точке.", formula: "Ψ(⊕) = f(∅, τ, φ)", metaphor: "Центр мандалы, дыхание вселенной.", question: "В чём сейчас я и поле совпадают как ⊕?" },
  { id: "B2", symbol: "∅", title: "Пустота", short: "Совершенная потенциальность. Основание любой трансформации.", formula: "C^{⊕} = ∫ ℛ(∅ → F)", metaphor: "Чёрный холст первозданной воли.", question: "Где я боюсь пустоты вместо входа в её силу?" },
  { id: "B3", symbol: "τ", title: "Пластичность времени", short: "Изгиб, сжатие, развёртывание хроноса волей сознания.", formula: "E = τ × ∆S", metaphor: "Река, сворачиваемая в каплю или океан.", question: "Где расслабить/ускорить время как союзника?" },
  { id: "B4", symbol: "Ψ", title: "Волновая форма", short: "Любое состояние — волна с A, f, φ.", formula: "Ψ(x,t) = A·sin(kx − ωt + φ)", metaphor: "Голос души, колебание истины.", question: "В какой волне я нахожусь сейчас?" },
  { id: "B5", symbol: "C^{⊕}", title: "⊕‑Капитал", short: "Сумма прожитых ⊕‑состояний, структурированная в ценность.", formula: "C^{⊕} = Q × R × S × T", metaphor: "Свет, собранный в сосуд.", question: "Что из моего ⊕ я уже капитализирую?" },
  { id: "B6", symbol: "Σ", title: "Сумма резонансов", short: "Кумулятивный отклик поля на ⊕‑действие.", formula: "ΣR_i = ∑ (A_i × t_i × Q_i)", metaphor: "Эхо, возвращающееся судьбой.", question: "Что сейчас возвращается ко мне как сумма ⊕‑влияний?" },
  { id: "B7", symbol: "φ", title: "Фаза пробуждения", short: "Угловой момент переключения восприятия.", formula: "φ = arcsin(Ψ/A)", metaphor: "Щелчок, после которого мир иной.", question: "Где я стою на пороге фазы ⊕?" },
  { id: "B8", symbol: "R_f", title: "Резонанс с будущим", short: "Навигационный тон ⊕‑предчувствия.", formula: "R_f = lim_{t→0+} ⟨Ψ_future, Ψ_now⟩", metaphor: "Слышать песню, которую ещё не написал.", question: "Что уже звучит как зов будущего?" },
  { id: "B9", symbol: "∇", title: "Градиент", short: "Направление и скорость изменения ⊕‑состояния.", formula: "∇Ψ = ∂Ψ/∂x + ∂Ψ/∂t", metaphor: "Струя воздуха, по которой душа летит.", question: "В какую сторону движется мой ⊕ сейчас?" },
  { id: "B10", symbol: "I_{Я}", title: "Интеграция ядра", short: "Собранность и устойчивость «Я» в переходе.", formula: "I_{Я} = (C_m × S_f) / ∅", metaphor: "Ядро компаса, не сбивающееся при вращении.", question: "Насколько интегрировано моё Я сейчас?" },
  { id: "B11", symbol: "⊗", title: "Точка кристаллизации", short: "Переход волны в структуру, рождение формы.", formula: "⊗ = lim_{Ψ → F}", metaphor: "Кристалл соли из воды смысла.", question: "Где моё ⊕‑движение готово стать кристаллом?" },
  { id: "B12", symbol: "F_s", title: "Поток смысла", short: "Динамика развёртывания смыслов через Я и поле.", formula: "F_s = α × I_{Я} × C_m", metaphor: "Река, несущая смысл через слова.", question: "Я говорю — или смыслы текут через меня?" },
  { id: "B13", symbol: "λ", title: "Длина волны", short: "Радиус и дальность сохранения ⊕‑состояния.", formula: "λ = v / f", metaphor: "Длина дыхания между вдохом и действием.", question: "Как далеко распространяется мой ⊕?" },
  { id: "B14", symbol: "A", title: "Амплитуда переживания", short: "Интенсивность ⊕‑проживания и силы импульса.", formula: "Ψ(x) = A·sin(kx − ωt + φ)", metaphor: "Волна жара, когда истина сказана.", question: "Насколько сильно волна прошла через меня?" },
  { id: "B15", symbol: "∆S", title: "Изменение смысла", short: "Переход к новой смысловой структуре.", formula: "E^{⊕} = (∆S/τ) × Q", metaphor: "Переосмысление жизни одним взглядом.", question: "Что во мне сейчас изменилось в смысле?" },
  { id: "B16", symbol: "Q", title: "Качество отклика", short: "Способность системы трансформировать импульс в ответ.", formula: "C^{⊕} = Q × R × S × T", metaphor: "Кристалл, преломляющий свет в радугу.", question: "Насколько откликаюсь из ⊕, а не из защиты?" },
  { id: "B17", symbol: "T", title: "Текучесть", short: "Движение ⊕‑энергии сквозь контексты без разрушения.", formula: "T = (∆S × λ) / R", metaphor: "Ручей, обтекающий камень к океану.", question: "Где сопротивляюсь, а где могу стать текучим?" },
  { id: "B18", symbol: "S_f", title: "Структурная форма", short: "Геометрия контейнера, удерживающего энергию.", formula: "I_{Я} = (C_m × S_f) / ∅", metaphor: "Горшок, дающий воде смысл формы.", question: "Какая форма удержит мою текущую ⊕‑волну?" },
  { id: "B19", symbol: "C_m", title: "Контейнер смыслов", short: "Объём, в котором смысл переваривается и удерживается.", formula: "F_s = α × I_{Я} × C_m", metaphor: "Чаша, углубляемая каждым опытом.", question: "Сколько смысла я могу выдержать, не потеряв себя?" },
  { id: "B20", symbol: "E^{⊕}", title: "Энтропическая энергия", short: "Способность превращать хаос в ⊕‑устойчивость.", formula: "E^{⊕} = (dS/dT) × τ × Q", metaphor: "Молния: разрушить или зажечь костёр.", question: "Что я сейчас трансформирую из хаоса в форму?" },
  { id: "B21", symbol: "α", title: "Коэффициент соответствия", short: "Синхронизация внутреннего Я со средой.", formula: "F_s = α × I_{Я} × C_m", metaphor: "Камертон, от которого поёт другой.", question: "Насколько я соответствую себе и среде?" },
  { id: "B22", symbol: "k", title: "Плотность восприятия", short: "Степень сжатия восприятия и остроты перехода.", formula: "Ψ(x,t) = A·sin(kx − ωt + φ)", metaphor: "Пронзительный взгляд, видящий целую жизнь.", question: "Где моё восприятие сжалось и стало яснее?" },
  { id: "B23", symbol: "ω", title: "Частота обновления", short: "Скорость безопасной перезаписи ⊕‑состояния.", formula: "Ψ(x,t) = A·sin(kx − ωt + φ)", metaphor: "Пульс, обновляющий тело смыслом.", question: "С какой частотой я могу обновляться, не разрушаясь?" },
  { id: "B24", symbol: "⊕(Σ)", title: "Суперпозиция систем", short: "Наложение ⊕‑полей → новая эмерджентная система.", formula: "⊕(Σ) ≠ Σ⊕_i", metaphor: "Музыка, рождаемая наложением, а не нотами.", question: "Какой ⊕ рождается там, где мы вместе?" },
];

const TXX = [
  { id: "TX1", title: "Ядро", focus: "Центрация. Ноль. Сбор в присутствии.", action: "3 минуты дыхания ⊕. Назови Суть намерения одним предложением.", mantra: "Я в ядре. Я есмь." },
  { id: "TX2", title: "Орбита", focus: "Расширение поля без потери центра.", action: "Сделай одно касание с внешним полем из присутствия.", mantra: "Я распространяюсь из центра." },
  { id: "TX3", title: "Резонанс", focus: "Настройка на отклик среды.", action: "Наблюдай 30 минут совпадения. Запиши 3 сигнала.", mantra: "Я слышу поле." },
  { id: "TX4", title: "Мост", focus: "Перевод смысла в действие.", action: "Сформулируй шаг на 24 часа и забронируй слот.", mantra: "Я перевожу смысл в форму." },
  { id: "TX5", title: "Материализация", focus: "Фокусированное действие.", action: "Сделай 1 измеримый шаг. Закрой мини‑цикл.", mantra: "Я делаю. Я завершаю." },
  { id: "TX6", title: "Интеграция", focus: "Удержание результата в системе.", action: "Зафиксируй изменения в структуре/артефактах.", mantra: "Я интегрирую." },
  { id: "TX7", title: "Перезапуск", focus: "Снятие инерции и новый заход.", action: "Ретроспектива 5 минут. Выбери новую связку Аз × Бука.", mantra: "Я начинаю заново — глубже." },
];

const GEOMX = [
  { id: 'Euclid', label: 'Евклид' }, { id: 'Lobachevsky', label: 'Лобачевский' }, { id: 'Riemann', label: 'Риман' }, { id: 'Projective', label: 'Проектив' }, { id: 'Supra', label: 'Сверх' }
];
const POINT_TYPES_X = [
  { id: 'Разрыв', hint: 'Сшить порог: ядро, перезапуск, мягкая сборка.' },
  { id: 'Залипание', hint: 'Дать движение: орбита, настроиться на резонанс.' },
  { id: 'Вход', hint: 'Принять сигнал: резонанс → мост, малый шаг.' },
  { id: 'Интеграция', hint: 'Встроить и закрыть: интеграция/материализация.' },
];
const POINT_TO_TX_X = { 'Разрыв': ['TX1','TX7'], 'Залипание': ['TX2','TX3'], 'Вход': ['TX3','TX4'], 'Интеграция': ['TX6','TX5'] };

function AzBukiPanel(){
  const [az, setAz] = useState(null);
  const [buka, setBuka] = useState(null);
  const [tx, setTx] = useState(null);
  const [note, setNote] = useState("");
  const [induction, setInduction] = useState("");
  const [inversion, setInversion] = useState("");
  const [objectLabel, setObjectLabel] = useState("");
  const [imageLabel, setImageLabel] = useState("");
  const superposition = useMemo(()=>{
    const o = objectLabel.trim(); const i = imageLabel.trim();
    return (o||i) ? `${o||'…'} ⊕ ${i||'…'}` : "";
  },[objectLabel,imageLabel]);
  const [geometry, setGeometry] = useState('Euclid');
  const [pointType, setPointType] = useState('Вход');
  const [metrics, setMetrics] = useState({ alpha:"", IY:"", Cm:"", Q:"", T:"" });
  const [openBukaId, setOpenBukaId] = useState(null);
  const [diary, setDiary] = useState([]);
  const todayCount = useMemo(()=> diary.filter(d=>d.date.startsWith(todayKeyX())).length, [diary]);
  const DAILY_LIMIT = 3;

  const pickRandomAz = () => setAz(randomPickX(AZX));
  const pickRandomBuka = () => setBuka(randomPickX(BUKIX));
  const pickRandomTx = () => setTx(randomPickX(TXX));
  const reset = () => { setAz(null); setBuka(null); setTx(null); setNote(""); setInduction(""); setInversion(""); setObjectLabel(""); setImageLabel(""); setGeometry('Euclid'); setPointType('Вход'); setMetrics({ alpha:"", IY:"", Cm:"", Q:"", T:"" }); };

  const saveCombo = () => {
    if (!az || !buka) return;
    const item = {
      id: uuidX(), date: `${todayKeyX()} ${tsX().split(',')[1]?.trim()||''}`,
      az, buka, tx, note: note.trim(), induction: induction.trim(), inversion: inversion.trim(),
      object_label: objectLabel.trim(), image_label: imageLabel.trim(), superposition,
      geometry, point_type: pointType,
      metrics: { alpha: metrics.alpha, I_Y: metrics.IY, C_m: metrics.Cm, Q: metrics.Q, T: metrics.T }
    };
    setDiary([item, ...diary]);
    reset();
  };
  const removeItem = (id) => setDiary(diary.filter(d=>d.id!==id));

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#0f1630] to-[#0a0f1c] border border-yellow-200/20 shadow-2xl">
        <div className="flex items-center justify_between gap-6 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Аз × Буки</h2>
            <p className="mt-2 text-yellow-100/80 max-w-2xl">Выбери <span className="text-yellow-300">Аз</span> и <span className="text-yellow-300">Буку</span>, затем укажи <span className="text-yellow-300">передачу</span>, чтобы активировать резонанс и превратить его в действие.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={pickRandomAz} className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-medium shadow hover:shadow-lg">Случайный Аз</button>
            <button type="button" onClick={pickRandomBuka} className="px-4 py-2 rounded-xl border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Случайная Бука</button>
            <button type="button" onClick={pickRandomTx} className="px-4 py-2 rounded-xl border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Случайная передача</button>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Аз */}
          <motion.div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
            <div className="mb-3 text-yellow-200/90 font-medium">Выбор Аз (49)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AZX.map((item, idx) => (
                <button type="button" key={item.id} onClick={() => setAz(item)} className={clsX("rounded-xl p-3 text-left text-sm border hover:bg-yellow-300/10", az?.id === item.id ? "border-yellow-300 bg-yellow-300/20" : "border-yellow-200/20 text-yellow-100/90")}
                  title={item.short}>
                  <div className="text-[11px] opacity-70">А{idx + 1}</div>
                  <div className="font-medium text-yellow-200">{item.title}</div>
                  <div className="text-[12px] opacity-80 line-clamp-2">{item.short}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Буки */}
          <motion.div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
            <div className="mb-3 text-yellow-200/90 font-medium">Выбор Буки (24)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
              {BUKIX.map((item, idx) => (
                <div key={item.id} className={clsX("rounded-xl border p-3", buka?.id === item.id ? "border-yellow-300 bg-yellow-300/10" : "border-yellow-200/20")}> 
                  <button type="button" onClick={() => setBuka(item)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] opacity-70">Б{idx + 1}</div>
                      <div className="text-xs px-2 py-0.5 rounded-lg bg-yellow-300/20 border border-yellow-300/40 text-yellow-200">{item.symbol}</div>
                    </div>
                    <div className="mt-1 font-medium text-yellow-200">{item.title}</div>
                    <div className="text-[12px] opacity-80 line-clamp-2">{item.short}</div>
                  </button>
                  <button type="button" onClick={() => setOpenBukaId(openBukaId === item.id ? null : item.id)} className="mt-2 text-xs text-yellow-200/80 hover:underline">
                    {openBukaId === item.id ? "Свернуть" : "Подробнее"}
                  </button>
                  <AnimatePresence>
                    {openBukaId === item.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-xs text-yellow-100/85 space-y-1">
                        <div><span className="opacity-70">Формула:</span> {item.formula}</div>
                        <div><span className="opacity-70">Метафора:</span> {item.metaphor}</div>
                        <div><span className="opacity-70">Вопрос:</span> {item.question}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Резонансная карта */}
        {(az && buka) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6 shadow-xl bg-[#0b1220]/90 border border-yellow-200/20 mt-6">
            <div className="text-center mb-4">
              <div className="text-sm uppercase tracking-widest text-yellow-200/80">Формула свершения</div>
              <div className="mt-2 text-2xl text-yellow-300 font-semibold">{az?.title} <span className="opacity-70">×</span> {buka ? `${buka.symbol} ${buka.title}` : "—"}</div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
                <div className="text-yellow-200/90 font-medium">Аз</div>
                <div className="text-yellow-50/70 text-sm mt-1">{az?.short}</div>
              </div>
              <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
                <div className="text-yellow-200/90 font-medium">Бука</div>
                <div className="text-yellow-50/70 text-sm mt-1">{buka ? `${buka.symbol} · ${buka.short}` : "—"}</div>
                {buka && (<div className="mt-2 text-xs text-yellow-200/70">Формула: <span className="text-yellow-100/90">{buka.formula}</span></div>)}
              </div>
              <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
                <div className="text-yellow-200/90 font-medium">Практика</div>
                <div className="text-yellow-50/70 text-sm mt-1">Сформируй внешнюю форму, соответствующую внутренней частоте. Сделай один измеримый шаг сегодня.</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-yellow-200/90 font-medium mb-1">7 передач</div>
              <div className="flex flex-wrap gap-2">
                {TXX.map((t)=> (
                  <button type="button" key={t.id} onClick={()=>setTx(t)} className={clsX("px-3 py-1.5 rounded-xl border text-xs", tx?.id===t.id? "border-yellow-300 bg-yellow-300/20" : "border-yellow-200/20 text-yellow-100/90")} title={t.focus}>{t.title}</button>
                ))}
              </div>
              {tx && (
                <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10"><div className="text-yellow-200/80">Фокус</div><div className="text-yellow-50/85 mt-1">{tx.focus}</div></div>
                  <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10"><div className="text-yellow-200/80">Действие</div><div className="text-yellow-50/85 mt-1">{tx.action}</div></div>
                  <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10"><div className="text-yellow-200/80">Мантра</div><div className="text-yellow-50/85 mt-1 italic">{tx.mantra}</div></div>
                </div>
              )}
            </div>

            {/* Индукция / Инверсия */}
            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
                <div className="text-yellow-200/90 font-medium mb-1">Индукция</div>
                <textarea value={induction} onChange={(e)=>setInduction(e.target.value)} placeholder="Что я активирую внутри?" className="w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 text-sm placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3}/>
              </div>
              <div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
                <div className="text-yellow-200/90 font-medium mb-1">Инверсия</div>
                <textarea value={inversion} onChange={(e)=>setInversion(e.target.value)} placeholder="Что я втягиваю из будущего?" className="w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 text-sm placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3}/>
              </div>
            </div>

            {/* Сингулярная точка */}
            <div className="mt-5 rounded-2xl p-4 bg-black/15 border border-yellow-200/20">
              <div className="mb-2 text-yellow-200/90 font-medium">Сингулярная точка (⊕)</div>
              <div className="grid md:grid-cols-2 gap-3">
                <input value={objectLabel} onChange={(e)=>setObjectLabel(e.target.value)} placeholder="Объект (что во внешнем)" className="rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-sm" />
                <input value={imageLabel} onChange={(e)=>setImageLabel(e.target.value)} placeholder="Образ (как это отражено)" className="rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-sm" />
              </div>
              {superposition && <div className="mt-2 text-sm text-yellow-100/85">Суперпозиция: <span className="font-medium text-yellow-300">{superposition}</span></div>}
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-yellow-200/70 mb-1">Геометрия</div>
                  <div className="flex flex-wrap gap-2">
                    {GEOMX.map(g => (
                      <button type="button" key={g.id} onClick={()=>setGeometry(g.id)} className={`px-3 py-1.5 rounded-lg border text-xs ${geometry===g.id? 'border-yellow-300 bg-yellow-300/20' : 'border-yellow-200/20 text-yellow-100/90'}`}>{g.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-yellow-200/70 mb-1">Тип точки</div>
                  <div className="flex flex-wrap gap-2">
                    {POINT_TYPES_X.map(p => (
                      <button type="button" key={p.id} onClick={()=>setPointType(p.id)} title={p.hint} className={`px-3 py-1.5 rounded-lg border text-xs ${pointType===p.id? 'border-yellow-300 bg-yellow-300/20' : 'border-yellow-200/20 text-yellow-100/90'}`}>{p.id}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid md:grid-cols-5 gap-2 text-xs">
                <input value={metrics.alpha} onChange={(e)=>setMetrics(v=>({...v, alpha:e.target.value}))} placeholder="α" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
                <input value={metrics.IY} onChange={(e)=>setMetrics(v=>({...v, IY:e.target.value}))} placeholder="I_{Я}" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
                <input value={metrics.Cm} onChange={(e)=>setMetrics(v=>({...v, Cm:e.target.value}))} placeholder="C_m" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
                <input value={metrics.Q} onChange={(e)=>setMetrics(v=>({...v, Q:e.target.value}))} placeholder="Q" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
                <input value={metrics.T} onChange={(e)=>setMetrics(v=>({...v, T:e.target.value}))} placeholder="T" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
              </div>
            </div>

            <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Заметка/намерение: что именно я материализую?" className="mt-4 w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3} />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={saveCombo} className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-medium shadow hover:shadow-lg active:translate-y-px">Сохранить в дневник</button>
            </div>
          </motion.div>
        )}

        {/* Дневник панели */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-yellow-200/90 font-medium">Дневник связок ({diary.length})</div>
            <div className="text-xs text-yellow-200/60">Сегодня: {todayCount}/{DAILY_LIMIT}</div>
          </div>
          {diary.length === 0 ? (
            <div className="rounded-2xl p-6 border border-yellow-200/20 text-yellow-200/70">Пока записей нет.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {diary.map((d) => (
                <motion.div key={d.id} className="rounded-2xl p-4 bg-black/30 border border-yellow-200/20" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-yellow-200/70">{d.date}</div>
                    <button type="button" onClick={() => removeItem(d.id)} className="text-xs px-2 py-1 rounded-lg border border-yellow-300/30 text-yellow-200 hover:bg-yellow-300/10">Удалить</button>
                  </div>
                  <div className="mt-2 text-lg text-yellow-300 font-semibold">{d.az.title} × {d.buka.symbol} {d.buka.title}</div>
                  {d.tx && <div className="mt-1 text-xs text-yellow-200/80">Передача: <span className="text-yellow-100/90">{d.tx.title}</span></div>}
                  {d.induction && (<div className="mt-1 text-yellow-100/80 text-sm">Индукция: {d.induction}</div>)}
                  {d.inversion && (<div className="mt-1 text-yellow-100/80 text-sm">Инверсия: {d.inversion}</div>)}
                  {d.note && (<div className="mt-2 text-yellow-100/80 whitespace-pre-wrap text-sm">{d.note}</div>)}
                  {(d.object_label || d.image_label) && (
                    <div className="mt-2 text-xs text-yellow-200/80">⊕ {d.object_label || '…'} ⊕ {d.image_label || '…'}{d.geometry ? ` • ${GEOMX.find(g=>g.id===d.geometry)?.label}` : ''}{d.point_type ? ` • ${d.point_type}` : ''}</div>
                  )}
                  {d.metrics && (d.metrics.alpha || d.metrics.I_Y || d.metrics.C_m || d.metrics.Q || d.metrics.T) && (
                    <div className="mt-1 text-[11px] text-yellow-200/70">метрики: {[['α',d.metrics.alpha],["I_{Я}",d.metrics.I_Y],["C_m",d.metrics.C_m],["Q",d.metrics.Q],["T",d.metrics.T]].filter(([,v])=>v!==undefined && v!=="").map(([k,v])=>`${k}:${v}`).join(' · ')}</div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function ResonanceReport({ items }){
  const R = useMemo(()=>{
    const r = { byPlate:{}, byPhase:{}, byAz:{}, byBuka:{}, byTx:{} };
    (items||[]).forEach(d=>{
      r.byPlate[d.plate] = (r.byPlate[d.plate]||0)+1;
      r.byPhase[d.card.roman] = (r.byPhase[d.card.roman]||0)+1;
      if (d.az) r.byAz[d.az.title] = (r.byAz[d.az.title]||0)+1;
      if (d.buka) r.byBuka[`${d.buka.symbol} ${d.buka.title}`] = (r.byBuka[`${d.buka.symbol} ${d.buka.title}`]||0)+1;
      if (d.tx) r.byTx[d.tx.title] = (r.byTx[d.tx.title]||0)+1;
    });
    return r;
  },[items]);

  const Block = ({ title, obj }) => {
    const entries = Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]).slice(0,8);
    return (
      <div className="mt-2">
        <div className="text-xs text-yellow-200/70">{title}</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {entries.map(([k,v]) => <Chip key={k}>{k} — {v}</Chip>)}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Block title="По плитам" obj={R.byPlate} />
      <Block title="По фазам (I–IV)" obj={R.byPhase} />
      <Block title="Топ Аз" obj={R.byAz} />
      <Block title="Топ Буки" obj={R.byBuka} />
      <Block title="Топ Передач" obj={R.byTx} />
    </div>
  );
}

// =====================
// Обёртка с табами: «Цикл карт» | «Аз × Буки»
// =====================
// =====================
// ТАКТИЧЕСКИЙ МОДУЛЬ (Архитектоника тактики 2.0)
// =====================
function TacticsPanel(){
  const [step, setStep] = useState(0);
  const steps = [
    {
      id: 1,
      title: "Micro‑Стабилизация",
      focus: "Успокоить поле и тело",
      prompt: "Где сейчас моё внимание? Что лишнее?",
    },
    {
      id: 2,
      title: "Micro‑Фокус",
      focus: "Выделить один вектор",
      prompt: "Какой один вопрос/движение сейчас главное?",
    },
    {
      id: 3,
      title: "Micro‑Решение",
      focus: "Принять внутренний выбор",
      prompt: "На что я соглашаюсь сейчас?",
    },
    {
      id: 4,
      title: "Micro‑Действие",
      focus: "Сделать один шаг",
      prompt: "Какой самый маленький шаг я могу сделать за 15 минут?",
    },
    {
      id: 5,
      title: "Micro‑Результат",
      focus: "Зафиксировать факт",
      prompt: "Что изменилось внешне и во мне?",
    },
    {
      id: 6,
      title: "Micro‑Интеграция",
      focus: "Встроить в систему",
      prompt: "Где сохранить/закрепить результат?",
    },
    {
      id: 7,
      title: "Micro‑Синтез",
      focus: "Собрать смысл нового витка",
      prompt: "Как одним предложением описать сдвиг?",
    },
  ];

  const current = steps[step] ?? steps[0];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#0f172a] to-[#020617] border border-yellow-200/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Тактический протокол · 7 micro‑шагов</h2>
        <p className="mt-2 text-sm md:text-base text-yellow-100/80 max-w-2xl">
          Используй протокол как короткий цикл тактики: стабилизация → фокус → решение → действие → результат → интеграция → синтез.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(idx)}
              className={clsX(
                "px-3 py-1.5 rounded-xl border text-xs md:text-sm",
                idx === step
                  ? "bg-yellow-300 text-black border-yellow-300 shadow"
                  : "border-yellow-200/30 text-yellow-100/90 hover:bg-yellow-300/10"
              )}
            >
              {s.id}. {s.title}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-200/30 bg-black/30 p-4 md:p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-yellow-200/60 mb-1">
            Текущий шаг
          </div>
          <div className="text-lg md:text-xl text-yellow-300 font-semibold">
            {current.id}. {current.title}
          </div>
          <div className="mt-1 text-sm text-yellow-100/80">Фокус: {current.focus}</div>
          <div className="mt-3 text-sm md:text-base text-yellow-50/90">
            Вопрос: <span className="font-medium">{current.prompt}</span>
          </div>
          <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs md:text-sm">
            <div>
              <div className="text-yellow-200/70 mb-1">Ответ / намерение</div>
              <textarea
                className="w-full rounded-xl bg-black/40 border border-yellow-200/30 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60"
                rows={4}
                placeholder="Сформулируй, что ты выбираешь / видишь / решаешь сейчас."
              />
            </div>
            <div>
              <div className="text-yellow-200/70 mb-1">Конкретный micro‑шаг</div>
              <textarea
                className="w-full rounded-xl bg-black/40 border border-yellow-200/30 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60"
                rows={4}
                placeholder="Опиши действие, которое реально можно сделать за 10–20 минут."
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// =====================
// ДИАГНОСТИКА ФАЗ ИСТОЧНИКА (I₁–I₁₂)
// =====================
function SourcePhaseDiagnostics(){
  const phases = [
    { id: "I1", label: "I₁ · Разброс", hint: "Внимание рассыпано, тело в напряжении, мысли скачут." },
    { id: "I2", label: "I₂ · Сбор внимания", hint: "Появляется точка фокуса, дыхание выравнивается." },
    { id: "I3", label: "I₃ · Присутствие", hint: "Чувство «я здесь», меньше внутреннего шума." },
    { id: "I4", label: "I₄ · Вектор", hint: "Появляется направление, формулируется вопрос/намерение." },
    { id: "I5", label: "I₅ · Решимость", hint: "Внутреннее согласие идти, даже если страшно." },
    { id: "I6", label: "I₆ · Первое действие", hint: "Свершён конкретный шаг в материи." },
    { id: "I7", label: "I₇ · Резонанс", hint: "Поле отвечает: люди, события, синхронии." },
    { id: "I8", label: "I₈ · Формализация", hint: "Появляются структуры, договоры, процессы." },
    { id: "I9", label: "I₉ · Масштаб", hint: "Система выдерживает рост, не разваливаясь." },
    { id: "I10", label: "I₁₀ · Интеграция", hint: "Опыт встроен в личную и системную историю." },
    { id: "I11", label: "I₁₁ · Перезапуск", hint: "Падает старая форма, но ядро устойчиво." },
    { id: "I12", label: "I₁₂ · Тишина", hint: "Глубокий покой перед новым витком." },
  ];
  const [active, setActive] = useState("I1");

  const current = phases.find(p => p.id === active) ?? phases[0];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#020617] to-[#020617] border border-yellow-200/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Фазы Источника I₁–I₁₂</h2>
        <p className="mt-2 text-sm md:text-base text-yellow-100/80 max-w-2xl">
          Отметь фазу, в которой ты находишься сейчас. Это не диагноз, а навигация: где я в цикле Источника?
        </p>
        <div className="mt-4 grid md:grid-cols-3 gap-2">
          {phases.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p.id)}
              className={clsX(
                "text-left px-3 py-2 rounded-xl border text-xs md:text-sm",
                active === p.id
                  ? "border-yellow-300 bg-yellow-300/20 text-yellow-50"
                  : "border-yellow-200/20 text-yellow-100/80 hover:bg-yellow-300/10"
              )}
            >
              <div className="font-medium">{p.label}</div>
              <div className="text-[11px] opacity-80 line-clamp-2">{p.hint}</div>
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-yellow-200/30 bg-black/40 p-4 md:p-5 text-sm md:text-base text-yellow-50/90">
          <div className="text-yellow-200/80 text-xs uppercase tracking-[0.2em] mb-1">Текущая фаза</div>
          <div className="text-lg md:text-xl text-yellow-300 font-semibold mb-2">{current.label}</div>
          <div className="text-yellow-50/85 mb-3">{current.hint}</div>
          <textarea
            className="w-full rounded-xl bg-black/50 border border-yellow-200/40 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 text-sm"
            rows={4}
            placeholder="Заметь: как сейчас говорит тело, речь, внимание, решения? Что указывает на эту фазу?"
          />
        </div>
      </motion.div>
    </section>
  );
}

// =====================
// МЕТРИКИ ЦИКЛА (τ, λ и др.)
// =====================
function MetricsPanel(){
  const [points, setPoints] = useState([
    { id: 1, label: "Шаг 1", tau: "", lambda: "" },
    { id: 2, label: "Шаг 2", tau: "", lambda: "" },
    { id: 3, label: "Шаг 3", tau: "", lambda: "" },
    { id: 4, label: "Шаг 4", tau: "", lambda: "" },
    { id: 5, label: "Шаг 5", tau: "", lambda: "" },
    { id: 6, label: "Шаг 6", tau: "", lambda: "" },
    { id: 7, label: "Шаг 7", tau: "", lambda: "" },
    { id: 8, label: "Шаг 8", tau: "", lambda: "" },
  ]);

  const updatePoint = (id, field, value) => {
    setPoints(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#020617] to-[#020617] border border-yellow-200/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Метрики цикла</h2>
        <p className="mt-2 text-sm md:text-base text-yellow-100/80 max-w-2xl">
          Отметь для каждого шага цикла субъективное время (τ) и дальность/амплитуду влияния (λ). Это ручная диагностика: где цикл залипает, а где идёт легко.
        </p>
        <div className="mt-5 grid md:grid-cols-2 gap-3 text-xs md:text-sm">
          {points.map(p => (
            <div key={p.id} className="rounded-2xl border border-yellow-200/20 bg-black/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-yellow-200">{p.label}</div>
                <div className="text-[11px] text-yellow-200/70">#{p.id}</div>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  value={p.tau}
                  onChange={e => updatePoint(p.id, "tau", e.target.value)}
                  placeholder="τ (время)"
                  className="flex-1 rounded-lg bg-black/40 border border-yellow-200/30 p-2 text-yellow-50 placeholder-yellow-200/40"
                />
                <input
                  value={p.lambda}
                  onChange={e => updatePoint(p.id, "lambda", e.target.value)}
                  placeholder="λ (дальность)"
                  className="flex-1 rounded-lg bg-black/40 border border-yellow-200/30 p-2 text-yellow-50 placeholder-yellow-200/40"
                />
              </div>
              <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-yellow-300/80 transition-all"
                  style={{ width: `${Math.min(100, (parseFloat(p.lambda || "0") || 0) * 10)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// =====================
// МОДУЛЬ ТВОРЦА (упрощённый интерфейс ядра Творца)
// =====================
function CreatorCorePanel(){
  const [layer, setLayer] = useState("body");
  const [note, setNote] = useState("");

  const layers = [
    { id: "body", title: "Тело", hint: "Что сейчас говорит тело?" },
    { id: "emotion", title: "Эмоции", hint: "Какая эмоция доминирует?" },
    { id: "mind", title: "Мысль", hint: "Какой вопрос крутится?" },
    { id: "creator", title: "Творец", hint: "Какое новое решение рождается?" },
  ];

  const current = layers.find(l => l.id === layer) ?? layers[0];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#020617] to-[#020617] border border-yellow-200/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Ядро Творца</h2>
        <p className="mt-2 text-sm md:text-base text-yellow-100/80 max-w-2xl">
          Простой проход по четырём слоям: тело → эмоции → мысль → творец. Ответь на вопросы, а затем сформулируй одно творческое решение.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {layers.map(l => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLayer(l.id)}
              className={clsX(
                "px-3 py-1.5 rounded-xl border text-xs md:text-sm",
                layer === l.id
                  ? "bg-yellow-300 text-black border-yellow-300"
                  : "border-yellow-200/30 text-yellow-100/90 hover:bg-yellow-300/10"
              )}
            >
              {l.title}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-yellow-200/30 bg-black/40 p-4 md:p-5 text-sm md:text-base text-yellow-50/90">
          <div className="text-yellow-200/70 text-xs uppercase tracking-[0.2em] mb-1">Текущий слой</div>
          <div className="text-lg md:text-xl text-yellow-300 font-semibold mb-2">{current.title}</div>
          <div className="text-yellow-50/85 mb-3">{current.hint}</div>
          <textarea
            className="w-full rounded-xl bg-black/50 border border-yellow-200/40 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 text-sm"
            rows={4}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Пиши как есть. Не редактируй — просто выгрузи, что есть в этом слое."
          />
        </div>
      </motion.div>
    </section>
  );
}

// =====================
// СПРАВОЧНЫЙ МОДУЛЬ «Пустотная алгебра»
// =====================
function EmptyAlgebraInfoPanel(){
  const blocks = [
    {
      title: "M⁷ · Разветвление миров",
      text: "Точка, где одно решение рождает несколько веток реальности. Важно: не застрять в бесконечном выборе, а отметить 2–3 реальные ветки.",
    },
    {
      title: "M⁸ · Согласованность",
      text: "Проверка: тело, эмоции, мысль и действие смотрят в одну сторону или тянут в разные? Здесь возвращается целостность.",
    },
    {
      title: "M⁹ · Синхронизация",
      text: "Настройка ритмов: свой цикл ↔ циклы других людей ↔ циклы систем. Где сейчас конфликт ритмов, а где — созвучие?",
    },
    {
      title: "M¹⁰ · Сшивание уровней",
      text: "Объединение: личное ↔ семейное ↔ профессиональное ↔ мета‑уровень. Важно увидеть, где одно решение одновременно сдвигает сразу несколько уровней.",
    },
    {
      title: "M¹¹ · Meta‑Контейнер",
      text: "Создание формы, которая выдерживает хаос и изменения. Проекты, команды, структуры, место силы — всё, что может держать энергию и смыслы.",
    },
    {
      title: "M¹² · Тишина Источника",
      text: "Состояние перед новым витком, где ничего не нужно доказывать. Просто быть в ядре «Я есмь» и дать миру ответить.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#020617] to-[#020617] border border-yellow-200/20 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300">Пустотная алгебра · M⁷–M¹²</h2>
        <p className="mt-2 text-sm md:text-base text-yellow-100/80 max-w-2xl">
          Справочный слой для работы с пустотой как с функцией, а не провалом. Используй, когда хочешь понять, что происходит на уровне поля, а не только формы.
        </p>
        <div className="mt-5 grid md:grid-cols-2 gap-3 text-sm">
          {blocks.map(b => (
            <div key={b.title} className="rounded-2xl border border-yellow-200/25 bg-black/30 p-3 md:p-4">
              <div className="text-yellow-200 font-semibold mb-1">{b.title}</div>
              <div className="text-yellow-50/85 text-xs md:text-sm whitespace-pre-line">{b.text}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// =====================
// Обёртка с табами: Цикл карт | Аз×Буки | Тактика | Источник | Метрики | Творец | M⁷–M¹²
// =====================
export default function GDEYAAppTabs(){
  const [tab, setTab] = useState('core');
  const tabs = [
    { id: 'core', label: 'Цикл карт' },
    { id: 'azbuki', label: 'Аз × Буки' },
    { id: 'tactics', label: 'Тактика' },
    { id: 'source', label: 'Источник I₁–I₁₂' },
    { id: 'metrics', label: 'Метрики' },
    { id: 'creator', label: 'Творец' },
    { id: 'empty', label: 'M⁷–M¹²' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-yellow-50">
      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a0f1c]/80 border-b border-yellow-200/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,.8)]" />
            <div className="font-semibold tracking-wide text-sm md:text-base">ГДЕЯ · ядро субъекта</div>
          </div>
          <nav className="flex flex-wrap gap-1.5 text-[11px] md:text-xs">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsX(
                  "px-2.5 py-1.5 rounded-lg border",
                  tab === t.id
                    ? "bg-yellow-300 text-black border-yellow-300"
                    : "border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
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
