import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  LockOpen,
  Eye,
  EyeSlash,
  Play,
  WarningCircle,
  TerminalWindow,
  CaretDown,
  CaretUp,
} from '@phosphor-icons/react';
import { EMOTION_LIST } from '../emotions.js';
import { encryptMessage, decryptMessage } from '../crypto.js';
import { AsciiCanvas } from '../ascii-canvas.js';
import { renderSceneFrame, CANVAS_COLS, CANVAS_ROWS } from '../scenes.js';
import { EmotionIcon, BrandMonogram } from './Icons.jsx';
import { EDITORIAL_EASE } from '../utils/scroll.js';
import { inspectCipherStatus, validatePassphraseInput } from '../utils/validation.js';

export const SAMPLES = {
  love: {
    sender: 'Starlight',
    key: '',
    message: 'No matter how busy life gets, every constellation in my sky still spells your name.',
  },
  happiness: {
    sender: 'Maya',
    key: 'confetti',
    message: 'We did it!! Celebrate loud tonight, you earned every single firework in the sky!',
  },
  sadness: {
    sender: 'Liam',
    key: '',
    message: 'I know tonight feels heavy. Sit here with me for a minute, you do not have to carry the rain alone.',
  },
  missing: {
    sender: 'Elena',
    key: 'horizon',
    message: 'Three thousand miles between us, yet every quiet evening feels like you just stepped out of the room.',
  },
  friendship: {
    sender: 'Sam',
    key: '',
    message: 'Through every chaotic chapter, you are still my favorite person to sit around a fire with and laugh about nothing.',
  },
  motivation: {
    sender: 'Coach',
    key: 'summit',
    message: 'The steepest miles are right before sunrise. Keep climbing, the view at the top is already yours.',
  },
  gratitude: {
    sender: 'Noah',
    key: '',
    message: 'You showed up when I needed it most and never asked for anything back. Thank you for being that light.',
  },
  apology: {
    sender: 'Aria',
    key: '',
    message: 'I am truly sorry for how my words landed. You matter too much to me to ever leave things broken between us.',
  },
};

export function DecoderPanel({
  receiverOnly = false,
  initialCode = '',
  initialKey = '',
  crtOn = true,
  soundOn = true,
  onToggleCrt,
  onToggleSound,
  onDecodedPayload,
  onUnlockAudio,
  onCreateOwn,
  keyInputRef,
}) {
  const [code, setCode] = useState(initialCode);
  const [passphrase, setPassphrase] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);
  const [showRawCode, setShowRawCode] = useState(!receiverOnly);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [ambientHtml, setAmbientHtml] = useState('');

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    setPassphrase(initialKey);
  }, [initialKey]);

  // Subtle ambient starfield inside the centered 80x24 terminal in Receiver Mode while waiting to unlock
  useEffect(() => {
    if (!receiverOnly) return;
    const canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
    let rafId = null;
    let start = null;
    let lastFrame = -1;

    const tick = (now) => {
      if (start === null) start = now;
      const frame = Math.floor((now - start) / (1000 / 16));
      if (frame !== lastFrame) {
        lastFrame = frame;
        renderSceneFrame('love', frame % 80, 408, canvas);
        setAmbientHtml(canvas.toHTML());
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [receiverOnly]);

  const status = inspectCipherStatus(code);

  const handleUnlock = async (overrideCode, overrideKey) => {
    onUnlockAudio?.();
    setErrorMsg('');

    const targetCode = overrideCode !== undefined ? overrideCode : code;
    const targetKey = overrideKey !== undefined ? overrideKey : passphrase;

    const targetStatus = inspectCipherStatus(targetCode);
    if (!targetStatus.valid) {
      setErrorMsg(targetStatus.label);
      return;
    }

    if (targetStatus.requiresKey) {
      const passCheck = validatePassphraseInput(targetKey, { required: true });
      if (!passCheck.valid) {
        setErrorMsg(passCheck.error);
        return;
      }
    }

    setIsDecrypting(true);
    try {
      const payload = await decryptMessage({
        code: targetCode,
        key: targetKey,
      });
      onDecodedPayload(payload);
    } catch (err) {
      setErrorMsg(err?.message || 'Decryption failed. Check your secret key or code.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleSampleClick = async (emoId) => {
    onUnlockAudio?.();
    setErrorMsg('');
    const sample = SAMPLES[emoId];
    setIsDecrypting(true);
    try {
      const token = await encryptMessage({
        message: sample.message,
        emotion: emoId,
        key: sample.key,
        sender: sample.sender,
      });
      setCode(token);
      setPassphrase(sample.key);
      const payload = await decryptMessage({ code: token, key: sample.key });
      onDecodedPayload(payload);
    } catch (err) {
      setErrorMsg(err?.message || 'Unable to load sample.');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (receiverOnly) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
        className="w-full max-w-[820px] mx-auto flex flex-col gap-4"
      >
        <div className="text-center flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-4 mb-1">
            <div className="inline-flex items-center gap-2">
              <BrandMonogram className="w-6 h-6" />
              <span className="text-sm font-semibold tracking-tight text-[#FFF9F7]">Seal Note</span>
            </div>
            {onCreateOwn && (
              <button
                type="button"
                onClick={onCreateOwn}
                className="inline-flex items-center gap-1 rounded-full border border-[#FFF9F7]/35 bg-[#080808]/25 px-3 py-1 text-xs font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#FFF9F7] hover:text-[#080808] active:scale-[0.98]"
              >
                <span>Create your own</span>
              </button>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFF9F7] bg-[#FFF9F7] px-3 py-1 font-mono text-xs font-medium text-[#080808]">
            {status.requiresKey ? <Lock size={13} className="text-[#F4510B]" /> : <LockOpen size={13} className="text-[#F4510B]" />}
            <span>{status.label}</span>
          </span>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-[#FFF9F7] text-balance m-0">
            Someone sent you a sealed terminal note.
          </h1>
          <p className="text-sm text-[#FFF9F7]/90 max-w-[540px] text-pretty m-0">
            {status.requiresKey
              ? 'Enter the passphrase from the sender to decrypt and play the 80×24 short film inside your browser.'
              : 'This open cipher decrypts entirely inside your browser. Press unlock to begin the 80×24 film.'}
          </p>
        </div>

        {/* Centered 80x24 Midnight Black Terminal Frame on Pure White Canvas */}
        <div className="rounded-2xl border border-[#242424] bg-[#080808] p-2">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2 text-[#FFF9F7]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F4510B] shrink-0" aria-hidden="true" />
              <span className="font-mono text-xs font-medium tracking-tight text-[#FFF9F7]">
                SEAL NOTE · SEALED TERMINAL
              </span>
              <span className="hidden sm:inline font-mono text-xs text-[#968D8A]">
                · {status.requiresKey ? 'PASSPHRASE REQUIRED' : 'READY TO DECRYPT'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleSound}
                aria-pressed={soundOn}
                className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98]"
              >
                {soundOn ? 'Audio on' : 'Muted'}
              </button>
              <button
                type="button"
                onClick={onToggleCrt}
                aria-pressed={crtOn}
                className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98]"
              >
                {crtOn ? 'CRT' : 'Flat'}
              </button>
            </div>
          </div>

          <div className={`terminal-viewport ${crtOn ? 'crt-on' : ''} rounded-lg border border-[#242424] px-2 py-4 md:px-4 md:py-6 grid place-items-center`}>
            <pre
              className="col-start-1 row-start-1 ascii-stage-grid dimmed"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: ambientHtml }}
            />

            <div className="col-start-1 row-start-1 w-full relative z-10 flex items-center justify-center p-2 md:p-4">
              <div className="w-full max-w-[480px] rounded-xl border border-[#242424] bg-[#080808]/95 p-4 md:p-6 flex flex-col gap-4">
                {status.requiresKey && (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="receiverKeyInput" className="text-xs font-medium text-[#DDD4D0]">
                      Secret passphrase
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        ref={keyInputRef}
                        id="receiverKeyInput"
                        type={showKey ? 'text' : 'password'}
                        value={passphrase}
                        onChange={(e) => {
                          setPassphrase(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUnlock();
                        }}
                        placeholder="Enter passphrase from sender"
                        className="w-full rounded-lg border border-[#242424] bg-[#141414] px-3 py-2 text-sm text-[#FFF9F7] placeholder:text-[#968D8A] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey((s) => !s)}
                        aria-label={showKey ? 'Hide passphrase' : 'Show passphrase'}
                        className="inline-flex items-center justify-center rounded-lg border border-[#242424] bg-[#141414] px-3 py-2 text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98]"
                      >
                        {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={isDecrypting}
                    onClick={() => handleUnlock()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F4510B] px-5 py-2.5 text-sm font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#D84306] disabled:opacity-60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                  >
                    <Play size={15} weight="fill" />
                    <span>{isDecrypting ? 'Decrypting...' : 'Unlock and play experience'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRawCode((s) => !s)}
                    className="inline-flex items-center gap-1 font-mono text-xs text-[#968D8A] hover:text-[#FFF9F7] active:scale-[0.98]"
                  >
                    {showRawCode ? <CaretUp size={13} /> : <CaretDown size={13} />}
                    <span>{showRawCode ? 'Hide cipher' : 'View cipher'}</span>
                  </button>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#F4510B] bg-[#141414] px-3 py-2 text-xs font-medium text-[#FF9B71]"
                  >
                    <WarningCircle size={15} className="shrink-0 text-[#F4510B]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {showRawCode && (
                  <div className="rounded-lg border border-[#242424] bg-[#141414] p-2.5 font-mono text-xs text-[#968D8A] break-all max-h-20 overflow-y-auto">
                    {code}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Manual Cipher Paste & Unlock */}
      <div className="lg:col-span-6 rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="decodeCodeInput" className="text-sm font-semibold text-[#080808]">
            Paste a sealed cipher code
          </label>
          <span
            className={`font-mono text-xs ${
              status.state === 'open' || status.state === 'locked'
                ? 'text-[#F4510B]'
                : 'text-[#5C5552]'
            }`}
          >
            {status.label}
          </span>
        </div>

        <textarea
          id="decodeCodeInput"
          rows={4}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="TTY0.... or TTY1...."
          className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-2.5 font-mono text-xs text-[#080808] placeholder:text-[#5C5552]/70 focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="decodeKeyInput" className="text-xs font-medium text-[#5C5552]">
            Passphrase (required only for TTY1. locked codes)
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={keyInputRef}
              id="decodeKeyInput"
              type={showKey ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
              placeholder="Leave blank for open TTY0. codes"
              className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-2 text-sm text-[#080808] placeholder:text-[#5C5552]/70 focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
            />
            <button
              type="button"
              onClick={() => setShowKey((s) => !s)}
              aria-label={showKey ? 'Hide passphrase' : 'Show passphrase'}
              className="inline-flex items-center justify-center rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-2.5 py-2 text-[#5C5552] hover:text-[#080808] hover:border-[#080808] active:scale-[0.98]"
            >
              {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={isDecrypting}
          onClick={() => handleUnlock()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F4510B] px-5 py-3 text-sm font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#D84306] disabled:opacity-60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
        >
          <Play size={16} weight="fill" />
          <span>{isDecrypting ? 'Decrypting...' : 'Unlock and play film'}</span>
        </button>

        {errorMsg && (
          <div
            role="alert"
            className="inline-flex items-center gap-2 rounded-lg border border-[#F4510B] bg-[#FAF1EC] px-3 py-2 text-xs font-medium text-[#C23400]"
          >
            <WarningCircle size={15} className="shrink-0 text-[#F4510B]" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Right: 8 Instant Sample Experiences */}
      <div className="lg:col-span-6 rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#080808]">
            <TerminalWindow size={16} className="text-[#F4510B]" />
            <span>Instant sample vault</span>
          </span>
          <span className="font-mono text-xs text-[#5C5552]">Click any film to play</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EMOTION_LIST.map((emo) => {
            const sample = SAMPLES[emo.id];
            return (
              <button
                key={emo.id}
                type="button"
                onClick={() => handleSampleClick(emo.id)}
                className="flex flex-col gap-2 rounded-xl border border-[#E6D9D3] bg-[#FAF1EC] p-3 text-left transition-colors duration-300 hover:border-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#080808]">
                    <EmotionIcon emotionId={emo.id} size={14} weight="fill" style={{ color: emo.accent }} />
                    <span>{emo.label}</span>
                  </span>
                  <span className="font-mono text-xs text-[#F4510B]">Play</span>
                </div>

                <div className="w-full rounded-lg border border-[#242424] bg-[#080808] px-2 py-1.5 flex items-center justify-center">
                  <pre
                    className="m-0 font-mono text-xs leading-tight whitespace-pre text-center select-none"
                    style={{
                      color: emo.accent,
                      textShadow: `0 0 8px ${emo.glow}`,
                    }}
                  >
                    {emo.miniArt.join('\n')}
                  </pre>
                </div>

                <span className="font-mono text-xs text-[#5C5552]">
                  {sample.key ? `TTY1. key: ${sample.key}` : 'TTY0. Open cipher'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
