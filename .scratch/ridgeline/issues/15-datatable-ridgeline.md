# 15: DataTable Ridgeline styling

**What to build:** A Consumer's DataTable sits in a cream card and separates rows with tone instead of grid lines, following "layer, don't outline".

**Blocked by:** 01 (Ridgeline Tokens and Storybook canvas), 14 (DataTable behaviour without TanStack Table)

**Status:** ready-for-agent

- [ ] The table sits in a surface raised container with the card radius
- [ ] Header cells and sort buttons use the label style, keeping the existing direction indicator
- [ ] Rows alternate surface raised and a light apricot tone, with no grid lines
- [ ] Hovered and selected rows use Peach sky, and text on them keeps at least 4.5:1
- [ ] Pagination controls use the Ridgeline Button
- [ ] DataTable's CSS reads only the new Token names
- [ ] axe passes on every Story; lint, typecheck, tests, and build pass
