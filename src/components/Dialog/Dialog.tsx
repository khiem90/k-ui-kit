"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { composeEventHandlers, composeRefs } from "../../compose.js";
import { useControllableState } from "../../controllable-state.js";
import { CloseIcon } from "../../icons.js";
import { Slot } from "../../slot.js";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  /** Focuses whichever element is the trigger at the moment of the call. */
  focusTrigger: () => void;
  contentId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(part: string): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) throw new Error(`Dialog.${part} must be rendered inside Dialog.Root.`);
  return context;
}

/** Title and Description report their ids to the open panel, which links them. */
interface PanelContextValue {
  setTitleId: (id: string | undefined) => void;
  setDescriptionId: (id: string | undefined) => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

/** Root renders no element of its own, so it takes no ref, class name, or DOM props. */
export interface DialogRootProps {
  /** Controlled open state. Pair it with onOpenChange. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when a part, Escape, or the overlay changes it. */
  onOpenChange?: (open: boolean) => void;
  /** The Trigger and Content parts. */
  children?: ReactNode;
}

const Root = ({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogRootProps) => {
  const [open, setOpenState] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = useRef<HTMLElement>(null);
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (next !== open) setOpenState(next);
    },
    [open, setOpenState],
  );

  const focusTrigger = useCallback(() => triggerRef.current?.focus(), []);

  const context = useMemo(
    () => ({ open, setOpen, triggerRef, focusTrigger, contentId }),
    [open, setOpen, focusTrigger, contentId],
  );

  return <DialogContext.Provider value={context}>{children}</DialogContext.Provider>;
};

/**
 * The child is the trigger and receives the ref, the click handler, and the aria wiring. It keeps
 * its own look, so a Consumer passes the Button or link they already style.
 */
export interface DialogTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** The trigger: one focusable element such as a Button. It must forward its ref. */
  children: ReactElement;
}

const Trigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
  { children, onClick, ...props },
  ref,
) {
  const { open, setOpen, triggerRef, contentId } = useDialogContext("Trigger");
  const composedRef = useMemo(() => composeRefs(ref, triggerRef), [ref, triggerRef]);
  return (
    <Slot
      ref={composedRef}
      {...{ type: "button" }}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      data-state={open ? "open" : "closed"}
      {...props}
      onClick={composeEventHandlers(onClick, () => setOpen(!open))}
    >
      {children}
    </Slot>
  );
});

/**
 * The ref, `className`, and every other prop go to the dialog panel, a native dialog element. It
 * opens as a modal in the browser's top layer, so no ancestor's overflow or stacking clips it, and
 * the page behind it is inert. The children scroll inside the panel, which leaves the Close part
 * in the corner however far they scroll.
 */
export type DialogContentProps = HTMLAttributes<HTMLDialogElement>;

const Content = forwardRef<HTMLDialogElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const { open } = useDialogContext("Content");
    // The panel mounts only while open, so the children start fresh each time, as they always have.
    return open ? <Panel {...props} forwardedRef={ref} /> : null;
  },
);

interface PanelProps extends DialogContentProps {
  forwardedRef: ForwardedRef<HTMLDialogElement>;
}

function Panel({
  forwardedRef,
  className,
  children,
  onKeyDown,
  onPointerDown,
  ...props
}: PanelProps) {
  const { setOpen, focusTrigger, contentId } = useDialogContext("Content");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const ref = useMemo(() => composeRefs(forwardedRef, dialogRef), [forwardedRef]);

  const [titleId, setTitleId] = useState<string>();
  const [descriptionId, setDescriptionId] = useState<string>();
  // False once the panel starts to unmount. React runs the panel's cleanup before its children's,
  // so a Title leaving with the panel skips a state update that nothing would read.
  const mountedRef = useRef(true);
  const parts = useMemo<PanelContextValue>(
    () => ({
      setTitleId: (id) => {
        if (mountedRef.current) setTitleId(id);
      },
      setDescriptionId: (id) => {
        if (mountedRef.current) setDescriptionId(id);
      },
    }),
    [],
  );

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    mountedRef.current = true;
    // showModal makes the page inert, puts the panel in the top layer, and focuses the first
    // focusable element inside it.
    if (!dialog.open) dialog.showModal();
    return () => {
      mountedRef.current = false;
      if (dialog.open) dialog.close();
      // Focus goes back to the trigger however the dialog closed, even when it opened by default
      // and the trigger never had focus.
      focusTrigger();
    };
  }, [focusTrigger]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // The browser turns a real Escape into a cancel event, handled below. Handling the key here
    // too covers a script's keydown, and preventing it stops the browser asking a second time.
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      wrapTab(event);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    // A press on the backdrop lands on the dialog element itself, outside the panel's box.
    const dialog = event.currentTarget;
    if (event.target !== dialog || event.button !== 0 || event.ctrlKey) return;
    const box = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= box.left &&
      event.clientX <= box.right &&
      event.clientY >= box.top &&
      event.clientY <= box.bottom;
    if (inside) return;
    // Keeps the press from moving focus, which goes back to the trigger as the dialog closes.
    event.preventDefault();
    setOpen(false);
  };

  return (
    // The explicit role keeps the dialog role on the element the ref and the role query reach,
    // the same as before the native element.
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <dialog
      ref={ref}
      role="dialog"
      id={contentId}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-state="open"
      className={["kui-dialog", className].filter(Boolean).join(" ")}
      {...props}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      onPointerDown={composeEventHandlers(onPointerDown, handlePointerDown)}
      onCancel={(event) => {
        // The browser would close the dialog on its own. Closing through state keeps a controlled
        // open prop in charge.
        event.preventDefault();
        setOpen(false);
      }}
      onClose={(event) => {
        // Something closed the dialog without the kit, such as a form with method="dialog".
        if (!event.currentTarget.open) setOpen(false);
      }}
    >
      <div className="kui-dialog__viewport">
        <PanelContext.Provider value={parts}>{children}</PanelContext.Provider>
      </div>
    </dialog>
  );
}

const TABBABLE = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "iframe",
  "summary",
  "audio[controls]",
  "video[controls]",
  '[contenteditable]:not([contenteditable="false"])',
  "[tabindex]",
].join(",");

function getTabbables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(TABBABLE)).filter((element) => {
    if (element.tabIndex < 0 || element.matches(":disabled")) return false;
    if (!element.checkVisibility({ visibilityProperty: true })) return false;
    // In a radio group with a checked radio, only that radio is a Tab stop.
    if (
      element instanceof HTMLInputElement &&
      element.type === "radio" &&
      element.name &&
      !element.checked
    ) {
      const name = CSS.escape(element.name);
      return !container.querySelector(`input[type="radio"][name="${name}"]:checked`);
    }
    return true;
  });
}

/**
 * Keeps Tab inside the panel by wrapping at either end. The browser already skips the inert page,
 * but from the last control it would move on to its own address bar.
 */
function wrapTab(event: KeyboardEvent<HTMLDialogElement>) {
  const dialog = event.currentTarget;
  const tabbables = getTabbables(dialog);
  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

/** Reports a part's id to the panel while the part is mounted, so the panel can point at it. */
function useLinkedId(part: "Title" | "Description", idProp: string | undefined) {
  useDialogContext(part);
  const panel = useContext(PanelContext);
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const register = part === "Title" ? panel?.setTitleId : panel?.setDescriptionId;
  useLayoutEffect(() => {
    register?.(id);
    return () => register?.(undefined);
  }, [id, register]);
  return id;
}

/**
 * The ref, `className`, and every other prop go to the heading. Every dialog needs one: it is the
 * dialog's accessible name. To keep it for assistive technology without showing it, hide it in CSS.
 */
export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

const Title = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, id, children, ...props },
  ref,
) {
  const titleId = useLinkedId("Title", id);
  return (
    <h2
      ref={ref}
      id={titleId}
      className={["kui-dialog__title", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </h2>
  );
});

/**
 * The ref, `className`, and every other prop go to the paragraph. It is read as the dialog's
 * description, so it says what the dialog is for in a sentence.
 */
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const Description = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, id, ...props }, ref) {
    const descriptionId = useLinkedId("Description", id);
    return (
      <p
        ref={ref}
        id={descriptionId}
        className={["kui-dialog__description", className].filter(Boolean).join(" ")}
        {...props}
      />
    );
  },
);

interface DialogCloseIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  asChild?: false;
  children?: never;
}

interface DialogCloseAsChildProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** Render the child element in place of the icon button, so it closes the dialog and keeps its own look. */
  asChild: true;
  children: ReactElement;
}

/**
 * Closes the dialog. On its own it is an icon button in the panel's top corner, named "Close" for
 * assistive technology, and `asChild` swaps in an element of the Consumer's own instead.
 */
export type DialogCloseProps = DialogCloseIconProps | DialogCloseAsChildProps;

const Close = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { asChild = false, className, children, onClick, ...props },
  ref,
) {
  const { setOpen } = useDialogContext("Close");
  const handleClick = composeEventHandlers(onClick, () => setOpen(false));

  if (asChild) {
    return (
      <Slot
        ref={ref}
        {...{ type: "button" }}
        className={className}
        {...props}
        onClick={handleClick}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={["kui-dialog__close", className].filter(Boolean).join(" ")}
      aria-label="Close"
      {...props}
      onClick={handleClick}
    >
      <CloseIcon />
    </button>
  );
});

export {
  Root as DialogRoot,
  Trigger as DialogTrigger,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClose,
};
