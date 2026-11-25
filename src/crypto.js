import { EMOTIONS } from './emotions.js';

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
export function inspectCode(code) {
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
export async function encryptMessage({
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
export async function decryptMessage({ code, key = '' }) {
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
