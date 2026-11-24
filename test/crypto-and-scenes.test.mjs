import test from 'node:test';
import assert from 'node:assert/strict';

import { encryptMessage, decryptMessage, inspectCode } from '../src/crypto.js';
import { EMOTION_LIST } from '../src/emotions.js';
import { AsciiCanvas } from '../src/ascii-canvas.js';
import { renderSceneFrame, renderTimeCapsule, renderBurnAsh, CANVAS_COLS, CANVAS_ROWS } from '../src/scenes.js';

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

test('all 8 emotion ASCII scenes render valid 80x24 frames across acts and living backdrop', () => {
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
