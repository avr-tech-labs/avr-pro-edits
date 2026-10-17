/* ============================================
   PRO'S EDITS — v10.0 by AVR TECH LABS
   80+ Tools · Resizable Crop · 20+ Text Styles
   ============================================ */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('hide');
    showToast("PRO'S EDITS · AVR TECH LABS 🚀");
  }, 3200);
});

const state = {
  filters: {
    exposure: 0, brightness: 100, contrast: 100, highlights: 0, shadows: 0, whites: 0, blacks: 0,
    saturation: 100, vibrance: 0, temperature: 0, tint: 0, hue: 0, sepia: 0, grayscale: 0, invert: 0,
    sharpness: 0, clarity: 0, texture: 0, dehaze: 0, structure: 0, blur: 0, grain: 0,
    skin: 0, teeth: 0, eyes: 0, faceSlim: 0, glow: 0,
    vignette: 0, flare: 0, bokeh: 0, glowEffect: 0, lightLeak: 0,
    gamma: 100, blackPoint: 0, whitePoint: 255,
    hslR: 0, hslG: 0, hslB: 0, hslC: 0, hslM: 0, hslY: 0, hslLum: 0
  },
  currentFilter: 'original',
  rotation: 0,
  flipH: false, flipV: false,
  history: [], historyIndex: -1,
  currentTool: 'adjust',
  curvePoints: [{x: 0, y: 1}, {x: 1, y: 0}],
  perspective: { tl: 0, tr: 0, bl: 0, br: 0 },
  compareMode: false,
  drawColor: '#ff0066',
  drawSize: 15,
  selectedTextStyle: 'neon'
};

const FILTERS = {
  original: { css: '', cat: 'all' },
  cinematic: { css: 'contrast(1.2) saturate(1.1) hue-rotate(-10deg)', cat: 'cinematic' },
  teal: { css: 'contrast(1.15) saturate(1.1) hue-rotate(-15deg)', cat: 'cinematic' },
  netflix: { css: 'contrast(1.2) saturate(1.1) brightness(0.92) hue-rotate(-5deg)', cat: 'cinematic' },
  moody: { css: 'contrast(1.25) brightness(0.85) saturate(0.85)', cat: 'cinematic' },
  blockbuster: { css: 'contrast(1.3) saturate(1.15) hue-rotate(-10deg) brightness(0.95)', cat: 'cinematic' },
  matrix: { css: 'contrast(1.2) hue-rotate(80deg) saturate(0.9)', cat: 'cinematic' },
  vintage: { css: 'sepia(0.4) contrast(1.1) brightness(0.95)', cat: 'vintage' },
  retro: { css: 'sepia(0.6) contrast(1.15) saturate(0.8)', cat: 'vintage' },
  polaroid: { css: 'sepia(0.25) contrast(1.15) brightness(1.05)', cat: 'vintage' },
  faded: { css: 'contrast(0.85) brightness(1.1) saturate(0.7) sepia(0.15)', cat: 'vintage' },
  kodak: { css: 'saturate(1.3) contrast(1.1) sepia(0.15)', cat: 'vintage' },
  lomo: { css: 'contrast(1.3) saturate(1.5) hue-rotate(-5deg)', cat: 'vintage' },
  vivid: { css: 'saturate(1.8) contrast(1.2)', cat: 'modern' },
  hdr: { css: 'contrast(1.3) saturate(1.4) brightness(1.05)', cat: 'modern' },
  dramatic: { css: 'contrast(1.5) brightness(0.9) saturate(0.8)', cat: 'modern' },
  fresh: { css: 'brightness(1.1) saturate(1.15) contrast(1.05)', cat: 'modern' },
  warm: { css: 'sepia(0.3) saturate(1.5) hue-rotate(-10deg)', cat: 'modern' },
  cool: { css: 'hue-rotate(180deg) saturate(1.2)', cat: 'modern' },
  sunset: { css: 'sepia(0.5) saturate(1.6) hue-rotate(-20deg)', cat: 'modern' },
  cyberpunk: { css: 'hue-rotate(280deg) saturate(1.8) contrast(1.2)', cat: 'modern' },
  bw: { css: 'grayscale(1) contrast(1.2)', cat: 'bw' },
  noir: { css: 'grayscale(1) contrast(1.5) brightness(0.9)', cat: 'bw' },
  highKey: { css: 'grayscale(1) brightness(1.3) contrast(0.9)', cat: 'bw' },
  lowKey: { css: 'grayscale(1) brightness(0.7) contrast(1.4)', cat: 'bw' },
  silvertone: { css: 'grayscale(0.9) contrast(1.1) sepia(0.15)', cat: 'bw' },
  neonPink: { css: 'hue-rotate(-60deg) saturate(2) contrast(1.2) brightness(1.1)', cat: 'neon' },
  neonBlue: { css: 'hue-rotate(180deg) saturate(2.5) contrast(1.3)', cat: 'neon' },
  neonPurple: { css: 'hue-rotate(250deg) saturate(2) contrast(1.2)', cat: 'neon' },
  neonGreen: { css: 'hue-rotate(90deg) saturate(2.2) contrast(1.2)', cat: 'neon' },
  neonYellow: { css: 'hue-rotate(30deg) saturate(2) brightness(1.1)', cat: 'neon' },
  forest: { css: 'hue-rotate(30deg) saturate(1.3) brightness(0.95)', cat: 'nature' },
  ocean: { css: 'hue-rotate(190deg) saturate(1.4) brightness(1.05)', cat: 'nature' },
  desert: { css: 'sepia(0.4) saturate(1.3) brightness(1.05)', cat: 'nature' },
  arctic: { css: 'hue-rotate(200deg) saturate(0.8) brightness(1.15)', cat: 'nature' },
  jungle: { css: 'hue-rotate(70deg) saturate(1.4) contrast(1.1)', cat: 'nature' },
  portrait: { css: 'brightness(1.05) saturate(1.1) contrast(1.05)', cat: 'portrait' },
  soft: { css: 'brightness(1.08) saturate(0.95) contrast(0.95)', cat: 'portrait' },
  glamour: { css: 'brightness(1.1) saturate(1.2) contrast(1.1)', cat: 'portrait' },
  beauty: { css: 'brightness(1.05) saturate(1.1) sepia(0.05)', cat: 'portrait' }
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const drawLayer = document.getElementById('drawLayer');
const dctx = drawLayer.getContext('2d');
let originalImage = null;

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function saveHistory() {
  if (!originalImage) return;
  state.history = state.history.slice(0, state.historyIndex + 1);
  try {
    const snap = document.createElement('canvas');
    snap.width = canvas.width; snap.height = canvas.height;
    snap.getContext('2d').drawImage(canvas, 0, 0);
    if (drawLayer.width && drawLayer.style.opacity !== '0') {
      snap.getContext('2d').drawImage(drawLayer, 0, 0, canvas.width, canvas.height);
    }
    state.history.push(snap.toDataURL());
    state.historyIndex++;
    if (state.history.length > 25) { state.history.shift(); state.historyIndex--; }
    updateUndoRedoUI();
  } catch(e) {}
}

function updateUndoRedoUI() {
  const u = document.getElementById('undoBtn');
  const r = document.getElementById('redoBtn');
  if (u) u.disabled = state.historyIndex <= 0;
  if (r) r.disabled = state.historyIndex >= state.history.length - 1;
}

function restoreFromHistory() {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width; canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    updateUndoRedoUI();
  };
  img.src = state.history[state.historyIndex];
}

function doUndo() {
  if (state.historyIndex <= 0) return showToast('Nothing to undo');
  state.historyIndex--; restoreFromHistory(); showToast('Undo ↩️');
}

function doRedo() {
  if (state.historyIndex >= state.history.length - 1) return showToast('Nothing to redo');
  state.historyIndex++; restoreFromHistory(); showToast('Redo ↪️');
}

document.getElementById('undoBtn')?.addEventListener('click', doUndo);
document.getElementById('redoBtn')?.addEventListener('click', doRedo);

function applyFilters() {
  if (!originalImage) return;
  if (state.compareMode) {
    const imgW = originalImage._scaledW || originalImage.width;
    const imgH = originalImage._scaledH || originalImage.height;
    canvas.width = imgW; canvas.height = imgH;
    ctx.clearRect(0, 0, imgW, imgH);
    ctx.drawImage(originalImage, 0, 0, imgW, imgH);
    return;
  }
  const f = state.filters;
  const brightness = f.brightness + (f.exposure * 0.5);
  const filterCss = FILTERS[state.currentFilter]?.css || '';
  const filterStr = `brightness(${brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) hue-rotate(${f.hue}deg) sepia(${f.sepia}%) grayscale(${f.grayscale}%) invert(${f.invert}%) ${filterCss}`.trim();
  const imgW = originalImage._scaledW || originalImage.width;
  const imgH = originalImage._scaledH || originalImage.height;
  const isRotated90 = state.rotation === 90 || state.rotation === 270;
  if (isRotated90) { canvas.width = imgH; canvas.height = imgW; }
  else { canvas.width = imgW; canvas.height = imgH; }
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
  ctx.filter = filterStr;
  ctx.drawImage(originalImage, -imgW / 2, -imgH / 2, imgW, imgH);
  ctx.restore();
  applyPixelEffects();
  applyOverlays();
}

function applyPixelEffects() {
  const f = state.filters;
  const hasCurve = state.curvePoints.length > 2 ||
    state.curvePoints[0].x !== 0 || state.curvePoints[0].y !== 1 ||
    state.curvePoints[1].x !== 1 || state.curvePoints[1].y !== 0;
  const needs = f.highlights || f.shadows || f.whites || f.blacks ||
                f.temperature || f.tint || f.vibrance ||
                f.sharpness || f.clarity || f.texture || f.structure || f.grain ||
                f.dehaze || f.skin || f.teeth || f.eyes ||
                f.hslR || f.hslG || f.hslB || f.hslC || f.hslM || f.hslY || f.hslLum ||
                f.blackPoint || f.whitePoint !== 255 || hasCurve || f.gamma !== 100;
  if (!needs) return;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  const tempR = f.temperature * 0.5, tempB = -f.temperature * 0.5;
  const tintG = -f.tint * 0.5, tintR = f.tint * 0.3, tintB = f.tint * 0.3;
  let lut = null;
  if (hasCurve) {
    lut = new Uint8Array(256);
    const pts = state.curvePoints.slice().sort((a,b) => a.x - b.x);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let y = t;
      for (let p = 0; p < pts.length - 1; p++) {
        if (t >= pts[p].x && t <= pts[p+1].x) {
          const ratio = (t - pts[p].x) / (pts[p+1].x - pts[p].x || 1);
          y = pts[p].y + (pts[p+1].y - pts[p].y) * ratio;
          break;
        }
      }
      lut[i] = Math.max(0, Math.min(255, Math.round((1 - y) * 255)));
    }
  }
  const bp = f.blackPoint, wp = f.whitePoint;
  const gamma = f.gamma / 100;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    r += tempR + tintR; g += tintG; b += tempB + tintB;
    if (bp || wp !== 255) {
      r = ((r - bp) / (wp - bp)) * 255;
      g = ((g - bp) / (wp - bp)) * 255;
      b = ((b - bp) / (wp - bp)) * 255;
    }
    if (gamma !== 1) {
      r = Math.pow(Math.max(0,r)/255, gamma) * 255;
      g = Math.pow(Math.max(0,g)/255, gamma) * 255;
      b = Math.pow(Math.max(0,b)/255, gamma) * 255;
    }
    const lum = 0.299*r + 0.587*g + 0.114*b;
    if (f.highlights && lum > 128) { const a = ((lum-128)/127)*f.highlights*0.8; r+=a; g+=a; b+=a; }
    if (f.shadows && lum < 128) { const a = ((128-lum)/128)*f.shadows*0.8; r+=a; g+=a; b+=a; }
    if (f.whites && lum > 200) { const a = f.whites*0.5; r+=a; g+=a; b+=a; }
    if (f.blacks && lum < 50) { const a = f.blacks*0.5; r+=a; g+=a; b+=a; }
    if (f.vibrance) {
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      const a = (1-(max-min)/255)*f.vibrance*0.5;
      const avg = (r+g+b)/3;
      r += (r-avg)*a/100; g += (g-avg)*a/100; b += (b-avg)*a/100;
    }
    if (f.hslR || f.hslG || f.hslB || f.hslC || f.hslM || f.hslY || f.hslLum) {
      const [h,s,l] = rgbToHsl(r,g,b);
      let ns = s;
      if (h < 30 || h > 330) ns += f.hslR;
      else if (h < 90) ns += f.hslY;
      else if (h < 150) ns += f.hslG;
      else if (h < 210) ns += f.hslC;
      else if (h < 270) ns += f.hslB;
      else ns += f.hslM;
      ns += f.hslLum;
      const [nr, ng, nb] = hslToRgb(h, Math.max(0, Math.min(100, ns)), l);
      r = nr; g = ng; b = nb;
    }
    if (f.skin) { if (r > g && g > b && r > 90 && r - b > 20) { const soft = f.skin / 100; r += 8 * soft; g += 4 * soft; } }
    if (f.teeth) { const max = Math.max(r,g,b), min = Math.min(r,g,b); if (max > 180 && (max-min) < 40) { const boost = f.teeth * 0.25; r += boost; g += boost; b += boost; } }
    if (f.eyes) { if (lum < 70) { const a = f.eyes * 0.15; r+=a; g+=a; b+=a; } }
    if (lut) {
      r = lut[Math.max(0, Math.min(255, Math.round(r)))];
      g = lut[Math.max(0, Math.min(255, Math.round(g)))];
      b = lut[Math.max(0, Math.min(255, Math.round(b)))];
    }
    if (f.grain) { const n = (Math.random()-0.5)*f.grain*0.8; r+=n; g+=n; b+=n; }
    d[i] = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imgData, 0, 0);
  if (f.clarity || f.sharpness || f.texture || f.structure) {
    applySharpen(f.clarity * 0.4 + f.sharpness * 0.4 + f.structure * 0.3 + f.texture * 0.3);
  }
  if (f.dehaze) {
    const imgData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d2 = imgData2.data;
    const k = 1 + f.dehaze / 100;
    for (let i = 0; i < d2.length; i += 4) {
      d2[i] = (d2[i] - 128) * k + 128;
      d2[i+1] = (d2[i+1] - 128) * k + 128;
      d2[i+2] = (d2[i+2] - 128) * k + 128;
    }
    ctx.putImageData(imgData2, 0, 0);
  }
}

function applySharpen(amount) {
  if (amount <= 0) return;
  const w = canvas.width, h = canvas.height;
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  const s = src.data, o = out.data;
  const k = amount / 100;
  const center = 1 + 4 * k;
  const edge = -k;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        let v = s[i+c] * center;
        if (x > 0) v += s[i-4+c] * edge;
        if (x < w-1) v += s[i+4+c] * edge;
        if (y > 0) v += s[i-w*4+c] * edge;
        if (y < h-1) v += s[i+w*4+c] * edge;
        o[i+c] = Math.max(0, Math.min(255, v));
      }
      o[i+3] = s[i+3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

function applyOverlays() {
  const f = state.filters;
  const w = canvas.width, h = canvas.height;
  if (f.vignette > 0) {
    const g = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.3, w/2, h/2, Math.max(w,h)*0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${f.vignette/100})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  if (f.flare > 0) {
    const grad = ctx.createRadialGradient(w*0.8, h*0.2, 0, w*0.8, h*0.2, w*0.5);
    grad.addColorStop(0, `rgba(255,220,150,${f.flare/100*0.6})`);
    grad.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  }
  if (f.glowEffect > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = f.glowEffect / 200;
    ctx.filter = 'blur(15px) brightness(1.2)';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
    ctx.filter = 'none';
  }
  if (f.bokeh > 0) {
    for (let i = 0; i < f.bokeh; i++) {
      const x = Math.random()*w, y = Math.random()*h, r = Math.random()*40+15;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.15)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
  }
  if (f.lightLeak > 0) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, `rgba(255,100,50,${f.lightLeak/200})`);
    g.addColorStop(0.4, 'rgba(255,100,50,0)');
    g.addColorStop(1, `rgba(100,200,255,${f.lightLeak/200})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
}

function rgbToHsl(r, g, b) {
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h*360, s*100, l*100];
}

function hslToRgb(h, s, l) {
  h/=360; s/=100; l/=100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [r*255, g*255, b*255];
}

function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    const MAX_DIM = 1600;
    let w = img.width, h = img.height;
    if (w > MAX_DIM || h > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
      w = Math.round(w * ratio); h = Math.round(h * ratio);
    }
    originalImage._scaledW = w;
    originalImage._scaledH = h;
    Object.keys(state.filters).forEach(k => {
      state.filters[k] = (k === 'brightness' || k === 'contrast' || k === 'saturation' || k === 'gamma' || k === 'whitePoint') ? (k === 'whitePoint' ? 255 : 100) : 0;
    });
    state.currentFilter = 'original';
    state.rotation = 0; state.flipH = false; state.flipV = false;
    state.curvePoints = [{x: 0, y: 1}, {x: 1, y: 0}];
    state.history = []; state.historyIndex = -1;
    canvas.width = w; canvas.height = h;
    applyFilters();
    document.getElementById('dropZone').classList.add('hide');
    setTimeout(() => saveHistory(), 150);
    showToast('Photo loaded! ✨');
  };
  img.src = src;
}

document.querySelectorAll('.bt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    document.querySelectorAll('.bt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentTool = tool;
    openToolPanel(tool);
  });
});

function closePanel() {
  document.getElementById('panel').classList.remove('open');
  document.getElementById('panelOverlay').classList.remove('active');
  if (state.currentTool === 'draw') {
    drawLayer.classList.remove('active');
  }
}

document.getElementById('panelClose')?.addEventListener('click', closePanel);
document.getElementById('panelOverlay')?.addEventListener('click', closePanel);

function openToolPanel(tool) {
  const panel = document.getElementById('panel');
  const title = document.getElementById('panelTitle');
  const tabs = document.getElementById('panelTabs');
  const content = document.getElementById('panelContent');
  const footer = document.getElementById('panelFooter');
  tabs.innerHTML = ''; content.innerHTML = ''; footer.innerHTML = '';
  const panels = buildPanels();
  const config = panels[tool];
  if (!config) return;
  title.textContent = config.title;
  footer.innerHTML = config.footer || '';
  if (config.tabs && config.tabs.length > 0) {
    config.tabs.forEach((tabName, idx) => {
      const t = document.createElement('button');
      t.className = 'ptab' + (idx === 0 ? ' active' : '');
      t.textContent = tabName;
      t.addEventListener('click', () => {
        document.querySelectorAll('.ptab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        content.innerHTML = typeof config.content === 'string' ? config.content : config.content[tabName];
        setTimeout(() => attachPanelHandlers(tool, tabName), 50);
      });
      tabs.appendChild(t);
    });
    tabs.style.display = 'flex';
  } else {
    tabs.style.display = 'none';
  }
  content.innerHTML = typeof config.content === 'string' ? config.content : (config.content[config.tabs ? config.tabs[0] : ''] || '');
  panel.classList.add('open');
  document.getElementById('panelOverlay').classList.add('active');
  setTimeout(() => attachPanelHandlers(tool, config.tabs ? config.tabs[0] : null), 100);
}

function slider(id, label, min, max, suffix = '') {
  const val = state.filters[id] ?? 0;
  return `<div class="slider-group"><label><span>${label}</span><span id="${id}Val">${val}${suffix}</span></label><input type="range" id="${id}" min="${min}" max="${max}" value="${val}"></div>`;
}

const TEXT_STYLES = [
  { id: 'plain', name: 'Plain', cls: '', font: 'Poppins', fill: '#ffffff', shadow: false },
  { id: 'neon', name: 'Neon', cls: 'neon', font: 'Poppins', fill: '#00ffff', shadow: true, glow: '#00ffff' },
  { id: 'gold', name: 'Gold', cls: 'gold', font: 'Poppins', fill: '#d4af37', gradient: true },
  { id: 'fire', name: 'Fire', cls: 'fire', font: 'Poppins', fill: '#ff6600', gradient: true },
  { id: 'ice', name: 'Ice', cls: 'ice', font: 'Poppins', fill: '#a0f0ff', gradient: true },
  { id: 'rainbow', name: 'Rainbow', cls: 'rainbow', font: 'Poppins', fill: '#ff00ff', rainbow: true },
  { id: 'retro', name: 'Retro', cls: 'retro', font: 'Pacifico', fill: '#ff6b9d' },
  { id: 'monoton', name: 'Monoton', cls: 'monoton', font: 'Monoton', fill: '#ff00ff' },
  { id: 'lobster', name: 'Lobster', cls: 'lobster', font: 'Lobster', fill: '#ffdd00' },
  { id: 'bebas', name: 'Bebas', cls: 'bebas', font: 'Bebas Neue', fill: '#ffffff' },
  { id: 'righteous', name: 'Righteous', cls: 'righteous', font: 'Righteous', fill: '#06b6d4' },
  { id: 'audiowide', name: 'Audiowide', cls: 'audiowide', font: 'Audiowide', fill: '#8b5cf6' },
  { id: 'shadow', name: 'Shadow', cls: 'shadow', font: 'Poppins', fill: '#ffffff' },
  { id: 'outline', name: 'Outline', cls: 'outline', font: 'Poppins', fill: '#ffffff', stroke: '#ffffff' },
  { id: 'glow', name: 'Glow', cls: 'glow', font: 'Poppins', fill: '#ffffff', glow: '#ec4899' },
  { id: 'threed', name: '3D', cls: 'three-d', font: 'Poppins', fill: '#ffffff', three_d: true },
  { id: 'stroke', name: 'Stroke', cls: 'stroke', font: 'Poppins', fill: '#ffffff', strokeColor: '#000', strokeWidth: 4 },
  { id: 'shine', name: 'Shine', cls: 'shine', font: 'Poppins', fill: '#ffffff', shine: true },
  { id: 'chrome', name: 'Chrome', cls: 'chrome', font: 'Poppins', fill: '#ffffff', chrome: true },
  { id: 'purple-glow', name: 'Purple Glow', cls: 'purple-glow', font: 'Poppins', fill: '#e0aaff', glow: '#8b5cf6' },
  { id: 'matrix', name: 'Matrix', cls: 'green-matrix', font: 'Orbitron', fill: '#00ff41', glow: '#00ff41' },
  { id: 'red-fire', name: 'Red Fire', cls: 'red-fire', font: 'Poppins', fill: '#f44336', gradient: true },
  { id: 'emboss', name: 'Emboss', cls: 'emboss', font: 'Poppins', fill: '#b0b0b0', emboss: true },
  { id: 'emboss2', name: 'Offset', cls: 'emboss2', font: 'Poppins', fill: '#ffffff', offsetShadow: true }
];

function buildPanels() {
  return {
    adjust: {
      title: 'Adjust', tabs: ['Basic', 'Advanced'],
      content: {
        'Basic': slider('brightness','Brightness',0,200,'%') + slider('contrast','Contrast',0,200,'%') + slider('exposure','Exposure',-100,100) + slider('saturation','Saturation',0,200,'%'),
        'Advanced': slider('vibrance','Vibrance',-100,100) + slider('temperature','Temperature',-100,100) + slider('tint','Tint',-100,100) + slider('hue','Hue',0,360,'°') + slider('sepia','Sepia',0,100,'%') + slider('grayscale','Grayscale',0,100,'%')
      },
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    light: {
      title: 'Light', tabs: [],
      content: slider('exposure','Exposure',-100,100) + slider('brightness','Brightness',0,200,'%') + slider('contrast','Contrast',0,200,'%') + slider('highlights','Highlights',-100,100) + slider('shadows','Shadows',-100,100) + slider('whites','Whites',-100,100) + slider('blacks','Blacks',-100,100),
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    color: {
      title: 'Color', tabs: ['Basic','HSL'],
      content: {
        'Basic': slider('saturation','Saturation',0,200,'%') + slider('vibrance','Vibrance',-100,100) + slider('temperature','Temperature',-100,100) + slider('tint','Tint',-100,100) + slider('hue','Hue',0,360,'°'),
        'HSL': slider('hslR','Red Saturation',-100,100) + slider('hslY','Yellow Sat',-100,100) + slider('hslG','Green Sat',-100,100) + slider('hslC','Cyan Sat',-100,100) + slider('hslB','Blue Sat',-100,100) + slider('hslM','Magenta Sat',-100,100) + slider('hslLum','Overall Sat Boost',-100,100)
      },
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    detail: {
      title: 'Detail', tabs: [],
      content: slider('sharpness','Sharpness',0,100) + slider('clarity','Clarity',0,100) + slider('texture','Texture',0,100) + slider('dehaze','Dehaze',0,100) + slider('structure','Structure',0,100) + slider('blur','Blur',0,20,'px') + slider('grain','Grain',0,100),
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    tone: {
      title: 'Tone', tabs: [],
      content: slider('blackPoint','Black Point',0,100) + slider('whitePoint','White Point',0,255) + slider('gamma','Gamma',50,200,'%') + slider('vignette','Vignette',0,100) + slider('flare','Flare',0,100),
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    curve: {
      title: 'Curves', tabs: [],
      content: `<div class="curve-editor"><canvas id="curveCanvas" width="300" height="200"></canvas></div>
        <p style="font-size:0.7rem;color:var(--text-dim);text-align:center;">Tap/drag to add points · Drag points to move</p>
        <div class="panel-actions-row"><button class="action-btn" id="curveResetBtn"><i class="fas fa-undo"></i> Reset Curve</button></div>`,
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    hsl: {
      title: 'HSL', tabs: [],
      content: slider('hslR','Red',-100,100) + slider('hslY','Yellow',-100,100) + slider('hslG','Green',-100,100) + slider('hslC','Cyan',-100,100) + slider('hslB','Blue',-100,100) + slider('hslM','Magenta',-100,100) + slider('hslLum','Master',-100,100),
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    crop: {
      title: 'Crop & Resize', tabs: [],
      content: `
        <div class="crop-ratios">
          <button class="ratio-btn active" data-ratio="free">Free</button>
          <button class="ratio-btn" data-ratio="1:1">1:1</button>
          <button class="ratio-btn" data-ratio="4:3">4:3</button>
          <button class="ratio-btn" data-ratio="3:2">3:2</button>
          <button class="ratio-btn" data-ratio="16:9">16:9</button>
          <button class="ratio-btn" data-ratio="9:16">9:16</button>
          <button class="ratio-btn" data-ratio="4:5">4:5</button>
          <button class="ratio-btn" data-ratio="2:3">2:3</button>
        </div>
        <div class="panel-actions-row">
          <button class="action-btn" id="rotateLeftBtn"><i class="fas fa-undo"></i> Rotate L</button>
          <button class="action-btn" id="rotateRightBtn"><i class="fas fa-redo"></i> Rotate R</button>
          <button class="action-btn" id="flipHBtn"><i class="fas fa-arrows-alt-h"></i> Flip H</button>
          <button class="action-btn" id="flipVBtn"><i class="fas fa-arrows-alt-v"></i> Flip V</button>
        </div>
        <p style="font-size:0.7rem;color:var(--text-dim);text-align:center;margin-top:10px;">✨ Drag corners/edges to resize · Drag inside to move</p>
      `,
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="applyCropBtn">Apply Crop</button>`
    },
    perspective: {
      title: 'Perspective', tabs: [],
      content: slider('perspTl','Top Left',-100,100) + slider('perspTr','Top Right',-100,100) + slider('perspBl','Bottom Left',-100,100) + slider('perspBr','Bottom Right',-100,100),
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="applyPerspBtn">Apply</button>`
    },
    filters: {
      title: 'Filters', tabs: ['All', 'Cinematic', 'Vintage', 'Modern', 'B&W', 'Neon', 'Nature', 'Portrait'],
      content: { 'All': '<div class="filter-grid" id="filterGrid"></div>', 'Cinematic': '<div class="filter-grid" id="filterGrid"></div>', 'Vintage': '<div class="filter-grid" id="filterGrid"></div>', 'Modern': '<div class="filter-grid" id="filterGrid"></div>', 'B&W': '<div class="filter-grid" id="filterGrid"></div>', 'Neon': '<div class="filter-grid" id="filterGrid"></div>', 'Nature': '<div class="filter-grid" id="filterGrid"></div>', 'Portrait': '<div class="filter-grid" id="filterGrid"></div>' },
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>`
    },
    effects: {
      title: 'Effects', tabs: ['Weather', 'Style', 'Light', 'Vintage'],
      content: {
        'Weather': `<div class="effects-grid"><button class="effect-chip" data-effect="rain"><i class="fas fa-cloud-rain"></i> Rain</button><button class="effect-chip" data-effect="snow"><i class="fas fa-snowflake"></i> Snow</button><button class="effect-chip" data-effect="confetti"><i class="fas fa-birthday-cake"></i> Confetti</button><button class="effect-chip" data-effect="fire"><i class="fas fa-fire"></i> Fire</button><button class="effect-chip" data-effect="sparkle"><i class="fas fa-star"></i> Sparkle</button><button class="effect-chip" data-effect="fog"><i class="fas fa-smog"></i> Fog</button><button class="effect-chip" data-effect="lensFlare"><i class="fas fa-sun"></i> Flare</button></div>`,
        'Style': `<div class="effects-grid"><button class="effect-chip" data-effect="glitch"><i class="fas fa-tv"></i> Glitch</button><button class="effect-chip" data-effect="mirror"><i class="fas fa-clone"></i> Mirror</button><button class="effect-chip" data-effect="dragan"><i class="fas fa-dragon"></i> Dragan</button><button class="effect-chip" data-effect="neonGlow"><i class="fas fa-bolt"></i> Neon</button><button class="effect-chip" data-effect="vhs"><i class="fas fa-video"></i> VHS</button><button class="effect-chip" data-effect="sketch"><i class="fas fa-pencil"></i> Sketch</button><button class="effect-chip" data-effect="cartoon"><i class="fas fa-paint-brush"></i> Cartoon</button><button class="effect-chip" data-effect="oilPaint"><i class="fas fa-palette"></i> Oil Paint</button></div>`,
        'Light': `<div class="effects-grid"><button class="effect-chip" data-effect="sunrays"><i class="fas fa-sun"></i> Sunrays</button><button class="effect-chip" data-effect="spotlight"><i class="fas fa-lightbulb"></i> Spotlight</button><button class="effect-chip" data-effect="rainbow"><i class="fas fa-rainbow"></i> Rainbow</button><button class="effect-chip" data-effect="stars"><i class="fas fa-star"></i> Stars</button><button class="effect-chip" data-effect="bokeh"><i class="fas fa-circle"></i> Bokeh</button><button class="effect-chip" data-effect="lightLeak"><i class="fas fa-sun"></i> Light Leak</button></div>`,
        'Vintage': `<div class="effects-grid"><button class="effect-chip" data-effect="grainOld"><i class="fas fa-braille"></i> Old Grain</button><button class="effect-chip" data-effect="scratch"><i class="fas fa-minus"></i> Scratches</button><button class="effect-chip" data-effect="faded"><i class="fas fa-sun"></i> Faded</button><button class="effect-chip" data-effect="sepiaTone"><i class="fas fa-coffee"></i> Sepia</button><button class="effect-chip" data-effect="dustSpots"><i class="fas fa-ellipsis-h"></i> Dust</button></div>`
      },
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>`
    },
    blur: {
      title: 'Blur', tabs: ['Tools', 'Advanced'],
      content: {
        'Tools': `<div class="effects-grid"><button class="effect-chip" data-effect="tiltShift"><i class="fas fa-arrows-alt-v"></i> Tilt Shift</button><button class="effect-chip" data-effect="radialBlur"><i class="fas fa-circle-notch"></i> Radial</button><button class="effect-chip" data-effect="motionBlur"><i class="fas fa-arrows-alt-h"></i> Motion</button><button class="effect-chip" data-effect="zoomBlur"><i class="fas fa-search-plus"></i> Zoom</button><button class="effect-chip" data-effect="gaussianBlur"><i class="fas fa-water"></i> Gaussian</button></div>`,
        'Advanced': slider('blur','Blur Amount',0,20,'px') + slider('bokeh','Bokeh',0,80)
      },
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>`
    },
    portrait: {
      title: 'Portrait', tabs: ['Skin', 'Features'],
      content: {
        'Skin': slider('skin','Skin Smooth',0,100) + slider('glow','Glow',0,100),
        'Features': slider('teeth','Teeth White',0,100) + slider('eyes','Eye Brighten',0,100) + slider('faceSlim','Face Slim',0,100)
      },
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="resetToolBtn">Reset</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    retouch: {
      title: 'Retouch', tabs: ['Heal','Smooth'],
      content: { 'Heal': `<div class="effects-grid"><button class="effect-chip" data-effect="heal"><i class="fas fa-band-aid"></i> Heal Area</button></div>`, 'Smooth': slider('skin','Smooth Strength',0,100) },
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="applyToolBtn">Apply</button>`
    },
    removebg: {
      title: 'AI Remove Background', tabs: [],
      content: `<div style="text-align:center;padding:20px;"><i class="fas fa-robot" style="font-size:4rem;color:#8b5cf6;margin-bottom:20px;"></i><h3 style="margin-bottom:10px;">AI Background Remover</h3><p style="color:#a0a0b0;font-size:0.85rem;margin-bottom:20px;">Works best with people photos</p><button class="btn-check" id="aiBgBtn" style="padding:15px 30px;font-size:1rem;"><i class="fas fa-magic"></i> Remove Background</button></div>`,
      footer: ''
    },
    aiEnhance: {
      title: 'AI Enhance', tabs: [],
      content: `<div style="text-align:center;padding:20px;"><i class="fas fa-wand-magic-sparkles" style="font-size:4rem;color:#06b6d4;margin-bottom:20px;"></i><h3 style="margin-bottom:10px;">One-Tap AI Enhance</h3><p style="color:#a0a0b0;font-size:0.85rem;margin-bottom:20px;">Auto-adjust for perfect balance</p><button class="btn-check" id="aiEnhanceBtn" style="padding:15px 30px;font-size:1rem;"><i class="fas fa-magic"></i> Enhance Now</button></div>`,
      footer: ''
    },
    sky: {
      title: 'Sky Replacement', tabs: [],
      content: `<p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:12px;">Apply sky overlay</p><div class="effects-grid"><button class="effect-chip" data-sky="sunset"><i class="fas fa-sun"></i> Sunset</button><button class="effect-chip" data-sky="night"><i class="fas fa-moon"></i> Night</button><button class="effect-chip" data-sky="storm"><i class="fas fa-bolt"></i> Storm</button><button class="effect-chip" data-sky="aurora"><i class="fas fa-star"></i> Aurora</button><button class="effect-chip" data-sky="clouds"><i class="fas fa-cloud"></i> Clouds</button><button class="effect-chip" data-sky="warm"><i class="fas fa-sun"></i> Warm</button></div>`,
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>`
    },
    draw: {
      title: 'Draw', tabs: ['Brush','Neon','Eraser'],
      content: {
        'Brush': `<div class="slider-group"><label><span>Size</span><span id="brushSizeVal">15px</span></label><input type="range" id="brushSize" min="1" max="100" value="15"></div><p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:8px;">Color:</p><div class="effects-grid"><button class="effect-chip draw-color" data-color="#ff0066" style="background:#ff0066;">●</button><button class="effect-chip draw-color" data-color="#ffffff" style="background:#fff;color:#000;">●</button><button class="effect-chip draw-color" data-color="#06b6d4" style="background:#06b6d4;">●</button><button class="effect-chip draw-color" data-color="#8b5cf6" style="background:#8b5cf6;">●</button><button class="effect-chip draw-color" data-color="#10b981" style="background:#10b981;">●</button><button class="effect-chip draw-color" data-color="#f59e0b" style="background:#f59e0b;">●</button></div>`,
        'Neon': `<div class="slider-group"><label><span>Size</span><span id="brushSizeVal">20px</span></label><input type="range" id="brushSize" min="1" max="100" value="20"></div><p style="font-size:0.75rem;color:var(--text-dim);">Neon glow brush - draw on canvas</p>`,
        'Eraser': `<div class="slider-group"><label><span>Size</span><span id="brushSizeVal">30px</span></label><input type="range" id="brushSize" min="1" max="100" value="30"></div><p style="font-size:0.75rem;color:var(--text-dim);">Eraser removes drawing layer</p>`
      },
      footer: `<button class="btn-cancel" id="clearDrawBtn">Clear</button><button class="btn-check" id="mergeDrawBtn">Merge</button>`
    },
    text: {
      title: 'Text — 20+ Styles', tabs: ['Style','Content'],
      content: {
        'Style': `
          <div class="text-preview-box">
            <div id="textPreview" style="font-size:1.5rem;font-weight:700;font-family:Poppins,sans-serif;">AVR TECH LABS</div>
          </div>
          <p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:8px;">✨ Choose a style (24 styles available):</p>
          <div class="text-style-grid" id="textStyleGrid"></div>
        `,
        'Content': `
          <input type="text" id="textInput" placeholder="Enter your text..." value="AVR TECH LABS" style="width:100%;padding:12px;background:#1c1c2a;border:1px solid #2a2a3a;border-radius:10px;color:white;margin-bottom:10px;font-family:inherit;">
          <div class="slider-group"><label><span>Size</span><span id="textSizeVal">64px</span></label><input type="range" id="textSize" min="10" max="200" value="64"></div>
          <div class="panel-actions-row">
            <button class="action-btn" id="textPosTL"><i class="fas fa-arrow-up-left"></i> Top Left</button>
            <button class="action-btn" id="textPosTR"><i class="fas fa-arrow-up-right"></i> Top Right</button>
            <button class="action-btn" id="textPosCenter"><i class="fas fa-circle"></i> Center</button>
            <button class="action-btn" id="textPosBL"><i class="fas fa-arrow-down-left"></i> Bottom Left</button>
            <button class="action-btn" id="textPosBR"><i class="fas fa-arrow-down-right"></i> Bottom Right</button>
            <button class="action-btn" id="textPosBottom"><i class="fas fa-arrow-down"></i> Bottom Center</button>
          </div>
          <div class="slider-group" style="margin-top:12px;"><label><span>Opacity</span><span id="textOpacityVal">100%</span></label><input type="range" id="textOpacity" min="10" max="100" value="100"></div>
        `
      },
      footer: `<button class="btn-cancel" id="cancelToolBtn">Cancel</button><button class="btn-check" id="addTextBtn" style="flex:2"><i class="fas fa-plus"></i> Add Text</button>`
    },
    sticker: {
      title: 'Stickers', tabs: ['Emojis','Shapes'],
      content: { 'Emojis': `<div class="effects-grid" id="emojiGrid"></div>`, 'Shapes': `<div class="effects-grid" id="shapeGrid"></div>` },
      footer: ''
    },
    frame: {
      title: 'Frames', tabs: [],
      content: `<div class="effects-grid" id="frameGrid"></div>`,
      footer: ''
    },
    shadow: {
      title: 'Shadow', tabs: [],
      content: `<div class="effects-grid"><button class="effect-chip" data-shadow="drop"><i class="fas fa-clone"></i> Drop Shadow</button><button class="effect-chip" data-shadow="glow"><i class="fas fa-sun"></i> Glow</button><button class="effect-chip" data-shadow="outline"><i class="fas fa-square"></i> Outline</button><button class="effect-chip" data-shadow="inner"><i class="fas fa-circle"></i> Inner</button></div>`,
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>`
    },
    collage: {
      title: 'Collage', tabs: [],
      content: `<p style="font-size:0.75rem;color:var(--text-dim);margin-bottom:12px;">Apply collage layout</p><div class="collage-grids"><div class="collage-opt" data-layout="2x1"><div></div><div></div></div><div class="collage-opt" data-layout="1x2"><div></div><div></div></div><div class="collage-opt" data-layout="2x2"><div></div><div></div><div></div><div></div></div><div class="collage-opt" data-layout="3x1"><div></div><div></div><div></div></div><div class="collage-opt" data-layout="1x3"><div></div><div></div><div></div></div><div class="collage-opt" data-layout="3x3"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>`,
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1">Apply</button>`
    },
    watermark: {
      title: 'Watermark', tabs: [],
      content: `<input type="text" id="wmText" placeholder="Your watermark text..." value="© AVR TECH LABS" style="width:100%;padding:12px;background:#1c1c2a;border:1px solid #2a2a3a;border-radius:10px;color:white;margin-bottom:10px;font-family:inherit;"><div class="slider-group"><label><span>Size</span><span id="wmSizeVal">36px</span></label><input type="range" id="wmSize" min="10" max="100" value="36"></div><div class="slider-group"><label><span>Opacity</span><span id="wmOpacityVal">40%</span></label><input type="range" id="wmOpacity" min="10" max="100" value="40"></div><select id="wmPos" style="width:100%;padding:10px;background:#1c1c2a;border:1px solid #2a2a3a;border-radius:10px;color:white;margin-bottom:10px;"><option value="br">Bottom Right</option><option value="bl">Bottom Left</option><option value="tr">Top Right</option><option value="tl">Top Left</option><option value="c">Center</option></select>`,
      footer: `<button class="btn-check" id="applyWmBtn" style="flex:1"><i class="fas fa-check"></i> Apply Watermark</button>`
    },
    export: {
      title: 'Export', tabs: [],
      content: `<div class="slider-group"><label><span>Quality</span><span id="qualityVal">95%</span></label><input type="range" id="quality" min="10" max="100" value="95"></div><div class="panel-actions-row"><button class="action-btn" id="exportPNG"><i class="fas fa-file-image"></i> PNG</button><button class="action-btn" id="exportJPG"><i class="fas fa-file-image"></i> JPG</button></div>`,
      footer: `<button class="btn-check" id="applyToolBtn" style="flex:1"><i class="fas fa-download"></i> Download</button>`
    }
  };
}

function attachPanelHandlers(tool, activeTab) {
  document.querySelectorAll('#panelContent input[type="range"]').forEach(input => {
    const id = input.id;
    if (['brushSize','textSize','quality','wmSize','wmOpacity','textOpacity'].includes(id)) {
      const valId = id + 'Val';
      const label = document.getElementById(valId);
      const suffix = id === 'wmSize' ? 'px' : (id === 'wmOpacity' || id === 'textOpacity' ? '%' : (id === 'brushSize' ? 'px' : (id === 'textSize' ? 'px' : '')));
      input.addEventListener('input', e => {
        if (label) label.textContent = e.target.value + suffix;
        if (id === 'brushSize') state.drawSize = +e.target.value;
        if (id === 'textSize') {
          const preview = document.getElementById('textPreview');
          if (preview) preview.style.fontSize = (e.target.value / 40) + 'rem';
        }
      });
      return;
    }
    const valId = id + 'Val';
    const label = document.getElementById(valId);
    const suffix = id === 'hue' ? '°' : (id === 'blur' ? 'px' : (['brightness','contrast','saturation','gamma'].includes(id) ? '%' : ''));
    input.value = state.filters[id] !== undefined ? state.filters[id] : input.value;
    if (label) label.textContent = input.value + suffix;
    input.addEventListener('input', e => {
      const val = parseFloat(e.target.value);
      state.filters[id] = val;
      if (label) label.textContent = val + suffix;
      applyFilters();
    });
    input.addEventListener('change', () => saveHistory());
  });

  if (tool === 'crop') {
    document.querySelectorAll('.ratio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!originalImage) return showToast('Upload image first!');
        document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        startCrop(btn.dataset.ratio);
      });
    });
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
      if (!originalImage) return;
      state.rotation = (state.rotation - 90 + 360) % 360;
      applyFilters(); saveHistory(); showToast('Rotated ↺');
    });
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
      if (!originalImage) return;
      state.rotation = (state.rotation + 90) % 360;
      applyFilters(); saveHistory(); showToast('Rotated ↻');
    });
    document.getElementById('flipHBtn')?.addEventListener('click', () => {
      if (!originalImage) return;
      state.flipH = !state.flipH; applyFilters(); saveHistory();
    });
    document.getElementById('flipVBtn')?.addEventListener('click', () => {
      if (!originalImage) return;
      state.flipV = !state.flipV; applyFilters(); saveHistory();
    });
    document.getElementById('applyCropBtn')?.addEventListener('click', applyCrop);
  }

  if (tool === 'perspective') {
    ['perspTl','perspTr','perspBl','perspBr'].forEach(id => {
      const input = document.getElementById(id);
      const label = document.getElementById(id + 'Val');
      if (input) {
        input.addEventListener('input', e => {
          if (label) label.textContent = e.target.value;
          state.perspective[id.replace('persp','').toLowerCase()] = +e.target.value;
        });
      }
    });
    document.getElementById('applyPerspBtn')?.addEventListener('click', applyPerspective);
  }

  if (tool === 'filters') {
    const cat = activeTab ? activeTab.toLowerCase() : 'all';
    buildFilterPreviews(cat);
  }

  document.querySelectorAll('.effect-chip[data-effect]').forEach(btn => {
    btn.addEventListener('click', () => applySpecialEffect(btn.dataset.effect));
  });
  document.querySelectorAll('.effect-chip[data-sky]').forEach(btn => {
    btn.addEventListener('click', () => applySky(btn.dataset.sky));
  });
  document.querySelectorAll('.effect-chip[data-shadow]').forEach(btn => {
    btn.addEventListener('click', () => applyShadow(btn.dataset.shadow));
  });
  document.querySelectorAll('.collage-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.collage-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  document.querySelectorAll('.draw-color').forEach(btn => {
    btn.addEventListener('click', () => {
      state.drawColor = btn.dataset.color;
      document.querySelectorAll('.draw-color').forEach(b => b.style.borderColor = 'transparent');
      btn.style.borderColor = '#fff';
      showToast('Color set!');
    });
  });

  if (tool === 'draw') {
    drawLayer.width = canvas.width;
    drawLayer.height = canvas.height;
    drawLayer.classList.add('active');
    drawLayer.style.opacity = '1';
    state.currentTool = 'draw';
    document.getElementById('clearDrawBtn')?.addEventListener('click', () => {
      dctx.clearRect(0, 0, drawLayer.width, drawLayer.height);
    });
    document.getElementById('mergeDrawBtn')?.addEventListener('click', mergeDrawLayer);
  }

  if (tool === 'curve') setupCurveEditor();

  // TEXT panel
  if (tool === 'text') {
    // Build text style grid
    const grid = document.getElementById('textStyleGrid');
    if (grid) {
      grid.innerHTML = '';
      TEXT_STYLES.forEach(style => {
        const chip = document.createElement('button');
        chip.className = 'text-style-chip ' + style.cls + (state.selectedTextStyle === style.id ? ' active' : '');
        chip.textContent = style.name;
        chip.style.fontFamily = style.font;
        chip.addEventListener('click', () => {
          state.selectedTextStyle = style.id;
          document.querySelectorAll('.text-style-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          updateTextPreview(style);
        });
        grid.appendChild(chip);
      });
      // Set initial preview
      const current = TEXT_STYLES.find(s => s.id === state.selectedTextStyle);
      if (current) updateTextPreview(current);
    }

    // Position buttons
    const positions = {
      textPosTL: {x: 0.05, y: 0.1, align: 'left'},
      textPosTR: {x: 0.95, y: 0.1, align: 'right'},
      textPosCenter: {x: 0.5, y: 0.5, align: 'center'},
      textPosBL: {x: 0.05, y: 0.9, align: 'left'},
      textPosBR: {x: 0.95, y: 0.9, align: 'right'},
      textPosBottom: {x: 0.5, y: 0.9, align: 'center'}
    };
    Object.keys(positions).forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        window._textPos = positions[id];
        showToast('Position set');
      });
    });

    document.getElementById('addTextBtn')?.addEventListener('click', addStyledText);
  }

  if (tool === 'sticker') buildStickers();
  if (tool === 'frame') buildFrames();
  document.getElementById('aiBgBtn')?.addEventListener('click', removeBackgroundAI);
  document.getElementById('aiEnhanceBtn')?.addEventListener('click', aiEnhance);

  document.getElementById('applyWmBtn')?.addEventListener('click', () => {
    const text = document.getElementById('wmText').value;
    const size = +document.getElementById('wmSize').value;
    const opacity = +document.getElementById('wmOpacity').value / 100;
    const pos = document.getElementById('wmPos').value;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `bold ${size}px Poppins, sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 2;
    let x, y;
    const pad = 20;
    switch (pos) {
      case 'br': x = canvas.width - pad; y = canvas.height - pad; ctx.textAlign = 'right'; break;
      case 'bl': x = pad; y = canvas.height - pad; ctx.textAlign = 'left'; break;
      case 'tr': x = canvas.width - pad; y = pad + size; ctx.textAlign = 'right'; break;
      case 'tl': x = pad; y = pad + size; ctx.textAlign = 'left'; break;
      default: x = canvas.width/2; y = canvas.height/2; ctx.textAlign = 'center';
    }
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
    bakeToOriginal(); saveHistory(); closePanel(); showToast('Watermark applied');
  });

  document.getElementById('exportPNG')?.addEventListener('click', () => downloadImage('png'));
  document.getElementById('exportJPG')?.addEventListener('click', () => downloadImage('jpg'));

  document.getElementById('applyToolBtn')?.addEventListener('click', () => {
    if (tool === 'export') return downloadImage('png');
    if (tool === 'draw') return mergeDrawLayer();
    saveHistory(); closePanel(); showToast('Applied ✓');
  });
  document.getElementById('resetToolBtn')?.addEventListener('click', () => {
    Object.keys(state.filters).forEach(k => {
      if (k === 'brightness' || k === 'contrast' || k === 'saturation' || k === 'gamma') state.filters[k] = 100;
      else if (k === 'whitePoint') state.filters[k] = 255;
      else state.filters[k] = 0;
    });
    applyFilters(); closePanel(); showToast('Reset ⟲');
  });
  document.getElementById('cancelToolBtn')?.addEventListener('click', closePanel);
}

function updateTextPreview(style) {
  const preview = document.getElementById('textPreview');
  if (!preview) return;
  preview.style.cssText = 'font-size:1.5rem;font-weight:700;';
  preview.style.fontFamily = style.font + ', sans-serif';
  preview.style.background = 'none';
  preview.style.webkitBackgroundClip = 'initial';
  preview.style.webkitTextFillColor = style.fill || '#fff';
  preview.style.color = style.fill || '#fff';
  preview.style.textShadow = 'none';
  preview.style.webkitTextStroke = '0';

  if (style.glow) preview.style.textShadow = `0 0 8px ${style.glow}, 0 0 16px ${style.glow}, 0 0 24px ${style.glow}`;
  if (style.stroke) preview.style.webkitTextStroke = `2px ${style.stroke}`;
  if (style.strokeColor) preview.style.webkitTextStroke = `${style.strokeWidth || 2}px ${style.strokeColor}`;
  if (style.shadow) preview.style.textShadow = '4px 4px 8px rgba(0,0,0,0.8)';
  if (style.three_d) preview.style.textShadow = '2px 2px 0 #8b5cf6, 4px 4px 0 #ec4899, 6px 6px 0 #06b6d4';
  if (style.offsetShadow) preview.style.textShadow = '-3px 3px 0 #8b5cf6';
  if (style.emboss) preview.style.textShadow = '1px 1px 0 #fff, -1px -1px 0 #000';
  if (style.gradient) {
    const grads = {
      gold: 'linear-gradient(135deg, #f5e6b8, #d4af37, #b8941f, #d4af37)',
      fire: 'linear-gradient(180deg, #ff4500, #ff8c00, #ffd700)',
      ice: 'linear-gradient(180deg, #a0f0ff, #fff, #a0f0ff)',
      'red-fire': 'linear-gradient(180deg, #ffeb3b, #ff9800, #f44336, #b71c1c)'
    };
    preview.style.background = grads[style.id] || grads.gold;
    preview.style.webkitBackgroundClip = 'text';
    preview.style.backgroundClip = 'text';
    preview.style.webkitTextFillColor = 'transparent';
    preview.style.color = 'transparent';
  }
  if (style.rainbow) {
    preview.style.background = 'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff00ff)';
    preview.style.webkitBackgroundClip = 'text';
    preview.style.backgroundClip = 'text';
    preview.style.webkitTextFillColor = 'transparent';
    preview.style.backgroundSize = '200% 100%';
    preview.style.animation = 'rainbowShift 3s linear infinite';
  }
}

function addStyledText() {
  if (!originalImage) return showToast('Upload image first!');
  const text = document.getElementById('textInput')?.value;
  if (!text) return showToast('Enter text!');
  const size = +document.getElementById('textSize').value;
  const opacity = +document.getElementById('textOpacity').value / 100;
  const style = TEXT_STYLES.find(s => s.id === state.selectedTextStyle) || TEXT_STYLES[0];
  const pos = window._textPos || {x: 0.5, y: 0.5, align: 'center'};

  const x = canvas.width * pos.x;
  const y = canvas.height * pos.y;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `bold ${size}px ${style.font}, sans-serif`;
  ctx.textAlign = pos.align;
  ctx.textBaseline = 'middle';

  // Gradient fills
  if (style.gradient) {
    const grads = {
      gold: ['#f5e6b8', '#d4af37', '#b8941f', '#d4af37'],
      fire: ['#ff4500', '#ff8c00', '#ffd700'],
      ice: ['#a0f0ff', '#ffffff', '#a0f0ff'],
      'red-fire': ['#ffeb3b', '#ff9800', '#f44336', '#b71c1c']
    };
    const colors = grads[style.id] || grads.gold;
    const grad = ctx.createLinearGradient(x, y - size/2, x, y + size/2);
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
  }
  // Rainbow fill
  else if (style.rainbow) {
    const grad = ctx.createLinearGradient(x - size * text.length / 4, y, x + size * text.length / 4, y);
    ['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#8800ff','#ff00ff'].forEach((c, i) => grad.addColorStop(i/6, c));
    ctx.fillStyle = grad;
  }
  else {
    ctx.fillStyle = style.fill || '#fff';
  }

  // Glow / shadow
  if (style.glow) {
    ctx.shadowColor = style.glow;
    ctx.shadowBlur = 20;
    ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;
  }
  if (style.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
  }
  if (style.three_d) {
    ctx.save();
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(text, x + 2, y + 2);
    ctx.fillStyle = '#ec4899';
    ctx.fillText(text, x + 4, y + 4);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(text, x + 6, y + 6);
    ctx.restore();
  }
  if (style.offsetShadow) {
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(text, x - 3, y + 3);
    ctx.fillStyle = style.fill || '#fff';
  }
  if (style.emboss) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillStyle = '#fff';
    ctx.fillText(text, x - 1, y - 1);
    ctx.restore();
    ctx.fillStyle = style.fill || '#b0b0b0';
  }

  // Stroke
  if (style.stroke) {
    ctx.strokeStyle = style.stroke;
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
  }
  if (style.strokeColor) {
    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeWidth || 2;
    ctx.strokeText(text, x, y);
  }

  // Main fill
  ctx.fillText(text, x, y);
  ctx.restore();

  bakeToOriginal();
  saveHistory();
  closePanel();
  showToast('Text added ✍️');
}

function buildFilterPreviews(cat = 'all') {
  const grid = document.getElementById('filterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(FILTERS).forEach(name => {
    const data = FILTERS[name];
    if (cat !== 'all' && data.cat !== cat) return;
    const item = document.createElement('div');
    item.className = 'filter-item' + (state.currentFilter === name ? ' active' : '');
    const thumb = document.createElement('canvas');
    thumb.width = 100; thumb.height = 70;
    const tctx = thumb.getContext('2d');
    if (originalImage) {
      tctx.filter = data.css || 'none';
      tctx.drawImage(originalImage, 0, 0, 100, 70);
    } else {
      tctx.fillStyle = '#333'; tctx.fillRect(0, 0, 100, 70);
    }
    const label = document.createElement('span');
    label.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    item.appendChild(thumb);
    item.appendChild(label);
    item.addEventListener('click', () => {
      document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      state.currentFilter = name;
      applyFilters(); saveHistory();
      showToast(`Filter: ${label.textContent}`);
    });
    grid.appendChild(item);
  });
}

const EMOJIS = ['😀','😎','🤩','😍','🥰','😂','🤣','😇','🥳','😜','🤔','😴','😢','😡','🤯','😱','🥺','😈','👻','💀','🤖','🌟','⭐','✨','💫','🌈','❤️','💖','💝','💘','🔥','💯','🎉','🎊','🎈','🎁','🌸','🌺','🌻','🌹','🍕','🍔','🍟','☕','🍺','🎵','🎸','🎬','⚡','💎','👑','🎯','🏆','📸'];
const SHAPES = ['⬛','⬜','🟥','🟦','🟩','🟨','🟪','🟧','⚫','⚪','🔴','🔵','🟢','🟡','🟣','🟠','❤️','💛','💚','💙','💜','🧡','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝'];

function buildStickers() {
  const emojiGrid = document.getElementById('emojiGrid');
  const shapeGrid = document.getElementById('shapeGrid');
  if (emojiGrid) {
    emojiGrid.innerHTML = '';
    EMOJIS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'effect-chip';
      btn.style.fontSize = '1.8rem';
      btn.textContent = s;
      btn.addEventListener('click', () => addSticker(s));
      emojiGrid.appendChild(btn);
    });
  }
  if (shapeGrid) {
    shapeGrid.innerHTML = '';
    SHAPES.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'effect-chip';
      btn.style.fontSize = '1.8rem';
      btn.textContent = s;
      btn.addEventListener('click', () => addSticker(s));
      shapeGrid.appendChild(btn);
    });
  }
}

function addSticker(s) {
  if (!originalImage) return showToast('Upload image first!');
  ctx.font = `${Math.min(canvas.width, canvas.height) * 0.15}px serif`;
  ctx.textAlign = 'center';
  ctx.fillText(s, canvas.width/2 + (Math.random()-0.5)*canvas.width*0.5, canvas.height/2 + (Math.random()-0.5)*canvas.height*0.5);
  bakeToOriginal(); saveHistory(); closePanel(); showToast('Sticker added');
}

const FRAMES = [
  { name: 'White', style: 'white' }, { name: 'Black', style: 'black' },
  { name: 'Gold', style: 'gold' }, { name: 'Neon', style: 'neon' },
  { name: 'Polaroid', style: 'polaroid' }, { name: 'Shadow', style: 'shadow' },
  { name: 'Vintage', style: 'vintage' }, { name: 'Double', style: 'double' }
];

function buildFrames() {
  const grid = document.getElementById('frameGrid');
  if (!grid) return;
  grid.innerHTML = '';
  FRAMES.forEach(fr => {
    const btn = document.createElement('button');
    btn.className = 'effect-chip';
    btn.innerHTML = `<i class="fas fa-square"></i> ${fr.name}`;
    btn.addEventListener('click', () => {
      if (!originalImage) return showToast('Upload image first!');
      applyFrame(fr.style); saveHistory(); showToast(`Frame: ${fr.name} 🖼️`);
    });
    grid.appendChild(btn);
  });
}

function applyFrame(style) {
  const pad = 30;
  const temp = document.createElement('canvas');
  temp.width = canvas.width; temp.height = canvas.height;
  temp.getContext('2d').drawImage(canvas, 0, 0);
  const newW = canvas.width + pad * 2;
  const newH = canvas.height + pad * 2;
  canvas.width = newW; canvas.height = newH;
  const colors = { white: '#ffffff', black: '#000000', gold: '#d4af37', neon: '#ff00ff', polaroid: '#f5f5f0', shadow: '#1a1a1a', vintage: '#3d2817', double: '#000' };
  ctx.fillStyle = colors[style] || '#ffffff';
  ctx.fillRect(0, 0, newW, newH);
  if (style === 'neon') { ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 25; }
  if (style === 'shadow') { ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 30; }
  if (style === 'gold') {
    const g = ctx.createLinearGradient(0, 0, newW, newH);
    g.addColorStop(0, '#d4af37'); g.addColorStop(0.5, '#fff4b0'); g.addColorStop(1, '#d4af37');
    ctx.fillStyle = g; ctx.fillRect(0, 0, newW, newH);
  }
  if (style === 'double') {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, newW - 16, newH - 16);
  }
  ctx.drawImage(temp, pad, pad);
  ctx.shadowColor = 'transparent';
  if (style === 'polaroid') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, newW, 70);
    ctx.fillRect(0, newH - 90, newW, 90);
  }
  bakeToOriginal();
}

function bakeToOriginal() {
  const snap = document.createElement('canvas');
  snap.width = canvas.width; snap.height = canvas.height;
  snap.getContext('2d').drawImage(canvas, 0, 0);
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    originalImage._scaledW = canvas.width;
    originalImage._scaledH = canvas.height;
  };
  img.src = snap.toDataURL();
}

function applySpecialEffect(effect) {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;

  if (effect === 'rain') {
    ctx.strokeStyle = 'rgba(180, 200, 255, 0.6)'; ctx.lineWidth = 1;
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 15); ctx.stroke();
    }
  }
  else if (effect === 'snow') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 300; i++) { ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3+1, 0, Math.PI*2); ctx.fill(); }
  }
  else if (effect === 'confetti') {
    const c = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 250; i++) { ctx.fillStyle = c[Math.floor(Math.random()*c.length)]; ctx.fillRect(Math.random()*w, Math.random()*h, 6, 10); }
  }
  else if (effect === 'fire') {
    const g = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.8);
    g.addColorStop(0, 'rgba(255, 200, 50, 0.7)'); g.addColorStop(0.5, 'rgba(255, 100, 20, 0.5)'); g.addColorStop(1, 'rgba(255, 30, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'sparkle') {
    for (let i = 0; i < 150; i++) {
      const x = Math.random()*w, y = Math.random()*h, s = Math.random()*8+4;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.8+0.2})`;
      ctx.beginPath();
      ctx.moveTo(x, y-s); ctx.lineTo(x+s/3, y-s/3); ctx.lineTo(x+s, y); ctx.lineTo(x+s/3, y+s/3);
      ctx.lineTo(x, y+s); ctx.lineTo(x-s/3, y+s/3); ctx.lineTo(x-s, y); ctx.lineTo(x-s/3, y-s/3); ctx.closePath(); ctx.fill();
    }
  }
  else if (effect === 'fog') {
    for (let i = 0; i < 20; i++) {
      const x = Math.random()*w, y = Math.random()*h, r = Math.random()*200+100;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(220, 220, 230, 0.15)'); g.addColorStop(1, 'rgba(220, 220, 230, 0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
  }
  else if (effect === 'glitch') {
    const imgData = ctx.getImageData(0, 0, w, h); const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (Math.random() < 0.005) { d[i] = 255 - d[i]; d[i+1] = 255 - d[i+1]; }
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'mirror') {
    const half = document.createElement('canvas');
    half.width = w/2; half.height = h;
    half.getContext('2d').drawImage(canvas, 0, 0, w/2, h, 0, 0, w/2, h);
    ctx.save(); ctx.scale(-1, 1); ctx.drawImage(half, -w, 0); ctx.restore();
  }
  else if (effect === 'dragan') {
    Object.assign(state.filters, { clarity: 60, contrast: 125, saturation: 85, shadows: -20 });
    applyFilters();
  }
  else if (effect === 'neonGlow') {
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 40;
    ctx.filter = 'saturate(2) hue-rotate(280deg)';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(canvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
    ctx.filter = 'none'; ctx.globalAlpha = 1;
  }
  else if (effect === 'vhs') {
    const imgData = ctx.getImageData(0, 0, w, h); const d = imgData.data;
    for (let y = 0; y < h; y += 3) {
      if (Math.random() > 0.85) {
        const shift = Math.floor((Math.random() - 0.5) * 30);
        for (let x = 0; x < w; x++) {
          const srcX = Math.max(0, Math.min(w-1, x + shift));
          const idx = (y*w + x)*4, sIdx = (y*w + srcX)*4;
          d[idx] = d[sIdx]; d[idx+1] = d[sIdx+1]; d[idx+2] = d[sIdx+2];
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'sketch') {
    const imgData = ctx.getImageData(0, 0, w, h); const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.3*d[i] + 0.59*d[i+1] + 0.11*d[i+2];
      const v = lum > 128 ? 255 : 0;
      d[i] = d[i+1] = d[i+2] = v;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'cartoon') {
    const imgData = ctx.getImageData(0, 0, w, h); const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.round(d[i] / 32) * 32;
      d[i+1] = Math.round(d[i+1] / 32) * 32;
      d[i+2] = Math.round(d[i+2] / 32) * 32;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'oilPaint') {
    ctx.filter = 'blur(3px) saturate(1.5) contrast(1.2)';
    const temp = document.createElement('canvas');
    temp.width = w; temp.height = h;
    temp.getContext('2d').drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(temp, 0, 0);
    ctx.filter = 'none';
    applySharpen(80);
  }
  else if (effect === 'sunrays') {
    const cx = w*0.7, cy = 0;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
    g.addColorStop(0, 'rgba(255, 240, 180, 0.6)'); g.addColorStop(0.3, 'rgba(255, 220, 100, 0.3)'); g.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI/5)*i + 0.3;
      ctx.strokeStyle = `rgba(255, 240, 180, ${0.3+Math.random()*0.2})`;
      ctx.lineWidth = Math.random()*30+20;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle)*w*1.5, cy + Math.sin(angle)*w*1.5); ctx.stroke();
    }
    ctx.restore();
  }
  else if (effect === 'spotlight') {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.6);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); g.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)'); g.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'rainbow') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    ['rgba(255,0,0,0.15)','rgba(255,165,0,0.15)','rgba(255,255,0,0.15)','rgba(0,255,0,0.15)','rgba(0,127,255,0.15)','rgba(75,0,130,0.15)','rgba(148,0,211,0.15)'].forEach((c, i) => g.addColorStop(i/6, c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'stars') {
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.9+0.1})`;
      ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*2+0.5, 0, Math.PI*2); ctx.fill();
    }
  }
  else if (effect === 'bokeh') {
    const c = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 80; i++) {
      const x = Math.random()*w, y = Math.random()*h, r = Math.random()*40+15;
      const color = c[Math.floor(Math.random()*c.length)];
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color + '88'); g.addColorStop(1, color + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
  }
  else if (effect === 'lightLeak') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255,100,50,0.4)'); g.addColorStop(0.5, 'rgba(255,100,50,0)'); g.addColorStop(1, 'rgba(100,200,255,0.4)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'lensFlare') {
    const g = ctx.createRadialGradient(w*0.8, h*0.3, 0, w*0.8, h*0.3, w*0.4);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)'); g.addColorStop(0.2, 'rgba(255, 240, 200, 0.5)');
    g.addColorStop(0.5, 'rgba(255, 200, 100, 0.2)'); g.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'grainOld') {
    const imgData = ctx.getImageData(0, 0, w, h); const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 50; d[i] += n; d[i+1] += n; d[i+2] += n; }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'scratch') {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 15; i++) {
      ctx.lineWidth = Math.random() * 2;
      const x = Math.random() * w;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.bezierCurveTo(x+20, h/3, x-20, h*2/3, x+10, h); ctx.stroke();
    }
  }
  else if (effect === 'faded') { Object.assign(state.filters, { contrast: 85, brightness: 110, saturation: 70, sepia: 15 }); applyFilters(); }
  else if (effect === 'sepiaTone') { Object.assign(state.filters, { sepia: 70, contrast: 110 }); applyFilters(); }
  else if (effect === 'dustSpots') {
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(${Math.random()*255},${Math.random()*200},${Math.random()*100},${Math.random()*0.5})`;
      ctx.beginPath(); ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3, 0, Math.PI*2); ctx.fill();
    }
  }
  else if (effect === 'tiltShift') {
    ctx.save(); ctx.filter = 'blur(6px)';
    ctx.drawImage(canvas, 0, 0, w, h*0.25, 0, 0, w, h*0.25);
    ctx.drawImage(canvas, 0, h*0.75, w, h*0.25, 0, h*0.75, w, h*0.25);
    ctx.restore();
  }
  else if (effect === 'radialBlur') {
    ctx.save(); ctx.filter = 'blur(4px)';
    for (let i = 1; i < 8; i++) { ctx.globalAlpha = 0.15; ctx.drawImage(canvas, w/2 - (w/2)*i/8, h/2 - (h/2)*i/8, w*i/8, h*i/8, 0, 0, w, h); }
    ctx.restore();
  }
  else if (effect === 'motionBlur') {
    ctx.save(); ctx.globalAlpha = 0.3;
    for (let i = 1; i < 10; i++) ctx.drawImage(canvas, i*3, 0);
    ctx.restore();
  }
  else if (effect === 'zoomBlur') {
    ctx.save(); ctx.globalAlpha = 0.2;
    for (let i = 1; i < 8; i++) ctx.drawImage(canvas, w*0.1*i, h*0.1*i, w - w*0.2*i, h - h*0.2*i, 0, 0, w, h);
    ctx.restore();
  }
  else if (effect === 'gaussianBlur') {
    ctx.filter = 'blur(8px)';
    const temp = document.createElement('canvas');
    temp.width = w; temp.height = h;
    temp.getContext('2d').drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(temp, 0, 0);
    ctx.filter = 'none';
  }
  else if (effect === 'heal') {
    showToast('Heal: random clone applied');
    if (canvas.width > 50 && canvas.height > 50) {
      const sx = Math.random() * (w - 40), sy = Math.random() * (h - 40);
      const dx = Math.random() * (w - 40), dy = Math.random() * (h - 40);
      const patch = ctx.getImageData(sx, sy, 40, 40);
      ctx.putImageData(patch, dx, dy);
    }
  }

  saveHistory();
  showToast(`${effect} applied ✨`);
}

function applySky(theme) {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  const g = ctx.createLinearGradient(0, 0, 0, h);
  const themes = {
    sunset: ['#ff6b35', '#f7931e', '#fbb040', '#a64ac9'],
    night: ['#0a0a1a', '#1a1a3a', '#2a2a5a', '#0a0a2a'],
    storm: ['#2c3e50', '#34495e', '#4a5f7a', '#1a1f2e'],
    aurora: ['#0a0a2a', '#0ff', '#a0f', '#0a0a2a'],
    clouds: ['#7f8fa6', '#a8b8c8', '#c8d8e8', '#7f8fa6'],
    warm: ['#ff9966', '#ffaa66', '#ffbb77', '#ff8844']
  };
  const cols = themes[theme] || themes.warm;
  cols.forEach((c, i) => g.addColorStop(i/(cols.length-1), c));
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.restore();
  saveHistory();
  showToast(`Sky: ${theme}`);
}

function applyShadow(type) {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;
  if (type === 'drop') {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 10; ctx.shadowOffsetY = 20;
    ctx.drawImage(canvas, 0, 0); ctx.restore();
  } else if (type === 'glow') {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(20px) brightness(1.5)';
    ctx.globalAlpha = 0.5; ctx.drawImage(canvas, 0, 0); ctx.restore();
    ctx.filter = 'none';
  } else if (type === 'outline') {
    ctx.save(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, w-20, h-20); ctx.restore();
  } else if (type === 'inner') {
    const g = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.3, w/2, h/2, Math.max(w,h)*0.7);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  bakeToOriginal(); saveHistory();
  showToast(`Shadow: ${type}`);
}

let drawing = false, lastX = 0, lastY = 0;
function getCanvasPoint(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}
function startDraw(e) {
  if (state.currentTool !== 'draw') return;
  e.preventDefault(); drawing = true;
  const p = getCanvasPoint(e); lastX = p.x; lastY = p.y;
  drawLayer.width = canvas.width; drawLayer.height = canvas.height;
  dctx.lineCap = 'round'; dctx.lineJoin = 'round';
  dctx.strokeStyle = state.drawColor;
  dctx.lineWidth = state.drawSize;
  dctx.shadowColor = state.drawColor;
  dctx.shadowBlur = state.drawSize / 2;
}
function moveDraw(e) {
  if (!drawing) return;
  e.preventDefault();
  const p = getCanvasPoint(e);
  dctx.beginPath(); dctx.moveTo(lastX, lastY); dctx.lineTo(p.x, p.y); dctx.stroke();
  lastX = p.x; lastY = p.y;
}
function endDraw() { drawing = false; }
canvas.addEventListener('pointerdown', startDraw);
canvas.addEventListener('pointermove', moveDraw);
canvas.addEventListener('pointerup', endDraw);
canvas.addEventListener('pointerleave', endDraw);
canvas.addEventListener('touchstart', startDraw, { passive: false });
canvas.addEventListener('touchmove', moveDraw, { passive: false });
canvas.addEventListener('touchend', endDraw);

function mergeDrawLayer() {
  if (drawLayer.width && drawLayer.style.opacity !== '0') {
    ctx.drawImage(drawLayer, 0, 0, canvas.width, canvas.height);
    dctx.clearRect(0, 0, drawLayer.width, drawLayer.height);
    drawLayer.classList.remove('active');
    drawLayer.style.opacity = '0';
    bakeToOriginal(); saveHistory();
    showToast('Drawing merged ✓');
  }
  closePanel();
}

let curveCanvasEl, curveCtx, draggingPoint = null;
function setupCurveEditor() {
  curveCanvasEl = document.getElementById('curveCanvas');
  if (!curveCanvasEl) return;
  curveCtx = curveCanvasEl.getContext('2d');
  drawCurve();
  const getPoint = e => {
    const rect = curveCanvasEl.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)) };
  };
  const findClosest = pt => {
    let closest = null, minDist = 0.05;
    state.curvePoints.forEach((p, i) => {
      const d = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (d < minDist) { minDist = d; closest = i; }
    });
    return closest;
  };
  const onDown = e => {
    e.preventDefault();
    const pt = getPoint(e);
    const idx = findClosest(pt);
    if (idx !== null) draggingPoint = idx;
    else {
      state.curvePoints.push({ x: pt.x, y: pt.y });
      state.curvePoints.sort((a,b) => a.x - b.x);
      draggingPoint = state.curvePoints.findIndex(p => p.x === pt.x && p.y === pt.y);
      drawCurve(); applyFilters();
    }
  };
  const onMove = e => {
    if (draggingPoint === null) return;
    e.preventDefault();
    const pt = getPoint(e);
    state.curvePoints[draggingPoint] = { x: pt.x, y: pt.y };
    drawCurve(); applyFilters();
  };
  const onUp = () => { if (draggingPoint !== null) { draggingPoint = null; saveHistory(); } };
  curveCanvasEl.addEventListener('pointerdown', onDown);
  curveCanvasEl.addEventListener('pointermove', onMove);
  curveCanvasEl.addEventListener('pointerup', onUp);
  curveCanvasEl.addEventListener('pointerleave', onUp);
  document.getElementById('curveResetBtn')?.addEventListener('click', () => {
    state.curvePoints = [{x: 0, y: 1}, {x: 1, y: 0}];
    drawCurve(); applyFilters();
  });
}
function drawCurve() {
  if (!curveCtx || !curveCanvasEl) return;
  const w = curveCanvasEl.width, h = curveCanvasEl.height;
  curveCtx.clearRect(0, 0, w, h);
  curveCtx.fillStyle = '#1c1c2a';
  curveCtx.fillRect(0, 0, w, h);
  curveCtx.strokeStyle = 'rgba(255,255,255,0.1)';
  curveCtx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    curveCtx.beginPath(); curveCtx.moveTo(0, (h/4)*i); curveCtx.lineTo(w, (h/4)*i); curveCtx.stroke();
    curveCtx.beginPath(); curveCtx.moveTo((w/4)*i, 0); curveCtx.lineTo((w/4)*i, h); curveCtx.stroke();
  }
  const pts = state.curvePoints.slice().sort((a,b) => a.x - b.x);
  curveCtx.strokeStyle = '#8b5cf6'; curveCtx.lineWidth = 2;
  curveCtx.beginPath();
  for (let i = 0; i < w; i++) {
    const t = i / w;
    let y = t;
    for (let p = 0; p < pts.length - 1; p++) {
      if (t >= pts[p].x && t <= pts[p+1].x) {
        const ratio = (t - pts[p].x) / (pts[p+1].x - pts[p].x || 1);
        y = pts[p].y + (pts[p+1].y - pts[p].y) * ratio;
        break;
      }
    }
    const py = h - y * h;
    if (i === 0) curveCtx.moveTo(i, py); else curveCtx.lineTo(i, py);
  }
  curveCtx.stroke();
  pts.forEach(p => {
    curveCtx.fillStyle = '#ec4899';
    curveCtx.beginPath(); curveCtx.arc(p.x * w, p.y * h, 6, 0, Math.PI*2); curveCtx.fill();
    curveCtx.strokeStyle = '#fff'; curveCtx.lineWidth = 2; curveCtx.stroke();
  });
}

/* ========== CROP with RESIZE HANDLES ========== */
let cropState = {
  active: false,
  x: 0, y: 0, w: 0, h: 0,
  ratio: 'free',
  mode: null,
  handleSize: 24,
  startX: 0, startY: 0,
  initial: null
};

function startCrop(ratio) {
  cropState.ratio = ratio || 'free';
  cropState.active = true;
  const overlay = document.getElementById('cropOverlay');
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  overlay.classList.add('active');
  let w = canvas.width * 0.7, h = canvas.height * 0.7;
  if (cropState.ratio !== 'free') {
    const [rw, rh] = cropState.ratio.split(':').map(Number);
    const r = rw / rh;
    if (w / h > r) w = h * r; else h = w / r;
  }
  cropState.x = (canvas.width - w) / 2;
  cropState.y = (canvas.height - h) / 2;
  cropState.w = w;
  cropState.h = h;
  drawCropOverlay();
  attachCropDrag();
}

function drawCropOverlay() {
  const overlay = document.getElementById('cropOverlay');
  const octx = overlay.getContext('2d');
  const { x, y, w, h, handleSize: hs } = cropState;
  octx.clearRect(0, 0, overlay.width, overlay.height);
  octx.fillStyle = 'rgba(0,0,0,0.6)';
  octx.fillRect(0, 0, overlay.width, overlay.height);
  octx.clearRect(x, y, w, h);
  octx.strokeStyle = '#8b5cf6';
  octx.lineWidth = 3;
  octx.strokeRect(x, y, w, h);
  // Rule-of-thirds grid
  octx.strokeStyle = 'rgba(255,255,255,0.4)';
  octx.lineWidth = 1;
  for (let i = 1; i < 3; i++) {
    octx.beginPath(); octx.moveTo(x + (w/3)*i, y); octx.lineTo(x + (w/3)*i, y + h); octx.stroke();
    octx.beginPath(); octx.moveTo(x, y + (h/3)*i); octx.lineTo(x + w, y + (h/3)*i); octx.stroke();
  }
  // 8 handles: 4 corners + 4 edges
  const handles = [
    { x: x, y: y, type: 'tl' },
    { x: x + w/2, y: y, type: 'tc' },
    { x: x + w, y: y, type: 'tr' },
    { x: x + w, y: y + h/2, type: 'rc' },
    { x: x + w, y: y + h, type: 'br' },
    { x: x + w/2, y: y + h, type: 'bc' },
    { x: x, y: y + h, type: 'bl' },
    { x: x, y: y + h/2, type: 'lc' }
  ];
  handles.forEach(hnd => {
    // Draw handle box
    octx.fillStyle = '#fff';
    octx.fillRect(hnd.x - hs/2, hnd.y - hs/2, hs, hs);
    octx.strokeStyle = '#8b5cf6';
    octx.lineWidth = 3;
    octx.strokeRect(hnd.x - hs/2, hnd.y - hs/2, hs, hs);
    // Draw inner dot
    octx.fillStyle = '#8b5cf6';
    octx.beginPath();
    octx.arc(hnd.x, hnd.y, hs/6, 0, Math.PI*2);
    octx.fill();
  });
}

function getOverlayPoint(e) {
  const overlay = document.getElementById('cropOverlay');
  const rect = overlay.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * (overlay.width / rect.width),
    y: (clientY - rect.top) * (overlay.height / rect.height)
  };
}

function hitTestHandle(px, py) {
  const { x, y, w, h, handleSize: hs } = cropState;
  const tolerance = hs;
  const handles = [
    { x: x, y: y, type: 'tl' },
    { x: x + w/2, y: y, type: 'tc' },
    { x: x + w, y: y, type: 'tr' },
    { x: x + w, y: y + h/2, type: 'rc' },
    { x: x + w, y: y + h, type: 'br' },
    { x: x + w/2, y: y + h, type: 'bc' },
    { x: x, y: y + h, type: 'bl' },
    { x: x, y: y + h/2, type: 'lc' }
  ];
  for (const hnd of handles) {
    if (Math.abs(px - hnd.x) < tolerance && Math.abs(py - hnd.y) < tolerance) {
      return hnd.type;
    }
  }
  return null;
}

function attachCropDrag() {
  const overlay = document.getElementById('cropOverlay');
  overlay.onpointerdown = (e) => {
    e.preventDefault();
    const pt = getOverlayPoint(e);
    const handle = hitTestHandle(pt.x, pt.y);
    if (handle) {
      cropState.mode = handle;
    } else if (pt.x >= cropState.x && pt.x <= cropState.x + cropState.w &&
               pt.y >= cropState.y && pt.y <= cropState.y + cropState.h) {
      cropState.mode = 'move';
    } else {
      return;
    }
    cropState.startX = pt.x;
    cropState.startY = pt.y;
    cropState.initial = { x: cropState.x, y: cropState.y, w: cropState.w, h: cropState.h };
    overlay.setPointerCapture(e.pointerId);
  };
  overlay.onpointermove = (e) => {
    if (!cropState.mode) return;
    e.preventDefault();
    const pt = getOverlayPoint(e);
    const dx = pt.x - cropState.startX;
    const dy = pt.y - cropState.startY;
    const init = cropState.initial;
    const W = overlay.width, H = overlay.height;
    const minSize = 40;

    if (cropState.mode === 'move') {
      cropState.x = Math.max(0, Math.min(W - init.w, init.x + dx));
      cropState.y = Math.max(0, Math.min(H - init.h, init.y + dy));
    } else {
      let nx = init.x, ny = init.y, nw = init.w, nh = init.h;
      const m = cropState.mode;
      if (m === 'tl') { nx = init.x + dx; ny = init.y + dy; nw = init.w - dx; nh = init.h - dy; }
      else if (m === 'tc') { ny = init.y + dy; nh = init.h - dy; }
      else if (m === 'tr') { ny = init.y + dy; nw = init.w + dx; nh = init.h - dy; }
      else if (m === 'rc') { nw = init.w + dx; }
      else if (m === 'br') { nw = init.w + dx; nh = init.h + dy; }
      else if (m === 'bc') { nh = init.h + dy; }
      else if (m === 'bl') { nx = init.x + dx; nw = init.w - dx; nh = init.h + dy; }
      else if (m === 'lc') { nx = init.x + dx; nw = init.w - dx; }

      // Min size
      if (nw < minSize) { if (m === 'tl' || m === 'bl' || m === 'lc') nx = init.x + init.w - minSize; nw = minSize; }
      if (nh < minSize) { if (m === 'tl' || m === 'tr' || m === 'tc') ny = init.y + init.h - minSize; nh = minSize; }

      // Apply ratio constraint for corners
      if (cropState.ratio !== 'free' && ['tl','tr','bl','br'].includes(m)) {
        const [rw, rh] = cropState.ratio.split(':').map(Number);
        const r = rw / rh;
        if (nw / nh > r) nh = nw / r; else nw = nh * r;
        if (m === 'tl') { nx = init.x + init.w - nw; ny = init.y + init.h - nh; }
        else if (m === 'tr') { ny = init.y + init.h - nh; }
        else if (m === 'bl') { nx = init.x + init.w - nw; }
      }

      // Clamp
      nx = Math.max(0, nx); ny = Math.max(0, ny);
      nw = Math.min(W - nx, nw); nh = Math.min(H - ny, nh);

      cropState.x = nx; cropState.y = ny; cropState.w = nw; cropState.h = nh;
    }
    drawCropOverlay();
  };
  overlay.onpointerup = (e) => {
    cropState.mode = null;
    try { overlay.releasePointerCapture(e.pointerId); } catch(err) {}
  };
  overlay.onpointercancel = () => { cropState.mode = null; };
}

function applyCrop() {
  if (!cropState.active) return showToast('No crop area');
  const { x, y, w, h } = cropState;
  const temp = document.createElement('canvas');
  temp.width = w; temp.height = h;
  temp.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    originalImage._scaledW = w;
    originalImage._scaledH = h;
    state.rotation = 0; state.flipH = false; state.flipV = false;
    canvas.width = w; canvas.height = h;
    applyFilters(); saveHistory();
    document.getElementById('cropOverlay').classList.remove('active');
    cropState.active = false;
    closePanel();
    showToast('Cropped ✓');
  };
  img.src = temp.toDataURL();
}

function applyPerspective() {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;
  const p = state.perspective;
  const temp = document.createElement('canvas');
  temp.width = w; temp.height = h;
  temp.getContext('2d').drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  const skewX = (p.tl - p.tr) / 200;
  const skewY = (p.bl - p.br) / 200;
  ctx.transform(1, skewY * 0.1, skewX * 0.1, 1, 0, 0);
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
  bakeToOriginal(); saveHistory(); closePanel();
  showToast('Perspective applied');
}

async function removeBackgroundAI() {
  if (!originalImage) return showToast('Upload image first!');
  if (typeof bodyPix === 'undefined') return showToast('AI loading... wait');
  const loading = document.getElementById('aiLoading');
  loading.classList.add('active');
  try {
    const net = await bodyPix.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
    const segmentation = await net.segmentPerson(canvas, { internalResolution: 'medium', segmentationThreshold: 0.7 });
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data, mask = segmentation.data;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === 0) d[i*4 + 3] = 0;
    }
    ctx.putImageData(imgData, 0, 0);
    bakeToOriginal(); saveHistory();
    loading.classList.remove('active'); closePanel();
    showToast('BG removed! 🤖✨');
  } catch (err) {
    loading.classList.remove('active');
    showToast('AI failed');
  }
}

async function aiEnhance() {
  if (!originalImage) return showToast('Upload image first!');
  const loading = document.getElementById('aiLoading');
  loading.classList.add('active');
  setTimeout(() => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    let sum = 0, count = 0, sumSat = 0;
    const hist = new Array(256).fill(0);
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
      hist[Math.round(lum)]++;
      sum += lum;
      const max = Math.max(d[i], d[i+1], d[i+2]);
      const min = Math.min(d[i], d[i+1], d[i+2]);
      sumSat += (max - min) / 255;
      count++;
    }
    const avgLum = sum / count;
    const avgSat = sumSat / count;
    let acc = 0, p1 = 0, p99 = 255;
    for (let i = 0; i < 256; i++) { acc += hist[i]; if (acc >= count * 0.02) { p1 = i; break; } }
    acc = 0;
    for (let i = 255; i >= 0; i--) { acc += hist[i]; if (acc >= count * 0.02) { p99 = i; break; } }
    Object.assign(state.filters, {
      blackPoint: p1, whitePoint: p99,
      brightness: avgLum < 110 ? 115 : (avgLum > 150 ? 95 : 100),
      contrast: 110, saturation: avgSat < 0.3 ? 115 : 105,
      vibrance: 25, clarity: 25, sharpness: 15
    });
    applyFilters(); saveHistory();
    loading.classList.remove('active'); closePanel();
    showToast('AI Enhanced! ✨');
  }, 800);
}

document.getElementById('compareBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  state.compareMode = !state.compareMode;
  document.getElementById('compareBtn').classList.toggle('active', state.compareMode);
  applyFilters();
  showToast(state.compareMode ? 'Showing original' : 'Showing edited');
});

function downloadImage(format = 'png') {
  if (!originalImage) return showToast('Upload image first!');
  const out = document.createElement('canvas');
  out.width = canvas.width; out.height = canvas.height;
  const octx = out.getContext('2d');
  octx.drawImage(canvas, 0, 0);
  if (drawLayer.width && drawLayer.style.opacity !== '0') {
    octx.drawImage(drawLayer, 0, 0, out.width, out.height);
  }
  const link = document.createElement('a');
  link.download = `PROS-EDITS-${Date.now()}.${format}`;
  link.href = out.toDataURL(`image/${format}`, 0.95);
  link.click();
  showToast('Saved! 💾');
}

document.getElementById('downloadBtn')?.addEventListener('click', () => downloadImage('png'));

document.getElementById('shareBtn')?.addEventListener('click', async () => {
  if (!originalImage) return showToast('Upload image first!');
  try {
    const out = document.createElement('canvas');
    out.width = canvas.width; out.height = canvas.height;
    out.getContext('2d').drawImage(canvas, 0, 0);
    const blob = await new Promise(res => out.toBlob(res, 'image/png', 1.0));
    const file = new File([blob], 'pros-edits.png', { type: 'image/png' });
    if (navigator.share) {
      await navigator.share({ files: [file], title: "PRO'S EDITS by AVR TECH LABS" });
    } else {
      showToast('Share not supported');
    }
  } catch(e) {}
});

const cameraModal = document.getElementById('cameraModal');
const video = document.getElementById('video');
let stream = null;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
  } catch (err) { showToast('Camera denied ❌'); }
}

document.getElementById('captureBtn')?.addEventListener('click', () => {
  const tc = document.createElement('canvas');
  tc.width = video.videoWidth; tc.height = video.videoHeight;
  tc.getContext('2d').drawImage(video, 0, 0);
  loadImage(tc.toDataURL('image/png'));
  closeCamera();
});
document.getElementById('closeCamera')?.addEventListener('click', closeCamera);
function closeCamera() {
  cameraModal.classList.remove('active');
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
}

document.getElementById('closeAppBtn')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.add('active');
});
document.getElementById('dropZone')?.addEventListener('click', () => {
  if (!originalImage) document.getElementById('sourceModal').classList.add('active');
});
document.getElementById('closeSource')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
});
document.getElementById('fromGallery')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadImage(ev.target.result);
    reader.readAsDataURL(file);
  };
  input.click();
});
document.getElementById('fromCamera')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
  cameraModal.classList.add('active');
  startCamera();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); doUndo(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); doRedo(); }
  if (e.key === 'Escape') closePanel();
});

updateUndoRedoUI();

console.log("%c PRO'S EDITS v10.0 · by AVR TECH LABS ", 'background: linear-gradient(135deg, #6d28d9, #ec4899); color: white; font-size: 18px; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
console.log('%c 80+ Tools · Resizable Crop · 24 Text Styles 🚀', 'color: #06b6d4; font-size: 14px;');
