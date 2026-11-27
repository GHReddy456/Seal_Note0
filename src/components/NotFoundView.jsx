import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TerminalWindow } from '@phosphor-icons/react';
import { AsciiCanvas } from '../ascii-canvas.js';
import { renderNotFoundStatic, CANVAS_COLS, CANVAS_ROWS } from '../scenes.js';
import { TerminalViewport } from './TerminalViewport.jsx';
import { BrandMonogram } from './Icons.jsx';
import { EDITORIAL_EASE } from '../utils/scroll.js';

export function NotFoundView({ onReturnStudio, crtOn, soundOn, onToggleCrt, onToggleSound }) {
  const [frameHtml, setFrameHtml] = useState('');

  useEffect(() => {
    const canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS);
    let rafId = null;
    let start = null;
    let lastFrame = -1;

    const tick = (now) => {
      if (start === null) start = now;
      const frame = Math.floor((now - start) / (1000 / 16));
      if (frame !== lastFrame) {
        lastFrame = frame;
        renderNotFoundStatic(canvas, frame);
        setFrameHtml(canvas.toHTML());
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main id="main-content" className="min-h-screen text-[#FFF9F7] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
        className="w-full max-w-[760px] flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 text-center items-center">
          <div className="inline-flex items-center gap-2 mb-1">
            <BrandMonogram className="w-6 h-6" />
            <span className="text-sm font-semibold tracking-tight text-[#FFF9F7]">Seal Note</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFF9F7] bg-[#FFF9F7] px-3 py-1 font-mono text-xs font-medium text-[#080808]">
            <TerminalWindow size={14} />
            <span>Error 404</span>
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-[#FFF9F7] text-balance m-0">
            This terminal channel could not be found.
          </h1>
          <p className="text-base text-[#FFF9F7]/90 max-w-[520px] text-pretty m-0">
            Sealed letters live inside a URL hash fragment. Check your full link or return to the studio to compose a new encrypted note.
          </p>
        </div>

        <TerminalViewport
          frameHtml={frameHtml}
          headerLabel="404 // SIGNAL LOST"
          actLabel="NO PAYLOAD"
          crtOn={crtOn}
          soundOn={soundOn}
          onToggleCrt={onToggleCrt}
          onToggleSound={onToggleSound}
          isTheater={false}
          showControls={true}
        />

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onReturnStudio}
            className="inline-flex items-center gap-2 rounded-full bg-[#FFF9F7] px-6 py-3 text-sm font-semibold text-[#080808] transition-colors duration-300 hover:bg-[#080808] hover:text-[#FFF9F7] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF9F7]"
          >
            <ArrowLeft size={16} />
            <span>Return to the studio</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
