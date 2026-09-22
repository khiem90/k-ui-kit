"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the button
 * that carries the switch role, so `name`, `value`, and `required` reach the surrounding form.
 */
export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "defaultChecked" | "onChange" | "type" | "value" | "children"
> {
  /** Visible label. It is also the switch's accessible name, and clicking it toggles the switch. */
  label: ReactNode;
  /** Controlled on/off state. Pair it with onCheckedChange. */
  checked?: boolean;
  /** Initial on/off state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the next state when the user toggles the switch. */
  onCheckedChange?: (checked: boolean) => void;
  /** Marks the switch as required for form validation and announces it as such. */
  required?: boolean;
  /** Submitted with the form under `name` when on. Defaults to "on", like a native checkbox. */
  value?: string;
}

/**
 * A labelled on/off switch. Space toggles it, and the thumb slides between the two positions.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    id: idProp,
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  // Owning the state puts data-state on the root, where Checkbox exposes it too, so a Consumer
  // targets both the same way.
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolledChecked;

  const handleCheckedChange = (next: boolean) => {
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <div
      className={["kui-switch", className].filter(Boolean).join(" ")}
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={disabled ? "" : undefined}
    >
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        className="kui-switch__track"
        checked={checked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        {...props}
      >
        <SwitchPrimitive.Thumb className="kui-switch__thumb" />
      </SwitchPrimitive.Root>
      <label className="kui-switch__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
