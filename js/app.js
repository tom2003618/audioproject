/* ---------- 廣東話朗讀功能所需嘅變數（要喺 activate() 之前宣告） ---------- */
let ttsVoice = null;
let ttsQueue = [];
let ttsIndex = 0;
let ttsState = 'idle'; // idle | playing | paused
let ttsRate = 0.9;

const buttons = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
function activate(id) {
  ttsStop();
  buttons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
  panels.forEach(p => p.classList.toggle('active', p.id === id));
  window.scrollTo(0,0);
}
buttons.forEach(b => b.addEventListener('click', () => activate(b.dataset.target)));
activate('overview');

let fontSize = 19;
function changeFont(delta) {
  fontSize = Math.max(15, Math.min(29, fontSize + delta));
  document.documentElement.style.setProperty('--base-font', fontSize + 'px');
}

/* ---------- 廣東話朗讀功能 (Cantonese text-to-speech) ---------- */
function pickCantoneseVoice() {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const statusEl = document.getElementById('voiceStatus');
  if (!voices.length) return null;
  let v = voices.find(x => /zh[-_]?hk/i.test(x.lang) || /yue/i.test(x.lang) || /cantonese|粵語|广东话|粤语/i.test(x.name));
  if (!v) v = voices.find(x => /zh[-_]?tw/i.test(x.lang));
  if (!v) v = voices.find(x => /zh/i.test(x.lang));
  if (statusEl) {
    if (v && (/zh[-_]?hk/i.test(v.lang) || /yue/i.test(v.lang) || /cantonese|粵語|广东话|粤语/i.test(v.name))) {
      statusEl.textContent = '使用廣東話聲音朗讀：' + v.name;
    } else if (v) {
      statusEl.textContent = '⚠️ 呢部裝置未有廣東話聲音，暫時用「' + v.name + '」代替朗讀。';
    } else {
      statusEl.textContent = '⚠️ 呢部裝置／瀏覽器未支援中文朗讀語音。';
    }
  }
  return v || null;
}

if (window.speechSynthesis) {
  pickCantoneseVoice();
  window.speechSynthesis.onvoiceschanged = () => { ttsVoice = pickCantoneseVoice(); };
  ttsVoice = pickCantoneseVoice();
} else {
  const statusEl = document.getElementById('voiceStatus');
  if (statusEl) statusEl.textContent = '⚠️ 呢個瀏覽器唔支援語音朗讀功能。';
}

function collectReadableElements(panel) {
  const nodes = panel.querySelectorAll('h2, .lede, h3, .note, li, figcaption, .stat-card');
  return Array.from(nodes).filter(n => n.textContent.trim().length > 0);
}

function ttsBuildQueue() {
  const panel = document.querySelector('.panel.active');
  if (!panel) return [];
  return collectReadableElements(panel);
}

function ttsSpeakNext() {
  if (ttsIndex >= ttsQueue.length) {
    ttsState = 'idle';
    updateTtsButton();
    return;
  }
  const el = ttsQueue[ttsIndex];
  document.querySelectorAll('.tts-reading').forEach(n => n.classList.remove('tts-reading'));
  el.classList.add('tts-reading');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-HK';
  if (ttsVoice) utter.voice = ttsVoice;
  utter.rate = ttsRate;
  utter.onend = () => {
    ttsIndex += 1;
    ttsSpeakNext();
  };
  utter.onerror = () => {
    ttsIndex += 1;
    ttsSpeakNext();
  };
  window.speechSynthesis.speak(utter);
}

function ttsToggle() {
  if (!window.speechSynthesis) return;
  if (ttsState === 'idle') {
    ttsQueue = ttsBuildQueue();
    ttsIndex = 0;
    ttsState = 'playing';
    updateTtsButton();
    window.speechSynthesis.cancel();
    ttsSpeakNext();
  } else if (ttsState === 'playing') {
    window.speechSynthesis.pause();
    ttsState = 'paused';
    updateTtsButton();
  } else if (ttsState === 'paused') {
    window.speechSynthesis.resume();
    ttsState = 'playing';
    updateTtsButton();
  }
}

function ttsStop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  ttsState = 'idle';
  ttsIndex = 0;
  document.querySelectorAll('.tts-reading').forEach(n => n.classList.remove('tts-reading'));
  updateTtsButton();
}

function ttsToggleSpeed() {
  const btn = document.getElementById('ttsSpeed');
  if (ttsRate === 0.9) {
    ttsRate = 0.65;
    btn.textContent = '🐢 更慢朗讀中';
  } else if (ttsRate === 0.65) {
    ttsRate = 1.0;
    btn.textContent = '🐇 正常速度';
  } else {
    ttsRate = 0.9;
    btn.textContent = '🐢 慢速朗讀';
  }
}

function updateTtsButton() {
  const btn = document.getElementById('ttsPlay');
  if (!btn) return;
  if (ttsState === 'playing') {
    btn.textContent = '⏸ 暫停朗讀';
  } else if (ttsState === 'paused') {
    btn.textContent = '▶ 繼續朗讀';
  } else {
    btn.textContent = '🔊 讀俾我聽';
    document.querySelectorAll('.tts-reading').forEach(n => n.classList.remove('tts-reading'));
  }
}
