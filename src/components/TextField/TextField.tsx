"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

export type TextFieldSize = "sm" | "md" | "lg";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visible label. It is also the input's accessible name. */
  label: ReactNode;
  /** Shown between the label and the input and linked to the input through aria-describedby. */
  description?: ReactNode;
  /** Shown below the input, linked through aria-describedby, announced when it appears, and sets aria-invalid. */
  error?: ReactNode;
  /** Replaces the native `size` attribute, which is not passed through. */
  size?: TextFieldSize;
}

/**
 * A labelled text input. Renders a native input, so forms and form libraries see a plain input.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    size = "md",
    id: idProp,
    className,
    required,
    disabled,
    readOnly,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const hasDescription = Boolean(description);
  const hasError = Boolean(error);
  const invalid = ariaInvalid ?? (hasError || undefined);
  const describedBy =
    [hasError && errorId, hasDescription && descriptionId, ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div
      className={["kui-text-field", className].filter(Boolean).join(" ")}
      data-size={size}
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-invalid={invalid && invalid !== "false" ? "" : undefined}
    >
      <label className="kui-text-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="kui-text-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hasDescription && (
        <p id={descriptionId} className="kui-text-field__description">
          {description}
        </p>
      )}
      <input
        ref={ref}
        id={id}
        className="kui-text-field__input"
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        {...props}
      />
      {hasError && (
        <p id={errorId} className="kui-text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
