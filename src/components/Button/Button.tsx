"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { Slot } from "../../slot.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label and hidden from assistive technology. */
  leadingIcon?: ReactNode;
  /** Rendered after the label and hidden from assistive technology. */
  trailingIcon?: ReactNode;
  /** Render the child element, such as a link, in place of the button and pass every prop to it. */
  asChild?: boolean;
}

/**
 * Triggers an action. Renders a native button, or the child element when `asChild` is set.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    asChild = false,
    disabled,
    className,
    children,
    ...props
  },
  ref,
) {
  const rootProps = {
    className: ["kui-button", className].filter(Boolean).join(" "),
    "data-variant": variant,
    "data-size": size,
    "data-disabled": disabled ? "" : undefined,
    ...props,
  };
  const content = (label: ReactNode) => (
    <>
      {leadingIcon && (
        <span className="kui-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {label}
      {trailingIcon && (
        <span className="kui-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </>
  );

  if (asChild) {
    // The icons wrap the child's own content, so a link keeps its element and gains the icons.
    const child = Children.only(children) as ReactElement<{ children?: ReactNode }>;
    return (
      <Slot ref={ref} aria-disabled={disabled || undefined} {...rootProps}>
        {cloneElement(child, undefined, content(child.props.children))}
      </Slot>
    );
  }

  return (
    <button ref={ref} disabled={disabled} {...rootProps}>
      {content(children)}
    </button>
  );
});
