import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretDown } from '@phosphor-icons/react';
import { EDITORIAL_EASE } from '../utils/scroll.js';

export const FAQ_ITEMS = [
  {
    question: 'Are my messages or photos saved on any server?',
    answer:
      'No. Everything runs 100% locally in your browser. Neither your message, your secret key, nor any photo you attach is ever uploaded, logged, or stored on a server.',
  },
  {
    question: 'How safe is the encryption when I add a secret key?',
    answer:
      'Messages locked with a key are encrypted on your device using AES 256 GCM with PBKDF2 SHA 256 key derivation (120,000 iterations). Without the exact key, nobody can read the message, emotion, or photo.',
  },
  {
    question: 'What happens if I leave the secret key blank?',
    answer:
      'Leaving the key blank creates an open cipher code so your receiver can watch the animation right away without typing a passphrase. The data still lives only inside the code or link you share.',
  },
  {
    question: 'Is my uploaded photo kept private?',
    answer:
      'Yes. Your photo is sampled on a local HTML canvas inside your device memory and converted into ASCII text characters. The original image file never leaves your browser.',
  },
  {
    question: 'Can the receiver access the encoder from my share link?',
    answer:
      'No. Shared links open a dedicated receiver view containing only the decoder and the terminal experience, keeping the flow clean and focused on your message.',
  },
  {
    question: 'How do Time capsule and Burn after reading work?',
    answer:
      'Time capsule seals the unlock time inside the code until the target hour arrives. Burn after reading dissolves the message into ASCII ash after one view and blocks reopening on that browser.',
  },
];

export function LandingSections() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <footer className="max-w-[1120px] mx-auto w-full px-4 pt-2 pb-10">
      <div className="rounded-2xl border border-[#FFF9F7] bg-[#FFF9F7] p-4 md:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-base font-semibold text-[#080808] m-0">
            Frequently asked questions
          </h2>
          <span className="font-mono text-xs text-[#5C5552]">6 questions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.question}
                className="rounded-xl border border-[#E6D9D3] bg-[#FAF1EC] overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-[#080808] transition-colors duration-300 hover:bg-[#FFF9F7] active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4510B]"
                >
                  <span className="text-balance">{item.question}</span>
                  <CaretDown
                    size={16}
                    className={`shrink-0 text-[#5C5552] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#F4510B]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3.5 pt-0.5 text-xs leading-relaxed text-[#5C5552] text-pretty">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
