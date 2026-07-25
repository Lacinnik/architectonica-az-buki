import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices, webkit } from "playwright";

const releaseRoot = fileURLToPath(new URL("../../subject-core/", import.meta.url));
const diaryKey = "gdeya.subject-core.diary.v1";
const semanticVector = [
  -0.524763370398432,
  0.28276326321065426,
  0.11673370189964771,
];

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function serveRelease() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const relativePath = decodeURIComponent(requestUrl.pathname === "/" ? "index.html" : requestUrl.pathname.slice(1));
      const absolutePath = resolve(releaseRoot, relativePath);
      if (!absolutePath.startsWith(`${resolve(releaseRoot)}${sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const info = await stat(absolutePath);
      if (!info.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes[extname(absolutePath)] ?? "application/octet-stream",
      });
      response.end(await readFile(absolutePath));
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });

  return new Promise((resolveServer, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolveServer({
        baseUrl: `http://127.0.0.1:${address.port}/`,
        close: () => new Promise((resolveClose, rejectClose) => {
          server.close((error) => error ? rejectClose(error) : resolveClose());
        }),
      });
    });
  });
}

async function installDeterministicWorker(context) {
  await context.addInitScript(({ vector }) => {
    window.__semanticWorkerMode = "boundary";
    window.__setSemanticWorkerMode = (mode) => {
      window.__semanticWorkerMode = mode;
    };

    class DeterministicWorker {
      constructor() {
        this.onmessage = null;
        this.onerror = null;
        this.timers = new Set();
      }

      emit(data, delay) {
        const timer = setTimeout(() => {
          this.timers.delete(timer);
          this.onmessage?.({ data });
        }, delay);
        this.timers.add(timer);
      }

      postMessage() {
        const mode = window.__semanticWorkerMode;
        if (mode === "error") {
          this.emit({ type: "error", message: "simulated CDN failure" }, 25);
          return;
        }
        if (mode === "slow") {
          this.emit({ type: "progress", message: "Загрузка модели · 1%" }, 25);
          this.emit({ type: "result", vectors: [vector, vector], chunkCounts: [1, 1] }, 10_000);
          return;
        }
        this.emit({ type: "result", vectors: [vector, vector], chunkCounts: [1, 1] }, 25);
      }

      terminate() {
        for (const timer of this.timers) clearTimeout(timer);
        this.timers.clear();
      }
    }

    Object.defineProperty(window, "Worker", {
      configurable: true,
      value: DeterministicWorker,
      writable: true,
    });
  }, { vector: semanticVector });
}

async function choosePlate(page, name = "РЕСУРС") {
  await page.getByRole("button", { name, exact: true }).click();
  await page.getByText("Карта 1 / 6", { exact: true }).waitFor();
}

async function fillConductance(page, source, variant) {
  await page.getByRole("textbox", { name: "Исходный инвариант", exact: true }).fill(source);
  await page.getByRole("textbox", { name: "Проявленная формулировка", exact: true }).fill(variant);
}

async function exerciseNavigationAndSelection(page, isMobile) {
  await page.goto(page.url(), { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Случайная плита", exact: true }).click();
  await page.getByText("Карта 1 / 6", { exact: true }).waitFor();

  const plateNames = ["РЕСУРС", "ВЛАСТЬ", "ОТНОШЕНИЯ", "РЕЗУЛЬТАТ"];
  const randomPressed = await Promise.all(plateNames.map((name) =>
    page.getByRole("button", { name, exact: true }).getAttribute("aria-pressed")));
  assert.equal(randomPressed.filter((value) => value === "true").length, 1, "random selection must press one plate");

  await choosePlate(page, "ОТНОШЕНИЯ");
  assert.equal(
    await page.getByRole("button", { name: "ОТНОШЕНИЯ", exact: true }).getAttribute("aria-pressed"),
    "true",
    "manual selection must activate the requested plate",
  );

  const tabs = [
    ["Аз × Буки", "Аз × Буки"],
    ["Тактика", "Тактический протокол · 7 micro‑шагов"],
    ["Источник I₁–I₁₂", "Фазы Источника I₁–I₁₂"],
    ["Метрики", "Метрики цикла"],
    ["Творец", "Ядро Творца"],
    ["M⁷–M¹²", "Пустотная алгебра · M⁷–M¹²"],
  ];
  for (const [tabName, heading] of tabs) {
    await page.getByRole("button", { name: tabName, exact: true }).click();
    await page.getByRole("heading", { name: heading, exact: true }).waitFor();
  }
  await page.getByRole("button", { name: "Цикл карт", exact: true }).click();
  await page.getByText("Резонансная технология ТзАр", { exact: true }).waitFor();

  await choosePlate(page);
  const run = page.getByRole("button", { name: "Провести через ТзАр", exact: true });
  await fillConductance(page, "   ", "формулировка");
  assert.equal(await run.isDisabled(), true, "whitespace-only source must be rejected");
  await fillConductance(page, "инвариант", "   ");
  assert.equal(await run.isDisabled(), true, "whitespace-only variant must be rejected");

  if (isMobile) {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 1, `iPhone layout has ${overflow}px horizontal overflow`);
    assert.equal(await page.getByRole("button", { name: "РЕСУРС", exact: true }).isVisible(), true);
  }
}

async function exerciseConductanceStateMachine(page) {
  await choosePlate(page);
  await fillConductance(page, "ПРОДОЛЖАТЬ РОД", "ПРОДОЛЖАТЬ РОД");

  const run = page.getByRole("button", { name: "Провести через ТзАр", exact: true });
  await run.click();
  await page.getByText("1.000", { exact: true }).waitFor();
  await page.getByText("Проведение завершено", { exact: true }).waitFor();
  assert.equal(await run.isEnabled(), true, "completed inference must unlock a rerun");

  await page.evaluate(() => window.__setSemanticWorkerMode("slow"));
  await run.click();
  await page.getByText("Загрузка модели · 1%", { exact: true }).waitFor();
  assert.equal(await run.isDisabled(), true, "run must be locked during slow inference");
  await page.getByRole("button", { name: "Остановить", exact: true }).click();
  await page.getByText("Проведение остановлено", { exact: true }).waitFor();
  assert.equal(await run.isEnabled(), true, "stopping inference must unlock a rerun");

  await page.evaluate(() => window.__setSemanticWorkerMode("error"));
  await run.click();
  await page.getByText("Модельный слой недоступен", { exact: true }).waitFor();
  await page.getByText(
    "Выполнен операционный резервный контур без вымышленного коэффициента модели. Причина: simulated CDN failure",
    { exact: true },
  ).waitFor();
  assert.equal(await run.isEnabled(), true, "network fallback must unlock a rerun");

  await page.evaluate(() => window.__setSemanticWorkerMode("boundary"));
  await run.click();
  await page.getByText("1.000", { exact: true }).waitFor();
}

async function exerciseDiaryPersistence(page) {
  await page.evaluate((key) => localStorage.removeItem(key), diaryKey);
  await page.reload({ waitUntil: "domcontentloaded" });
  await choosePlate(page);

  await page.getByRole("button", { name: "Азъ (А)", exact: true }).click();
  await page.getByRole("button", { name: "⊕ Суперпозиция", exact: true }).click();
  await page.getByRole("button", { name: "Ядро", exact: true }).click();

  const requirement = await page.getByText(/Состояния — назови ровно \d+/u).textContent();
  const stateCount = Number(requirement.match(/\d+/u)?.[0]);
  assert.ok(stateCount > 0, "selected card must require one or more states");
  const states = Array.from({ length: stateCount }, (_, index) => `состояние ${index + 1}`).join("\n");
  await page.getByRole("textbox", { name: "впиши состояния через запятую или с новой строки", exact: true }).fill(states);

  const save = page.getByRole("button", { name: "Сохранить запись и перейти", exact: true });
  assert.equal(await save.isEnabled(), true);
  await save.click();
  await page.getByText("(1)", { exact: true }).waitFor();
  await page.waitForFunction((key) => JSON.parse(localStorage.getItem(key) ?? "{}").items?.length === 1, diaryKey);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByText("(1)", { exact: true }).waitFor();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), diaryKey);
  assert.equal(stored.version, 1);
  assert.equal(stored.items.length, 1);
}

async function exerciseRealNetworkFailure(browser, contextOptions, baseUrl) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  try {
    await page.route("https://cdn.jsdelivr.net/**", (route) => route.abort("failed"));
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await choosePlate(page);
    await fillConductance(page, "инвариант", "вариант");
    await page.getByRole("button", { name: "Провести через ТзАр", exact: true }).click();
    await page.getByText("Модельный слой недоступен", { exact: true }).waitFor({ timeout: 15_000 });
    await page.getByText(/Выполнен операционный резервный контур/u).waitFor();
  } finally {
    await context.close();
  }
}

async function exerciseStorageDenial(browser, contextOptions, baseUrl) {
  const context = await browser.newContext(contextOptions);
  await context.addInitScript(() => {
    const deny = () => {
      throw new DOMException("Storage denied for acceptance test", "SecurityError");
    };
    Object.defineProperties(Storage.prototype, {
      getItem: { configurable: true, value: deny },
      setItem: { configurable: true, value: deny },
    });
  });
  const page = await context.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.getByText(
      "Локальное хранение недоступно · используй экспорт JSON",
      { exact: true },
    ).waitFor();
    assert.equal(await page.getByRole("button", { name: "Экспорт JSON", exact: true }).isEnabled(), true);
  } finally {
    await context.close();
  }
}

async function exerciseOfflineShell(browser, contextOptions, baseUrl) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));

    const cacheAudit = await page.evaluate(async () => ({
      keys: await caches.keys(),
      cdnRuntimeCached: Boolean(await caches.match(
        "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.0.1",
      )),
    }));
    assert.ok(cacheAudit.keys.includes("subject-core-shell-v1"), "app shell cache must be installed");
    assert.equal(cacheAudit.cdnRuntimeCached, false, "service worker must not imply that the CDN model is offline-ready");

    await context.setOffline(true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText("ГДЕЯ · ядро субъекта", { exact: true }).waitFor();
    await page.getByText("Офлайн · структурный контур доступен", { exact: true }).waitFor();
    await choosePlate(page);
    await fillConductance(page, "инвариант", "вариант");
    await page.getByRole("button", { name: "Провести через ТзАр", exact: true }).click();
    await page.getByText(
      "Модельный слой недоступен · выполнена точная структурная проверка",
      { exact: true },
    ).waitFor();
    await page.getByText(/Выполнен операционный резервный контур/u).waitFor();
  } finally {
    await context.setOffline(false).catch(() => {});
    await context.close();
  }
}

const server = await serveRelease();
const matrix = [
  {
    contextOptions: {},
    isMobile: false,
    label: "Chromium desktop",
    launcher: chromium,
  },
  {
    contextOptions: { ...devices["iPhone 13"] },
    isMobile: true,
    label: "iPhone 13 WebKit",
    launcher: webkit,
  },
];

try {
  for (const entry of matrix) {
    const browser = await entry.launcher.launch();
    try {
      const deterministicContext = await browser.newContext(entry.contextOptions);
      await installDeterministicWorker(deterministicContext);
      const page = await deterministicContext.newPage();
      await page.goto(server.baseUrl, { waitUntil: "domcontentloaded" });
      await exerciseNavigationAndSelection(page, entry.isMobile);
      await exerciseConductanceStateMachine(page);
      await exerciseDiaryPersistence(page);
      await deterministicContext.close();

      await exerciseRealNetworkFailure(browser, entry.contextOptions, server.baseUrl);
      await exerciseStorageDenial(browser, entry.contextOptions, server.baseUrl);
      await exerciseOfflineShell(browser, entry.contextOptions, server.baseUrl);
      console.log(`PASS ${entry.label}`);
    } finally {
      await browser.close();
    }
  }
} finally {
  await server.close();
}
