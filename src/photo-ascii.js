// Pure visual density symbols (no noisy alphanumeric letters) for sharper facial portraits
const RAMP = ' .,:;+*#%@';
export const PHOTO_COLS = 74;
export const PHOTO_ROWS = 21;

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
    if (lum > 0.8) return 'bright';
    if (lum > 0.52) return secondary;
    if (lum > 0.24) return primary;
    return 'muted';
  }

  // 'color' — map RGB hue to terminal phosphor palette
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.16) {
    return lum > 0.76 ? 'bright' : lum > 0.42 ? 'star' : 'muted';
  }
  if (r >= g && r >= b) {
    if (g > 150 && b < 110) return 'gold';
    if (g > 95 && b < 90) return 'orange';
    return 'rose';
  }
  if (g >= r && g >= b) {
    return b > 140 ? 'cyan' : 'green';
  }
  return r > 135 ? 'violet' : lum > 0.55 ? 'cyan' : 'blue';
}

/**
 * Converts an RGBA Uint8ClampedArray / Uint8Array (cols * rows * 4) into crisp ASCII rows + color codes.
 */
export function pixelsToAsciiGrid(rgba, cols = PHOTO_COLS, rows = PHOTO_ROWS, options = {}) {
  const {
    contrast = 1.55,
    style = 'emotion',
    primaryColor = 'rose',
    secondaryColor = 'gold',
  } = options;

  // 1. Compute raw luminance & stretch dynamic range
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

  const span = Math.max(0.12, maxLum - minLum);
  const norm = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    norm[i] = clampRange((lums[i] - minLum) / span, 0, 1);
  }

  // 2. Subtle local sharpening + high-range S-curve contrast for crisp facial features
  const asciiRows = [];
  const colorRows = [];
  const sharpStrength = 0.45;

  for (let y = 0; y < rows; y++) {
    let rowChars = '';
    let rowCols = '';
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      const cVal = norm[idx];
      const xm = Math.max(0, x - 1);
      const xp = Math.min(cols - 1, x + 1);
      const ym = Math.max(0, y - 1);
      const yp = Math.min(rows - 1, y + 1);
      const neighbors =
        (norm[y * cols + xm] + norm[y * cols + xp] + norm[ym * cols + x] + norm[yp * cols + x]) * 0.25;
      let val = clampRange(cVal + (cVal - neighbors) * sharpStrength, 0, 1);

      // Apply user-controlled contrast curve (supports up to 3.5x crisp contrast)
      val = clampRange((val - 0.5) * contrast + 0.5, 0, 1);
      // Gentle S-curve polish
      val = val * val * (3 - 2 * val);

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
 * Browser helper: draws an Image/HTMLImageElement onto an offscreen canvas.
 * Defaults to cover-crop (74x21) for big detailed portraits; when `fullImage` is true,
 * scales the complete uncropped image preserving aspect ratio.
 */
export function convertImageToAscii(img, options = {}) {
  const maxCols = options.cols || PHOTO_COLS;
  const maxRows = options.rows || PHOTO_ROWS;
  const fullImage = Boolean(options.fullImage);
  const charAspect = 0.52;

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;
  const srcRatio = srcW / Math.max(1, srcH);

  let cols = maxCols;
  let rows = maxRows;
  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (fullImage) {
    cols = Math.round((rows * srcRatio) / charAspect);
    if (cols > maxCols) {
      cols = maxCols;
      rows = Math.round((cols * charAspect) / srcRatio);
    }
    cols = clampRange(cols, 8, maxCols);
    rows = clampRange(rows, 4, maxRows);
  } else {
    const targetVisualRatio = (cols * charAspect) / rows;
    if (srcRatio > targetVisualRatio) {
      sw = srcH * targetVisualRatio;
      sx = (srcW - sw) * 0.5;
    } else {
      sh = srcW / targetVisualRatio;
      sy = (srcH - sh) * 0.28;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  const imgData = ctx.getImageData(0, 0, cols, rows).data;
  return pixelsToAsciiGrid(imgData, cols, rows, options);
}
