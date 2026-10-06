import { useCallback, useState } from "react";

// Internal. Every Component with a value a Consumer may control (checked, value, open, selected
// ids) keeps it through this hook, so the controlled and uncontrolled rules are the same in each.

export interface ControllableStateOptions<T, D extends T | undefined> {
  /** The controlled value. Anything but undefined puts the Consumer in charge. */
  prop: T | undefined;
  /** The value an uncontrolled Component starts with. */
  defaultProp: D;
  /** Reports a new value to the Consumer, controlled or not. */
  onChange?(value: T): void;
}

export interface SetControllableState<T, D> {
  /** Stores the value when uncontrolled and reports it through onChange. */
  (next: T): void;
  /** Stores the value when uncontrolled and reports nothing, as when a form reset restores it. */
  (next: T | D, options: { silent: true }): void;
}

/**
 * The current value, a setter, and whether the Consumer controls it. The setter reports every
 * call, even one that repeats the current value, so a Component that reports only real changes
 * compares before it calls.
 */
export function useControllableState<T, D extends T | undefined = T>({
  prop,
  defaultProp,
  onChange,
}: ControllableStateOptions<T, D>): [
  value: T | D,
  setValue: SetControllableState<T, D>,
  isControlled: boolean,
] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T | D>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = useCallback(
    (next: T | D, options?: { silent: true }) => {
      if (!isControlled) setUncontrolledValue(() => next);
      if (!options?.silent) onChange?.(next as T);
    },
    [isControlled, onChange],
  ) as SetControllableState<T, D>;

  return [value, setValue, isControlled];
}
