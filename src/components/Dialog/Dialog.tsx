"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { CloseIcon } from "../../icons.js";

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

const Root = (props: DialogRootProps) => <DialogPrimitive.Root {...props} />;

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
  { children, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Trigger ref={ref} asChild {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
});

/**
 * The ref, `className`, and every other prop go to the dialog panel. The panel and the overlay
 * behind it render in a portal at the end of body, so no ancestor's overflow or stacking clips
 * them. The children scroll inside the panel, which leaves the Close part in the corner however
 * far they scroll.
 */
export type DialogContentProps = HTMLAttributes<HTMLDivElement>;

const Content = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, children, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="kui-dialog__overlay" />
      <DialogPrimitive.Content
        ref={ref}
        className={["kui-dialog", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="kui-dialog__viewport">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

/**
 * The ref, `className`, and every other prop go to the heading. Every dialog needs one: it is the
 * dialog's accessible name. To keep it for assistive technology without showing it, hide it in CSS.
 */
export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

const Title = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={["kui-dialog__title", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

/**
 * The ref, `className`, and every other prop go to the paragraph. It is read as the dialog's
 * description, so it says what the dialog is for in a sentence.
 */
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const Description = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <DialogPrimitive.Description
        ref={ref}
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
  { asChild = false, className, children, ...props },
  ref,
) {
  if (asChild) {
    return (
      <DialogPrimitive.Close ref={ref} asChild className={className} {...props}>
        {children}
      </DialogPrimitive.Close>
    );
  }

  return (
    <DialogPrimitive.Close
      ref={ref}
      className={["kui-dialog__close", className].filter(Boolean).join(" ")}
      aria-label="Close"
      {...props}
    >
      <CloseIcon />
    </DialogPrimitive.Close>
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
