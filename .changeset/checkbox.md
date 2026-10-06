---
"k-ui-kit": minor
---

Add Checkbox: a labelled native checkbox input with checked, unchecked, and indeterminate states, controlled or uncontrolled, that submits its name and value with the surrounding form. The kit draws a 22px box over the input, cream with a 2px edge when unchecked and Ember with a cream check or bar when checked or mixed. The indeterminate state sets the input's DOM property, so assistive technology reads it as mixed. The root carries `data-state` set to `checked`, `unchecked`, or `indeterminate`.

The ref and any extra props go to the input, so the ref is an `HTMLInputElement` and `CheckboxProps` extends `InputHTMLAttributes`. If you used a build from `main` before this release, it was an `HTMLButtonElement`, and a mixed box carried `aria-checked="mixed"` on a button.
