/**
 * Generates the PWA icons for Winter Arc.
 *
 * The mark is a rising arc with a dot at its leading end — the arc of a season
 * of work, and where you are along it. Drawn as pixel maths rather than
 * rasterizing an SVG so there is no native image dependency; 4x supersampling
 * keeps the curve smooth instead of stair-stepped.
 *
 * The same geometry is described as an SVG path in src/components/layout/logo.tsx.
 * If you change one, change the other.
 *
 * Two sizes because that is what installability wants: 192 for the launcher,
 * 512 for splash screens. The maskable copy adds the safe-zone padding Android
 * needs so the mark is not clipped when the launcher applies its own shape.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';

const BG = [10, 10, 10];
const FG = [250, 250, 250];

/** Supersampling factor. 4x is plenty for a curve at these sizes. */
const SS = 4;

/**
 * Coverage of the mark at a point, in unit coordinates where the icon spans
 * 0..1 on both axes and y grows downward.
 */
function markHit(x, y, scale) {
  // Arc centre sits low so the dome fills the upper two thirds.
  const cx = 0.5;
  const cy = 0.6;

  const rOuter = 0.42 * scale;
  const rInner = 0.3 * scale;
  const rMid = (rOuter + rInner) / 2;
  const capR = (rOuter - rInner) / 2;

  const dx = x - cx;
  const dy = y - cy;
  const r = Math.hypot(dx, dy);

  // Angle measured with y up, so the dome is the 0..180 half.
  const angle = Math.atan2(-dy, dx);

  const START = (22 * Math.PI) / 180;
  const END = (168 * Math.PI) / 180;

  // Arc body.
  if (r >= rInner && r <= rOuter && angle >= START && angle <= END) return true;

  // Round caps at both ends, so neither terminus looks sawn off.
  for (const theta of [START, END]) {
    const capX = cx + rMid * Math.cos(theta);
    const capY = cy - rMid * Math.sin(theta);
    if (Math.hypot(x - capX, y - capY) <= capR) return true;
  }

  // A detached dot continuing past the right end: where you are along the arc.
  // Kept clearly separate from the cap, or it just reads as a rounded end.
  const dotTheta = (-14 * Math.PI) / 180;
  const dotX = cx + rMid * Math.cos(dotTheta);
  const dotY = cy - rMid * Math.sin(dotTheta);
  if (Math.hypot(x - dotX, y - dotY) <= capR * 1.02) return true;

  return false;
}

function drawIcon(size, { maskable = false } = {}) {
  const png = new PNG({ width: size, height: size });

  // Maskable icons must keep their content inside the middle ~80%, because the
  // launcher can crop to a circle or squircle.
  const scale = maskable ? 0.74 : 1;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let hits = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          if (markHit(x, y, scale)) hits++;
        }
      }

      const coverage = hits / (SS * SS);
      const i = (size * py + px) << 2;

      // Blend the mark over the ground by coverage — this is the anti-aliasing.
      png.data[i] = Math.round(BG[0] + (FG[0] - BG[0]) * coverage);
      png.data[i + 1] = Math.round(BG[1] + (FG[1] - BG[1]) * coverage);
      png.data[i + 2] = Math.round(BG[2] + (FG[2] - BG[2]) * coverage);
      png.data[i + 3] = 255;
    }
  }

  return PNG.sync.write(png);
}

const outDir = path.join(process.cwd(), 'public', 'icons');
await mkdir(outDir, { recursive: true });

const targets = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['icon-maskable-192.png', 192, { maskable: true }],
  ['icon-maskable-512.png', 512, { maskable: true }],
];

for (const [name, size, opts] of targets) {
  await writeFile(path.join(outDir, name), drawIcon(size, opts));
}

// Favicon duty for browser tabs.
await writeFile(path.join(process.cwd(), 'public', 'apple-icon.png'), drawIcon(180));

console.log(`[icons] Wrote ${targets.length + 1} Winter Arc icons to public/icons`);
