// Auto-generated from src/*.js so the app runs cleanly on both http:// and file://
(function () {
'use strict';
// ===== src/emotions.js =====
/**
 * Canonical definitions for supported emotional terminal experiences.
 * Shared across encryption metadata, UI theming, audio synthesis, and ASCII scenes.
 */
const EMOTIONS = {
  love: {
    id: 'love',
    label: 'Love',
    icon: '♥',
    miniArt: [' ✦  .♥.  ✦ ', '  o-♥-o   ', ' ~ starry ~ '],
    tagline: 'Two hearts walking through starlight into one embrace',
    accent: '#ff5e8a',
    secondary: '#ffd166',
    glow: 'rgba(255, 94, 138, 0.42)',
    tint: 'rgba(255, 94, 138, 0.08)',
    durationFrames: 408, // 17s @ 24fps
    acts: [
      { at: 0, title: 'ACT I // TWO QUIET SKIES' },
      { at: 96, title: 'ACT II // DRAWN CLOSER' },
      { at: 216, title: 'ACT III // UNDER ONE SKY' },
      { at: 320, title: 'ACT IV // HEARTBEAT' },
    ],
  },
  happiness: {
    id: 'happiness',
    label: 'Happiness',
    icon: '✦',
    miniArt: [' * ✺ * ✦ ', ' \\o/ ^o^ ', ' == ♪ ♫ == '],
    tagline: 'Dancing joy, floating confetti & skyward fireworks',
    accent: '#ffd166',
    secondary: '#4cc9f0',
    glow: 'rgba(255, 209, 102, 0.42)',
    tint: 'rgba(255, 209, 102, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // THE SPARK' },
      { at: 96, title: 'ACT II // RHYTHM & CONFETTI' },
      { at: 204, title: 'ACT III // LAUNCHING LIGHTS' },
      { at: 300, title: 'ACT IV // SKY IN BLOOM' },
    ],
  },
  sadness: {
    id: 'sadness',
    label: 'Sadness',
    icon: '☁',
    miniArt: [' .-(~~~)-. ', ' / / o o / ', ' ~ _/| | _ '],
    tagline: 'Sitting in heavy rain until someone shares an umbrella',
    accent: '#6ea8fe',
    secondary: '#ffd166',
    glow: 'rgba(110, 168, 254, 0.4)',
    tint: 'rgba(110, 168, 254, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // HEAVY SILENCE' },
      { at: 100, title: 'ACT II // ALONE IN THE RAIN' },
      { at: 216, title: 'ACT III // FOOTSTEPS NEAR' },
      { at: 308, title: 'ACT IV // SHARED SHELTER' },
    ],
  },
  missing: {
    id: 'missing',
    label: 'Missing Someone',
    icon: '✧',
    miniArt: [' · · >==> ', 'o/      \\o', '#~~ ~~ ~~#'],
    tagline: 'A glowing paper plane crossing a moonlit sea between two shores',
    accent: '#c084fc',
    secondary: '#f0abfc',
    glow: 'rgba(192, 132, 252, 0.42)',
    tint: 'rgba(192, 132, 252, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // SAME MOON' },
      { at: 96, title: 'ACT II // FOLDING A WISH' },
      { at: 204, title: 'ACT III // ACROSS THE DARK' },
      { at: 312, title: 'ACT IV // BRIDGE OF STARS' },
    ],
  },
  friendship: {
    id: 'friendship',
    label: 'Friendship',
    icon: '☀',
    miniArt: ['  * /^\\ * ', ' \\o/(♥)\\o/', '/|\\ === /|\\'],
    tagline: 'Walking in with music, campfire stories & a true high-five',
    accent: '#ff9f43',
    secondary: '#5cd85a',
    glow: 'rgba(255, 159, 67, 0.42)',
    tint: 'rgba(255, 159, 67, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // LIGHTING THE FIRE' },
      { at: 96, title: 'ACT II // ARRIVING WITH SONGS' },
      { at: 210, title: 'ACT III // THROUGH EVERY STORM' },
      { at: 316, title: 'ACT IV // FRIENDS LIKE FAMILY' },
    ],
  },
  motivation: {
    id: 'motivation',
    label: 'Motivation',
    icon: '▲',
    miniArt: ['  \\o/|> ☀ ', '  /\\   ·  ', ' /  \\ / \\ '],
    tagline: 'Pushing up dark cliffs to greet a blazing sunrise',
    accent: '#ff6b4a',
    secondary: '#ffe066',
    glow: 'rgba(255, 107, 74, 0.42)',
    tint: 'rgba(255, 107, 74, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // CLIMB IN THE DARK' },
      { at: 110, title: 'ACT II // THE FINAL RIDGE' },
      { at: 210, title: 'ACT III // SUMMIT FLAG' },
      { at: 295, title: 'ACT IV // FIRST LIGHT' },
    ],
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude',
    icon: '❖',
    miniArt: ['  [_]  [_] ', '   ✦  [_]  ', ' \\o/    \\o/'],
    tagline: 'Golden sky lanterns rising into a grateful twilight',
    accent: '#fbbf24',
    secondary: '#fb7185',
    glow: 'rgba(251, 191, 36, 0.42)',
    tint: 'rgba(251, 191, 36, 0.08)',
    durationFrames: 408,
    acts: [
      { at: 0, title: 'ACT I // QUIET THANKS' },
      { at: 96, title: 'ACT II // LIGHTING THE LANTERN' },
      { at: 204, title: 'ACT III // RISING GOLD' },
      { at: 312, title: 'ACT IV // SKY OF GRATITUDE' },
    ],
  },
  apology: {
    id: 'apology',
    label: 'I’m Sorry',
    icon: '❀',
    miniArt: ['  ._.  ✿  ', ' /|\\  /|\\ ', ' _/|_♥_|_ '],
    tagline: 'A tearful apology on one knee, healed by a warm embrace',
    accent: '#5eead4',
    secondary: '#ffd166',
    glow: 'rgba(94, 234, 212, 0.4)',
    tint: 'rgba(94, 234, 212, 0.08)',
    durationFrames: 480, // 20s @ 24fps
    acts: [
      { at: 0, title: 'ACT I // THE WEIGHT OF SILENCE' },
      { at: 108, title: 'ACT II // HONEST REGRET' },
      { at: 216, title: 'ACT III // ON ONE KNEE' },
      { at: 346, title: 'ACT IV // FORGIVENESS & EMBRACE' },
    ],
  },
};
const EMOTION_LIST = Object.values(EMOTIONS);


// ===== src/photo-ascii.js =====
// Pure visual density symbols (no noisy alphanumeric letters) for sharper facial portraits
const RAMP = ' .,:;+*#%@';
const PHOTO_COLS = 74;
const PHOTO_ROWS = 21;

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
const CHAR_TO_COLOR = Object.fromEntries(
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
function pixelsToAsciiGrid(rgba, cols = PHOTO_COLS, rows = PHOTO_ROWS, options = {}) {
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
function convertImageToAscii(img, options = {}) {
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


// ===== src/crypto.js =====

const PREFIX_OPEN = 'TTY0.';
const PREFIX_GCM = 'TTY1.';
const PREFIX_FALLBACK = 'TTY2.';
const VERSION = 1;
const SALT_LEN = 12;
const IV_LEN = 12;
const PBKDF2_ITERATIONS = 120_000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSubtle() {
  return globalThis.crypto?.subtle || null;
}

function getRandomBytes(len) {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint8Array(len));
  }
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = Math.floor(Math.random() * 256);
  }
  return out;
}

function generateMsgId() {
  return toBase64Url(getRandomBytes(6));
}

function toBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

async function compressBytes(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

async function decompressBytes(bytes) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is required to decode compressed payloads.');
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}

/* ---------- Pure-JS SHA-256 fallback & open stream mask ---------- */
const K256 = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(x, n) {
  return (x >>> n) | (x << (32 - n));
}

function sha256Sync(bytes) {
  const bitLen = bytes.length * 8;
  const padLen = ((bytes.length + 9 + 63) >> 6) << 6;
  const padded = new Uint8Array(padLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padLen - 4, bitLen >>> 0, false);
  view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  const w = new Uint32Array(64);

  for (let i = 0; i < padLen; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = view.getUint32(i + t * 4, false);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K256[t] + w[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  [h0, h1, h2, h3, h4, h5, h6, h7].forEach((val, idx) => outView.setUint32(idx * 4, val, false));
  return out;
}

function expandMask(seedBytes, length) {
  const stream = new Uint8Array(length);
  let offset = 0;
  let counter = 0;
  while (offset < length) {
    const ctrInput = new Uint8Array(seedBytes.length + 4);
    ctrInput.set(seedBytes);
    ctrInput[seedBytes.length] = counter & 0xff;
    ctrInput[seedBytes.length + 1] = (counter >> 8) & 0xff;
    const digest = sha256Sync(ctrInput);
    const take = Math.min(32, length - offset);
    stream.set(digest.subarray(0, take), offset);
    offset += take;
    counter++;
  }
  return stream;
}

function fallbackKeystream(keyBytes, salt, iv, length) {
  const seed = new Uint8Array(keyBytes.length + salt.length + iv.length);
  seed.set(keyBytes, 0);
  seed.set(salt, keyBytes.length);
  seed.set(iv, keyBytes.length + salt.length);
  let block = sha256Sync(seed);
  for (let round = 0; round < 2048; round++) {
    block = sha256Sync(block);
  }
  return { master: block, stream: expandMask(block, length) };
}

function computeTag(master, cipherBytes) {
  const tagInput = new Uint8Array(master.length + cipherBytes.length);
  tagInput.set(master, 0);
  tagInput.set(cipherBytes, master.length);
  return sha256Sync(tagInput).subarray(0, 16);
}

async function deriveAesKey(secretKey, salt) {
  const subtle = getSubtle();
  const baseKey = await subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Inspects a token string to determine whether it requires a secret key.
 */
function inspectCode(code) {
  const trimmed = typeof code === 'string' ? code.trim().replace(/\s+/g, '') : '';
  if (!trimmed) return { valid: false, requiresKey: false, mode: null };
  if (trimmed.startsWith(PREFIX_OPEN)) {
    return { valid: true, requiresKey: false, mode: 'open', label: 'Open Cipher (No key required)' };
  }
  if (trimmed.startsWith(PREFIX_GCM) || trimmed.startsWith(PREFIX_FALLBACK)) {
    return { valid: true, requiresKey: true, mode: 'locked', label: 'Key-Protected Cipher' };
  }
  return { valid: false, requiresKey: false, mode: null };
}

/**
 * Encrypts (or encodes if key is omitted) a message + emotion + optional Time Capsule / Burn options.
 */
async function encryptMessage({
  message,
  emotion,
  key = '',
  sender = '',
  unlockAt = null,
  burn = false,
  photo = null,
}) {
  const cleanMessage = typeof message === 'string' ? message.trim() : '';
  const cleanKey = typeof key === 'string' ? key : '';
  const cleanSender = typeof sender === 'string' ? sender.trim() : '';

  if (!cleanMessage) throw new Error('Please enter a message to encode.');
  if (!EMOTIONS[emotion]) throw new Error(`Unknown emotion: ${emotion}`);

  const opts = {};
  if (typeof unlockAt === 'number' && Number.isFinite(unlockAt) && unlockAt > 0) {
    opts.u = Math.round(unlockAt);
  }
  if (burn) {
    opts.b = 1;
    opts.id = generateMsgId();
  }
  if (photo && Array.isArray(photo.r) && Array.isArray(photo.c)) {
    opts.p = { w: photo.w, h: photo.h, r: photo.r, c: photo.c };
  }

  const hasOpts = Object.keys(opts).length > 0;
  const payloadObj = hasOpts
    ? [emotion, cleanMessage, cleanSender, opts]
    : cleanSender
      ? [emotion, cleanMessage, cleanSender]
      : [emotion, cleanMessage];

  const rawPayload = encoder.encode(JSON.stringify(payloadObj));

  let bodyBytes = rawPayload;
  let compressedFlag = 0;
  try {
    const deflated = await compressBytes(rawPayload);
    if (deflated && deflated.length < rawPayload.length) {
      bodyBytes = deflated;
      compressedFlag = 1;
    }
  } catch {
    // Fall back to uncompressed UTF-8 payload.
  }

  const plaintext = new Uint8Array(1 + bodyBytes.length);
  plaintext[0] = compressedFlag;
  plaintext.set(bodyBytes, 1);

  if (!cleanKey) {
    const nonce = getRandomBytes(8);
    const mask = expandMask(nonce, plaintext.length);
    const masked = new Uint8Array(plaintext.length);
    for (let i = 0; i < plaintext.length; i++) {
      masked[i] = plaintext[i] ^ mask[i];
    }
    const packet = new Uint8Array(1 + 8 + masked.length);
    packet[0] = VERSION;
    packet.set(nonce, 1);
    packet.set(masked, 9);
    return `${PREFIX_OPEN}${toBase64Url(packet)}`;
  }

  const salt = getRandomBytes(SALT_LEN);
  const iv = getRandomBytes(IV_LEN);
  const subtle = getSubtle();

  if (subtle) {
    const aesKey = await deriveAesKey(cleanKey, salt);
    const cipherBuf = await subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, plaintext);
    const cipherBytes = new Uint8Array(cipherBuf);
    const packet = new Uint8Array(1 + SALT_LEN + IV_LEN + cipherBytes.length);
    packet[0] = VERSION;
    packet.set(salt, 1);
    packet.set(iv, 1 + SALT_LEN);
    packet.set(cipherBytes, 1 + SALT_LEN + IV_LEN);
    return `${PREFIX_GCM}${toBase64Url(packet)}`;
  }

  const { master, stream } = fallbackKeystream(encoder.encode(cleanKey), salt, iv, plaintext.length);
  const cipherBytes = new Uint8Array(plaintext.length);
  for (let i = 0; i < plaintext.length; i++) {
    cipherBytes[i] = plaintext[i] ^ stream[i];
  }
  const tag = computeTag(master, cipherBytes);
  const packet = new Uint8Array(1 + SALT_LEN + IV_LEN + cipherBytes.length + tag.length);
  packet[0] = VERSION;
  packet.set(salt, 1);
  packet.set(iv, 1 + SALT_LEN);
  packet.set(cipherBytes, 1 + SALT_LEN + IV_LEN);
  packet.set(tag, 1 + SALT_LEN + IV_LEN + cipherBytes.length);
  return `${PREFIX_FALLBACK}${toBase64Url(packet)}`;
}

/**
 * Decrypts a TTY0.*, TTY1.*, or TTY2.* token. Key is optional for TTY0.* open codes.
 */
async function decryptMessage({ code, key = '' }) {
  const trimmed = typeof code === 'string' ? code.trim().replace(/\s+/g, '') : '';
  const cleanKey = typeof key === 'string' ? key : '';

  if (!trimmed) throw new Error('Please paste a secret code.');

  const isOpen = trimmed.startsWith(PREFIX_OPEN);
  const isGcm = trimmed.startsWith(PREFIX_GCM);
  const isFallback = trimmed.startsWith(PREFIX_FALLBACK);

  if (!isOpen && !isGcm && !isFallback) {
    throw new Error('Invalid code format. Expected a code starting with "TTY0.", "TTY1.", or "TTY2.".');
  }

  const prefixLen = isOpen ? PREFIX_OPEN.length : isGcm ? PREFIX_GCM.length : PREFIX_FALLBACK.length;
  let packet;
  try {
    packet = fromBase64Url(trimmed.slice(prefixLen));
  } catch {
    throw new Error('Code is malformed or corrupted.');
  }

  if (packet[0] !== VERSION) {
    throw new Error(`Unsupported cipher version: ${packet[0]}`);
  }

  let plaintext;

  if (isOpen) {
    if (packet.length < 1 + 8 + 4) {
      throw new Error('Open code is incomplete or corrupted.');
    }
    const nonce = packet.slice(1, 9);
    const masked = packet.slice(9);
    const mask = expandMask(nonce, masked.length);
    plaintext = new Uint8Array(masked.length);
    for (let i = 0; i < masked.length; i++) {
      plaintext[i] = masked[i] ^ mask[i];
    }
  } else {
    if (!cleanKey) {
      throw new Error('This message is protected by a secret key. Please enter the key.');
    }
    if (packet.length < 1 + SALT_LEN + IV_LEN + 17) {
      throw new Error('Encrypted code is incomplete or corrupted.');
    }
    const salt = packet.slice(1, 1 + SALT_LEN);
    const iv = packet.slice(1 + SALT_LEN, 1 + SALT_LEN + IV_LEN);

    if (isGcm) {
      const subtle = getSubtle();
      if (!subtle) {
        throw new Error('This code requires HTTPS or localhost (Web Crypto API unavailable here).');
      }
      const cipherBytes = packet.slice(1 + SALT_LEN + IV_LEN);
      try {
        const aesKey = await deriveAesKey(cleanKey, salt);
        const buf = await subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, cipherBytes);
        plaintext = new Uint8Array(buf);
      } catch {
        throw new Error('Decryption failed. Check your secret key or code.');
      }
    } else {
      const bodyAndTag = packet.slice(1 + SALT_LEN + IV_LEN);
      const cipherBytes = bodyAndTag.subarray(0, bodyAndTag.length - 16);
      const givenTag = bodyAndTag.subarray(bodyAndTag.length - 16);
      const { master, stream } = fallbackKeystream(encoder.encode(cleanKey), salt, iv, cipherBytes.length);
      const expectedTag = computeTag(master, cipherBytes);
      let diff = 0;
      for (let i = 0; i < 16; i++) diff |= givenTag[i] ^ expectedTag[i];
      if (diff !== 0) {
        throw new Error('Decryption failed. Check your secret key or code.');
      }
      plaintext = new Uint8Array(cipherBytes.length);
      for (let i = 0; i < cipherBytes.length; i++) {
        plaintext[i] = cipherBytes[i] ^ stream[i];
      }
    }
  }

  let parsed;
  try {
    const compressedFlag = plaintext[0];
    let payloadBytes = plaintext.slice(1);
    if (compressedFlag === 1) {
      payloadBytes = await decompressBytes(payloadBytes);
    }
    parsed = JSON.parse(decoder.decode(payloadBytes));
  } catch {
    throw new Error('Code could not be decoded. It may be corrupted.');
  }

  if (!Array.isArray(parsed) || parsed.length < 2) {
    throw new Error('Decoded payload is invalid.');
  }

  const [emotion, message, sender = '', opts = {}] = parsed;
  if (!EMOTIONS[emotion]) {
    throw new Error('Decoded payload specifies an unknown emotion.');
  }

  return {
    emotion,
    message,
    sender,
    protected: !isOpen,
    unlockAt: typeof opts?.u === 'number' ? opts.u : null,
    burn: Boolean(opts?.b),
    id: typeof opts?.id === 'string' ? opts.id : null,
    photo: opts?.p && Array.isArray(opts.p.r) ? opts.p : null,
  };
}


// ===== src/ascii-canvas.js =====
/**
 * Lightweight 2D character & color-class buffer for 24fps terminal animations.
 */
class AsciiCanvas {
  constructor(cols = 80, rows = 24) {
    this.cols = cols;
    this.rows = rows;
    this.size = cols * rows;
    this.chars = new Array(this.size).fill(' ');
    this.colors = new Array(this.size).fill('');
  }

  clear() {
    this.chars.fill(' ');
    this.colors.fill('');
  }

  set(x, y, ch, color = '') {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= this.cols || iy < 0 || iy >= this.rows) return;
    const idx = iy * this.cols + ix;
    this.chars[idx] = ch;
    this.colors[idx] = color;
  }

  text(x, y, str, color = '', { transparentSpace = true } = {}) {
    const iy = Math.round(y);
    if (iy < 0 || iy >= this.rows) return;
    const startX = Math.round(x);
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (transparentSpace && ch === ' ') continue;
      const ix = startX + i;
      if (ix < 0 || ix >= this.cols) continue;
      const idx = iy * this.cols + ix;
      this.chars[idx] = ch;
      this.colors[idx] = color;
    }
  }

  sprite(x, y, lines, color = '') {
    for (let r = 0; r < lines.length; r++) {
      this.text(x, y + r, lines[r], color, { transparentSpace: true });
    }
  }

  fillRect(x, y, w, h, ch, color = '') {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        this.set(x0 + c, y0 + r, ch, color);
      }
    }
  }

  line(x0, y0, x1, y1, ch, color = '') {
    let ix0 = Math.round(x0);
    let iy0 = Math.round(y0);
    const ix1 = Math.round(x1);
    const iy1 = Math.round(y1);
    const dx = Math.abs(ix1 - ix0);
    const dy = -Math.abs(iy1 - iy0);
    const sx = ix0 < ix1 ? 1 : -1;
    const sy = iy0 < iy1 ? 1 : -1;
    let err = dx + dy;

    while (true) {
      this.set(ix0, iy0, ch, color);
      if (ix0 === ix1 && iy0 === iy1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        ix0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        iy0 += sy;
      }
    }
  }

  toLines() {
    const out = [];
    for (let r = 0; r < this.rows; r++) {
      const offset = r * this.cols;
      out.push(this.chars.slice(offset, offset + this.cols).join(''));
    }
    return out;
  }

  toHTML() {
    const rowsHtml = new Array(this.rows);
    for (let r = 0; r < this.rows; r++) {
      const offset = r * this.cols;
      let rowStr = '';
      let runColor = this.colors[offset];
      let runText = '';

      for (let c = 0; c < this.cols; c++) {
        const ch = this.chars[offset + c];
        const color = this.colors[offset + c];
        if (color !== runColor) {
          rowStr += formatRun(runText, runColor);
          runColor = color;
          runText = ch;
        } else {
          runText += ch;
        }
      }
      rowStr += formatRun(runText, runColor);
      rowsHtml[r] = rowStr;
    }
    return rowsHtml.join('\n');
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatRun(text, color) {
  if (!text) return '';
  const escaped = escapeHtml(text);
  return color ? `<span class="c-${color}">${escaped}</span>` : escaped;
}


// ===== src/scenes.js =====
const CANVAS_COLS = 80;
const CANVAS_ROWS = 24;

function hash01(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function easeInOut(t) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function drawCaption(canvas, frame, captions) {
  let active = null;
  for (const c of captions) {
    if (frame >= c.at) active = c;
  }
  if (!active) return;
  const age = frame - active.at;
  const typedLen = Math.min(active.text.length, Math.floor(age * 1.45) + 1);
  const visible = active.text.slice(0, typedLen);
  const x = Math.max(1, Math.floor((canvas.cols - active.text.length) / 2));
  canvas.fillRect(0, 23, canvas.cols, 1, ' ');
  canvas.text(x, 23, visible, active.color || 'white');
}

function drawStars(canvas, frame, count = 48, maxRow = 15, color = 'star') {
  const glyphs = ['.', '·', '+', '*', '✦'];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(hash01(i * 3 + 1) * canvas.cols);
    const y = Math.floor(hash01(i * 7 + 2) * maxRow);
    const phase = hash01(i * 11 + 5) * 20;
    const pulse = Math.sin(frame * 0.14 + phase);
    if (pulse > -0.5) {
      const idx = pulse > 0.8 ? 4 : pulse > 0.45 ? 3 : pulse > 0.1 ? 2 : 0;
      canvas.set(x, y, glyphs[idx], idx >= 3 ? 'bright' : color);
    }
  }
}

function drawPerson(canvas, x, y, { pose = 'stand', color = 'white', legPhase = 0 } = {}) {
  const step = legPhase % 2 === 0;
  if (pose === 'walk') {
    canvas.sprite(x, y, [' o ', '/|\\', step ? '/ \\' : ' | '], color);
  } else if (pose === 'reachRight') {
    canvas.sprite(x, y, [' o ', '/|-', '/ \\'], color);
  } else if (pose === 'reachLeft') {
    canvas.sprite(x, y, [' o ', '-|\\', '/ \\'], color);
  } else if (pose === 'embraceLeft') {
    canvas.sprite(x, y, [' o ', '/|>', '/ \\'], color);
  } else if (pose === 'embraceRight') {
    canvas.sprite(x, y, [' o ', '<|\\', '/ \\'], color);
  } else if (pose === 'sitHunched') {
    canvas.sprite(x, y, ['   ', ' o ', '/|\\', ' _|'], color);
  } else if (pose === 'wave') {
    canvas.sprite(x, y, [' o/', '/| ', '/ \\'], color);
  } else if (pose === 'cheer') {
    canvas.sprite(x, y, ['\\o/', ' | ', '/ \\'], color);
  } else {
    canvas.sprite(x, y, [' o ', '/|\\', '/ \\'], color);
  }
}

/* ============================================================================
 * 1. LOVE — Two worlds walking together under a blooming constellation heart
 * ========================================================================== */
function renderLove(canvas, frame) {
  drawStars(canvas, frame, 64, 16, 'star');

  // Glowing crescent moon
  canvas.sprite(66, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Shooting stars during Acts II & III
  const meteors = [
    { start: 96, len: 22, sx: 10, sy: 2, dx: 2.2, dy: 0.42 },
    { start: 146, len: 22, sx: 58, sy: 1, dx: -2.0, dy: 0.45 },
    { start: 230, len: 20, sx: 22, sy: 3, dx: 1.9, dy: 0.38 },
    { start: 330, len: 20, sx: 60, sy: 2, dx: -1.8, dy: 0.35 },
  ];
  for (const m of meteors) {
    if (frame >= m.start && frame < m.start + m.len) {
      const k = frame - m.start;
      const hx = m.sx + k * m.dx;
      const hy = m.sy + k * m.dy;
      for (let t = 0; t < 6; t++) {
        canvas.set(
          hx - t * m.dx * 0.65,
          hy - t * m.dy * 0.65,
          t === 0 ? '★' : t < 3 ? '*' : '·',
          t === 0 ? 'bright' : 'gold'
        );
      }
    }
  }

  // Rolling hill + swaying meadow flowers (hidden during intimate close-up cut)
  const isCloseUp = frame >= 212 && frame <= 286;
  if (isCloseUp) {
    // Cinematic Close-Up Cut: Two detailed shaded hands reaching & intertwining
    const reachT = easeInOut((frame - 212) / 52);
    const lx = Math.round(lerp(4, 21, reachT));
    const rx = Math.round(lerp(56, 40, reachT));
    const joined = reachT >= 0.94;

    canvas.sprite(
      lx,
      9,
      [
        '           .---.    ',
        '==========(     \\__ ',
        '==========(   ___--)',
        "           '-'      ",
      ],
      'rose'
    );
    canvas.sprite(
      rx,
      9,
      [
        '    .---.           ',
        ' __/     )==========',
        '(--___   )==========',
        "      '-'           ",
      ],
      'cyan'
    );

    if (joined) {
      const pulse = Math.floor(frame / 5) % 2 === 0;
      canvas.set(39, 9, pulse ? '♥' : '✦', 'bright');
      canvas.set(37, 8, '·', 'gold');
      canvas.set(41, 8, '·', 'gold');
      canvas.set(39, 13, '✦', 'gold');
    }
  } else {
    for (let x = 0; x < canvas.cols; x++) {
      const hillY = 18 + Math.round(Math.sin(x * 0.085) * 1.1);
      canvas.set(x, hillY, '_', 'muted');
      if (x % 9 === 3) {
        const sway = Math.floor(frame / 16 + x) % 2 === 0 ? 'v' : 'y';
        canvas.set(x, hillY, sway, x % 18 === 3 ? 'rose' : 'green');
      }
      for (let y = hillY + 1; y < 22; y++) {
        canvas.set(x, y, y % 2 === 0 ? '.' : ' ', 'dim');
      }
    }

    // Two figures gaze at the sky in Act I, walk together in Act II, embrace in Act IV
    const walkT = easeInOut((frame - 78) / 132);
    const leftX = Math.round(lerp(10, 37, walkT));
    const rightX = Math.round(lerp(67, 40, walkT));
    const met = walkT >= 0.99;
    const legStep = Math.floor(frame / 6);

    if (!met) {
      const walking = frame >= 78;
      drawPerson(canvas, leftX, 15, { pose: walking ? 'walk' : 'stand', color: 'rose', legPhase: legStep });
      drawPerson(canvas, rightX, 15, { pose: walking ? 'walk' : 'stand', color: 'cyan', legPhase: legStep + 1 });
      if (frame > 40) {
        for (let px = leftX + 4; px < rightX - 1; px += 4) {
          if ((px + Math.floor(frame / 4)) % 8 === 0) {
            canvas.set(px, 15, '·', 'rose');
          }
        }
      }
    } else {
      const closeHold = frame >= 286;
      drawPerson(canvas, 37, 15, { pose: closeHold ? 'embraceLeft' : 'reachRight', color: 'rose' });
      drawPerson(canvas, 40, 15, { pose: closeHold ? 'embraceRight' : 'reachLeft', color: 'cyan' });
    }

    // Rising blooming heart + pulsing heartbeat rings in Act IV
    if (frame >= 287) {
      const riseT = easeInOut((frame - 287) / 42);
      const beat = Math.sin((frame - 287) * 0.28) > 0.25;
      const hy = Math.round(lerp(12, 4, riseT));
      const heart = beat
        ? [
            '  .:::.   .:::.  ',
            ' :::::::.::::::: ',
            ' ::::::::::::::: ',
            " ':::::::::::::' ",
            "   ':::::::::'   ",
            "     ':::::'     ",
            "       ':'       ",
          ]
        : [
            '  .---.   .---.  ',
            ' /     \\ /     \\ ',
            '|       V       |',
            ' \\             / ',
            "  '.         .'  ",
            "    '.     .'    ",
            "      '. .'      ",
          ];
      canvas.sprite(31, hy, heart, beat ? 'bright' : 'rose');

      for (let i = 0; i < 14; i++) {
        const ang = frame * 0.08 + (i * Math.PI * 2) / 14;
        const rx = Math.round(39 + Math.cos(ang) * (13 + (i % 3) * 3));
        const ry = Math.round(hy + 3 + Math.sin(ang) * 4.5);
        canvas.set(rx, ry, i % 2 === 0 ? '♥' : '✦', i % 3 === 0 ? 'gold' : 'rose');
      }
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Two quiet hearts, looking up at the same night...', color: 'muted' },
    { at: 96, text: 'Across every mile, something pulls them closer...', color: 'gold' },
    { at: 216, text: 'And suddenly, the whole sky feels small.', color: 'rose' },
    { at: 320, text: '♥  Two hearts, beating under one sky  ♥', color: 'bright' },
  ]);
}

/* ============================================================================
 * 2. HAPPINESS — Festival stage, leaping dancers, confetti & grand fireworks
 * ========================================================================== */
function renderHappiness(canvas, frame) {
  drawStars(canvas, frame, 30, 12, 'dim');

  // Festive string lights across top corners
  for (let x = 2; x < 78; x += 5) {
    const bulbOn = (x + Math.floor(frame / 8)) % 10 === 0;
    canvas.set(x, 0, bulbOn ? '✦' : '·', x % 2 === 0 ? 'gold' : 'cyan');
  }

  // Stage ground
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, x % 4 === 0 ? '✦' : '=', 'muted');
  }

  // Joyful dancers with expressive choreography
  const dancers = [
    { x: 20, color: 'gold', offset: 0 },
    { x: 38, color: 'cyan', offset: 2 },
    { x: 56, color: 'rose', offset: 1 },
  ];
  const poses = [
    [' \\o/ ', '  |  ', ' / \\ '],
    ['  o/ ', ' /|  ', ' / \\ '],
    [' \\o  ', '  |\\ ', ' / \\ '],
    [' ^o^ ', ' ( ) ', ' / \\ '],
  ];

  for (const d of dancers) {
    const idx = (Math.floor(frame / 6) + d.offset) % poses.length;
    const bounce = idx === 3 || idx === 0 ? -1 : 0;
    canvas.sprite(d.x, 17 + bounce, poses[idx], d.color);

    const notePhase = (frame + d.offset * 11) % 34;
    if (notePhase < 24) {
      const ny = 15 - Math.floor(notePhase / 4);
      const nx = d.x + 2 + Math.round(Math.sin(notePhase * 0.4) * 2);
      canvas.set(nx, ny, d.offset % 2 === 0 ? '♪' : '♫', d.color);
    }
  }

  // Drifting confetti ribbons from Act II onward
  if (frame >= 72) {
    const confettiGlyphs = ['*', '✦', '~', '+'];
    const confettiColors = ['gold', 'cyan', 'rose', 'green'];
    for (let i = 0; i < 24; i++) {
      const cx = (hash01(i * 17 + 3) * 80 + Math.sin(frame * 0.08 + i) * 3 + 80) % 80;
      const cy = (hash01(i * 23 + 7) * 18 + frame * 0.25) % 19;
      canvas.set(cx, cy, confettiGlyphs[i % 4], confettiColors[i % 4]);
    }
  }

  // Fireworks finale (loops smoothly during climax & reveal!)
  const fireworkCycle = frame >= 300 ? 300 + ((frame - 300) % 96) : frame;
  const shells = [
    { launch: 120, x: 18, apex: 5, color: 'gold' },
    { launch: 148, x: 60, apex: 4, color: 'cyan' },
    { launch: 182, x: 40, apex: 3, color: 'rose' },
    { launch: 214, x: 24, apex: 6, color: 'green' },
    { launch: 236, x: 54, apex: 5, color: 'gold' },
    { launch: 262, x: 39, apex: 4, color: 'violet' },
    { launch: 302, x: 20, apex: 4, color: 'rose' },
    { launch: 318, x: 58, apex: 4, color: 'cyan' },
    { launch: 340, x: 40, apex: 3, color: 'gold' },
    { launch: 362, x: 15, apex: 5, color: 'green' },
    { launch: 374, x: 65, apex: 5, color: 'violet' },
  ];

  for (const s of shells) {
    const age = fireworkCycle - s.launch;
    if (age < 0) continue;

    const ascend = 16;
    if (age < ascend) {
      const y = Math.round(lerp(19, s.apex, age / ascend));
      canvas.set(s.x, y, '^', 'bright');
      canvas.set(s.x, y + 1, '|', s.color);
      canvas.set(s.x, y + 2, ':', 'dim');
    } else if (age < ascend + 36) {
      const bAge = age - ascend;
      const radius = bAge * 0.42;
      const spokes = 16;
      const burstGlyphs = bAge < 8 ? ['*', '@', '#'] : bAge < 22 ? ['*', '+', '✦'] : ['.', '·', ' '];
      for (let i = 0; i < spokes; i++) {
        const ang = (i * Math.PI * 2) / spokes;
        const px = s.x + Math.cos(ang) * radius * 1.95;
        const py = s.apex + Math.sin(ang) * radius * 0.85 + bAge * 0.06;
        const ch = burstGlyphs[i % burstGlyphs.length];
        if (ch !== ' ') canvas.set(px, py, ch, bAge < 7 ? 'bright' : s.color);

        if (bAge > 4 && bAge < 24) {
          const ix = s.x + Math.cos(ang) * radius * 1.05;
          const iy = s.apex + Math.sin(ang) * radius * 0.48 + bAge * 0.04;
          canvas.set(ix, iy, '·', s.color);
        }
      }
      if (bAge < 5) canvas.set(s.x, s.apex, '✺', 'bright');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some moments are too bright to keep inside...', color: 'muted' },
    { at: 96, text: 'Music rises, feet leave the ground...', color: 'cyan' },
    { at: 204, text: 'Let the whole sky light up tonight!', color: 'gold' },
    { at: 300, text: '✦  Every spark is celebrating you  ✦', color: 'bright' },
  ]);
}

/* ============================================================================
 * 3. SADNESS — Heavy rain until someone arrives with a shared umbrella
 * ========================================================================== */
function renderSadness(canvas, frame) {
  // Drifting overcast clouds
  const cloudShift = Math.floor(frame / 10);
  const cLines = ['   .---.   .----.   ', ' .(     )./      ). ', '(__.___.__)____.__) '];
  for (let c = 0; c < 4; c++) {
    const cx = ((c * 24 - cloudShift) % 96 + 96) % 96 - 16;
    canvas.sprite(cx, 0 + (c % 2), cLines, 'muted');
  }

  // Warm streetlamp at x=21
  canvas.sprite(
    20,
    6,
    [
      ' .-. ',
      '( * )',
      " '-' ",
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      ' _|_ ',
    ],
    'dim'
  );
  canvas.set(22, 7, '*', 'gold');

  // Soft amber streetlamp cone
  for (let r = 9; r <= 19; r++) {
    const spread = Math.floor((r - 8) * 0.72);
    for (let dx = -spread; dx <= spread; dx += 2) {
      if ((r + dx) % 3 === 0) canvas.set(22 + dx, r, '·', 'dim');
    }
  }

  // Park bench & lonely huddled figure
  canvas.sprite(30, 17, ['___________', '|=========|', '|         |'], 'muted');
  drawPerson(canvas, 33, 14, { pose: 'sitHunched', color: 'blue' });

  // Act III & IV: A second figure walks in from the right holding an umbrella!
  const arrived = frame >= 292;
  let helperX = 76;
  if (frame >= 205) {
    const walkT = easeInOut((frame - 205) / 87);
    helperX = Math.round(lerp(74, 37, walkT));

    // Umbrella canopy shields above the helper (and over both figures once arrived!)
    const umbX = helperX - 4;
    canvas.sprite(
      umbX,
      11,
      ['  .-------.  ', " /  '   '  \\ ", '-----+-------'],
      'gold'
    );
    canvas.line(helperX + 1, 14, helperX + 1, 16, '|', 'gold');

    if (!arrived) {
      drawPerson(canvas, helperX, 15, { pose: 'walk', color: 'gold', legPhase: Math.floor(frame / 6) });
    } else {
      // Standing close beside the bench, sharing shelter & warmth
      drawPerson(canvas, 38, 15, { pose: 'stand', color: 'gold' });
      canvas.set(36, 14, '♥', 'rose');
    }
  }

  // Slanted falling rain (blocked directly beneath the umbrella!)
  const rainCount = arrived ? 46 : frame >= 90 ? 84 : 44;
  const speed = arrived ? 0.65 : 0.92;
  const umbLeft = helperX - 4;
  const umbRight = helperX + 8;

  for (let i = 0; i < rainCount; i++) {
    const rx = (hash01(i * 13 + 3) * 84 - frame * 0.3 + 800) % 80;
    const ry = ((hash01(i * 19 + 7) * 18 + frame * speed) % 18) + 3;
    if (frame >= 205 && rx >= umbLeft && rx <= umbRight && ry >= 12) {
      continue; // Sheltered under the umbrella!
    }
    if (ry >= 3 && ry < 20) {
      canvas.set(rx, ry, i % 3 === 0 ? '|' : '/', i % 4 === 0 ? 'bright' : 'blue');
    }
  }

  // Wet ground, streetlamp puddle reflections & ripples
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, '_', 'dim');
  }
  const reflectShift = Math.floor(frame / 5) % 2 === 0;
  canvas.text(21, 21, reflectShift ? ': * :' : '. : .', 'gold');
  canvas.text(21, 22, reflectShift ? '·   ·' : '  :  ', 'dim');
  for (let p = 0; p < (arrived ? 6 : 12); p++) {
    const px = Math.floor(hash01(p * 29 + 11) * 74) + 3;
    const phase = (frame + p * 7) % 18;
    if (phase < 6) canvas.set(px, 21, 'o', 'blue');
    else if (phase < 12) canvas.text(px - 1, 21, '( )', 'blue');
    else canvas.text(px - 2, 21, '~   ~', 'dim');
  }

  // Single warm star breaks through in Act IV
  if (arrived) {
    canvas.set(58, 4, '✦', 'gold');
    canvas.line(58, 5, 42, 13, '.', 'dim');
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some nights, the silence feels too heavy...', color: 'muted' },
    { at: 100, text: 'Sitting in the rain, wondering if anyone hears...', color: 'blue' },
    { at: 216, text: 'Then footsteps draw near through the storm...', color: 'gold' },
    { at: 308, text: 'You do not have to carry the rain alone.', color: 'bright' },
  ]);
}

/* ============================================================================
 * 4. MISSING SOMEONE — Paper plane crossing a moonlit ocean into open hands
 * ========================================================================== */
function renderMissing(canvas, frame) {
  drawStars(canvas, frame, 54, 14, 'star');

  // Giant crescent moon centered high in the sky
  canvas.sprite(36, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Shimmering moonlit ocean between two cliffs
  for (let x = 16; x < 64; x++) {
    const wave = (x + Math.floor(frame / 6)) % 6 === 0 ? '~' : '-';
    canvas.set(x, 19, wave, 'dim');
    if ((x + Math.floor(frame / 8)) % 9 === 0) {
      canvas.set(x, 21, '·', 'violet');
    }
  }

  // Left cliff & Figure A
  canvas.fillRect(0, 17, 16, 6, '#', 'dim');
  canvas.text(0, 17, '_______________', 'muted');
  const sendPose = frame >= 150 && frame <= 210 ? 'wave' : frame >= 312 ? 'wave' : 'stand';
  drawPerson(canvas, 11, 14, { pose: sendPose, color: 'violet' });

  // Right cliff & Figure B
  canvas.fillRect(64, 17, 16, 6, '#', 'dim');
  canvas.text(64, 17, '_______________', 'muted');
  const received = frame >= 280;
  drawPerson(canvas, 66, 14, { pose: received ? 'wave' : 'stand', color: 'rose' });

  // Act I & II: Distant heartbeats / wishes pulsing on opposite shores
  if (frame < 168) {
    const pulseA = Math.sin(frame * 0.24) > 0.25;
    const pulseB = Math.sin(frame * 0.24 + Math.PI) > 0.25;
    if (pulseA) canvas.text(12, 12, '✦', 'violet');
    if (pulseB) canvas.text(67, 12, '✦', 'rose');
  }

  // Act II-III: Glowing ASCII paper airplane arcs across the dark ocean
  if (frame >= 148 && frame <= 284) {
    const t = easeInOut((frame - 148) / 132);
    const px = lerp(15, 64, t);
    const py = 13 - Math.sin(t * Math.PI) * 6.5;

    for (let k = 1; k <= 16; k++) {
      const bt = clamp(t - k * 0.02, 0, 1);
      if (bt <= 0) continue;
      const tx = lerp(15, 64, bt);
      const ty = 13 - Math.sin(bt * Math.PI) * 6.5;
      canvas.set(tx, ty, k % 2 === 0 ? '·' : '.', k < 5 ? 'bright' : 'violet');
    }
    canvas.text(px - 2, py, '>==>', 'bright');
  }

  // Act IV: A luminous bridge of stars connects both cliffs
  if (received) {
    const bridgeT = clamp((frame - 280) / 48, 0, 1);
    const span = Math.floor(lerp(0, 48, bridgeT));
    for (let i = 0; i < span; i++) {
      const bx = 63 - i;
      const by = 16 + Math.round(Math.sin((i / 48) * Math.PI) * -1.4);
      canvas.set(bx, by, i % 3 === 0 ? '✦' : '·', i % 2 === 0 ? 'violet' : 'rose');
    }
    if (Math.floor(frame / 10) % 2 === 0) {
      canvas.text(12, 12, '♥', 'bright');
      canvas.text(67, 12, '♥', 'bright');
    } else {
      canvas.text(12, 12, '✦', 'violet');
      canvas.text(67, 12, '✦', 'rose');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Same moon. Different skies.', color: 'muted' },
    { at: 96, text: 'I folded every unspoken thought into a wish...', color: 'violet' },
    { at: 204, text: 'Sending a piece of my heart across the dark...', color: 'bright' },
    { at: 312, text: 'Distance only proves how far love travels.', color: 'rose' },
  ]);
}

/* ============================================================================
 * 5. FRIENDSHIP — Arrival with music, roaring campfire, high-five & sparklers
 * ========================================================================== */
function renderFriendship(canvas, frame) {
  drawStars(canvas, frame, 44, 12, 'star');

  // Crescent moon over the pines
  canvas.sprite(66, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Flanking pine silhouettes
  const treeXs = [2, 10, 62, 70];
  for (const tx of treeXs) {
    canvas.sprite(
      tx,
      10,
      ['   /\\   ', '  /  \\  ', ' /____\\ ', '  /  \\  ', ' /____\\ ', '   ||   '],
      'green'
    );
  }

  // Forest clearing ground
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, x % 5 === 0 ? ',' : '_', 'muted');
  }

  // Campfire grows from spark in Act I to roaring warm blaze
  const fireLevel = clamp((frame - 20) / 68, 0.15, 1);
  if (fireLevel < 0.5) {
    canvas.sprite(36, 17, ['  .^*  ', '=======', ' \\___/ '], 'orange');
  } else {
    const fIdx = Math.floor(frame / 4) % 3;
    const flames = [
      ['   (   ', '  /^\\  ', ' ( * ) ', '=======', ' \\___/ '],
      ['   )   ', '  /^\\  ', ' (* ^) ', '=======', ' \\___/ '],
      ['  ( )  ', ' /^ ^\\ ', ' ( * ) ', '=======', ' \\___/ '],
    ];
    canvas.sprite(36, 15, flames[fIdx], 'orange');
    canvas.set(39, 17, '*', 'bright');
  }

  // Rising campfire embers
  const emberCount = frame >= 96 ? 18 : 7;
  for (let i = 0; i < emberCount; i++) {
    const age = (frame + i * 7) % 34;
    const ey = 15 - age * 0.42;
    const ex = 39 + Math.sin(age * 0.45 + i) * 4.5;
    if (ey > 2) {
      canvas.set(ex, ey, age < 12 ? '*' : '·', age < 10 ? 'gold' : 'orange');
    }
  }

  // Friend A sits on the left log & waves as Friend B walks in during Act II
  const arrived = frame >= 156;
  const highFive = frame >= 216 && frame < 306;
  const toast = frame >= 306;

  if (!arrived) {
    // Friend A waiting by the fire, waves when B approaches
    drawPerson(canvas, 27, 16, { pose: frame >= 104 ? 'wave' : 'stand', color: 'cyan' });
    // Friend B walks in from right carrying music!
    const walkT = easeInOut((frame - 80) / 76);
    const bx = Math.round(lerp(68, 50, walkT));
    drawPerson(canvas, bx, 16, {
      pose: frame >= 80 ? 'walk' : 'stand',
      color: 'gold',
      legPhase: Math.floor(frame / 5),
    });
    if (frame >= 96) {
      canvas.set(bx + 1, 14 - (Math.floor(frame / 6) % 2), '♪', 'gold');
    }
  } else if (highFive) {
    // Both step close & raise hands for an unmistakable high-five / fist bump!
    const bumpT = easeInOut((frame - 216) / 42);
    const ax = Math.round(lerp(28, 35, bumpT));
    const bx = Math.round(lerp(50, 42, bumpT));
    canvas.sprite(ax, 14, [' o/', '/| ', '/ \\'], 'cyan');
    canvas.sprite(bx, 14, ['\\o ', ' |\\', '/ \\'], 'gold');
    if (bumpT >= 0.9) {
      const burst = Math.floor(frame / 5) % 2 === 0;
      canvas.text(38, 12, burst ? '✦✦✦' : ' * ', 'bright');
      canvas.text(36, 11, burst ? '\\   /' : '  ✦  ', 'gold');
    }
  } else if (!toast) {
    // Strumming guitar & singing around the warm fire
    const sway = Math.floor(frame / 14) % 2 === 0;
    canvas.sprite(27, 16, [' o ', sway ? '/|>' : '/|\\', ' _|'], 'cyan');
    canvas.sprite(50, 16, [' o ', sway ? '<|\\' : '/|\\', '|_ '], 'gold');
    canvas.text(26, 19, '===', 'dim');
    canvas.text(50, 19, '===', 'dim');
    const nY = 13 - (Math.floor(frame / 6) % 3);
    canvas.text(31, nY, '♪', 'cyan');
    canvas.text(46, nY - 1, '♫', 'gold');
  } else {
    // Act IV: Side-by-side celebratory toast & swirling golden fireflies
    canvas.sprite(29, 16, ['\\o ', ' |\\', '/ \\'], 'cyan');
    canvas.sprite(48, 16, [' o/', '/| ', '/ \\'], 'gold');
    canvas.text(32, 16, '[_]P', 'gold');
    canvas.text(43, 16, 'q[_]', 'cyan');
    if (Math.floor(frame / 8) % 2 === 0) {
      canvas.text(36, 11, '✦  ♥  ✦', 'bright');
    }
  }

  // Shooting star in Act III & fireflies across the woods
  if (frame >= 240 && frame < 268) {
    const k = frame - 240;
    canvas.set(16 + k * 1.8, 3 + k * 0.25, '★', 'bright');
    canvas.set(14 + k * 1.8, 2.7 + k * 0.25, '*', 'gold');
  }
  if (frame >= 64) {
    for (let i = 0; i < 16; i++) {
      const fx = 5 + hash01(i * 5 + 1) * 70 + Math.sin(frame * 0.06 + i) * 4;
      const fy = 5 + hash01(i * 9 + 3) * 13 + Math.cos(frame * 0.08 + i) * 2;
      if (Math.sin(frame * 0.22 + i * 2) > 0) {
        canvas.set(fx, fy, '*', i % 2 === 0 ? 'green' : 'gold');
      }
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Even on the quietest nights, you know who to call...', color: 'muted' },
    { at: 96, text: 'Bad jokes, midnight songs, and a fire that never fades...', color: 'orange' },
    { at: 210, text: 'Through every high, every storm, every crazy chapter...', color: 'gold' },
    { at: 316, text: "☀  Some friends aren't just friends — they're family  ☀", color: 'bright' },
  ]);
}

/* ============================================================================
 * 6. MOTIVATION — Stormy ascent to a summit flag and blazing sunrise
 * ========================================================================== */
function renderMotivation(canvas, frame) {
  const dawnT = clamp((frame - 255) / 96, 0, 1);
  if (dawnT < 0.78) {
    drawStars(canvas, frame, Math.floor(42 * (1 - dawnT)), 11, 'dim');
  }

  // Wind streaks during the hard climb in Act I & II
  if (frame < 210) {
    for (let i = 0; i < 10; i++) {
      const wx = ((80 - (frame * 1.4 + i * 17)) % 80 + 80) % 80;
      const wy = 3 + (i * 2) % 12;
      canvas.text(wx, wy, '~-', 'dim');
    }
  }

  // Multi-layer parallax mountain ridges + main peak rising to (46, 9)
  const farRidgeY = (x) => Math.round(16 - Math.sin(x * 0.09 + 1.2) * 3.2 - Math.cos(x * 0.21) * 1.1);
  for (let x = 0; x < canvas.cols; x++) {
    const fy = clamp(farRidgeY(x), 9, 21);
    canvas.set(x, fy, '^', 'dim');
  }

  const ridgeY = (x) => {
    if (x < 46) return Math.round(21 - (x / 46) * 12 + Math.sin(x * 0.45) * 0.6);
    return Math.round(9 + ((x - 46) / 34) * 12 + Math.cos(x * 0.4) * 0.6);
  };

  for (let x = 0; x < canvas.cols; x++) {
    const ry = clamp(ridgeY(x), 8, 22);
    const slopeCh = x < 45 ? '/' : x > 47 ? '\\' : '^';
    canvas.set(x, ry, slopeCh, dawnT > 0.3 ? 'orange' : 'muted');
    for (let y = ry + 1; y < 22; y++) {
      canvas.set(x, y, (x + y) % 7 === 0 ? '^' : ':', 'dim');
    }
  }

  // Climber ascends along ridge in Acts I-II
  const climbT = easeInOut(frame / 205);
  const cx = Math.round(lerp(6, 45, climbT));
  const cy = clamp(ridgeY(cx) - 3, 5, 19);
  const reached = climbT >= 0.99;

  if (!reached) {
    drawPerson(canvas, cx, cy, { pose: 'walk', color: 'bright', legPhase: Math.floor(frame / 5) });
    canvas.set(cx + 3, cy + 1, '*', 'gold');
  } else {
    canvas.sprite(44, 6, [' \\o/ ', '  |  ', ' / \\ '], 'bright');
    const flutter = Math.floor(frame / 6) % 2 === 0 ? '|>>>' : '|~>>';
    canvas.sprite(49, 5, [flutter, '|  ', '|  '], 'orange');
  }

  // Rising blazing sunrise in Act IV
  if (frame >= 265) {
    const sunT = easeInOut((frame - 265) / 88);
    const sunY = Math.round(lerp(17, 5, sunT));
    const sunX = 63;

    const rayAngles = [-2.55, -2.05, -1.57, -1.08, -0.58, 0.18, 2.9];
    for (let i = 0; i < rayAngles.length; i++) {
      const ang = rayAngles[i] + Math.sin(frame * 0.05) * 0.05;
      const len = lerp(4, 22, sunT);
      for (let step = 4; step < len; step += 2) {
        const bx = Math.round(sunX + Math.cos(ang) * step * 1.6);
        const by = Math.round(sunY + Math.sin(ang) * step * 0.7);
        if (by >= 0 && by < ridgeY(clamp(bx, 0, 79))) {
          canvas.set(bx, by, step % 4 === 0 ? '·' : '-', 'gold');
        }
      }
      const rx = sunX + Math.cos(ang) * len * 1.6;
      const ry = sunY + Math.sin(ang) * len * 0.7;
      if (ry >= 0 && ry < 13) canvas.set(rx, ry, '✦', 'bright');
    }

    canvas.sprite(sunX - 3, sunY - 2, [' .---. ', '/  O  \\', '|     |', '\\     /', " '---' "], 'gold');
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Every step in the dark feels like the hardest one...', color: 'muted' },
    { at: 110, text: 'Hold your lantern steady. Keep climbing...', color: 'orange' },
    { at: 210, text: 'You made it to the summit!', color: 'gold' },
    { at: 295, text: '▲  Look how bright your horizon is now  ▲', color: 'bright' },
  ]);
}

/* ============================================================================
 * 7. GRATITUDE — Golden sky lanterns rising from grateful hands
 * ========================================================================== */
function renderGratitude(canvas, frame) {
  drawStars(canvas, frame, 48, 15, 'star');

  // Calm riverside silhouette
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 19, '_', 'muted');
    if ((x + Math.floor(frame / 10)) % 11 === 0) {
      canvas.set(x, 21, '~', 'gold');
    }
  }

  // Two figures releasing lanterns together
  const released = frame >= 96;
  drawPerson(canvas, 33, 16, { pose: released ? 'cheer' : 'stand', color: 'gold' });
  drawPerson(canvas, 44, 16, { pose: released ? 'cheer' : 'stand', color: 'rose' });

  // First hero lantern rising gently from their hands
  if (frame >= 84) {
    const heroT = clamp((frame - 84) / 140, 0, 1);
    const lx = 38 + Math.sin(frame * 0.07) * 2;
    const ly = Math.round(lerp(14, 3, easeInOut(heroT)));
    canvas.sprite(lx, ly, [' .-. ', ' |*| ', " '-' "], 'gold');
  }

  // Sky fills with warm floating lanterns in Acts III & IV
  if (frame >= 168) {
    const count = frame >= 280 ? 14 : 7;
    for (let i = 0; i < count; i++) {
      const startX = 6 + hash01(i * 19 + 4) * 68;
      const speed = 0.09 + hash01(i * 7 + 2) * 0.08;
      const ly = ((18 - ((frame - 168) * speed + i * 3)) % 18 + 18) % 18;
      const lx = startX + Math.sin(frame * 0.05 + i) * 2.2;
      canvas.sprite(lx, ly, ['[✦]', "'-'"], i % 3 === 0 ? 'rose' : 'gold');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some kindness stays with us forever...', color: 'muted' },
    { at: 96, text: 'Lighting a small lantern for all you did...', color: 'gold' },
    { at: 204, text: 'One thank you turns into a sky full of light...', color: 'rose' },
    { at: 312, text: '❖  Grateful for every moment with you  ❖', color: 'bright' },
  ]);
}

/* ============================================================================
 * 8. APOLOGY — Bowed walk, close-up tear, kneeling apology & warm embrace
 * ========================================================================== */
function renderApology(canvas, frame) {
  const dawnT = clamp((frame - 400) / 72, 0, 1);
  drawStars(canvas, frame, dawnT > 0.5 ? 28 : 42, 13, dawnT > 0.4 ? 'star' : 'dim');

  // Soft silver mist & crescent moon in wide shots
  const isCloseUp = frame >= 108 && frame <= 215;

  if (isCloseUp) {
    // ACT II: Intimate Close-Up of bowed, tearful face & trembling hands holding a flower
    const breath = Math.floor(frame / 18) % 2 === 0 ? 0 : 1;
    canvas.sprite(
      26,
      2 + breath,
      [
        '        .-----------------.        ',
        "      .'   .-'       '-.   '.      ",
        '     /    /             \\    \\     ',
        '    |    |  \\___/ \\___/  |    |    ',
        '    |    |               |    |    ',
        '    |     \\     ._.     /     |    ',
        "     \\     '.  `---'  .'     /     ",
        "      '.     '-------'     .'      ",
        "        '-.             .-'        ",
      ],
      'cyan'
    );

    // Single glistening teardrop slowly sliding down cheek onto the flower below
    if (frame >= 122 && frame <= 184) {
      const tearT = (frame - 122) / 56;
      const ty = Math.round(lerp(6 + breath, 14, clamp(tearT, 0, 1)));
      const tearGlyph = tearT < 0.2 ? '*' : tearT < 0.85 ? ':' : '·';
      canvas.set(35, ty, tearGlyph, 'bright');
    }

    // Two detailed shaded hands gently holding a rose below
    canvas.sprite(
      28,
      14,
      [
        '          .❀.          ',
        '      ___( ✿ )___      ',
        "=====(    '-'    )=====",
        '=====(____ | ____)=====',
        '          \\|/          ',
      ],
      frame >= 176 ? 'gold' : 'rose'
    );

    // Shimmer ripple when the tear touches the flower petals
    if (frame >= 176) {
      const shimmer = Math.floor(frame / 5) % 2 === 0;
      canvas.set(36, 15, shimmer ? '✦' : '·', 'bright');
      canvas.set(42, 15, shimmer ? '✦' : '·', 'bright');
    }
  } else {
    // Wide moonlit path
    canvas.sprite(66, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], dawnT > 0.3 ? 'gold' : 'muted');

    for (let x = 0; x < canvas.cols; x++) {
      canvas.set(x, 19, '_', 'muted');
      if (x % 11 === 0) canvas.set(x, 21, '~', 'dim');
    }

    // Gentle healing petals & fireflies drawn in sky BEFORE figures so silhouettes stay crisp
    if (frame >= 260) {
      const count = frame >= 380 ? 18 : 8;
      for (let i = 0; i < count; i++) {
        const px = 12 + hash01(i * 13 + 5) * 56 + Math.sin(frame * 0.05 + i) * 2.5;
        const py = ((frame * 0.18 + i * 3.7) % 14) + 2;
        canvas.set(px, py, i % 3 === 0 ? '✿' : i % 2 === 0 ? '✦' : '·', i % 3 === 0 ? 'gold' : 'rose');
      }
    }

    // Tall expressive hurt figure on the right (x=55)
    const hurtStand = [
      '  .-.  ',
      ' (   ) ',
      ' /| |\\ ',
      '/ | | \\',
      '  | |  ',
      ' _| |_ ',
    ];
    const hurtReach = [
      '  .-.  ',
      ' (   ) ',
      ' /| |  ',
      '/ | |  ',
      '  | |  ',
      ' _| |_ ',
    ];

    if (frame < 108) {
      // ACT I: Apologizer on the left, head bowed, clutching flower, hesitant step
      const breathBow = Math.floor(frame / 22) % 2 === 0;
      const ax = Math.round(lerp(13, 18, easeInOut(frame / 90)));
      canvas.sprite(
        ax,
        13,
        [
          breathBow ? '  ._.  ' : '   ._. ',
          ' /   \\ ',
          ' \\_ /| ',
          '   | |--✿',
          '  / \\  ',
          ' _| |_ ',
        ],
        'cyan'
      );
      canvas.sprite(55, 13, hurtStand, 'rose');
    } else if (frame < 346) {
      // ACT III: Walks quietly closer, drops onto one knee offering the glowing flower
      const walkT = easeInOut((frame - 216) / 56);
      const ax = Math.round(lerp(20, 41, walkT));
      const kneeling = frame >= 274;

      if (!kneeling) {
        const step = Math.floor(frame / 6) % 2 === 0;
        canvas.sprite(
          ax,
          13,
          [
            '  ._.  ',
            ' (   ) ',
            ' /| |\\ ',
            '  | |--',
            '  | | ✿',
            step ? ' /   \\ ' : ' _| |_ ',
          ],
          'cyan'
        );
      } else {
        // Humbly down on one knee, both hands offering the glowing flower
        const dropT = easeInOut((frame - 274) / 28);
        const ky = Math.round(lerp(13, 14, dropT));
        canvas.sprite(
          41,
          ky,
          [
            '  ._.     ',
            ' (   )    ',
            '  \\_|\\___ ',
            '    |   ✿ ',
            '   /|     ',
            ' _/ |__   ',
          ],
          'cyan'
        );
        // Gentle golden glow around the offered flower
        const glow = Math.floor(frame / 6) % 2 === 0;
        canvas.set(49, ky + 3, glow ? '✿' : '❀', 'gold');
        canvas.set(50, ky + 2, glow ? '✦' : '·', 'bright');
      }
      canvas.sprite(55, 13, hurtStand, 'rose');
    } else {
      // ACT IV: Hurt person turns, steps forward, lifts apologizer up, warm embrace!
      const stepT = easeInOut((frame - 356) / 38);
      const liftT = easeInOut((frame - 396) / 34);
      const embraceT = easeInOut((frame - 430) / 30);

      if (frame < 430) {
        // Hurt person walks up to x=48 and extends hand down to lift apologizer up
        const rx = Math.round(lerp(55, 48, stepT));
        const ay = Math.round(lerp(14, 13, liftT));
        if (liftT < 0.5) {
          canvas.sprite(
            41,
            ay,
            [
              '  ._.     ',
              ' (   )    ',
              '  \\_|\\___ ',
              '    |   ✿ ',
              '   /|     ',
              ' _/ |__   ',
            ],
            'cyan'
          );
        } else {
          canvas.sprite(
            41,
            13,
            [
              '  .-.  ',
              ' (   ) ',
              ' /| |\\ ',
              '  | |--',
              '  | |  ',
              ' _| |_ ',
            ],
            'cyan'
          );
        }
        canvas.sprite(rx, 13, stepT > 0.7 ? hurtReach : hurtStand, 'rose');
        if (stepT > 0.7) {
          canvas.text(rx - 2, 15, '--✿', 'gold');
        }
      } else {
        // Full tender embrace centered at x=36..45
        const lx = Math.round(lerp(34, 36, embraceT));
        const rx = Math.round(lerp(43, 40, embraceT));
        canvas.sprite(
          lx,
          13,
          [' .-.', '(   ', '/|\\ ', ' | |', ' | |', '_| |'],
          'cyan'
        );
        canvas.sprite(
          rx,
          13,
          [' .-. ', '   ) ', ' /|\\ ', '| |  ', '| |  ', '| |_ '],
          'rose'
        );

        // Warm pulsing forgiveness heart above their heads
        const beat = Math.floor(frame / 10) % 2 === 0;
        canvas.sprite(
          36,
          7,
          [' .-. .-. ', '(   V   )', " '.   .' ", "   '.'   "],
          beat ? 'bright' : 'gold'
        );
      }
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'The hardest walk is toward the person you hurt...', color: 'muted' },
    { at: 108, text: 'I replayed every word... wishing I could undo the pain.', color: 'cyan' },
    { at: 216, text: 'No excuses. Just my heart in my hands... please forgive me.', color: 'gold' },
    { at: 346, text: '❀  Thank you for giving my heart a second chance  ❀', color: 'bright' },
  ]);
}

const SCENE_RENDERERS = {
  love: renderLove,
  happiness: renderHappiness,
  sadness: renderSadness,
  missing: renderMissing,
  friendship: renderFriendship,
  motivation: renderMotivation,
  gratitude: renderGratitude,
  apology: renderApology,
};
function renderSceneFrame(emotion, frame, totalFrames = 408, canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS)) {
  canvas.clear();
  const renderer = SCENE_RENDERERS[emotion];
  if (!renderer) {
    throw new Error(`No ASCII scene renderer defined for emotion "${emotion}".`);
  }
  renderer(canvas, frame, totalFrames);
  return canvas;
}

/**
 * Renders the Time Capsule hourglass countdown terminal screen.
 */
function renderTimeCapsule(canvas, frame, remainingMs) {
  canvas.clear();
  drawStars(canvas, frame, 52, 22, 'star');

  // Animated hourglass in center
  const dropPhase = frame % 8;
  const sandStream = dropPhase < 4 ? ':' : '·';
  canvas.sprite(
    30,
    2,
    [
      ' .==================. ',
      ' | \\  .::::::::.  / | ',
      ' |  \\   ::::::   /  | ',
      ' |   \\   `::\'   /   | ',
      ` |    )   ${sandStream}    (    | `,
      ` |   /    ${dropPhase % 2 === 0 ? '·' : ':'}     \\   | `,
      ' |  /   .::::.   \\  | ',
      ' | /  .::::::::.  \\ | ',
      " '==================' ",
    ],
    'gold'
  );
  // Shimmering falling sand grain
  canvas.set(40, 6 + (frame % 3), '·', 'bright');

  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const clockStr = `UNLOCKS IN  ${pad(days)}d : ${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`;

  const boxW = 44;
  const bx = Math.floor((canvas.cols - boxW) / 2);
  canvas.text(bx, 14, '+' + '-'.repeat(boxW - 2) + '+', 'cyan');
  canvas.text(bx, 15, '|' + ' '.repeat(boxW - 2) + '|', 'cyan');
  canvas.text(bx, 16, '|' + ' '.repeat(boxW - 2) + '|', 'cyan');
  canvas.text(bx, 17, '+' + '-'.repeat(boxW - 2) + '+', 'cyan');

  const tx = Math.floor((canvas.cols - clockStr.length) / 2);
  canvas.text(tx, 15, clockStr, 'bright');
  const sub = 'TIME CAPSULE SEALED · WAITING FOR MOMENT';
  canvas.text(Math.floor((canvas.cols - sub.length) / 2), 16, sub, 'muted');

  drawCaption(canvas, frame % 160, [
    { at: 0, text: 'Patience... some feelings are meant for an exact hour.', color: 'gold' },
  ]);
  return canvas;
}

function wrapLines(text, maxWidth = 58, maxLines = 6) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!w) continue;
    if ((cur + ' ' + w).trim().length <= maxWidth) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w.slice(0, maxWidth);
    }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

/**
 * Renders the Burn After Reading ASCII ash-dissolution animation.
 */
function renderBurnAsh(canvas, frame, message, { alreadyBurned = false } = {}) {
  canvas.clear();

  if (alreadyBurned) {
    for (let i = 0; i < 28; i++) {
      const ax = (hash01(i * 11 + 2) * 78 + Math.sin(frame * 0.05 + i) * 2 + 80) % 80;
      const ay = ((22 - (frame * 0.14 + hash01(i * 17) * 22)) % 22 + 22) % 22;
      canvas.set(ax, ay, i % 3 === 0 ? '·' : '.', 'dim');
    }
    const msg1 = '[ ASHES ONLY ]';
    const msg2 = 'This one-time message was already unlocked and burned.';
    canvas.text(Math.floor((canvas.cols - msg1.length) / 2), 10, msg1, 'orange');
    canvas.text(Math.floor((canvas.cols - msg2.length) / 2), 12, msg2, 'muted');
    return canvas;
  }

  const lines = wrapLines(message, 58, 6);
  const startY = Math.max(4, Math.floor((18 - lines.length) / 2));
  const progress = clamp(frame / 86, 0, 1);

  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    const startX = Math.floor((canvas.cols - line.length) / 2);
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === ' ') continue;
      const burnThreshold = hash01(r * 97 + c * 31 + 5) * 0.72 + (Math.abs(c - line.length / 2) / Math.max(1, line.length)) * 0.25;
      const delta = progress - burnThreshold;

      if (delta < -0.08) {
        canvas.set(startX + c, startY + r, ch, 'white');
      } else if (delta < 0.04) {
        canvas.set(startX + c, startY + r, '*', 'bright');
      } else if (delta < 0.16) {
        canvas.set(startX + c, startY + r, '~', 'orange');
      } else {
        // Drifting ash particle rising upward!
        const driftAge = (delta - 0.16) * 28;
        const ay = startY + r - driftAge * 0.65;
        const ax = startX + c + Math.sin(driftAge * 0.6 + c) * 1.4;
        if (ay >= 0) {
          canvas.set(ax, ay, driftAge < 4 ? ':' : driftAge < 9 ? '·' : '.', driftAge < 4 ? 'gold' : 'dim');
        }
      }
    }
  }

  if (frame >= 80) {
    const notice = '// THIS MESSAGE HAS TURNED TO ASH';
    canvas.text(Math.floor((canvas.cols - notice.length) / 2), 12, notice, 'orange');
    const sub = 'Gone from this terminal forever.';
    canvas.text(Math.floor((canvas.cols - sub.length) / 2), 14, sub, 'muted');
  } else {
    const status = '🔥 BURNING AFTER READING...';
    canvas.text(Math.floor((canvas.cols - status.length) / 2), 21, status, 'orange');
  }

  return canvas;
}

/**
 * Renders the Stardust Assembly + crisp display of an attached ASCII portrait photo.
 */
function renderPhotoReveal(canvas, frame, photo, { sender = '' } = {}) {
  canvas.clear();
  drawStars(canvas, frame, 36, 22, 'dim');

  const w = photo.w || (photo.r[0] ? photo.r[0].length : 58);
  const h = photo.h || photo.r.length;
  const ox = Math.max(1, Math.floor((canvas.cols - w) / 2));
  const oy = Math.max(1, Math.floor((22 - h) / 2));

  // Subtle corner brackets around portrait
  canvas.text(ox - 1, oy - 1, '+' + '-'.repeat(w) + '+', 'muted');
  for (let r = 0; r < h; r++) {
    canvas.set(ox - 1, oy + r, '|', 'dim');
    canvas.set(ox + w, oy + r, '|', 'dim');
  }
  canvas.text(ox - 1, oy + h, '+' + '-'.repeat(w) + '+', 'muted');

  const progress = clamp(frame / 96, 0, 1.25);
  const scanGlyphs = '*+#✦:·';

  for (let y = 0; y < h; y++) {
    const rowChars = photo.r[y] || '';
    const rowCols = photo.c[y] || '';
    for (let x = 0; x < w; x++) {
      const ch = rowChars[x] || ' ';
      const colCode = rowCols[x] || 'w';
      const color = CHAR_TO_COLOR[colCode] || 'white';
      const threshold = (y / Math.max(1, h)) * 0.72 + hash01(y * 73 + x * 19 + 3) * 0.28;
      const delta = progress - threshold;

      if (delta < 0) {
        if (hash01(x * 13 + y * 31 + Math.floor(frame / 4)) > 0.92) {
          canvas.set(ox + x, oy + y, '·', 'dim');
        }
      } else if (delta < 0.08 && ch !== ' ') {
        const g = scanGlyphs[(x + y + frame) % scanGlyphs.length];
        canvas.set(ox + x, oy + y, g, 'bright');
      } else {
        canvas.set(ox + x, oy + y, ch, color);
      }
    }
  }

  const label = sender ? `// MEMORY DECODED · FROM ${sender.toUpperCase()}` : '// MEMORY DECODED IN ASCII';
  canvas.text(Math.max(1, Math.floor((canvas.cols - label.length) / 2)), 23, label, 'bright');
  return canvas;
}


// ===== src/audio.js =====
/**
 * Procedural Web Audio API soundscapes for each emotional ASCII scene.
 * Unlocks synchronously on user gesture and schedules warm layered audio on the Web Audio clock.
 */
const EMOTION_SCALES = {
  love: [261.63, 329.63, 392.0, 493.88, 523.25],       // Cmaj7
  happiness: [293.66, 329.63, 392.0, 440.0, 587.33],   // D major pentatonic
  sadness: [220.0, 261.63, 311.13, 329.63, 392.0],     // A minor / melancholic
  missing: [246.94, 293.66, 369.99, 440.0, 493.88],    // B minor7
  friendship: [261.63, 293.66, 329.63, 392.0, 440.0],  // C major pentatonic
  motivation: [261.63, 329.63, 392.0, 440.0, 523.25],  // Rising C major
  gratitude: [293.66, 369.99, 440.0, 554.37, 587.33],  // Dmaj7 warm glow
  apology: [220.0, 277.18, 329.63, 415.3, 440.0],      // Amaj7 gentle resolve
};
class EmotionAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.activeNodes = [];
    this.timerIds = [];
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted) {
      this.stop();
    } else {
      this.unlock();
    }
  }

  ensureContext() {
    if (this.muted) return null;
    const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.75;

      // Gentle compressor keeps layered chords warm and prevents clipping
      if (typeof this.ctx.createDynamicsCompressor === 'function') {
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -16;
        comp.ratio.value = 4;
        this.master.connect(comp);
        comp.connect(this.ctx.destination);
      } else {
        this.master.connect(this.ctx.destination);
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Must be called synchronously inside a click/tap handler BEFORE any async await,
   * so Safari/Chrome keep the AudioContext unlocked after PBKDF2 decryption finishes.
   */
  unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    try {
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch {
      // Ignore if context is not ready.
    }
  }

  playTone(freq, { duration = 1.6, volume = 0.16, type = 'sine', delay = 0, filterFreq = 2200 } = {}) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Subtle harmonic layer an octave up makes notes clearly audible on small speakers
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(0.22, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    overtone.connect(overGain);
    overGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
    this.activeNodes.push(osc, overtone);
  }

  playSoftTexture(durationSec, { filterFreq = 900, volume = 0.055 } = {}) {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;

    const loopSec = 3;
    const sampleCount = Math.floor(ctx.sampleRate * loopSec);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const fadeOutAt = Math.max(now + 0.5, now + durationSec - 1.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.6);
    gain.gain.setValueAtTime(volume, fadeOutAt);
    gain.gain.linearRampToValueAtTime(0.0001, now + durationSec);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    src.start(now);
    src.stop(now + durationSec + 0.05);
    this.activeNodes.push(src);
  }

  playScene(emotion, durationMs = 17000) {
    this.stop();
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const durationSec = durationMs / 1000;
    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    const stepMs = emotion === 'happiness' ? 380 : emotion === 'sadness' ? 900 : emotion === 'apology' ? 760 : 640;
    const steps = Math.max(1, Math.floor((durationMs - 400) / stepMs));

    // Warm root pad tone underneath so the scene immediately has emotional presence
    const padFreq = scale[0] * 0.5;
    this.playTone(padFreq, { duration: Math.min(durationSec, 12), volume: 0.09, type: 'sine', delay: 0, filterFreq: 900 });

    if (emotion === 'sadness' || emotion === 'apology') {
      this.playSoftTexture(durationSec, { filterFreq: 850, volume: 0.045 });
    } else if (emotion === 'friendship') {
      this.playSoftTexture(durationSec, { filterFreq: 550, volume: 0.035 });
    }

    const apologyMinor = [220.0, 207.65, 196.0, 174.61, 220.0];
    const apologyResolve = [220.0, 277.18, 329.63, 440.0, 554.37];

    for (let i = 0; i < steps; i++) {
      const delaySec = (i * stepMs) / 1000;
      let freq;
      if (emotion === 'apology') {
        const progress = i / Math.max(1, steps - 1);
        const phrase = progress < 0.68 ? apologyMinor : apologyResolve;
        freq = phrase[i % phrase.length];
      } else {
        const idx =
          emotion === 'motivation'
            ? Math.min(scale.length - 1, Math.floor((i / Math.max(1, steps - 1)) * scale.length))
            : (i * 2 + (i % 3)) % scale.length;
        freq = scale[idx] * (i % 6 === 5 && emotion !== 'sadness' ? 1.5 : 1);
      }
      const type = emotion === 'happiness' ? 'triangle' : 'sine';
      const dur = emotion === 'sadness' || emotion === 'missing' || emotion === 'apology' ? 2.1 : 1.4;
      this.playTone(freq, { duration: dur, volume: 0.16, type, delay: delaySec });
    }
  }

  playRevealChord(emotion) {
    if (this.muted) return;
    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    scale.slice(0, 4).forEach((freq, i) => {
      this.playTone(freq, { duration: 2.6, volume: 0.14, type: 'sine', delay: i * 0.09 });
    });
  }

  playChime() {
    if (this.muted) return;
    this.playTone(523.25, { duration: 0.45, volume: 0.14, type: 'sine', delay: 0 });
    this.playTone(659.25, { duration: 0.55, volume: 0.12, type: 'sine', delay: 0.08 });
  }

  stop() {
    for (const id of this.timerIds) clearTimeout(id);
    this.timerIds = [];
    for (const node of this.activeNodes) {
      try {
        node.stop();
      } catch {
        // Already stopped.
      }
    }
    this.activeNodes = [];
  }
}


// ===== src/app.js =====






const FPS = 24;
const FRAME_MS = 1000 / FPS;

const SAMPLES = {
  love: {
    sender: 'Starlight',
    key: '',
    message: 'No matter how busy life gets, every constellation in my sky still spells your name.',
  },
  happiness: {
    sender: 'Maya',
    key: 'confetti',
    message: 'We did it!! Celebrate loud tonight — you earned every single firework in the sky!',
  },
  sadness: {
    sender: 'Liam',
    key: '',
    message: "I know tonight feels heavy. Sit here with me for a minute — you don't have to carry the rain alone.",
  },
  missing: {
    sender: 'Elena',
    key: 'horizon',
    message: 'Three thousand miles between us, yet every quiet evening feels like you just stepped out of the room.',
  },
  friendship: {
    sender: 'Sam',
    key: '',
    message: "Through every chaotic chapter, you're still my favorite person to sit around a fire with and laugh about nothing.",
  },
  motivation: {
    sender: 'Coach',
    key: 'summit',
    message: 'The steepest miles are right before sunrise. Keep climbing — the view at the top is already yours.',
  },
  gratitude: {
    sender: 'Noah',
    key: '',
    message: 'You showed up when I needed it most and never asked for anything back. Thank you for being that light.',
  },
  apology: {
    sender: 'Aria',
    key: '',
    message: "I'm truly sorry for how my words landed. You matter too much to me to ever leave things broken between us.",
  },
};

const state = {
  mode: 'encode',
  receiverOnly: false,
  selectedEmotion: 'love',
  crtOn: true,
  soundOn: true,
  animRafId: null,
  miniRafId: null,
  livingBgRafId: null,
  revealTimerId: null,
  presetUnlockOffsetMs: null,
  photoImage: null,
  photoData: null,
  currentExperience: null,
};

const BURN_STORAGE_KEY = 'tty_feel_burned_ids';

function getBurnedSet() {
  try {
    const raw = localStorage.getItem(BURN_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markMessageBurned(id) {
  if (!id) return;
  try {
    const set = getBurnedSet();
    set.add(id);
    localStorage.setItem(BURN_STORAGE_KEY, JSON.stringify([...set].slice(-100)));
  } catch {
    // Ignore storage errors in private/restricted contexts.
  }
}

const audio = new EmotionAudio();
const theaterCanvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
const previewCanvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
const photoPreviewCanvas = new AsciiCanvas(PHOTO_COLS, PHOTO_ROWS);

const el = {
  brandSubtitle: document.getElementById('brandSubtitle'),
  modeTabs: document.getElementById('modeTabs'),
  tabEncode: document.getElementById('tabEncode'),
  tabDecode: document.getElementById('tabDecode'),
  encodeView: document.getElementById('encodeView'),
  decodeView: document.getElementById('decodeView'),
  decodeLayout: document.getElementById('decodeLayout'),
  decodeCodeGroup: document.getElementById('decodeCodeGroup'),
  decodeKeyGroup: document.getElementById('decodeKeyGroup'),
  receiverLoadedBanner: document.getElementById('receiverLoadedBanner'),
  receiverBannerText: document.getElementById('receiverBannerText'),
  toggleRawCodeBtn: document.getElementById('toggleRawCodeBtn'),
  samplesVault: document.getElementById('samplesVault'),
  theaterView: document.getElementById('theaterView'),
  emotionGrid: document.getElementById('emotionGrid'),
  selectedEmotionPill: document.getElementById('selectedEmotionPill'),
  livePreviewScreen: document.getElementById('livePreviewScreen'),
  miniPreviewAct: document.getElementById('miniPreviewAct'),
  messageInput: document.getElementById('messageInput'),
  charCount: document.getElementById('charCount'),
  senderInput: document.getElementById('senderInput'),
  encodeKeyInput: document.getElementById('encodeKeyInput'),
  unlockAtInput: document.getElementById('unlockAtInput'),
  unlockPresetNote: document.getElementById('unlockPresetNote'),
  burnToggle: document.getElementById('burnToggle'),
  photoFileInput: document.getElementById('photoFileInput'),
  choosePhotoBtn: document.getElementById('choosePhotoBtn'),
  removePhotoBtn: document.getElementById('removePhotoBtn'),
  photoEditorBox: document.getElementById('photoEditorBox'),
  photoPreviewScreen: document.getElementById('photoPreviewScreen'),
  photoStyleSelect: document.getElementById('photoStyleSelect'),
  photoContrastInput: document.getElementById('photoContrastInput'),
  photoFullCheck: document.getElementById('photoFullCheck'),
  genKeyBtn: document.getElementById('genKeyBtn'),
  encryptBtn: document.getElementById('encryptBtn'),
  encodeError: document.getElementById('encodeError'),
  encodedOutputBox: document.getElementById('encodedOutputBox'),
  outputModeBadge: document.getElementById('outputModeBadge'),
  encodedToken: document.getElementById('encodedToken'),
  payloadStats: document.getElementById('payloadStats'),
  copyCodeBtn: document.getElementById('copyCodeBtn'),
  copyLinkBtn: document.getElementById('copyLinkBtn'),
  testDecodeBtn: document.getElementById('testDecodeBtn'),
  previewEmotionBtn: document.getElementById('previewEmotionBtn'),
  decodeCodeInput: document.getElementById('decodeCodeInput'),
  decodeCodeStatus: document.getElementById('decodeCodeStatus'),
  decodeKeyInput: document.getElementById('decodeKeyInput'),
  decryptBtn: document.getElementById('decryptBtn'),
  decodeError: document.getElementById('decodeError'),
  sampleButtons: document.getElementById('sampleButtons'),
  toggleSound: document.getElementById('toggleSound'),
  soundLabel: document.getElementById('soundLabel'),
  toggleCrt: document.getElementById('toggleCrt'),
  terminalStage: document.getElementById('terminalStage'),
  asciiScreen: document.getElementById('asciiScreen'),
  theaterEmotionBadge: document.getElementById('theaterEmotionBadge'),
  theaterActLabel: document.getElementById('theaterActLabel'),
  theaterTimer: document.getElementById('theaterTimer'),
  theaterProgress: document.getElementById('theaterProgress'),
  skipAnimBtn: document.getElementById('skipAnimBtn'),
  replayAnimBtn: document.getElementById('replayAnimBtn'),
  closeTheaterBtn: document.getElementById('closeTheaterBtn'),
  revealOverlay: document.getElementById('revealOverlay'),
  revealEmotionTag: document.getElementById('revealEmotionTag'),
  revealModeBadge: document.getElementById('revealModeBadge'),
  revealSenderTag: document.getElementById('revealSenderTag'),
  revealMessageText: document.getElementById('revealMessageText'),
  burnNowBtn: document.getElementById('burnNowBtn'),
  revealReplayBtn: document.getElementById('revealReplayBtn'),
  replyBtn: document.getElementById('replyBtn'),
};

function applyEmotionTheme(emotionId) {
  const emo = EMOTIONS[emotionId] || EMOTIONS.love;
  const root = document.documentElement;
  root.style.setProperty('--accent', emo.accent);
  root.style.setProperty('--secondary', emo.secondary);
  root.style.setProperty('--glow', emo.glow);
  root.style.setProperty('--tint', emo.tint);
  if (el.selectedEmotionPill) {
    el.selectedEmotionPill.textContent = `${emo.icon} ${emo.label}`;
  }
}

function stopMiniPreview() {
  if (state.miniRafId !== null) {
    cancelAnimationFrame(state.miniRafId);
    state.miniRafId = null;
  }
}

function startMiniPreview() {
  stopMiniPreview();
  if (state.mode !== 'encode' || !el.theaterView.classList.contains('hidden')) return;

  let startTime = null;
  let lastFrame = -1;

  const tick = (now) => {
    if (state.mode !== 'encode' || !el.theaterView.classList.contains('hidden')) {
      state.miniRafId = null;
      return;
    }
    if (startTime === null) startTime = now;
    const emo = EMOTIONS[state.selectedEmotion];
    const frame = Math.floor((now - startTime) / FRAME_MS) % emo.durationFrames;
    if (frame !== lastFrame) {
      lastFrame = frame;
      renderSceneFrame(emo.id, frame, emo.durationFrames, previewCanvas);
      el.livePreviewScreen.innerHTML = previewCanvas.toHTML();
      el.miniPreviewAct.textContent = getActTitle(emo, frame);
    }
    state.miniRafId = requestAnimationFrame(tick);
  };

  state.miniRafId = requestAnimationFrame(tick);
}

function setMode(mode) {
  stopTheaterPlayback();
  state.mode = mode;
  el.tabEncode.classList.toggle('active', mode === 'encode');
  el.tabDecode.classList.toggle('active', mode === 'decode');
  el.encodeView.classList.toggle('hidden', mode !== 'encode');
  el.decodeView.classList.toggle('hidden', mode !== 'decode');
  el.theaterView.classList.add('hidden');
  if (mode === 'encode') startMiniPreview();
  else stopMiniPreview();
}

function renderEmotionCards() {
  el.emotionGrid.innerHTML = '';
  for (const emo of EMOTION_LIST) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `emotion-card${emo.id === state.selectedEmotion ? ' selected' : ''}`;
    btn.style.setProperty('--card-accent', emo.accent);
    btn.style.setProperty('--card-glow', emo.glow);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(emo.id === state.selectedEmotion));

    const head = document.createElement('div');
    head.className = 'emotion-card-head';

    const title = document.createElement('div');
    title.className = 'emotion-card-title';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'emotion-icon';
    iconSpan.textContent = emo.icon;
    const labelSpan = document.createElement('span');
    labelSpan.textContent = emo.label;
    title.append(iconSpan, labelSpan);
    head.appendChild(title);

    const art = document.createElement('pre');
    art.className = 'emotion-mini-art';
    art.textContent = emo.miniArt.join('\n');

    const tag = document.createElement('div');
    tag.className = 'emotion-tagline';
    tag.textContent = emo.tagline;

    btn.append(head, art, tag);
    btn.addEventListener('click', () => {
      state.selectedEmotion = emo.id;
      applyEmotionTheme(emo.id);
      renderEmotionCards();
      startMiniPreview();
      if (state.photoImage) updatePhotoAsciiPreview();
    });
    el.emotionGrid.appendChild(btn);
  }
}

function getEmotionPalette(emotionId) {
  const map = {
    love: ['rose', 'gold'],
    happiness: ['gold', 'cyan'],
    sadness: ['blue', 'gold'],
    missing: ['violet', 'rose'],
    friendship: ['orange', 'gold'],
    motivation: ['orange', 'gold'],
    gratitude: ['gold', 'rose'],
    apology: ['cyan', 'gold'],
  };
  return map[emotionId] || ['rose', 'gold'];
}

function updatePhotoAsciiPreview() {
  if (!state.photoImage) return;
  const [primaryColor, secondaryColor] = getEmotionPalette(state.selectedEmotion);
  state.photoData = convertImageToAscii(state.photoImage, {
    style: el.photoStyleSelect.value,
    contrast: Number(el.photoContrastInput.value || 1.55),
    fullImage: Boolean(el.photoFullCheck.checked),
    primaryColor,
    secondaryColor,
  });

  const gridCanvas = new AsciiCanvas(state.photoData.w, state.photoData.h);
  for (let y = 0; y < state.photoData.h; y++) {
    const chars = state.photoData.r[y];
    const cols = state.photoData.c[y];
    for (let x = 0; x < state.photoData.w; x++) {
      gridCanvas.set(x, y, chars[x] || ' ', CHAR_TO_COLOR[cols[x]] || 'white');
    }
  }
  el.photoPreviewScreen.innerHTML = gridCanvas.toHTML();
}

function clearAttachedPhoto() {
  state.photoImage = null;
  state.photoData = null;
  el.photoFileInput.value = '';
  el.photoEditorBox.classList.add('hidden');
  el.removePhotoBtn.classList.add('hidden');
  el.choosePhotoBtn.textContent = 'Choose photo';
}

function renderSampleButtons() {
  el.sampleButtons.innerHTML = '';
  for (const emo of EMOTION_LIST) {
    const sample = SAMPLES[emo.id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sample-card';
    btn.style.setProperty('--sample-accent', emo.accent);
    btn.style.setProperty('--sample-glow', emo.glow);

    const top = document.createElement('div');
    top.className = 'sample-card-top';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${emo.icon} ${emo.label}`;
    const playSpan = document.createElement('span');
    playSpan.className = 'sample-play-tag';
    playSpan.textContent = 'Play';
    top.append(nameSpan, playSpan);

    const hint = document.createElement('div');
    hint.className = 'sample-key-hint';
    hint.textContent = sample.key ? `Key: ${sample.key}` : 'Open code (no key)';

    btn.append(top, hint);
    btn.addEventListener('click', async () => {
      audio.unlock();
      const code = await encryptMessage({
        message: sample.message,
        emotion: emo.id,
        key: sample.key,
        sender: sample.sender,
      });
      el.decodeCodeInput.value = code;
      el.decodeKeyInput.value = sample.key;
      updateDecodeStatus();
      el.decodeError.textContent = '';
      await handleDecryptAndPlay();
    });
    el.sampleButtons.appendChild(btn);
  }
}

function updateDecodeStatus() {
  const info = inspectCode(el.decodeCodeInput.value);
  el.decodeCodeStatus.classList.remove('code-status-open', 'code-status-locked');
  if (!el.decodeCodeInput.value.trim()) {
    el.decodeCodeStatus.textContent = 'Waiting for code...';
    return;
  }
  if (!info.valid) {
    el.decodeCodeStatus.textContent = 'Expecting TTY0 / TTY1 / TTY2 code';
    return;
  }
  if (info.requiresKey) {
    el.decodeCodeStatus.textContent = 'Key required to unlock';
    el.decodeCodeStatus.classList.add('code-status-locked');
  } else {
    el.decodeCodeStatus.textContent = 'Open code. No key needed.';
    el.decodeCodeStatus.classList.add('code-status-open');
  }
}

function generateSecretKey() {
  const words = ['star', 'moon', 'rain', 'spark', 'pine', 'dawn', 'echo', 'heart', 'wave', 'glow'];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(10 + Math.random() * 90);
  el.encodeKeyInput.value = `${pick()}-${pick()}-${num}`;
  el.encodeKeyInput.type = 'text';
  const peekBtn = document.querySelector('[data-peek="encodeKeyInput"]');
  if (peekBtn) peekBtn.textContent = 'Hide';
}

async function handleEncrypt() {
  el.encodeError.textContent = '';
  const origLabel = el.encryptBtn.textContent;
  el.encryptBtn.disabled = true;
  el.encryptBtn.textContent = 'Encrypting...';
  try {
    const message = el.messageInput.value;
    const key = el.encodeKeyInput.value;
    const sender = el.senderInput.value;
    let unlockAt = null;
    if (state.presetUnlockOffsetMs) {
      unlockAt = Date.now() + state.presetUnlockOffsetMs;
    } else if (el.unlockAtInput.value) {
      const parsedTs = new Date(el.unlockAtInput.value).getTime();
      if (!Number.isFinite(parsedTs) || parsedTs <= Date.now()) {
        throw new Error('Time capsule unlock date must be in the future.');
      }
      unlockAt = parsedTs;
    }
    const burn = Boolean(el.burnToggle?.checked);

    const token = await encryptMessage({
      message,
      emotion: state.selectedEmotion,
      key,
      sender,
      unlockAt,
      burn,
      photo: state.photoData,
    });
    el.encodedToken.textContent = token;
    const cipherLabel = token.startsWith('TTY0.')
      ? 'Open cipher'
      : token.startsWith('TTY1.')
        ? 'AES 256 GCM'
        : 'SHA256 CTR';
    const extras = [];
    if (unlockAt) extras.push('Time capsule');
    if (burn) extras.push('Burn once');
    if (state.photoData) extras.push('ASCII photo');
    el.outputModeBadge.textContent = token.startsWith('TTY0.')
      ? 'Open code ready (no key needed)'
      : 'Locked code ready';
    el.payloadStats.textContent = [`${token.length} chars`, cipherLabel, ...extras].join(' · ');
    el.encodedOutputBox.classList.remove('hidden');
  } catch (err) {
    el.encodeError.textContent = err.message;
  } finally {
    el.encryptBtn.disabled = false;
    el.encryptBtn.textContent = origLabel;
  }
}

async function handleDecryptAndPlay() {
  audio.unlock();
  el.decodeError.textContent = '';
  try {
    const payload = await decryptMessage({
      code: el.decodeCodeInput.value,
      key: el.decodeKeyInput.value,
    });
    if (payload.burn && payload.id && getBurnedSet().has(payload.id)) {
      startBurnAshTheater({ emotion: payload.emotion, message: payload.message, alreadyBurned: true });
      return;
    }
    if (payload.unlockAt && Date.now() < payload.unlockAt) {
      startTimeCapsuleTheater(payload);
      return;
    }
    startTheater({
      emotion: payload.emotion,
      message: payload.message,
      sender: payload.sender,
      burn: payload.burn,
      id: payload.id,
      photo: payload.photo,
      isPreview: false,
    });
  } catch (err) {
    el.decodeError.textContent = err.message;
  }
}

function stopTheaterPlayback() {
  if (state.animRafId !== null) {
    cancelAnimationFrame(state.animRafId);
    state.animRafId = null;
  }
  if (state.livingBgRafId !== null) {
    cancelAnimationFrame(state.livingBgRafId);
    state.livingBgRafId = null;
  }
  if (state.revealTimerId !== null) {
    clearTimeout(state.revealTimerId);
    state.revealTimerId = null;
  }
  audio.stop();
}

function formatSeconds(sec) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function getActTitle(emo, frame) {
  let title = emo.acts[0].title;
  for (const act of emo.acts) {
    if (frame >= act.at) title = act.title;
  }
  return title;
}

function startTimeCapsuleTheater(payload) {
  stopTheaterPlayback();
  stopMiniPreview();
  state.currentExperience = { ...payload, isTimeCapsule: true };
  applyEmotionTheme('missing');

  el.encodeView.classList.add('hidden');
  el.decodeView.classList.add('hidden');
  el.theaterView.classList.remove('hidden');

  el.asciiScreen.classList.remove('dimmed');
  el.revealOverlay.classList.add('hidden');
  el.skipAnimBtn.classList.add('hidden');
  el.replayAnimBtn.classList.add('hidden');
  el.theaterEmotionBadge.textContent = '⏳ TIME CAPSULE';
  el.theaterActLabel.textContent = 'SEALED UNTIL TARGET HOUR';
  el.theaterProgress.style.width = '0%';

  const totalLockMs = Math.max(1000, payload.unlockAt - Date.now());
  let startTime = null;
  let lastFrame = -1;

  const tick = (now) => {
    if (startTime === null) startTime = now;
    const remainingMs = payload.unlockAt - Date.now();

    if (remainingMs <= 0) {
      state.animRafId = null;
      el.skipAnimBtn.classList.remove('hidden');
      el.replayAnimBtn.classList.remove('hidden');
      startTheater({
        emotion: payload.emotion,
        message: payload.message,
        sender: payload.sender,
        burn: payload.burn,
        id: payload.id,
        photo: payload.photo,
        isPreview: false,
      });
      return;
    }

    const frame = Math.floor((now - startTime) / FRAME_MS);
    if (frame !== lastFrame) {
      lastFrame = frame;
      renderTimeCapsule(theaterCanvas, frame, remainingMs);
      el.asciiScreen.innerHTML = theaterCanvas.toHTML();
      const secsLeft = Math.ceil(remainingMs / 1000);
      el.theaterTimer.textContent = `T-${formatSeconds(secsLeft)}`;
      const pct = Math.min(100, Math.max(0, ((totalLockMs - remainingMs) / totalLockMs) * 100));
      el.theaterProgress.style.width = `${pct}%`;
    }
    state.animRafId = requestAnimationFrame(tick);
  };

  state.animRafId = requestAnimationFrame(tick);
}

function startBurnAshTheater({ emotion = 'motivation', message, alreadyBurned = false }) {
  stopTheaterPlayback();
  stopMiniPreview();
  state.currentExperience = null;
  applyEmotionTheme(emotion);

  el.encodeView.classList.add('hidden');
  el.decodeView.classList.add('hidden');
  el.theaterView.classList.remove('hidden');

  el.asciiScreen.classList.remove('dimmed');
  el.revealOverlay.classList.add('hidden');
  el.skipAnimBtn.classList.add('hidden');
  el.replayAnimBtn.classList.add('hidden');
  el.theaterEmotionBadge.textContent = '🔥 BURN AFTER READING';
  el.theaterActLabel.textContent = alreadyBurned ? 'ASHES ONLY' : 'DISSOLVING INTO ASH';
  el.theaterTimer.textContent = alreadyBurned ? 'BURNED' : '00:00 / 00:05';

  let startTime = null;
  let lastFrame = -1;
  const burnFrames = 115;

  const tick = (now) => {
    if (startTime === null) startTime = now;
    const frame = Math.floor((now - startTime) / FRAME_MS);
    const cappedFrame = alreadyBurned ? frame : Math.min(burnFrames, frame);

    if (cappedFrame !== lastFrame) {
      lastFrame = cappedFrame;
      renderBurnAsh(theaterCanvas, cappedFrame, message, { alreadyBurned });
      el.asciiScreen.innerHTML = theaterCanvas.toHTML();
      if (!alreadyBurned) {
        el.theaterTimer.textContent = `${formatSeconds(cappedFrame / FPS)} / 00:05`;
        el.theaterProgress.style.width = `${(cappedFrame / burnFrames) * 100}%`;
      } else {
        el.theaterProgress.style.width = '100%';
      }
    }

    if (alreadyBurned || cappedFrame < burnFrames) {
      state.animRafId = requestAnimationFrame(tick);
    } else {
      state.animRafId = null;
      el.theaterActLabel.textContent = 'MESSAGE TURNED TO ASH';
    }
  };

  state.animRafId = requestAnimationFrame(tick);
}

function startTheater(experience) {
  stopTheaterPlayback();
  stopMiniPreview();
  state.currentExperience = experience;
  const emo = EMOTIONS[experience.emotion];
  applyEmotionTheme(emo.id);

  el.encodeView.classList.add('hidden');
  el.decodeView.classList.add('hidden');
  el.theaterView.classList.remove('hidden');

  el.skipAnimBtn.classList.remove('hidden');
  el.replayAnimBtn.classList.remove('hidden');
  el.terminalStage.classList.remove('with-photo');
  el.asciiScreen.classList.remove('dimmed');
  el.revealOverlay.classList.add('hidden');
  el.revealMessageText.textContent = '';
  el.revealMessageText.classList.remove('done');
  el.theaterEmotionBadge.textContent = `${emo.icon} ${emo.label.toUpperCase()}`;

  const photoFrames = experience.photo ? 132 : 0;
  const totalFrames = emo.durationFrames + photoFrames;
  const totalSec = totalFrames / FPS;
  let startTime = null;
  let lastFrame = -1;

  audio.playScene(emo.id, totalSec * 1000);

  const tick = (now) => {
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    const frame = Math.min(totalFrames - 1, Math.floor(elapsed / FRAME_MS));

    if (frame !== lastFrame) {
      lastFrame = frame;
      if (frame < emo.durationFrames) {
        renderSceneFrame(emo.id, frame, emo.durationFrames, theaterCanvas);
        el.theaterActLabel.textContent = getActTitle(emo, frame);
      } else {
        renderPhotoReveal(theaterCanvas, frame - emo.durationFrames, experience.photo, {
          sender: experience.sender,
        });
        el.theaterActLabel.textContent = 'ACT V // MEMORY IN ASCII';
      }
      el.asciiScreen.innerHTML = theaterCanvas.toHTML();
      el.theaterTimer.textContent = `${formatSeconds(frame / FPS)} / ${formatSeconds(totalSec)}`;
      el.theaterProgress.style.width = `${((frame + 1) / totalFrames) * 100}%`;
    }

    if (frame < totalFrames - 1) {
      state.animRafId = requestAnimationFrame(tick);
    } else {
      state.animRafId = null;
      triggerMessageReveal();
    }
  };

  state.animRafId = requestAnimationFrame(tick);
}

function startLivingBackdrop(emo, experience) {
  if (state.livingBgRafId !== null) cancelAnimationFrame(state.livingBgRafId);
  let start = null;
  let lastTick = -1;
  const baseFrame = emo.durationFrames;

  const loop = (now) => {
    if (el.theaterView.classList.contains('hidden') || el.revealOverlay.classList.contains('hidden')) {
      state.livingBgRafId = null;
      return;
    }
    if (start === null) start = now;
    const step = Math.floor((now - start) / FRAME_MS);
    if (step !== lastTick) {
      lastTick = step;
      if (experience.photo) {
        renderPhotoReveal(theaterCanvas, 120 + step, experience.photo, { sender: experience.sender });
      } else {
        renderSceneFrame(emo.id, baseFrame + step, emo.durationFrames, theaterCanvas);
      }
      el.asciiScreen.innerHTML = theaterCanvas.toHTML();
    }
    state.livingBgRafId = requestAnimationFrame(loop);
  };

  state.livingBgRafId = requestAnimationFrame(loop);
}

function triggerMessageReveal() {
  if (!state.currentExperience) return;
  if (state.animRafId !== null) {
    cancelAnimationFrame(state.animRafId);
    state.animRafId = null;
  }
  audio.stop();

  const { emotion, message, sender, isPreview, burn, id, photo } = state.currentExperience;
  const emo = EMOTIONS[emotion];
  if (photo) {
    renderPhotoReveal(theaterCanvas, 120, photo, { sender });
    el.asciiScreen.classList.remove('dimmed');
    el.terminalStage.classList.add('with-photo');
  } else {
    renderSceneFrame(emo.id, emo.durationFrames - 1, emo.durationFrames, theaterCanvas);
    el.asciiScreen.classList.add('dimmed');
    el.terminalStage.classList.remove('with-photo');
  }
  el.asciiScreen.innerHTML = theaterCanvas.toHTML();
  el.theaterProgress.style.width = '100%';
  el.theaterActLabel.textContent = isPreview ? 'PREVIEW COMPLETE' : 'MESSAGE DECODED';

  if (burn && !isPreview) {
    markMessageBurned(id);
    el.revealModeBadge.classList.remove('hidden');
    el.burnNowBtn.classList.remove('hidden');
    el.revealReplayBtn.classList.add('hidden');
    el.replayAnimBtn.classList.add('hidden');
  } else {
    el.revealModeBadge.classList.add('hidden');
    el.burnNowBtn.classList.add('hidden');
    el.revealReplayBtn.classList.remove('hidden');
    el.replayAnimBtn.classList.remove('hidden');
  }
  el.replyBtn.classList.toggle('hidden', state.receiverOnly);

  el.revealEmotionTag.textContent = `${emo.icon} ${emo.label.toUpperCase()}`;
  el.revealSenderTag.textContent = sender ? `from ${sender}` : '';
  el.revealOverlay.classList.remove('hidden');

  startLivingBackdrop(emo, state.currentExperience);
  audio.playRevealChord(emo.id);
  runScrambleTypewriter(message);
}

function runScrambleTypewriter(targetText) {
  const glyphs = '#$%&*@+=-~<>?/';
  let revealed = 0;
  const stepMs = Math.max(18, Math.min(40, Math.floor(2400 / Math.max(1, targetText.length))));

  const step = () => {
    revealed = Math.min(targetText.length, revealed + 1);
    const stable = targetText.slice(0, revealed);
    let scramble = '';
    if (revealed < targetText.length) {
      const lookahead = Math.min(4, targetText.length - revealed);
      for (let i = 0; i < lookahead; i++) {
        const ch = targetText[revealed + i];
        scramble += ch === ' ' || ch === '\n' ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
    }
    el.revealMessageText.textContent = stable + scramble;

    if (revealed < targetText.length) {
      state.revealTimerId = setTimeout(step, stepMs);
    } else {
      el.revealMessageText.classList.add('done');
      state.revealTimerId = null;
    }
  };

  step();
}

function closeTheater() {
  stopTheaterPlayback();
  el.theaterView.classList.add('hidden');
  setMode(state.mode);
  applyEmotionTheme(state.selectedEmotion);
}

async function copyText(text, btn, defaultLabel, copiedLabel) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  btn.textContent = copiedLabel;
  setTimeout(() => (btn.textContent = defaultLabel), 1600);
}

function formatLocalDatetimeInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function wireEvents() {
  el.tabEncode.addEventListener('click', () => setMode('encode'));
  el.tabDecode.addEventListener('click', () => setMode('decode'));

  el.messageInput.addEventListener('input', () => {
    el.charCount.textContent = `${el.messageInput.value.length} chars`;
  });

  el.decodeCodeInput.addEventListener('input', updateDecodeStatus);

  document.querySelectorAll('[data-unlock-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-unlock-preset]').forEach((b) => b.classList.remove('active'));
      const preset = btn.dataset.unlockPreset;
      if (preset === 'clear') {
        state.presetUnlockOffsetMs = null;
        el.unlockAtInput.value = '';
        el.unlockPresetNote.textContent = '';
      } else if (preset === '15s') {
        btn.classList.add('active');
        state.presetUnlockOffsetMs = 15_000;
        el.unlockAtInput.value = '';
        el.unlockPresetNote.textContent = '⏳ Demo lock: unlocks 15 seconds after code creation';
      } else if (preset === 'midnight') {
        btn.classList.add('active');
        state.presetUnlockOffsetMs = null;
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        el.unlockAtInput.value = formatLocalDatetimeInput(d);
        el.unlockPresetNote.textContent = '⏳ Locked until tonight at midnight';
      }
    });
  });

  el.unlockAtInput.addEventListener('input', () => {
    document.querySelectorAll('[data-unlock-preset]').forEach((b) => b.classList.remove('active'));
    state.presetUnlockOffsetMs = null;
    el.unlockPresetNote.textContent = el.unlockAtInput.value
      ? `⏳ Locked until ${new Date(el.unlockAtInput.value).toLocaleString()}`
      : '';
  });

  el.burnNowBtn.addEventListener('click', () => {
    if (!state.currentExperience) return;
    startBurnAshTheater({
      emotion: state.currentExperience.emotion,
      message: state.currentExperience.message,
      alreadyBurned: false,
    });
  });

  el.choosePhotoBtn.addEventListener('click', () => el.photoFileInput.click());
  el.removePhotoBtn.addEventListener('click', clearAttachedPhoto);
  el.photoFileInput.addEventListener('change', () => {
    const file = el.photoFileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        state.photoImage = img;
        el.photoEditorBox.classList.remove('hidden');
        el.removePhotoBtn.classList.remove('hidden');
        el.choosePhotoBtn.textContent = 'Change photo';
        updatePhotoAsciiPreview();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  el.photoStyleSelect.addEventListener('change', updatePhotoAsciiPreview);
  el.photoContrastInput.addEventListener('input', updatePhotoAsciiPreview);
  el.photoFullCheck.addEventListener('change', updatePhotoAsciiPreview);

  el.genKeyBtn.addEventListener('click', generateSecretKey);
  el.encryptBtn.addEventListener('click', handleEncrypt);
  el.decryptBtn.addEventListener('click', handleDecryptAndPlay);

  el.previewEmotionBtn.addEventListener('click', () => {
    audio.unlock();
    const emo = EMOTIONS[state.selectedEmotion];
    startTheater({
      emotion: emo.id,
      message: SAMPLES[emo.id].message,
      sender: 'Preview Mode',
      photo: state.photoData,
      isPreview: true,
    });
  });

  el.copyCodeBtn.addEventListener('click', () =>
    copyText(el.encodedToken.textContent, el.copyCodeBtn, 'Copy code', 'Code copied')
  );

  el.copyLinkBtn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.hash = `code=${encodeURIComponent(el.encodedToken.textContent)}`;
    copyText(url.toString(), el.copyLinkBtn, 'Copy share link', 'Share link copied');
  });

  el.testDecodeBtn.addEventListener('click', () => {
    const token = el.encodedToken.textContent;
    const key = el.encodeKeyInput.value;
    setMode('decode');
    el.decodeCodeInput.value = token;
    el.decodeKeyInput.value = key;
    updateDecodeStatus();
  });

  document.querySelectorAll('[data-peek]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.peek);
      if (!target) return;
      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? 'Hide' : 'Show';
    });
  });

  el.toggleSound.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    audio.setMuted(!state.soundOn);
    el.soundLabel.textContent = `Sound: ${state.soundOn ? 'ON' : 'OFF'}`;
    if (state.soundOn) audio.playChime();
  });

  el.toggleCrt.addEventListener('click', () => {
    state.crtOn = !state.crtOn;
    document.body.classList.toggle('crt-enabled', state.crtOn);
    el.toggleCrt.textContent = `CRT: ${state.crtOn ? 'ON' : 'OFF'}`;
  });

  el.toggleRawCodeBtn.addEventListener('click', () => {
    const isHidden = el.decodeCodeGroup.classList.toggle('hidden');
    el.toggleRawCodeBtn.textContent = isHidden ? 'View code' : 'Hide code';
  });

  el.skipAnimBtn.addEventListener('click', triggerMessageReveal);
  el.replayAnimBtn.addEventListener('click', () => {
    audio.unlock();
    if (state.currentExperience) startTheater(state.currentExperience);
  });
  el.revealReplayBtn.addEventListener('click', () => {
    audio.unlock();
    if (state.currentExperience) startTheater(state.currentExperience);
  });
  el.closeTheaterBtn.addEventListener('click', closeTheater);
  el.replyBtn.addEventListener('click', () => {
    closeTheater();
    setMode('encode');
    el.messageInput.focus();
  });
}

function setReceiverOnlyMode(enabled, code = '') {
  state.receiverOnly = Boolean(enabled);
  el.modeTabs.classList.toggle('hidden', state.receiverOnly);
  el.samplesVault.classList.toggle('hidden', state.receiverOnly);
  el.decodeLayout.classList.toggle('receiver-only', state.receiverOnly);

  if (state.receiverOnly) {
    el.brandSubtitle.textContent = 'Someone sent you a secret emotional terminal message';
    el.receiverLoadedBanner.classList.remove('hidden');
    el.decodeCodeGroup.classList.add('hidden');
    el.toggleRawCodeBtn.textContent = 'View code';

    const info = inspectCode(code);
    if (info.valid && !info.requiresKey) {
      el.decodeKeyGroup.classList.add('hidden');
      el.receiverBannerText.textContent = 'This open message is ready. No secret key needed.';
      el.decryptBtn.textContent = 'Unlock and play your message';
    } else {
      el.decodeKeyGroup.classList.remove('hidden');
      el.receiverBannerText.textContent = 'Enter the secret key from the sender to unlock your story.';
      el.decryptBtn.textContent = 'Unlock and play experience';
    }
  } else {
    el.brandSubtitle.textContent = 'Encrypted messages, felt in ASCII cinema';
    el.receiverLoadedBanner.classList.add('hidden');
    el.decodeCodeGroup.classList.remove('hidden');
    el.decodeKeyGroup.classList.remove('hidden');
    el.decryptBtn.textContent = 'Unlock and play experience';
  }
}

function checkUrlForSharedCode() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#code=')) {
    const code = decodeURIComponent(hash.slice('#code='.length));
    if (code) {
      setMode('decode');
      el.decodeCodeInput.value = code;
      updateDecodeStatus();
      setReceiverOnlyMode(true, code);
      if (!el.decodeKeyGroup.classList.contains('hidden')) {
        el.decodeKeyInput.focus();
      }
      return;
    }
  }
  setReceiverOnlyMode(false);
}

window.addEventListener('hashchange', checkUrlForSharedCode);

renderEmotionCards();
renderSampleButtons();
applyEmotionTheme(state.selectedEmotion);
wireEvents();
checkUrlForSharedCode();
startMiniPreview();

})();
