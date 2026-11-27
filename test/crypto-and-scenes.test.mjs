import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { encryptMessage, decryptMessage, inspectCode } from '../src/crypto.js';
import { EMOTION_LIST } from '../src/emotions.js';
import { AsciiCanvas } from '../src/ascii-canvas.js';
import { pixelsToAsciiGrid, PHOTO_COLS, PHOTO_ROWS } from '../src/photo-ascii.js';
import {
  renderSceneFrame,
  renderTimeCapsule,
  renderBurnAsh,
  renderPhotoReveal,
  renderNotFoundStatic,
  CANVAS_COLS,
  CANVAS_ROWS,
} from '../src/scenes.js';
import { EmotionAudio } from '../src/audio.js';
import {
  validateMessageInput,
  validatePassphraseInput,
  validateFutureUnlockDate,
  getProtocolBadge,
  inspectCipherStatus,
} from '../src/utils/validation.js';

test('encodes and decodes open message without a secret key (TTY0)', async () => {
  const message = 'Just wanted to remind you how glad I am that you are in my life.';
  const code = await encryptMessage({
    message,
    emotion: 'gratitude',
    sender: 'Anil',
  });

  assert.ok(code.startsWith('TTY0.'), 'Expected TTY0. prefix when key is omitted');
  assert.deepEqual(inspectCode(code).requiresKey, false);

  const decoded = await decryptMessage({ code });
  assert.equal(decoded.emotion, 'gratitude');
  assert.equal(decoded.message, message);
  assert.equal(decoded.sender, 'Anil');
  assert.equal(decoded.protected, false);
});

test('encrypts and decrypts key-protected message round-trip (TTY1)', async () => {
  const secret = 'midnight-constellation-42';
  const message = 'No matter how far apart we are, look up at the stars tonight.';
  const code = await encryptMessage({
    message,
    emotion: 'love',
    key: secret,
    sender: 'Anil',
  });

  assert.ok(code.startsWith('TTY1.'), 'Expected TTY1. prefix when key is provided');
  assert.equal(inspectCode(code).requiresKey, true);

  const decoded = await decryptMessage({ code, key: secret });
  assert.equal(decoded.emotion, 'love');
  assert.equal(decoded.message, message);
  assert.equal(decoded.sender, 'Anil');
  assert.equal(decoded.protected, true);
});

test('rejects missing key, wrong secret key, or tampered code', async () => {
  const code = await encryptMessage({
    message: 'Keep climbing!',
    emotion: 'motivation',
    key: 'right-key',
  });

  await assert.rejects(
    () => decryptMessage({ code, key: '' }),
    /protected by a secret key/
  );

  await assert.rejects(
    () => decryptMessage({ code, key: 'wrong-key' }),
    /Decryption failed/
  );

  const tampered = code.slice(0, -4) + 'AAAA';
  await assert.rejects(
    () => decryptMessage({ code: tampered, key: 'right-key' }),
    /Decryption failed/
  );
});

test('all 8 emotion ASCII scenes and 404 static render valid 80x24 frames', () => {
  assert.equal(EMOTION_LIST.length, 8);
  for (const emotion of EMOTION_LIST) {
    const sampleFrames = [0, 96, 216, 320, emotion.durationFrames - 1, emotion.durationFrames + 30];
    for (const f of sampleFrames) {
      const canvas = renderSceneFrame(emotion.id, f, emotion.durationFrames);
      const lines = canvas.toLines();
      assert.equal(lines.length, CANVAS_ROWS, `${emotion.id} row count mismatch at frame ${f}`);
      for (const line of lines) {
        assert.equal(line.length, CANVAS_COLS, `${emotion.id} col width mismatch at frame ${f}`);
      }
      const nonBlank = lines.join('').trim().length;
      assert.ok(nonBlank > 20, `${emotion.id} rendered too little content at ${f}`);
      const html = canvas.toHTML();
      assert.ok(html.length > 0);
    }
  }

  const notFoundCanvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
  renderNotFoundStatic(notFoundCanvas, 10);
  const nfText = notFoundCanvas.toLines().join('\n');
  assert.ok(nfText.includes('404 // SIGNAL LOST IN TRANSIT'));
});

test('supports Time Capsule unlockAt and Burn After Reading metadata + scenes', async () => {
  const futureUnlock = Date.now() + 60_000;
  const code = await encryptMessage({
    message: 'Happy midnight birthday!',
    emotion: 'happiness',
    unlockAt: futureUnlock,
    burn: true,
  });

  const decoded = await decryptMessage({ code });
  assert.equal(decoded.unlockAt, Math.round(futureUnlock));
  assert.equal(decoded.burn, true);
  assert.ok(decoded.id && decoded.id.length >= 6);

  const canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
  renderTimeCapsule(canvas, 12, 95_000);
  const capsuleText = canvas.toLines().join('\n');
  assert.ok(capsuleText.includes('UNLOCKS IN'), 'Expected countdown in Time Capsule scene');

  renderBurnAsh(canvas, 45, 'Happy midnight birthday!', { alreadyBurned: false });
  assert.ok(canvas.toLines().join('').trim().length > 20);

  renderBurnAsh(canvas, 95, 'Happy midnight birthday!', { alreadyBurned: false });
  assert.ok(canvas.toLines().join('\n').includes('TURNED TO ASH'));
});

test('converts pixels to ASCII portrait, round-trips in cipher, and renders reveal', async () => {
  const rgba = new Uint8ClampedArray(PHOTO_COLS * PHOTO_ROWS * 4);
  for (let y = 0; y < PHOTO_ROWS; y++) {
    for (let x = 0; x < PHOTO_COLS; x++) {
      const i = (y * PHOTO_COLS + x) * 4;
      rgba[i] = (x * 4) % 255;
      rgba[i + 1] = (y * 12) % 255;
      rgba[i + 2] = 180;
      rgba[i + 3] = 255;
    }
  }
  const photo = pixelsToAsciiGrid(rgba, PHOTO_COLS, PHOTO_ROWS, { style: 'emotion' });
  assert.equal(photo.r.length, PHOTO_ROWS);
  assert.equal(photo.r[0].length, PHOTO_COLS);

  const code = await encryptMessage({
    message: 'Thinking of this memory!',
    emotion: 'love',
    photo,
    sender: 'Alex',
  });
  const decoded = await decryptMessage({ code });
  assert.deepEqual(decoded.photo, photo);

  const canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
  renderPhotoReveal(canvas, 120, decoded.photo, { sender: decoded.sender });
  const out = canvas.toLines().join('\n');
  assert.ok(out.includes('MEMORY DECODED'));
  assert.ok(out.includes('ALEX'));
});

test('EmotionAudio unlocks suspended AudioContext synchronously and schedules audible nodes', async () => {
  let createdCount = 0;
  let resumeCalls = 0;
  const startedOscillators = [];

  class FakeAudioParam {
    constructor(val = 0) {
      this.value = val;
    }
    setValueAtTime(v) { this.value = v; }
    linearRampToValueAtTime(v) { this.value = v; }
    exponentialRampToValueAtTime(v) { this.value = v; }
    setTargetAtTime(v) { this.value = v; }
    cancelScheduledValues() {}
  }

  class FakeAudioContext {
    constructor() {
      createdCount++;
      this.state = 'suspended';
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = { id: 'dest' };
    }
    async resume() {
      resumeCalls++;
      this.state = 'running';
    }
    createGain() {
      return { gain: new FakeAudioParam(1), connect() {}, disconnect() {} };
    }
    createBiquadFilter() {
      return { type: 'lowpass', frequency: new FakeAudioParam(1000), Q: new FakeAudioParam(1), connect() {}, disconnect() {} };
    }
    createDynamicsCompressor() {
      return {
        threshold: new FakeAudioParam(-24),
        knee: new FakeAudioParam(30),
        ratio: new FakeAudioParam(12),
        attack: new FakeAudioParam(0.003),
        release: new FakeAudioParam(0.25),
        connect() {},
        disconnect() {},
      };
    }
    createBuffer(ch, len) {
      return { getChannelData: () => new Float32Array(len) };
    }
    createBufferSource() {
      return { buffer: null, connect() {}, disconnect() {}, start() {}, stop() {} };
    }
    createOscillator() {
      const osc = {
        type: 'sine',
        frequency: new FakeAudioParam(440),
        connect() {},
        disconnect() {},
        start: (t) => startedOscillators.push({ freq: osc.frequency.value, t }),
        stop() {},
      };
      return osc;
    }
  }

  const prevCtx = globalThis.AudioContext;
  globalThis.AudioContext = FakeAudioContext;
  try {
    const audio = new EmotionAudio();
    assert.equal(audio.unlock(), true);
    assert.equal(createdCount, 1);
    assert.equal(resumeCalls, 1);

    await audio.playScene('love', 3000);
    assert.ok(startedOscillators.length >= 2, 'Expected root drone and melodic notes to start');

    await audio.playRevealChord('love');
    assert.ok(startedOscillators.length >= 6, 'Expected reveal chord notes to start');

    audio.setMuted(true);
    assert.equal(audio.muted, true);
    audio.stop();
  } finally {
    globalThis.AudioContext = prevCtx;
  }
});

test('client-side validation helpers enforce passphrase and future date rules', () => {
  assert.equal(validateMessageInput('   ').valid, false);
  assert.equal(validateMessageInput('Hello').valid, true);

  assert.equal(validatePassphraseInput('abc').valid, false);
  assert.equal(validatePassphraseInput('abcd').valid, true);
  assert.equal(validatePassphraseInput('', { required: true }).valid, false);

  assert.equal(
    validateFutureUnlockDate({ dateValue: '2020-01-01T00:00', nowMs: Date.now() }).valid,
    false
  );
  assert.equal(
    validateFutureUnlockDate({ presetOffsetMs: 15_000, nowMs: 1_000_000 }).unlockAt,
    1_015_000
  );

  assert.equal(getProtocolBadge('').prefix, 'TTY0.');
  assert.equal(getProtocolBadge('secret').prefix, 'TTY1.');
  assert.equal(inspectCipherStatus('TTY1.abc').requiresKey, true);
});

test('built bundle, styles, fonts, and editorial assets exist cleanly', () => {
  const bundle = fs.readFileSync(new URL('../dist/app.bundle.js', import.meta.url), 'utf8');
  const css = fs.readFileSync(new URL('../dist/styles.css', import.meta.url), 'utf8');
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const html404 = fs.readFileSync(new URL('../404.html', import.meta.url), 'utf8');

  assert.ok(bundle.length > 50_000, 'Expected bundled React/Motion JS output');
  assert.ok(css.includes('Geist Variable') && css.includes('Geist Mono Variable'));
  assert.ok(!css.includes('linear-gradient(') && !css.includes('radial-gradient('), 'No background gradients allowed');
  assert.ok(html.includes('application/ld+json') && html.includes('FAQPage'));
  assert.ok(html404.includes('./dist/app.bundle.js'));
});
