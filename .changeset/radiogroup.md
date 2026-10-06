---
"k-ui-kit": minor
---

Add RadioGroup: a composite Component with Root, Item, and Label parts built on native radio inputs that share one name. The browser gives the group one Tab stop, which lands on the selected item, and arrow keys move the selection and skip disabled items. The selected value submits with the surrounding form under the group's name, or a generated one, so two groups on a page never share a selection. Controlled or uncontrolled, with a vertical or horizontal layout. Each item is a 22px circle the kit draws over the input, Ember with a cream dot when selected.

Each Item's ref and extra props go to its input, so the ref is an `HTMLInputElement`. If you used a build from `main` before this release, it was an `HTMLButtonElement`. A form reset now returns an uncontrolled group to its `defaultValue`, as native radios do, where it used to clear the selection. The root no longer sets `dir="ltr"`, so the group takes its direction from the page.
