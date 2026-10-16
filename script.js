/* ============================================
   AVR PRO STUDIOS — PICSART STYLE v7.0
   ============================================ */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash')?.classList.add('hide');
    showToast('Welcome to AVR PRO STUDIOS! 🎨📸');
  }, 3200);
});

const state = {
  filters: {
    exposure: 0, brightness: 100, contrast: 100, highlights: 0, shadows: 0, whites: 0, blacks: 0,
    saturation: 100, vibrance: 0, temperature: 0, tint: 0, hue: 0, sepia: 0, grayscale: 0, invert: 0,
    sharpness: 0, clarity: 0, blur: 0, grain: 0, skin: 0, vignette: 0, flare: 0, bokeh: 0
  },
  currentFilter: 'original',
  rotation: 0,
  flipH: false, flipV: false,
  history: [], historyIndex: -1,
  currentTool: 'tools',
  currentPanelTab: 'light'
};

const FILTERS = {
  original: { css: '', cat: 'all' },
  cinematic: { css: 'contrast(1.2) saturate(1.1) hue-rotate(-10deg)', cat: 'cinematic' },
  teal: { css: 'contrast(1.15) saturate(1.1) hue-rotate(-15deg)', cat: 'cinematic' },
  netflix: { css: 'contrast(1.2) saturate(1.1) brightness(0.92) hue-rotate(-5deg)', cat: 'cinematic' },
  moody: { css: 'contrast(1.25) brightness(0.85) saturate(0.85)', cat: 'cinematic' },
  blockbuster: { css: 'contrast(1.3) saturate(1.15) hue-rotate(-10deg) brightness(0.95)', cat: 'cinematic' },
  vintage: { css: 'sepia(0.4) contrast(1.1) brightness(0.95)', cat: 'vintage' },
  retro: { css: 'sepia(0.6) contrast(1.15) saturate(0.8)', cat: 'vintage' },
  polaroid: { css: 'sepia(0.25) contrast(1.15) brightness(1.05)', cat: 'vintage' },
  faded: { css: 'contrast(0.85) brightness(1.1) saturate(0.7) sepia(0.15)', cat: 'vintage' },
  kodak: { css: 'saturate(1.3) contrast(1.1) sepia(0.15)', cat: 'vintage' },
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
  silvertone: { css: 'grayscale(0.9) contrast(1.1) sepia(0.15)', cat: 'bw' },
  neonPink: { css: 'hue-rotate(-60deg) saturate(2) contrast(1.2) brightness(1.1)', cat: 'neon' },
  neonBlue: { css: 'hue-rotate(180deg) saturate(2.5) contrast(1.3)', cat: 'neon' },
  neonPurple: { css: 'hue-rotate(250deg) saturate(2) contrast(1.2)', cat: 'neon' },
  forest: { css: 'hue-rotate(30deg) saturate(1.3) brightness(0.95)', cat: 'nature' },
  ocean: { css: 'hue-rotate(190deg) saturate(1.4) brightness(1.05)', cat: 'nature' },
  sunsetPro: { css: 'sepia(0.4) saturate(1.5) brightness(1.05) hue-rotate(-15deg)', cat: 'nature' }
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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
    state.history.push(canvas.toDataURL());
    state.historyIndex++;
    if (state.history.length > 20) { state.history.shift(); state.historyIndex--; }
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
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
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

function applyFilters() {
  if (!originalImage) return;
  const f = state.filters;
  const brightness = f.brightness + (f.exposure * 0.5);
  const filterCss = FILTERS[state.currentFilter]?.css || '';

  const filterStr = `brightness(${brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) hue-rotate(${f.hue}deg) sepia(${f.sepia}%) grayscale(${f.grayscale}%) ${filterCss}`.trim();

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
}

function applyPixelEffects() {
  const f = state.filters;
  const needs = f.highlights || f.shadows || f.whites || f.blacks ||
                f.temperature || f.tint || f.vibrance ||
                f.sharpness || f.clarity || f.grain;
  if (!needs) return;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  const tempR = f.temperature * 0.5, tempB = -f.temperature * 0.5;
  const tintG = -f.tint * 0.5, tintR = f.tint * 0.3, tintB = f.tint * 0.3;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];
    r += tempR + tintR; g += tintG; b += tempB + tintB;
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
    if (f.grain) { const n = (Math.random()-0.5)*f.grain*0.8; r+=n; g+=n; b+=n; }
    d[i] = Math.max(0, Math.min(255, r));
    d[i+1] = Math.max(0, Math.min(255, g));
    d[i+2] = Math.max(0, Math.min(255, b));
  }
  ctx.putImageData(imgData, 0, 0);

  if (f.vignette > 0) {
    const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)*0.3, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)*0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${f.vignette/100})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    originalImage = img;
    const MAX_DIM = 1600;
    let w = img.width, h = img.height;
    if (w > MAX_DIM || h > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    originalImage._scaledW = w;
    originalImage._scaledH = h;
    canvas.width = w;
    canvas.height = h;
    applyFilters();
    document.getElementById('dropZone').classList.add('hide');
    setTimeout(() => saveHistory(), 150);
    showToast('Photo loaded! ✨');
  };
  img.src = src;
}

// ---------- Upload Photo Modal ----------
document.getElementById('dropZone')?.addEventListener('click', () => {
  if (!originalImage) {
    document.getElementById('sourceModal').classList.add('active');
  }
});

document.getElementById('closeAppBtn')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.add('active');
});

document.getElementById('closeSource')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
});

document.getElementById('fromGallery')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
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

document.getElementById('fromCamera')?.addEventListener('click', () => {
  document.getElementById('sourceModal').classList.remove('active');
  document.getElementById('cameraModal').classList.add('active');
  startCamera();
});

// ---------- Bottom Toolbar ----------
document.querySelectorAll('.bt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    document.querySelectorAll('.bt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentTool = tool;
    openToolPanel(tool);
  });
});

function openToolPanel(tool) {
  const panel = document.getElementById('panel');
  const title = document.getElementById('panelTitle');
  const tabs = document.getElementById('panelTabs');
  const content = document.getElementById('panelContent');
  const footer = document.getElementById('panelFooter');

  // Clear
  tabs.innerHTML = '';
  content.innerHTML = '';
  footer.innerHTML = '';

  const toolConfigs = {
    crop: {
      title: 'Crop',
      tabs: [],
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
          <button class="action-btn" id="rotateLeft"><i class="fas fa-undo"></i> Rotate L</button>
          <button class="action-btn" id="rotateRight"><i class="fas fa-redo"></i> Rotate R</button>
          <button class="action-btn" id="flipHoriz"><i class="fas fa-exchange-alt"></i> Flip H</button>
          <button class="action-btn" id="flipVert"><i class="fas fa-exchange-alt" style="transform:rotate(90deg)"></i> Flip V</button>
        </div>
      `,
      footer: `
        <button class="btn-cancel" id="cancelToolBtn">Cancel</button>
        <button class="btn-check" id="applyToolBtn"><i class="fas fa-check"></i> Apply</button>
      `
    },
    tools: {
      title: 'Tools',
      tabs: ['Light', 'Color', 'Detail', 'DSLR'],
      tabContent: {
        'Light': `
          <div class="slider-group"><label><span>Brightness</span><span id="brightnessVal">100%</span></label><input type="range" id="brightness" min="0" max="200" value="100"></div>
          <div class="slider-group"><label><span>Contrast</span><span id="contrastVal">100%</span></label><input type="range" id="contrast" min="0" max="200" value="100"></div>
          <div class="slider-group"><label><span>Exposure</span><span id="exposureVal">0</span></label><input type="range" id="exposure" min="-100" max="100" value="0"></div>
          <div class="slider-group"><label><span>Highlights</span><span id="highlightsVal">0</span></label><input type="range" id="highlights" min="-100" max="100" value="0"></div>
          <div class="slider-group"><label><span>Shadows</span><span id="shadowsVal">0</span></label><input type="range" id="shadows" min="-100" max="100" value="0"></div>
        `,
        'Color': `
          <div class="slider-group"><label><span>Saturation</span><span id="saturationVal">100%</span></label><input type="range" id="saturation" min="0" max="200" value="100"></div>
          <div class="slider-group"><label><span>Vibrance</span><span id="vibranceVal">0</span></label><input type="range" id="vibrance" min="-100" max="100" value="0"></div>
          <div class="slider-group"><label><span>Temperature</span><span id="temperatureVal">0</span></label><input type="range" id="temperature" min="-100" max="100" value="0"></div>
          <div class="slider-group"><label><span>Tint</span><span id="tintVal">0</span></label><input type="range" id="tint" min="-100" max="100" value="0"></div>
          <div class="slider-group"><label><span>Hue</span><span id="hueVal">0°</span></label><input type="range" id="hue" min="0" max="360" value="0"></div>
        `,
        'Detail': `
          <div class="slider-group"><label><span>Sharpness</span><span id="sharpnessVal">0</span></label><input type="range" id="sharpness" min="0" max="100" value="0"></div>
          <div class="slider-group"><label><span>Clarity</span><span id="clarityVal">0</span></label><input type="range" id="clarity" min="0" max="100" value="0"></div>
          <div class="slider-group"><label><span>Blur</span><span id="blurVal">0px</span></label><input type="range" id="blur" min="0" max="20" value="0"></div>
          <div class="slider-group"><label><span>Grain</span><span id="grainVal">0</span></label><input type="range" id="grain" min="0" max="100" value="0"></div>
        `,
        'DSLR': `
          <div class="slider-group"><label><span>Bokeh</span><span id="bokehVal">0</span></label><input type="range" id="bokeh" min="0" max="100" value="0"></div>
          <div class="slider-group"><label><span>Vignette</span><span id="vignetteVal">0</span></label><input type="range" id="vignette" min="0" max="100" value="0"></div>
          <div class="slider-group"><label><span>Skin Smooth</span><span id="skinVal">0</span></label><input type="range" id="skin" min="0" max="100" value="0"></div>
          <div class="panel-actions-row">
            <button class="action-btn" id="hdrBtn"><i class="fas fa-sun"></i> HDR</button>
            <button class="action-btn" id="portraitBtn"><i class="fas fa-user"></i> Portrait</button>
          </div>
        `
      },
      footer: `
        <button class="btn-cancel" id="cancelToolBtn">Cancel</button>
        <button class="btn-check" id="applyToolBtn"><i class="fas fa-check"></i> Apply</button>
      `
    },
    effects: {
      title: 'Effects',
      tabs: ['Overlays', 'Style'],
      tabContent: {
        'Overlays': `
          <div class="effects-grid">
            <button class="effect-chip" data-effect="rain"><i class="fas fa-cloud-rain"></i> Rain</button>
            <button class="effect-chip" data-effect="snow"><i class="fas fa-snowflake"></i> Snow</button>
            <button class="effect-chip" data-effect="confetti"><i class="fas fa-birthday-cake"></i> Confetti</button>
            <button class="effect-chip" data-effect="fire"><i class="fas fa-fire"></i> Fire</button>
            <button class="effect-chip" data-effect="sparkle"><i class="fas fa-star"></i> Sparkle</button>
            <button class="effect-chip" data-effect="bokehLight"><i class="fas fa-circle"></i> Bokeh</button>
          </div>
        `,
        'Style': `
          <div class="effects-grid">
            <button class="effect-chip" data-effect="vignettePro"><i class="fas fa-circle"></i> Vignette</button>
            <button class="effect-chip" data-effect="filmGrain"><i class="fas fa-braille"></i> Grain</button>
            <button class="effect-chip" data-effect="glow"><i class="fas fa-sun"></i> Glow</button>
            <button class="effect-chip" data-effect="mirror"><i class="fas fa-clone"></i> Mirror</button>
            <button class="effect-chip" data-effect="sunrays"><i class="fas fa-sun"></i> Sunrays</button>
            <button class="effect-chip" data-effect="spotlight"><i class="fas fa-lightbulb"></i> Spotlight</button>
            <button class="effect-chip" data-effect="rainbow"><i class="fas fa-rainbow"></i> Rainbow</button>
            <button class="effect-chip" data-effect="stars"><i class="fas fa-star"></i> Stars</button>
            <button class="effect-chip" data-effect="neonGlow"><i class="fas fa-bolt"></i> Neon</button>
            <button class="effect-chip" data-effect="vhsGlitch"><i class="fas fa-tv"></i> VHS</button>
            <button class="effect-chip" data-effect="lensFlare"><i class="fas fa-sun"></i> Flare</button>
            <button class="effect-chip" data-effect="dragan"><i class="fas fa-dragon"></i> Dragan</button>
          </div>
        `
      },
      footer: `
        <button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>
      `
    },
    filters: {
      title: 'Filters',
      tabs: ['All', 'Cinematic', 'Vintage', 'Modern', 'B&W', 'Neon', 'Nature'],
      tabContent: {
        'All': '<div class="filter-grid" id="filterGrid"></div>',
        'Cinematic': '<div class="filter-grid" id="filterGrid"></div>',
        'Vintage': '<div class="filter-grid" id="filterGrid"></div>',
        'Modern': '<div class="filter-grid" id="filterGrid"></div>',
        'B&W': '<div class="filter-grid" id="filterGrid"></div>',
        'Neon': '<div class="filter-grid" id="filterGrid"></div>',
        'Nature': '<div class="filter-grid" id="filterGrid"></div>'
      },
      footer: `
        <button class="btn-check" id="applyToolBtn" style="flex:1">Done</button>
      `
    },
    retouch: {
      title: 'Retouch',
      tabs: ['Skin', 'Eyes', 'Lips'],
      tabContent: {
        'Skin': `<div class="slider-group"><label><span>Smooth</span><span id="skinVal">0</span></label><input type="range" id="skin" min="0" max="100" value="0"></div>
                 <div class="slider-group"><label><span>Brighten</span><span id="brightnessVal">100%</span></label><input type="range" id="brightness" min="0" max="200" value="100"></div>`,
        'Eyes': `<div class="slider-group"><label><span>Brighten</span><span id="brightnessVal">100%</span></label><input type="range" id="brightness" min="0" max="200" value="100"></div>
                 <div class="slider-group"><label><span>Sharpness</span><span id="sharpnessVal">0</span></label><input type="range" id="sharpness" min="0" max="100" value="0"></div>`,
        'Lips': `<div class="slider-group"><label><span>Saturation</span><span id="saturationVal">100%</span></label><input type="range" id="saturation" min="0" max="200" value="100"></div>
                 <div class="slider-group"><label><span>Brightness</span><span id="brightnessVal">100%</span></label><input type="range" id="brightness" min="0" max="200" value="100"></div>`
      },
      footer: `
        <button class="btn-cancel" id="cancelToolBtn">Cancel</button>
        <button class="btn-check" id="applyToolBtn">Apply</button>
      `
    },
    removebg: {
      title: 'Remove Background',
      tabs: [],
      content: `
        <div style="text-align:center;padding:20px;">
          <i class="fas fa-robot" style="font-size:4rem;color:#8b5cf6;margin-bottom:20px;"></i>
          <h3 style="margin-bottom:10px;">AI Background Remover</h3>
          <p style="color:#a0a0b0;font-size:0.85rem;margin-bottom:20px;">Removes background using AI. Works best with people photos.</p>
          <button class="btn-check" id="aiBgBtn" style="padding:15px 30px;font-size:1rem;"><i class="fas fa-magic"></i> Remove Background</button>
        </div>
      `,
      footer: ''
    },
    sticker: {
      title: 'Stickers',
      tabs: [],
      content: `<div class="sticker-grid" id="stickerGrid"></div>`,
      footer: ''
    },
    text: {
      title: 'Text',
      tabs: [],
      content: `
        <input type="text" id="textInput" placeholder="Enter text..." class="modal-input">
        <div class="modal-row">
          <input type="color" id="textColor" value="#ffffff">
          <input type="range" id="textSize" min="10" max="200" value="48">
          <select id="textFont">
            <option value="Poppins">Poppins</option>
            <option value="Orbitron">Orbitron</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
      `,
      footer: `
        <button class="btn-check" id="addTextBtn" style="flex:1"><i class="fas fa-plus"></i> Add Text</button>
      `
    }
  };

  const config = toolConfigs[tool];
  if (!config) return;

  title.textContent = config.title;

  // Tabs
  if (config.tabs && config.tabs.length > 0) {
    config.tabs.forEach((tabName, idx) => {
      const t = document.createElement('button');
      t.className = 'ptab' + (idx === 0 ? ' active' : '');
      t.textContent = tabName;
      t.dataset.tab = tabName;
      t.addEventListener('click', () => {
        document.querySelectorAll('.ptab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        content.innerHTML = config.tabContent[tabName];
        setTimeout(() => attachPanelHandlers(tool, tabName), 50);
      });
      tabs.appendChild(t);
    });
    tabs.style.display = 'flex';
  } else {
    tabs.style.display = 'none';
  }

  // Content
  if (config.content) {
    content.innerHTML = config.content;
  } else if (config.tabContent && config.tabs) {
    content.innerHTML = config.tabContent[config.tabs[0]];
  }

  // Footer
  footer.innerHTML = config.footer || '';

  // Show panel
  panel.classList.add('open');
  document.getElementById('panelOverlay').classList.add('active');

  // Attach handlers
  setTimeout(() => attachPanelHandlers(tool, config.tabs ? config.tabs[0] : null), 100);
}

function attachPanelHandlers(tool, activeTab) {
  // Sliders
  const sliders = document.querySelectorAll('#panelContent input[type="range"]');
  sliders.forEach(input => {
    const id = input.id;
    const valId = id + 'Val';
    const label = document.getElementById(valId);
    if (!label) return;
    
    const suffix = id === 'hue' ? '°' : (id === 'blur' ? 'px' : (['brightness','contrast','saturation'].includes(id) ? '%' : ''));
    
    input.value = state.filters[id] !== undefined ? state.filters[id] : input.value;
    if (label) label.textContent = input.value + suffix;
    
    input.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.filters[id] = val;
      if (label) label.textContent = val + suffix;
      applyFilters();
    });
    input.addEventListener('change', () => saveHistory());
  });

  // Ratio buttons (Crop)
  document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!originalImage) return showToast('Upload image first!');
      document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      startCrop(btn.dataset.ratio);
    });
  });

  // Rotate/Flip buttons
  document.getElementById('rotateLeft')?.addEventListener('click', () => {
    if (!originalImage) return;
    state.rotation = (state.rotation - 90 + 360) % 360;
    applyFilters(); saveHistory();
    showToast('Rotated ↺');
  });
  document.getElementById('rotateRight')?.addEventListener('click', () => {
    if (!originalImage) return;
    state.rotation = (state.rotation + 90) % 360;
    applyFilters(); saveHistory();
    showToast('Rotated ↻');
  });
  document.getElementById('flipHoriz')?.addEventListener('click', () => {
    if (!originalImage) return;
    state.flipH = !state.flipH;
    applyFilters(); saveHistory();
  });
  document.getElementById('flipVert')?.addEventListener('click', () => {
    if (!originalImage) return;
    state.flipV = !state.flipV;
    applyFilters(); saveHistory();
  });

  // HDR / Portrait
  document.getElementById('hdrBtn')?.addEventListener('click', () => {
    Object.assign(state.filters, { contrast: 130, saturation: 135, highlights: -25, shadows: 35, clarity: 40 });
    applyFilters(); saveHistory();
    showToast('HDR Boost! 🌅');
  });
  document.getElementById('portraitBtn')?.addEventListener('click', () => {
    Object.assign(state.filters, { skin: 55, brightness: 108, vibrance: 20, highlights: -12 });
    applyFilters(); saveHistory();
    showToast('Portrait Mode! 👤');
  });

  // Filters
  if (tool === 'filters') {
    buildFilterPreviews(activeTab.toLowerCase());
  }

  // Effects
  document.querySelectorAll('.effect-chip').forEach(btn => {
    btn.addEventListener('click', () => applySpecialEffect(btn.dataset.effect));
  });

  // Stickers
  if (tool === 'sticker') buildStickers();

  // AI BG
  document.getElementById('aiBgBtn')?.addEventListener('click', removeBackgroundAI);

  // Text
  document.getElementById('addTextBtn')?.addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    if (!text) return showToast('Enter text!');
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
    closePanel();
    showToast('Text added ✍️');
  });

  // Apply/Cancel
  document.getElementById('applyToolBtn')?.addEventListener('click', () => {
    saveHistory();
    closePanel();
    showToast('Applied ✓');
  });
  document.getElementById('cancelToolBtn')?.addEventListener('click', () => {
    closePanel();
  });
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
  document.getElementById('panelOverlay').classList.remove('active');
}

document.getElementById('panelClose')?.addEventListener('click', closePanel);
document.getElementById('panelOverlay')?.addEventListener('click', closePanel);

// ---------- Filter Previews ----------
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
      applyFilters();
      saveHistory();
      showToast(`Filter: ${label.textContent}`);
    });
    grid.appendChild(item);
  });
}

// ---------- Stickers ----------
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
      closePanel();
      showToast('Sticker added 😀');
    });
    grid.appendChild(div);
  });
}

// ---------- Effects ----------
function applySpecialEffect(effect) {
  if (!originalImage) return showToast('Upload image first!');
  const w = canvas.width, h = canvas.height;

  if (effect === 'rain') {
    ctx.strokeStyle = 'rgba(180, 200, 255, 0.6)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 15); ctx.stroke();
    }
  }
  else if (effect === 'snow') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 250; i++) {
      ctx.beginPath();
      ctx.arc(Math.random()*w, Math.random()*h, Math.random()*3+1, 0, Math.PI*2);
      ctx.fill();
    }
  }
  else if (effect === 'confetti') {
    const c = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899', '#06b6d4'];
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = c[Math.floor(Math.random()*c.length)];
      ctx.fillRect(Math.random()*w, Math.random()*h, 6, 10);
    }
  }
  else if (effect === 'fire') {
    const g = ctx.createRadialGradient(w/2, h, 0, w/2, h, h*0.8);
    g.addColorStop(0, 'rgba(255, 200, 50, 0.7)');
    g.addColorStop(0.5, 'rgba(255, 100, 20, 0.5)');
    g.addColorStop(1, 'rgba(255, 30, 0, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'sparkle') {
    for (let i = 0; i < 100; i++) {
      const x = Math.random()*w, y = Math.random()*h, s = Math.random()*8+4;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.8+0.2})`;
      ctx.beginPath();
      ctx.moveTo(x, y-s); ctx.lineTo(x+s/3, y-s/3); ctx.lineTo(x+s, y);
      ctx.lineTo(x+s/3, y+s/3); ctx.lineTo(x, y+s); ctx.lineTo(x-s/3, y+s/3);
      ctx.lineTo(x-s, y); ctx.lineTo(x-s/3, y-s/3); ctx.closePath(); ctx.fill();
    }
  }
  else if (effect === 'bokehLight') {
    const c = ['#ff0066', '#ffcc00', '#00ffcc', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const x = Math.random()*w, y = Math.random()*h, r = Math.random()*40+15;
      const color = c[Math.floor(Math.random()*c.length)];
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color + '88'); g.addColorStop(1, color + '00');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
  }
  else if (effect === 'vignettePro') {
    const g = ctx.createRadialGradient(w/2, h/2, Math.min(w,h)/3, w/2, h/2, Math.max(w,h)/1.1);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
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
    half.width = w/2; half.height = h;
    half.getContext('2d').drawImage(canvas, 0, 0, w/2, h, 0, 0, w/2, h);
    ctx.save(); ctx.scale(-1, 1); ctx.drawImage(half, -w, 0); ctx.restore();
  }
  else if (effect === 'sunrays') {
    const cx = w*0.7, cy = 0;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w);
    g.addColorStop(0, 'rgba(255, 240, 180, 0.6)');
    g.addColorStop(0.3, 'rgba(255, 220, 100, 0.3)');
    g.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI/4)*i + 0.3;
      ctx.strokeStyle = `rgba(255, 240, 180, ${0.3+Math.random()*0.2})`;
      ctx.lineWidth = Math.random()*30+20;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle)*w*1.5, cy + Math.sin(angle)*w*1.5);
      ctx.stroke();
    }
    ctx.restore();
  }
  else if (effect === 'spotlight') {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.6);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    g.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'rainbow') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255, 0, 0, 0.15)');
    g.addColorStop(0.17, 'rgba(255, 165, 0, 0.15)');
    g.addColorStop(0.33, 'rgba(255, 255, 0, 0.15)');
    g.addColorStop(0.5, 'rgba(0, 255, 0, 0.15)');
    g.addColorStop(0.67, 'rgba(0, 127, 255, 0.15)');
    g.addColorStop(0.83, 'rgba(75, 0, 130, 0.15)');
    g.addColorStop(1, 'rgba(148, 0, 211, 0.15)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'stars') {
    for (let i = 0; i < 300; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()*0.9+0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random()*w, Math.random()*h, Math.random()*2+0.5, 0, Math.PI*2);
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
          const idx = (y*w + x)*4, sIdx = (y*w + srcX)*4;
          d[idx] = d[sIdx]; d[idx+1] = d[sIdx+1]; d[idx+2] = d[sIdx+2];
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
  else if (effect === 'lensFlare') {
    const g = ctx.createRadialGradient(w*0.8, h*0.3, 0, w*0.8, h*0.3, w*0.4);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    g.addColorStop(0.2, 'rgba(255, 240, 200, 0.5)');
    g.addColorStop(0.5, 'rgba(255, 200, 100, 0.2)');
    g.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  else if (effect === 'dragan') {
    Object.assign(state.filters, { clarity: 60, contrast: 125, saturation: 85, shadows: -20 });
    applyFilters();
  }

  saveHistory();
  showToast(`${effect} ✨`);
}

// ---------- Crop ----------
let cropState = { active: false, x: 0, y: 0, w: 0, h: 0, ratio: 'free' };

function startCrop(ratio) {
  cropState.ratio = ratio || 'free';
  cropState.active = true;
  const overlay = document.getElementById('cropOverlay');
  overlay.width = canvas.width;
  overlay.height = canvas.height;
  overlay.classList.add('active');
  let w = canvas.width * 0.7;
  let h = canvas.height * 0.7;
  if (cropState.ratio !== 'free') {
    const [rw, rh] = cropState.ratio.split(':').map(Number);
    const r = rw / rh;
    if (w / h > r) w = h * r;
    else h = w / r;
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

// ---------- AI BG ----------
async function removeBackgroundAI() {
  if (!originalImage) return showToast('Upload image first!');
  if (typeof bodyPix === 'undefined') return showToast('AI loading... wait');
  const loading = document.getElementById('aiLoading');
  const progress = document.getElementById('aiProgress');
  loading.classList.add('active');
  progress.textContent = 'Loading AI model...';
  try {
    const net = await bodyPix.load({ architecture: 'MobileNetV1', outputStride: 16, multiplier: 0.75, quantBytes: 2 });
    progress.textContent = 'Detecting...';
    const segmentation = await net.segmentPerson(canvas, { internalResolution: 'medium', segmentationThreshold: 0.7 });
    progress.textContent = 'Removing BG...';
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data, mask = segmentation.data;
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
    originalImage._scaledW = final.width;
    originalImage._scaledH = final.height;
    applyFilters();
    saveHistory();
    loading.classList.remove('active');
    closePanel();
    showToast('BG removed! 🤖✨');
  } catch (err) {
    loading.classList.remove('active');
    showToast('AI failed');
  }
}

// ---------- Camera ----------
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

// ---------- Download & Share ----------
document.getElementById('downloadBtn')?.addEventListener('click', () => {
  if (!originalImage) return showToast('Upload image first!');
  const link = document.createElement('a');
  link.download = `AVR-Pro-Studios-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
  showToast('Saved! 💾');
});

document.getElementById('shareBtn')?.addEventListener('click', async () => {
  if (!originalImage) return showToast('Upload image first!');
  try {
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png', 1.0));
    const file = new File([blob], 'avr-photo.png', { type: 'image/png' });
    if (navigator.share) {
      await navigator.share({ files: [file], title: 'AVR PRO STUDIOS' });
    } else {
      showToast('Share not supported');
    }
  } catch(e) {}
});

// ---------- Init ----------
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); doUndo(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); doRedo(); }
});

updateUndoRedoUI();

console.log('%c AVR PRO STUDIOS v7.0 ', 'background: linear-gradient(135deg, #6d28d9, #ec4899); color: white; font-size: 20px; padding: 10px 20px; border-radius: 8px; font-weight: bold;');
console.log('%c Picsart-Style Bottom Toolbar 🎨📸', 'color: #06b6d4; font-size: 14px;');
