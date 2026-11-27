# Seal Note

**Seal Note** — Encrypted secret messages revealed through emotional ASCII terminal animations.

## Features
- **8 Emotional ASCII Terminal Films**: Love, Happiness, Sadness, Missing Someone, Friendship, Motivation, Gratitude, and I'm Sorry — rendered purely with moving text characters on an `80×24` grid.
- **Optional Secret Key**: Leave blank for a compact open cipher (`TTY0.`) or set a passphrase for `AES-256-GCM` encryption (`TTY1.`).
- **Time Capsule (Open After Date)**: Seal a message until a target date/time with a live ASCII hourglass countdown that auto-unlocks when the moment arrives.
- **Burn After Reading**: Optional one-time mode that dissolves the message into drifting ASCII ash after viewing.
- **Receiver-Only Share Links**: Shared `#code=...` URLs open directly into a focused decoder view without exposing the encoder studio.

## Local Development

```bash
npm run dev
# Open http://127.0.0.1:3456 (or open index.html directly)
```

## Tests

```bash
npm test
```
