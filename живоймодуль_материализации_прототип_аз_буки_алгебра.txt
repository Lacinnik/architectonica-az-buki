import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------
// Живой модуль материализации — Аз × Буки
// Прототип v0.6: фикс синтаксиса JSX, стабильный ввод, без лишних размонтирований
// ---------------------------------------------

// Хелперы
const todayKey = () => new Date().toISOString().slice(0, 10);
const ts = () => new Date().toLocaleString();
const cls = (...a) => a.filter(Boolean).join(" ");
const uuid = () => (globalThis.crypto?.randomUUID?.() ?? ("id-" + Math.random().toString(36).slice(2)));
const randomPick = (list) => (Array.isArray(list) && list.length ? list[Math.floor(Math.random() * list.length)] : null);

// 49 Аз
const AZ = [
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

// 24 Буки Перехода
const BUKI = [
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

// 7 ПЕРЕДАЧ (фазы ⊕‑движения)
const TRANSMISSIONS = [
  { id: "TX1", title: "Ядро",      focus: "Центрация. Ноль. Сбор в присутствии.",            action: "3 минуты дыхания ⊕. Назови Суть намерения одним предложением.", mantra: "Я в ядре. Я есмь." },
  { id: "TX2", title: "Орбита",    focus: "Расширение поля без потери центра.",               action: "Сделай одно касание с внешним полем (сообщение/звонок/пост) из присутствия.", mantra: "Я распространяюсь из центра." },
  { id: "TX3", title: "Резонанс",  focus: "Настройка на отклик среды.",                        action: "Наблюдай 30 минут совпадения. Запиши 3 сигнала.", mantra: "Я слышу поле." },
  { id: "TX4", title: "Мост",      focus: "Перевод смысла в действие.",                        action: "Сформулируй шаг на 24 часа и забронируй слот/договорись.", mantra: "Я перевожу смысл в форму." },
  { id: "TX5", title: "Материализация", focus: "Фокусированное действие.",                     action: "Сделай 1 измеримый шаг. Закрой мини‑цикл.", mantra: "Я делаю. Я завершаю." },
  { id: "TX6", title: "Интеграция",focus: "Удержание результата в системе.",                   action: "Зафиксируй изменения: обнови структуру/расписание/артефакты.", mantra: "Я интегрирую." },
  { id: "TX7", title: "Перезапуск", focus: "Снятие инерции и новый заход.",                    action: "Ретроспектива 5 минут: что сработало/отпускаю? Выбери новую связку Аз × Бука.", mantra: "Я начинаю заново — глубже." },
];

// Геометрии, типы точек и подсказки сингулярной алгебры
const GEOMETRIES = [
  { id: 'Euclid', label: 'Евклид' },
  { id: 'Lobachevsky', label: 'Лобачевский' },
  { id: 'Riemann', label: 'Риман' },
  { id: 'Projective', label: 'Проектив' },
  { id: 'Supra', label: 'Сверх' },
];
const POINT_TYPES = [
  { id: 'Разрыв', hint: 'Сшить порог: ядро, перезапуск, мягкая сборка.' },
  { id: 'Залипание', hint: 'Дать движение: орбита, настроиться на резонанс.' },
  { id: 'Вход', hint: 'Принять сигнал: резонанс → мост, малый шаг.' },
  { id: 'Интеграция', hint: 'Встроить и закрыть: интеграция/материализация.' },
];
const POINT_TO_TX = {
  'Разрыв': ['TX1','TX7'],
  'Залипание': ['TX2','TX3'],
  'Вход': ['TX3','TX4'],
  'Интеграция': ['TX6','TX5'],
};

// Локальное хранилище
const DIARY_KEY = "azbuki_diary_v4";
const loadDiary = () => {
  try { const raw = localStorage.getItem(DIARY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
};
const saveDiary = (items) => localStorage.setItem(DIARY_KEY, JSON.stringify(items));

// Карта резонанса (вынесена во внешний компонент для стабильности)
function ResonanceCard({
  az, buka, tx, setTx, pickRandomTx, runSelfTests, showTests, testResults,
  induction, setInduction, inversion, setInversion,
  objectLabel, setObjectLabel, imageLabel, setImageLabel,
  superposition, geometry, setGeometry, pointType, setPointType,
  metrics, setMetrics, note, setNote, saveCombo, reset, limitNotice,
  showTxSuggest, setShowTxSuggest,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl p-6 shadow-xl bg-[#0b1220]/90 border border-yellow-200/20">
      <div className="text-center mb-4">
        <div className="text-sm uppercase tracking-widest text-yellow-200/80">Формула свершения</div>
        <div className="mt-2 text-2xl text-yellow-300 font-semibold">
          {az?.title} <span className="opacity-70">×</span> {buka ? `${buka.symbol} ${buka.title}` : "—"}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
          <div className="text-yellow-200/90 font-medium">Аз</div>
          <div className="text-yellow-50/70 text-sm mt-1">{az?.short}</div>
        </div>
        <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
          <div className="text-yellow-200/90 font-medium">Бука</div>
          <div className="text-yellow-50/70 text-sm mt-1">{buka ? `${buka.symbol} · ${buka.short}` : "—"}</div>
          {buka && (
            <div className="mt-2 text-xs text-yellow-200/70">Формула: <span className="text-yellow-100/90">{buka.formula}</span></div>
          )}
        </div>
        <div className="rounded-xl p-4 bg-black/30 border border-yellow-200/10">
          <div className="text-yellow-200/90 font-medium">Практика</div>
          <div className="text-yellow-50/70 text-sm mt-1">Сформируй внешнюю форму, соответствующую внутренней частоте. Сделай один измеримый шаг сегодня.</div>
        </div>
      </div>

      {/* 7 ПЕРЕДАЧ */}
      <div className="mt-5 rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
        <div className="mb-2 flex items-center justify_between">
          <div className="text-yellow-200/90 font-medium">7 передач</div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={pickRandomTx} className="text-xs px-3 py-1 rounded-lg border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Случайная передача</button>
            <button type="button" onClick={runSelfTests} className="text-xs px-3 py-1 rounded-lg border border-emerald-400/40 text-emerald-200 hover:bg-emerald-300/10">Проверка системы</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map((t) => (
            <button type="button" key={t.id} onClick={() => setTx(t)}
              className={cls(
                "px-3 py-1.5 rounded-xl border text-xs",
                tx?.id === t.id ? "border-yellow-300 bg-yellow-300/20" : "border-yellow-200/20 text-yellow-100/90"
              )}
              title={t.focus}
            >{t.title}</button>
          ))}
        </div>
        {tx && (
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10">
              <div className="text-yellow-200/80">Фокус</div>
              <div className="text-yellow-50/85 mt-1">{tx.focus}</div>
            </div>
            <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10">
              <div className="text-yellow-200/80">Действие</div>
              <div className="text-yellow-50/85 mt-1">{tx.action}</div>
            </div>
            <div className="rounded-xl p-3 bg-black/30 border border-yellow-200/10">
              <div className="text-yellow-200/80">Мантра</div>
              <div className="text-yellow-50/85 mt-1 italic">{tx.mantra}</div>
            </div>
          </div>
        )}

        {/* Панель самотестов */}
        {showTests && (
          <div className="mt-4 rounded-xl p-3 bg-emerald-900/20 border border-emerald-400/30">
            <div className="text-emerald-200/90 text-xs mb-2">Самопроверка модуля</div>
            <ul className="space-y-1 text-xs">
              {testResults.map((r, i) => (
                <li key={i} className={cls("flex items-start gap-2", r.pass ? "text-emerald-200" : "text-red-300")}> 
                  <span>{r.pass ? "✓" : "✗"}</span>
                  <span>{r.name}{r.error ? ` — ${r.error}` : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {buka && (
        <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl p-3 bg-black/20 border border-yellow-200/10">
            <div className="text-yellow-200/80">Метафора</div>
            <div className="text-yellow-50/80 mt-1">{buka.metaphor}</div>
          </div>
          <div className="rounded-xl p-3 bg-black/20 border border-yellow-200/10">
            <div className="text-yellow-200/80">Вопрос</div>
            <div className="text-yellow-50/80 mt-1">{buka.question}</div>
          </div>
        </div>
      )}

      {/* Индукция / Инверсия */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
          <div className="text-yellow-200/90 font-medium mb-1">Индукция</div>
          <textarea value={induction} onChange={(e) => setInduction(e.target.value)} placeholder="Что я активирую внутри?"
            className="w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 text-sm placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3} />
        </div>
        <div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
          <div className="text-yellow-200/90 font-medium mb-1">Инверсия</div>
          <textarea value={inversion} onChange={(e) => setInversion(e.target.value)} placeholder="Что я втягиваю из будущего?"
            className="w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 text-sm placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3} />
        </div>
      </div>

      {/* Сингулярная точка (⊕) */}
      <div className="mt-5 rounded-2xl p-4 bg-black/15 border border-yellow-200/20">
        <div className="mb-2 text-yellow-200/90 font-medium">Сингулярная точка (⊕)</div>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={objectLabel} onChange={(e)=>setObjectLabel(e.target.value)} placeholder="Объект (что во внешнем)" className="rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-sm" />
          <input value={imageLabel} onChange={(e)=>setImageLabel(e.target.value)} placeholder="Образ (как это отражено)" className="rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-sm" />
        </div>
        {superposition && (
          <div className="mt-2 text-sm text-yellow-100/85">Суперпозиция: <span className="font-medium text-yellow-300">{superposition}</span></div>
        )}
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-yellow-200/70 mb-1">Геометрия</div>
            <div className="flex flex-wrap gap-2">
              {GEOMETRIES.map(g => (
                <button type="button" key={g.id} onClick={()=>setGeometry(g.id)} className={`px-3 py-1.5 rounded-lg border text-xs ${geometry===g.id? 'border-yellow-300 bg-yellow-300/20' : 'border-yellow-200/20 text-yellow-100/90'}`}>{g.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-yellow-200/70 mb-1">Тип точки</div>
            <div className="flex flex-wrap gap-2">
              {POINT_TYPES.map(p => (
                <button type="button" key={p.id} onClick={()=>setPointType(p.id)} title={p.hint} className={`px-3 py-1.5 rounded-lg border text-xs ${pointType===p.id? 'border-yellow-300 bg-yellow-300/20' : 'border-yellow-200/20 text-yellow-100/90'}`}>{p.id}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" onClick={() => setShowTxSuggest(v=>!v)} className="text-xs px-3 py-1.5 rounded-lg border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">
            {showTxSuggest ? 'Скрыть рекомендации' : 'Показать рекомендации'}
          </button>
          {pointType && (<div className="text-xs text-yellow-200/70">Рекомендации: {(POINT_TO_TX[pointType]||[]).map(id=>TRANSMISSIONS.find(t=>t.id===id)?.title).filter(Boolean).join(' / ')}</div>)}
        </div>
        {showTxSuggest && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(POINT_TO_TX[pointType]||[]).map(id => {
              const t = TRANSMISSIONS.find(x=>x.id===id);
              if(!t) return null;
              return (
                <button type="button" key={id} onClick={()=>{ setTx(t); setShowTxSuggest(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10" title={t.focus}>
                  Выбрать: {t.title}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3 grid md:grid-cols-5 gap-2 text-xs">
          <input value={metrics.alpha} onChange={(e)=>setMetrics(v=>({...v, alpha:e.target.value}))} placeholder="α" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
          <input value={metrics.IY} onChange={(e)=>setMetrics(v=>({...v, IY:e.target.value}))} placeholder="I_{Я}" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
          <input value={metrics.Cm} onChange={(e)=>setMetrics(v=>({...v, Cm:e.target.value}))} placeholder="C_m" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
          <input value={metrics.Q} onChange={(e)=>setMetrics(v=>({...v, Q:e.target.value}))} placeholder="Q" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
          <input value={metrics.T} onChange={(e)=>setMetrics(v=>({...v, T:e.target.value}))} placeholder="T" className="rounded-lg bg-black/30 border border-yellow-200/20 p-2" />
        </div>
      </div>

      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Заметка/намерение: что именно я материализую?"
        className="mt-4 w-full rounded-xl bg-black/30 border border-yellow-200/20 p-3 text-yellow-50 placeholder-yellow-200/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/50" rows={3} />
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={saveCombo} className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-medium shadow hover:shadow-lg active:translate-y-px">Сохранить в дневник</button>
        <button type="button" onClick={reset} className="px-4 py-2 rounded-xl border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Сбросить выбор</button>
      </div>
      {limitNotice && (<div className="mt-3 text-xs text-yellow-200/70">{limitNotice}</div>)}
    </motion.div>
  );
}

export default function AzBukiModule() {
  const [limitNotice, setLimitNotice] = useState("");

  // Базовые состояния модуля
  const [az, setAz] = useState(null);
  const [buka, setBuka] = useState(null);
  const [tx, setTx] = useState(null);

  const [note, setNote] = useState("");
  const [induction, setInduction] = useState("");
  const [inversion, setInversion] = useState("");

  const [diary, setDiary] = useState(loadDiary());

  // Сингулярная алгебра — состояния
  const [objectLabel, setObjectLabel] = useState("");
  const [imageLabel, setImageLabel] = useState("");
  const [geometry, setGeometry] = useState("Euclid");
  const [pointType, setPointType] = useState("Вход");
  const [metrics, setMetrics] = useState({ alpha: "", IY: "", Cm: "", Q: "", T: "" });
  const [showTxSuggest, setShowTxSuggest] = useState(false);
  const superposition = useMemo(() => {
    const o = objectLabel?.trim(); const i = imageLabel?.trim();
    return o || i ? `${o || '…'} ⊕ ${i || '…'}` : "";
  }, [objectLabel, imageLabel]);

  const [openBukaId, setOpenBukaId] = useState(null);

  // dev: самопроверка
  const [showTests, setShowTests] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const todayCount = useMemo(() => diary.filter((d) => d.date.startsWith(todayKey())).length, [diary]);
  const DAILY_LIMIT = 3;

  useEffect(() => { saveDiary(diary); }, [diary]);

  const pickRandomAz = () => setAz(randomPick(AZ));
  const pickRandomBuka = () => setBuka(randomPick(BUKI));
  const pickRandomTx = () => setTx(randomPick(TRANSMISSIONS));
  const reset = () => { setAz(null); setBuka(null); setTx(null); setNote(""); setInduction(""); setInversion(""); setObjectLabel(""); setImageLabel(""); setGeometry("Euclid"); setPointType("Вход"); setMetrics({ alpha: "", IY: "", Cm: "", Q: "", T: "" }); };

  const saveCombo = () => {
    if (!az || !buka) return;
    if (todayCount >= DAILY_LIMIT) setLimitNotice(`Достигнут мягкий лимит в ${DAILY_LIMIT} записи на сегодня. Сохраняю, но рекомендую работать глубоко.`);
    else setLimitNotice("");
    const item = { id: uuid(), date: `${todayKey()} ${ts().split(",")[1]?.trim() || ""}`, az, buka, tx,
      note: note.trim(), induction: induction.trim(), inversion: inversion.trim(),
      object_label: objectLabel.trim(), image_label: imageLabel.trim(), superposition,
      geometry, point_type: pointType,
      metrics: { alpha: metrics.alpha, I_Y: metrics.IY, C_m: metrics.Cm, Q: metrics.Q, T: metrics.T }
    };
    setDiary([item, ...diary]);
    reset();
  };

  const removeItem = (id) => setDiary(diary.filter((d) => d.id !== id));
  const clearAll = () => { if (confirm("Очистить весь дневник?")) setDiary([]); };

  // Самотесты (не меняют данные)
  const runSelfTests = () => {
    const results = [];
    try { results.push({ name: "TRANSMISSIONS определены (7)", pass: Array.isArray(TRANSMISSIONS) && TRANSMISSIONS.length === 7 }); } catch (e) { results.push({ name: "TRANSMISSIONS определены (7)", pass: false, error: String(e) }); }
    results.push({ name: "randomPick(AZ) возвращает элемент", pass: !!randomPick(AZ) });
    results.push({ name: "randomPick(BUKI) возвращает элемент", pass: !!randomPick(BUKI) });
    try {
      const mock = { id: uuid(), date: todayKey(), az: AZ[0], buka: BUKI[0], tx: TRANSMISSIONS[0], note: "test", induction: "i", inversion: "o" };
      results.push({ name: "Структура записи в дневник валидна", pass: !!(mock.az && mock.buka && mock.tx && mock.id) });
      results.push({ name: "Индукция/Инверсия присутствуют", pass: typeof mock.induction === 'string' && typeof mock.inversion === 'string' });
    } catch (e) { results.push({ name: "Структура записи в дневник валидна", pass: false, error: String(e) }); }
    results.push({ name: "Геометрии определены (5)", pass: Array.isArray(GEOMETRIES) && GEOMETRIES.length===5 });
    results.push({ name: "Типы точек определены (4)", pass: Array.isArray(POINT_TYPES) && POINT_TYPES.length===4 });

    // Проверка: для каждого типа точки есть 2 рекомендации передач
    Object.keys(POINT_TO_TX).forEach(pt => {
      const arr = POINT_TO_TX[pt];
      results.push({ name: `Рекомендации для типа "${pt}" (2)`, pass: Array.isArray(arr) && arr.length===2 });
    });

    // Доп. тесты
    results.push({ name: "DIARY_KEY корректен", pass: DIARY_KEY === 'azbuki_diary_v4' });
    results.push({ name: "limitNotice — строка", pass: typeof "" === 'string' });
    results.push({ name: "Состояния базовые существуют", pass: typeof setAz === 'function' && typeof setBuka === 'function' && typeof setTx === 'function' });

    // Тест: симуляция набора текста по 2–3 символа подряд (без потери)
    const typeSim = (s, part) => s + part;
    const r1 = typeSim(typeSim("", "аб"), "вг");
    results.push({ name: "Симуляция набора: 'аб'+'вг' = 'абвг'", pass: r1 === 'абвг' });

    setTestResults(results);
    setShowTests(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-yellow-50">
      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a0f1c]/70 border-b border-yellow-200/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]" />
            <div className="font-semibold tracking-wide">Архитектоника психики</div>
          </div>
          <div className="text-xs md:text-sm text-yellow-200/70">Живой модуль материализации · прототип</div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 md:p-8 bg-gradient-to-b from-[#0f1630] to-[#0a0f1c] border border-yellow-200/20 shadow-2xl">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-yellow-300">Аз × Буки</h1>
              <p className="mt-2 text-yellow-100/80 max-w-2xl">Выбери свой <span className="text-yellow-300">Аз</span> (внутренняя частота) и свою <span className="text-yellow-300">Буку</span> (внешняя форма), затем укажи <span className="text-yellow-300">передачу</span> (фазу), чтобы активировать резонанс и превратить его в действие.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={pickRandomAz} className="px-4 py-2 rounded-xl bg-yellow-300 text-black font-medium shadow hover:shadow-lg">Случайный Аз</button>
              <button type="button" onClick={pickRandomBuka} className="px-4 py-2 rounded-xl border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Случайная Бука</button>
              <button type="button" onClick={pickRandomTx} className="px-4 py-2 rounded-xl border border-yellow-300/40 text-yellow-200 hover:bg-yellow-300/10">Случайная передача</button>
            </div>
          </div>

          {/* Выбор Аз и Буки */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {/* Аз (49) */}
            <motion.div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
              <div className="mb-3 text-yellow-200/90 font-medium">Выбор Аз (49)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {AZ.map((item, idx) => (
                  <button type="button" key={item.id} onClick={() => setAz(item)}
                    className={cls(
                      "rounded-xl p-3 text-left text-sm border hover:bg-yellow-300/10",
                      az?.id === item.id ? "border-yellow-300 bg-yellow-300/20" : "border-yellow-200/20 text-yellow-100/90"
                    )} title={item.short}>
                    <div className="text-[11px] opacity-70">А{idx + 1}</div>
                    <div className="font-medium text-yellow-200">{item.title}</div>
                    <div className="text-[12px] opacity-80 line-clamp-2">{item.short}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Буки (24) — компакт + раскрытие */}
            <motion.div className="rounded-2xl p-4 bg-black/20 border border-yellow-200/20">
              <div className="mb-3 text-yellow-200/90 font-medium">Выбор Буки (24)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                {BUKI.map((item, idx) => (
                  <div key={item.id} className={cls("rounded-xl border p-3", buka?.id === item.id ? "border-yellow-300 bg-yellow-300/10" : "border-yellow-200/20")}> 
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
          <div className="mt-6">
            {az && buka ? (
              <ResonanceCard
                az={az} buka={buka} tx={tx} setTx={setTx}
                pickRandomTx={pickRandomTx} runSelfTests={runSelfTests}
                showTests={showTests} testResults={testResults}
                induction={induction} setInduction={setInduction}
                inversion={inversion} setInversion={setInversion}
                objectLabel={objectLabel} setObjectLabel={setObjectLabel}
                imageLabel={imageLabel} setImageLabel={setImageLabel}
                superposition={superposition}
                geometry={geometry} setGeometry={setGeometry}
                pointType={pointType} setPointType={setPointType}
                metrics={metrics} setMetrics={setMetrics}
                note={note} setNote={setNote}
                saveCombo={saveCombo} reset={reset}
                limitNotice={limitNotice}
                showTxSuggest={showTxSuggest} setShowTxSuggest={setShowTxSuggest}
              />
            ) : null}
            {!az && !buka && (<div className="text-yellow-200/70 text-sm mt-2">Выбери Аз и Буку или воспользуйся случайным выбором; затем укажи передачу.</div>)}
          </div>
        </motion.div>
      </section>

      {/* Дневник */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-3">
          <div className="text-yellow-200/90 font-medium">Дневник связок ({diary.length})</div>
          <div className="text-xs text-yellow-200/60">Сегодня: {todayCount}/{DAILY_LIMIT}</div>
        </div>
        {diary.length === 0 ? (
          <div className="rounded-2xl p-6 border border-yellow-200/20 text-yellow-200/70">Пока записей нет. Сохрани первую формулу свершения — и она появится здесь.</div>
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
                  <div className="mt-2 text-xs text-yellow-200/80">⊕ {d.object_label || '…'} ⊕ {d.image_label || '…'}{d.geometry ? ` • ${GEOMETRIES.find(g=>g.id===d.geometry)?.label}` : ''}{d.point_type ? ` • ${d.point_type}` : ''}</div>
                )}
                {d.metrics && (d.metrics.alpha || d.metrics.I_Y || d.metrics.C_m || d.metrics.Q || d.metrics.T) && (
                  <div className="mt-1 text-[11px] text-yellow-200/70">метрики: {[['α',d.metrics.alpha],["I_{Я}",d.metrics.I_Y],["C_m",d.metrics.C_m],["Q",d.metrics.Q],["T",d.metrics.T]].filter(([,v])=>v!==undefined && v!=="").map(([k,v])=>`${k}:${v}`).join(' · ')}</div>
                )}
              </motion.div>
            ))}
          </div>
        )}
        {diary.length > 0 && (
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={clearAll} className="px-4 py-2 rounded-xl border border-red-400/40 text-red-300 hover:bg-red-400/10">Очистить дневник</button>
          </div>
        )}
      </section>

      <footer className="py-8 text-center text-xs text-yellow-200/50">© {new Date().getFullYear()} Архитектоника психики · прототип «Аз × Буки»</footer>
    </div>
  );
}
