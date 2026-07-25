# Subject Core · послерелизная приёмка

Дата проверки: 25 июля 2026 года  
Репозиторий: `Lacinnik/architectonica-az-buki`  
Проверенный baseline: `f55de9525a9ca6e1686783f06aae6f87dcce803f`  
Опубликованный экземпляр: <https://subject-core-gdeya.alexander-la-6500.chatgpt.site>

## Границы проверки

Проверены четыре релизных изменения:

| Commit | Сообщение |
|---|---|
| `042dbca` | `Publish stable Subject Core application` |
| `e993aff` | `Update Subject Core plate controls` |
| `59b90d8` | `Integrate TZAR Conductance into Subject Core` |
| `f55de95` | `Add TZAR semantic worker to Subject Core` |

У baseline-коммита `f55de9525a9ca6e1686783f06aae6f87dcce803f` на момент проверки:

- combined commit statuses: пустой список;
- workflow runs: пустой список;
- GitHub Pages по адресу `https://lacinnik.github.io/architectonica-az-buki/subject-core/`: `404`;
- рабочая публикация обнаружена в Sites по адресу выше.

Статический `subject-core` воспроизводит внешний экспорт Sites-исходников: до исправлений контрольные суммы `index.html`, `assets/app.js`, `assets/app.css` и semantic worker совпали с результатом внешней Vite-сборки соответствующей Sites-версии.

## Объективные дефекты baseline

| ID | Дефект | Воспроизведение | Риск | Исправление кандидата |
|---|---|---|---|---|
| D1 | Косинус идентичных векторов мог стать `1.0000000000000002`; валидация отклоняла его как выход за диапазон, исключение в `worker.onmessage` оставалось необработанным, интерфейс навсегда сохранял состояние выполнения | Настольный Chromium, реальный pinned worker, одинаковые фразы | Расчёт завершён в worker, но результат потерян; повторный запуск заблокирован | Clamp к `[-1, 1]`, обработка результата `try/catch`, гарантированный cleanup и резервный контур; предел ожидания 120 секунд |
| D2 | Дневник жил только в React state | Сохранить запись и перезагрузить страницу | Потеря всех записей при reload | Версионированное `localStorage` (`gdeya.subject-core.diary.v1`), максимум 500 записей, безопасная деградация и явный статус |
| D3 | Manifest и Service Worker отсутствовали (`404`) | Запросы `/manifest.webmanifest`, `/service-worker.js`, `/sw.js` | Приложение не открывалось повторно офлайн | Manifest и same-origin app-shell Service Worker; навигационный fallback; старые cache-версии удаляются |
| D4 | Публикация не отдавала CSP, а формулировка «исполняется локально» не объясняла обязательную первую CDN-загрузку | Проверка response headers и UI | Ложное впечатление cold-offline готовности; неограниченный источник исполнения | Ограниченный CSP, security headers в Sites-кандидате, маркировка `online-first`, объём первой загрузки и отдельное описание offline fallback |

Изменения не меняют смысловые пороги, карточки, формулы, модель, ревизию модели или авторскую классификацию.

## Модель, CDN, CORS и реальная offline-граница

Закреплены:

- runtime: `@huggingface/transformers@4.0.1`;
- model: `Xenova/paraphrase-multilingual-MiniLM-L12-v2`;
- revision: `2c4055b12046f11709e9df2c122e59ffbdc2f900`;
- dtype: `q8`.

Cold load включает примерно 0,56 МБ runtime, 17,08 МБ `tokenizer.json` и 118,31 МБ `onnx/model_quantized.onnx`, то есть около 136 МБ до накладных файлов и HTTP. jsDelivr возвращает `Access-Control-Allow-Origin: *`; pinned Hugging Face revision существует, а конечные CDN-ответы модели также разрешают CORS.

Вывод: вычисление после загрузки действительно выполняется в браузере, но первая загрузка модели требует сеть. Наличие модели в обычном HTTP-кэше после удачного запуска зависит от браузера и вытеснения кэша и не является контрактом offline-доступности.

Service Worker кандидата намеренно:

- кэширует только HTML, same-origin JS/CSS, manifest и favicon;
- не перехватывает и не кэширует jsDelivr/Hugging Face;
- офлайн запускает оболочку и точный структурный fallback;
- никогда не показывает вымышленный модельный коэффициент.

Поэтому CDN-зависимость больше не маскируется под гарантированную offline-работу.

## Точный протокол

| ID | Сценарий | Действия | Ожидаемый результат | Покрытие |
|---|---|---|---|---|
| A01 | Ручной выбор | Нажать каждую из плит; отдельно выбрать `ОТНОШЕНИЯ` | Ровно одна плита имеет `aria-pressed=true`, появляется `Карта 1 / 6` | Chromium + iPhone WebKit |
| A02 | Случайный выбор | Нажать `Случайная плита` | Выбрана ровно одна из четырёх плит, собрано шесть карт | Chromium + iPhone WebKit |
| A03 | Все блоки | Открыть `Цикл карт`, `Аз × Буки`, `Тактика`, `Источник I₁–I₁₂`, `Метрики`, `Творец`, `M⁷–M¹²` | Каждый раздел рендерит свой заголовок без ошибки | Chromium + iPhone WebKit |
| A04 | Пустой ввод | После выбора плиты оставить source или variant пустым/из пробелов | `Провести через ТзАр` отключена | Chromium + iPhone WebKit |
| A05 | Реальная модель | Запустить разные фразы, затем одинаковые фразы | Реальный pinned worker возвращает результат; одинаковые фразы дают `1.000`; UI разблокирован | Ручной Chromium |
| A06 | Граничное число | Подать worker-векторы, чей raw cosine равен `1.0000000000000002` | Отображается `1.000`, исключения и зависания нет | Chromium + iPhone WebKit, deterministic worker |
| A07 | Медленная загрузка/stop | Worker сообщает 1% и задерживает ответ | Поля и Run заблокированы, видна Stop; Stop завершает состояние; повторный запуск доступен | Chromium + iPhone WebKit |
| A08 | Сетевой отказ | Оборвать jsDelivr и отдельно вернуть worker error | Структурный fallback, модельный коэффициент отсутствует, причина видна, повторный запуск доступен | Реальный CDN-abort: Chromium; worker error: Chromium + iPhone WebKit |
| A09 | Timeout | Не возвращать результат 120 секунд | Worker завершается; включается структурный fallback | Контракт bundle + ручная проверка состояния до Stop |
| A10 | Локальное хранение | Собрать полную запись, сохранить, перезагрузить | `Дневник (1)` и запись сохраняются; JSON имеет `version: 1` | Chromium + iPhone WebKit; отдельно ручной reload |
| A11 | Storage denial | Запретить Storage API | Приложение продолжает работать и предлагает экспорт JSON | Chromium + iPhone WebKit |
| A12 | Service Worker | Дождаться `navigator.serviceWorker.ready`, перезагрузить под controller | Есть cache `subject-core-shell-v1`; app shell открывается | Chromium + iPhone WebKit |
| A13 | Offline | После controlled reload отключить сеть и перезагрузить | UI открывается; виден offline-статус; Conductance использует fallback без коэффициента | Chromium + iPhone WebKit |
| A14 | CDN не в offline cache | Проверить Cache Storage после install | URL jsDelivr отсутствует; модель не заявляется доступной офлайн | Chromium + iPhone WebKit |
| A15 | CSP/CORS | Проверить meta/header policy и реальные CDN preflight/GET | Разрешены только необходимые runtime/model endpoints; default/object ограничены | Статический контракт + ручные HTTP-проверки |
| A16 | iPhone layout | Открыть как iPhone 13 WebKit, пройти A01–A14 | Нет горизонтального переполнения документа, элементы доступны и кликабельны | GitHub Actions WebKit |

## Результат ручной проверки кандидата

- Настольный Chromium: все семь разделов, ручной и случайный выбор — пройдены.
- Реальный semantic worker и закреплённая multilingual-модель: загрузка и inference — пройдены.
- Разные формулировки: коэффициент `0.661`, состояние корректно завершилось.
- Идентичные формулировки: коэффициент `1.000`, исключения нет, повторный запуск доступен.
- Дневник: запись сохранилась после полной перезагрузки; отчёт восстановил плиту, фазу, Аз, Буку, Передачу и состояния.
- Baseline production не изменён. Исправления существуют только в отдельной ветке до подтверждения владельца.

WebKit запускается в GitHub Actions с профилем Playwright `iPhone 13`. Это движковая и viewport/touch-эмуляция Safari, а не физический iPhone; физическое устройство остаётся финальным необязательным smoke-check перед merge/deploy.

## Автоматические gates

Workflow `Subject Core release checks` добавляет два обязательных наблюдаемых результата в PR:

1. `Release contracts` — существующие runtime-тесты, CSP/manifest/SW, pinning модели, online-first disclosure.
2. `Chromium desktop and iPhone WebKit` — сквозная матрица A01–A14/A16.

Ни merge, ни production deploy этим PR не выполняются.
