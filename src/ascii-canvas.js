/**
 * Lightweight 2D character & color-class buffer for 24fps terminal animations.
 */
export class AsciiCanvas {
  constructor(cols = 80, rows = 24) {
    this.cols = cols;
    this.rows = rows;
    this.size = cols * rows;
    this.chars = new Array(this.size).fill(' ');
    this.colors = new Array(this.size).fill('');
  }

  clear() {
    this.chars.fill(' ');
    this.colors.fill('');
  }

  set(x, y, ch, color = '') {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= this.cols || iy < 0 || iy >= this.rows) return;
    const idx = iy * this.cols + ix;
    this.chars[idx] = ch;
    this.colors[idx] = color;
  }

  text(x, y, str, color = '', { transparentSpace = true } = {}) {
    const iy = Math.round(y);
    if (iy < 0 || iy >= this.rows) return;
    const startX = Math.round(x);
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (transparentSpace && ch === ' ') continue;
      const ix = startX + i;
      if (ix < 0 || ix >= this.cols) continue;
      const idx = iy * this.cols + ix;
      this.chars[idx] = ch;
      this.colors[idx] = color;
    }
  }

  sprite(x, y, lines, color = '') {
    for (let r = 0; r < lines.length; r++) {
      this.text(x, y + r, lines[r], color, { transparentSpace: true });
    }
  }

  fillRect(x, y, w, h, ch, color = '') {
    const x0 = Math.round(x);
    const y0 = Math.round(y);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        this.set(x0 + c, y0 + r, ch, color);
      }
    }
  }

  line(x0, y0, x1, y1, ch, color = '') {
    let ix0 = Math.round(x0);
    let iy0 = Math.round(y0);
    const ix1 = Math.round(x1);
    const iy1 = Math.round(y1);
    const dx = Math.abs(ix1 - ix0);
    const dy = -Math.abs(iy1 - iy0);
    const sx = ix0 < ix1 ? 1 : -1;
    const sy = iy0 < iy1 ? 1 : -1;
    let err = dx + dy;

    while (true) {
      this.set(ix0, iy0, ch, color);
      if (ix0 === ix1 && iy0 === iy1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        ix0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        iy0 += sy;
      }
    }
  }

  toLines() {
    const out = [];
    for (let r = 0; r < this.rows; r++) {
      const offset = r * this.cols;
      out.push(this.chars.slice(offset, offset + this.cols).join(''));
    }
    return out;
  }

  toHTML() {
    const rowsHtml = new Array(this.rows);
    for (let r = 0; r < this.rows; r++) {
      const offset = r * this.cols;
      let rowStr = '';
      let runColor = this.colors[offset];
      let runText = '';

      for (let c = 0; c < this.cols; c++) {
        const ch = this.chars[offset + c];
        const color = this.colors[offset + c];
        if (color !== runColor) {
          rowStr += formatRun(runText, runColor);
          runColor = color;
          runText = ch;
        } else {
          runText += ch;
        }
      }
      rowStr += formatRun(runText, runColor);
      rowsHtml[r] = rowStr;
    }
    return rowsHtml.join('\n');
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatRun(text, color) {
  if (!text) return '';
  const escaped = escapeHtml(text);
  return color ? `<span class="c-${color}">${escaped}</span>` : escaped;
}
