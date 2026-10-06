// Helpers for Stories that read computed style. Stories import them, the package does not, so
// nothing here reaches dist.

/**
 * An element's computed style with every running animation finished first, so a reading taken
 * right after a change lands past its transition rather than inside it.
 */
export function settledStyle(element: Element) {
  for (const animation of element.getAnimations()) animation.finish();
  return getComputedStyle(element);
}

/**
 * Sets the given custom properties on the html element's own style, as a Consumer's :root rule
 * would, runs `read` under them, and removes them again. The reads happen before the cleanup, so
 * a failed assertion on the result never leaks an override into the next Story.
 */
export async function withRootOverrides<T>(
  overrides: Record<string, string>,
  read: () => T | Promise<T>,
): Promise<T> {
  const root = document.documentElement.style;
  for (const [name, value] of Object.entries(overrides)) root.setProperty(name, value);
  try {
    return await read();
  } finally {
    for (const name of Object.keys(overrides)) root.removeProperty(name);
  }
}
