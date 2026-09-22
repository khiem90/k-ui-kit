import { readFileSync } from "node:fs";

const checks = [
  ["dist/index.js", "start with the client directive", (s) => s.startsWith('"use client";')],
  ["dist/index.d.ts", "declare Button", (s) => s.includes("declare const Button")],
  ["dist/index.d.ts", "declare TextField", (s) => s.includes("declare const TextField")],
  ["dist/index.d.ts", "declare Checkbox", (s) => s.includes("declare const Checkbox")],
  ["dist/index.d.ts", "declare Switch", (s) => s.includes("declare const Switch")],
  ["dist/index.d.ts", "declare RadioGroup", (s) => s.includes("declare const RadioGroup")],
  ["dist/index.d.ts", "declare Tooltip", (s) => s.includes("declare const Tooltip")],
  ["dist/styles.css", "contain the Tokens", (s) => s.includes("--kui-background:")],
  ["dist/styles.css", "contain the Button styles", (s) => s.includes(".kui-button")],
  ["dist/styles.css", "contain the TextField styles", (s) => s.includes(".kui-text-field")],
  ["dist/styles.css", "contain the Checkbox styles", (s) => s.includes(".kui-checkbox")],
  ["dist/styles.css", "contain the Switch styles", (s) => s.includes(".kui-switch")],
  ["dist/styles.css", "contain the RadioGroup styles", (s) => s.includes(".kui-radio-group")],
  ["dist/styles.css", "contain the Tooltip styles", (s) => s.includes(".kui-tooltip")],
];

let failed = false;

for (const [file, expectation, passes] of checks) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    console.error(`FAIL ${file} is missing`);
    failed = true;
    continue;
  }
  if (passes(content)) {
    console.log(`ok   ${file} does ${expectation}`);
  } else {
    console.error(`FAIL ${file} does not ${expectation}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
