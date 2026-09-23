import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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
];

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
