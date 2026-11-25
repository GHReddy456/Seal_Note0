const RAMP = ' .,:;i1tfLCG08@';
export const PHOTO_COLS = 58;
export const PHOTO_ROWS = 20;

const COLOR_TO_CHAR = {
  '': 'w',
  dim: 'd',
  muted: 'm',
  star: 's',
  white: 'w',
  bright: 'b',
  rose: 'r',
  gold: 'g',
  cyan: 'c',
  blue: 'l',
  violet: 'v',
  orange: 'o',
  green: 'n',
};

export const CHAR_TO_COLOR = Object.fromEntries(
  Object.entries(COLOR_TO_CHAR).map(([k, v]) => [v, k])
);

function clampRange(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rgbToTerminalColor(r, g, b, lum, { style = 'emotion', primary = 'rose', secondary = 'gold' } = {}) {
  if (lum < 0.08) return 'dim';
  if (style === 'emotion') {
    if (lum > 0.82) return 'bright';
    if (lum > 0.56) return secondary;
    if (lum > 0.28) return primary;
    return 'muted';
  }
  if (style === 'sketch') {
    return lum > 0.65 ? 'bright' : lum > 0.35 ? primary : 'dim';
  }

  // 'color' — map RGB hue to terminal phosphor palette
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.18) {
    return lum > 0.78 ? 'bright' : lum > 0.45 ? 'star' : 'muted';
  }
  if (r >= g && r >= b) {
    if (g > 150 && b < 110) return 'gold';
    if (g > 95 && b < 90) return 'orange';
    return b > 120 ? 'rose' : 'rose';
  }
  if (g >= r && g >= b) {
    return b > 140 ? 'cyan' : 'green';
  }
  return r > 135 ? 'violet' : lum > 0.55 ? 'cyan' : 'blue';
}

/**
 * Converts an RGBA Uint8ClampedArray / Uint8Array (cols * rows * 4) into compact ASCII rows + color codes.
 */
export function pixelsToAsciiGrid(rgba, cols = PHOTO_COLS, rows = PHOTO_ROWS, options = {}) {
  const {
    contrast = 1.25,
    invert = false,
    style = 'emotion',
    primaryColor = 'rose',
    secondaryColor = 'gold',
  } = options;

  // Compute raw luminance buffer & auto-normalize dynamic range
  const lums = new Float32Array(cols * rows);
  let minLum = 1;
  let maxLum = 0;

  for (let i = 0; i < cols * rows; i++) {
    const o = i * 4;
    const lum = (0.299 * rgba[o] + 0.587 * rgba[o + 1] + 0.114 * rgba[o + 2]) / 255;
    lums[i] = lum;
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const span = Math.max(0.15, maxLum - minLum);
  const norm = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    let v = (lums[i] - minLum) / span;
    v = clampRange((v - 0.5) * contrast + 0.5, 0, 1);
    if (invert) v = 1 - v;
    norm[i] = v;
  }

  // Optional Sobel edge magnitude for 'sketch' style
  const asciiRows = [];
  const colorRows = [];

  for (let y = 0; y < rows; y++) {
    let rowChars = '';
    let rowCols = '';
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      let val = norm[idx];

      if (style === 'sketch') {
        const xm = Math.max(0, x - 1);
        const xp = Math.min(cols - 1, x + 1);
        const ym = Math.max(0, y - 1);
        const yp = Math.min(rows - 1, y + 1);
        const gx = norm[y * cols + xp] - norm[y * cols + xm];
        const gy = norm[yp * cols + x] - norm[ym * cols + x];
        val = clampRange(Math.sqrt(gx * gx + gy * gy) * 2.1, 0, 1);
      }

      const rampIdx = Math.min(RAMP.length - 1, Math.floor(val * (RAMP.length - 0.001)));
      const ch = RAMP[rampIdx];
      const o = idx * 4;
      const termCol = rgbToTerminalColor(rgba[o], rgba[o + 1], rgba[o + 2], val, {
        style,
        primary: primaryColor,
        secondary: secondaryColor,
      });

      rowChars += ch;
      rowCols += COLOR_TO_CHAR[termCol] || 'w';
    }
    asciiRows.push(rowChars);
    colorRows.push(rowCols);
  }

  return {
    w: cols,
    h: rows,
    r: asciiRows,
    c: colorRows,
  };
}

/**
 * Browser helper: draws an Image/HTMLImageElement with cover-crop onto an offscreen canvas
 * (compensating for monospace character aspect ratio) and converts to ASCII portrait data.
 */
export function convertImageToAscii(img, options = {}) {
  const cols = options.cols || PHOTO_COLS;
  const rows = options.rows || PHOTO_ROWS;
  const charAspect = 0.52; // monospace char width / height

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const targetVisualRatio = (cols * charAspect) / rows;
  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  const srcRatio = srcW / srcH;

  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (srcRatio > targetVisualRatio) {
    sw = srcH * targetVisualRatio;
    sx = (srcW - sw) * 0.5;
  } else {
    sh = srcW / targetVisualRatio;
    // Slight upper bias (0.3) so portraits keep eyes/head framed nicely
    sy = (srcH - sh) * 0.28;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  const imgData = ctx.getImageData(0, 0, cols, rows).data;
  return pixelsToAsciiGrid(imgData, cols, rows, options);
}
