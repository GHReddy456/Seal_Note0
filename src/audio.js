/**
 * Procedural Web Audio API soundscapes for each emotional ASCII scene.
 * Fixed for strict browser autoplay policies:
 * - Synchronous user-gesture unlock() before async crypto work
 * - Master dynamics compressor + warm lowpass bus at comfortable audible levels
 * - Web Audio clock lookahead scheduling so timing never drifts or misses notes
 */
const EMOTION_SCALES = {
  love: [261.63, 329.63, 392.0, 493.88, 523.25],       // Cmaj7
  happiness: [293.66, 329.63, 392.0, 440.0, 587.33],   // D major pentatonic
  sadness: [220.0, 261.63, 311.13, 329.63, 392.0],     // A minor melancholic
  missing: [246.94, 293.66, 369.99, 440.0, 493.88],    // B minor7
  friendship: [261.63, 293.66, 329.63, 392.0, 440.0],  // C major pentatonic
  motivation: [261.63, 329.63, 392.0, 440.0, 523.25],  // Rising C major
  gratitude: [293.66, 369.99, 440.0, 554.37, 587.33],  // Dmaj7 warm glow
  apology: [220.0, 277.18, 329.63, 415.3, 440.0],      // Amaj7 gentle resolve
};

export class EmotionAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.warmFilter = null;
    this.muted = false;
    this.activeNodes = new Set();
    this.timerIds = [];
    this.playToken = 0;
  }

  getAudioContextClass() {
    return globalThis.AudioContext || globalThis.webkitAudioContext || null;
  }

  _initGraph() {
    const AudioCtx = this.getAudioContextClass();
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.warmFilter = this.ctx.createBiquadFilter();
      this.warmFilter.type = 'lowpass';
      this.warmFilter.frequency.value = 3200;
      this.warmFilter.Q.value = 0.7;

      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.18;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.72;

      this.warmFilter.connect(this.masterGain);
      this.masterGain.connect(compressor);
      compressor.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /**
   * Call synchronously inside click/keydown handlers (especially before async PBKDF2 work)
   * so Chrome, Firefox, and Safari unlock the AudioContext immediately.
   */
  unlock() {
    if (this.muted) return false;
    const ctx = this._initGraph();
    if (!ctx) return false;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // 1-sample silent buffer unlock for WebKit/Safari
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch {
      // Ignore context restrictions in non-browser environments.
    }
    return true;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.72, now, 0.025);
    }
    if (this.muted) {
      this.stop();
    } else {
      this.unlock();
    }
  }

  async ensureRunningContext() {
    if (this.muted) return null;
    const ctx = this._initGraph();
    if (!ctx) return null;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return null;
      }
    }
    return ctx.state === 'running' ? ctx : ctx;
  }

  _trackNode(node) {
    this.activeNodes.add(node);
    node.onended = () => {
      this.activeNodes.delete(node);
      try {
        node.disconnect();
      } catch {
        // Already disconnected.
      }
    };
  }

  _scheduleTone(ctx, freq, startAt, { duration = 1.6, volume = 0.14, type = 'sine', padLayer = false } = {}) {
    if (!ctx || !this.warmFilter || this.muted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startAt);

    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(volume, startAt + Math.min(0.1, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    osc.connect(gain);
    gain.connect(this.warmFilter);

    osc.start(startAt);
    osc.stop(startAt + duration + 0.04);
    this._trackNode(osc);

    if (padLayer) {
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, startAt);

      subGain.gain.setValueAtTime(0.0001, startAt);
      subGain.gain.linearRampToValueAtTime(volume * 0.42, startAt + 0.14);
      subGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      subOsc.connect(subGain);
      subGain.connect(this.warmFilter);
      subOsc.start(startAt);
      subOsc.stop(startAt + duration + 0.04);
      this._trackNode(subOsc);
    }
  }

  _scheduleTexture(ctx, durationSec, { filterFreq = 900, volume = 0.036 } = {}) {
    if (!ctx || !this.warmFilter || this.muted) return;

    const safeDur = Math.max(1.5, Math.min(durationSec, 22));
    const sampleCount = Math.floor(ctx.sampleRate * safeDur);
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Gentle pink-filtered noise for warmer rain/campfire feel
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < sampleCount; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.950 * b2 + white * 0.048;
      data[i] = (b0 + b1 + b2 + white * 0.12) * 0.65;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = filterFreq;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.7);
    gain.gain.setValueAtTime(volume, now + Math.max(0.8, safeDur - 1.2));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + safeDur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.warmFilter);

    src.start(now);
    src.stop(now + safeDur + 0.05);
    this._trackNode(src);
  }

  async playNote(freq, { duration = 1.6, volume = 0.14, type = 'sine', delay = 0 } = {}) {
    const token = this.playToken;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted || token !== this.playToken) return;
    this._scheduleTone(ctx, freq, ctx.currentTime + delay, { duration, volume, type });
  }

  async playScene(emotion, durationMs = 17000) {
    this.stop();
    if (this.muted) return;

    const token = ++this.playToken;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted || token !== this.playToken) return;

    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    const stepMs =
      emotion === 'happiness' ? 380 :
      emotion === 'sadness' ? 880 :
      emotion === 'apology' ? 760 :
      620;
    const totalSteps = Math.max(1, Math.floor((durationMs - 500) / stepMs));

    // Warm root pad drone across the scene
    const rootFreq = scale[0] * 0.5;
    this._scheduleTone(ctx, rootFreq, ctx.currentTime + 0.05, {
      duration: Math.min(durationMs / 1000, 22),
      volume: 0.075,
      type: 'sine',
    });

    // Atmospheric rain or campfire noise texture
    if (emotion === 'sadness' || emotion === 'apology') {
      this._scheduleTexture(ctx, durationMs / 1000, { filterFreq: 950, volume: 0.042 });
    } else if (emotion === 'friendship') {
      this._scheduleTexture(ctx, durationMs / 1000, { filterFreq: 620, volume: 0.032 });
    }

    const apologyMinor = [220.0, 207.65, 196.0, 174.61, 220.0];
    const apologyResolve = [220.0, 277.18, 329.63, 440.0, 554.37];

    // Lookahead scheduler anchored to AudioContext clock
    let nextStep = 0;
    const startClock = ctx.currentTime + 0.04;
    const lookaheadSec = 0.28;

    const scheduleStep = (i, noteTime) => {
      let freq;
      if (emotion === 'apology') {
        const progress = i / Math.max(1, totalSteps - 1);
        const phrase = progress < 0.68 ? apologyMinor : apologyResolve;
        freq = phrase[i % phrase.length];
      } else {
        const idx =
          emotion === 'motivation'
            ? Math.min(scale.length - 1, Math.floor((i / Math.max(1, totalSteps - 1)) * scale.length))
            : (i * 2 + (i % 3)) % scale.length;
        freq = scale[idx] * (i % 6 === 5 && emotion !== 'sadness' ? 1.5 : 1);
      }

      const type = emotion === 'happiness' ? 'triangle' : 'sine';
      const dur = emotion === 'sadness' || emotion === 'missing' || emotion === 'apology' ? 2.2 : 1.5;
      this._scheduleTone(ctx, freq, noteTime, {
        duration: dur,
        volume: 0.135,
        type,
        padLayer: i % 4 === 0,
      });
    };

    const pump = () => {
      if (this.muted || token !== this.playToken || !this.ctx) return;
      const horizon = this.ctx.currentTime + lookaheadSec;
      while (nextStep < totalSteps) {
        const noteTime = startClock + (nextStep * stepMs) / 1000;
        if (noteTime > horizon) break;
        if (noteTime >= this.ctx.currentTime - 0.05) {
          scheduleStep(nextStep, Math.max(this.ctx.currentTime + 0.01, noteTime));
        }
        nextStep++;
      }
      if (nextStep < totalSteps) {
        const tid = setTimeout(pump, 100);
        this.timerIds.push(tid);
      }
    };

    pump();
  }

  async playRevealChord(emotion) {
    if (this.muted) return;
    const token = this.playToken;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted || token !== this.playToken) return;

    const scale = EMOTION_SCALES[emotion] || EMOTION_SCALES.love;
    const base = ctx.currentTime + 0.02;
    scale.slice(0, 4).forEach((freq, i) => {
      this._scheduleTone(ctx, freq, base + i * 0.085, {
        duration: 2.5,
        volume: 0.11,
        type: 'sine',
        padLayer: i === 0,
      });
    });
  }

  async playBurnSound() {
    if (this.muted) return;
    const token = ++this.playToken;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted || token !== this.playToken) return;

    this._scheduleTexture(ctx, 4.4, { filterFreq: 1600, volume: 0.055 });
    const base = ctx.currentTime + 0.05;
    [329.63, 261.63, 220.0, 174.61].forEach((freq, idx) => {
      this._scheduleTone(ctx, freq, base + idx * 0.72, {
        duration: 1.6,
        volume: 0.085,
        type: 'sine',
      });
    });
  }

  async playUnlockChime() {
    if (this.muted) return;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted) return;
    const base = ctx.currentTime + 0.02;
    [392.0, 523.25, 659.25].forEach((freq, i) => {
      this._scheduleTone(ctx, freq, base + i * 0.09, {
        duration: 1.1,
        volume: 0.11,
        type: 'triangle',
      });
    });
  }

  async playToggleChime() {
    if (this.muted) return;
    const ctx = await this.ensureRunningContext();
    if (!ctx || this.muted) return;
    this._scheduleTone(ctx, 523.25, ctx.currentTime + 0.01, {
      duration: 0.35,
      volume: 0.08,
      type: 'sine',
    });
  }

  stop() {
    this.playToken++;
    for (const id of this.timerIds) clearTimeout(id);
    this.timerIds = [];
    for (const node of this.activeNodes) {
      try {
        node.stop();
      } catch {
        // Already stopped.
      }
      try {
        node.disconnect();
      } catch {
        // Already disconnected.
      }
    }
    this.activeNodes.clear();
  }
}
