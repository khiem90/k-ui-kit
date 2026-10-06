# k-ui-kit

A public React component library on npm. Components are accessible by default and styled with plain CSS so they work in any React framework.

## Language

**Consumer**:
A developer who installs k-ui-kit into their own React app.
_Avoid_: User, client, developer

**Component**:
A React element exported from the package's public entry.
_Avoid_: Widget, control

**Token**:
A CSS custom property holding a design value such as a colour or spacing step.
_Avoid_: Variable, theme value, design variable

**Story**:
A Storybook example of a component. Stories double as the component's tests.
_Avoid_: Example, demo, test case

**Theme**:
A named visual identity, expressed as a complete set of Token values for colour, type, shape and depth. Ridgeline is the default, and Noren is the second, which a Consumer opts into.
_Avoid_: Skin, look, style, design system

**Color scheme**:
The light or dark variant of a Theme. Ridgeline and Noren each have a light Color scheme only.
_Avoid_: Mode, theme, appearance

**Rail**:
The bar a Theme may draw along the top edge of a Tabs list or a Dialog, like the rod a shop curtain hangs from. A Theme without one sets its width to zero.
_Avoid_: Rod, bar, border-top

**Simple component**:
A component used as a single element with flat props, such as Button or Switch.
_Avoid_: Atom, basic component

**Composite component**:
A component exposed as a namespace of parts the consumer assembles, such as Dialog.Root and Dialog.Trigger.
_Avoid_: Compound component, complex component, molecule
