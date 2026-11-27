import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  LockOpen,
  Eye,
  EyeSlash,
  Sparkle,
  HourglassHigh,
  Fire,
  Camera,
  Copy,
  Check,
  Play,
  WarningCircle,
  Trash,
  ArrowRight,
} from '@phosphor-icons/react';
import { EMOTIONS, EMOTION_LIST } from '../emotions.js';
import { convertImageToAscii, CHAR_TO_COLOR } from '../photo-ascii.js';
import { AsciiCanvas } from '../ascii-canvas.js';
import { encryptMessage } from '../crypto.js';
import { EmotionIcon } from './Icons.jsx';
import { TerminalViewport } from './TerminalViewport.jsx';
import { EDITORIAL_EASE } from '../utils/scroll.js';
import {
  validateMessageInput,
  validatePassphraseInput,
  validateFutureUnlockDate,
  getProtocolBadge,
} from '../utils/validation.js';

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

function formatLocalDatetimeInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EncoderStudio({
  selectedEmotion,
  onSelectEmotion,
  previewHtml,
  previewAct,
  previewPaused,
  onTogglePreviewPause,
  crtOn,
  soundOn,
  onToggleCrt,
  onToggleSound,
  onWatchFullFilm,
  onOpenTokenInDecoder,
  composerRef,
  onUnlockAudio,
}) {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [unlockAtValue, setUnlockAtValue] = useState('');
  const [presetOffsetMs, setPresetOffsetMs] = useState(null);
  const [presetNote, setPresetNote] = useState('');
  const [burnAfterReading, setBurnAfterReading] = useState(false);

  const [photoImage, setPhotoImage] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [photoHtml, setPhotoHtml] = useState('');
  const [photoStyle, setPhotoStyle] = useState('emotion');
  const [photoContrast, setPhotoContrast] = useState(1.55);
  const [photoFull, setPhotoFull] = useState(false);

  const [isSealing, setIsSealing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sealedResult, setSealedResult] = useState(null);
  const [copiedType, setCopiedType] = useState('');

  const fileInputRef = useRef(null);

  const activeEmotion = EMOTIONS[selectedEmotion] || EMOTIONS.love;
  const protocol = getProtocolBadge(passphrase);
  const keyValidation = validatePassphraseInput(passphrase, { required: false });

  const rebuildPhotoAscii = (img, styleVal, contrastVal, fullVal, emoId) => {
    if (!img) return;
    const [primaryColor, secondaryColor] = getEmotionPalette(emoId);
    const converted = convertImageToAscii(img, {
      style: styleVal,
      contrast: Number(contrastVal || 1.55),
      fullImage: Boolean(fullVal),
      primaryColor,
      secondaryColor,
    });
    setPhotoData(converted);

    const gridCanvas = new AsciiCanvas(converted.w, converted.h);
    for (let y = 0; y < converted.h; y++) {
      const chars = converted.r[y];
      const cols = converted.c[y];
      for (let x = 0; x < converted.w; x++) {
        gridCanvas.set(x, y, chars[x] || ' ', CHAR_TO_COLOR[cols[x]] || 'white');
      }
    }
    setPhotoHtml(gridCanvas.toHTML());
  };

  const handleEmotionPick = (emoId) => {
    onUnlockAudio?.();
    onSelectEmotion(emoId);
    if (photoImage) {
      rebuildPhotoAscii(photoImage, photoStyle, photoContrast, photoFull, emoId);
    }
  };

  const handleGenerateKey = () => {
    const words = ['star', 'moon', 'rain', 'spark', 'pine', 'dawn', 'echo', 'heart', 'wave', 'glow'];
    const pick = () => words[Math.floor(Math.random() * words.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setPassphrase(`${pick()}.${pick()}.${num}`);
    setShowKey(true);
    setErrorMsg('');
  };

  const handlePresetClick = (preset) => {
    if (preset === 'clear') {
      setPresetOffsetMs(null);
      setUnlockAtValue('');
      setPresetNote('');
    } else if (preset === '15s') {
      setPresetOffsetMs(15_000);
      setUnlockAtValue('');
      setPresetNote('Unlocks 15 seconds after sealing');
    } else if (preset === 'midnight') {
      setPresetOffsetMs(null);
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      setUnlockAtValue(formatLocalDatetimeInput(d));
      setPresetNote('Locked until midnight tonight');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setPhotoImage(img);
        rebuildPhotoAscii(img, photoStyle, photoContrast, photoFull, selectedEmotion);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoImage(null);
    setPhotoData(null);
    setPhotoHtml('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSealMessage = async () => {
    onUnlockAudio?.();
    setErrorMsg('');

    const msgCheck = validateMessageInput(message);
    if (!msgCheck.valid) {
      setErrorMsg(msgCheck.error);
      return;
    }

    const passCheck = validatePassphraseInput(passphrase, { required: false });
    if (!passCheck.valid) {
      setErrorMsg(passCheck.error);
      return;
    }

    const dateCheck = validateFutureUnlockDate({
      presetOffsetMs,
      dateValue: unlockAtValue,
    });
    if (!dateCheck.valid) {
      setErrorMsg(dateCheck.error);
      return;
    }

    setIsSealing(true);
    try {
      const token = await encryptMessage({
        message,
        emotion: selectedEmotion,
        key: passphrase,
        sender,
        unlockAt: dateCheck.unlockAt,
        burn: burnAfterReading,
        photo: photoData,
      });

      const shareUrl = new URL(window.location.href);
      shareUrl.hash = `code=${encodeURIComponent(token)}`;

      setSealedResult({
        token,
        shareUrl: shareUrl.toString(),
        cipherLabel: token.startsWith('TTY0.')
          ? 'TTY0. Open Cipher'
          : token.startsWith('TTY1.')
            ? 'TTY1. AES 256 GCM'
            : 'TTY2. SHA 256 CTR',
        locked: !token.startsWith('TTY0.'),
        hasCapsule: Boolean(dateCheck.unlockAt),
        hasBurn: burnAfterReading,
        hasPhoto: Boolean(photoData),
        charLen: token.length,
      });
      setCopiedType('');
    } catch (err) {
      setErrorMsg(err?.message || 'Unable to seal your message.');
    } finally {
      setIsSealing(false);
    }
  };

  const handleCopy = async (text, kind) => {
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
    setCopiedType(kind);
    setTimeout(() => {
      setCopiedType((curr) => (curr === kind ? '' : curr));
    }, 2400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column on desktop (below Preview on mobile): Modes first, then Write Message */}
      <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col gap-4">
        {/* 1. Eight Emotional ASCII Terminal Films Selector (Modes) */}
        <div id="modesSection" className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#080808]">
              Choose an emotional short film
            </span>
            <span className="font-mono text-xs text-[#5C5552]">
              8 films · 80×24
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Choose an emotional ASCII short film"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {EMOTION_LIST.map((emo) => {
              const isSelected = emo.id === selectedEmotion;
              return (
                <button
                  key={emo.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleEmotionPick(emo.id)}
                  style={
                    isSelected
                      ? {
                          borderColor: emo.accent,
                          boxShadow: `0 0 0 2px ${emo.glow}`,
                        }
                      : undefined
                  }
                  className={`group flex flex-col justify-between gap-2.5 rounded-xl border p-3 text-left transition-colors duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#080808] ${
                    isSelected
                      ? 'bg-[#FFFFFF] text-[#080808]'
                      : 'border-[#E6D9D3] bg-[#FAF1EC] text-[#080808] hover:border-[#080808]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span
                        style={isSelected ? { borderColor: emo.accent } : undefined}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-lg border border-[#E6D9D3] bg-[#FFF9F7] shrink-0"
                      >
                        <EmotionIcon
                          emotionId={emo.id}
                          size={14}
                          weight="fill"
                          style={{ color: emo.accent }}
                        />
                      </span>
                      <span className="text-sm font-semibold truncate">
                        {emo.label}
                      </span>
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: emo.accent,
                        boxShadow: isSelected ? `0 0 8px ${emo.accent}` : 'none',
                      }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Mini Terminal Cover */}
                  <div className="w-full rounded-lg border border-[#242424] bg-[#080808] px-2 py-2 flex items-center justify-center">
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

                  <span className="text-xs leading-snug text-pretty text-[#5C5552]">
                    {emo.tagline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Message Composer */}
        <div className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="messageInput" className="text-sm font-semibold text-[#080808]">
              Write your private note
            </label>
            <span className="font-mono text-xs text-[#5C5552]">
              {message.length} {message.length === 1 ? 'char' : 'chars'}
            </span>
          </div>

          <textarea
            ref={composerRef}
            id="messageInput"
            rows={5}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Write something they will feel before they finish reading..."
            className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-3 text-base text-[#080808] placeholder:text-[#5C5552]/70 transition-colors duration-300 focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="senderInput" className="text-xs font-medium text-[#5C5552]">
                From signature (optional)
              </label>
              <input
                id="senderInput"
                type="text"
                maxLength={40}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-2 text-sm text-[#080808] placeholder:text-[#5C5552]/70 transition-colors duration-300 focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="encodeKeyInput" className="text-xs font-medium text-[#5C5552]">
                  Secret key (optional)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#F4510B] hover:underline active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B] rounded"
                >
                  <Sparkle size={12} />
                  <span>Generate</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  id="encodeKeyInput"
                  type={showKey ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Blank for open cipher"
                  className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-2 text-sm text-[#080808] placeholder:text-[#5C5552]/70 transition-colors duration-300 focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  aria-label={showKey ? 'Hide passphrase' : 'Show passphrase'}
                  className="inline-flex items-center justify-center rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-2.5 py-2 text-[#5C5552] transition-colors duration-300 hover:text-[#080808] hover:border-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                >
                  {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Live Cryptographic Protocol Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium ${
                protocol.locked
                  ? 'border-[#F4510B] bg-[#FAF1EC] text-[#F4510B]'
                  : 'border-[#E6D9D3] bg-[#FAF1EC] text-[#080808]'
              }`}
            >
              {protocol.locked ? <Lock size={13} /> : <LockOpen size={13} />}
              <span>{protocol.label}</span>
            </span>

            {passphrase && keyValidation.warning && (
              <span className="text-xs text-[#5C5552]">{keyValidation.warning}</span>
            )}
            {!passphrase && (
              <span className="text-xs text-[#5C5552]">
                Anyone with the link can unlock an open cipher
              </span>
            )}
          </div>
        </div>

        {/* 3. Time Capsule & Burn After Reading */}
        <div className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="unlockAtInput" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#080808]">
                <HourglassHigh size={14} className="text-[#F4510B]" />
                <span>Time capsule</span>
              </label>
              <div className="flex items-center gap-1">
                {[
                  { id: 'clear', label: 'None' },
                  { id: '15s', label: '+15s' },
                  { id: 'midnight', label: 'Midnight' },
                ].map((chip) => {
                  const isActive =
                    (chip.id === '15s' && presetOffsetMs === 15_000) ||
                    (chip.id === 'midnight' && presetNote.includes('midnight'));
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handlePresetClick(chip.id)}
                      className={`rounded border px-2 py-0.5 font-mono text-xs transition-colors duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B] ${
                        isActive
                          ? 'border-[#F4510B] bg-[#F4510B] text-[#FFF9F7]'
                          : 'border-[#E6D9D3] bg-[#FAF1EC] text-[#5C5552] hover:text-[#080808]'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              id="unlockAtInput"
              type="datetime-local"
              value={unlockAtValue}
              onChange={(e) => {
                setPresetOffsetMs(null);
                setUnlockAtValue(e.target.value);
                setPresetNote(
                  e.target.value
                    ? `Unlocks ${new Date(e.target.value).toLocaleString()}`
                    : ''
                );
                if (errorMsg) setErrorMsg('');
              }}
              className="w-full rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-2.5 py-1.5 font-mono text-xs text-[#080808] focus:bg-[#FFF9F7] focus:border-[#F4510B] focus:outline-none focus:ring-2 focus:ring-[#F4510B]/25"
            />
            {presetNote && (
              <span className="font-mono text-xs text-[#F4510B]">{presetNote}</span>
            )}
          </div>

          <label
            htmlFor="burnToggle"
            className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors duration-300 ${
              burnAfterReading
                ? 'border-[#F4510B] bg-[#FAF1EC]'
                : 'border-[#E6D9D3] bg-[#FAF1EC]/70 hover:border-[#080808]'
            }`}
          >
            <input
              id="burnToggle"
              type="checkbox"
              checked={burnAfterReading}
              onChange={(e) => setBurnAfterReading(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[#F4510B] shrink-0"
            />
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#080808]">
                <Fire size={14} className="text-[#F4510B]" />
                <span>Burn after reading</span>
              </span>
              <span className="text-xs text-[#5C5552] text-pretty">
                Dissolves into drifting ASCII ash particles after one viewing.
              </span>
            </div>
          </label>
        </div>

        {/* 4. Optional Photo Memory */}
        <div className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#080808]">
              <Camera size={14} className="text-[#F4510B]" />
              <span>Attach photo memory (optional)</span>
            </span>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Upload photo to convert into ASCII"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-1 text-xs font-medium text-[#080808] transition-colors duration-300 hover:border-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
              >
                {photoImage ? 'Change photo' : 'Choose photo'}
              </button>
              {photoImage && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  aria-label="Remove attached photo"
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E6D9D3] bg-[#FFF9F7] px-2.5 py-1 text-xs font-medium text-[#5C5552] hover:text-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                >
                  <Trash size={13} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {photoImage && (
            <div className="flex flex-col gap-3">
              <div className="terminal-viewport rounded-lg border border-[#242424] p-2 flex justify-center">
                <pre
                  className="ascii-photo-grid"
                  aria-label="ASCII portrait preview"
                  dangerouslySetInnerHTML={{ __html: photoHtml }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C5552]">
                <label className="inline-flex items-center gap-2">
                  <span>Style</span>
                  <select
                    value={photoStyle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhotoStyle(val);
                      rebuildPhotoAscii(photoImage, val, photoContrast, photoFull, selectedEmotion);
                    }}
                    className="rounded border border-[#E6D9D3] bg-[#FAF1EC] px-2 py-1 text-xs text-[#080808]"
                  >
                    <option value="emotion">Emotion glow</option>
                    <option value="color">Color phosphor</option>
                  </select>
                </label>

                <label className="inline-flex items-center gap-2">
                  <span>Contrast</span>
                  <input
                    type="range"
                    min="0.8"
                    max="3.5"
                    step="0.05"
                    value={photoContrast}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPhotoContrast(val);
                      rebuildPhotoAscii(photoImage, photoStyle, val, photoFull, selectedEmotion);
                    }}
                    className="w-24 accent-[#F4510B]"
                  />
                </label>

                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={photoFull}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setPhotoFull(val);
                      rebuildPhotoAscii(photoImage, photoStyle, photoContrast, val, selectedEmotion);
                    }}
                    className="accent-[#F4510B]"
                  />
                  <span>Full frame</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 5. Action & Inline Error Feedback */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="encryptBtn"
              type="button"
              disabled={isSealing}
              onClick={handleSealMessage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F4510B] px-6 py-3 text-sm font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#D84306] disabled:opacity-60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF1EC]"
            >
              <Lock size={16} />
              <span>{isSealing ? 'Sealing cipher...' : 'Create a secret link'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onUnlockAudio?.();
                onWatchFullFilm(message.trim(), sender.trim(), photoData);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] px-4 py-3 text-sm font-medium text-[#080808] transition-colors duration-300 hover:border-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <Play size={15} />
              <span>Preview experience</span>
            </button>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="inline-flex items-center gap-2 rounded-lg border border-[#F4510B] bg-[#FFF9F7] px-3 py-2 text-xs font-medium text-[#C23400]"
            >
              <WarningCircle size={15} className="shrink-0 text-[#F4510B]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSealing && (
            <div className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] p-4 flex flex-col gap-2 animate-pulse" aria-label="Encrypting payload">
              <div className="h-3 w-36 rounded bg-[#E6D9D3]" />
              <div className="h-10 w-full rounded bg-[#FAF1EC]" />
            </div>
          )}

          {/* Share Output Box / Empty State */}
          <AnimatePresence mode="wait">
            {sealedResult ? (
              <motion.div
                key="sealed-output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
                className="rounded-xl border border-[#F4510B] bg-[#FFF9F7] p-4 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-[#F4510B]">
                    {sealedResult.cipherLabel}
                  </span>
                  <span className="font-mono text-xs text-[#5C5552]">
                    {[
                      `${sealedResult.charLen} chars`,
                      sealedResult.hasCapsule ? 'Time capsule' : null,
                      sealedResult.hasBurn ? 'Burn once' : null,
                      sealedResult.hasPhoto ? 'ASCII photo' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>

                <div className="rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] p-3 font-mono text-xs text-[#080808] break-all max-h-24 overflow-y-auto">
                  {sealedResult.shareUrl}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(sealedResult.shareUrl, 'link')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#080808] px-3.5 py-2 text-xs font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#F4510B] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                  >
                    {copiedType === 'link' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedType === 'link' ? 'Copied link' : 'Copy share link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(sealedResult.token, 'code')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6D9D3] bg-[#FAF1EC] px-3 py-2 font-mono text-xs font-medium text-[#080808] transition-colors duration-300 hover:border-[#080808] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                  >
                    {copiedType === 'code' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedType === 'code' ? 'Copied cipher' : 'Copy raw cipher'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenTokenInDecoder(sealedResult.token, passphrase)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-[#F4510B] hover:underline active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                  >
                    <span>Unlock in decoder</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <AnimatePresence>
                  {copiedType === 'link' && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="status"
                      className="text-xs font-medium text-[#F4510B] m-0"
                    >
                      Encrypted link copied to clipboard
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-[#E6D9D3] bg-[#FFF9F7] px-4 py-3 text-xs text-[#5C5552]">
                Empty seal: compose your note above to mint a browser encrypted hash link.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column on desktop (top on mobile): Sticky Live Midnight Black 80x24 Terminal Viewport */}
      <div className="lg:col-span-6 order-1 lg:order-2 lg:sticky lg:top-8 flex flex-col gap-3">
        <TerminalViewport
          frameHtml={previewHtml}
          emotion={activeEmotion}
          headerLabel={`LIVE PREVIEW · ${activeEmotion.label.toUpperCase()}`}
          actLabel={previewAct}
          crtOn={crtOn}
          soundOn={soundOn}
          isPaused={previewPaused}
          isTheater={false}
          onTogglePause={onTogglePreviewPause}
          onToggleCrt={onToggleCrt}
          onToggleSound={onToggleSound}
          onWatchFullFilm={() => {
            onUnlockAudio?.();
            onWatchFullFilm(message.trim(), sender.trim(), photoData);
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#5C5552]">
          <span>
            True 80×24 monospace stage · {activeEmotion.id === 'apology' ? '20 second' : '17 second'} four act film
          </span>
          <span className="font-mono">
            24 fps · Web Audio synth
          </span>
        </div>
      </div>
    </div>
  );
}
