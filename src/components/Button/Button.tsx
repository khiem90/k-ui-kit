"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

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
 * Triggers an action. Renders a native button with `type="button"` unless a type is given.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    asChild = false,
    disabled,
    type = "button",
    className,
    children,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : "button";
  const elementProps = asChild ? { "aria-disabled": disabled || undefined } : { type, disabled };

  return (
    <Component
      ref={ref}
      className={["kui-button", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      {...elementProps}
      {...props}
    >
      {leadingIcon && (
        <span className="kui-button__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <Slottable>{children}</Slottable>
      {trailingIcon && (
        <span className="kui-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </Component>
  );
});
