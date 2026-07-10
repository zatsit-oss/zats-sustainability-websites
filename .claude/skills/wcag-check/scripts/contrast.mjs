// WCAG 2.1 relative-luminance contrast. No dependencies.
// Usage: node contrast.mjs "#7c3aed" "#f8fafc"
//   or:  import { contrast, over } from './contrast.mjs'
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

/** Contrast ratio between two opaque hex colors (e.g. 4.53). */
export const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/** Composite `hex` at `alpha` (0..1) over an opaque `base` — for `color-mix(... N%, transparent)`. */
export const over = (hex, alpha, base) => {
  const p = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
  const f = p(parseInt(hex.slice(1), 16));
  const b = p(parseInt(base.slice(1), 16));
  const o = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return '#' + o.map((x) => x.toString(16).padStart(2, '0')).join('');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , fg, bg] = process.argv;
  if (fg && bg) {
    const r = contrast(fg, bg);
    const aa = r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large/UI-only' : 'FAIL';
    console.log(`${fg} on ${bg} = ${r.toFixed(2)}:1  [${aa}]`);
  } else {
    console.log('Usage: node contrast.mjs "#rrggbb" "#rrggbb"');
  }
}
