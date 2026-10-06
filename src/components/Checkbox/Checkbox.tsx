"use client";

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useControllableState } from "../../controllable-state.js";
import { CheckIcon, MinusIcon } from "../../icons.js";

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the native
 * checkbox input, so `name`, `value`, and `required` reach the surrounding form.
 */
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "defaultChecked" | "onChange" | "type" | "value" | "children"
> {
  /** Visible label. It is also the checkbox's accessible name, and clicking it toggles the box. */
  label: ReactNode;
  /**
   * Hides the label visually. It stays in the DOM, so it still names the box for assistive
   * technology. For a box whose meaning is clear from its surroundings, such as a table row.
   */
  hideLabel?: boolean;
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
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    hideLabel = false,
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
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
  // Owning the state keeps the input controlled at all times, so an uncontrolled box toggled while
  // indeterminate lands on checked once the Consumer clears that prop.
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });
  const state = indeterminate ? "indeterminate" : checked ? "checked" : "unchecked";

  // The mixed state has no HTML attribute. Only the DOM property reaches assistive technology.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div
      className={["kui-checkbox", className].filter(Boolean).join(" ")}
      data-state={state}
      data-disabled={disabled ? "" : undefined}
      data-label-hidden={hideLabel ? "" : undefined}
    >
      <span className="kui-checkbox__control">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className="kui-checkbox__input"
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            const nextChecked = indeterminate ? true : !checked;
            // A click clears the property. Put it back until the Consumer drops the prop, since a
            // Consumer that ignores the change causes no render to do it.
            event.currentTarget.indeterminate = indeterminate;
            setChecked(nextChecked);
          }}
          {...props}
        />
        <span className="kui-checkbox__box" aria-hidden="true">
          {state === "unchecked" ? null : indeterminate ? <MinusIcon /> : <CheckIcon />}
        </span>
      </span>
      <label className="kui-checkbox__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
