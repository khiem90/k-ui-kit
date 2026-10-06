import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const components = readdirSync("src/components");

const checks = [
  ["dist/index.js", "carry no client directive of its own", (s) => !s.includes('"use client"')],
  ["dist/index.js", "hold no Component code", (s) => !s.includes("forwardRef")],
  ...components.map((name) => [
    "dist/index.js",
    `import ${name} from its own file`,
    (s) => s.includes(`from "./components/${name}/${name}.js"`),
  ]),
  ...components.map((name) => [
    `dist/components/${name}/${name}.js`,
    "start with the client directive",
    (s) => s.startsWith('"use client";'),
  ]),
  ["dist/index.d.ts", "declare Button", (s) => s.includes("declare const Button")],
  ["dist/index.d.ts", "declare TextField", (s) => s.includes("declare const TextField")],
  ["dist/index.d.ts", "declare Checkbox", (s) => s.includes("declare const Checkbox")],
  ["dist/index.d.ts", "declare Switch", (s) => s.includes("declare const Switch")],
  ["dist/index.d.ts", "declare RadioGroup", (s) => s.includes("declare const RadioGroup:")],
  ["dist/index.d.ts", "declare Tooltip", (s) => s.includes("declare const Tooltip")],
  ["dist/index.d.ts", "declare Tabs", (s) => s.includes("declare const Tabs:")],
  ["dist/index.d.ts", "declare Dialog", (s) => s.includes("declare const Dialog:")],
  ["dist/index.d.ts", "declare Select", (s) => s.includes("declare const Select:")],
  ["dist/index.d.ts", "declare DataTable", (s) => s.includes("declare const DataTable")],
  ["dist/index.d.ts", "export the ColumnDef type", (s) => s.includes("type ColumnDef")],
  ["dist/styles/index.css", "contain the Tokens", (s) => s.includes("--kui-background:")],
  ["dist/styles/index.css", "contain the Button styles", (s) => s.includes(".kui-button")],
  ["dist/styles/index.css", "contain the TextField styles", (s) => s.includes(".kui-text-field")],
  ["dist/styles/index.css", "contain the Checkbox styles", (s) => s.includes(".kui-checkbox")],
  ["dist/styles/index.css", "contain the Switch styles", (s) => s.includes(".kui-switch")],
  ["dist/styles/index.css", "contain the RadioGroup styles", (s) => s.includes(".kui-radio-group")],
  ["dist/styles/index.css", "contain the Tooltip styles", (s) => s.includes(".kui-tooltip")],
  ["dist/styles/index.css", "contain the Tabs styles", (s) => s.includes(".kui-tabs")],
  ["dist/styles/index.css", "contain the Dialog styles", (s) => s.includes(".kui-dialog")],
  ["dist/styles/index.css", "contain the Select styles", (s) => s.includes(".kui-select")],
  ["dist/styles/index.css", "contain the DataTable styles", (s) => s.includes(".kui-data-table")],
  // A Consumer who already serves the fonts must not download them twice.
  ["dist/styles/index.css", "contain no font-face rules", (s) => !s.includes("@font-face")],
  [
    "package.json",
    "export the fonts stylesheet",
    (s) => fontsExport(s) === "./dist/styles/fonts.css",
  ],
  ...["fraunces", "josefin-sans", "nunito-sans"].map((family) => [
    `dist/fonts/${family}/OFL.txt`,
    "carry the SIL Open Font License",
    (s) => s.includes("SIL OPEN FONT LICENSE Version 1.1"),
  ]),
];

function fontsExport(manifest) {
  return JSON.parse(manifest).exports?.["./fonts.css"];
}

/** What the entry exports, and the parts each composite namespace carries. */
const shape = {
  Button: [],
  TextField: [],
  Checkbox: [],
  Switch: [],
  Tooltip: [],
  DataTable: [],
  RadioGroup: ["Root", "Item", "Label"],
  Tabs: ["Root", "List", "Trigger", "Content"],
  Dialog: ["Root", "Trigger", "Content", "Title", "Description", "Close"],
  Select: ["Root", "Trigger", "Content", "Item", "Group"],
};

let failed = false;

function report(ok, message) {
  if (ok) {
    console.log(`ok   ${message}`);
  } else {
    console.error(`FAIL ${message}`);
    failed = true;
  }
}

for (const [file, expectation, passes] of checks) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    report(false, `${file} is missing`);
    continue;
  }
  const ok = passes(content);
  report(ok, `${file} does ${ok ? "" : "not "}${expectation}`);
}

// The fonts stylesheet is copied, not bundled, so nothing else notices a font file that never made
// it into dist/. Every url() must resolve to a shipped file, and every face the Theme draws must be
// declared for both subsets.
const fontsSheet = "dist/styles/fonts.css";
const latin = "U+0000-00FF";
const latinExt = "U+0100-02BA";
const faces = [
  ["Fraunces", "italic", 400],
  ["Fraunces", "italic", 600],
  ["Fraunces", "normal", 600],
  ["Josefin Sans", "normal", 400],
  ["Josefin Sans", "normal", 600],
  ["Nunito Sans", "normal", 400],
  ["Nunito Sans", "normal", 600],
  ["Nunito Sans", "normal", 700],
];
let fontRules = [];
try {
  fontRules = [...readFileSync(fontsSheet, "utf8").matchAll(/@font-face\s*{([^}]*)}/g)].map(
    ([, body]) => body,
  );
} catch {
  report(false, `${fontsSheet} is missing`);
}
for (const body of fontRules) {
  const urls = [...body.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map(([, url]) => url);
  report(urls.length > 0, `${fontsSheet} has a face with a url: ${body.trim().split("\n")[0]}`);
  for (const url of urls) {
    report(existsSync(resolve(dirname(fontsSheet), url)), `${fontsSheet} ships ${url}`);
  }
  report(/font-display:\s*swap/.test(body), `${fontsSheet} swaps ${urls[0]}`);
  report(/unicode-range:/.test(body), `${fontsSheet} limits ${urls[0]} to a unicode range`);
}
for (const [family, style, weight] of faces) {
  for (const subset of [latin, latinExt]) {
    const declared = fontRules.some(
      (body) =>
        body.includes(`font-family: "${family}"`) &&
        body.includes(`font-style: ${style}`) &&
        coversWeight(body, weight) &&
        body.includes(subset),
    );
    report(declared, `${fontsSheet} declares ${family} ${style} ${weight} from ${subset}`);
  }
}

function coversWeight(body, weight) {
  const match = body.match(/font-weight:\s*(\d+)(?:\s+(\d+))?/);
  if (!match) return false;
  const low = Number(match[1]);
  const high = Number(match[2] ?? match[1]);
  return low <= weight && weight <= high;
}

// Importing the entry in Node proves every relative import in dist/ resolves without a bundler,
// and that each namespace is a plain object with its parts, which is what a server component sees.
const kit = await import(pathToFileURL(resolve("dist/index.js")));
for (const [name, parts] of Object.entries(shape)) {
  const value = kit[name];
  report(value != null, `dist/index.js exports ${name}`);
  for (const part of parts) {
    report(value?.[part] != null, `dist/index.js exports ${name}.${part}`);
  }
}

process.exit(failed ? 1 : 0);
