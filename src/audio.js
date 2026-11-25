/**
 * Procedural Web Audio API soundscapes for each emotional ASCII scene.
 * Includes warm melodic progressions plus soft ambient rain / campfire noise textures.
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
    this.muted = false;
    this.activeNodes = [];
    this.timerIds = [];
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted) this.stop();
  }

  ensureContext() {
    if (this.muted) return null;
    const AudioCtx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playNote(freq, { duration = 1.6, volume = 0.04, type = 'sine', delay = 0 } = {}) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
    this.activeNodes.push(osc);
  }

  playSoftTexture(durationSec, { filterFreq = 900, volume = 0.012 } = {}) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const sampleCount = Math.floor(ctx.sampleRate * Math.min(durationSec, 18));
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.8);
    gain.gain.setValueAtTime(volume, now + Math.max(1, durationSec - 1.5));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    src.stop(now + durationSec + 0.05);
    this.activeNodes.push(src);
  }

  playScene(emotion, durationMs = 17000) {
    this.stop();
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    const stepMs = emotion === 'happiness' ? 380 : emotion === 'sadness' ? 920 : emotion === 'apology' ? 780 : 650;
    const steps = Math.floor((durationMs - 600) / stepMs);

    // Subtle rain or campfire texture for atmospheric immersion
    if (emotion === 'sadness' || emotion === 'apology') {
      this.playSoftTexture(durationMs / 1000, { filterFreq: 850, volume: 0.011 });
    } else if (emotion === 'friendship') {
      this.playSoftTexture(durationMs / 1000, { filterFreq: 520, volume: 0.008 });
    }

    const apologyMinor = [220.0, 207.65, 196.0, 174.61, 220.0]; // Tender regret
    const apologyResolve = [220.0, 277.18, 329.63, 440.0, 554.37]; // Warm forgiveness bloom

    for (let i = 0; i < steps; i++) {
      const id = setTimeout(() => {
        if (this.muted) return;
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
        const dur = emotion === 'sadness' || emotion === 'missing' || emotion === 'apology' ? 2.3 : 1.5;
        this.playNote(freq, { duration: dur, volume: 0.034, type });
      }, i * stepMs);
      this.timerIds.push(id);
    }
  }

  playRevealChord(emotion) {
    if (this.muted) return;
    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    scale.slice(0, 4).forEach((freq, i) => {
      this.playNote(freq, { duration: 2.6, volume: 0.03, type: 'sine', delay: i * 0.09 });
    });
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
