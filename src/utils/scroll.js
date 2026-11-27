import { animate } from 'motion/react';

export const EDITORIAL_EASE = [0.22, 1, 0.36, 1];

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let activeScrollControls = null;

/**
 * Smoothly scrolls to a target element ID or vertical offset using Framer Motion.
 */
export function smoothScrollTo(targetOrId, offset = 96) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let targetY = 0;
  if (typeof targetOrId === 'number') {
    targetY = Math.max(0, targetOrId);
  } else if (typeof targetOrId === 'string') {
    const cleanId = targetOrId.replace(/^#/, '');
    const node = document.getElementById(cleanId);
    if (!node) return;
    const rect = node.getBoundingClientRect();
    targetY = Math.max(0, window.scrollY + rect.top - offset);
  } else if (targetOrId && typeof targetOrId.getBoundingClientRect === 'function') {
    const rect = targetOrId.getBoundingClientRect();
    targetY = Math.max(0, window.scrollY + rect.top - offset);
  }

  if (activeScrollControls) {
    activeScrollControls.stop();
    activeScrollControls = null;
  }

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = Math.abs(targetY - startY);
  if (distance < 4) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(0.9, Math.max(0.42, distance / 1800));
  activeScrollControls = animate(startY, targetY, {
    duration,
    ease: EDITORIAL_EASE,
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
    onComplete: () => {
      activeScrollControls = null;
    },
  });
}
