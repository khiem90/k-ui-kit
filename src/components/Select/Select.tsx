"use client";

import {
  createContext,
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronDownIcon } from "../../icons.js";
import { composeRefs, useAnchoredPopover } from "../../popover.js";

export type SelectSize = "sm" | "md" | "lg";

/** Gap between the trigger and the list. */
const SIDE_OFFSET = 4;
/** Keys on the trigger that open the list. */
const OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
/** Milliseconds after the last letter before typeahead starts a new search. */
const TYPEAHEAD_RESET = 1000;

/** What the Root knows about each Item, read from the DOM after it renders. */
interface ItemRecord {
  value: string;
  disabled: boolean;
  /** The option's text, matched by typeahead and copied into the hidden native select. */
  text: string;
}

interface ItemEntry extends ItemRecord {
  element: HTMLElement;
}

interface SelectContextValue {
  value: string | undefined;
  open: boolean;
  disabled: boolean;
  required: boolean | undefined;
  contentId: string;
  valueNode: HTMLElement | null;
  setValueNode: (node: HTMLElement | null) => void;
  setTrigger: (node: HTMLButtonElement | null) => void;
  listRef: RefObject<HTMLDivElement | null>;
  anchorRef: Ref<HTMLButtonElement>;
  anchorStyle: CSSProperties;
  popoverRef: Ref<HTMLDivElement>;
  popoverStyle: CSSProperties | undefined;
  /** Every registered Item in document order. */
  getItems: () => ItemEntry[];
  registerItem: (element: HTMLElement, record: ItemRecord) => void;
  unregisterItem: (element: HTMLElement) => void;
  /** Changes the value without opening or closing anything, as typeahead on the trigger does. */
  setValue: (value: string) => void;
  /** Picks an Item from the open list: sets the value, closes, and hands focus to the trigger. */
  pick: (value: string) => void;
  openList: () => void;
  closeList: (options: { focusTrigger: boolean }) => void;
  /** The search typed into the open list. Options read it, so a space mid-search picks nothing. */
  listTypeahead: Typeahead;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(part: string) {
  const context = useContext(SelectContext);
  if (!context) throw new Error(`Select.${part} must be rendered inside Select.Root.`);
  return context;
}

/** Runs the Consumer's handler first, and the kit's only if the Consumer did not prevent it. */
function compose<E extends SyntheticEvent>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours(event);
  };
}

/** No value, or an empty one, shows the placeholder, as a native select's empty option does. */
const isEmpty = (value: string | undefined) => value === undefined || value === "";

const isPrintable = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey;

interface Typeahead {
  isTyping: () => boolean;
  /** Adds a letter and returns the whole search. */
  type: (key: string) => string;
  reset: () => void;
}

/**
 * Letters typed within a second of each other build one search. Typing the same letter again
 * cycles through the options that start with it.
 */
function useTypeahead(): Typeahead {
  const search = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return useMemo(
    () => ({
      isTyping: () => search.current !== "",
      type: (key: string) => {
        search.current += key;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => (search.current = ""), TYPEAHEAD_RESET);
        return search.current;
      },
      reset: () => {
        search.current = "";
        clearTimeout(timer.current);
      },
    }),
    [],
  );
}

/** The next enabled item whose text starts with the search, starting after the current one. */
function findMatch(items: ItemEntry[], search: string, current: ItemEntry | undefined) {
  const repeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const needle = (repeated ? search.slice(0, 1) : search).toLowerCase();
  const start = current ? Math.max(items.indexOf(current), 0) : 0;
  const wrapped = [...items.slice(start), ...items.slice(0, start)];
  // A single letter moves on from the current item, so pressing it again cycles.
  const candidates = needle.length === 1 ? wrapped.filter((item) => item !== current) : wrapped;
  const match = candidates.find((item) => item.text.toLowerCase().startsWith(needle));
  return match === current ? undefined : match;
}

/**
 * Focuses an option and scrolls only the list to show it, never the page. The first and last
 * options scroll the list fully to its end, so a group label or the padding there shows too.
 */
function focusOption(list: HTMLElement, option: HTMLElement, enabled: ItemEntry[]) {
  option.focus({ preventScroll: true });
  if (option === enabled[0]?.element) {
    list.scrollTop = 0;
  } else if (option === enabled[enabled.length - 1]?.element) {
    list.scrollTop = list.scrollHeight;
  } else {
    // The list's scroll padding keeps room for the focus ring around the option.
    const { scrollPaddingTop, scrollPaddingBottom } = getComputedStyle(list);
    const box = option.getBoundingClientRect();
    const edge = list.getBoundingClientRect().top + list.clientTop;
    const top = edge + (parseFloat(scrollPaddingTop) || 0);
    const bottom = edge + list.clientHeight - (parseFloat(scrollPaddingBottom) || 0);
    if (box.top < top) list.scrollTop -= top - box.top;
    else if (box.bottom > bottom) list.scrollTop += box.bottom - bottom;
  }
}

const sameRecords = (a: ItemRecord[], b: ItemRecord[]) =>
  a.length === b.length &&
  a.every(
    (record, index) =>
      record.value === b[index]?.value &&
      record.disabled === b[index]?.disabled &&
      record.text === b[index]?.text,
  );

/** Hidden from people and assistive technology, but still part of the form and its validation. */
const visuallyHidden: CSSProperties = {
  position: "absolute",
  border: 0,
  inlineSize: 1,
  blockSize: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
};

/**
 * Root renders no element of its own, so it takes no ref, class name, or DOM props. Inside a form it
 * also renders a hidden native select, which submits the value under `name`.
 */
export interface SelectRootProps {
  /** Controlled selected value. Pair it with onValueChange. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  /** Called with the value of the item the user picks. */
  onValueChange?: (value: string) => void;
  /** Submitted with the surrounding form under this name, like a native select. */
  name?: string;
  /** Marks the select as required for form validation and announces it as such. */
  required?: boolean;
  /** Disables the trigger, so the list cannot open and the value cannot change. */
  disabled?: boolean;
  /** The Trigger and Content parts. */
  children?: ReactNode;
}

const Root = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  required,
  disabled = false,
  children,
}: SelectRootProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;
  // A form reset returns to the value the Select started with.
  const [initialValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [valueNode, setValueNode] = useState<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const nativeRef = useRef<HTMLSelectElement | null>(null);
  const contentId = useId();

  const { anchorRef, anchorStyle, popoverProps } = useAnchoredPopover<
    HTMLButtonElement,
    HTMLDivElement
  >({ side: "bottom", offset: SIDE_OFFSET, open });

  // Handlers registered outside React read the latest value and setter through these.
  const valueRef = useRef(value);
  const setValueRef = useRef<(next: string) => void>(() => {});
  const setValue = (next: string) => {
    if (next === valueRef.current) return;
    valueRef.current = next;
    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  };
  useEffect(() => {
    valueRef.current = value;
    setValueRef.current = setValue;
  });

  // Items register themselves, and the Root keeps a copy for the native select's options.
  const records = useRef(new Map<HTMLElement, ItemRecord>());
  const [nativeOptions, setNativeOptions] = useState<ItemRecord[]>([]);
  const getItems = useCallback(
    () =>
      Array.from(records.current, ([element, record]) => ({ element, ...record })).sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      ),
    [],
  );
  const syncNativeOptions = useCallback(() => {
    const next = getItems().map(({ value, disabled, text }) => ({ value, disabled, text }));
    setNativeOptions((previous) => (sameRecords(previous, next) ? previous : next));
  }, [getItems]);
  const registerItem = useCallback(
    (element: HTMLElement, record: ItemRecord) => {
      const previous = records.current.get(element);
      if (previous && sameRecords([previous], [record])) return;
      records.current.set(element, record);
      syncNativeOptions();
    },
    [syncNativeOptions],
  );
  const unregisterItem = useCallback(
    (element: HTMLElement) => {
      records.current.delete(element);
      syncNativeOptions();
    },
    [syncNativeOptions],
  );

  const listTypeahead = useTypeahead();
  const openList = () => {
    if (disabled) return;
    listTypeahead.reset();
    setOpen(true);
  };
  const closeList = ({ focusTrigger }: { focusTrigger: boolean }) => {
    if (focusTrigger) trigger?.focus({ preventScroll: true });
    setOpen(false);
  };
  const pick = (next: string) => {
    setValue(next);
    closeList({ focusTrigger: true });
  };

  // Opening moves focus onto the selected option, or the first one that can be picked.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list) return;
    const enabled = getItems().filter((item) => !item.disabled);
    const target = enabled.find((item) => item.value === value) ?? enabled[0];
    if (target) focusOption(list, target.element, enabled);
    else list.focus({ preventScroll: true });
  }, [open, value, getItems]);

  // A press anywhere outside the list closes it. The trigger handles its own presses.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (target && (listRef.current?.contains(target) || trigger?.contains(target))) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, trigger]);

  const form = trigger?.form ?? null;
  // Until the trigger mounts, assume a form, so server-rendered markup submits without JavaScript.
  const isFormControl = trigger ? form !== null : true;

  useEffect(() => {
    if (!form) return;
    const reset = () => setValueRef.current(initialValue ?? "");
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [form, initialValue]);

  // Each change is announced to the form with a change event from the native select, so a
  // Consumer's onChange on the form hears it the way it would from a native select.
  const announcedValue = useRef(value);
  const announcing = useRef(false);
  useEffect(() => {
    const select = nativeRef.current;
    if (announcedValue.current === value) return;
    announcedValue.current = value;
    if (!select) return;
    announcing.current = true;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    announcing.current = false;
  }, [value]);

  const context: SelectContextValue = {
    value,
    open,
    disabled,
    required,
    contentId,
    valueNode,
    setValueNode,
    setTrigger,
    listRef,
    anchorRef,
    anchorStyle,
    popoverRef: popoverProps.ref,
    popoverStyle: popoverProps.style,
    getItems,
    registerItem,
    unregisterItem,
    setValue,
    pick,
    openList,
    closeList,
    listTypeahead,
  };

  return (
    <SelectContext.Provider value={context}>
      {children}
      {isFormControl ? (
        // Carries the value, name, and required into the form, and takes a reset or autofill
        // back. The trigger is what people and assistive technology use, so this stays hidden.
        <select
          ref={nativeRef}
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={value ?? ""}
          onChange={(event) => {
            if (!announcing.current) setValue(event.target.value);
          }}
          style={visuallyHidden}
        >
          {nativeOptions.some((option) => option.value === "") ? null : <option value="" />}
          {nativeOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.text}
            </option>
          ))}
        </select>
      ) : null}
    </SelectContext.Provider>
  );
};

/**
 * The ref, `className`, and every other prop go to the button that carries the combobox role. It
 * shows the selected item's text, or the placeholder until one is picked, and the chevron. Name it
 * with a visible `label` pointed at its `id`, or with `aria-label`. Disable it through Root.
 */
export interface SelectTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "type" | "value"
> {
  /** Shown in the trigger until an item is picked. */
  placeholder?: ReactNode;
  /** Matches the TextField and Button heights. */
  size?: SelectSize;
}

const Trigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { placeholder, size = "md", className, style, onPointerDown, onClick, onKeyDown, ...props },
  ref,
) {
  const {
    value,
    open,
    disabled,
    required,
    contentId,
    anchorRef,
    anchorStyle,
    setTrigger,
    setValueNode,
    getItems,
    setValue,
    openList: openInContext,
    closeList,
  } = useSelectContext("Trigger");
  const triggerRef = useMemo(
    () => composeRefs(ref, anchorRef, setTrigger),
    [ref, anchorRef, setTrigger],
  );
  const typeahead = useTypeahead();
  // A mouse opens the list on press, so it can drag straight onto an option and release there.
  // Touch and pen open it on click, so a scroll that starts on the trigger opens nothing.
  const pointerType = useRef("touch");
  // A touch on the trigger while the list is open focuses the trigger, which closes the list, so
  // the click that follows must not open it again.
  const pressedWhileOpen = useRef(false);
  const showPlaceholder = isEmpty(value);

  const openList = () => {
    typeahead.reset();
    openInContext();
  };

  return (
    <button
      type="button"
      role="combobox"
      aria-controls={open ? contentId : undefined}
      aria-expanded={open}
      aria-required={required}
      aria-autocomplete="none"
      data-state={open ? "open" : "closed"}
      data-disabled={disabled ? "" : undefined}
      data-placeholder={showPlaceholder ? "" : undefined}
      data-size={size}
      disabled={disabled}
      className={["kui-select__trigger", className].filter(Boolean).join(" ")}
      {...props}
      ref={triggerRef}
      style={{ ...style, ...anchorStyle }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        pointerType.current = event.pointerType;
        pressedWhileOpen.current = open;
        if (event.pointerType !== "mouse" || event.button !== 0 || event.ctrlKey) return;
        // Cancelling the press also stops the browser focusing the trigger, so focus stays in the
        // list until closeList hands it over.
        event.preventDefault();
        if (open) closeList({ focusTrigger: true });
        else openList();
      }}
      onClick={(event) => {
        onClick?.(event);
        const wasOpen = pressedWhileOpen.current;
        pressedWhileOpen.current = false;
        if (event.defaultPrevented || pointerType.current === "mouse") return;
        if (wasOpen) closeList({ focusTrigger: true });
        else openList();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const wasTyping = typeahead.isTyping();
        // Typing on the closed trigger picks the match outright, the way a native select does.
        if (isPrintable(event)) {
          const enabled = getItems().filter((item) => !item.disabled);
          const current = enabled.find((item) => item.value === value);
          const match = findMatch(enabled, typeahead.type(event.key), current);
          if (match) setValue(match.value);
        }
        if (wasTyping && event.key === " ") return;
        if (OPEN_KEYS.includes(event.key)) {
          event.preventDefault();
          openList();
        }
      }}
    >
      <span ref={setValueNode} className="kui-select__value" style={{ pointerEvents: "none" }}>
        {/* The selected Item renders its text in here through a portal. The Fragment keeps React
            from writing the placeholder as the span's textContent, which would wipe that text. */}
        <Fragment key={showPlaceholder ? "placeholder" : "value"}>
          {showPlaceholder ? placeholder : null}
        </Fragment>
      </span>
      <span className="kui-select__icon" aria-hidden>
        <ChevronDownIcon />
      </span>
    </button>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the listbox role. It
 * renders in the browser's top layer, below the trigger or above it when there is no room, and at
 * least as wide as the trigger. A long list scrolls.
 */
export type SelectContentProps = HTMLAttributes<HTMLDivElement>;

const Content = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  { className, style, children, onKeyDown, onBlur, ...props },
  ref,
) {
  const context = useSelectContext("Content");
  const { open, listRef, popoverRef } = context;
  const contentRef = useMemo(
    () => composeRefs(ref, popoverRef, listRef),
    [ref, popoverRef, listRef],
  );
  const typeahead = context.listTypeahead;

  // Enter and Space reach the focused option first, which picks itself and prevents the default.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    const list = event.currentTarget;
    const items = context.getItems();
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.find((item) => item.element === event.target);
    const index = current ? enabled.indexOf(current) : -1;
    const moveTo = (item: ItemEntry | undefined) => {
      event.preventDefault();
      if (item) focusOption(list, item.element, enabled);
    };

    if (isPrintable(event)) {
      // Space would scroll the list.
      if (event.key === " ") event.preventDefault();
      const match = findMatch(enabled, typeahead.type(event.key), current);
      if (match) focusOption(list, match.element, enabled);
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        return moveTo(index === -1 ? enabled[0] : enabled[index + 1]);
      case "ArrowUp":
        return moveTo(index === -1 ? enabled[enabled.length - 1] : enabled[index - 1]);
      case "Home":
        return moveTo(enabled[0]);
      case "End":
        return moveTo(enabled[enabled.length - 1]);
      case "Escape":
        // Handled here, so a Dialog around the Select stays open.
        event.preventDefault();
        event.stopPropagation();
        context.closeList({ focusTrigger: true });
        return;
    }
  };

  // Focus moving anywhere outside the list closes it, whether by Tab, Shift+Tab, or a click.
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!open || (next instanceof Node && event.currentTarget.contains(next))) return;
    context.closeList({ focusTrigger: false });
  };

  return (
    <div
      role="listbox"
      id={context.contentId}
      tabIndex={-1}
      data-state={open ? "open" : "closed"}
      className={["kui-select__content", className].filter(Boolean).join(" ")}
      {...props}
      ref={contentRef}
      popover="manual"
      style={{ ...context.popoverStyle, ...style }}
      onKeyDown={compose(onKeyDown, handleKeyDown)}
      onBlur={compose(onBlur, handleBlur)}
    >
      {children}
    </div>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the option role. The
 * children are the option's text: they show in the list, and in the trigger once picked.
 */
export interface SelectItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Reported through onValueChange when this item is picked. */
  value: string;
  /** Keeps the item in the list but stops it being picked. Arrow keys and typeahead skip it. */
  disabled?: boolean;
  /** The option's text. */
  children: ReactNode;
}

const Item = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  {
    value,
    disabled = false,
    className,
    children,
    onFocus,
    onBlur,
    onKeyDown,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerLeave,
    ...props
  },
  ref,
) {
  const context = useSelectContext("Item");
  const { registerItem, unregisterItem, listRef } = context;
  const isSelected = context.value === value;
  const [highlighted, setHighlighted] = useState(false);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const composedRef = useMemo(() => composeRefs(ref, itemRef), [ref]);
  // A mouse picks on release, so a press on the trigger can drag straight onto an option.
  const pointerType = useRef("touch");

  useLayoutEffect(() => {
    const element = itemRef.current;
    if (element) registerItem(element, { value, disabled, text: element.textContent.trim() });
  });
  useLayoutEffect(() => {
    const element = itemRef.current;
    return () => {
      if (element) unregisterItem(element);
    };
  }, [unregisterItem]);

  const pick = () => {
    if (!disabled) context.pick(value);
  };
  const focusList = () => listRef.current?.focus({ preventScroll: true });

  return (
    // A disabled option leaves the focus order, as in a native select. The arrow keys and
    // typeahead skip it, and a press on it focuses the list instead.
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-state={isSelected ? "checked" : "unchecked"}
      data-highlighted={highlighted ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      tabIndex={disabled ? undefined : -1}
      className={["kui-select__item", className].filter(Boolean).join(" ")}
      {...props}
      ref={composedRef}
      onFocus={compose(onFocus, () => setHighlighted(true))}
      onBlur={compose(onBlur, () => setHighlighted(false))}
      onKeyDown={compose(onKeyDown, (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled || event.target !== event.currentTarget) return;
        // A space typed in the middle of a search is part of it, not a pick.
        if (event.key === " " && context.listTypeahead.isTyping()) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          pick();
        }
      })}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pointerType.current = event.pointerType;
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (!event.defaultPrevented && pointerType.current === "mouse") pick();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && pointerType.current !== "mouse") pick();
      }}
      // The option under a mouse takes focus, so hover and the arrow keys share one highlight.
      onPointerMove={(event) => {
        onPointerMove?.(event);
        pointerType.current = event.pointerType;
        if (event.defaultPrevented || event.pointerType !== "mouse") return;
        if (disabled) focusList();
        else if (document.activeElement !== event.currentTarget) {
          event.currentTarget.focus({ preventScroll: true });
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!event.defaultPrevented && document.activeElement === event.currentTarget) focusList();
      }}
    >
      <span>{children}</span>
      {isSelected ? (
        <span className="kui-select__item-indicator" aria-hidden>
          <CheckIcon />
        </span>
      ) : null}
      {isSelected && context.valueNode ? createPortal(children, context.valueNode) : null}
    </div>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the group role.
 */
export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading shown above the group's items. It is also the group's accessible name. */
  label: ReactNode;
}

const Group = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { label, className, children, ...props },
  ref,
) {
  const labelId = useId();
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className={["kui-select__group", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      <div id={labelId} className="kui-select__group-label">
        {label}
      </div>
      {children}
    </div>
  );
});

export {
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Content as SelectContent,
  Item as SelectItem,
  Group as SelectGroup,
};
