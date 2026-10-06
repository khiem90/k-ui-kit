// Colour helpers for Stories that check WCAG contrast. Stories import them, the package does not,
// so nothing here reaches dist.

export type RGB = [number, number, number];

/**
 * A computed colour as sRGB channels from 0 to 255. Accepts `rgb()` and the `color(srgb ...)` that
 * color-mix computes to. Fails on a translucent colour, whose contrast depends on what is under it.
 */
export function toRGB(computed: string): RGB {
  const isRGB = computed.startsWith("rgb");
  const isSRGB = computed.startsWith("color(srgb ");
  const [r, g, b, alpha = 1] =
    computed
      .replace("color(srgb ", "")
      .match(/[\d.e-]+/g)
      ?.map(Number) ?? [];
  if (!(isRGB || isSRGB) || r === undefined || g === undefined || b === undefined) {
    throw new Error(`${computed} is not an sRGB colour`);
  }
  if (alpha !== 1) {
    throw new Error(`${computed} is translucent, so its contrast depends on what is under it`);
  }
  const scale = isSRGB ? 255 : 1;
  return [r * scale, g * scale, b * scale].map((channel) => Math.round(channel)) as RGB;
}

/** Resolves a colour Token through the browser, as it applies inside the given element. */
export function colourIn(element: Element, name: string): RGB {
  const probe = document.createElement("span");
  probe.style.color = `var(${name})`;
  element.append(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  return toRGB(computed);
}

/** Resolves a colour Token through the browser, as the root defines it. */
export const tokenColour = (name: string) => colourIn(document.body, name);

/** WCAG 2 relative luminance. */
export function luminance(colour: RGB) {
  const [R, G, B] = colour.map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as RGB;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** WCAG 2 contrast ratio, from 1 to 21. */
export function contrast(a: RGB, b: RGB) {
  const light = Math.max(luminance(a), luminance(b));
  const dark = Math.min(luminance(a), luminance(b));
  return (light + 0.05) / (dark + 0.05);
}
