"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { forwardRef, useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { CheckIcon, MinusIcon } from "../../icons";

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the button
 * that carries the checkbox role, so `name`, `value`, and `required` reach the surrounding form.
 */
export interface CheckboxProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "defaultChecked" | "onChange" | "type" | "value" | "children"
> {
  /** Visible label. It is also the checkbox's accessible name, and clicking it toggles the box. */
  label: ReactNode;
  /** Controlled checked state. Pair it with onCheckedChange. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next checked state when the user toggles the box. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Shows the mixed state and announces it as such, whatever `checked` is. Toggling a mixed box
   * calls onCheckedChange with true; the Consumer clears this prop in response.
   */
  indeterminate?: boolean;
  /** Marks the box as required for form validation and announces it as such. */
  required?: boolean;
  /** Submitted with the form under `name` when checked. Defaults to "on", like a native checkbox. */
  value?: string;
}

/**
 * A labelled checkbox with checked, unchecked, and mixed states. Space toggles it; Enter does not.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    label,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    disabled,
    id: idProp,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  // Owning the state keeps Radix controlled at all times, so an uncontrolled box toggled while
  // indeterminate lands on checked once the Consumer clears that prop.
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolledChecked;
  const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";

  const handleCheckedChange = (next: CheckboxPrimitive.CheckedState) => {
    const nextChecked = next === true;
    if (!isControlled) setUncontrolledChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

  return (
    <div
      className={["kui-checkbox", className].filter(Boolean).join(" ")}
      data-state={state}
      data-disabled={disabled ? "" : undefined}
    >
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className="kui-checkbox__box"
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="kui-checkbox__indicator">
          {indeterminate ? <MinusIcon /> : <CheckIcon />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label className="kui-checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
