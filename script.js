/* ============================================
   AVR PRO STUDIOS — ULTRA v4.0
   AI + 30 Filters + Effects + Mobile + Live Logo
   ============================================ */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('hide');
    showToast('Welcome to AVR PRO STUDIOS! 🎨📸');
  }, 3200);
});

// ---------- State ----------
const state = {
  filters: {
    exposure: 0, brightness: 100, contrast: 100, highlights: 0, shadows: 0, whites: 0, blacks: 0,
    saturation: 100, vibrance: 0, temperature: 0, tint: 0, hue: 0, sepia: 0, grayscale: 0, invert: 0,
    sharpness: 0, clarity: 0, denoise: 0, blur: 0, grain: 0,
    bokeh: 0, bgBlur: 0, skin: 0, vignette: 0, flare: 0
  },
  currentFilter: 'original',
  rotation: 0,
  flipH: false, flipV: false,
  history: [], historyIndex: -1,
  layers: [],
  activeLayer: 0,
  cropRatio: 'free',
  cropping: false
};

// ---------- 40+ FILTERS with Categories ----------
const FILTERS = {
  original: { css: '', cat: 'all' },
  // Cinematic
  teal: { css: 'contrast(1.15) saturate(1.1) hue-rotate(-15deg)', cat: 'cinematic' },
  orange: { css: 'contrast(1.1) saturate(1.2) sepia(0.15)', cat: 'cinematic' },
  blockbuster: { css: 'contrast(1.3) saturate(1.15) hue-rotate(-10deg) brightness(0.95)', cat: 'cinematic' },
  matrix: { css: 'contrast(1.2) hue-rotate(80deg) saturate(0.9)', cat: 'cinematic' },
  moody: { css: 'contrast(1.25) brightness(0.85) saturate(0.85)', cat: 'cinematic' },
  netflix: { css: 'contrast(1.2) saturate(1.1) brightness(0.92) hue-rotate(-5deg)', cat: 'cinematic' },
  hollywood: { css: 'contrast(1.15) saturate(1.15) sepia(0.1)', cat: 'cinematic' },
  // Vintage
  vintage: { css: 'sepia(0.4) contrast(1.1) brightness(0.95)', cat: 'vintage' },
  retro: { css: 'sepia(0.6) contrast(1.15) saturate(0.8)', cat: 'vintage' },
  oldFilm: { css: 'sepia(0.7) contrast(1.2) brightness(0.9) saturate(0.7)', cat: 'vintage' },
  sepia: { css: 'sepia(0.9) contrast(1.05)', cat: 'vintage' },
  faded: { css: 'contrast(0.85) brightness(1.1) saturate(0.7) sepia(0.15)', cat: 'vintage' },
  polaroid: { css: 'sepia(0.25) contrast(1.15) brightness(1.05)', cat: 'vintage' },
  kodak: { css: 'saturate(1.3) contrast(1.1) sepia(0.15)', cat: 'vintage' },
  lomo: { css: 'contrast(1.3) saturate(1.5) hue-rotate(-5deg)', cat: 'vintage' },
  // Modern
  vivid: { css: 'saturate(1.8) contrast(1.2)', cat: 'modern' },
  hdr: { css: 'contrast(1.3) saturate(1.4) brightness(1.05)', cat: 'modern' },
  dramatic: { css: 'contrast(1.5) brightness(0.9) saturate(0.8)', cat: 'modern' },
  fade: { css: 'contrast(0.9) brightness(1.1) saturate(0.7)', cat: 'modern' },
  fresh: { css: 'brightness(1.1) saturate(1.15) contrast(1.05)', cat: 'modern' },
  cyberpunk: { css: 'hue-rotate(280deg) saturate(1.8) contrast(1.2)', cat: 'modern' },
  warm: { css: 'sepia(0.3) saturate(1.5) hue-rotate(-10deg)', cat: 'modern' },
  cool: { css: 'hue-rotate(180deg) saturate(1.2)', cat: 'modern' },
  sunset: { css: 'sepia(0.5) saturate(1.6) hue-rotate(-20deg)', cat: 'modern' },
  goldenHour: { css: 'sepia(0.3) saturate(1.4) brightness(1.05) hue-rotate(-15deg)', cat: 'modern' },
  moonlight: { css: 'hue-rotate(200deg) brightness(0.9) saturate(0.9)', cat: 'modern' },
  // B&W
  bw: { css: 'grayscale(1) contrast(1.2)', cat: 'bw' },
  noir: { css: 'grayscale(1) contrast(1.5) brightness(0.9)', cat: 'bw' },
  highKey: { css: 'grayscale(1) brightness(1.3) contrast(0.9)', cat: 'bw' },
  lowKey: { css: 'grayscale(1) brightness(0.7) contrast(1.4)', cat: 'bw' },
  silvertone: { css: 'grayscale(0.9) contrast(1.1) sepia(0.15)', cat: 'bw' },
  // Neon
  neonPink: { css: 'hue-rotate(-60deg) saturate(2) contrast(1.2) brightness(1.1)', cat: 'neon' },
  neonBlue: { css: 'hue-rotate(180deg) saturate(2.5) contrast(1.3)', cat: 'neon' },
  neonPurple: { css: 'hue-rotate(250deg) saturate(2) contrast(1.2)', cat: 'neon' },
  neonGreen: { css: 'hue-rotate(90deg) saturate(2.2) contrast(1.2)', cat: 'neon' },
  neonYellow: { css: 'hue-rotate(30deg) saturate(2) brightness(1.1)', cat: 'neon' },
  // Nature
  forest: { css: 'hue-rotate(30deg) saturate(1.3) brightness(0.95)', cat: 'nature' },
  ocean: { css: 'hue-rotate(190deg) saturate(1.4) brightness(1.05)', cat: 'nature' },
  desert: { css: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-10deg)', cat: 'nature' },
  arctic: { css: 'hue-rotate(200deg) saturate(0.8) brightness(1.15) contrast(1.1)', cat: 'nature' },
  jungle: { css: 'hue-rotate(70deg) saturate(1.4) contrast(1.1) brightness(0.95)', cat: 'nature' }
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let originalImage = null;

// ---------- Toast ----------
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2500);
}

// ---------- History + Undo/Redo ----------
function saveHistory() {
  if (!originalImage) return;
  state.history = state.history.slice(0, state.historyIndex + 1);
  try {
    state.history.push(canvas.toDataURL());
    state.historyIndex++;
    if (state.history.length > 25) { state.history.shift(); state.historyIndex--; }
    updateUndoRedoUI();
  } catch(e) {}
}

function updateUndoRedoUI() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
  if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

function restoreFromHistory() {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    drawHistogram();
    updateUndoRedoUI();
  };
  img.src = state.history[state.historyIndex];
}

function doUndo() {
  if (state.historyIndex <= 0) return showToast('Nothing to undo');
  state.historyIndex--;
  restoreFromHistory();
  showToast('Undo ↩️');
}

function doRedo() {
  if (state.historyIndex >= state.history.length - 1) return showToast('Nothing to redo');
  state.historyIndex++;
  restoreFromHistory();
  showToast('Redo ↪️');
}

document.getElementById('undoBtn')?.addEventListener('click', doUndo);
document.getElementById('redoBtn')?.addEventListener('click', doRedo);

// ---------- Apply Filters ----------
function applyFilters() {
  if (!originalImage) return;
  const f = state.filters;
  const brightness = f.brightness + (f.exposure * 0.5);
  const filterCss = FILTERS[state.currentFilter]?.css || '';

  const filterStr = `
    brightness(${brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%)
    blur(${f.blur}px) hue-rotate(${f.hue}deg) sepia(${f.sepia}%) grayscale(${f.grayscale}%) invert(${f.invert}%)
    ${filterCss}
  `.trim();

  const isRotated90 = state.rotation === 90 || state.rotation === 270;
  if (isRotated90) {
    canvas.width = originalImage.height;
    canvas.height = originalImage.width;
  } else {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
  }

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.flipH ? -1 : 1, state.flipV ? -1 : 1);
  ctx.filter = filterStr;
  ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);
  ctx.restore();

  applyPixelEffects();
  drawHistogram();
}

function applyPixelEffects() {
  const f = state.filters;
  const needs = f.highlights || f.shadows || f.whites || f.blacks ||
                f.temperature || f.tint || f.vibrance ||
                f.sharpness || f.clarity || f.grain;
  if (!needs) return;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  const len = d.length;
  const tempR = f.temperature * 0.5, tempB = -f.temperature * 0.5;
  const tintG = -f.tint * 0.5, tintR = f.tint * 0.3, tintB = f.tint * 0.3;

  for (let i = 0; i < len; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    r += tempR + tintR; g += tintG; b += tempB + tintB;
    const lum = 0.299*r + 0.587*g + 0.114*b;
    if (f.highlights && lum > 128) { const a = ((lum-128)/127)*f.highlights*0.8; r+=a; g+=a; b+=a; }
    if (f.shadows && lum < 128) { const a = ((128-lum)/128)*f.shadows*0.8; r+=a; g+=a; b+=a; }
    if (f.whites && lum > 200) { const a = f.whites*0.5; r+=a; g+=a; b+=a; }
    if (f.blacks && lum < 50) { const a = f.blacks*0.5; r+=a; g+=a; b+=a; }
    if (f.vibrance) {
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      const sat = max - min;
      const a = (1-sat/255)*f.vibrance*0.5;
      const avg = (r+g+b)/3;
      r += (r-avg)*a/100; g += (g-avg)*a/100; b += (b-avg)*a/100;
    }
    if (f.grain) { const n = (Math.random()-0.5)*f.grain*0.8; r+=n; g+=n; b+=n; }
    d[i] = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imgData, 0, 0);

  if (f.sharpness > 0 || f.clarity > 0) applyConvolution(Math.max(f.sharpness, f.clarity)/100);

  if (f.vignette > 0) {
    const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.3, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)*0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${f.vignette/100})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (f.flare > 0) {
    const grad = ctx.createRadialGradient(canvas.width*0.8, canvas.height*0.2, 0, canvas.width*0.8, canvas.height*0.2, canvas.width*0.5);
    grad.addColorStop(0, `rgba(255,220,150,${f.flare/100*0.6})`);
    grad.addColorStop(1, 'rgba(255,220,150,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function applyConvolution(strength) {
  const w = canvas.width, h = canvas.height;
  const src = ctx.getImageData(0, 0, w, h);
  const out = ctx.createImageData(w, h);
  const s = src.data, o = out.data;
  const k = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const mix = Math.min(1, strength);
  for (let y = 1; y < h-1; y++) {
    for (let x = 1; x < w-1; x++) {
      const i = (y*w+x)*4;
      let r=0, g=0, b=0, ki=0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const j = ((y+dy)*w+(x+dx))*4;
          r += s[j]*k[ki]; g += s[j+1]*k[ki]; b += s[j+2]*k[ki];
          ki++;
        }
      }
      o[i] = s[i]*(1-mix) + Math.max(0,Math.min(255,r))*mix;
      o[i+1] = s[i+1]*(1-mix) + Math.max(0,Math.min(255,g))*mix;
      o[i+2] = s[i+2]*(1-mix) + Math.max(0,Math.min(255,b))*mix;
      o[i+3] = s[i+3];
    }
  }
  ctx.putImageData(out, 0, 0);
}

// ---------- Histogram ----------
function drawHistogram() {
  const hist = document.getElementById('histogram');
  if (!hist) return;
  const hctx = hist.getContext('2d');
  hist.width = 200; hist.height = 80;
  hctx.clearRect(0, 0, 200, 80);
  try {
    const small = document.createElement('canvas');
    small.width = 100; small.height = 60;
    small.getContext('2d').drawImage(canvas, 0, 0, 100, 60);
    const data = small.getContext('2d').getImageData(0, 0, 100, 60).data;
    const rH = new Array(256).fill(0), gH = new Array(256).fill(0), bH = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) { rH[data[i]]++; gH[data[i+1]]++; bH[data[i+2]]++; }
    const max = Math.max(...rH, ...gH, ...bH) || 1;
    const draw = (arr, color) => {
      hctx.fillStyle = color;
      for (let i = 0; i < 256; i++) {
        const barH = (arr[i]/max) * 70;
        hctx.fillRect(i*(200/256), 80-barH, 200/256, barH);
      }
    };
    hctx.globalAlpha = 0.5;
    draw(rH, '#ff0044'); draw(gH, '#00ff44'); draw(bH, '#0044ff');
    hctx.globalAlpha = 1;
  } catch(e) {}
}

// ---------- Load Image ----------
function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    canvas.width = img.width;
    canvas.height = img.height;
    applyFilters();
    document.getElementById('dropZone').classList.add('hide');
    setTimeout(() => { saveHistory(); buildFilterPreviews(); }, 150);
    showToast('Photo loaded! Try AUTO MAGIC ✨');
  };
  img.src = src;
}

// ---------- Upload ----------
document.getElementById('uploadBtn').addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadImage(ev.target.result);
    reader.readAsDataURL(file);
  };
  input.click();
});

// ---------- Drag & Drop ----------
const dropZone = document.getElementById('dropZone');
const canvasArea = document.getElementById('canvasArea');
['dragenter', 'dragover'].forEach(ev => {
  canvasArea.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
    dropZone.classList.remove('hide');
  });
});
['dragleave', 'drop'].forEach(ev => {
  canvasArea.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (originalImage) dropZone.classList.add('hide');
  });
});
canvasArea.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (ev) => loadImage(ev.target.result);
    reader.readAsDataURL(file);
  }
});

// ---------- Sliders ----------
const sliderMap = {
  exposure: ['exposure', 'exposureVal', ''],
  brightness: ['brightness', 'brightnessVal', '%'],
  contrast: ['contrast', 'contrastVal', '%'],
  highlights: ['highlights', 'highlightsVal', ''],
  shadows: ['shadows', 'shadowsVal', ''],
  whites: ['whites', 'whitesVal', ''],
  blacks: ['blacks', 'blacksVal', ''],
  saturation: ['saturation', 'saturationVal', '%'],
  vibrance: ['vibrance', 'vibranceVal', ''],
  temperature: ['temperature', 'temperatureVal', ''],
  tint: ['tint', 'tintVal', ''],
  hue: ['hue', 'hueVal', '°'],
  sepia: ['sepia', 'sepiaVal', '%'],
  grayscale: ['grayscale', 'grayVal', '%'],
  sharpness: ['sharpness', 'sharpnessVal', ''],
  clarity: ['clarity', 'clarityVal', ''],
  blur: ['blur', 'blurVal', 'px'],
  grain: ['grain', 'grainVal', ''],
  bokeh: ['bokeh', 'bokehVal', ''],
  skin: ['skin', 'skinVal', ''],
  vignette: ['vignette', 'vignetteVal', ''],
  flare: ['flare', 'flareVal', '']
};

let sliderTimeout;
Object.keys(sliderMap).forEach(key => {
  const [elId, valId, suffix] = sliderMap[key];
  const input = document.getElementById(elId);
  const label = document.getElementById(valId);
  if (!input || !label) return;
  input.addEventListener('input', (e) => {
    state.filters[key] = parseFloat(e.target.value);
    label.textContent = e.target.value + suffix;
    clearTimeout(sliderTimeout);
    sliderTimeout = setTimeout(applyFilters, 30);
  });
  input.addEventListener('change', () => saveHistory());
});

// ---------- Tabs ----------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  });
});

// ---------- Filter Previews ----------
let currentFilterCat = 'all';
function buildFilterPreviews() {
  const grid = document.getElementById('filterGrid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(FILTERS).forEach(name => {
    const data = FILTERS[name];
    if (currentFilterCat !== 'all' && data.cat !== currentFilterCat) return;

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
      applyFilters();
      saveHistory();
      showToast(`Filter: ${label.textContent}`);
    });
    grid.appendChild(item);
  });
}

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilterCat = btn.dataset.cat;
    buildFilterPreviews();
  });
});

// ---------- Toolbar ----------
document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (tool === 'move') return showToast('Move tool ready');
    if (tool === 'crop') {
      if (!originalImage) return showToast('Upload image first!');
      document.querySelector('.tab[data-tab="crop"]').click();
      openControlsMobile();
      showToast('Crop mode — choose ratio ✂️');
    }
    if (tool === 'rotate') {
      if (!originalImage) return showToast('Upload image first!');
      state.rotation = (state.rotation + 90) % 360;
      applyFilters(); saveHistory();
      showToast('Rotated 90° 🔄');
    }
    if (tool === 'flip') {
      if (!originalImage) return showToast('Upload image first!');
      state.flipH = !state.flipH;
      applyFilters(); saveHistory();
      showToast('Flipped ↔️');
    }
    if (tool === 'text') {
      if (!originalImage) return showToast('Upload image first!');
      document.getElementById('textModal').classList.add('active');
    }
    if (tool === 'sticker') {
      if (!originalImage) return showToast('Upload image first!');
      document.getElementById('stickerModal').classList.add('active');
    }
    if (tool === 'brush') {
      if (!originalImage) return showToast('Upload image first!');
      showToast('Brush: click canvas to paint');
      canvas.style.cursor = 'crosshair';
    }
    if (tool === 'ai-bg') {
      if (!originalImage) return showToast('Upload image first!');
      removeBackgroundAI();
    }
    if (tool === 'layers') {
      document.querySelector('.tab[data-tab="layers"]').click();
      openControlsMobile();
      showToast('Layers panel opened 📚');
    }
    if (tool === 'undo') doUndo();
    if (tool === 'redo') doRedo();
    if (tool === 'reset') resetAll();
  });
});

// Brush
canvas.addEventListener('click', (e) => {
  const activeTool = document.querySelector('.tool-btn.active')?.dataset.tool;
  if (activeTool !== 'brush') return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  ctx.fillStyle = '#ff0066';
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fill();
  saveHistory();
});

// ---------- Reset ----------
function resetAll() {
  if (!originalImage) return showToast('Nothing to reset');
  Object.keys(state.filters).forEach(k => {
    state.filters[k] = (k === 'brightness' || k === 'contrast' || k === 'saturation') ? 100 : 0;
  });
  state.currentFilter = 'original';
  state.rotation = 0; state.flipH = false; state.flipV = false;
  Object.keys(sliderMap).forEach(key => {
    const [elId, valId, suffix] = sliderMap[key];
    const input = document.getElementById(elId);
    const label = document.getElementById(valId);
    if (!input || !label) return;
    input.value = (key === 'brightness' || key === 'contrast' || key === 'saturation') ? 100 : 0;
    label.textContent = input.value + suffix;
  });
  document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
  applyFilters(); saveHistory();
  showToast('All reset! 🗑️');
}
document.getElementById('resetAll')?.addEventListener('click', resetAll);

// ---------- Compare ----------
document.getElementById('compareBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  const saved = JSON.parse(JSON.stringify(state.filters));
  const savedF = state.currentFilter, savedR = state.rotation, savedFH = state.flipH;
  Object.keys(state.filters).forEach(k => {
    state.filters[k] = (k === 'brightness' || k === 'contrast' || k === 'saturation') ? 100 : 0;
  });
  state.currentFilter = 'original'; state.rotation = 0; state.flipH = false;
  applyFilters();
  showToast('ORIGINAL 👁️');
  setTimeout(() => {
    state.filters = saved; state.currentFilter = savedF;
    state.rotation = savedR; state.flipH = savedFH;
    applyFilters();
    showToast('EDITED ✨');
  }, 1500);
});

document.getElementById('historyBtn')?.addEventListener('click', () => {
  showToast(`History: ${state.historyIndex + 1}/${state.history.length}`);
});

// ---------- Presets ----------
document.getElementById('presetBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  const presets = {
    'Portrait Pro': { brightness: 105, contrast: 108, saturation: 108, vibrance: 25, temperature: 8, highlights: -15, shadows: 20, skin: 40, vignette: 15 },
    'Cinematic': { brightness: 95, contrast: 125, saturation: 115, temperature: -10, shadows: 25, highlights: -20, vignette: 30, grain: 15, clarity: 25 },
    'Clean Studio': { brightness: 110, contrast: 105, vibrance: 15, whites: 15, clarity: 20, sharpness: 30 },
    'Moody Dark': { brightness: 85, contrast: 130, saturation: 90, temperature: -15, blacks: -20, vignette: 45, grain: 10 },
    'Warm Glow': { brightness: 108, contrast: 105, saturation: 115, temperature: 25, vibrance: 20, highlights: -10, shadows: 15, flare: 20 }
  };
  const pick = prompt('Preset:\n' + Object.keys(presets).join('\n'), 'Portrait Pro');
  if (pick && presets[pick]) {
    Object.keys(state.filters).forEach(k => {
      state.filters[k] = (k === 'brightness' || k === 'contrast' || k === 'saturation') ? 100 : 0;
    });
    Object.assign(state.filters, presets[pick]);
    Object.keys(sliderMap).forEach(key => {
      const [elId, valId, suffix] = sliderMap[key];
      const input = document.getElementById(elId);
      const label = document.getElementById(valId);
      if (!input || !label || state.filters[key] === undefined) return;
      input.value = state.filters[key];
      label.textContent = input.value + suffix;
    });
    applyFilters(); saveHistory();
    showToast(`Preset: ${pick} 🎬`);
  }
});

// ---------- Download ----------
document.getElementById('downloadBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  const link = document.createElement('a');
  link.download = `AVR-Pro-Studios-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  showToast('Downloaded! 💾');
});

// ---------- AUTO MAGIC ----------
document.getElementById('autoEnhanceBtn')?.addEventListener('click', (e) => {
  if (!originalImage) return showToast('Upload image first!');
  const btn = e.currentTarget;
  btn.classList.add('loading');
  showToast('Analyzing image... 🔍');
  setTimeout(() => {
    const small = document.createElement('canvas');
    small.width = 100; small.height = 100;
    small.getContext('2d').drawImage(canvas, 0, 0, 100, 100);
    const data = small.getContext('2d').getImageData(0, 0, 100, 100).data;
    let rS=0, gS=0, bS=0, lS=0, c=0;
    for (let i = 0; i < data.length; i += 4) {
      rS += data[i]; gS += data[i+1]; bS += data[i+2];
      lS += 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2];
      c++;
    }
    const avgL = lS/c, rA = rS/c, bA = bS/c;
    const cc = rA - bA, ld = 128 - avgL;
    state.filters.brightness = Math.max(80, Math.min(140, 100 + ld*0.5));
    state.filters.contrast = 115 + Math.abs(ld)*0.15;
    state.filters.saturation = 108;
    state.filters.vibrance = 35;
    state.filters.temperature = Math.max(-15, Math.min(15, -cc*0.3));
    state.filters.highlights = -12;
    state.filters.shadows = 18;
    state.filters.whites = 8;
    state.filters.blacks = -6;
    state.filters.clarity = 22;
    state.filters.sharpness = 28;
    state.filters.vignette = 12;
    Object.keys(sliderMap).forEach(key => {
      const [elId, valId, suffix] = sliderMap[key];
      const input = document.getElementById(elId);
      const label = document.getElementById(valId);
      if (!input || !label || state.filters[key] === undefined) return;
      input.value = Math.round(state.filters[key]);
      label.textContent = input.value + suffix;
    });
    applyFilters(); saveHistory();
    btn.classList.remove('loading');
    showToast('AUTO MAGIC applied! ✨📸');
  }, 800);
});

// ---------- HDR ----------
document.getElementById('hdrBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  Object.assign(state.filters, { contrast: 130, saturation: 135, highlights: -25, shadows: 35, clarity: 40, whites: 15 });
  ['contrast','saturation','highlights','shadows','clarity','whites'].forEach(k => {
    const [elId, valId, suffix] = sliderMap[k];
    const inp = document.getElementById(elId), lbl = document.getElementById(valId);
    if (inp) { inp.value = Math.round(state.filters[k]); lbl.textContent = inp.value + suffix; }
  });
  applyFilters(); saveHistory();
  showToast('HDR Boost! 🌅');
});

// ---------- Portrait ----------
document.getElementById('portraitBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  Object.assign(state.filters, { skin: 55, bokeh: 35, brightness: 108, vibrance: 20, highlights: -12 });
  ['skin','bokeh','brightness','vibrance','highlights'].forEach(k => {
    const [elId, valId, suffix] = sliderMap[k];
    const inp = document.getElementById(elId), lbl = document.getElementById(valId);
    if (inp) { inp.value = Math.round(state.filters[k]); lbl.textContent = inp.value + suffix; }
  });
  applyFilters(); saveHistory();
  showToast('Portrait Mode! 👤✨');
});

// ============================================
// AI BACKGROUND REMOVE
// ============================================
async function removeBackgroundAI() {
  if (!originalImage) return showToast('Upload image first!');
  if (typeof bodyPix === 'undefined') return showToast('AI model loading... wait 5s');
  const loading = document.getElementById('aiLoading');
  const progress = document.getElementById('aiProgress');
  loading.classList.add('active');
  progress.textContent = 'Loading AI model... (10s)';
  try {
    const net = await bodyPix.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
    progress.textContent = 'Detecting person...';
    await new Promise(r => setTimeout(r, 100));
    const segmentation = await net.segmentPerson(canvas, { internalResolution: 'medium', segmentationThreshold: 0.7 });
    progress.textContent = 'Removing background...';
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const mask = segmentation.data;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === 0) d[i*4 + 3] = 0;
    }
    ctx.putImageData(imgData, 0, 0);
    const checker = document.createElement('canvas');
    checker.width = canvas.width; checker.height = canvas.height;
    const cctx = checker.getContext('2d');
    for (let y = 0; y < canvas.height; y += 20) {
      for (let x = 0; x < canvas.width; x += 20) {
        cctx.fillStyle = ((x/20 + y/20) % 2 === 0) ? '#2a2a3a' : '#1c1c2a';
        cctx.fillRect(x, y, 20, 20);
      }
    }
    const final = document.createElement('canvas');
    final.width = canvas.width; final.height = canvas.height;
    const fctx = final.getContext('2d');
    fctx.drawImage(checker, 0, 0);
    fctx.drawImage(canvas, 0, 0);
    originalImage = final;
    applyFilters();
    saveHistory();
    loading.classList.remove('active');
    showToast('Background removed! 🤖✨');
  } catch (err) {
    loading.classList.remove('active');
    console.error(err);
    showToast('AI failed — try smaller image');
  }
}
document.getElementById('aiBgBtn')?.addEventListener('click', removeBackgroundAI);

// ============================================
// CROP with Aspect Ratios
// ============================================
let cropState = { active: false, x: 0, y: 0, w: 0, h: 0, ratio: 'free' };

document.querySelectorAll('.ratio-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!originalImage) return showToast('Upload image first!');
    document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cropState.ratio = btn.dataset.ratio;
    startCrop();
  });
});

function startCrop() {
  cropState.active = true;
  const overlay = document.getElementById('cropOverlay');
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  overlay.classList.add('active');
  let w = canvas.width * 0.7;
  let h = canvas.height * 0.7;
  if (cropState.ratio !== 'free') {
    const [rw, rh] = cropState.ratio.split(':').map(Number);
    const ratio = rw / rh;
    if (w / h > ratio) w = h * ratio;
    else h = w / ratio;
  }
  cropState.x = (canvas.width - w) / 2;
  cropState.y = (canvas.height - h) / 2;
  cropState.w = w;
  cropState.h = h;
  drawCropOverlay();
}

function drawCropOverlay() {
  const overlay = document.getElementById('cropOverlay');
  const octx = overlay.getContext('2d');
  octx.clearRect(0, 0, overlay.width, overlay.height);
  octx.fillStyle = 'rgba(0,0,0,0.6)';
  octx.fillRect(0, 0, overlay.width, overlay.height);
  octx.clearRect(cropState.x, cropState.y, cropState.w, cropState.h);
  octx.strokeStyle = '#8b5cf6';
  octx.lineWidth = 3;
  octx.strokeRect(cropState.x, cropState.y, cropState.w, cropState.h);
  octx.strokeStyle = 'rgba(255,255,255,0.4)';
  octx.lineWidth = 1;
  for (let i = 1; i < 3; i++) {
    octx.beginPath();
    octx.moveTo(cropState.x + (cropState.w/3)*i, cropState.y);
    octx.lineTo(cropState.x + (cropState.w/3)*i, cropState.y + cropState.h);
    octx.stroke();
    octx.beginPath();
    octx.moveTo(cropState.x, cropState.y + (cropState.h/3)*i);
    octx.lineTo(cropState.x + cropState.w, cropState.y + (cropState.h/3)*i);
    octx.stroke();
  }
}

document.getElementById('applyCrop')?.addEventListener('click', () => {
  if (!cropState.active) return;
  const temp = document.createElement('canvas');
  temp.width = cropState.w;
  temp.height = cropState.h;
  temp.getContext('2d').drawImage(canvas, cropState.x, cropState.y, cropState.w, cropState.h, 0, 0, cropState.w, cropState.h);
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    canvas.width = img.width;
    canvas.height = img.height;
    applyFilters();
    saveHistory();
    cancelCrop();
    showToast('Cropped! ✂️');
  };
  img.src = temp.toDataURL();
});

document.getElementById('cancelCrop')?.addEventListener('click', cancelCrop);
function cancelCrop() {
  cropState.active = false;
  document.getElementById('cropOverlay').classList.remove('active');
}

// Crop drag
const cropOverlay = document.getElementById('cropOverlay');
let dragging = false, dragStart = {x:0, y:0};

cropOverlay.addEventListener('mousedown', (e) => {
  if (!cropState.active) return;
  const rect = cropOverlay.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (cropOverlay.width / rect.width);
  const my = (e.clientY - rect.top) * (cropOverlay.height / rect.height);
  if (mx > cropState.x && mx < cropState.x + cropState.w && my > cropState.y && my < cropState.y + cropState.h) {
    dragging = true;
    dragStart = { x: mx - cropState.x, y: my - cropState.y };
  }
});
cropOverlay.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = cropOverlay.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (cropOverlay.width / rect.width);
  const my = (e.clientY - rect.top) * (cropOverlay.height / rect.height);
  cropState.x = Math.max(0, Math.min(cropOverlay.width - cropState.w, mx - dragStart.x));
  cropState.y = Math.max(0, Math.min(cropOverlay.height - cropState.h, my - dragStart.y));
  drawCropOverlay();
});
cropOverlay.addEventListener('mouseup', () => dragging = false);
cropOverlay.addEventListener('mouseleave', () => dragging = false);

// Touch crop
cropOverlay.addEventListener('touchstart', (e) => {
  if (!cropState.active) return;
  const t = e.touches[0];
  const rect = cropOverlay.getBoundingClientRect();
  const mx = (t.clientX - rect.left) * (cropOverlay.width / rect.width);
  const my = (t.clientY - rect.top) * (cropOverlay.height / rect.height);
  if (mx > cropState.x && mx < cropState.x + cropState.w && my > cropState.y && my < cropState.y + cropState.h) {
    dragging = true;
    dragStart = { x: mx - cropState.x, y: my - cropState.y };
  }
}, { passive: true });

cropOverlay.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  e.preventDefault();
  const t = e.touches[0];
  const rect = cropOverlay.getBoundingClientRect();
  const mx = (t.clientX - rect.left) * (cropOverlay.width / rect.width);
  const my = (t.clientY - rect.top) * (cropOverlay.height / rect.height);
  cropState.x = Math.max(0, Math.min(cropOverlay.width - cropState.w, mx - dragStart.x));
  cropState.y = Math.max(0, Math.min(cropOverlay.height - cropState.h, my - dragStart.y));
  drawCropOverlay();
}, { passive: false });

cropOverlay.addEventListener('touchend', () => dragging = false);

// ============================================
// LAYERS
// ============================================
function addLayer(name = 'Layer') {
  if (!originalImage) return showToast('Upload image first!');
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = canvas.width;
  layerCanvas.height = canvas.height;
  layerCanvas.getContext('2d').drawImage(canvas, 0, 0);
  state.layers.push({
    id: Date.now(),
    name: `${name} ${state.layers.length + 1}`,
    canvas: layerCanvas,
    visible: true,
    opacity: 100
  });
  renderLayersList();
  showToast(`Layer added: ${name} 📚`);
}

function renderLayersList() {
  const list = document.getElementById('layersList');
  if (!list) return;
  list.innerHTML = '';
  state.layers.forEach((layer, idx) => {
    const item = document.createElement('div');
    item.className = 'layer-item' + (idx === state.activeLayer ? ' active' : '');
    item.innerHTML = `
      <div class="layer-thumb" style="background-image: url(${layer.canvas.toDataURL()})"></div>
      <div class="layer-info">
        <h4>${layer.name}</h4>
        <p>Opacity: ${layer.opacity}%</p>
      </div>
      <div class="layer-actions">
        <button data-action="toggle"><i class="fas fa-eye"></i></button>
        <button data-action="delete"><i class="fas fa-trash"></i></button>
      </div>
    `;
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      state.activeLayer = idx;
      renderLayersList();
    });
    item.querySelector('[data-action="toggle"]').addEventListener('click', () => {
      layer.visible = !layer.visible;
      renderLayersList();
    });
    item.querySelector('[data-action="delete"]').addEventListener('click', () => {
      state.layers.splice(idx, 1);
      state.activeLayer = Math.max(0, state.activeLayer - 1);
      renderLayersList();
      showToast('Layer deleted 🗑️');
    });
    list.appendChild(item);
  });
}

document.getElementById('addLayerBtn')?.addEventListener('click', () => addLayer());
document.getElementById('mergeLayersBtn')?.addEventListener('click', () => {
  if (state.layers.length === 0) return showToast('No layers to merge');
  const merged = document.createElement('canvas');
  merged.width = canvas.width;
  merged.height = canvas.height;
  const mctx = merged.getContext('2d');
  mctx.drawImage(canvas, 0, 0);
  state.layers.forEach(l => { if (l.visible) mctx.drawImage(l.canvas, 0, 0); });
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    applyFilters();
    saveHistory();
    state.layers = [];
    renderLayersList();
    showToast('Layers merged! 🔗');
  };
  img.src = merged.toDataURL();
});

// ============================================
// KOTHA EFFECTS — Rain, Snow, Fire, etc.
// ============================================
function applySpecialEffect(effect) {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;

  if (effect === 'rain') {
    ctx.strokeStyle = 'rgba(180, 200, 255, 0.6)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3, y + 15);
      ctx.stroke();
    }
  }
  else if (effect === 'snow') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (effect === 'confetti') {
    const colors = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, 6, 10);
    }
  }
  else if (effect === 'fire') {
    const grad = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.8);
    grad.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
    grad.addColorStop(0.5, 'rgba(255, 100, 20, 0.5)');
    grad.addColorStop(1, 'rgba(255, 30, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * w;
      const y = h - Math.random() * h * 0.4;
      ctx.fillStyle = `rgba(255, ${150 + Math.random()*100}, 0, ${Math.random()*0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.random()*3+1, 0, Math.PI*2);
      ctx.fill();
    }
  }
  else if (effect === 'sparkle') {
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const size = Math.random() * 8 + 4;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.8+0.2})`;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size/3, y - size/3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size/3, y + size/3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size/3, y + size/3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size/3, y - size/3);
      ctx.closePath();
      ctx.fill();
    }
  }
  else if (effect === 'bokehLight') {
    const colors = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 40 + 15;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color + '88');
      g.addColorStop(1, color + '00');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (effect === 'vignettePro') {
    const g = ctx.createRadialGradient(w/2, h/2, Math.min(w, h)/3, w/2, h/2, Math.max(w, h)/1.1);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'filmGrain') {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 40;
      d[i] += n; d[i+1] += n; d[i+2] += n;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'glow') {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.35;
    ctx.filter = 'blur(20px) brightness(1.2)';
    ctx.drawImage(canvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
  }
  else if (effect === 'mirror') {
    const half = document.createElement('canvas');
    half.width = w / 2; half.height = h;
    half.getContext('2d').drawImage(canvas, 0, 0, w/2, h, 0, 0, w/2, h);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(half, -w, 0);
    ctx.restore();
  }
  else if (effect === 'dragan') {
    state.filters.clarity = 60;
    state.filters.contrast = 125;
    state.filters.saturation = 85;
    state.filters.shadows = -20;
    applyFilters();
  }
  else if (effect === 'orTon') {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.4;
    ctx.filter = 'blur(30px) saturate(1.5)';
    ctx.drawImage(canvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
  }
  else if (effect === 'sunrays') {
    const cx = w * 0.7, cy = 0;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
    grad.addColorStop(0, 'rgba(255, 240, 180, 0.6)');
    grad.addColorStop(0.3, 'rgba(255, 220, 100, 0.3)');
    grad.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i + 0.3;
      ctx.strokeStyle = `rgba(255, 240, 180, ${0.3 + Math.random()*0.2})`;
      ctx.lineWidth = Math.random() * 30 + 20;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * w * 1.5, cy + Math.sin(angle) * w * 1.5);
      ctx.stroke();
    }
    ctx.restore();
  }
  else if (effect === 'spotlight') {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)*0.6);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'rainbow') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
    grad.addColorStop(0.17, 'rgba(255, 165, 0, 0.15)');
    grad.addColorStop(0.33, 'rgba(255, 255, 0, 0.15)');
    grad.addColorStop(0.5, 'rgba(0, 255, 0, 0.15)');
    grad.addColorStop(0.67, 'rgba(0, 127, 255, 0.15)');
    grad.addColorStop(0.83, 'rgba(75, 0, 130, 0.15)');
    grad.addColorStop(1, 'rgba(148, 0, 211, 0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'stars') {
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 2 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.9+0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  else if (effect === 'neonGlow') {
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 40;
    ctx.filter = 'saturate(2) hue-rotate(280deg)';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(canvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  }
  else if (effect === 'vhsGlitch') {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let y = 0; y < h; y += 3) {
      if (Math.random() > 0.85) {
        const shift = Math.floor((Math.random() - 0.5) * 30);
        for (let x = 0; x < w; x++) {
          const srcX = Math.max(0, Math.min(w-1, x + shift));
          const idx = (y * w + x) * 4;
          const sIdx = (y * w + srcX) * 4;
          d[idx] = d[sIdx];
          d[idx+1] = d[sIdx+1];
          d[idx+2] = d[sIdx+2];
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'lensFlare') {
    const grad = ctx.createRadialGradient(w*0.8, h*0.3, 0, w*0.8, h*0.3, w*0.4);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.2, 'rgba(255, 240, 200, 0.5)');
    grad.addColorStop(0.5, 'rgba(255, 200, 100, 0.2)');
    grad.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= 5; i++) {
      ctx.fillStyle = `rgba(255, ${200-i*20}, ${100+i*20}, 0.3)`;
      ctx.beginPath();
      ctx.arc(w*0.8 - i*80, h*0.3 + i*30, 15 - i*2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  else if (effect === 'doubleExposure') {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * 0.6 + 100);
      d[i+1] = Math.min(255, d[i+1] * 0.7 + 50);
      d[i+2] = Math.min(255, d[i+2] * 0.8 + 150);
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.5;
    ctx.drawImage(canvas, 20, 20, w-40, h-40);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  saveHistory();
  showToast(`${effect} applied ✨`);
}

document.querySelectorAll('.effect-chip, .effect-btn[data-effect]').forEach(btn => {
  btn.addEventListener('click', () => {
    applySpecialEffect(btn.dataset.effect);
  });
});

// ============================================
// COLOR OVERLAY
// ============================================
document.getElementById('applyOverlay')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  const color = document.getElementById('overlayColor').value;
  const opacity = parseInt(document.getElementById('overlayOpacity').value) / 100;
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  saveHistory();
  showToast('Color overlay applied 🎨');
});

// ============================================
// FRAMES
// ============================================
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
    btn.className = 'frame-btn';
    btn.innerHTML = `<i class="fas fa-square"></i> ${fr.name}`;
    btn.addEventListener('click', () => {
      if (!originalImage) return showToast('Upload image first!');
      applyFrame(fr.style);
      saveHistory();
      showToast(`Frame: ${fr.name} 🖼️`);
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
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, newW, newH);
  }
  if (style === 'double') {
    ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, newW - 16, newH - 16);
  }
  ctx.drawImage(temp, pad, pad);
  ctx.shadowColor = 'transparent';
  if (style === 'polaroid') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, newH - 70, newW, 70);
  }
}
buildFrames();

// ============================================
// TEXT TOOL
// ============================================
document.getElementById('addTextBtn')?.addEventListener('click', () => {
  const text = document.getElementById('textInput').value;
  if (!text) return showToast('Enter text first!');
  const color = document.getElementById('textColor').value;
  const size = document.getElementById('textSize').value;
  const font = document.getElementById('textFont').value;
  ctx.font = `bold ${size}px ${font}, sans-serif`;
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';
  ctx.strokeText(text, canvas.width/2, canvas.height/2);
  ctx.fillText(text, canvas.width/2, canvas.height/2);
  saveHistory();
  document.getElementById('textModal').classList.remove('active');
  showToast('Text added! ✍️');
});
document.getElementById('closeText')?.addEventListener('click', () => {
  document.getElementById('textModal').classList.remove('active');
});

// ============================================
// STICKERS
// ============================================
const STICKERS = ['😀','😎','🤩','😍','🥰','😂','🤣','😇','🥳','😜','🌟','⭐','✨','💫','🌈','❤️','💖','💝','🔥','💯','🎉','🎊','🎈','🎁','🌸','🌺','🌻','🍕','🍔','🍟','☕','🎵','🎸','⚡','💎','👑','🎯','🏆','📸','🎬'];
function buildStickers() {
  const grid = document.getElementById('stickerGrid');
  if (!grid) return;
  grid.innerHTML = '';
  STICKERS.forEach(s => {
    const div = document.createElement('div');
    div.className = 'sticker-item';
    div.textContent = s;
    div.addEventListener('click', () => {
      ctx.font = `${Math.min(canvas.width, canvas.height) * 0.15}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(s, canvas.width/2 + (Math.random()-0.5)*canvas.width*0.5, canvas.height/2 + (Math.random()-0.5)*canvas.height*0.5);
      saveHistory();
      document.getElementById('stickerModal').classList.remove('active');
      showToast('Sticker added! 😀');
    });
    grid.appendChild(div);
  });
}
buildStickers();
document.getElementById('closeSticker')?.addEventListener('click', () => {
  document.getElementById('stickerModal').classList.remove('active');
});

// ============================================
// CAMERA
// ============================================
const cameraModal = document.getElementById('cameraModal');
const video = document.getElementById('video');
let stream = null;
document.getElementById('cameraBtn')?.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    cameraModal.classList.add('active');
  } catch (err) { showToast('Camera denied ❌'); }
});
document.getElementById('captureBtn')?.addEventListener('click', () => {
  const tc = document.createElement('canvas');
  tc.width = video.videoWidth;
  tc.height = video.videoHeight;
  tc.getContext('2d').drawImage(video, 0, 0);
  loadImage(tc.toDataURL('image/png'));
  closeCamera();
});
document.getElementById('closeCamera')?.addEventListener('click', closeCamera);
function closeCamera() {
  cameraModal.classList.remove('active');
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
}

// ============================================
// LIVE THEME TOGGLE
// ============================================
document.getElementById('themeToggle')?.addEventListener('click', (e) => {
  const body = document.body;
  const isLight = body.dataset.theme === 'light';
  body.dataset.theme = isLight ? '' : 'light';
  e.currentTarget.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  // Live animation
  e.currentTarget.style.transform = 'rotate(360deg)';
  setTimeout(() => e.currentTarget.style.transform = '', 400);
  showToast(isLight ? 'Dark mode 🌙' : 'Light mode ☀️');
});

document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
});

// ============================================
// MOBILE MENU / PANEL
// ============================================
const controlsPanel = document.getElementById('controlsPanel');
const mobileToolbar = document.getElementById('mobileToolbar');

function openControlsMobile() {
  if (window.innerWidth <= 900) controlsPanel.classList.add('open');
}

document.getElementById('menuBtn')?.addEventListener('click', () => {
  controlsPanel.classList.toggle('open');
});

document.getElementById('panelClose')?.addEventListener('click', () => {
  controlsPanel.classList.remove('open');
});

// Mobile toolbar buttons
document.querySelectorAll('.mt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.mtool;
    const map = {
      adjust: 'light',
      filters: 'filters',
      effects: 'effects',
      colors: 'color',
      light: 'dslr',
      more: 'crop'
    };
    const tabId = map[target];
    document.querySelector(`.tab[data-tab="${tabId}"]`)?.click();
    openControlsMobile();
  });
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); doUndo(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); doRedo(); }
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); document.getElementById('downloadBtn')?.click(); }
});

// ============================================
// INIT
// ============================================
buildFilterPreviews();
renderLayersList();
updateUndoRedoUI();

console.log('%c AVR PRO STUDIOS v4.0 ', 'background: linear-gradient(135deg, #6d28d9, #ec4899); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
console.log('%c Ultra: AI + 40 Filters + 15 Effects + Mobile 📸🚀', 'color: #06b6d4; font-size: 14px;');