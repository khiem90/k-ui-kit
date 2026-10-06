# 10: Dialog behaviour without Radix

**What to build:** A Consumer's Dialog runs on the native dialog element and behaves exactly as it does today: it traps focus, makes the page inert, locks scroll, closes on Escape and on an outside click, and returns focus to its trigger. It keeps today's look; Ridgeline styling is ticket 11.

**Blocked by:** 03 (Button), for the in-house Slot that Dialog.Trigger and Dialog.Close's `asChild` need

**Status:** ready-for-agent

- [x] Content is a native dialog element opened as modal, so focus is trapped, the page is inert, and the dialog renders in the top layer without a portal
- [x] Escape closes it through the cancel event, and controlled open state stays in sync
- [x] A pointer press outside the content box closes it
- [x] Page scroll is locked while it is open
- [x] Focus returns to the trigger on close
- [x] Title and Description are linked to the content through generated ids
- [x] Trigger and Close use the in-house Slot; Close without `asChild` still renders an icon button labelled "Close"
- [x] Parts expose the same data-state values as today, and today's Dialog CSS keeps working against them
- [x] `@radix-ui/react-dialog` is removed from the manifest and the lockfile
- [x] Existing Dialog Stories pass with their behavioural assertions unchanged; any Story that targeted Radix's overlay element is updated and the change is noted in this ticket's comments
- [x] axe passes on every Story; lint, typecheck, tests, and build pass

## Comments

2026-10-05: Implemented in bef2009 on branch ridgeline-10-dialog-behaviour. Dialog.Content renders a dialog element with an explicit `role="dialog"` and opens it with showModal in a layout effect. The browser traps focus, makes the page inert, and lifts the panel into the top layer from where it sits in the tree, so there is no portal. The panel mounts only while open, as it did under Radix, so a form inside starts fresh each time. `@radix-ui/react-dialog` is out of package.json and pnpm-lock.yaml.

The kit still does the parts the browser doesn't. Escape arrives as a keydown, which the kit handles because Stories send untrusted keys, and as the cancel event for real close requests. Both call onOpenChange and leave the closing to state, so a controlled open prop stays in charge. A close event from outside the kit, such as a form with method="dialog", reports false too. A primary press on the dialog element at a point outside its box closes it, since that is where a backdrop press lands. The kit cancels that pointerdown so the press doesn't move focus. Tab and Shift+Tab wrap at the ends of the panel. When the panel unmounts it calls close() and focuses the trigger, whatever closed it, defaultOpen included. Scroll lock is CSS alone, `body:has(.kui-dialog:modal) { overflow: hidden }`. Trigger and Close use the Slot from ticket 03. Trigger passes `type="button"`, aria-haspopup, aria-expanded, aria-controls while open, and data-state. Close without asChild is still the icon button named "Close". Title and Description get ids from useId unless the Consumer passes one, and the panel points aria-labelledby and aria-describedby at them only while they render, as Radix did.

Verified with `pnpm check`: lint, typecheck, 125 Story tests in Chromium with axe as an error, and the build and its verifier. I also drove the Default Story with real Playwright input at 1000px and 360px. A trusted Escape and a real backdrop click both closed it and focused the trigger. Real Tab went Delete, Close, Cancel, Delete. Body overflow was hidden while open. The panel measured 448px and 328px wide, as before. The screenshots matched today's look.

Story changes. ClosesOnOverlayClick clicked `.kui-dialog__overlay`, Radix's overlay element. It now presses the dialog element at a point outside the panel, through a `pressOnBackdrop` helper. One LongBody line depended on Radix markup. `queryByRole("button", { name: "Read the terms" })` was null only because Radix put aria-hidden on the rest of the page. Inert content does leave Chromium's accessibility tree, but testing-library doesn't model inert, so the line now calls `trigger.focus()` and expects the trigger not to take focus. PartsThroughRefs types its content ref as HTMLDialogElement. The helper comments that mentioned Radix and the portal are rewritten. A new NativeModal Story checks the dialog element, `:modal`, that it sits inside the canvas, the trigger's aria wiring, the id links, that a press inside the panel's box leaves it open, and that `requestClose()` goes through cancel and reports false.

Decisions a later ticket needs.
- The Content ref and props now type as HTMLDialogElement, so ticket 17's changeset should list it as a type change, like Checkbox and RadioGroup.
- `.kui-dialog__overlay` no longer exists. The overlay is `.kui-dialog::backdrop`, which reads `--kui-overlay` because ::backdrop inherits custom properties. Ticket 11 should style the backdrop there.
- The panel no longer has a closed state to animate, so the `[data-state="closed"]` rules, the exit keyframes, and the reduced-motion block are gone. Opening still animates the panel and the backdrop. Content always carries `data-state="open"` while mounted, which matches what a Consumer saw under Radix apart from the exit animation.
- Dialog.css resets the UA dialog box (padding 0, max-inline-size none) and hides `.kui-dialog:not([open])`, because its own `display: flex` would otherwise show a dialog the browser has closed. Ticket 11 should keep both.
- `src/slot.tsx` now exports `composeRefs`. Tickets 08 and 09 each wrote their own copy on their branches, and those could move to it.
- WithForm logs a "suspended inside an act scope" warning, and the Story still passes. When the form submit closes the dialog, focus moves to the trigger during React's commit, and user-event fires its emulated change on the text field through Storybook's act wrapper while act is already flushing. Radix returned focus in a setTimeout and never hit this. Returning focus synchronously is the right behaviour, so I left it.
