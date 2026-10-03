# architectonica-az-buki · корпус и исходные ядра

Первоисточник экосистемы: тексты автора (`docs/`: `.docx`, `.txt`, `.pdf`) и JS-ядра в корне (`subject_core.js`, `meta_core_v2.js`, `governance_core_v1.js`, `negative_core_v1.js`, `skela_full_activation.js`, `gdeya_demons_v1*.js`, `tzar_language_001.js`, `collective_meta_core.ts`). `subject-core/` — браузерный интерфейс Subject Core, публикуется workflow `subject-core-pages.yml`. Ранние интерфейсы — `prototypes/`, изображения — `assets/`, архивы — `archive/`.

## Перед отправкой

```bash
npm run check                    # синтаксис ядер + тесты
npm run test:subject-core:browser  # при изменениях subject-core/ (Playwright)
```

## Ловушки

- **Не переносить и не переименовывать ядра в корне**: `Game-GDEYA` копирует их по этим путям (`vendor.lock.json`). После изменения ядра в `Game-GDEYA` нужно выполнить `npm run vendor:update`.
- **Новые тексты класть в `docs/`, прототипы — в `prototypes/`.** Корень — только для проверяемого кода и описаний.
- **Тексты автора не удалять и не переписывать.** Markdown-копии в `md/` генерируются: после изменения `.docx` в `docs/` — `pip install mammoth && python3 tools/docx_to_md.py`. Источник истины — `.docx`.
- **Subject Core**: формат дневника `gdeya.subject-core.diary.v1`; при изменении `subject-core/` сменить `CACHE_NAME` в `subject-core/sw.js`. Паспорта контрактов — `SUBJECT_CORE_PASSPORTS.md`.
- Workflow `runtime-checks.yml` запускается только при изменении `*.js`, `*.ts`, тестов и `package.json`.

## Экосистема

Четыре репозитория одного автора (Lacinnik): `architectonica-az-buki` (корпус и исходные ядра), `-tensor-architectonics` (научный канон ТзАр), `reason-` (лаборатория РЕЗОН), `Game-GDEYA` (игра и Platform 2.0 — единая точка входа). Все сайты — статические GitHub Pages, всё работает локально в браузере.

## Правила содержания

- Статусы (`canonical`, `stable`, `candidate`, `not-accepted`…) присваивает только автор. Не повышать статус по итогам CI или собственной проверки; в `ecosystem.status.json` у каждого статуса поле `source` указывает документ автора, а неуказанный статус — `unstated`.
- `Q` остаётся `null`, пока отклик не наблюдён; игровой балл — `Qsim`. Не выдавать симуляцию за наблюдение или диагностику.
- TZAR-LANGUAGE-001 — детерминированный символический компилятор, не обученная нейросеть. Не писать иного.
- Термины корпуса брать из канонических документов (`-tensor-architectonics/GLOSSARY.md`), не пересказывать своими определениями.
- Тексты и интерфейс — на русском; английский — только `README.en.md`.
- Ссылки в Markdown проверяет workflow `links.yml` (lychee): в PR — внутренние, еженедельно — внешние.
