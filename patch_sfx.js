const fs = require('fs');
let content = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

// 1. replace AudioTheme
content = content.replace(
  /export type AudioTheme = .*?;/,
  "export type AudioTheme = 'premium' | 'soft' | 'casual' | 'retro' | 'scifi' | 'acoustic' | 'wordle' | 'epic' | 'piano' | 'gamefeel' | 'assets' | 'asmr-wood' | 'asmr-glass' | 'asmr-synth' | 'asmr-click' | 'asmr-minimal' | 'forest';"
);

const newAudioFunctions = `
function fCtx() { initAudio(); return audioCtx ? audioCtx.currentTime : 0; }
function gOsc(freq, type, start, dur, vol, opts = {}) {
  initAudio(); if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = type; o.frequency.setValueAtTime(freq, start);
  if (opts.freqEnd) o.frequency.exponentialRampToValueAtTime(opts.freqEnd, start + dur);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, Math.max(start, start + (opts.attack || 0.01)));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.start(start); o.stop(start + dur + 0.08);
}
function gNoise(start, dur, vol, opts = {}) {
  initAudio(); if (!audioCtx) return;
  const n = Math.ceil(audioCtx.sampleRate * dur);
  const buf = audioCtx.createBuffer(1, n, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1);
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const filt = audioCtx.createBiquadFilter();
  filt.type = opts.type || 'bandpass';
  filt.frequency.setValueAtTime(opts.freq || 800, start);
  filt.Q.setValueAtTime(opts.Q || 2, start);
  const g = audioCtx.createGain();
  src.connect(filt); filt.connect(g); g.connect(audioCtx.destination);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, Math.max(start, start + (opts.attack || 0.02)));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.start(start); src.stop(start + dur + 0.08);
}

const SFX = {`;

content = content.replace('const SFX = {', newAudioFunctions);

const additions = {
  type: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(300, 'sine', t, .06, .20, { attack:.002, freqEnd:180 }); gNoise(t, .03, .20, { type:'bandpass', freq:800, Q:2, attack:.001 }); } return; }",
  timer10: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(300, 'sine', t, .25, .12, { attack:.05, freqEnd:200 }); gNoise(t, .30, .22, { type:'bandpass', freq:600, Q:2, attack:.08 }); } return; }",
  timer3: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .15, .15, { attack:.02, freqEnd:300 }); gNoise(t, .15, .2, { type:'bandpass', freq:800, Q:2, attack:.02 }); } return; }",
  timer0: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(200, 'sine', t, .4, .25, { attack:.02, freqEnd:100 }); gNoise(t, .3, .25, { type:'bandpass', freq:400, Q:1.5, attack:.01 }); } return; }",
  delete: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .20, .18, { type:'bandpass', freq:400, Q:1.5, attack:.06 }); } return; }",
  submit: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(200, 'sine', t, .1, .25, { attack:.005, freqEnd:100 }); gNoise(t, .05, .25, { type:'bandpass', freq:600, Q:1.5, attack:.002 }); } return; }",
  gray: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(100, 'sine', t, .18, .28, { attack:.003, freqEnd:60 }); gNoise(t, .05, .25, { type:'lowpass', freq:200, Q:1, attack:.002 }); } return; }",
  yellow: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(550, 'sine', t, .35, .18, { attack:.008 }); gNoise(t, .08, .12, { type:'bandpass', freq:1200, Q:2, attack:.01 }); } return; }",
  green: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(440, 'sine', t, .45, .22, { attack:.006 }); gOsc(660, 'sine', t+.02, .35, .14, { attack:.006 }); gOsc(880, 'sine', t+.04, .25, .07, { attack:.006 }); gNoise(t, .03, .20, { type:'highpass', freq:2000, Q:.8, attack:.001 }); } return; }",
  xp: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(880, 'sine', t, .40, .18, { attack:.005 }); gOsc(1100, 'sine', t+.04, .30, .10, { attack:.005 }); gNoise(t, .03, .15, { type:'highpass', freq:4000, Q:1, attack:.001 }); } return; }",
  win: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ [220, 330, 440, 550, 660, 880].forEach((f, i) => { gOsc(f, 'sine', t+i*.1, .6, .18, { attack:.02 }); gNoise(t+i*.1, .04, .15, { type:'highpass', freq:2000, Q:1, attack:.002 }); }); } return; }",
  xpbar: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .05, .15, { attack:.002, freqEnd:350 }); gNoise(t, .02, .1, { type:'bandpass', freq:1000, Q:2, attack:.001 }); } return; }",
  hintWhoosh: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .30, .2, { type:'bandpass', freq:400, Q:1, attack:.1 }); } return; }",
  hintReveal: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(550, 'sine', t, .3, .18, { attack:.01 }); gOsc(880, 'sine', t+.05, .4, .15, { attack:.01 }); } return; }",
  bombDrop: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(150, 'sine', t, .4, .2, { attack:.05, freqEnd:50 }); } return; }",
  bombExplode: "if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .3, .35, { type:'lowpass', freq:250, Q:0.5, attack:.01 }); gOsc(100, 'sine', t, .25, .2, { attack:.01, freqEnd:60 }); } return; }",
};

for (const [key, code] of Object.entries(additions)) {
  const regex = new RegExp(key + ": \\(\\) => {");
  content = content.replace(regex, key + ": () => { " + code + "\\n");
}

// Add lose
if (!content.includes('lose: () =>')) {
  // append lose before the end of SFX
  content = content.replace("};", "  lose: () => { if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .25, .30, { type:'lowpass', freq:300, Q:1, attack:.01 }); gOsc(140, 'sine', t, .20, .18, { attack:.01, freqEnd:80 }); } return; } }\\n};");
}

fs.writeFileSync('src/CasualWordle.tsx', content);
