import { inspectCode } from '../crypto.js';

export function validateMessageInput(message) {
  const trimmed = typeof message === 'string' ? message.trim() : '';
  if (!trimmed) {
    return { valid: false, error: 'Write a private note before sealing your link.' };
  }
  return { valid: true, error: '' };
}

export function validatePassphraseInput(key, { required = false } = {}) {
  const value = typeof key === 'string' ? key : '';
  if (required && !value.trim()) {
    return { valid: false, error: 'Enter the passphrase provided by the sender.' };
  }
  if (!value) {
    return { valid: true, warning: '', strength: 'open' };
  }
  if (value.trim().length > 0 && value.trim().length < 4) {
    return {
      valid: false,
      error: 'Passphrase must be at least 4 characters for strong AES 256 GCM protection.',
      strength: 'weak',
    };
  }
  if (value.trim().length < 8) {
    return {
      valid: true,
      warning: 'Tip: passphrases with 8 or more characters provide stronger protection.',
      strength: 'fair',
    };
  }
  return { valid: true, warning: '', strength: 'strong' };
}

export function validateFutureUnlockDate({ presetOffsetMs = null, dateValue = '', nowMs = Date.now() } = {}) {
  if (presetOffsetMs && Number.isFinite(presetOffsetMs) && presetOffsetMs > 0) {
    return { valid: true, unlockAt: nowMs + presetOffsetMs, error: '' };
  }
  if (!dateValue) {
    return { valid: true, unlockAt: null, error: '' };
  }
  const parsed = new Date(dateValue).getTime();
  if (!Number.isFinite(parsed)) {
    return { valid: false, unlockAt: null, error: 'Choose a valid unlock date and time.' };
  }
  if (parsed <= nowMs) {
    return { valid: false, unlockAt: null, error: 'Time capsule unlock date must be in the future.' };
  }
  return { valid: true, unlockAt: parsed, error: '' };
}

export function getProtocolBadge(key = '') {
  if (key && key.length > 0) {
    return {
      prefix: 'TTY1.',
      label: 'TTY1. AES 256 GCM',
      locked: true,
    };
  }
  return {
    prefix: 'TTY0.',
    label: 'TTY0. Open Cipher',
    locked: false,
  };
}

export function inspectCipherStatus(code = '') {
  const trimmed = typeof code === 'string' ? code.trim().replace(/\s+/g, '') : '';
  if (!trimmed) {
    return { state: 'empty', label: 'Waiting for a sealed code', requiresKey: false, valid: false };
  }
  const info = inspectCode(trimmed);
  if (!info.valid) {
    return { state: 'invalid', label: 'Expected a code starting with TTY0. or TTY1.', requiresKey: false, valid: false };
  }
  if (info.requiresKey) {
    return {
      state: 'locked',
      label: trimmed.startsWith('TTY1.') ? 'TTY1. AES 256 GCM locked' : 'TTY2. Passphrase locked',
      requiresKey: true,
      valid: true,
    };
  }
  return {
    state: 'open',
    label: 'TTY0. Open Cipher ready',
    requiresKey: false,
    valid: true,
  };
}
