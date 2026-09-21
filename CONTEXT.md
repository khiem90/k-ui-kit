# k-ui-kit

A public React component library on npm. Components are accessible by default and styled with plain CSS so they work in any React framework.

## Language

**Consumer**:
A developer who installs k-ui-kit into their own React app.
_Avoid_: User, client, developer

**Component**:
A React element exported from the package's public entry.
_Avoid_: Widget, control

**Primitive**:
A headless Radix building block a component is built on. Never exported directly.
_Avoid_: Base, headless component

**Token**:
A CSS custom property holding a design value such as a colour or spacing step.
_Avoid_: Variable, theme value, design variable

**Story**:
A Storybook example of a component. Stories double as the component's tests.
_Avoid_: Example, demo, test case

**Theme**:
A complete set of token values. The kit ships light and dark; a consumer switches with `data-theme` or overrides individual tokens.
_Avoid_: Skin, mode, palette

**Simple component**:
A component used as a single element with flat props, such as Button or Switch.
_Avoid_: Atom, basic component

**Composite component**:
A component exposed as a namespace of parts the consumer assembles, such as Dialog.Root and Dialog.Trigger.
_Avoid_: Compound component, complex component, molecule
