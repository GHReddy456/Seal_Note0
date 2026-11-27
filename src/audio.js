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

export class EmotionAudio {
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
