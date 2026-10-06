# 10: Dialog behaviour without Radix

**What to build:** A Consumer's Dialog runs on the native dialog element and behaves exactly as it does today: it traps focus, makes the page inert, locks scroll, closes on Escape and on an outside click, and returns focus to its trigger. It keeps today's look; Ridgeline styling is ticket 11.

**Blocked by:** 03 (Button), for the in-house Slot that Dialog.Trigger and Dialog.Close's `asChild` need

**Status:** ready-for-agent

- [ ] Content is a native dialog element opened as modal, so focus is trapped, the page is inert, and the dialog renders in the top layer without a portal
- [ ] Escape closes it through the cancel event, and controlled open state stays in sync
- [ ] A pointer press outside the content box closes it
- [ ] Page scroll is locked while it is open
- [ ] Focus returns to the trigger on close
- [ ] Title and Description are linked to the content through generated ids
- [ ] Trigger and Close use the in-house Slot; Close without `asChild` still renders an icon button labelled "Close"
- [ ] Parts expose the same data-state values as today, and today's Dialog CSS keeps working against them
- [ ] `@radix-ui/react-dialog` is removed from the manifest and the lockfile
- [ ] Existing Dialog Stories pass with their behavioural assertions unchanged; any Story that targeted Radix's overlay element is updated and the change is noted in this ticket's comments
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
