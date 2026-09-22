"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { CloseIcon } from "../../icons";

/** Root renders no element of its own, so it takes no ref, class name, or DOM props. */
export interface DialogRootProps {
  /** Controlled open state. Pair it with onOpenChange. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when the trigger, a close part, Escape, or the overlay changes it. */
  onOpenChange?: (open: boolean) => void;
  /** The Trigger and Content parts. */
  children?: ReactNode;
}

const Root = ({ children, ...props }: DialogRootProps) => (
  <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>
);

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
 * behind it render in a portal at the end of body, so no ancestor's overflow or stacking clips them.
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
        {children}
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

/**
 * Closes the dialog. On its own it is an icon button in the panel's top corner, named "Close" for
 * assistive technology. Give it a child element, such as a Button, and that element closes the
 * dialog instead, keeping its own look and its own accessible name.
 */
export interface DialogCloseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  /** One focusable element to close with in place of the icon button. It must forward its ref. */
  children?: ReactElement;
}

const Close = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { className, children, ...props },
  ref,
) {
  if (children) {
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

/**
 * A modal window over the page. Opening it moves focus inside and holds it there, the page behind
 * stops scrolling, and Escape or a click on the overlay closes it and returns focus to the trigger.
 */
export const Dialog = { Root, Trigger, Content, Title, Description, Close };
