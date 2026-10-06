"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { composeRefs } from "../../compose.js";
import { useControllableState } from "../../controllable-state.js";

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the button
 * that carries the switch role. Inside a form, a hidden checkbox also takes `name`, `value`,
 * `required`, `disabled`, and `form`, so the switch submits, validates, and resets like a native
 * checkbox.
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

// The native setter skips React's value tracker on the input, so a click dispatched afterwards
// reads as a change and a Consumer's onChange on the form fires.
const setNativeChecked = (input: HTMLInputElement, checked: boolean) => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked")?.set?.call(input, checked);
};

/**
 * A labelled on/off switch. Space and Enter toggle it, and the thumb slides between the two
 * positions.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    required,
    name,
    value = "on",
    form,
    id: idProp,
    className,
    onClick,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  // Owning the state puts data-state on the root, where Checkbox exposes it too, so a Consumer
  // targets both the same way.
  const [checked, setCheckedState] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });
  const state = checked ? "checked" : "unchecked";
  const [initialChecked] = useState(checked);

  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useMemo(() => composeRefs(ref, setButton), [ref]);
  const inputRef = useRef<HTMLInputElement>(null);
  // The state a user toggle asked for, and whether the Consumer stopped its click. A change that
  // lands on that state is announced to the form with a click from the hidden input.
  const pendingToggle = useRef<{ checked: boolean; bubbles: boolean } | null>(null);

  // Until the button mounts, assume a form, so server-rendered markup submits without JavaScript.
  const isFormControl = button ? button.form !== null : true;

  const setChecked = useCallback(
    (next: boolean) => {
      if (next !== checked) setCheckedState(next);
    },
    [checked, setCheckedState],
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const next = !checked;
    if (isFormControl) {
      // The hidden input repeats this click once the state lands, so the form hears it once.
      pendingToggle.current = { checked: next, bubbles: !event.isPropagationStopped() };
      event.stopPropagation();
    }
    setChecked(next);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input || input.checked === checked) return;
    setNativeChecked(input, checked);
    const toggle = pendingToggle.current;
    pendingToggle.current = null;
    if (toggle?.checked === checked && toggle.bubbles) {
      input.dispatchEvent(new Event("click", { bubbles: true }));
    }
  }, [checked]);

  const owningForm = button?.form;
  useEffect(() => {
    if (!owningForm) return;
    const reset = () => setChecked(initialChecked);
    owningForm.addEventListener("reset", reset);
    return () => owningForm.removeEventListener("reset", reset);
  }, [owningForm, initialChecked, setChecked]);

  return (
    <div
      className={["kui-switch", className].filter(Boolean).join(" ")}
      data-state={state}
      data-disabled={disabled ? "" : undefined}
    >
      {isFormControl && (
        // Carries the value, required, and disabled into the form. The button is what people and
        // assistive technology use, so this stays hidden from both.
        <input
          ref={inputRef}
          className="kui-switch__input"
          type="checkbox"
          aria-hidden
          tabIndex={-1}
          defaultChecked={initialChecked}
          name={name}
          value={value}
          form={form}
          required={required}
          disabled={disabled}
          style={{ position: "absolute", margin: 0, opacity: 0, pointerEvents: "none" }}
        />
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        data-state={state}
        data-disabled={disabled ? "" : undefined}
        id={id}
        className="kui-switch__track"
        disabled={disabled}
        form={form}
        {...props}
        ref={buttonRef}
        onClick={handleClick}
      >
        <span
          className="kui-switch__thumb"
          data-state={state}
          data-disabled={disabled ? "" : undefined}
        />
      </button>
      <label className="kui-switch__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});
