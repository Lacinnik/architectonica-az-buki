# Architectonica Runtime 1.0

Исполнимое основание двух вертикалей платформы.

## Субъектный контур ГДЕЯ

`Subject Core → Скелла → Negative/Governance → Meta Core → Love/Measure`

- `subject_core.js` удерживает намерение, инвариант и журнал переходов;
- `skela_full_activation.js` предоставляет UI-независимую точку входа Скеллы;
- `negative_core_v1.js` реализует fail-closed остановку;
- `governance_core_v1.js` проверяет контекст, владельца и явное разрешение;
- `meta_core_v2.js` оркестрирует допуск и возвращает свидетельство попытки;
- `gdeya_demons_v1.js` и ангельский вариант исполняют ворота Любви и Меры.

## Коллективный контур РЕЗОН

`Collective Meta Core → trust gate → metrics gate → synthesis`

`collective_meta_core.ts` различает отказ доверия и отказ проводимости и требует не менее двух субъектов.

## Проверка

```bash
npm run check
```

Статус runtime означает техническую исполнимость контрактов. Канонический статус смысловых правил присваивается автором Архитектоники.
