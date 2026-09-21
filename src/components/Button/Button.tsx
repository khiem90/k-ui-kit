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
  const Root = asChild ? Slot : "button";
  const disabledProps = asChild ? { "aria-disabled": disabled || undefined } : { disabled };

  return (
    <Root
      ref={ref}
      className={["kui-button", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      {...disabledProps}
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
    </Root>
  );
});
