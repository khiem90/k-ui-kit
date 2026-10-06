---
"k-ui-kit": minor
---

Add Dialog: a composite Component with Root, Trigger, Content, Title, Description, and Close parts, built on the native dialog element opened as a modal. Opening it moves focus into the panel and holds it there, the page behind goes inert and stops scrolling, and Escape, a press on the backdrop, and the close button each close it and return focus to the trigger. It renders in the top layer, so no portal is needed. Controlled or uncontrolled, with an open animation that drops out under reduced motion. The panel is cream with an arched top capped at half its width, a centred Fraunces italic title in Ember, and a round close button inside the arch. The `--kui-overlay` Token colours the backdrop.

`Dialog.Content` renders the dialog element, so its ref is an `HTMLDialogElement`. The surface is drawn on its child `.kui-dialog__viewport`, so target that class to restyle the background, shadow, or corners. The backdrop is `.kui-dialog::backdrop`. The dialog uses inline-size containment for the arch, so give it a definite width if you change it. The default is `28rem`, kept inside the window.

If you used a build from `main` before this release, the ref was an `HTMLDivElement`, the surface sat on `.kui-dialog` itself, the overlay was a `.kui-dialog__overlay` element, and the panel animated out on close.
