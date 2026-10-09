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
  font-family: var(--kui-font-body);
}
`;

// The Vite app overrides one Token the way the Getting started page says to. The rule names
// [data-theme] as well as :root so the override reaches the Noren and Rooftop subtrees the app
// renders: a Theme block declares every Token on the wrapper itself, and that beats a value
// inherited from :root.
const OVERRIDE_PRIMARY = "#2f6f5e";
const overrideCss = `:root,
[data-theme] {
  --kui-primary: ${OVERRIDE_PRIMARY};
}
`;

// Every face each Theme draws, each tried with a latin and a latin-ext sample so both files of a
// subset family load. Kept in step with src/docs/Fonts.stories.tsx.
const ridgelineFaces = [
  'italic 400 16px "Fraunces"',
  'italic 600 16px "Fraunces"',
  'normal 600 16px "Fraunces"',
  'normal 400 16px "Josefin Sans"',
  'normal 600 16px "Josefin Sans"',
  'normal 400 16px "Nunito Sans"',
  'normal 600 16px "Nunito Sans"',
  'normal 700 16px "Nunito Sans"',
];
const norenFaces = [
  'normal 800 16px "Shippori Mincho B1"',
  'normal 400 16px "Zen Kaku Gothic New"',
  'normal 700 16px "Zen Kaku Gothic New"',
];
const rooftopFaces = ['normal 800 16px "Big Shoulders Display"', 'normal 400 16px "Barlow"'];
const fontSamples = ["Weekend escape", "Łódź, Ærøskøbing"];

// A server component: no client directive, no function props, every Component uncontrolled. The
// page is under Noren, with the attribute on the html element the way the Getting started page
// says, and it loads all three opt-in fonts stylesheets, so the Next.js build has to resolve every
// bundled font file.
const nextFiles = {
  "app/globals.css": bodyCss,
  "app/layout.tsx": `import type { Metadata } from "next";
import "k-ui-kit/styles.css";
import "k-ui-kit/fonts.css";
import "k-ui-kit/fonts/noren.css";
import "k-ui-kit/fonts/rooftop.css";
import "./globals.css";

export const metadata: Metadata = { title: "k-ui-kit smoke test" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="noren">
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
        <RadioGroup.Root defaultValue="comfortable">
          <RadioGroup.Label>Density</RadioGroup.Label>
          <RadioGroup.Item value="comfortable" label="Comfortable" />
          <RadioGroup.Item value="compact" label="Compact" />
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
    </main>
  );
}
`,
};

// Imports two Components only, so the production bundle shows what tree-shaking dropped. It skips
// the fonts stylesheets, so the bundle proves the main stylesheet pulls in no font files. The same
// two Components render again inside a Noren subtree and a Rooftop subtree, beside the Ridgeline
// ones.
const viteFiles = {
  "src/app.css": bodyCss + overrideCss,
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
      <section id="noren" data-theme="noren">
        <h2>The same two under Noren</h2>
        <Button variant="primary">Save</Button>
        <TextField label="Name" />
      </section>
      <section id="rooftop" data-theme="rooftop">
        <h2>The same two under Rooftop</h2>
        <Button variant="primary">Save</Button>
        <TextField label="Name" />
      </section>
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

// Theme colours, read from the Tokens so a Token change cannot pass unnoticed. Each Theme declares
// every Token once in its own block: Ridgeline's is the :root block, Noren's follows it, and
// Rooftop's follows that, so a name is looked up in the text of one block only.
const tokens = readFileSync(join(kit, "src/styles/tokens.css"), "utf8");
const norenStart = tokens.indexOf('[data-theme="noren"]');
if (norenStart < 0) throw new Error("tokens.css has no Noren block");
const rooftopStart = tokens.indexOf('[data-theme="rooftop"]');
if (rooftopStart < norenStart) throw new Error("tokens.css has no Rooftop block after Noren's");
const blocks = {
  Ridgeline: tokens.slice(0, norenStart),
  Noren: tokens.slice(norenStart, rooftopStart),
  Rooftop: tokens.slice(rooftopStart),
};
const rgb = (hex) => `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ")})`;
const tokenRgb = (theme, name) => {
  const hex = blocks[theme].match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})\\b`, "i"))?.[1];
  if (!hex) throw new Error(`tokens.css has no hex value for ${name} in the ${theme} block`);
  return rgb(hex);
};
const themeColours = (theme) => ({
  background: tokenRgb(theme, "--kui-background"),
  primary: tokenRgb(theme, "--kui-primary"),
  surfaceField: tokenRgb(theme, "--kui-surface-field"),
  border: tokenRgb(theme, "--kui-border"),
});
const ridgeline = themeColours("Ridgeline");
const noren = themeColours("Noren");
const rooftop = themeColours("Rooftop");

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

const computed = (page, selector, property) =>
  page
    .locator(selector)
    .first()
    .evaluate(
      (element, name) => element.ownerDocument.defaultView.getComputedStyle(element)[name],
      property,
    );

// Colours transition over --kui-motion-duration, so a reading taken right after a change lands
// mid-transition. Poll until the colour settles on the expected value or time runs out.
async function backgroundSettles(page, selector, expected) {
  const deadline = Date.now() + 2_000;
  let actual = await computed(page, selector, "backgroundColor");
  while (actual !== expected && Date.now() < deadline) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
    actual = await computed(page, selector, "backgroundColor");
  }
  return actual === expected;
}

/**
 * The Theme the page is under: Ridgeline with no attribute, Noren with it on the html element.
 * Both ignore a dark system preference, since a Theme carries one Color scheme of its own and
 * these two are light. `primary` is the colour the app's primary Button should show, which an
 * override may have changed.
 */
function verifyTheme(theme, { background, primary }) {
  return async (page, url) => {
    check(
      await backgroundSettles(page, "body", background),
      `${url} ${theme} background on the page`,
    );
    check(
      await backgroundSettles(page, "#button .kui-button", primary),
      `${url} primary Button is ${primary}`,
    );
    await page.emulateMedia({ colorScheme: "dark" });
    check(
      (await backgroundSettles(page, "body", background)) &&
        (await backgroundSettles(page, "#button .kui-button", primary)),
      `${url} a dark system preference changes nothing`,
    );
    await page.emulateMedia({ colorScheme: "light" });
  };
}

/** Every face of a Theme resolves to a bundled file the app's build copied and served. */
function verifyFaces(theme, faces) {
  return async (page, url) => {
    const results = await page.locator("#button .kui-button").evaluate(
      async (element, { faces, samples }) => {
        const { fonts } = element.ownerDocument;
        const out = [];
        for (const font of faces) {
          for (const sample of samples) {
            try {
              // load() resolves with no faces when nothing matches, and rejects when a file fails.
              const loaded = await fonts.load(font, sample);
              const ok = loaded.length > 0 && loaded.every((face) => face.status === "loaded");
              out.push({ font, sample, ok, detail: `${loaded.length} face(s)` });
            } catch (error) {
              out.push({ font, sample, ok: false, detail: String(error) });
            }
          }
        }
        return out;
      },
      { faces, samples: fontSamples },
    );
    const failed = results.filter((result) => !result.ok);
    check(
      failed.length === 0,
      `${url} loads all ${faces.length} ${theme} faces in both ranges` +
        failed.map((f) => `\n  ${f.font} for "${f.sample}": ${f.detail}`).join(""),
    );
  };
}

/** The Button label draws in the Theme's label family, from a face the page has loaded. */
function verifyLabelFont(family) {
  return async (page, url) => {
    const label = await page.locator("#button .kui-button").evaluate((element) => {
      const { fontFamily, fontWeight } =
        element.ownerDocument.defaultView.getComputedStyle(element);
      const first = fontFamily.split(",")[0];
      // fonts.check() is true when no face matches at all, so look for a loaded face instead.
      const weight = Number(fontWeight);
      const ready = [...element.ownerDocument.fonts].some((face) => {
        const [min, max = min] = face.weight.split(" ").map(Number);
        return (
          `"${face.family.replace(/"/g, "")}"` === first &&
          face.status === "loaded" &&
          weight >= min &&
          weight <= max
        );
      });
      return { first, ready };
    });
    check(
      label.first === `"${family}"` && label.ready,
      `${url} Button labels draw in ${family} (${label.first}, loaded: ${label.ready})`,
    );
  };
}

/** A TextField input's edge widths, edge colour, and fill. */
const field = async (page, selector) => ({
  edges: [
    await computed(page, selector, "borderTopWidth"),
    await computed(page, selector, "borderRightWidth"),
    await computed(page, selector, "borderBottomWidth"),
    await computed(page, selector, "borderLeftWidth"),
  ],
  edgeColour: await computed(page, selector, "borderBottomColor"),
  background: await computed(page, selector, "backgroundColor"),
});
const describeField = ({ edges, edgeColour, background }) =>
  `${edges.join(" ")} ${edgeColour} on ${background}`;

/**
 * The Vite app themes two subtrees. The attribute reaches the Components inside each, the page
 * outside them stays Ridgeline, and the app's override of primary reaches all three because it is
 * written as `:root, [data-theme]`. A `:root` rule alone stops at a wrapper, where the Theme block
 * declares the Token again.
 */
async function verifyNorenSubtree(page, url) {
  const wrapper = '#noren[data-theme="noren"]';
  const present = (await page.locator(wrapper).count()) > 0;
  check(present, `${url} renders a Noren subtree beside the Ridgeline content`);
  if (!present) return;
  check(
    await backgroundSettles(page, `${wrapper} .kui-button`, rgb(OVERRIDE_PRIMARY)),
    `${url} the override reaches the primary Button inside the Noren subtree`,
  );
  const inside = await field(page, `${wrapper} .kui-text-field__input`);
  const outside = await field(page, "#text-field .kui-text-field__input");
  check(
    inside.edges.join(" ") === "0px 0px 3px 0px" && inside.background === noren.surfaceField,
    `${url} the field inside the subtree is Noren, a 3px underline on Paper (${describeField(inside)})`,
  );
  check(
    outside.edges.every((edge) => edge === "2px") && outside.background === ridgeline.surfaceField,
    `${url} the field outside the subtree stays Ridgeline (${describeField(outside)})`,
  );
}

/**
 * The Rooftop subtree is the dark one. Its field recesses to Wet stone behind a 2px Fog teal
 * edge, the subtree declares a dark Color scheme of its own, and the page around it stays Apricot.
 */
async function verifyRooftopSubtree(page, url) {
  const wrapper = '#rooftop[data-theme="rooftop"]';
  const present = (await page.locator(wrapper).count()) > 0;
  check(present, `${url} renders a Rooftop subtree beside the Noren one`);
  if (!present) return;
  check(
    await backgroundSettles(page, `${wrapper} .kui-button`, rgb(OVERRIDE_PRIMARY)),
    `${url} the override reaches the primary Button inside the Rooftop subtree`,
  );
  const inside = await field(page, `${wrapper} .kui-text-field__input`);
  check(
    inside.edges.every((edge) => edge === "2px") &&
      inside.edgeColour === rooftop.border &&
      inside.background === rooftop.surfaceField,
    `${url} the field inside the subtree is Rooftop, a 2px Fog teal edge on Wet stone (${describeField(inside)})`,
  );
  const scheme = await computed(page, wrapper, "colorScheme");
  check(scheme === "dark", `${url} the Rooftop subtree's Color scheme is dark (${scheme})`);
  check(
    await backgroundSettles(page, "body", ridgeline.background),
    `${url} the body around both subtrees is still Apricot`,
  );
}

/** The kit's entry in an app's lockfile, so a runtime dependency would show up as an install. */
function kitDependencies(appDir) {
  const lock = JSON.parse(readFileSync(join(appDir, "package-lock.json"), "utf8"));
  const entry = lock.packages?.[`node_modules/${pkg.name}`];
  if (!entry) throw new Error(`${appDir} lockfile has no ${pkg.name} entry`);
  return Object.keys(entry.dependencies ?? {});
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
    const box = page.locator("#checkbox").getByRole("checkbox");
    await box.click();
    if (await box.isChecked()) throw new Error("still checked");
  });
  await attempt(`${url} Switch toggles`, async () => {
    const control = page.locator("#switch [role=switch]");
    await control.click();
    if ((await control.getAttribute("aria-checked")) !== "true") throw new Error("still off");
  });
  await attempt(`${url} RadioGroup selects`, async () => {
    const compact = page.locator("#radio-group").getByRole("radio", { name: "Compact" });
    await compact.click();
    if (!(await compact.isChecked())) throw new Error("not selected");
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
const nextDependencies = kitDependencies(nextDir);
check(
  nextDependencies.length === 0,
  `the installed kit has no runtime dependencies${nextDependencies.length ? `: ${nextDependencies.join(", ")}` : ""}`,
);
run("npm run build", nextDir);
const nextUrl = `http://localhost:${NEXT_PORT}/`;
const nextServer = await serve(`npx next start -p ${NEXT_PORT}`, nextDir, nextUrl);
try {
  // The Next.js app is under Noren with all three fonts stylesheets imported, so every face of
  // every Theme must load, and the label must draw in the Noren label family.
  await inBrowser(nextUrl, [
    verifyTheme("Noren", noren),
    verifyFaces("Ridgeline", ridgelineFaces),
    verifyFaces("Noren", norenFaces),
    verifyFaces("Rooftop", rooftopFaces),
    verifyLabelFont("Zen Kaku Gothic New"),
    verifyEveryComponent,
  ]);
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
check(
  !css.includes("@font-face") && !readdirSync(assets).some((file) => file.endsWith(".woff2")),
  "Vite bundle has no font files without the fonts stylesheet",
);

const viteUrl = `http://localhost:${VITE_PORT}/`;
const viteServer = await serve(
  `npx vite preview --port ${VITE_PORT} --strictPort`,
  viteDir,
  viteUrl,
);
try {
  // The app's override of --kui-primary beats the kit's :where() Tokens under every Theme.
  await inBrowser(viteUrl, [
    verifyTheme("Ridgeline", { background: ridgeline.background, primary: rgb(OVERRIDE_PRIMARY) }),
    verifyNorenSubtree,
    verifyRooftopSubtree,
  ]);
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
