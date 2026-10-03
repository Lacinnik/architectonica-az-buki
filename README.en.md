# Architectonica · Az × Buki

*English summary. The full documentation is in Russian: [README.md](README.md).*

The source repository of the Architectonics ecosystem: the author's text corpus (manifestos, books, atlases, lectures) and the original JavaScript cores that the other projects build on.

## Core idea

- **Az** — the inner frequency;
- **Buka** — the outer wave;
- **⊕** — the point of resonance;
- **7 Transmissions** — the path from impulse to action.

## Layout

Texts live in [`docs/`](docs/README.md) (readable Markdown copies in [`md/`](md/README.md)), early interfaces in [`prototypes/`](prototypes/README.md), images in [`assets/`](assets/README.md), packed material in [`archive/`](archive/README.md). The tested cores stay in the repository root.

## Code

| File | What it is |
|---|---|
| `subject_core.js` | Subject Core runtime 1.0.1 — keeps the author of an action, the intention and responsibility for the transition ([passports](SUBJECT_CORE_PASSPORTS.md)) |
| `subject-core/` | browser interface for Subject Core |
| `meta_core_v2.js`, `governance_core_v1.js`, `negative_core_v1.js`, `skela_full_activation.js` | Meta Core and its supporting cores |
| `gdeya_demons_v1.js`, `gdeya_demons_v1_angelic.js` | GDEYA demons / guardians prototypes |
| `tzar_language_001.js` | TZAR-LANGUAGE-001 — a deterministic symbolic compiler, not a trained neural language model |

These cores are copied byte-for-byte into [Game-GDEYA](https://github.com/Lacinnik/Game-GDEYA), which pins them by commit and checks for drift. Machine-readable statuses: [`ecosystem.status.json`](ecosystem.status.json).

```bash
npm test     # runtime tests (Node.js 20+)
npm run check
```

## Ecosystem

The single entry point to all products is [Platform 2.0](https://lacinnik.github.io/Game-GDEYA/platform/). Related repositories: [-tensor-architectonics](https://github.com/Lacinnik/-tensor-architectonics) (TzAr scientific canon), [reason-](https://github.com/Lacinnik/reason-) (REZON lab), [Game-GDEYA](https://github.com/Lacinnik/Game-GDEYA) (game and platform).

## License

[MIT](LICENSE), unless a file states otherwise.
