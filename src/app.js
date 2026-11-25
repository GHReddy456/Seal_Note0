import { EMOTIONS, EMOTION_LIST } from './emotions.js';
import { convertImageToAscii, PHOTO_COLS, PHOTO_ROWS, CHAR_TO_COLOR } from './photo-ascii.js';
import { encryptMessage, decryptMessage, inspectCode } from './crypto.js';
import { AsciiCanvas, CANVAS_COLS, CANVAS_ROWS } from './ascii-canvas.js';
import { renderSceneFrame, renderTimeCapsule, renderBurnAsh, renderPhotoReveal } from './scenes.js';
import { EmotionAudio } from './audio.js';

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
  el.choosePhotoBtn.textContent = '+ Choose Photo';
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
    playSpan.textContent = '▶ Play';
    top.append(nameSpan, playSpan);

    const hint = document.createElement('div');
    hint.className = 'sample-key-hint';
    hint.textContent = sample.key ? `🔒 key: "${sample.key}"` : '🔓 open code (no key)';

    btn.append(top, hint);
    btn.addEventListener('click', async () => {
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
    el.decodeCodeStatus.textContent = '🔒 Key required to unlock';
    el.decodeCodeStatus.classList.add('code-status-locked');
  } else {
    el.decodeCodeStatus.textContent = '🔓 Open code — no key needed!';
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
        throw new Error('Time Capsule unlock date must be in the future.');
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
      ? 'Open Cipher'
      : token.startsWith('TTY1.')
        ? 'AES-256-GCM'
        : 'SHA256-CTR';
    const extras = [];
    if (unlockAt) extras.push('⏳ Time Capsule');
    if (burn) extras.push('🔥 Burn Once');
    if (state.photoData) extras.push('📷 ASCII Photo');
    el.outputModeBadge.textContent = token.startsWith('TTY0.')
      ? '🔓 OPEN CODE READY (NO KEY NEEDED)'
      : '🔒 LOCKED CODE READY';
    el.payloadStats.textContent = [`${token.length} chars`, cipherLabel, ...extras].join(' · ');
    el.encodedOutputBox.classList.remove('hidden');
  } catch (err) {
    el.encodeError.textContent = err.message;
  }
}

async function handleDecryptAndPlay() {
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
        el.choosePhotoBtn.textContent = 'Change Photo';
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
    copyText(el.encodedToken.textContent, el.copyCodeBtn, 'Copy Code', 'Copied!')
  );

  el.copyLinkBtn.addEventListener('click', () => {
    const url = new URL(window.location.href);
    url.hash = `code=${encodeURIComponent(el.encodedToken.textContent)}`;
    copyText(url.toString(), el.copyLinkBtn, 'Copy Share Link', 'Link Copied!');
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
    if (state.currentExperience) startTheater(state.currentExperience);
  });
  el.revealReplayBtn.addEventListener('click', () => {
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
      el.receiverBannerText.textContent = 'This open message is ready — no secret key needed.';
      el.decryptBtn.textContent = '▶ Unlock & Play Your Message';
    } else {
      el.decodeKeyGroup.classList.remove('hidden');
      el.receiverBannerText.textContent = 'Enter the secret key from the sender to unlock your story.';
      el.decryptBtn.textContent = '▶ Unlock & Play Experience';
    }
  } else {
    el.brandSubtitle.textContent = 'Encrypted messages, felt in ASCII cinema';
    el.receiverLoadedBanner.classList.add('hidden');
    el.decodeCodeGroup.classList.remove('hidden');
    el.decodeKeyGroup.classList.remove('hidden');
    el.decryptBtn.textContent = '▶ Unlock & Play Experience';
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
