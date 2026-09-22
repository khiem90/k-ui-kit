import type { SVGProps } from "react";

const iconProps = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} satisfies SVGProps<SVGSVGElement>;

export const CheckIcon = () => (
  <svg {...iconProps}>
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

export const MinusIcon = () => (
  <svg {...iconProps}>
    <path d="M4 8h8" />
  </svg>
);
