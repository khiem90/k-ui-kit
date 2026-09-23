// Proves the packed package inside a fresh Next.js App Router app and a fresh Vite app, the way a
// Consumer meets it. Run it before cutting a release:
//
//   pnpm smoke [--dir <folder>] [--keep]
//
// --dir reuses a folder from an earlier run, so the apps are rebuilt instead of scaffolded again.
// --keep leaves the folder in place on success. It always stays in place on failure.
//
// Needs the network for the scaffolders and installs, and the Chromium that
// `pnpm exec playwright install chromium` provides.

import { spawn, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const NEXT_PORT = 3123;
const VITE_PORT = 4321;

const NEXT_SCAFFOLD =
  "npx --yes create-next-app@latest next-app --ts --app --empty --no-tailwind --no-eslint " +
  "--no-react-compiler --no-agents-md --no-src-dir --use-npm --skip-install --disable-git --yes";
const VITE_SCAFFOLD =
  "npm create vite@latest vite-app -- --template react-ts --no-interactive --no-immediate";

const bodyCss = `body {
  margin: 0;
  padding: 1rem;
  background: var(--kui-background);
  color: var(--kui-foreground);
  font-family: var(--kui-font-family);
}
`;

// A panel forced dark and a panel forced light, so both apps can prove the attribute wins.
const themePanels = `      <section id="dark-panel" data-theme="dark">
        <Button variant="primary">Dark panel</Button>
      </section>
      <section id="light-panel" data-theme="light">
        <Button variant="primary">Light panel</Button>
      </section>`;

// A server component: no client directive, no function props, every Component uncontrolled.
const nextFiles = {
  "app/globals.css": bodyCss,
  "app/layout.tsx": `import type { Metadata } from "next";
import "k-ui-kit/styles.css";
import "./globals.css";

export const metadata: Metadata = { title: "k-ui-kit smoke test" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  "app/page.tsx": `import {
  Button,
  Checkbox,
  DataTable,
  Dialog,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  TextField,
  Tooltip,
  type ColumnDef,
} from "k-ui-kit";

type Person = { name: string; role: string };

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

const people: Person[] = [
  { name: "Grace", role: "Admiral" },
  { name: "Ada", role: "Engineer" },
];

export default function Home() {
  return (
    <main>
      <h1>Every Component from a server component</h1>
      <section id="button">
        <Button variant="primary">Save</Button>
      </section>
      <section id="text-field">
        <TextField label="Name" description="As it appears on your badge" />
      </section>
      <section id="checkbox">
        <Checkbox label="Send me updates" defaultChecked />
      </section>
      <section id="switch">
        <Switch label="Notifications" />
      </section>
      <section id="radio-group">
        <RadioGroup.Root defaultValue="light">
          <RadioGroup.Label>Appearance</RadioGroup.Label>
          <RadioGroup.Item value="light" label="Light" />
          <RadioGroup.Item value="dark" label="Dark" />
        </RadioGroup.Root>
      </section>
      <section id="tooltip">
        <Tooltip content="Saves your changes">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </section>
      <section id="tabs">
        <Tabs.Root defaultValue="one">
          <Tabs.List aria-label="Sections">
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="one">First panel</Tabs.Content>
          <Tabs.Content value="two">Second panel</Tabs.Content>
        </Tabs.Root>
      </section>
      <section id="dialog">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="outline">Open dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Description>Are you sure?</Dialog.Description>
            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Root>
      </section>
      <section id="select">
        <Select.Root name="fruit">
          <Select.Trigger aria-label="Fruit" placeholder="Pick a fruit" />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="pear">Pear</Select.Item>
          </Select.Content>
        </Select.Root>
      </section>
      <section id="data-table">
        <DataTable columns={columns} data={people} caption="People" sortable selectable />
      </section>
${themePanels}
    </main>
  );
}
`,
};

// Imports two Components only, so the production bundle shows what tree-shaking dropped.
const viteFiles = {
  "src/app.css": bodyCss,
  "src/main.tsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "k-ui-kit/styles.css";
import "./app.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
  "src/App.tsx": `import { Button, TextField } from "k-ui-kit";

export function App() {
  return (
    <main>
      <h1>Two Components from a Vite app</h1>
      <section id="button">
        <Button variant="primary">Save</Button>
      </section>
      <section id="text-field">
        <TextField label="Name" />
      </section>
${themePanels}
    </main>
  );
}
`,
};

const importedMarkers = ["kui-button", "kui-text-field"];
const droppedMarkers = [
  "kui-checkbox",
  "kui-switch",
  "kui-radio",
  "kui-tooltip",
  "kui-tabs",
  "kui-dialog",
  "kui-select",
  "kui-data-table",
];

const kit = process.cwd();
const pkg = JSON.parse(readFileSync(join(kit, "package.json"), "utf8"));
const args = process.argv.slice(2);
const keep = args.includes("--keep");
const dirFlag = args.indexOf("--dir");
const reused = dirFlag >= 0;
if (reused && !args[dirFlag + 1]) throw new Error("--dir needs a folder after it");
const root = reused
  ? resolve(args[dirFlag + 1])
  : mkdtempSync(join(tmpdir(), `${pkg.name}-smoke-`));
mkdirSync(root, { recursive: true });

// The primary colour in each Theme, read from the Tokens so a Token change cannot pass unnoticed.
// Each value is taken from the block its Theme attribute selects, so block order does not matter.
const tokens = readFileSync(join(kit, "src/styles/tokens.css"), "utf8");
const primaryIn = (theme) => {
  const block = tokens.match(new RegExp(`\\[data-theme="${theme}"\\]\\)\\s*\\{([^}]*)\\}`));
  const hex = block?.[1].match(/--kui-primary:\s*#([0-9a-f]{6})/i)?.[1];
  if (!hex) throw new Error(`tokens.css has no --kui-primary for the ${theme} Theme`);
  return `rgb(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;
};
const lightPrimary = primaryIn("light");
const darkPrimary = primaryIn("dark");

const problems = [];

function check(ok, message) {
  console.log(`${ok ? "ok  " : "FAIL"} ${message}`);
  if (!ok) problems.push(message);
}

async function attempt(message, action) {
  try {
    await action();
    check(true, message);
  } catch (error) {
    check(false, `${message}: ${String(error.message).split("\n")[0]}`);
  }
}

function run(command, cwd) {
  console.log(`\n$ ${command}\n  in ${cwd}`);
  const result = spawnSync(command, { cwd, shell: true, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`"${command}" exited with ${result.status}`);
}

function write(dir, files) {
  for (const [path, content] of Object.entries(files)) {
    const file = join(dir, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}

function stop(child) {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    process.kill(-child.pid, "SIGTERM");
  }
}

async function serve(command, cwd, url) {
  console.log(`\n$ ${command}\n  in ${cwd}`);
  const child = spawn(command, {
    cwd,
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline && child.exitCode === null) {
    try {
      const response = await fetch(url);
      if (response.ok) return child;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  stop(child);
  throw new Error(`${url} did not come up.\n${output}`);
}

/** Opens the page in Chromium, runs each check against it, and fails on anything it logged. */
async function inBrowser(url, checks) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    await page.goto(url);
    await page.locator("#button .kui-button").waitFor();
    for (const runChecks of checks) await runChecks(page, url);
    check(
      errors.length === 0,
      `${url} logs no errors${errors.length ? `:\n  ${errors.join("\n  ")}` : ""}`,
    );
  } finally {
    await browser.close();
  }
}

async function verifyThemes(page, url) {
  const background = (selector) =>
    page
      .locator(selector)
      .first()
      .evaluate(
        (element) => element.ownerDocument.defaultView.getComputedStyle(element).backgroundColor,
      );
  // Colours transition over --kui-motion-duration, so a reading taken right after a Theme change
  // lands mid-transition. Poll until the colour settles on the expected value or time runs out.
  const settles = async (selector, expected) => {
    const deadline = Date.now() + 2_000;
    let actual = await background(selector);
    while (actual !== expected && Date.now() < deadline) {
      await new Promise((resolveWait) => setTimeout(resolveWait, 50));
      actual = await background(selector);
    }
    return actual === expected;
  };

  check(await settles("#button .kui-button", lightPrimary), `${url} light Theme by default`);
  check(
    await settles("#dark-panel .kui-button", darkPrimary),
    `${url} dark Theme from data-theme on an ancestor`,
  );
  await page.emulateMedia({ colorScheme: "dark" });
  check(
    await settles("#button .kui-button", darkPrimary),
    `${url} dark Theme from the system preference`,
  );
  check(
    await settles("#light-panel .kui-button", lightPrimary),
    `${url} data-theme="light" wins over the system preference`,
  );
  await page.emulateMedia({ colorScheme: "light" });
}

/** Every Component is on the page, and each one answers to input, so its parts reached the browser as working client references. */
async function verifyEveryComponent(page, url) {
  for (const selector of [
    ".kui-text-field",
    ".kui-checkbox",
    ".kui-switch",
    ".kui-radio-group",
    ".kui-tabs",
    ".kui-data-table",
    "#tooltip .kui-button",
    "#dialog .kui-button",
    "#select .kui-select__trigger",
  ]) {
    check((await page.locator(selector).count()) > 0, `${url} renders ${selector}`);
  }

  await attempt(`${url} Dialog opens and closes`, async () => {
    await page.locator("#dialog .kui-button").click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
  });
  await attempt(`${url} Select opens and closes`, async () => {
    await page.locator("#select .kui-select__trigger").click();
    await page.getByRole("listbox").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("listbox").waitFor({ state: "hidden" });
  });
  await attempt(`${url} Tooltip opens on focus`, async () => {
    await page.locator("#tooltip .kui-button").focus();
    await page.getByRole("tooltip").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("tooltip").waitFor({ state: "hidden" });
  });
  await attempt(`${url} Tabs switch panels`, async () => {
    await page.locator("#tabs").getByRole("tab", { name: "Two" }).click();
    await page.locator("#tabs").getByRole("tabpanel").getByText("Second panel").waitFor();
  });
  await attempt(`${url} DataTable sorts`, async () => {
    await page.locator("#data-table").getByRole("button", { name: "Name" }).click();
    await page.locator('#data-table th[aria-sort="ascending"]').waitFor();
  });
  await attempt(`${url} Checkbox toggles`, async () => {
    const box = page.locator("#checkbox [role=checkbox]");
    await box.click();
    if ((await box.getAttribute("aria-checked")) !== "false") throw new Error("still checked");
  });
  await attempt(`${url} Switch toggles`, async () => {
    const control = page.locator("#switch [role=switch]");
    await control.click();
    if ((await control.getAttribute("aria-checked")) !== "true") throw new Error("still off");
  });
  await attempt(`${url} RadioGroup selects`, async () => {
    const dark = page.locator("#radio-group").getByRole("radio", { name: "Dark" });
    await dark.click();
    if ((await dark.getAttribute("aria-checked")) !== "true") throw new Error("not selected");
  });
}

console.log(`Working in ${root}`);
run("pnpm build", kit);
run(`pnpm pack --pack-destination "${root}"`, kit);
const tarball = join(root, `${pkg.name}-${pkg.version}.tgz`);
if (!existsSync(tarball)) throw new Error(`pnpm pack did not write ${tarball}`);

const nextDir = join(root, "next-app");
if (!existsSync(nextDir)) run(NEXT_SCAFFOLD, root);
write(nextDir, nextFiles);
run(`npm install --no-audit --no-fund --loglevel=error "${tarball}"`, nextDir);
run("npm run build", nextDir);
const nextUrl = `http://localhost:${NEXT_PORT}/`;
const nextServer = await serve(`npx next start -p ${NEXT_PORT}`, nextDir, nextUrl);
try {
  await inBrowser(nextUrl, [verifyThemes, verifyEveryComponent]);
} finally {
  stop(nextServer);
}

const viteDir = join(root, "vite-app");
if (!existsSync(viteDir)) run(VITE_SCAFFOLD, root);
for (const leftover of ["src/App.css", "src/index.css", "src/assets"]) {
  rmSync(join(viteDir, leftover), { recursive: true, force: true });
}
write(viteDir, viteFiles);
run(`npm install --no-audit --no-fund --loglevel=error "${tarball}"`, viteDir);
run("npm run build", viteDir);

const assets = join(viteDir, "dist/assets");
const assetText = (extension) =>
  readdirSync(assets)
    .filter((file) => file.endsWith(extension))
    .map((file) => readFileSync(join(assets, file), "utf8"))
    .join("\n");
const js = assetText(".js");
const css = assetText(".css");
for (const marker of importedMarkers) check(js.includes(marker), `Vite bundle keeps ${marker}`);
for (const marker of droppedMarkers) check(!js.includes(marker), `Vite bundle drops ${marker}`);
check(
  css.includes(".kui-button") && css.includes("--kui-background:"),
  "Vite bundle includes the stylesheet",
);

const viteUrl = `http://localhost:${VITE_PORT}/`;
const viteServer = await serve(
  `npx vite preview --port ${VITE_PORT} --strictPort`,
  viteDir,
  viteUrl,
);
try {
  await inBrowser(viteUrl, [verifyThemes]);
} finally {
  stop(viteServer);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} check(s) failed. The apps are in ${root}.`);
  process.exit(1);
}
console.log("\nSmoke test passed.");
if (keep || reused) {
  console.log(`The apps are in ${root}.`);
} else {
  rmSync(root, { recursive: true, force: true, maxRetries: 3 });
}
