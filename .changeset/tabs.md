---
"k-ui-kit": minor
---

Add Tabs: a composite Component with Root, List, Trigger, and Content parts. Arrow keys move between tabs and activate the one they land on, Home and End jump to the first and last, disabled tabs are skipped, and only the active panel is in the Tab order. Controlled or uncontrolled, with a horizontal or vertical layout. The list is a cream pill track and the active tab an Ember pill.

Left and Right swap when the list's direction is right to left, so `dir="rtl"` on a parent works. If you used a build from `main` before this release, the root set `dir="ltr"` itself, and the tablist took focus when no tab was active. Now the first enabled tab takes that Tab stop.
