import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  SkipForward,
  ArrowCounterClockwise,
  X,
  Fire,
  SpeakerHigh,
  SpeakerSlash,
  Monitor,
  Pause,
  PencilSimple,
} from '@phosphor-icons/react';
import { EmotionIcon } from './Icons.jsx';
import { EDITORIAL_EASE } from '../utils/scroll.js';

export function TerminalViewport({
  frameHtml = '',
  emotion = null,
  headerLabel = '80×24 ASCII STAGE',
  actLabel = 'ACT I',
  timerLabel = '',
  progressPct = 0,
  crtOn = true,
  soundOn = true,
  isPaused = false,
  isTheater = false,
  isPreview = false,
  withPhoto = false,
  dimmed = false,
  showControls = true,
  onTogglePause,
  onToggleCrt,
  onToggleSound,
  onWatchFullFilm,
  onSkip,
  onReplay,
  onClose,
  reveal = null,
  onBurnNow,
  onReply,
  receiverOnly = false,
  showBurnReplayControls = false,
}) {
  return (
    <div className="rounded-2xl border border-[#242424] bg-[#080808] p-2">
      {/* Terminal Bezel Chrome Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2 text-[#FFF9F7]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: emotion?.accent || '#F4510B' }}
            aria-hidden="true"
          />
          <span className="font-mono text-xs font-medium tracking-tight text-[#FFF9F7] truncate">
            {headerLabel}
          </span>
          {actLabel && (
            <span className="hidden sm:inline font-mono text-xs text-[#968D8A] truncate">
              · {actLabel}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {timerLabel && (
            <span className="font-mono text-xs text-[#DDD4D0] px-2">
              {timerLabel}
            </span>
          )}

          {showControls && onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Mute audio' : 'Unmute audio'}
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              {soundOn ? <SpeakerHigh size={13} /> : <SpeakerSlash size={13} />}
              <span className="hidden md:inline">{soundOn ? 'Audio' : 'Muted'}</span>
            </button>
          )}

          {showControls && onToggleCrt && (
            <button
              type="button"
              onClick={onToggleCrt}
              aria-pressed={crtOn}
              aria-label={crtOn ? 'Disable scanlines' : 'Enable scanlines'}
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <Monitor size={13} />
              <span className="hidden md:inline">{crtOn ? 'CRT' : 'Flat'}</span>
            </button>
          )}

          {!isTheater && onTogglePause && (
            <button
              type="button"
              onClick={onTogglePause}
              aria-pressed={isPaused}
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          )}

          {!isTheater && onWatchFullFilm && (
            <button
              type="button"
              onClick={onWatchFullFilm}
              className="inline-flex items-center gap-1.5 rounded border border-[#F4510B] bg-[#F4510B] px-2.5 py-1 text-xs font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#D84306] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <Play size={12} weight="fill" />
              <span>Watch full film</span>
            </button>
          )}

          {isTheater && onSkip && !reveal && (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#FFF9F7] transition-colors duration-300 hover:border-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <SkipForward size={13} />
              <span>Skip to note</span>
            </button>
          )}

          {isTheater && onReplay && !showBurnReplayControls && (
            <button
              type="button"
              onClick={onReplay}
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <ArrowCounterClockwise size={13} />
              <span className="hidden sm:inline">Replay</span>
            </button>
          )}

          {isTheater && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close theater"
              className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#080808] px-2 py-1 font-mono text-xs text-[#DDD4D0] transition-colors duration-300 hover:border-[#FFF9F7] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
            >
              <X size={13} />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Nested Midnight Black Screen (#080808) — Inner radius = 16px - 8px = 8px */}
      <div
        className={`terminal-viewport ${crtOn ? 'crt-on' : ''} rounded-lg border border-[#242424] px-2 py-3 md:px-4 md:py-4 ${
          withPhoto ? 'flex flex-col items-center justify-center' : 'grid place-items-center'
        }`}
      >
        {!frameHtml ? (
          <div className="col-start-1 row-start-1 w-full py-12 px-4 flex flex-col gap-3 animate-pulse" aria-label="Loading terminal canvas">
            <div className="h-3 w-2/3 rounded bg-[#181818] mx-auto" />
            <div className="h-3 w-4/5 rounded bg-[#181818] mx-auto" />
            <div className="h-3 w-1/2 rounded bg-[#181818] mx-auto" />
            <div className="h-3 w-3/4 rounded bg-[#181818] mx-auto" />
          </div>
        ) : (
          <pre
            className={`${withPhoto ? '' : 'col-start-1 row-start-1 '}ascii-stage-grid ${dimmed && !withPhoto ? 'dimmed' : ''}`}
            aria-label="80 by 24 ASCII terminal animation"
            dangerouslySetInnerHTML={{ __html: frameHtml }}
          />
        )}

        {/* Reveal Message Overlay */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              key="reveal-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
              className={
                withPhoto
                  ? 'w-full mt-4 relative z-10'
                  : 'col-start-1 row-start-1 w-full relative z-10 flex items-center justify-center p-2 md:p-4'
              }
            >
              <div className="w-full max-w-[600px] mx-auto rounded-lg border border-[#242424] bg-[#080808]/95 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#242424]">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-medium"
                      style={{ color: emotion?.accent || '#F4510B' }}
                    >
                      <EmotionIcon emotionId={emotion?.id} size={14} weight="fill" />
                      <span>{emotion?.label || 'Message'}</span>
                    </span>
                    {reveal.burn && !isPreview && (
                      <span className="inline-flex items-center gap-1 rounded border border-[#242424] bg-[#141414] px-2 py-0.5 font-mono text-xs text-[#F4510B]">
                        <Fire size={12} weight="fill" />
                        <span>Burns after reading</span>
                      </span>
                    )}
                  </div>

                  {reveal.sender && (
                    <span className="font-mono text-xs text-[#968D8A]">
                      From {reveal.sender}
                    </span>
                  )}
                </div>

                <p
                  className={`font-mono text-sm md:text-base leading-relaxed text-[#FFF9F7] whitespace-pre-wrap min-h-[3.2em] m-0 mb-4 ${
                    reveal.typingDone ? '' : 'reveal-cursor'
                  }`}
                >
                  {reveal.displayedText}
                </p>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#242424]">
                  {reveal.burn && !isPreview && onBurnNow && (
                    <button
                      type="button"
                      onClick={onBurnNow}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#F4510B] bg-[#080808] px-3 py-1.5 font-mono text-xs font-medium text-[#F4510B] transition-colors duration-300 hover:bg-[#F4510B] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                    >
                      <Fire size={14} weight="fill" />
                      <span>Burn and dissolve</span>
                    </button>
                  )}

                  {(!reveal.burn || isPreview) && onReplay && (
                    <button
                      type="button"
                      onClick={onReplay}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#242424] bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#FFF9F7] transition-colors duration-300 hover:border-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                    >
                      <ArrowCounterClockwise size={14} />
                      <span>Replay story</span>
                    </button>
                  )}

                  {onReply && (
                    <button
                      type="button"
                      onClick={onReply}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F4510B] px-3 py-1.5 text-xs font-medium text-[#FFF9F7] transition-colors duration-300 hover:bg-[#D84306] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                    >
                      <PencilSimple size={14} />
                      <span>{receiverOnly ? 'Create your own' : 'Send a reply'}</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Progress Track */}
      {isTheater && (
        <div className="mt-2 h-0.5 w-full rounded-full bg-[#242424] overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{
              width: `${Math.max(0, Math.min(100, progressPct))}%`,
              backgroundColor: emotion?.accent || '#F4510B',
            }}
          />
        </div>
      )}
    </div>
  );
}
