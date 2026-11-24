import { AsciiCanvas } from './ascii-canvas.js';

export const CANVAS_COLS = 80;
export const CANVAS_ROWS = 24;

function hash01(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function easeInOut(t) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function drawCaption(canvas, frame, captions) {
  let active = null;
  for (const c of captions) {
    if (frame >= c.at) active = c;
  }
  if (!active) return;
  const age = frame - active.at;
  const typedLen = Math.min(active.text.length, Math.floor(age * 1.45) + 1);
  const visible = active.text.slice(0, typedLen);
  const x = Math.max(1, Math.floor((canvas.cols - active.text.length) / 2));
  canvas.fillRect(0, 23, canvas.cols, 1, ' ');
  canvas.text(x, 23, visible, active.color || 'white');
}

function drawStars(canvas, frame, count = 48, maxRow = 15, color = 'star') {
  const glyphs = ['.', '·', '+', '*', '✦'];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(hash01(i * 3 + 1) * canvas.cols);
    const y = Math.floor(hash01(i * 7 + 2) * maxRow);
    const phase = hash01(i * 11 + 5) * 20;
    const pulse = Math.sin(frame * 0.14 + phase);
    if (pulse > -0.5) {
      const idx = pulse > 0.8 ? 4 : pulse > 0.45 ? 3 : pulse > 0.1 ? 2 : 0;
      canvas.set(x, y, glyphs[idx], idx >= 3 ? 'bright' : color);
    }
  }
}

function drawPerson(canvas, x, y, { pose = 'stand', color = 'white', legPhase = 0 } = {}) {
  const step = legPhase % 2 === 0;
  if (pose === 'walk') {
    canvas.sprite(x, y, [' o ', '/|\\', step ? '/ \\' : ' | '], color);
  } else if (pose === 'reachRight') {
    canvas.sprite(x, y, [' o ', '/|-', '/ \\'], color);
  } else if (pose === 'reachLeft') {
    canvas.sprite(x, y, [' o ', '-|\\', '/ \\'], color);
  } else if (pose === 'embraceLeft') {
    canvas.sprite(x, y, [' o ', '/|>', '/ \\'], color);
  } else if (pose === 'embraceRight') {
    canvas.sprite(x, y, [' o ', '<|\\', '/ \\'], color);
  } else if (pose === 'sitHunched') {
    canvas.sprite(x, y, ['   ', ' o ', '/|\\', ' _|'], color);
  } else if (pose === 'wave') {
    canvas.sprite(x, y, [' o/', '/| ', '/ \\'], color);
  } else if (pose === 'cheer') {
    canvas.sprite(x, y, ['\\o/', ' | ', '/ \\'], color);
  } else {
    canvas.sprite(x, y, [' o ', '/|\\', '/ \\'], color);
  }
}

/* ============================================================================
 * 1. LOVE — Two worlds walking together under a blooming constellation heart
 * ========================================================================== */
function renderLove(canvas, frame) {
  drawStars(canvas, frame, 64, 16, 'star');

  // Glowing crescent moon
  canvas.sprite(66, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Shooting stars during Acts II & III
  const meteors = [
    { start: 96, len: 22, sx: 10, sy: 2, dx: 2.2, dy: 0.42 },
    { start: 146, len: 22, sx: 58, sy: 1, dx: -2.0, dy: 0.45 },
    { start: 230, len: 20, sx: 22, sy: 3, dx: 1.9, dy: 0.38 },
    { start: 330, len: 20, sx: 60, sy: 2, dx: -1.8, dy: 0.35 },
  ];
  for (const m of meteors) {
    if (frame >= m.start && frame < m.start + m.len) {
      const k = frame - m.start;
      const hx = m.sx + k * m.dx;
      const hy = m.sy + k * m.dy;
      for (let t = 0; t < 6; t++) {
        canvas.set(
          hx - t * m.dx * 0.65,
          hy - t * m.dy * 0.65,
          t === 0 ? '★' : t < 3 ? '*' : '·',
          t === 0 ? 'bright' : 'gold'
        );
      }
    }
  }

  // Rolling hill + swaying meadow flowers (hidden during intimate close-up cut)
  const isCloseUp = frame >= 212 && frame <= 286;
  if (isCloseUp) {
    // Cinematic Close-Up Cut: Two detailed shaded hands reaching & intertwining
    const reachT = easeInOut((frame - 212) / 52);
    const lx = Math.round(lerp(4, 21, reachT));
    const rx = Math.round(lerp(56, 40, reachT));
    const joined = reachT >= 0.94;

    canvas.sprite(
      lx,
      9,
      [
        '           .---.    ',
        '==========(     \\__ ',
        '==========(   ___--)',
        "           '-'      ",
      ],
      'rose'
    );
    canvas.sprite(
      rx,
      9,
      [
        '    .---.           ',
        ' __/     )==========',
        '(--___   )==========',
        "      '-'           ",
      ],
      'cyan'
    );

    if (joined) {
      const pulse = Math.floor(frame / 5) % 2 === 0;
      canvas.set(39, 9, pulse ? '♥' : '✦', 'bright');
      canvas.set(37, 8, '·', 'gold');
      canvas.set(41, 8, '·', 'gold');
      canvas.set(39, 13, '✦', 'gold');
    }
  } else {
    for (let x = 0; x < canvas.cols; x++) {
      const hillY = 18 + Math.round(Math.sin(x * 0.085) * 1.1);
      canvas.set(x, hillY, '_', 'muted');
      if (x % 9 === 3) {
        const sway = Math.floor(frame / 16 + x) % 2 === 0 ? 'v' : 'y';
        canvas.set(x, hillY, sway, x % 18 === 3 ? 'rose' : 'green');
      }
      for (let y = hillY + 1; y < 22; y++) {
        canvas.set(x, y, y % 2 === 0 ? '.' : ' ', 'dim');
      }
    }

    // Two figures gaze at the sky in Act I, walk together in Act II, embrace in Act IV
    const walkT = easeInOut((frame - 78) / 132);
    const leftX = Math.round(lerp(10, 37, walkT));
    const rightX = Math.round(lerp(67, 40, walkT));
    const met = walkT >= 0.99;
    const legStep = Math.floor(frame / 6);

    if (!met) {
      const walking = frame >= 78;
      drawPerson(canvas, leftX, 15, { pose: walking ? 'walk' : 'stand', color: 'rose', legPhase: legStep });
      drawPerson(canvas, rightX, 15, { pose: walking ? 'walk' : 'stand', color: 'cyan', legPhase: legStep + 1 });
      if (frame > 40) {
        for (let px = leftX + 4; px < rightX - 1; px += 4) {
          if ((px + Math.floor(frame / 4)) % 8 === 0) {
            canvas.set(px, 15, '·', 'rose');
          }
        }
      }
    } else {
      const closeHold = frame >= 286;
      drawPerson(canvas, 37, 15, { pose: closeHold ? 'embraceLeft' : 'reachRight', color: 'rose' });
      drawPerson(canvas, 40, 15, { pose: closeHold ? 'embraceRight' : 'reachLeft', color: 'cyan' });
    }

    // Rising blooming heart + pulsing heartbeat rings in Act IV
    if (frame >= 287) {
      const riseT = easeInOut((frame - 287) / 42);
      const beat = Math.sin((frame - 287) * 0.28) > 0.25;
      const hy = Math.round(lerp(12, 4, riseT));
      const heart = beat
        ? [
            '  .:::.   .:::.  ',
            ' :::::::.::::::: ',
            ' ::::::::::::::: ',
            " ':::::::::::::' ",
            "   ':::::::::'   ",
            "     ':::::'     ",
            "       ':'       ",
          ]
        : [
            '  .---.   .---.  ',
            ' /     \\ /     \\ ',
            '|       V       |',
            ' \\             / ',
            "  '.         .'  ",
            "    '.     .'    ",
            "      '. .'      ",
          ];
      canvas.sprite(31, hy, heart, beat ? 'bright' : 'rose');

      for (let i = 0; i < 14; i++) {
        const ang = frame * 0.08 + (i * Math.PI * 2) / 14;
        const rx = Math.round(39 + Math.cos(ang) * (13 + (i % 3) * 3));
        const ry = Math.round(hy + 3 + Math.sin(ang) * 4.5);
        canvas.set(rx, ry, i % 2 === 0 ? '♥' : '✦', i % 3 === 0 ? 'gold' : 'rose');
      }
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Two quiet hearts, looking up at the same night...', color: 'muted' },
    { at: 96, text: 'Across every mile, something pulls them closer...', color: 'gold' },
    { at: 216, text: 'And suddenly, the whole sky feels small.', color: 'rose' },
    { at: 320, text: '♥  Two hearts, beating under one sky  ♥', color: 'bright' },
  ]);
}

/* ============================================================================
 * 2. HAPPINESS — Festival stage, leaping dancers, confetti & grand fireworks
 * ========================================================================== */
function renderHappiness(canvas, frame) {
  drawStars(canvas, frame, 30, 12, 'dim');

  // Festive string lights across top corners
  for (let x = 2; x < 78; x += 5) {
    const bulbOn = (x + Math.floor(frame / 8)) % 10 === 0;
    canvas.set(x, 0, bulbOn ? '✦' : '·', x % 2 === 0 ? 'gold' : 'cyan');
  }

  // Stage ground
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, x % 4 === 0 ? '✦' : '=', 'muted');
  }

  // Joyful dancers with expressive choreography
  const dancers = [
    { x: 20, color: 'gold', offset: 0 },
    { x: 38, color: 'cyan', offset: 2 },
    { x: 56, color: 'rose', offset: 1 },
  ];
  const poses = [
    [' \\o/ ', '  |  ', ' / \\ '],
    ['  o/ ', ' /|  ', ' / \\ '],
    [' \\o  ', '  |\\ ', ' / \\ '],
    [' ^o^ ', ' ( ) ', ' / \\ '],
  ];

  for (const d of dancers) {
    const idx = (Math.floor(frame / 6) + d.offset) % poses.length;
    const bounce = idx === 3 || idx === 0 ? -1 : 0;
    canvas.sprite(d.x, 17 + bounce, poses[idx], d.color);

    const notePhase = (frame + d.offset * 11) % 34;
    if (notePhase < 24) {
      const ny = 15 - Math.floor(notePhase / 4);
      const nx = d.x + 2 + Math.round(Math.sin(notePhase * 0.4) * 2);
      canvas.set(nx, ny, d.offset % 2 === 0 ? '♪' : '♫', d.color);
    }
  }

  // Drifting confetti ribbons from Act II onward
  if (frame >= 72) {
    const confettiGlyphs = ['*', '✦', '~', '+'];
    const confettiColors = ['gold', 'cyan', 'rose', 'green'];
    for (let i = 0; i < 24; i++) {
      const cx = (hash01(i * 17 + 3) * 80 + Math.sin(frame * 0.08 + i) * 3 + 80) % 80;
      const cy = (hash01(i * 23 + 7) * 18 + frame * 0.25) % 19;
      canvas.set(cx, cy, confettiGlyphs[i % 4], confettiColors[i % 4]);
    }
  }

  // Fireworks finale (loops smoothly during climax & reveal!)
  const fireworkCycle = frame >= 300 ? 300 + ((frame - 300) % 96) : frame;
  const shells = [
    { launch: 120, x: 18, apex: 5, color: 'gold' },
    { launch: 148, x: 60, apex: 4, color: 'cyan' },
    { launch: 182, x: 40, apex: 3, color: 'rose' },
    { launch: 214, x: 24, apex: 6, color: 'green' },
    { launch: 236, x: 54, apex: 5, color: 'gold' },
    { launch: 262, x: 39, apex: 4, color: 'violet' },
    { launch: 302, x: 20, apex: 4, color: 'rose' },
    { launch: 318, x: 58, apex: 4, color: 'cyan' },
    { launch: 340, x: 40, apex: 3, color: 'gold' },
    { launch: 362, x: 15, apex: 5, color: 'green' },
    { launch: 374, x: 65, apex: 5, color: 'violet' },
  ];

  for (const s of shells) {
    const age = fireworkCycle - s.launch;
    if (age < 0) continue;

    const ascend = 16;
    if (age < ascend) {
      const y = Math.round(lerp(19, s.apex, age / ascend));
      canvas.set(s.x, y, '^', 'bright');
      canvas.set(s.x, y + 1, '|', s.color);
      canvas.set(s.x, y + 2, ':', 'dim');
    } else if (age < ascend + 36) {
      const bAge = age - ascend;
      const radius = bAge * 0.42;
      const spokes = 16;
      const burstGlyphs = bAge < 8 ? ['*', '@', '#'] : bAge < 22 ? ['*', '+', '✦'] : ['.', '·', ' '];
      for (let i = 0; i < spokes; i++) {
        const ang = (i * Math.PI * 2) / spokes;
        const px = s.x + Math.cos(ang) * radius * 1.95;
        const py = s.apex + Math.sin(ang) * radius * 0.85 + bAge * 0.06;
        const ch = burstGlyphs[i % burstGlyphs.length];
        if (ch !== ' ') canvas.set(px, py, ch, bAge < 7 ? 'bright' : s.color);

        if (bAge > 4 && bAge < 24) {
          const ix = s.x + Math.cos(ang) * radius * 1.05;
          const iy = s.apex + Math.sin(ang) * radius * 0.48 + bAge * 0.04;
          canvas.set(ix, iy, '·', s.color);
        }
      }
      if (bAge < 5) canvas.set(s.x, s.apex, '✺', 'bright');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some moments are too bright to keep inside...', color: 'muted' },
    { at: 96, text: 'Music rises, feet leave the ground...', color: 'cyan' },
    { at: 204, text: 'Let the whole sky light up tonight!', color: 'gold' },
    { at: 300, text: '✦  Every spark is celebrating you  ✦', color: 'bright' },
  ]);
}

/* ============================================================================
 * 3. SADNESS — Heavy rain until someone arrives with a shared umbrella
 * ========================================================================== */
function renderSadness(canvas, frame) {
  // Drifting overcast clouds
  const cloudShift = Math.floor(frame / 10);
  const cLines = ['   .---.   .----.   ', ' .(     )./      ). ', '(__.___.__)____.__) '];
  for (let c = 0; c < 4; c++) {
    const cx = ((c * 24 - cloudShift) % 96 + 96) % 96 - 16;
    canvas.sprite(cx, 0 + (c % 2), cLines, 'muted');
  }

  // Warm streetlamp at x=21
  canvas.sprite(
    20,
    6,
    [
      ' .-. ',
      '( * )',
      " '-' ",
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      '  |  ',
      ' _|_ ',
    ],
    'dim'
  );
  canvas.set(22, 7, '*', 'gold');

  // Soft amber streetlamp cone
  for (let r = 9; r <= 19; r++) {
    const spread = Math.floor((r - 8) * 0.72);
    for (let dx = -spread; dx <= spread; dx += 2) {
      if ((r + dx) % 3 === 0) canvas.set(22 + dx, r, '·', 'dim');
    }
  }

  // Park bench & lonely huddled figure
  canvas.sprite(30, 17, ['___________', '|=========|', '|         |'], 'muted');
  drawPerson(canvas, 33, 14, { pose: 'sitHunched', color: 'blue' });

  // Act III & IV: A second figure walks in from the right holding an umbrella!
  const arrived = frame >= 292;
  let helperX = 76;
  if (frame >= 205) {
    const walkT = easeInOut((frame - 205) / 87);
    helperX = Math.round(lerp(74, 37, walkT));

    // Umbrella canopy shields above the helper (and over both figures once arrived!)
    const umbX = helperX - 4;
    canvas.sprite(
      umbX,
      11,
      ['  .-------.  ', " /  '   '  \\ ", '-----+-------'],
      'gold'
    );
    canvas.line(helperX + 1, 14, helperX + 1, 16, '|', 'gold');

    if (!arrived) {
      drawPerson(canvas, helperX, 15, { pose: 'walk', color: 'gold', legPhase: Math.floor(frame / 6) });
    } else {
      // Standing close beside the bench, sharing shelter & warmth
      drawPerson(canvas, 38, 15, { pose: 'stand', color: 'gold' });
      canvas.set(36, 14, '♥', 'rose');
    }
  }

  // Slanted falling rain (blocked directly beneath the umbrella!)
  const rainCount = arrived ? 46 : frame >= 90 ? 84 : 44;
  const speed = arrived ? 0.65 : 0.92;
  const umbLeft = helperX - 4;
  const umbRight = helperX + 8;

  for (let i = 0; i < rainCount; i++) {
    const rx = (hash01(i * 13 + 3) * 84 - frame * 0.3 + 800) % 80;
    const ry = ((hash01(i * 19 + 7) * 18 + frame * speed) % 18) + 3;
    if (frame >= 205 && rx >= umbLeft && rx <= umbRight && ry >= 12) {
      continue; // Sheltered under the umbrella!
    }
    if (ry >= 3 && ry < 20) {
      canvas.set(rx, ry, i % 3 === 0 ? '|' : '/', i % 4 === 0 ? 'bright' : 'blue');
    }
  }

  // Wet ground, streetlamp puddle reflections & ripples
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, '_', 'dim');
  }
  const reflectShift = Math.floor(frame / 5) % 2 === 0;
  canvas.text(21, 21, reflectShift ? ': * :' : '. : .', 'gold');
  canvas.text(21, 22, reflectShift ? '·   ·' : '  :  ', 'dim');
  for (let p = 0; p < (arrived ? 6 : 12); p++) {
    const px = Math.floor(hash01(p * 29 + 11) * 74) + 3;
    const phase = (frame + p * 7) % 18;
    if (phase < 6) canvas.set(px, 21, 'o', 'blue');
    else if (phase < 12) canvas.text(px - 1, 21, '( )', 'blue');
    else canvas.text(px - 2, 21, '~   ~', 'dim');
  }

  // Single warm star breaks through in Act IV
  if (arrived) {
    canvas.set(58, 4, '✦', 'gold');
    canvas.line(58, 5, 42, 13, '.', 'dim');
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some nights, the silence feels too heavy...', color: 'muted' },
    { at: 100, text: 'Sitting in the rain, wondering if anyone hears...', color: 'blue' },
    { at: 216, text: 'Then footsteps draw near through the storm...', color: 'gold' },
    { at: 308, text: 'You do not have to carry the rain alone.', color: 'bright' },
  ]);
}

/* ============================================================================
 * 4. MISSING SOMEONE — Paper plane crossing a moonlit ocean into open hands
 * ========================================================================== */
function renderMissing(canvas, frame) {
  drawStars(canvas, frame, 54, 14, 'star');

  // Giant crescent moon centered high in the sky
  canvas.sprite(36, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Shimmering moonlit ocean between two cliffs
  for (let x = 16; x < 64; x++) {
    const wave = (x + Math.floor(frame / 6)) % 6 === 0 ? '~' : '-';
    canvas.set(x, 19, wave, 'dim');
    if ((x + Math.floor(frame / 8)) % 9 === 0) {
      canvas.set(x, 21, '·', 'violet');
    }
  }

  // Left cliff & Figure A
  canvas.fillRect(0, 17, 16, 6, '#', 'dim');
  canvas.text(0, 17, '_______________', 'muted');
  const sendPose = frame >= 150 && frame <= 210 ? 'wave' : frame >= 312 ? 'wave' : 'stand';
  drawPerson(canvas, 11, 14, { pose: sendPose, color: 'violet' });

  // Right cliff & Figure B
  canvas.fillRect(64, 17, 16, 6, '#', 'dim');
  canvas.text(64, 17, '_______________', 'muted');
  const received = frame >= 280;
  drawPerson(canvas, 66, 14, { pose: received ? 'wave' : 'stand', color: 'rose' });

  // Act I & II: Distant heartbeats / wishes pulsing on opposite shores
  if (frame < 168) {
    const pulseA = Math.sin(frame * 0.24) > 0.25;
    const pulseB = Math.sin(frame * 0.24 + Math.PI) > 0.25;
    if (pulseA) canvas.text(12, 12, '✦', 'violet');
    if (pulseB) canvas.text(67, 12, '✦', 'rose');
  }

  // Act II-III: Glowing ASCII paper airplane arcs across the dark ocean
  if (frame >= 148 && frame <= 284) {
    const t = easeInOut((frame - 148) / 132);
    const px = lerp(15, 64, t);
    const py = 13 - Math.sin(t * Math.PI) * 6.5;

    for (let k = 1; k <= 16; k++) {
      const bt = clamp(t - k * 0.02, 0, 1);
      if (bt <= 0) continue;
      const tx = lerp(15, 64, bt);
      const ty = 13 - Math.sin(bt * Math.PI) * 6.5;
      canvas.set(tx, ty, k % 2 === 0 ? '·' : '.', k < 5 ? 'bright' : 'violet');
    }
    canvas.text(px - 2, py, '>==>', 'bright');
  }

  // Act IV: A luminous bridge of stars connects both cliffs
  if (received) {
    const bridgeT = clamp((frame - 280) / 48, 0, 1);
    const span = Math.floor(lerp(0, 48, bridgeT));
    for (let i = 0; i < span; i++) {
      const bx = 63 - i;
      const by = 16 + Math.round(Math.sin((i / 48) * Math.PI) * -1.4);
      canvas.set(bx, by, i % 3 === 0 ? '✦' : '·', i % 2 === 0 ? 'violet' : 'rose');
    }
    if (Math.floor(frame / 10) % 2 === 0) {
      canvas.text(12, 12, '♥', 'bright');
      canvas.text(67, 12, '♥', 'bright');
    } else {
      canvas.text(12, 12, '✦', 'violet');
      canvas.text(67, 12, '✦', 'rose');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Same moon. Different skies.', color: 'muted' },
    { at: 96, text: 'I folded every unspoken thought into a wish...', color: 'violet' },
    { at: 204, text: 'Sending a piece of my heart across the dark...', color: 'bright' },
    { at: 312, text: 'Distance only proves how far love travels.', color: 'rose' },
  ]);
}

/* ============================================================================
 * 5. FRIENDSHIP — Arrival with music, roaring campfire, high-five & sparklers
 * ========================================================================== */
function renderFriendship(canvas, frame) {
  drawStars(canvas, frame, 44, 12, 'star');

  // Crescent moon over the pines
  canvas.sprite(66, 1, ['  _.._  ', ' /    \\ ', '|   ((  ', ' \\    / ', '  `--`  '], 'gold');

  // Flanking pine silhouettes
  const treeXs = [2, 10, 62, 70];
  for (const tx of treeXs) {
    canvas.sprite(
      tx,
      10,
      ['   /\\   ', '  /  \\  ', ' /____\\ ', '  /  \\  ', ' /____\\ ', '   ||   '],
      'green'
    );
  }

  // Forest clearing ground
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 20, x % 5 === 0 ? ',' : '_', 'muted');
  }

  // Campfire grows from spark in Act I to roaring warm blaze
  const fireLevel = clamp((frame - 20) / 68, 0.15, 1);
  if (fireLevel < 0.5) {
    canvas.sprite(36, 17, ['  .^*  ', '=======', ' \\___/ '], 'orange');
  } else {
    const fIdx = Math.floor(frame / 4) % 3;
    const flames = [
      ['   (   ', '  /^\\  ', ' ( * ) ', '=======', ' \\___/ '],
      ['   )   ', '  /^\\  ', ' (* ^) ', '=======', ' \\___/ '],
      ['  ( )  ', ' /^ ^\\ ', ' ( * ) ', '=======', ' \\___/ '],
    ];
    canvas.sprite(36, 15, flames[fIdx], 'orange');
    canvas.set(39, 17, '*', 'bright');
  }

  // Rising campfire embers
  const emberCount = frame >= 96 ? 18 : 7;
  for (let i = 0; i < emberCount; i++) {
    const age = (frame + i * 7) % 34;
    const ey = 15 - age * 0.42;
    const ex = 39 + Math.sin(age * 0.45 + i) * 4.5;
    if (ey > 2) {
      canvas.set(ex, ey, age < 12 ? '*' : '·', age < 10 ? 'gold' : 'orange');
    }
  }

  // Friend A sits on the left log & waves as Friend B walks in during Act II
  const arrived = frame >= 156;
  const highFive = frame >= 216 && frame < 306;
  const toast = frame >= 306;

  if (!arrived) {
    // Friend A waiting by the fire, waves when B approaches
    drawPerson(canvas, 27, 16, { pose: frame >= 104 ? 'wave' : 'stand', color: 'cyan' });
    // Friend B walks in from right carrying music!
    const walkT = easeInOut((frame - 80) / 76);
    const bx = Math.round(lerp(68, 50, walkT));
    drawPerson(canvas, bx, 16, {
      pose: frame >= 80 ? 'walk' : 'stand',
      color: 'gold',
      legPhase: Math.floor(frame / 5),
    });
    if (frame >= 96) {
      canvas.set(bx + 1, 14 - (Math.floor(frame / 6) % 2), '♪', 'gold');
    }
  } else if (highFive) {
    // Both step close & raise hands for an unmistakable high-five / fist bump!
    const bumpT = easeInOut((frame - 216) / 42);
    const ax = Math.round(lerp(28, 35, bumpT));
    const bx = Math.round(lerp(50, 42, bumpT));
    canvas.sprite(ax, 14, [' o/', '/| ', '/ \\'], 'cyan');
    canvas.sprite(bx, 14, ['\\o ', ' |\\', '/ \\'], 'gold');
    if (bumpT >= 0.9) {
      const burst = Math.floor(frame / 5) % 2 === 0;
      canvas.text(38, 12, burst ? '✦✦✦' : ' * ', 'bright');
      canvas.text(36, 11, burst ? '\\   /' : '  ✦  ', 'gold');
    }
  } else if (!toast) {
    // Strumming guitar & singing around the warm fire
    const sway = Math.floor(frame / 14) % 2 === 0;
    canvas.sprite(27, 16, [' o ', sway ? '/|>' : '/|\\', ' _|'], 'cyan');
    canvas.sprite(50, 16, [' o ', sway ? '<|\\' : '/|\\', '|_ '], 'gold');
    canvas.text(26, 19, '===', 'dim');
    canvas.text(50, 19, '===', 'dim');
    const nY = 13 - (Math.floor(frame / 6) % 3);
    canvas.text(31, nY, '♪', 'cyan');
    canvas.text(46, nY - 1, '♫', 'gold');
  } else {
    // Act IV: Side-by-side celebratory toast & swirling golden fireflies
    canvas.sprite(29, 16, ['\\o ', ' |\\', '/ \\'], 'cyan');
    canvas.sprite(48, 16, [' o/', '/| ', '/ \\'], 'gold');
    canvas.text(32, 16, '[_]P', 'gold');
    canvas.text(43, 16, 'q[_]', 'cyan');
    if (Math.floor(frame / 8) % 2 === 0) {
      canvas.text(36, 11, '✦  ♥  ✦', 'bright');
    }
  }

  // Shooting star in Act III & fireflies across the woods
  if (frame >= 240 && frame < 268) {
    const k = frame - 240;
    canvas.set(16 + k * 1.8, 3 + k * 0.25, '★', 'bright');
    canvas.set(14 + k * 1.8, 2.7 + k * 0.25, '*', 'gold');
  }
  if (frame >= 64) {
    for (let i = 0; i < 16; i++) {
      const fx = 5 + hash01(i * 5 + 1) * 70 + Math.sin(frame * 0.06 + i) * 4;
      const fy = 5 + hash01(i * 9 + 3) * 13 + Math.cos(frame * 0.08 + i) * 2;
      if (Math.sin(frame * 0.22 + i * 2) > 0) {
        canvas.set(fx, fy, '*', i % 2 === 0 ? 'green' : 'gold');
      }
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Even on the quietest nights, you know who to call...', color: 'muted' },
    { at: 96, text: 'Bad jokes, midnight songs, and a fire that never fades...', color: 'orange' },
    { at: 210, text: 'Through every high, every storm, every crazy chapter...', color: 'gold' },
    { at: 316, text: "☀  Some friends aren't just friends — they're family  ☀", color: 'bright' },
  ]);
}

/* ============================================================================
 * 6. MOTIVATION — Stormy ascent to a summit flag and blazing sunrise
 * ========================================================================== */
function renderMotivation(canvas, frame) {
  const dawnT = clamp((frame - 255) / 96, 0, 1);
  if (dawnT < 0.78) {
    drawStars(canvas, frame, Math.floor(42 * (1 - dawnT)), 11, 'dim');
  }

  // Wind streaks during the hard climb in Act I & II
  if (frame < 210) {
    for (let i = 0; i < 10; i++) {
      const wx = ((80 - (frame * 1.4 + i * 17)) % 80 + 80) % 80;
      const wy = 3 + (i * 2) % 12;
      canvas.text(wx, wy, '~-', 'dim');
    }
  }

  // Multi-layer parallax mountain ridges + main peak rising to (46, 9)
  const farRidgeY = (x) => Math.round(16 - Math.sin(x * 0.09 + 1.2) * 3.2 - Math.cos(x * 0.21) * 1.1);
  for (let x = 0; x < canvas.cols; x++) {
    const fy = clamp(farRidgeY(x), 9, 21);
    canvas.set(x, fy, '^', 'dim');
  }

  const ridgeY = (x) => {
    if (x < 46) return Math.round(21 - (x / 46) * 12 + Math.sin(x * 0.45) * 0.6);
    return Math.round(9 + ((x - 46) / 34) * 12 + Math.cos(x * 0.4) * 0.6);
  };

  for (let x = 0; x < canvas.cols; x++) {
    const ry = clamp(ridgeY(x), 8, 22);
    const slopeCh = x < 45 ? '/' : x > 47 ? '\\' : '^';
    canvas.set(x, ry, slopeCh, dawnT > 0.3 ? 'orange' : 'muted');
    for (let y = ry + 1; y < 22; y++) {
      canvas.set(x, y, (x + y) % 7 === 0 ? '^' : ':', 'dim');
    }
  }

  // Climber ascends along ridge in Acts I-II
  const climbT = easeInOut(frame / 205);
  const cx = Math.round(lerp(6, 45, climbT));
  const cy = clamp(ridgeY(cx) - 3, 5, 19);
  const reached = climbT >= 0.99;

  if (!reached) {
    drawPerson(canvas, cx, cy, { pose: 'walk', color: 'bright', legPhase: Math.floor(frame / 5) });
    canvas.set(cx + 3, cy + 1, '*', 'gold');
  } else {
    canvas.sprite(44, 6, [' \\o/ ', '  |  ', ' / \\ '], 'bright');
    const flutter = Math.floor(frame / 6) % 2 === 0 ? '|>>>' : '|~>>';
    canvas.sprite(49, 5, [flutter, '|  ', '|  '], 'orange');
  }

  // Rising blazing sunrise in Act IV
  if (frame >= 265) {
    const sunT = easeInOut((frame - 265) / 88);
    const sunY = Math.round(lerp(17, 5, sunT));
    const sunX = 63;

    const rayAngles = [-2.55, -2.05, -1.57, -1.08, -0.58, 0.18, 2.9];
    for (let i = 0; i < rayAngles.length; i++) {
      const ang = rayAngles[i] + Math.sin(frame * 0.05) * 0.05;
      const len = lerp(4, 22, sunT);
      for (let step = 4; step < len; step += 2) {
        const bx = Math.round(sunX + Math.cos(ang) * step * 1.6);
        const by = Math.round(sunY + Math.sin(ang) * step * 0.7);
        if (by >= 0 && by < ridgeY(clamp(bx, 0, 79))) {
          canvas.set(bx, by, step % 4 === 0 ? '·' : '-', 'gold');
        }
      }
      const rx = sunX + Math.cos(ang) * len * 1.6;
      const ry = sunY + Math.sin(ang) * len * 0.7;
      if (ry >= 0 && ry < 13) canvas.set(rx, ry, '✦', 'bright');
    }

    canvas.sprite(sunX - 3, sunY - 2, [' .---. ', '/  O  \\', '|     |', '\\     /', " '---' "], 'gold');
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Every step in the dark feels like the hardest one...', color: 'muted' },
    { at: 110, text: 'Hold your lantern steady. Keep climbing...', color: 'orange' },
    { at: 210, text: 'You made it to the summit!', color: 'gold' },
    { at: 295, text: '▲  Look how bright your horizon is now  ▲', color: 'bright' },
  ]);
}

/* ============================================================================
 * 7. GRATITUDE — Golden sky lanterns rising from grateful hands
 * ========================================================================== */
function renderGratitude(canvas, frame) {
  drawStars(canvas, frame, 48, 15, 'star');

  // Calm riverside silhouette
  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 19, '_', 'muted');
    if ((x + Math.floor(frame / 10)) % 11 === 0) {
      canvas.set(x, 21, '~', 'gold');
    }
  }

  // Two figures releasing lanterns together
  const released = frame >= 96;
  drawPerson(canvas, 33, 16, { pose: released ? 'cheer' : 'stand', color: 'gold' });
  drawPerson(canvas, 44, 16, { pose: released ? 'cheer' : 'stand', color: 'rose' });

  // First hero lantern rising gently from their hands
  if (frame >= 84) {
    const heroT = clamp((frame - 84) / 140, 0, 1);
    const lx = 38 + Math.sin(frame * 0.07) * 2;
    const ly = Math.round(lerp(14, 3, easeInOut(heroT)));
    canvas.sprite(lx, ly, [' .-. ', ' |*| ', " '-' "], 'gold');
  }

  // Sky fills with warm floating lanterns in Acts III & IV
  if (frame >= 168) {
    const count = frame >= 280 ? 14 : 7;
    for (let i = 0; i < count; i++) {
      const startX = 6 + hash01(i * 19 + 4) * 68;
      const speed = 0.09 + hash01(i * 7 + 2) * 0.08;
      const ly = ((18 - ((frame - 168) * speed + i * 3)) % 18 + 18) % 18;
      const lx = startX + Math.sin(frame * 0.05 + i) * 2.2;
      canvas.sprite(lx, ly, ['[✦]', "'-'"], i % 3 === 0 ? 'rose' : 'gold');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Some kindness stays with us forever...', color: 'muted' },
    { at: 96, text: 'Lighting a small lantern for all you did...', color: 'gold' },
    { at: 204, text: 'One thank you turns into a sky full of light...', color: 'rose' },
    { at: 312, text: '❖  Grateful for every moment with you  ❖', color: 'bright' },
  ]);
}

/* ============================================================================
 * 8. APOLOGY — Fractured heart mending in gold (Kintsugi) as two hands reach
 * ========================================================================== */
function renderApology(canvas, frame) {
  drawStars(canvas, frame, 38, 13, 'dim');

  for (let x = 0; x < canvas.cols; x++) {
    canvas.set(x, 19, '_', 'muted');
  }

  // Two figures: start distant, Sender steps forward holding an offering in Act II,
  // Receiver turns and meets in Act III-IV
  const approachT = easeInOut((frame - 108) / 100);
  const meetT = easeInOut((frame - 220) / 92);
  const leftX = Math.round(lerp(14, 30, approachT) + lerp(0, 6, meetT));
  const rightX = Math.round(lerp(63, 42, meetT));

  const leftPose = frame < 108 ? 'stand' : approachT < 0.99 ? 'walk' : frame >= 216 ? 'reachRight' : 'wave';
  const rightPose = frame < 220 ? 'stand' : meetT < 0.99 ? 'walk' : 'reachLeft';

  drawPerson(canvas, leftX, 16, { pose: leftPose, color: 'cyan', legPhase: Math.floor(frame / 7) });
  drawPerson(canvas, rightX, 16, { pose: rightPose, color: 'rose', legPhase: Math.floor(frame / 7) + 1 });

  // Small offering flower held by sender during Act II before the heart mends
  if (frame >= 115 && frame < 240) {
    canvas.text(leftX + 3, 17, '-❀', 'gold');
  }

  // Giant Kintsugi ASCII Heart in the sky: split apart in Act I-II, mends in gold in Act III-IV!
  const leftHeart = [
    '  .:::. ',
    ' :::::::',
    ' :::::::',
    " '::::::",
    "   '::::",
    "     '::",
    "       '",
  ];
  const rightHeart = [
    '  .:::.  ',
    '.::::::: ',
    ':::::::: ',
    ":::::::' ",
    ":::::'   ",
    ":::'     ",
    ":'       ",
  ];

  const mendT = easeInOut((frame - 205) / 86);
  const gap = Math.round(lerp(8, 0, mendT));
  const heartY = 4;

  canvas.sprite(31 - Math.floor(gap / 2), heartY, leftHeart, mendT > 0.85 ? 'rose' : 'muted');
  canvas.sprite(39 + Math.ceil(gap / 2), heartY, rightHeart, mendT > 0.85 ? 'rose' : 'muted');

  // Jagged crack sparks while separated
  if (gap > 1 && Math.floor(frame / 6) % 2 === 0) {
    canvas.text(38, heartY + 2, '/', 'dim');
    canvas.text(39, heartY + 3, '\\', 'dim');
    canvas.text(38, heartY + 4, '/', 'dim');
  }

  // Golden kintsugi repair seam glowing once the two halves meet!
  if (mendT >= 0.88) {
    const seamGlow = Math.floor(frame / 8) % 2 === 0 ? 'gold' : 'bright';
    canvas.set(39, heartY + 1, '✦', seamGlow);
    canvas.set(38, heartY + 2, '/', 'gold');
    canvas.set(39, heartY + 3, '\\', 'gold');
    canvas.set(39, heartY + 4, '✦', seamGlow);
    canvas.set(39, heartY + 5, '|', 'gold');
  }

  // Soft healing petals floating down in Act III & IV
  if (frame >= 225) {
    for (let i = 0; i < 12; i++) {
      const px = 22 + hash01(i * 13 + 5) * 36 + Math.sin(frame * 0.06 + i) * 2;
      const py = ((frame * 0.22 + i * 4) % 14) + 3;
      canvas.set(px, py, i % 2 === 0 ? '✿' : '·', i % 3 === 0 ? 'gold' : 'cyan');
    }
  }

  drawCaption(canvas, frame, [
    { at: 0, text: 'Silence hurts most when you know you caused the crack...', color: 'muted' },
    { at: 108, text: "I'm not here with excuses — just an honest heart...", color: 'cyan' },
    { at: 216, text: 'Some cracks heal in gold when both hands reach...', color: 'gold' },
    { at: 312, text: "❀  I'm truly sorry. Thank you for hearing me  ❀", color: 'bright' },
  ]);
}

const SCENE_RENDERERS = {
  love: renderLove,
  happiness: renderHappiness,
  sadness: renderSadness,
  missing: renderMissing,
  friendship: renderFriendship,
  motivation: renderMotivation,
  gratitude: renderGratitude,
  apology: renderApology,
};

export function renderSceneFrame(emotion, frame, totalFrames = 408, canvas = new AsciiCanvas(CANVAS_COLS, CANVAS_ROWS)) {
  canvas.clear();
  const renderer = SCENE_RENDERERS[emotion];
  if (!renderer) {
    throw new Error(`No ASCII scene renderer defined for emotion "${emotion}".`);
  }
  renderer(canvas, frame, totalFrames);
  return canvas;
}

/**
 * Renders the Time Capsule hourglass countdown terminal screen.
 */
export function renderTimeCapsule(canvas, frame, remainingMs) {
  canvas.clear();
  drawStars(canvas, frame, 52, 22, 'star');

  // Animated hourglass in center
  const dropPhase = frame % 8;
  const sandStream = dropPhase < 4 ? ':' : '·';
  canvas.sprite(
    30,
    2,
    [
      ' .==================. ',
      ' | \\  .::::::::.  / | ',
      ' |  \\   ::::::   /  | ',
      ' |   \\   `::\'   /   | ',
      ` |    )   ${sandStream}    (    | `,
      ` |   /    ${dropPhase % 2 === 0 ? '·' : ':'}     \\   | `,
      ' |  /   .::::.   \\  | ',
      ' | /  .::::::::.  \\ | ',
      " '==================' ",
    ],
    'gold'
  );
  // Shimmering falling sand grain
  canvas.set(40, 6 + (frame % 3), '·', 'bright');

  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const days = Math.floor(totalSec / 86400);
  const hrs = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  const clockStr = `UNLOCKS IN  ${pad(days)}d : ${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`;

  const boxW = 44;
  const bx = Math.floor((canvas.cols - boxW) / 2);
  canvas.text(bx, 14, '+' + '-'.repeat(boxW - 2) + '+', 'cyan');
  canvas.text(bx, 15, '|' + ' '.repeat(boxW - 2) + '|', 'cyan');
  canvas.text(bx, 16, '|' + ' '.repeat(boxW - 2) + '|', 'cyan');
  canvas.text(bx, 17, '+' + '-'.repeat(boxW - 2) + '+', 'cyan');

  const tx = Math.floor((canvas.cols - clockStr.length) / 2);
  canvas.text(tx, 15, clockStr, 'bright');
  const sub = 'TIME CAPSULE SEALED · WAITING FOR MOMENT';
  canvas.text(Math.floor((canvas.cols - sub.length) / 2), 16, sub, 'muted');

  drawCaption(canvas, frame % 160, [
    { at: 0, text: 'Patience... some feelings are meant for an exact hour.', color: 'gold' },
  ]);
  return canvas;
}

function wrapLines(text, maxWidth = 58, maxLines = 6) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!w) continue;
    if ((cur + ' ' + w).trim().length <= maxWidth) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w.slice(0, maxWidth);
    }
    if (lines.length >= maxLines) break;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  return lines;
}

/**
 * Renders the Burn After Reading ASCII ash-dissolution animation.
 */
export function renderBurnAsh(canvas, frame, message, { alreadyBurned = false } = {}) {
  canvas.clear();

  if (alreadyBurned) {
    for (let i = 0; i < 28; i++) {
      const ax = (hash01(i * 11 + 2) * 78 + Math.sin(frame * 0.05 + i) * 2 + 80) % 80;
      const ay = ((22 - (frame * 0.14 + hash01(i * 17) * 22)) % 22 + 22) % 22;
      canvas.set(ax, ay, i % 3 === 0 ? '·' : '.', 'dim');
    }
    const msg1 = '[ ASHES ONLY ]';
    const msg2 = 'This one-time message was already unlocked and burned.';
    canvas.text(Math.floor((canvas.cols - msg1.length) / 2), 10, msg1, 'orange');
    canvas.text(Math.floor((canvas.cols - msg2.length) / 2), 12, msg2, 'muted');
    return canvas;
  }

  const lines = wrapLines(message, 58, 6);
  const startY = Math.max(4, Math.floor((18 - lines.length) / 2));
  const progress = clamp(frame / 86, 0, 1);

  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    const startX = Math.floor((canvas.cols - line.length) / 2);
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === ' ') continue;
      const burnThreshold = hash01(r * 97 + c * 31 + 5) * 0.72 + (Math.abs(c - line.length / 2) / Math.max(1, line.length)) * 0.25;
      const delta = progress - burnThreshold;

      if (delta < -0.08) {
        canvas.set(startX + c, startY + r, ch, 'white');
      } else if (delta < 0.04) {
        canvas.set(startX + c, startY + r, '*', 'bright');
      } else if (delta < 0.16) {
        canvas.set(startX + c, startY + r, '~', 'orange');
      } else {
        // Drifting ash particle rising upward!
        const driftAge = (delta - 0.16) * 28;
        const ay = startY + r - driftAge * 0.65;
        const ax = startX + c + Math.sin(driftAge * 0.6 + c) * 1.4;
        if (ay >= 0) {
          canvas.set(ax, ay, driftAge < 4 ? ':' : driftAge < 9 ? '·' : '.', driftAge < 4 ? 'gold' : 'dim');
        }
      }
    }
  }

  if (frame >= 80) {
    const notice = '// THIS MESSAGE HAS TURNED TO ASH';
    canvas.text(Math.floor((canvas.cols - notice.length) / 2), 12, notice, 'orange');
    const sub = 'Gone from this terminal forever.';
    canvas.text(Math.floor((canvas.cols - sub.length) / 2), 14, sub, 'muted');
  } else {
    const status = '🔥 BURNING AFTER READING...';
    canvas.text(Math.floor((canvas.cols - status.length) / 2), 21, status, 'orange');
  }

  return canvas;
}
