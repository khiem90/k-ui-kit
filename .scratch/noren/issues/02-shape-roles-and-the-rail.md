# 02: Shape roles and the Rail

**What to build:** A Consumer on Ridgeline sees nothing change, but can now give Buttons, Tab triggers, Checkbox boxes, and DataTable row ends their own radius, write a four-corner field radius such as `4px 4px 0 0`, write a four-side field border width such as `0 0 3px` to get an underlined field, and set a Rail width and colour to draw a bar along the top of every Tabs list and Dialog. Ridgeline sets the Rail width to 0, so it draws nothing today. This is the second half of the expand step and the first use of ADR 0006.

**Blocked by:** 01 (shares the Button and Tabs stylesheets)

**Status:** ready-for-agent

- [ ] The Ridgeline block declares radius button (999px), radius tab (999px), radius check (6px), radius row (12px), border width field (2px), rail width (0), and rail colour (Ember), with comments
- [ ] Button reads radius button, Tab triggers read radius tab, Checkbox reads radius check instead of half the field radius, and DataTable rows read radius row at their ends; radius pill is read only by Switch and the Dialog close button
- [ ] The TextField input and the Select trigger read border width field for the edge, and the hover, focus, error, and read-only rules still set only the border colour, so they apply to whichever sides have width
- [ ] No Token that may hold four values is read through `calc()` or a longhand corner or side property; radius field, radius tab, and border width field are the only three that may
- [ ] The Tabs list draws the Rail as a top border from rail width and rail colour, and the Dialog viewport draws the same Rail above its arch corners
- [ ] The Tokens Story lists the new roles, and a Story proves from computed style that a `:root` override setting rail width to 10px shows a bar on a Tabs list and on an open Dialog, that an override of border width field to `0 0 3px` leaves a rendered TextField with a 3px bottom border and no top border, and that an override of radius tab to `0 0 6px 6px` leaves a Tab trigger with square top corners
- [ ] The comment above the Ridgeline shape Tokens points at ADR 0006
- [ ] Every existing Story passes unchanged, and Ridgeline renders identically in Storybook; lint, typecheck, tests, and build pass
