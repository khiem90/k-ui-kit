/**
 * Every colour and every spacing, radius, and font-size value in component CSS comes from a Token
 * (ADR 0001). The raw values live in src/styles/tokens.css, the one file the colour rules skip.
 * The length rule allows 0, a 1px or 2px hairline, and the -1px of the visually-hidden pattern.
 */

/** A px or rem length other than 1px, 2px, or -1px, anywhere in a value. */
const rawLength = /(?<![-\w.])(?!(?:-?1|2)px\b)-?\d*\.?\d+(?:px|rem)\b/;

/**
 * The strict-value plugin accepts a value that matches an ignoreValues entry, given as a
 * "/pattern/flags" string. This one matches a value with no raw length in it. The s flag lets the
 * dot cross the line breaks of a wrapped calc().
 */
const noRawLength = `/^(?!.*${rawLength.source}).*$/s`;

export default {
  plugins: ["stylelint-declaration-strict-value"],
  reportNeedlessDisables: true,
  reportDescriptionlessDisables: true,
  rules: {
    "color-no-hex": true,
    "color-named": "never",
    "function-disallowed-list": [
      "rgb",
      "rgba",
      "hsl",
      "hsla",
      "hwb",
      "lab",
      "lch",
      "oklab",
      "oklch",
      "color",
      "color-mix",
    ],
    "scale-unlimited/declaration-strict-value": [
      [
        "/^(margin|padding)(-|$)/",
        "/^(row-|column-)?gap$/",
        "/^border(-[a-z]+)*-radius$/",
        "font-size",
      ],
      {
        ignoreFunctions: false,
        ignoreValues: [noRawLength],
        disableFix: true,
        message: "${property}: ${value} has a raw length. Use a Token, 0, 1px, 2px, or -1px.",
      },
    ],
  },
  overrides: [
    {
      files: ["src/styles/tokens.css"],
      rules: { "color-no-hex": null, "color-named": null, "function-disallowed-list": null },
    },
  ],
};
