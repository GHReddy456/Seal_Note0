import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { EMOTIONS } from './emotions.js';
import { AsciiCanvas } from './ascii-canvas.js';
import { renderSceneFrame, renderTimeCapsule, renderBurnAsh, renderPhotoReveal, CANVAS_COLS, CANVAS_ROWS } from './scenes.js';
import { EmotionAudio } from './audio.js';
import { BrandMonogram } from './components/Icons.jsx';
import { EncoderStudio } from './components/EncoderStudio.jsx';
import { DecoderPanel, SAMPLES } from './components/DecoderPanel.jsx';
import { TerminalViewport } from './components/TerminalViewport.jsx';
import { LandingSections } from './components/LandingSections.jsx';
import { NotFoundView } from './components/NotFoundView.jsx';
import { EDITORIAL_EASE, smoothScrollTo } from './utils/scroll.js';

const FPS = 24;
const FRAME_MS = 1000 / FPS;
const BURN_STORAGE_KEY = 'tty_feel_burned_ids';
const SOUND_STORAGE_KEY = 'tty_feel_sound_on';

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
    // Ignore storage errors in restricted contexts.
  }
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

function isNotFoundLocation() {
  if (typeof window === 'undefined') return false;
  if (window.location.hash === '#/404' || window.location.hash === '#404') return true;
  if (window.location.protocol === 'file:') return false;
  const p = window.location.pathname || '/';
  return p !== '/' && p !== '/index.html';
}

function extractSharedCode() {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  if (hash.startsWith('#code=')) {
    try {
      return decodeURIComponent(hash.slice('#code='.length));
    } catch {
      return hash.slice('#code='.length);
    }
  }
  return '';
}

export function App() {
  const [notFound, setNotFound] = useState(() => isNotFoundLocation());
  const [sharedCode, setSharedCode] = useState(() => extractSharedCode());
  const [studioTab, setStudioTab] = useState('compose');
  const [manualDecodeCode, setManualDecodeCode] = useState('');
  const [manualDecodeKey, setManualDecodeKey] = useState('');

  const [selectedEmotion, setSelectedEmotion] = useState('love');
  const [crtOn, setCrtOn] = useState(true);
  const [soundOn, setSoundOn] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  // Mini preview state
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewAct, setPreviewAct] = useState(EMOTIONS.love.acts[0].title);
  const [previewPaused, setPreviewPaused] = useState(false);

  // Theater playback state
  const [theaterSession, setTheaterSession] = useState(null);
  const [theaterHtml, setTheaterHtml] = useState('');
  const [theaterActLabel, setTheaterActLabel] = useState('');
  const [theaterHeaderLabel, setTheaterHeaderLabel] = useState('80×24 TERMINAL');
  const [theaterTimerLabel, setTheaterTimerLabel] = useState('');
  const [theaterProgressPct, setTheaterProgressPct] = useState(0);
  const [theaterDimmed, setTheaterDimmed] = useState(false);
  const [revealData, setRevealData] = useState(null);

  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new EmotionAudio();
    audioRef.current.muted = !soundOn;
  }

  const previewCanvasRef = useRef(null);
  if (!previewCanvasRef.current) previewCanvasRef.current = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);

  const theaterCanvasRef = useRef(null);
  if (!theaterCanvasRef.current) theaterCanvasRef.current = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);

  const composerRef = useRef(null);
  const decoderKeyRef = useRef(null);
  const theaterSectionRef = useRef(null);

  const animRafRef = useRef(null);
  const livingRafRef = useRef(null);
  const typewriterTimerRef = useRef(null);
  const activeExpRef = useRef(null);

  const receiverOnly = Boolean(sharedCode) && !notFound;

  const unlockAudio = useCallback(() => {
    if (!soundOn) return;
    audioRef.current?.unlock();
  }, [soundOn]);

  // Passive global gesture listener so AudioContext wakes up cleanly on any first tap/keypress
  useEffect(() => {
    const wake = () => {
      if (soundOn) audioRef.current?.unlock();
    };
    window.addEventListener('pointerdown', wake, { passive: true });
    window.addEventListener('keydown', wake, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [soundOn]);

  const stopTheaterTimers = useCallback(() => {
    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
    }
    if (livingRafRef.current !== null) {
      cancelAnimationFrame(livingRafRef.current);
      livingRafRef.current = null;
    }
    if (typewriterTimerRef.current !== null) {
      clearTimeout(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    audioRef.current?.stop();
  }, []);

  // Listen to hash changes (#code=...) and popstate
  useEffect(() => {
    const syncRoute = () => {
      setNotFound(isNotFoundLocation());
      const nextCode = extractSharedCode();
      setSharedCode(nextCode);
      if (nextCode) {
        stopTheaterTimers();
        setTheaterSession(null);
        setRevealData(null);
      }
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, [stopTheaterTimers]);

  // Cleanup on unmount
  useEffect(() => stopTheaterTimers, [stopTheaterTimers]);

  // Live Mini Preview loop (runs when in Studio Compose mode and not inside Theater)
  useEffect(() => {
    if (notFound || receiverOnly || studioTab !== 'compose' || theaterSession || previewPaused) {
      return;
    }
    let rafId = null;
    let startTime = null;
    let lastFrame = -1;
    const emo = EMOTIONS[selectedEmotion] || EMOTIONS.love;
    const canvas = previewCanvasRef.current;

    const tick = (now) => {
      if (startTime === null) startTime = now;
      const frame = Math.floor((now - startTime) / FRAME_MS) % emo.durationFrames;
      if (frame !== lastFrame) {
        lastFrame = frame;
        renderSceneFrame(emo.id, frame, emo.durationFrames, canvas);
        setPreviewHtml(canvas.toHTML());
        setPreviewAct(getActTitle(emo, frame));
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [notFound, receiverOnly, studioTab, theaterSession, previewPaused, selectedEmotion]);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));
    } catch {
      // Ignore storage error.
    }
    audioRef.current.setMuted(!next);
    if (next) {
      audioRef.current.unlock();
      audioRef.current.playToggleChime();
    }
  };

  const handleToggleCrt = () => setCrtOn((c) => !c);

  const runScrambleTypewriter = useCallback((targetText, sender, burn, isPreview) => {
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
      const done = revealed >= targetText.length;
      setRevealData({
        displayedText: stable + scramble,
        typingDone: done,
        sender,
        burn,
        isPreview,
      });

      if (!done) {
        typewriterTimerRef.current = setTimeout(step, stepMs);
      } else {
        typewriterTimerRef.current = null;
      }
    };

    step();
  }, []);

  const startLivingBackdrop = useCallback((emo, experience) => {
    if (livingRafRef.current !== null) cancelAnimationFrame(livingRafRef.current);
    let start = null;
    let lastTick = -1;
    const baseFrame = emo.durationFrames;
    const canvas = theaterCanvasRef.current;

    const loop = (now) => {
      if (start === null) start = now;
      const step = Math.floor((now - start) / FRAME_MS);
      if (step !== lastTick) {
        lastTick = step;
        if (experience.photo) {
          renderPhotoReveal(canvas, 120 + step, experience.photo, { sender: experience.sender });
        } else {
          renderSceneFrame(emo.id, baseFrame + step, emo.durationFrames, canvas);
        }
        setTheaterHtml(canvas.toHTML());
      }
      livingRafRef.current = requestAnimationFrame(loop);
    };

    livingRafRef.current = requestAnimationFrame(loop);
  }, []);

  const triggerMessageReveal = useCallback(() => {
    const exp = activeExpRef.current;
    if (!exp) return;
    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = null;
    }
    audioRef.current?.stop();

    const emo = EMOTIONS[exp.emotion] || EMOTIONS.love;
    const canvas = theaterCanvasRef.current;

    if (exp.photo) {
      renderPhotoReveal(canvas, 120, exp.photo, { sender: exp.sender });
      setTheaterDimmed(false);
    } else {
      renderSceneFrame(emo.id, emo.durationFrames - 1, emo.durationFrames, canvas);
      setTheaterDimmed(true);
    }
    setTheaterHtml(canvas.toHTML());
    setTheaterProgressPct(100);
    setTheaterActLabel(exp.isPreview ? 'PREVIEW COMPLETE' : 'MESSAGE DECODED');

    if (exp.burn && !exp.isPreview) {
      markMessageBurned(exp.id);
    }

    startLivingBackdrop(emo, exp);
    audioRef.current?.playRevealChord(emo.id);
    runScrambleTypewriter(exp.message, exp.sender, exp.burn, exp.isPreview);
  }, [runScrambleTypewriter, startLivingBackdrop]);

  const startTheater = useCallback(
    (experience) => {
      stopTheaterTimers();
      activeExpRef.current = experience;
      const emo = EMOTIONS[experience.emotion] || EMOTIONS.love;
      const canvas = theaterCanvasRef.current;

      setTheaterSession({ kind: 'film', emotion: emo, experience });
      setRevealData(null);
      setTheaterDimmed(false);
      setTheaterHeaderLabel(emo.label.toUpperCase());
      setTheaterActLabel(emo.acts[0].title);
      setTheaterProgressPct(0);

      const photoFrames = experience.photo ? 132 : 0;
      const totalFrames = emo.durationFrames + photoFrames;
      const totalSec = totalFrames / FPS;
      let startTime = null;
      let lastFrame = -1;

      audioRef.current?.playScene(emo.id, totalSec * 1000);

      const tick = (now) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const frame = Math.min(totalFrames - 1, Math.floor(elapsed / FRAME_MS));

        if (frame !== lastFrame) {
          lastFrame = frame;
          if (frame < emo.durationFrames) {
            renderSceneFrame(emo.id, frame, emo.durationFrames, canvas);
            setTheaterActLabel(getActTitle(emo, frame));
          } else {
            renderPhotoReveal(canvas, frame - emo.durationFrames, experience.photo, {
              sender: experience.sender,
            });
            setTheaterActLabel('ACT V // MEMORY IN ASCII');
          }
          setTheaterHtml(canvas.toHTML());
          setTheaterTimerLabel(`${formatSeconds(frame / FPS)} / ${formatSeconds(totalSec)}`);
          setTheaterProgressPct(((frame + 1) / totalFrames) * 100);
        }

        if (frame < totalFrames - 1) {
          animRafRef.current = requestAnimationFrame(tick);
        } else {
          animRafRef.current = null;
          triggerMessageReveal();
        }
      };

      animRafRef.current = requestAnimationFrame(tick);

      setTimeout(() => {
        if (theaterSectionRef.current) {
          smoothScrollTo(theaterSectionRef.current, 96);
        }
      }, 60);
    },
    [stopTheaterTimers, triggerMessageReveal]
  );

  const startTimeCapsuleTheater = useCallback(
    (payload) => {
      stopTheaterTimers();
      activeExpRef.current = null;
      const canvas = theaterCanvasRef.current;

      setTheaterSession({ kind: 'capsule', emotion: EMOTIONS.missing, payload });
      setRevealData(null);
      setTheaterDimmed(false);
      setTheaterHeaderLabel('TIME CAPSULE');
      setTheaterActLabel('SEALED UNTIL TARGET HOUR');
      setTheaterProgressPct(0);

      const totalLockMs = Math.max(1000, payload.unlockAt - Date.now());
      let startTime = null;
      let lastFrame = -1;

      const tick = (now) => {
        if (startTime === null) startTime = now;
        const remainingMs = payload.unlockAt - Date.now();

        if (remainingMs <= 0) {
          animRafRef.current = null;
          audioRef.current?.playUnlockChime();
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
          renderTimeCapsule(canvas, frame, remainingMs);
          setTheaterHtml(canvas.toHTML());
          const secsLeft = Math.ceil(remainingMs / 1000);
          setTheaterTimerLabel(`${formatSeconds(secsLeft)} left`);
          const pct = Math.min(100, Math.max(0, ((totalLockMs - remainingMs) / totalLockMs) * 100));
          setTheaterProgressPct(pct);
        }
        animRafRef.current = requestAnimationFrame(tick);
      };

      animRafRef.current = requestAnimationFrame(tick);
    },
    [startTheater, stopTheaterTimers]
  );

  const startBurnAshTheater = useCallback(
    ({ emotion = 'motivation', message, alreadyBurned = false }) => {
      stopTheaterTimers();
      activeExpRef.current = null;
      const canvas = theaterCanvasRef.current;

      setTheaterSession({ kind: 'burn', emotion: EMOTIONS[emotion] || EMOTIONS.motivation });
      setRevealData(null);
      setTheaterDimmed(false);
      setTheaterHeaderLabel('BURN AFTER READING');
      setTheaterActLabel(alreadyBurned ? 'ASHES ONLY' : 'DISSOLVING INTO ASH');
      setTheaterTimerLabel(alreadyBurned ? 'BURNED' : '00:00 / 00:05');
      setTheaterProgressPct(alreadyBurned ? 100 : 0);

      if (!alreadyBurned) {
        audioRef.current?.playBurnSound();
      }

      let startTime = null;
      let lastFrame = -1;
      const burnFrames = 115;

      const tick = (now) => {
        if (startTime === null) startTime = now;
        const frame = Math.floor((now - startTime) / FRAME_MS);
        const cappedFrame = alreadyBurned ? frame : Math.min(burnFrames, frame);

        if (cappedFrame !== lastFrame) {
          lastFrame = cappedFrame;
          renderBurnAsh(canvas, cappedFrame, message, { alreadyBurned });
          setTheaterHtml(canvas.toHTML());
          if (!alreadyBurned) {
            setTheaterTimerLabel(`${formatSeconds(cappedFrame / FPS)} / 00:05`);
            setTheaterProgressPct((cappedFrame / burnFrames) * 100);
          } else {
            setTheaterProgressPct(100);
          }
        }

        if (alreadyBurned || cappedFrame < burnFrames) {
          animRafRef.current = requestAnimationFrame(tick);
        } else {
          animRafRef.current = null;
          setTheaterActLabel('MESSAGE TURNED TO ASH');
        }
      };

      animRafRef.current = requestAnimationFrame(tick);
    },
    [stopTheaterTimers]
  );

  const handleDecodedPayload = useCallback(
    (payload) => {
      if (payload.burn && payload.id && getBurnedSet().has(payload.id)) {
        startBurnAshTheater({
          emotion: payload.emotion,
          message: payload.message,
          alreadyBurned: true,
        });
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
    },
    [startBurnAshTheater, startTheater, startTimeCapsuleTheater]
  );

  const handleCloseTheater = () => {
    stopTheaterTimers();
    activeExpRef.current = null;
    setTheaterSession(null);
    setRevealData(null);
  };

  const handleCreateOwn = () => {
    stopTheaterTimers();
    activeExpRef.current = null;
    setTheaterSession(null);
    setRevealData(null);
    setSharedCode('');
    setNotFound(false);
    setStudioTab('compose');
    if (typeof window !== 'undefined') {
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname || '/');
      }
      smoothScrollTo(0);
    }
    setTimeout(() => composerRef.current?.focus(), 200);
  };

  const handleSealCta = () => {
    setStudioTab('compose');
    handleCloseTheater();
    smoothScrollTo('compose', 96);
    setTimeout(() => composerRef.current?.focus(), 420);
  };

  const handleOpenTokenInDecoder = (token, key) => {
    handleCloseTheater();
    setManualDecodeCode(token);
    setManualDecodeKey(key);
    setStudioTab('decode');
    smoothScrollTo('studio-workspace', 96);
  };

  const handleWatchPreviewFilm = (customMessage, customSender, photoData) => {
    const emo = EMOTIONS[selectedEmotion] || EMOTIONS.love;
    const sample = SAMPLES[emo.id];
    startTheater({
      emotion: emo.id,
      message: customMessage || sample.message,
      sender: customSender || 'Studio preview',
      photo: photoData || null,
      isPreview: true,
    });
  };

  const handleReturnFrom404 = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    setNotFound(false);
    setSharedCode('');
    setStudioTab('compose');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen wood-tile-canvas text-[#080808] selection:bg-[#080808] selection:text-[#FFF9F7]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#080808] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#FFF9F7]"
        >
          Skip to content
        </a>

        {notFound ? (
          <NotFoundView
            onReturnStudio={handleReturnFrom404}
            crtOn={crtOn}
            soundOn={soundOn}
            onToggleCrt={handleToggleCrt}
            onToggleSound={handleToggleSound}
          />
        ) : receiverOnly ? (
          /* ==================== FOCUSED RECEIVER DECODER MODE ==================== */
          <main id="main-content" className="px-4 py-12 md:py-16 min-h-[calc(100vh-88px)] flex flex-col justify-center">
            {theaterSession ? (
              <motion.div
                ref={theaterSectionRef}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
                className="w-full max-w-[820px] mx-auto flex flex-col gap-4"
              >
                <TerminalViewport
                  frameHtml={theaterHtml}
                  emotion={theaterSession.emotion}
                  headerLabel={theaterHeaderLabel}
                  actLabel={theaterActLabel}
                  timerLabel={theaterTimerLabel}
                  progressPct={theaterProgressPct}
                  crtOn={crtOn}
                  soundOn={soundOn}
                  isTheater={true}
                  isPreview={false}
                  withPhoto={Boolean(theaterSession.experience?.photo)}
                  dimmed={theaterDimmed}
                  onToggleCrt={handleToggleCrt}
                  onToggleSound={handleToggleSound}
                  onSkip={theaterSession.kind === 'film' ? triggerMessageReveal : undefined}
                  onReplay={
                    theaterSession.kind === 'film'
                      ? () => {
                          unlockAudio();
                          startTheater(theaterSession.experience);
                        }
                      : undefined
                  }
                  onClose={handleCloseTheater}
                  reveal={revealData}
                  showBurnReplayControls={
                    theaterSession.kind !== 'film' || Boolean(theaterSession.experience?.burn)
                  }
                  onBurnNow={() => {
                    if (!theaterSession.experience) return;
                    unlockAudio();
                    startBurnAshTheater({
                      emotion: theaterSession.experience.emotion,
                      message: theaterSession.experience.message,
                      alreadyBurned: false,
                    });
                  }}
                  onReply={handleCreateOwn}
                  receiverOnly={true}
                />
              </motion.div>
            ) : (
              <DecoderPanel
                receiverOnly={true}
                initialCode={sharedCode}
                initialKey=""
                crtOn={crtOn}
                soundOn={soundOn}
                onToggleCrt={handleToggleCrt}
                onToggleSound={handleToggleSound}
                onDecodedPayload={handleDecodedPayload}
                onUnlockAudio={unlockAudio}
                onCreateOwn={handleCreateOwn}
                keyInputRef={decoderKeyRef}
              />
            )}
          </main>
        ) : (
          /* ==================== STUDIO APPLICATION MODE ==================== */
          <main id="main-content" className="min-h-screen flex flex-col justify-between">
            <section id="compose" className="pt-10 md:pt-14 pb-6 px-4">
              <div className="max-w-[1120px] mx-auto flex flex-col gap-6">
                {/* Bold Editorial Hero Message above the Studio App */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
                  className="flex flex-col gap-3 px-1"
                >
                  <div className="flex items-center gap-3">
                    <BrandMonogram className="w-6 h-6" />
                    <span className="text-sm font-semibold tracking-tight text-[#FFF9F7]">
                      Seal Note
                    </span>
                    <span className="h-px w-10 bg-[#FFF9F7]/65" aria-hidden="true" />
                    <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-[#FFF9F7]/90">
                      Encrypted terminal studio
                    </span>
                  </div>

                  <h1 className="max-w-[740px] text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#FFF9F7] text-balance m-0">
                    Send encrypted messages
                    <br />
                    that feel alive.
                  </h1>

                  <p className="max-w-[620px] text-base md:text-lg text-[#FFF9F7]/95 text-pretty m-0">
                    Write a private note, choose an 80×24 ASCII short film, and seal it in a browser link.
                  </p>
                </motion.div>

                {/* Primary Interactive Studio Workspace */}
                <div
                  id="studio-workspace"
                  className="rounded-2xl border border-[#FFF9F7] bg-[#FFF9F7] p-4 md:p-6 flex flex-col gap-6"
                >
                  {/* Studio Header Tabs */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6D9D3] pb-4">
                    <div className="inline-flex items-center rounded-xl border border-[#E6D9D3] bg-[#FAF1EC] p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStudioTab('compose');
                          handleCloseTheater();
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B] ${
                          studioTab === 'compose' && !theaterSession
                            ? 'bg-[#080808] text-[#FFF9F7]'
                            : 'text-[#5C5552] hover:text-[#080808]'
                        }`}
                      >
                        Compose studio
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setStudioTab('decode');
                          handleCloseTheater();
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B] ${
                          studioTab === 'decode' && !theaterSession
                            ? 'bg-[#080808] text-[#FFF9F7]'
                            : 'text-[#5C5552] hover:text-[#080808]'
                        }`}
                      >
                        Decrypt and samples
                      </button>
                    </div>

                    <div className="font-mono text-xs text-[#5C5552]">
                      {theaterSession
                        ? 'THEATER ACTIVE'
                        : studioTab === 'compose'
                          ? 'BROWSER STUDIO · 80×24'
                          : 'CIPHER VAULT'}
                    </div>
                  </div>

                  {/* Active Studio View OR Theater Stage */}
                  <AnimatePresence mode="wait">
                    {theaterSession ? (
                      <motion.div
                        key="studio-theater"
                        ref={theaterSectionRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
                        className="max-w-[820px] w-full mx-auto"
                      >
                        <TerminalViewport
                          frameHtml={theaterHtml}
                          emotion={theaterSession.emotion}
                          headerLabel={theaterHeaderLabel}
                          actLabel={theaterActLabel}
                          timerLabel={theaterTimerLabel}
                          progressPct={theaterProgressPct}
                          crtOn={crtOn}
                          soundOn={soundOn}
                          isTheater={true}
                          isPreview={Boolean(theaterSession.experience?.isPreview)}
                          withPhoto={Boolean(theaterSession.experience?.photo)}
                          dimmed={theaterDimmed}
                          onToggleCrt={handleToggleCrt}
                          onToggleSound={handleToggleSound}
                          onSkip={theaterSession.kind === 'film' ? triggerMessageReveal : undefined}
                          onReplay={
                            theaterSession.kind === 'film'
                              ? () => {
                                  unlockAudio();
                                  startTheater(theaterSession.experience);
                                }
                              : undefined
                          }
                          onClose={handleCloseTheater}
                          reveal={revealData}
                          showBurnReplayControls={
                            theaterSession.kind !== 'film' ||
                            (Boolean(theaterSession.experience?.burn) && !theaterSession.experience?.isPreview)
                          }
                          onBurnNow={() => {
                            if (!theaterSession.experience) return;
                            unlockAudio();
                            startBurnAshTheater({
                              emotion: theaterSession.experience.emotion,
                              message: theaterSession.experience.message,
                              alreadyBurned: false,
                            });
                          }}
                          onReply={() => {
                            handleCloseTheater();
                            setStudioTab('compose');
                            setTimeout(() => composerRef.current?.focus(), 160);
                          }}
                          receiverOnly={false}
                        />
                      </motion.div>
                    ) : studioTab === 'compose' ? (
                      <motion.div
                        key="compose-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                      >
                        <EncoderStudio
                          selectedEmotion={selectedEmotion}
                          onSelectEmotion={setSelectedEmotion}
                          previewHtml={previewHtml}
                          previewAct={previewAct}
                          previewPaused={previewPaused}
                          onTogglePreviewPause={() => setPreviewPaused((p) => !p)}
                          crtOn={crtOn}
                          soundOn={soundOn}
                          onToggleCrt={handleToggleCrt}
                          onToggleSound={handleToggleSound}
                          onWatchFullFilm={handleWatchPreviewFilm}
                          onOpenTokenInDecoder={handleOpenTokenInDecoder}
                          composerRef={composerRef}
                          onUnlockAudio={unlockAudio}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="decode-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                      >
                        <DecoderPanel
                          receiverOnly={false}
                          initialCode={manualDecodeCode}
                          initialKey={manualDecodeKey}
                          crtOn={crtOn}
                          soundOn={soundOn}
                          onToggleCrt={handleToggleCrt}
                          onToggleSound={handleToggleSound}
                          onDecodedPayload={handleDecodedPayload}
                          onUnlockAudio={unlockAudio}
                          keyInputRef={decoderKeyRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Simple Compact Footer */}
            <LandingSections />
          </main>
        )}
      </div>
    </MotionConfig>
  );
}
export default App;
