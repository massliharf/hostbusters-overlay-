import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToneManager } from './ToneManager';
import { PremiumToneManager } from './PremiumToneManager';
import { RoyalToneManager } from './RoyalToneManager';
import { ProminentToneManager } from './ProminentToneManager';
import { MutedToneManager } from './MutedToneManager';
import { HybridToneManager } from './HybridToneManager';
import { PerfectGeoToneManager } from './PerfectGeoToneManager';
import { PremiumGeoToneManager } from './PremiumGeoToneManager';
import { SweetVictoryToneManager } from './SweetVictoryToneManager';
import { MainGeoToneManager } from './MainGeoToneManager';
import { MainTwoToneManager } from './MainTwoToneManager';
import { MainThreeToneManager } from './MainThreeToneManager';
import { MainFourToneManager } from './MainFourToneManager';
import { MainFiveToneManager } from './MainFiveToneManager';
import { MainSixToneManager } from './MainSixToneManager';
import { ThemeWoodToneManager } from './ThemeWoodToneManager';
import { ThemeDuoToneManager } from './ThemeDuoToneManager';
import { ThemePrimaryToneManager } from './ThemePrimaryToneManager';


// --- AUDIO SYNTHESIS ENGINE ---
export type AudioTheme = 'main-geo' | 'main-2' | 'main-3' | 'main-4' | 'main-5' | 'main-6' | 'theme-wood' | 'premium' | 'soft' | 'casual' | 'retro' | 'scifi' | 'acoustic' | 'wordle' | 'epic' | 'piano' | 'gamefeel' | 'assets' | 'asmr-wood' | 'asmr-glass' | 'asmr-synth' | 'asmr-click' | 'asmr-minimal' | 'forest' | 'soft-ui' | 'wordle-dopamine' | 'streamer-pro' | 'streamer-tone' | 'streamer-premium' | 'streamer-royal' | 'streamer-prominent' | 'streamer-muted' | 'streamer-hybrid' | 'streamer-geo' | 'streamer-geo-v2' | 'streamer-geo-v3' | 'streamer-geo-v4' | 'streamer-sweet' | 'theme-duo' | 'primary';
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let currentTheme: AudioTheme = 'streamer-tone';

export function setTheme(theme: AudioTheme) {
  currentTheme = theme;
}

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.knee.setValueAtTime(30, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    
    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function triggerHaptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch(e) {}
  }
}

// --- SAMPLER ENGINE ---
let pianoBuffer: AudioBuffer | null = null;
const C4_FREQ = 261.63;

async function loadPianoSample() {
  if (pianoBuffer || !audioCtx) return;
  try {
    const res = await fetch('https://tonejs.github.io/audio/salamander/C4.mp3');
    const arrayBuffer = await res.arrayBuffer();
    pianoBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.error("Failed to load piano sample", e);
  }
}

function playSampledNote(targetFreq: number, duration: number, vol: number) {
  if (!audioCtx || !pianoBuffer) return false;
  try {
      const src = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      
      src.buffer = pianoBuffer;
      src.playbackRate.value = targetFreq / C4_FREQ; // Dynamic analog pitch shift
      
      const t = audioCtx.currentTime;
      gain.gain.setValueAtTime(vol * 2.5, t); 
      // Piano samples need longer decay naturally, only cut off if duration is short
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      
      src.connect(gain);
      gain.connect(masterGain || audioCtx.destination);
      src.start(t);
      src.stop(t + duration);
      return true;
  } catch (e) {
      return false; 
  }
}

function playAdvancedTone(freq: number, duration: number, vol: number) {
  initAudio();
  if (!audioCtx) return;
  if (!pianoBuffer) loadPianoSample(); 
  
  if (currentTheme === 'piano') {
     const success = playSampledNote(freq, duration, vol);
     if (success) return; // if buffer hasn't loaded yet, default fallback to sine
  }
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  let oscType: OscillatorType = 'sine';
  let filterType: BiquadFilterType = 'lowpass';
  let filterFreq = freq * 1.5;
  let decaySpeed = 0.001;
  let attackSpeed = 0.02;

  switch (currentTheme) {
    case 'soft':
      oscType = 'sine';
      filterFreq = freq * 1.5;
      break;
    case 'casual':
      oscType = 'triangle';
      filterFreq = freq * 3.0; // Brighter
      break;
    case 'retro':
      oscType = 'square';
      filterFreq = 20000; // Almost no filter
      vol = vol * 0.4; // Square waves are loud
      decaySpeed = 0.01;
      attackSpeed = 0.01;
      break;
    case 'scifi':
      oscType = 'sawtooth';
      vol = vol * 0.4;
      break;
    case 'acoustic':
      oscType = 'sine';
      filterFreq = freq * 4;
      duration = Math.min(duration, 0.1); // Staccato
      decaySpeed = 0.0001; // Fast decay
      attackSpeed = 0.005; // Plucky attack
      break;
    case 'wordle':
      oscType = 'triangle'; // Richer, perkier than sine for clicks
      filterFreq = freq * 2.5;
      duration = Math.min(duration, 0.08); // slightly longer for more presence
      decaySpeed = 0.0001; // super fast snap
      attackSpeed = 0.002; // ultra sharp attack
      vol = vol * 1.5; // louder dopamine pop
      break;
    case 'epic':
      oscType = 'sine';
      filterFreq = freq * 3;
      // High impact envelope, default
      attackSpeed = 0.005;
      decaySpeed = 0.001;
      break;
    case 'gamefeel':
      oscType = 'triangle'; // rich casual sound
      filterFreq = freq * 3.5;
      attackSpeed = 0.005;
      decaySpeed = 0.0005; // Bouncy and plucky
      break;
  }

  o.type = oscType;
  o.frequency.setValueAtTime(freq, t);

  filter.type = filterType;
  filter.frequency.setValueAtTime(filterFreq, t); 
  
  if (currentTheme === 'scifi') {
    filter.frequency.exponentialRampToValueAtTime(100, t + duration);
  }

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + attackSpeed);
  g.gain.exponentialRampToValueAtTime(decaySpeed, t + duration);

  o.connect(filter);
  filter.connect(g);
  g.connect(masterGain || audioCtx.destination);
  o.start(t);
  o.stop(t + duration);
}

function playSoftADSR(freq: number, type: OscillatorType, duration: number, vol: number) {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const f = audioCtx.createBiquadFilter();
  
  o.type = type;
  o.frequency.value = freq;
  
  f.type = 'lowpass';
  f.frequency.value = 800; // Warm roll-off
  f.Q.value = 0.5;

  // ADSR Envelope for Gain
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.02); // 20ms attack
  g.gain.exponentialRampToValueAtTime(0.001, t + duration); // smooth tail

  o.connect(f);
  f.connect(g);
  g.connect(masterGain || audioCtx.destination);
  o.start(t);
  o.stop(t + duration + 0.1);
}

function playSoftSweep(fStart: number, fEnd: number, duration: number, vol: number) {
  initAudio(); if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const f = audioCtx.createBiquadFilter();

  o.type = 'sine';
  o.frequency.setValueAtTime(fStart, t);
  o.frequency.exponentialRampToValueAtTime(fEnd, t + duration);

  f.type = 'lowpass';
  f.frequency.value = 600; // muffled sweep

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.05); // slightly slower attack
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);

  o.connect(f);
  f.connect(g);
  g.connect(masterGain || audioCtx.destination);
  o.start(t);
  o.stop(t + duration + 0.1);
}

function playSoftNoise(duration: number, vol: number) {
  initAudio();
  if (!audioCtx) return;
  
  if (currentTheme === 'retro') {
      // Fake noise via fast square pitch drop
      playAdvancedTone(400, duration, vol);
      setTimeout(() => playAdvancedTone(200, duration, vol), 50);
      setTimeout(() => playAdvancedTone(100, duration, vol), 100);
      return;
  }
  
  const t = audioCtx.currentTime;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime( currentTheme === 'casual' ? 800 : 400, t);
  filter.frequency.exponentialRampToValueAtTime(100, t + duration);

  const g = audioCtx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);

  noise.connect(filter);
  filter.connect(g);
  g.connect(masterGain || audioCtx.destination);
  noise.start(t);
}

function playAsset(name: string) {
  const audio = new Audio((import.meta.env.BASE_URL || '/') + 'sfx/' + name + '.mp3');
  audio.volume = 0.5; // Soften the mastering volume
  audio.play().catch(e => console.error("Asset play blocked", e));
}

// === FOREST SFX THEME EXPERIMENTAL IMPLEMENTATION ===
function fCtx() { initAudio(); return audioCtx ? audioCtx.currentTime : 0; }

function gOsc(freq: number, type: OscillatorType, start: number, dur: number, vol: number, opts: any = {}) {
  initAudio(); if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(masterGain || audioCtx.destination);
  o.type = type; o.frequency.setValueAtTime(freq, start);
  if (opts.freqEnd) o.frequency.exponentialRampToValueAtTime(opts.freqEnd, start + dur);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, Math.max(start, start + (opts.attack || 0.01)));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.start(start); o.stop(start + dur + 0.08);
}

function gNoise(start: number, dur: number, vol: number, opts: any = {}) {
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
  src.connect(filt); filt.connect(g); g.connect(masterGain || audioCtx.destination);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(vol, Math.max(start, start + (opts.attack || 0.02)));
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.start(start); src.stop(start + dur + 0.08);
}
// ======================================================

const SFX = {
  roundInfo: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.roundInfo(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.roundInfo(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.roundInfo(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.roundInfo(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.roundInfo(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.roundInfo(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.roundInfo(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.roundInfo(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.roundInfo(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(60, 'sine', t, .3, .4, { attack:.02 }); gOsc(60, 'sine', t+.2, .3, .4, { attack:.02 }); gOsc(60, 'sine', t+.4, .3, .4, { attack:.02 }); gOsc(880, 'sine', t+.6, .4, .2, { attack:.01 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(80, 'sine', t, .6, .4, { freqEnd: 40 }); gOsc(600, 'square', t, .3, .15); gOsc(600, 'square', t+.15, .2, .1); gOsc(600, 'square', t+.3, .15, .05); } return; }
    SFX.timer10();
  },
  type: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.type(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.type(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.type(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.type(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.type(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.type(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.type(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.type(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.type(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.type(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.type(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.type(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.type(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.type(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.type(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.type(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.type(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.type(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(400, 'triangle', t, .05, .2, { attack:.002 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(600, 'triangle', t, .04, .3, { attack:.005 }); gOsc(800, 'sine', t, .04, .2, { attack:.005 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(Math.random()*20+300, 'sine', t, .03, .2, { attack:.005 }); gNoise(t, .015, .05, { type:'bandpass', freq:1200, Q:1 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(300, 'sine', t, .06, .20, { attack:.002, freqEnd:180 }); gNoise(t, .03, .20, { type:'bandpass', freq:800, Q:2, attack:.001 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(150, 'sine', 0.02, 0.02); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.02, 0.03); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(200, 100, 0.03, 0.05); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(800, 'triangle', 0.02, 0.04); return; }
    if(currentTheme === 'asmr-minimal') { return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(150, 'sine', 0.05, 0.1); return; }
    if(currentTheme === 'premium') { playSoftNoise(0.01, 0.03); return; }
    if(currentTheme === 'assets') { playAsset('click_type'); return; }
    playAdvancedTone(600, 0.1, 0.05); setTimeout(() => playAdvancedTone(800, 0.2, 0.05), 50);
  },
  timer10: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.timer10(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.timer10(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.timer10(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.timer10(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.timer10(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.timer10(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.timer10(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.timer10(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.timer10(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.timer10(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.timer10(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.timer10(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.timer10(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.timer10(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.timer10(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.timer10(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.timer10(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.timer10(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(50, 'sine', t, .1, .4, { attack:.01 }); gOsc(50, 'sine', t+.1, .15, .3, { attack:.01 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(800, 'square', t, .05, .15); gOsc(800, 'square', t+.1, .05, .15); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(150, 'sine', t, .4, .2, { attack:.05, freqEnd:100 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(300, 'sine', t, .25, .12, { attack:.05, freqEnd:200 }); gNoise(t, .30, .22, { type:'bandpass', freq:600, Q:2, attack:.08 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(120, 'triangle', 0.15, 0.3); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(300, 200, 0.15, 0.3); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(600, 'triangle', 0.1, 0.15); return; }
    if(currentTheme === 'asmr-minimal') { playSoftNoise(0.05, 0.05); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(100, 'sine', 0.05, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'triangle', 0.15, 0.2); return; }
    playAdvancedTone(200, 2.0, 0.2);
  },
  timer3: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.timer3(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.timer3(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.timer3(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.timer3(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.timer3(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.timer3(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.timer3(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.timer3(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.timer3(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.timer3(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.timer3(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.timer3(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.timer3(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.timer3(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.timer3(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.timer3(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.timer3(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.timer3(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(40, 'sine', t, .2, .5, { freqEnd:30 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(60, 'sine', t, .5, .3); gOsc(1000, 'square', t, .1, .2); gOsc(1000, 'square', t+.15, .1, .08); gOsc(1000, 'square', t+.3, .1, .03); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .3, .15, { attack:.02 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .15, .15, { attack:.02, freqEnd:300 }); gNoise(t, .15, .2, { type:'bandpass', freq:800, Q:2, attack:.02 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(400, 'sine', 0.15, 0.3); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(600, 'sine', 0.1, 0.2); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(400, 'sine', 0.15, 0.3); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(400, 'triangle', 0.1, 0.15); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(500, 'sine', 0.1, 0.2); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(400, 'sine', 0.1, 0.2); triggerHaptic(50); return; }
    if(currentTheme === 'premium') { playSoftADSR(523.25, 'sine', 0.15, 0.2); triggerHaptic(50); return; }
    playAdvancedTone(800, 0.1, 0.1);
  },
  timer0: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.timer0(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.timer0(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.timer0(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.timer0(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.timer0(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.timer0(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.timer0(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.timer0(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.timer0(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.timer0(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.timer0(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.timer0(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.timer0(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.timer0(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.timer0(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.timer0(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.timer0(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.timer0(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(40, 'sine', t, .6, .6, { freqEnd:20 }); gOsc(1000, 'sine', t, .4, .1); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(60, 'sine', t, .8, .4, { freqEnd: 40 }); gOsc(1500, 'square', t, .4, .2); gOsc(2000, 'square', t, .4, .2); gOsc(1500, 'square', t+.2, .3, .1); gOsc(2000, 'square', t+.2, .3, .1); gOsc(1500, 'square', t+.4, .2, .05); gOsc(2000, 'square', t+.4, .2, .05); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(800, 'sine', t, .5, .2, { attack:.05 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(200, 'sine', t, .4, .25, { attack:.02, freqEnd:100 }); gNoise(t, .3, .25, { type:'bandpass', freq:400, Q:1.5, attack:.01 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(800, 'sine', 0.2, 0.4); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(1200, 'sine', 0.2, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(800, 'sine', 0.3, 0.5); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(800, 'triangle', 0.2, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(1000, 'sine', 0.2, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(800, 'sine', 0.1, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'premium') { playSoftADSR(1046.50, 'sine', 0.2, 0.3); triggerHaptic([200, 100, 200]); return; }
    playAdvancedTone(100, 0.5, 0.4);
  },
  error: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.error(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.error(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.error(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.error(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.error(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.error(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.error(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.error(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.error(); return; }
    playAdvancedTone(100, 0.1, 0.2); 
    setTimeout(() => playAdvancedTone(80, 0.1, 0.2), 100);
  },
  delete: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.delete(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.delete(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.delete(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.delete(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.delete(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.delete(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.delete(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.delete(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.delete(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.delete(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.delete(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.delete(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.delete(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.delete(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.delete(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.delete(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.delete(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.delete(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gNoise(t, .08, .1, { type:'lowpass', freq:600, Q:1, attack:.01 }); gOsc(150, 'sine', t, .08, .15, { attack:.01, freqEnd:50 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(200, 'square', t, .1, .15, { attack:.01, freqEnd:100 }); gNoise(t, .08, .1, { type:'highpass', freq:1000, Q:2 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gNoise(t, .08, .04, { type:'bandpass', freq:400, Q:0.5, attack:.02 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .20, .18, { type:'bandpass', freq:400, Q:1.5, attack:.06 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(100, 'sine', 0.02, 0.03); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.04, 0.05); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(150, 50, 0.05, 0.05); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(400, 'triangle', 0.02, 0.04); return; }
    if(currentTheme === 'asmr-minimal') { return; }
    if(currentTheme === 'asmr-pure') { playSoftSweep(200, 100, 0.05, 0.15); return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'sine', 0.1, 0.2); return; }
    if(currentTheme === 'assets') { playAsset('delete'); return; }
    playAdvancedTone(250, 0.1, 0.2); 
  },
  submit: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.submit(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.submit(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.submit(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.submit(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.submit(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.submit(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.submit(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.submit(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.submit(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.submit(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.submit(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.submit(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.submit(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.submit(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.submit(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.submit(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.submit(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.submit(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(150, 'square', t, .1, .2, { attack:.01 }); gNoise(t, .1, .05, { type:'lowpass', freq:300, Q:2, attack:.01 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(400, 'square', t, .1, .15); gOsc(600, 'square', t+.05, .1, .15); gOsc(800, 'square', t+.1, .2, .15); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .2, .1, { attack:.05 }); gOsc(600, 'sine', t+.08, .3, .15, { attack:.05 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(200, 'sine', t, .1, .25, { attack:.005, freqEnd:100 }); gNoise(t, .05, .25, { type:'bandpass', freq:600, Q:1.5, attack:.002 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(80, 'sine', 0.04, 0.08); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.05, 0.08); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(200, 100, 0.1, 0.1); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(300, 'triangle', 0.05, 0.05); return; }
    if(currentTheme === 'asmr-minimal') { playSoftNoise(0.05, 0.05); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(500, 'triangle', 0.15, 0.4); return; }
    if(currentTheme === 'premium') { playSoftADSR(180, 'sine', 0.1, 0.1); setTimeout(() => playSoftADSR(250, 'sine', 0.15, 0.1), 30); return; }
    if(currentTheme === 'assets') { playAsset('submit'); return; }
    setTimeout(() => playAdvancedTone(300, 0.15, 0.1), 0);
  },
  gray: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.gray(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.gray(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.gray(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.gray(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.gray(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.gray(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.gray(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.gray(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.gray(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.gray(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.gray(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.gray(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.gray(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.gray(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.gray(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.gray(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.gray(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.gray(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(100, 'sine', t, .05, .3, { attack:.002, freqEnd:60 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(150, 'triangle', t, .1, .3, { attack:.01, freqEnd:80 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(100, 'sine', t, .05, .3, { attack:.005, freqEnd:80 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(100, 'sine', t, .18, .28, { attack:.003, freqEnd:60 }); gNoise(t, .05, .25, { type:'lowpass', freq:200, Q:1, attack:.002 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(100, 'sine', 0.03, 0.05); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.06, 0.06); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(150, 50, 0.1, 0.08); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(200, 'triangle', 0.05, 0.08); return; }
    if(currentTheme === 'asmr-minimal') { return; } // completely silent
    if(currentTheme === 'asmr-pure') { playSoftADSR(150, 'sine', 0.05, 0.2); return; }
    if(currentTheme === 'premium') { playSoftNoise(0.04, 0.06); return; }
    if(currentTheme === 'assets') { playAsset('gray'); return; }
    playAdvancedTone(150, 0.2, 0.3); 
  },
  yellow: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.yellow(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.yellow(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.yellow(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.yellow(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.yellow(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.yellow(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.yellow(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.yellow(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.yellow(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.yellow(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.yellow(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.yellow(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.yellow(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.yellow(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.yellow(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.yellow(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.yellow(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.yellow(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(392.00, 'triangle', t, .15, .2, { attack:.005 }); gOsc(493.88, 'triangle', t+.05, .2, .15, { attack:.005 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(600, 'sine', t, .15, .3); gOsc(900, 'sine', t+.05, .3, .2); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(350, 'sine', t, .4, .15, { attack:.01 }); gOsc(700, 'triangle', t, .2, .05, { attack:.01 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(550, 'sine', t, .35, .18, { attack:.008 }); gNoise(t, .08, .12, { type:'bandpass', freq:1200, Q:2, attack:.01 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(400, 'triangle', 0.3, 0.2); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(1200, 'sine', 0.3, 0.15); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(300, 'sine', 0.3, 0.2); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(800, 'triangle', 0.1, 0.15); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(400, 'sine', 0.2, 0.1); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(300, 'sine', 0.08, 0.3); return; }
    if(currentTheme === 'premium') { playSoftADSR(349.23, 'triangle', 0.4, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('yellow'); return; }
    playAdvancedTone(440, 0.4, 0.2); playAdvancedTone(660, 0.3, 0.05); 
  },
  green: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.green(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.green(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.green(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.green(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.green(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.green(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.green(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.green(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.green(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.green(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.green(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.green(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.green(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.green(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.green(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.green(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.green(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.green(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(523.25, 'sine', t, .3, .15, { attack:.005 }); gOsc(659.25, 'sine', t, .3, .15, { attack:.005 }); gOsc(783.99, 'sine', t, .4, .1, { attack:.005 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(880, 'square', t, .2, .2); gOsc(1320, 'square', t+.05, .2, .15); gOsc(1760, 'sine', t+.1, .6, .3); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(880, 'sine', t, .5, .15, { attack:.01 }); gOsc(1760, 'sine', t, .6, .05, { attack:.01 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(440, 'sine', t, .45, .22, { attack:.006 }); gOsc(660, 'sine', t+.02, .35, .14, { attack:.006 }); gOsc(880, 'sine', t+.04, .25, .07, { attack:.006 }); gNoise(t, .03, .20, { type:'highpass', freq:2000, Q:.8, attack:.001 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(600, 'triangle', 0.5, 0.3); setTimeout(() => playSoftADSR(800, 'triangle', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.5, 0.2); setTimeout(() => playSoftADSR(2500, 'sine', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(500, 'sine', 0.5, 0.3); setTimeout(() => playSoftADSR(750, 'sine', 0.6, 0.3), 40); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1200, 'triangle', 0.2, 0.2); setTimeout(() => playSoftADSR(1600, 'triangle', 0.3, 0.2), 40); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(600, 'sine', 0.4, 0.1); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(880, 'sine', 0.2, 1.0); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.5), 100); return; }
    if(currentTheme === 'premium') { playSoftADSR(523.25, 'triangle', 0.6, 0.2); playSoftADSR(659.25, 'triangle', 0.6, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playAdvancedTone(523.25, 0.5, 0.25); playAdvancedTone(1046.5, 0.4, 0.08); 
  },
  greenKnown: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.greenKnown(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.greenKnown(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.greenKnown(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.greenKnown(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.greenKnown(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.greenKnown(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.greenKnown(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.greenKnown(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.greenKnown(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(523.25, 'sine', t, .3, .15, { attack:.005 }); gOsc(659.25, 'sine', t, .3, .15, { attack:.005 }); gOsc(783.99, 'sine', t, .4, .1, { attack:.005 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(880, 'square', t, .2, .2); gOsc(1320, 'square', t+.05, .2, .15); gOsc(1760, 'sine', t+.1, .6, .3); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(880, 'sine', t, .5, .15, { attack:.01 }); gOsc(1760, 'sine', t, .6, .05, { attack:.01 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(440, 'sine', t, .45, .22, { attack:.006 }); gOsc(660, 'sine', t+.02, .35, .14, { attack:.006 }); gOsc(880, 'sine', t+.04, .25, .07, { attack:.006 }); gNoise(t, .03, .20, { type:'highpass', freq:2000, Q:.8, attack:.001 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(600, 'triangle', 0.5, 0.3); setTimeout(() => playSoftADSR(800, 'triangle', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.5, 0.2); setTimeout(() => playSoftADSR(2500, 'sine', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(500, 'sine', 0.5, 0.3); setTimeout(() => playSoftADSR(750, 'sine', 0.6, 0.3), 40); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1200, 'triangle', 0.2, 0.2); setTimeout(() => playSoftADSR(1600, 'triangle', 0.3, 0.2), 40); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(600, 'sine', 0.4, 0.1); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(880, 'sine', 0.2, 1.0); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.5), 100); return; }
    if(currentTheme === 'premium') { playSoftADSR(523.25, 'triangle', 0.6, 0.2); playSoftADSR(659.25, 'triangle', 0.6, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playAdvancedTone(523.25, 0.5, 0.25); playAdvancedTone(1046.5, 0.4, 0.08); 
  },
  xp: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.xp(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.xp(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.xp(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.xp(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.xp(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.xp(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.xp(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.xp(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.xp(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.xp(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.xp(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.xp(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.xp(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.xp(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.xp(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.xp(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.xp(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.xp(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(600, 'sine', t, .05, .15); gOsc(800, 'sine', t+.04, .05, .15); gOsc(1000, 'sine', t+.08, .1, .15); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(1200, 'square', t, .05, .2); gOsc(1600, 'square', t+.05, .15, .2); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(1200, 'sine', t, .1, .05); gOsc(1500, 'sine', t+.05, .1, .05); gOsc(2000, 'sine', t+.1, .2, .05); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(880, 'sine', t, .40, .18, { attack:.005 }); gOsc(1100, 'sine', t+.04, .30, .10, { attack:.005 }); gNoise(t, .03, .15, { type:'highpass', freq:4000, Q:1, attack:.001 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(1000, 'triangle', 0.4, 0.1); setTimeout(() => playSoftADSR(1300, 'triangle', 0.5, 0.1), 40); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(3000, 'sine', 0.3, 0.1); setTimeout(() => playSoftADSR(3500, 'sine', 0.4, 0.1), 40); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(800, 'sine', 0.4, 0.15); setTimeout(() => playSoftADSR(1000, 'sine', 0.5, 0.15), 40); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1500, 'triangle', 0.2, 0.1); setTimeout(() => playSoftADSR(2000, 'triangle', 0.2, 0.1), 40); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(800, 'sine', 0.3, 0.1); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(880, 'sine', 0.2, 0.5); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.0), 100); return; }
    if(currentTheme === 'premium') { playSoftADSR(1046.5, 'sine', 0.4, 0.05); setTimeout(() => playSoftADSR(1567.98, 'sine', 0.6, 0.05), 40); return; }
    if(currentTheme === 'assets') { playAsset('xp'); return; }
    playAdvancedTone(1200, 0.2, 0.05); setTimeout(() => playAdvancedTone(1500, 0.3, 0.05), 50); 
  },
  win: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.win(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.win(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.win(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.win(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.win(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.win(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.win(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.win(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.win(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.win(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.win(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.win(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.win(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.win(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.win(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.win(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.win(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.win(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ [523.25, 659.25, 783.99, 1046.50].forEach((f,i) => gOsc(f, 'sine', t+i*.06, .3, .15, {attack:.01})); gOsc(1046.50, 'sine', t+.24, 1.0, .2); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f,i) => gOsc(f, 'square', t+i*.08, .2, .15)); gOsc(1046.5, 'sine', t+.4, 2.0, .2); gOsc(1567.98, 'sine', t+.4, 2.0, .2); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(440, 'sine', t, 1.5, .1, { attack:.2 }); gOsc(550, 'sine', t+.1, 1.5, .08, { attack:.2 }); gOsc(660, 'sine', t+.2, 1.5, .08, { attack:.2 }); gOsc(880, 'sine', t+.3, 2.0, .05, { attack:.3 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ [220, 330, 440, 550, 660, 880].forEach((f, i) => { gOsc(f, 'sine', t+i*.1, .6, .18, { attack:.02 }); gNoise(t+i*.1, .04, .15, { type:'highpass', freq:2000, Q:1, attack:.002 }); }); } return; }
    if(currentTheme === 'asmr-wood') { 
        [
          { f: 261.63, t: 0 }, { f: 329.63, t: 150 }, { f: 392.00, t: 300 }, { f: 523.25, t: 450 },
          { f: 392.00, t: 750 }, { f: 659.25, t: 900, d: 1.5 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'triangle', 0.15, n.d || 0.4), n.t));
        return; 
    }
    if(currentTheme === 'asmr-glass') { 
        [
          { f: 523.25, t: 0 }, { f: 659.25, t: 100 }, { f: 783.99, t: 200 }, { f: 987.77, t: 300 },
          { f: 1046.50, t: 450 }, { f: 783.99, t: 600 }, { f: 1318.51, t: 800, d: 2.0 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.08, n.d || 0.5), n.t));
        setTimeout(() => playSoftNoise(0.015, 2.0), 800);
        return; 
    }
    if(currentTheme === 'asmr-synth') { 
        [
          { f: 392.00, t: 0 }, { f: 523.25, t: 150 }, { f: 659.25, t: 300 }, { f: 783.99, t: 450, d: 0.8 },
          { f: 659.25, t: 850 }, { f: 1046.50, t: 1050, d: 1.5 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'square', 0.05, n.d || 0.3), n.t));
        setTimeout(() => playSoftSweep(800, 400, 0.04, 1.5), 1050);
        return; 
    }
    if(currentTheme === 'asmr-click') { 
        [
          { f: 523.25, t: 0 }, { f: 783.99, t: 150 }, { f: 659.25, t: 300 }, { f: 1046.50, t: 450 },
          { f: 783.99, t: 600 }, { f: 1567.98, t: 900, d: 1.5 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.08, n.d || 0.5), n.t));
        return; 
    }
    if(currentTheme === 'asmr-minimal') { 
        [
          { f: 523.25, t: 0, d: 0.8 }, { f: 783.99, t: 400, d: 0.8 }, 
          { f: 1046.50, t: 1000, d: 2.0 }, { f: 1318.51, t: 1000, d: 2.0 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.08, n.d), n.t));
        return; 
    }
    if(currentTheme === 'asmr-pure') { [
          { f: 261.63, t: 0 }, { f: 329.63, t: 150 }, { f: 392.00, t: 300 }, { f: 523.25, t: 450 },
          { f: 659.25, t: 600, d: 2.0 }, { f: 1046.50, t: 900, d: 3.0 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.2, n.d || 0.6), n.t));
        setTimeout(() => playSoftNoise(0.02, 3.0), 900);
        return; }
    if(currentTheme === 'premium') { 
        [
          { f: 261.63, t: 0 }, { f: 329.63, t: 0 },
          { f: 349.23, t: 400 }, { f: 440.00, t: 400 },
          { f: 392.00, t: 800 }, { f: 493.88, t: 800 },
          { f: 261.63, t: 1200, d: 2.0 }, { f: 329.63, t: 1200, d: 2.0 }, { f: 392.00, t: 1200, d: 2.0 }, { f: 523.25, t: 1200, d: 2.0 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.06, n.d || 0.6), n.t));
        setTimeout(() => playSoftNoise(0.015, 2.0), 1200);
        return; 
    }
    if(currentTheme === 'assets') { playAsset('win'); return; }
    [
      { f: 523.25, t: 0 }, { f: 659.25, t: 300 }, { f: 783.99, t: 600, d: 1.5 }
    ].forEach(n => setTimeout(() => playAdvancedTone(n.f, 0.08, n.d || 0.6), n.t)); 
  },
  xpbar: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.xpbar(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.xpbar(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.xpbar(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.xpbar(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.xpbar(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.xpbar(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.xpbar(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.xpbar(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.xpbar(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(400, 'triangle', t, .1, .1, { freqEnd:800 }); gNoise(t, .1, .1, { type:'highpass', freq:1000, Q:1 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(1000, 'square', t, .05, .1, { freqEnd: 1500 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gNoise(t, .1, .05, { type:'highpass', freq:2000, Q:1 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(400, 'sine', t, .05, .15, { attack:.002, freqEnd:350 }); gNoise(t, .02, .1, { type:'bandpass', freq:1000, Q:2, attack:.001 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(150, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.03, 0.06); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(200, 'sine', 0.1, 0.15); return; }
    if(currentTheme === 'asmr-click') { playSoftNoise(0.02, 0.05); return; }
    if(currentTheme === 'asmr-minimal') { return; } 
    if(currentTheme === 'asmr-pure') { playSoftADSR(200, 'sine', 0.1, 0.2); return; }
    if(currentTheme === 'premium') { playSoftNoise(0.03, 0.06); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playSoftSweep(300, 800, 0.1, 0.1);
  },
  hintWhoosh: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.hintWhoosh(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.hintWhoosh(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.hintWhoosh(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.hintWhoosh(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(600, 'triangle', t, .1, .2, { attack:.01 }); gOsc(800, 'sine', t+.05, .1, .15); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(800, 'sine', t, .3, .2, { freqEnd: 2000 }); gNoise(t, .3, .2, { type:'highpass', freq:1000, Q:1 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gNoise(t, 1.0, .1, { type:'bandpass', freq:1500, Q:0.5, attack:.3 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t) gNoise(t, .30, .2, { type:'bandpass', freq:400, Q:1, attack:.1 }); return; }
    if(['asmr-wood', 'asmr-glass', 'asmr-synth', 'asmr-click', 'asmr-minimal', 'premium'].includes(currentTheme)) { playSoftNoise(0.03, 0.05); return; }
    if(currentTheme === 'assets') { playAsset('hint'); return; }
    playSoftSweep(600, 200, 0.3, 0.1);
  },
  hintReveal: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.hintReveal(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.hintReveal(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.hintReveal(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.hintReveal(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.hintReveal(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.hintReveal(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.hintReveal(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.hintReveal(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.hintReveal(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ [880, 1108.73, 1318.51, 1760.00].forEach((f, i) => gOsc(f, 'sine', t+i*.05, .4, .1, { attack:.01 })); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(1500, 'square', t, .2, .2); gOsc(2000, 'sine', t+.1, .6, .3); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(800, 'sine', t, .5, .1, { attack:.1 }); gOsc(1200, 'sine', t+.2, .8, .1, { attack:.1 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(550, 'sine', t, .3, .18, { attack:.01 }); gOsc(880, 'sine', t+.05, .4, .15, { attack:.01 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(800, 'triangle', 0.5, 0.3); setTimeout(() => playSoftADSR(1000, 'triangle', 0.6, 0.2), 50); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2500, 'sine', 0.4, 0.3); setTimeout(() => playSoftADSR(3000, 'sine', 0.3, 0.2), 50); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(600, 'sine', 0.5, 0.3); setTimeout(() => playSoftADSR(800, 'sine', 0.6, 0.2), 50); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1200, 'triangle', 0.2, 0.2); setTimeout(() => playSoftADSR(1600, 'triangle', 0.3, 0.2), 50); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(1000, 'sine', 0.3, 0.2); return; }
    if(currentTheme === 'asmr-pure') { playSoftSweep(400, 200, 0.1, 0.2); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(880, 'sine', 0.2, 1.0); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.5), 100); return; }
    if(currentTheme === 'premium') { playSoftADSR(1500, 'sine', 0.4, 0.3); setTimeout(() => playSoftADSR(2000, 'sine', 0.3, 0.2), 50); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playAdvancedTone(800, 0.6, 0.2); playAdvancedTone(1200, 0.4, 0.1); 
  },
  bombDrop: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.bombDrop(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.bombDrop(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.bombDrop(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.bombDrop(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.bombDrop(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.bombDrop(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.bombDrop(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.bombDrop(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.bombDrop(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(600, 'triangle', t, .1, .2, { attack:.01 }); gOsc(800, 'sine', t+.05, .1, .15); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(1000, 'square', t, .3, .2, { freqEnd: 100 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gNoise(t, .6, .1, { type:'bandpass', freq:600, Q:1, attack:.2 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gOsc(150, 'sine', t, .4, .2, { attack:.05, freqEnd:50 }); } return; }
    if(['asmr-wood', 'asmr-glass', 'asmr-synth', 'asmr-click', 'asmr-minimal', 'premium'].includes(currentTheme)) { playSoftNoise(0.03, 0.05); return; }
    if(currentTheme === 'assets') { playAsset('bomb_drop'); return; }
    playSoftSweep(800, 200, 0.3, 0.15);
  },
  bombExplode: () => { 
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.bombExplode(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.bombExplode(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.bombExplode(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.bombExplode(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.bombExplode(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.bombExplode(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.bombExplode(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.bombExplode(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.bombExplode(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(80, 'sine', t, .6, .5, { attack:.02, freqEnd:20 }); gNoise(t, .5, .3, { type:'lowpass', freq:300, Q:0.5, attack:.05 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gNoise(t, .6, .4, { type:'lowpass', freq:800, Q:0.5 }); gOsc(100, 'sawtooth', t, .4, .3, { freqEnd:40 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gNoise(t, .8, .15, { type:'lowpass', freq:400, Q:0.5, attack:.02 }); gOsc(80, 'sine', t, .4, .1, { attack:.02, freqEnd:50 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .3, .35, { type:'lowpass', freq:250, Q:0.5, attack:.01 }); gOsc(100, 'sine', t, .25, .2, { attack:.01, freqEnd:60 }); } return; }
    if(currentTheme === 'asmr-wood') { playSoftADSR(150, 'sine', 0.3, 0.1); playSoftNoise(0.02, 0.05); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(180, 'sine', 0.2, 0.1); playSoftNoise(0.04, 0.05); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(100, 'sine', 0.3, 0.1); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(140, 'triangle', 0.2, 0.08); playSoftNoise(0.05, 0.05); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(120, 'sine', 0.2, 0.08); return; }
    if(currentTheme === 'asmr-pure') { playSoftNoise(0.03, 0.1); return; }
    if(currentTheme === 'asmr-pure') { playSoftADSR(150, 'sine', 0.1, 0.2); playSoftNoise(0.04, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'sine', 0.2, 0.1); playSoftNoise(0.03, 0.08); return; }
    if(currentTheme === 'assets') { playAsset('bomb_explode'); return; }
    playSoftNoise(0.3, 0.5); playAdvancedTone(80, 0.3, 0.5); 
  },
  lose: () => {
    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.lose(); return; }
    if(currentTheme === 'primary') { ThemePrimaryToneManager.lose(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.lose(); return; }
    if(currentTheme === 'main-6') { MainSixToneManager.lose(); return; }
    if(currentTheme === 'main-5') { MainFiveToneManager.lose(); return; }
    if(currentTheme === 'main-4') { MainFourToneManager.lose(); return; }
    if(currentTheme === 'main-3') { MainThreeToneManager.lose(); return; }
    if(currentTheme === 'main-2') { MainTwoToneManager.lose(); return; }
    if(currentTheme === 'main-geo') { MainGeoToneManager.lose(); return; }
    if(currentTheme === 'streamer-sweet') { SweetVictoryToneManager.lose(); return; }
    if(currentTheme === 'streamer-geo-v4') { PremiumGeoToneManager.lose(); return; }
    if(currentTheme === 'streamer-geo-v3') { PerfectGeoToneManager.lose(); return; }
    if(currentTheme === 'streamer-hybrid') { HybridToneManager.lose(); return; }
    if(currentTheme === 'streamer-muted') { MutedToneManager.lose(); return; }
    if(currentTheme === 'streamer-prominent') { ProminentToneManager.lose(); return; }
    if(currentTheme === 'streamer-royal') { RoyalToneManager.lose(); return; }
    if(currentTheme === 'streamer-premium') { PremiumToneManager.lose(); return; }
    if(currentTheme === 'streamer-tone') { ToneManager.lose(); return; }
    if(currentTheme === 'streamer-pro') { const t=fCtx(); if(t){ gOsc(200, 'triangle', t, .5, .25, { attack:.05, freqEnd:100 }); gOsc(150, 'triangle', t+.3, .8, .25, { attack:.05, freqEnd:80 }); } return; }
    if(currentTheme === 'wordle-dopamine') { const t=fCtx(); if(t){ gOsc(300, 'sawtooth', t, .4, .2, { freqEnd:150 }); gOsc(200, 'sawtooth', t+.4, .6, .2, { freqEnd:100 }); } return; }
    if(currentTheme === 'soft-ui') { const t=fCtx(); if(t){ gOsc(300, 'sine', t, .4, .15, { attack:.1 }); gOsc(250, 'sine', t+.3, .6, .15, { attack:.1, freqEnd:220 }); } return; }
    if(currentTheme === 'forest') { const t=fCtx(); if(t){ gNoise(t, .25, .30, { type:'lowpass', freq:300, Q:1, attack:.01 }); gOsc(140, 'sine', t, .20, .18, { attack:.01, freqEnd:80 }); } return; }
  }
};

const playSFX = (name: keyof typeof SFX) => { if (SFX[name]) SFX[name](); };

const WORDS = [
  "crane", "slate", "audio", "plant", "light", "tiger", "frost", "brave", "cloud", "drink",
  "flame", "globe", "heart", "index", "jazzy", "knack", "lemon", "mount", "nerve", "oxide",
  "pixel", "quest", "river", "solar", "trust", "ultra", "vivid", "width", "xenon", "yacht",
  "blaze", "chalk", "diver", "elder", "fable", "grind", "hinge", "inlet", "joker", "lance"
];

const KB_LAYOUT = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m','⌫']
];

type KeyState = 'correct' | 'present' | 'absent' | 'orange' | 'destroyed' | null;
type IntroStage = 'waiting' | 'init' | 'round1' | '20sec' | '3' | '2' | '1' | 'playing';

interface FlightItem {
  id: number;
  type: 'hint' | 'bomb' | 'xp';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface CasualWordleProps {
  onClose?: () => void;
}

export default function CasualWordle({ onClose }: CasualWordleProps) {
  // Game State
  const [answer, setAnswer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [grid, setGrid] = useState<{ char: string, state: KeyState }[][]>(
    Array(6).fill(null).map(() => Array(5).fill({ char: '', state: null }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [introStage, setIntroStage] = useState<IntroStage>('waiting');
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [keyboardState, setKeyboardState] = useState<Record<string, KeyState>>({});
  
  // HUD
  const [activeAudioTheme, setActiveAudioTheme] = useState<AudioTheme>('main-geo');
  const [hintsLeft, setHintsLeft] = useState(1);
  const [bombsLeft, setBombsLeft] = useState(1);
  const [totalXP, setTotalXP] = useState(0); 
  const [displayedXP, setDisplayedXP] = useState(0);
  const [opponentXP, setOpponentXP] = useState(0);
  const [msg, setMsg] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Opponent AI State
  const [hostRow, setHostRow] = useState(0);
  const [hostSolved, setHostSolved] = useState(false);
  
  const [endState, setEndState] = useState<'playing'|'win'|'tries'|'timeout'>('playing');
  const [showVictoryCard, setShowVictoryCard] = useState(false);

  // Animation Triggers
  const [animatingTiles, setAnimatingTiles] = useState<Record<string, 'pop' | 'shake' | 'flip' | 'dance'>>({});
  const [floatXPText, setFloatXPText] = useState<{ id: number, text: string, row: number, col: number }[]>([]);
  const [timerXPText, setTimerXPText] = useState<{ id: number, text: string } | null>(null);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  
  // Refs
  const floatIdRef = useRef(0);
  const flightIdRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const hintBtnRef = useRef<HTMLButtonElement>(null);
  const bombBtnRef = useRef<HTMLButtonElement>(null);

  // Synchronize Audio Theme State with Audio Engine
  useEffect(() => { setTheme(activeAudioTheme); }, [activeAudioTheme]);

  // --- Intro Sequence Orchestration ---
  useEffect(() => {
    if (introStage === 'init') {
      setTimeout(() => setIntroStage('round1'), 500);
    } else if (introStage === 'round1') {
      playSFX('roundInfo'); triggerHaptic(50);
      setTimeout(() => setIntroStage('20sec'), 800);
    } else if (introStage === '20sec') {
      playSFX('roundInfo'); triggerHaptic(50);
      setTimeout(() => setIntroStage('3'), 1500);
    } else if (introStage === '3') {
      playSFX('timer3'); triggerHaptic(100);
      setTimeout(() => setIntroStage('2'), 1000);
    } else if (introStage === '2') {
      playSFX('timer3'); triggerHaptic(100);
      setTimeout(() => setIntroStage('1'), 1000);
    } else if (introStage === '1') {
      playSFX('timer0'); triggerHaptic(100);
      setTimeout(() => { triggerHaptic(200); setIntroStage('playing'); }, 1000);
    }
  }, [introStage]);

  // --- Timer Tick ---
  useEffect(() => {
    if (introStage !== 'playing') return;
    
    const int = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(int);
          if (endState === 'playing') {
             setEndState('timeout');
             setGameOver(true);
             setShowVictoryCard(true);
             playSFX('lose');
          }
          playSFX('timer0');
          return 0;
        }
        
        // Freeze local timer strictly for Win State explicitly
        if (endState === 'win') {
           clearInterval(int);
           return prev;
        }
        
        // For 'playing' or 'tries', naturally tick down to zero
        const next = prev - 1;
        if (next === 10) playSFX('timer10');
        if (next <= 3 && next > 0) playSFX('timer3');
        return next;
      });
    }, 1000);
    
    return () => clearInterval(int);
  }, [introStage, endState]);



  // --- Opponent AI Simulation ---
  useEffect(() => {
    if (introStage !== 'playing' || gameOver || hostSolved || timeLeft <= 0) return;
    
    // Every ~2.5 - 4.5 seconds, Host makes a guess
    const timeout = setTimeout(() => {
      const couldSolve = hostRow >= 2 && Math.random() < 0.35;
      
      if (couldSolve) {
        setHostSolved(true);
        playSFX('yellow');
        
        const hostGain = 5000 + (Math.floor(Math.random() * 3) * 1000);
        const hRect = document.getElementById('host-avatar')?.getBoundingClientRect();
        const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
        const flightId = flightIdRef.current++;
        setFlights(prev => [...prev, {
          id: flightId, type: 'xp',
          startX: hRect ? hRect.x + hRect.width/2 : window.innerWidth - 60, 
          startY: hRect ? hRect.y + hRect.height/2 : window.innerHeight / 2,
          endX: barRect ? barRect.x + barRect.width - 40 : window.innerWidth - 60, 
          endY: barRect ? barRect.y + barRect.height/2 : 100 
        }]);
        setTimeout(() => setFlights(prev => prev.filter(f => f.id !== flightId)), 600);
        
        setTimeout(() => {
           setOpponentXP(prev => prev + hostGain);
           playSFX('xpbar');
        }, 200);

      } else {
         if (hostRow < 5) setHostRow(prev => prev + 1);
         const greens = Math.random() > 0.5 ? (Math.random() > 0.5 ? 2 : 1) : 0;
         if (greens > 0) {
            const hRect = document.getElementById('host-avatar')?.getBoundingClientRect();
            const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
            const flightId = flightIdRef.current++;
            setFlights(prev => [...prev, {
              id: flightId, type: 'xp',
              startX: hRect ? hRect.x + hRect.width/2 : window.innerWidth - 60, 
              startY: hRect ? hRect.y + hRect.height/2 : window.innerHeight / 2, 
              endX: barRect ? barRect.x + barRect.width - 40 : window.innerWidth - 60, 
              endY: barRect ? barRect.y + barRect.height/2 : 100 
            }]);
            setTimeout(() => setFlights(prev => prev.filter(f => f.id !== flightId)), 600);
            setTimeout(() => {
               setOpponentXP(prev => prev + hostGain);
               playSFX('xpbar');
            }, 200);
         }
      }
    }, 2500 + Math.random() * 2000);
    
    return () => clearTimeout(timeout);
  }, [introStage, gameOver, hostRow, hostSolved, timeLeft]);

  // --- XP Animation ---
  useEffect(() => {
    if (displayedXP < totalXP) {
      const interval = setInterval(() => {
        setDisplayedXP(prev => {
          const next = prev + Math.ceil((totalXP - prev) / 4);
          if (next >= totalXP) clearInterval(interval);
          return Math.min(next, totalXP);
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [totalXP, displayedXP]);

  const fastReset = () => {
    setGrid(Array(6).fill(null).map(() => Array(5).fill({ char: '', state: null })));
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setCurrentRow(0);
    setCurrentCol(0);
    setTypedLetters([]);
    setGameOver(false);
    setEndState('playing');
    setHostSolved(false);
    setHostRow(0);
    setAnimatingTiles({});
    setFloatXPText([]);
    setFlights([]);
    setMsg('');
    setKeyboardState({});
    setTimeLeft(30);
    setShowVictoryCard(false);
    setHintsLeft(1);
    setBombsLeft(1);
    setTimerXPText(null);
    isSubmittingRef.current = false;
    setIntroStage('init');
  };

  const resetBoard = () => {
    setGrid(Array(6).fill(null).map(() => Array(5).fill({ char: '', state: null })));
    setCurrentRow(0);
    setCurrentCol(0);
    setTypedLetters([]);
    setGameOver(false);
    setEndState('playing');
    setAnimatingTiles({});
    setKeyboardState({});
    setShowVictoryCard(false);
    setHintsLeft(1);
    setBombsLeft(1);
    setTimeLeft(30);
    isSubmittingRef.current = false;
  };

  // --- Core Actions ---
  const handleKey = useCallback((k: string) => {
    if (gameOver || introStage !== 'playing') return;
    
    if (k === 'Enter') { submitRow(); } 
    else if (k === '⌫' || k === 'Backspace') {
      if (currentCol > 0) {
        const newCol = currentCol - 1;
        setGrid(prev => {
          const nv = [...prev];
          nv[currentRow] = [...nv[currentRow]];
          nv[currentRow][newCol] = { char: '', state: null };
          return nv;
        });
        setTypedLetters(prev => prev.slice(0, -1));
        setCurrentCol(newCol);
        playSFX('delete');
      }
    } else if (/^[a-zA-Z]$/.test(k) && k.length === 1) {
      if (currentCol < 5) {
        setGrid(prev => {
          const nv = [...prev];
          nv[currentRow] = [...nv[currentRow]];
          nv[currentRow][currentCol] = { char: k.toLowerCase(), state: null };
          return nv;
        });
        setAnimatingTiles(prev => ({ ...prev, [`${currentRow}-${currentCol}`]: 'pop' }));
        setTimeout(() => setAnimatingTiles(prev => { const nv = { ...prev }; delete nv[`${currentRow}-${currentCol}`]; return nv; }), 100);
        
        setTypedLetters(prev => [...prev, k.toLowerCase()]);
        setCurrentCol(currentCol + 1);
        playSFX('type');
        triggerHaptic(10); // subtle tap
      }
    }
  }, [currentRow, currentCol, typedLetters, gameOver, introStage]);

  // Keyboard Event Hook
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') handleKey('Enter');
      else if (e.key === 'Backspace') handleKey('⌫');
      else if (/^[a-z]$/i.test(e.key) && e.key.length === 1) handleKey(e.key.toLowerCase());
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [handleKey]);

  const submitRow = () => {
    if (gameOver || isSubmittingRef.current) return;
    if (currentCol < 5) {
      const shakeMap: Record<string, 'pop'|'shake'|'flip'|'dance'> = {};
      for(let i=0; i<5; i++) shakeMap[`${currentRow}-${i}`] = 'shake';
      setAnimatingTiles(prev => ({ ...prev, ...shakeMap }));
      triggerHaptic([50, 50, 50]); // ERROR SHAKE!
      setTimeout(() => setAnimatingTiles(prev => { const nv = { ...prev }; for(let i=0; i<5; i++) delete nv[`${currentRow}-${i}`]; return nv; }), 300);
      setMsg('NOT ENOUGH LETTERS'); setTimeout(() => setMsg(''), 1500);
      playSFX('error');
      return;
    }

    isSubmittingRef.current = true;
    const guess = [...typedLetters];
    playSFX('submit');
    setMsg('');
    
    // Evaluate Setup
    const result: KeyState[] = Array(5).fill('absent');
    const answerArr = answer.split('');
    
    for (let i=0; i<5; i++) {
      if (guess[i] === answerArr[i]) { result[i] = 'correct'; answerArr[i] = ''; }
    }
    for (let i=0; i<5; i++) {
      if (result[i] === 'correct') continue;
      const idx = answerArr.indexOf(guess[i]);
      if (idx !== -1) { result[i] = 'present'; answerArr[idx] = ''; }
    }

    const newlyGreenCols = new Set<number>();
    result.forEach((state, i) => {
      if (state === 'correct') {
        const wasAlreadyGreen = Array.from({ length: currentRow }).some((_, prevR) => grid[prevR][i].state === 'correct');
        if (!wasAlreadyGreen) newlyGreenCols.add(i);
      }
    });

    result.forEach((state, i) => {
      // Trigger the 3D flip animation
      setTimeout(() => {
        setAnimatingTiles(prev => ({ ...prev, [`${currentRow}-${i}`]: 'flip' }));
      }, i * 180);

      // Exactly halfway through the flip, change the DOM color
      setTimeout(() => {
        setGrid(prev => {
          const nv = [...prev]; nv[currentRow] = [...nv[currentRow]]; nv[currentRow][i] = { ...nv[currentRow][i], state };
          return nv;
        });
        
        triggerHaptic(50); // Small bump for reveal
        
        if (state === 'correct') {
          if (newlyGreenCols.has(i)) playSFX('green');
          else playSFX('greenKnown');
        } else if (state === 'present') playSFX('yellow');
        else playSFX('gray');
        
        if (state === 'correct' && newlyGreenCols.has(i)) {
          setTimeout(() => { 
             playSFX('xp'); 
             showXPFloat('+1000', currentRow, i); 
             
             // Trigger XP Flight to Bar
             const tileRect = document.getElementById(`wb-tile-${currentRow}-${i}`)?.getBoundingClientRect();
             const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
             if (tileRect && barRect) {
                const flightId = flightIdRef.current++;
                setFlights(prev => [...prev, {
                  id: flightId, type: 'xp',
                  startX: tileRect.x + tileRect.width / 2, startY: tileRect.y + tileRect.height / 2,
                  endX: barRect.x + 40, endY: barRect.y + barRect.height / 2 // targeting user XP side
                }]);
                setTimeout(() => setFlights(prev => prev.filter(f => f.id !== flightId)), 600); // Wait for transit
             }
          }, 150); // XP chime
        }
      }, i * 180 + 150); // Halfway point to change color
    });

    const earnedXP = newlyGreenCols.size * 1000;

    setTimeout(() => {
      setKeyboardState(prev => {
        const next = { ...prev };
        result.forEach((state, i) => {
          const letter = guess[i];
          if (next[letter] === 'destroyed') return; 
          if (next[letter] === 'orange') next[letter] = state; 
          else if (next[letter] !== 'correct') {
            if (state === 'correct') next[letter] = 'correct';
            else if (state === 'present' && next[letter] !== 'present') next[letter] = 'present';
            else if (state === 'absent' && !next[letter]) next[letter] = 'absent';
          }
        });
        return next;
      });

      const won = result.every(s => s === 'correct');
      if (won) {
        playSFX('win'); 
        setEndState('win');
        setGameOver(true);
        
        // 1. "Solved it!" +5000XP Flight instantly
        setTimeout(() => {
            const uRect = document.getElementById('user-avatar')?.getBoundingClientRect();
            const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
            const flightId2 = flightIdRef.current++;
            setFlights(prev => [...prev, {
              id: flightId2, type: 'xp',
              startX: uRect ? uRect.x + uRect.width/2 : 60, 
              startY: uRect ? uRect.y + uRect.height/2 : window.innerHeight / 2,
              endX: barRect ? barRect.x + 40 : 60, 
              endY: barRect ? barRect.y + barRect.height/2 : 100
            }]);
            
            setTimeout(() => {
                setFlights(prev => prev.filter(f => f.id !== flightId2));
                setTotalXP(prev => prev + earnedXP + 5000);
            }, 600);
        }, 100);

        // 2. Letters flip and award +1000XP (0-1000ms organically executed below)

        // At 1000ms: Trigger dance cascade
        setTimeout(() => {
           for(let j=0; j<5; j++) {
              setTimeout(() => setAnimatingTiles(prev => ({ ...prev, [`${currentRow}-${j}`]: 'dance' })), j * 100);
           }
           setTimeout(() => { 
               playSFX('xpbar'); 
               triggerHaptic([100, 50, 100, 50, 200]); 
           }, 500);
        }, 1000);

        // 3. Timer XP Bonus Flight (1100ms)
        setTimeout(() => {
            if (timeLeft > 0) {
               const pillRect = document.getElementById('wb-timer-pill')?.getBoundingClientRect();
               const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
               const flightId = flightIdRef.current++;
               const timeBonus = timeLeft * 100;
               
               // Timer -> Bubble Transfer Logic
               let currentBonus = 0;
               let drained = 0;
               const totalSteps = timeLeft;
               
               // Spawn the stationary bubble initially at 0
               setTimerXPText({ id: floatIdRef.current++, text: `+0` });
               
               const drainInt = setInterval(() => {
                   drained++;
                   currentBonus += 100;
                   setTimeLeft(prev => Math.max(0, prev - 1));
                   
                   // Update the stationary bubble's text dynamically without changing its ID
                   setTimerXPText(prev => prev ? { ...prev, text: `+${currentBonus}` } : null);
                   playSFX('xp'); // Rapid tick per step
                   
                   if (drained >= totalSteps) {
                       clearInterval(drainInt);
                       
                       // Transfer finished! Wait a beat, then launch the flight to the XP bar
                       setTimeout(() => {
                          const pillRect = document.getElementById('wb-timer-pill')?.getBoundingClientRect();
                          const barRect = document.getElementById('wb-xp-bar')?.getBoundingClientRect();
                          const flightId = flightIdRef.current++;
                          
                          setTimerXPText(null); // Hide stationary bubble
                          
                          // Launch the visual blue balloon
                          setFlights(prev => [...prev, {
                             id: flightId, type: 'xp',
                             startX: pillRect ? pillRect.x + pillRect.width/2 : window.innerWidth/2,
                             startY: pillRect ? pillRect.y - 20 : 100, // Starts a bit higher since it hovered
                             endX: barRect ? barRect.x + 40 : 60,
                             endY: barRect ? barRect.y + barRect.height/2 : 100
                          }]);
                          
                          // After flight duration, add total to the main bar
                          setTimeout(() => {
                             setFlights(prev => prev.filter(f => f.id !== flightId));
                             setTotalXP(prev => prev + currentBonus);
                             playSFX('xpbar'); // Final heavy hit on connection
                          }, 600);
                          
                       }, 400); // 400ms pause to admire the accumulated score
                   }
               }, 30); // 30ms ultra fast drain rate
            }
        }, 1600);

        // 4. Slide Row Down & Show Victory Card Decals (2000ms)
        setTimeout(() => {
            setShowVictoryCard(true);
        }, 2500);
        
      } else {
        if (earnedXP > 0) { setTimeout(() => { setTotalXP(prev => prev + earnedXP); playSFX('xpbar'); }, 200); }
        if (currentRow + 1 >= 6) { 
            setGameOver(true); 
            setEndState('tries');
            setTimeout(() => setShowVictoryCard(true), 800);
            triggerHaptic([50, 100, 50]); 
        } 
        else { 
            setCurrentRow(r => r + 1); 
            setCurrentCol(0); 
            setTypedLetters([]); 
        }
        setTimeout(() => {
           isSubmittingRef.current = false;
        }, 1500); 
      }
    }, result.length * 180 + 350);
  };

  const forceState = (state: 'win' | 'tries' | 'timeout') => {
      if (gameOver) return;
      setIntroStage('playing'); // Ensure we get past intro blocking
      setEndState(state);
      setGameOver(true);
      
      if (state === 'win') {
          playSFX('win');
          setTimeout(() => setShowVictoryCard(true), 500); 
      } else if (state === 'tries') {
          playSFX('lose');
          setTimeout(() => setShowVictoryCard(true), 100);
      } else if (state === 'timeout') {
          setTimeLeft(0);
          playSFX('timer0');
          setTimeout(() => setShowVictoryCard(true), 100);
      }
  };

  const showXPFloat = (text: string, row: number, col: number) => {
    const id = floatIdRef.current++;
    setFloatXPText(prev => [...prev, { id, text, row, col }]);
    setTimeout(() => setFloatXPText(prev => prev.filter(item => item.id !== id)), 900);
  };

  // --- Flight Animations ---
  const triggerHint = () => {
    if (hintsLeft <= 0 || gameOver) return;
    playSFX('type');
    
    const answerArr = answer.split('');
    const unrevealedLetters = answerArr.filter(char => keyboardState[char] !== 'orange' && keyboardState[char] !== 'correct');
    if (unrevealedLetters.length === 0) return;

    setHintsLeft(0);
    playSFX('hintWhoosh');

    const target = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    
    // Math DOM Coordinates
    const btnRect = hintBtnRef.current?.getBoundingClientRect();
    const keyRect = document.getElementById(`wb-key-${target}`)?.getBoundingClientRect();

    if (btnRect && keyRect) {
      const flightId = flightIdRef.current++;
      setFlights(prev => [...prev, {
        id: flightId, type: 'hint',
        startX: btnRect.x + btnRect.width / 2,
        startY: btnRect.y + btnRect.height / 2,
        endX: keyRect.x + keyRect.width / 2,
        endY: keyRect.y + keyRect.height / 2
      }]);

      // Flight duration matches the timeout
      setTimeout(() => {
        playSFX('hintReveal');
        triggerHaptic([50, 50]);
        setKeyboardState(prev => ({ ...prev, [target]: 'orange' }));
        setFlights(prev => prev.filter(f => f.id !== flightId));
      }, 700);
    }
  };

  const triggerBomb = () => {
    if (bombsLeft <= 0 || gameOver) return;
    playSFX('type');
    
    const possibleTargets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
      .filter(char => !answer.split('').includes(char) && keyboardState[char] !== 'destroyed' && keyboardState[char] !== 'orange');

    if (possibleTargets.length === 0) return;

    setBombsLeft(0);
    playSFX('bombDrop');
    
    const btnRect = bombBtnRef.current?.getBoundingClientRect();

    const targets: string[] = [];
    const count = Math.min(4, possibleTargets.length);
    for(let i=0; i<count; i++) {
      const rIndex = Math.floor(Math.random() * possibleTargets.length);
      targets.push(possibleTargets[rIndex]);
      possibleTargets.splice(rIndex, 1);
    }

    if (!btnRect) return;

    targets.forEach((char, idx) => {
      // Small staggering logic
      setTimeout(() => {
        const keyRect = document.getElementById(`wb-key-${char}`)?.getBoundingClientRect();
        if (keyRect) {
          const flightId = flightIdRef.current++;
          setFlights(prev => [...prev, {
            id: flightId, type: 'bomb',
            startX: btnRect.x + btnRect.width / 2,
            startY: btnRect.y + btnRect.height / 2,
            endX: keyRect.x + keyRect.width / 2,
            endY: keyRect.y + keyRect.height / 2
          }]);

          setTimeout(() => {
            playSFX('bombExplode');
            triggerHaptic([80, 50, 80]); // bomb explosion haptics
            setKeyboardState(prev => ({ ...prev, [char]: 'destroyed' }));
            setFlights(prev => prev.filter(f => f.id !== flightId));
          }, 600); // detonate arrival
        }
      }, idx * 150); // staggered launch
    });
  };

  // --- Render Math ---
  const MAX_XP = 10000;
  const userPercent = Math.min(50, (displayedXP / MAX_XP) * 50);
  const opponentPercent = Math.min(50, (opponentXP / MAX_XP) * 50);

  return (
    <div className="fixed inset-0 z-[100] touch-manipulation font-sans bg-white overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      

      {/* INTRO SEQUENCE OVERLAY */}
      <AnimatePresence>
        {introStage !== 'playing' && (
          <motion.div 
            initial={{ opacity: 1, '--dot-size': '30px' } as any} 
            exit={{ opacity: 0, '--dot-size': '0px' } as any} 
            transition={{ 
              duration: 0.7,
              opacity: { delay: 0.5, duration: 0.2 },
              '--dot-size': { duration: 0.6, ease: "easeIn" }
            } as any}
            style={{
              WebkitMaskImage: 'radial-gradient(circle, black var(--dot-size), transparent calc(var(--dot-size) + 0.5px))',
              WebkitMaskSize: '36px 36px',
              WebkitMaskPosition: 'center',
              maskImage: 'radial-gradient(circle, black var(--dot-size), transparent calc(var(--dot-size) + 0.5px))',
              maskSize: '36px 36px',
              maskPosition: 'center',
            } as any}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-b from-[#1b6bfa] to-[#041235] text-white overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {introStage === 'waiting' && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center z-50 p-8"
                >
                  <button 
                    onClick={() => { initAudio(); setIntroStage('init'); }}
                    className="bg-white text-[#1b6bfa] font-black text-3xl tracking-widest px-12 py-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                  >
                    START
                  </button>
                  <p className="mt-6 text-white/50 font-bold text-sm tracking-wide text-center">Tap to unlock audio</p>
                </motion.div>
              )}
              {(introStage === 'round1' || introStage === '20sec') && (
                <motion.div 
                  key="details"
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-6 z-10"
                >
                  <h1 className="text-[54px] font-black italic tracking-wider drop-shadow-md">ROUND 1</h1>
                  <div className="flex gap-4">
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       className="relative w-[110px] h-[110px] bg-gradient-to-b from-black/80 to-[#1e8dff]/50 rounded-[20px] shadow-2xl flex flex-col items-center justify-center border border-white/10 overflow-hidden"
                    >
                      <span className="text-[44px] font-black leading-none z-10 drop-shadow-md">5</span>
                      <span className="text-[11px] font-black tracking-widest mt-1 z-10 drop-shadow-md">LETTERS</span>
                      <div className="absolute -right-6 -bottom-4 text-[80px] font-black opacity-10 rotate-12 pointer-events-none">A</div>
                    </motion.div>
                    
                    {introStage === '20sec' && (
                      <motion.div 
                         initial={{ opacity: 0, y: 20 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         className="relative w-[110px] h-[110px] bg-gradient-to-b from-black/80 to-[#1e8dff]/50 rounded-[20px] shadow-2xl flex flex-col items-center justify-center border border-white/10 overflow-hidden"
                      >
                        <span className="text-[44px] font-black leading-none z-10 drop-shadow-md">20</span>
                        <span className="text-[11px] font-black tracking-widest mt-1 z-10 drop-shadow-md">SECONDS</span>
                        <div className="absolute -right-2 -bottom-2 text-[60px] opacity-10 -rotate-12 pointer-events-none">⏱️</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {['3', '2', '1'].includes(introStage) && (
                <motion.div 
                  key={introStage}
                  initial={{ opacity: 0, scale: 0.5 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-[160px] font-black italic tracking-tighter drop-shadow-2xl">{introStage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP LEFT CONTROLS (Theme + Dev States) */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-[200] flex flex-col gap-2 items-start pointer-events-none max-w-[calc(100vw-180px)] sm:max-w-none">
        
        {/* THEME TOGGLER */}
        <div className="bg-white pointer-events-auto rounded-[14px] shadow-sm border border-gray-200 p-1 flex flex-nowrap sm:flex-wrap gap-1 items-center max-w-full sm:max-w-[600px] justify-start sm:justify-center text-center overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {(['main-geo', 'main-2', 'main-3', 'main-6', 'theme-duo', 'primary', 'streamer-premium', ] as AudioTheme[]).map((theme, index) => (
              <button
                  key={theme}
                  onClick={() => {
                      if (theme === 'main-geo') { MainGeoToneManager.init(); }
                      if (theme === 'main-2') { MainTwoToneManager.init(); }
                      if (theme === 'main-3') { MainThreeToneManager.init(); }
                      if (theme === 'main-4') { MainFourToneManager.init(); }
                      if (theme === 'main-5') { MainFiveToneManager.init(); }
                      if (theme === 'main-6') { MainSixToneManager.init(); }
                      if (theme === 'theme-wood') { ThemeWoodToneManager.init(); }
                      if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }
                      if (theme === 'theme-primary') { ThemePrimaryToneManager.init(); }
                      if (theme === 'primary') { ThemePrimaryToneManager.init(); }
                      if (theme === 'streamer-premium') { PremiumToneManager.init(); }
                      if (theme === 'streamer-royal') { RoyalToneManager.init(); }
                      if (theme === 'streamer-sweet') { SweetVictoryToneManager.init(); }
                      setActiveAudioTheme(theme);
                  }}
                  className={`shrink-0 px-2 py-1 text-[8px] sm:text-[10px] font-bold uppercase rounded-[10px] tracking-wider transition-all ${activeAudioTheme === theme ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                  {theme.replace('main-', 'MAIN ').replace('theme-', '').replace('streamer-', 'OPT ')}
              </button>
          ))}
        </div>

        {/* DEV STATE CONTROLS */}
        {!onClose && (
          <div className="bg-white pointer-events-auto rounded-[14px] shadow-sm border border-orange-200 p-1 flex flex-nowrap sm:flex-wrap gap-1 items-center justify-start sm:justify-center border-dashed overflow-x-auto hide-scrollbar max-w-full sm:max-w-[600px]" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            <span className="shrink-0 text-[8px] sm:text-[10px] font-black text-orange-400 px-1">DEV</span>
            <button onClick={() => forceState('win')} className="shrink-0 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] bg-green-50 text-green-600 font-bold uppercase rounded-[10px] hover:bg-green-100 transition-colors">WIN</button>
            <button onClick={() => forceState('tries')} className="shrink-0 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] bg-red-50 text-red-600 font-bold uppercase rounded-[10px] hover:bg-red-100 transition-colors">LOSE</button>
            <button onClick={() => forceState('timeout')} className="shrink-0 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] bg-gray-50 text-gray-600 font-bold uppercase rounded-[10px] hover:bg-gray-100 transition-colors">TIME</button>
          </div>
        )}
      </div>

      {/* TOP RIGHT CONTROLS (Close/Reset + Cheat Answer) */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-[300] flex flex-col gap-2 items-end pointer-events-none">
        
        {onClose && (
          <button onClick={onClose} className="p-2 pointer-events-auto text-black/40 hover:text-black transition-colors rounded-full bg-black/5 shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
        
        {!onClose && (
          <div className="flex gap-1 sm:gap-2 pointer-events-auto">
            <button onClick={resetBoard} className="shrink-0 bg-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black tracking-wider shadow-sm border border-transparent hover:bg-orange-600 active:scale-95 transition-all">
              RESET BOARD
            </button>
            <button onClick={fastReset} className="shrink-0 bg-[#111827] text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-black tracking-wider shadow-sm border border-white/20 hover:bg-[#334155] active:scale-95 transition-all">
              RESET ROUND
            </button>
          </div>
        )}

        {/* DEV CHEAT: Show Answer */}
        <div className="bg-black/80 pointer-events-auto text-[#38bdf8] font-mono text-xs px-2 py-1 rounded opacity-50 hover:opacity-100 cursor-help font-bold tracking-widest uppercase shadow-sm">
          {answer}
        </div>

      </div>

      {/* FLYING ELEMENTS LAYER */}
      <div className="absolute inset-0 pointer-events-none z-[110]">
        <AnimatePresence>
          {flights.map(f => (
            <motion.div
              key={f.id}
              initial={{ x: f.startX - 20, y: f.startY - 20, scale: 0.2, rotate: 0 }}
              animate={{ 
                x: f.endX - 24, 
                y: f.endY - 24, 
                scale: f.type === 'xp' ? [0.5, 1.5, 0.8] : [0.5, 2, 1.2], 
                rotate: f.type === 'hint' ? [0, 45, 0] : f.type === 'xp' ? [0, 15, -15, 0] : [0, 360, 720]
              }}
              exit={{ opacity: 0, scale: f.type === 'xp' ? 1 : 2 }}
              transition={{ duration: f.type === 'hint' ? 0.7 : 0.6, ease: "easeInOut" }}
              className={`absolute flex items-center justify-center drop-shadow-xl z-[120]`}
            >
               {f.type === 'hint' ? <span className="text-[48px] font-emoji">🔍</span> 
                : f.type === 'bomb' ? <span className="text-[48px] font-emoji">💣</span> 
                : (
                 <div className="bg-[#1e8dff] text-white rounded-full w-10 h-10 flex items-center justify-center font-black italic text-[14px] shadow-blue-500/50 shadow-lg">
                   XP
                 </div>
                )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[420px] h-[100dvh] mx-auto flex flex-col justify-between relative px-2">
      {/* TOP HEADER - HOST AVATAR */}
      <div className="w-full flex flex-col items-center flex-none pt-2 sm:pt-4 pb-1 sm:pb-2 relative z-10 shrink-0">
        <div className="relative flex justify-center w-full">
          <div className="w-[30%] sm:w-[35%] min-w-[90px] sm:min-w-[120px] max-w-[120px] sm:max-w-[150px] aspect-[19/21] rounded-[35%] rounded-b-[30%] overflow-hidden bg-[#2188ff] relative shadow-lg">
            <img src="https://picsum.photos/seed/scott_wordle/300/300" alt="Host" className="w-full h-full object-cover scale-105 select-none" />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center bg-white shadow-sm rounded-full px-2 py-1 z-10 whitespace-nowrap border border-gray-100">
            <span className="text-[11px] font-black tracking-widest pl-1 pr-1 text-[#111827]">ROUND 1/5</span>
            <span className="text-[#111827]/40 mx-0.5">•</span>
            <div className="bg-[#38bdf8] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full ml-1">$10,000</div>
          </div>
        </div>
      </div>

      {msg && (
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl text-sm font-bold z-50 tracking-wider">
          {msg}
        </div>
      )}

      {/* OPPOSING XP BAR */}
      <div id="wb-xp-bar" className="w-full max-w-[375px] px-4 sm:px-6 shrink-0 flex-none flex flex-col items-center mt-1 sm:mt-2 z-10 relative">
        
        {/* AVATARS OVERLAP */}
        <div className="absolute top-[12px] -translate-y-1/2 left-[20px] w-[28px] h-[28px] bg-[#a3e635] rounded-full border-[2px] border-[#38bdf8] z-20 flex items-center justify-center pointer-events-none shadow-sm">
          <span className="font-emoji text-[14px]">🤓</span>
        </div>
        <div className="absolute top-[12px] -translate-y-1/2 right-[20px] w-[28px] h-[28px] bg-[#ff3b30] rounded-full border-[2px] border-[#ff3b30] z-20 overflow-hidden pointer-events-none shadow-sm">
           <img src="https://picsum.photos/seed/scott_wordle/300/300" className="w-full h-full object-cover scale-110" alt="Scott" />
        </div>

        <div className="relative w-full h-[24px] bg-[#e2e8f0] rounded-full overflow-hidden">
          {/* User Progress */}
          <div className="absolute left-0 top-0 bottom-0 bg-[#2188ff] flex items-center pr-1 pl-6 overflow-hidden transition-all duration-300" style={{ width: `${userPercent}%` }}>
             <span className="text-white text-[14px] font-black whitespace-nowrap ml-1">
               {displayedXP > 0 ? displayedXP.toLocaleString() : ''} {displayedXP > 0 && <span className="italic text-white/90 text-[12px]">XP</span>}
             </span>
          </div>
          
          {/* Center Vertical Divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#111827] -translate-x-1/2 z-10" />
          
          {/* Opponent Progress */}
          <div className="absolute right-0 top-0 bottom-0 bg-[#ff3b30] flex items-center justify-end pr-6 pl-1 overflow-hidden transition-all duration-300" style={{ width: `${opponentPercent}%` }}>
             <span className="text-white text-[14px] font-black whitespace-nowrap mr-1">
               {opponentXP > 0 ? opponentXP.toLocaleString() : ''} {opponentXP > 0 && <span className="italic text-white/90 text-[12px]">XP</span>}
             </span>
          </div>
        </div>

        {/* BOTTOM METADATA ROW */}
        <div className="flex justify-between w-full mt-2 h-10 items-start px-0">
          <span className="font-extrabold text-[16px] tracking-tight text-[#111827] shrink-0 h-[24px] flex items-center leading-none">You</span>
          
          <div className="flex items-start justify-center flex-1 relative">
            <AnimatePresence>
               {timerXPText && (
                  <motion.div
                     key={timerXPText.id}
                     initial={{ opacity: 0, y: 15, scale: 0.5 }}
                     animate={{ opacity: 1, y: -45, scale: 1 }}
                     exit={{ opacity: 0, y: -45, scale: 0.8 }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
                     className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                  >
                     <div className="relative bg-[#111827] text-white font-black italic text-[20px] tracking-wider px-3.5 py-1 rounded-[14px] rounded-bl-sm shadow-xl flex items-center justify-center">
                       {timerXPText.text}
                       {/* Downward triangle tail */}
                       <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#111827]" />
                       {/* The XP Badge overlap */}
                       <div className="absolute -top-2 -right-3 bg-[#1e8dff] text-white rounded-full w-8 h-8 flex items-center justify-center font-black italic text-[12px] shadow-md border-[2px] border-transparent">
                         XP
                       </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          
            {/* The 30 pill (Now acting as the 30s countdown timer with internal progress bar) */}
            <motion.div 
               id="wb-timer-pill" 
               animate={{ opacity: (endState !== 'playing' && (endState !== 'win' || timeLeft === 0)) ? 0 : 1 }}
               className={`relative flex rounded-[16px] overflow-hidden shadow-sm h-[34px] w-[70px] shrink-0 transition-colors ${timeLeft <= 10 && endState === 'playing' ? 'ring-2 ring-red-500 animate-pulse bg-[#7f1d1d]' : 'bg-[#111827]'}`}
            >
              
              {/* Internal Progress Bar filling from left to right as time depletes (starts full) */}
              <div 
                className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-red-600' : 'bg-[#4a5568]'}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
              
              {/* Digits on top */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="flex gap-0.5 mt-[2px]">
                   <span className="text-white font-black text-[20px] leading-none text-center w-[12px]">{Math.floor(timeLeft / 10)}</span>
                   <span className="text-white font-black text-[20px] leading-none text-center w-[12px]">{timeLeft % 10}</span>
                </div>
              </div>

            </motion.div>


          </div>

          <span className="font-extrabold text-[16px] tracking-tight text-[#111827] shrink-0 h-[24px] flex items-center justify-end leading-none">Scott</span>
        </div>
      </div>

      {/* GAME GRID */}
      <motion.div 
         className="flex-1 min-h-[0] w-full flex flex-col items-center justify-center my-4 z-0 relative"
         animate={{ y: showVictoryCard ? Math.max(0, (2 - currentRow) * 55 + 60) : 0 }}
         transition={{ duration: 0.8, ease: "circOut" }}
      >
        <div className="relative flex flex-col gap-[7px]">
          
          {/* USER AVATAR POINTER */}
          <motion.div 
             id="user-avatar"
             className="absolute -left-12 w-10 h-10 bg-[#a3e635] rounded-full flex items-center justify-center border-2 border-[#1e8dff] shadow-md z-30 overflow-visible"
             animate={{ y: currentRow * 55, opacity: showVictoryCard ? 0 : 1 }} 
             transition={{ 
                opacity: { duration: 0.5 }, 
                y: { type: "spring", stiffness: 300, damping: 25 } 
             }}
          >
             <span className="font-emoji text-[18px]">🤓</span>
             {endState === 'win' && (
               <>
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute -top-6 bg-[#4ade80] text-[#111827] text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20">+5000 XP</motion.div>
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-[#4ade80] rounded-full flex items-center justify-center text-white text-[22px] font-black z-10 border-2 border-white overflow-hidden">✓</motion.div>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="absolute -bottom-6 bg-[#111827] text-white text-[9px] font-black px-2 py-[2px] rounded shadow whitespace-nowrap z-0">Solved it!</motion.div>
               </>
             )}
          </motion.div>
          
          {/* HOST AVATAR POINTER */}
          <motion.div 
             id="host-avatar"
             className="absolute -right-12 w-10 h-10 bg-[#ff3b30] rounded-full border-2 border-[#ff3b30] shadow-md z-30 flex items-center justify-center overflow-visible"
             animate={{ opacity: endState !== 'playing' ? 0 : 1, y: hostRow * 55 }} 
             transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
             <img src="https://picsum.photos/seed/scott_wordle/300/300" className="w-full h-full object-cover rounded-full absolute inset-0" alt="Scott Grid" />
             {hostSolved && (
               <>
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute -top-6 bg-[#4ade80] text-[#111827] text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20">+5000 XP</motion.div>
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-[#4ade80] rounded-full flex items-center justify-center text-white text-[22px] font-black z-10 border-2 border-white overflow-hidden">✓</motion.div>
                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="absolute -bottom-6 bg-[#111827] text-white text-[9px] font-black px-2 py-[2px] rounded shadow whitespace-nowrap z-0">Solved it!</motion.div>
               </>
             )}
          </motion.div>

          {grid.map((rowArr, rIdx) => (
             <motion.div 
               key={rIdx} 
               className="w-full flex justify-center"
               animate={{ opacity: (endState !== 'playing' && rIdx !== currentRow) ? 0 : 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
             >
                {/* INNER WRAPPER for correct relative bounding of absolutely positioned elements */}
                <motion.div 
                   className="relative flex gap-[6px]"
                >
                   <AnimatePresence>
                      {showVictoryCard && rIdx === currentRow && (
                        <>
                        {/* Gray Word Container Box */}
                        <motion.div 
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ duration: 0.4 }}
                           className="absolute -inset-x-2 -inset-y-2 bg-[#f1f5f9] rounded-[12px] -z-10 shadow-inner border border-[#e2e8f0]"
                        />
                        
                        {/* Top Headers */}
                        <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.4, delay: 0.1 }}
                           className="absolute bottom-[100%] mb-2 flex flex-col items-center w-full pointer-events-none"
                        >
                           {endState === 'win' && (
                             <>
                                <div className="text-[42px] sm:text-[52px] font-emoji leading-none mb-1 sm:mb-2 drop-shadow-xl">🔥</div>
                                <h2 className="text-[#111827] font-black text-[24px] sm:text-[32px] tracking-tight leading-tight mt-1 whitespace-nowrap">You got it!</h2>
                                <p className="text-[#64748b] text-[14px] sm:text-[18px] font-semibold tracking-tight whitespace-nowrap">You cracked the code</p>
                             </>
                           )}
                           {endState === 'tries' && (
                             <>
                                <div className="text-[42px] sm:text-[52px] font-emoji leading-none mb-1 sm:mb-2 drop-shadow-xl">😬</div>
                                <h2 className="text-[#111827] font-black text-[24px] sm:text-[32px] tracking-tight leading-tight mt-1 whitespace-nowrap">So close!</h2>
                                <p className="text-[#64748b] text-[14px] sm:text-[18px] font-semibold tracking-tight whitespace-nowrap">Better luck next round.</p>
                             </>
                           )}
                           {endState === 'timeout' && (
                             <>
                                <div className="text-[42px] sm:text-[52px] font-emoji leading-none mb-1 sm:mb-2 drop-shadow-xl">⏰</div>
                                <h2 className="text-[#111827] font-black text-[24px] sm:text-[32px] tracking-tight leading-tight mt-1 whitespace-nowrap">Time’s up!</h2>
                                <p className="text-[#64748b] text-[14px] sm:text-[18px] font-semibold tracking-tight whitespace-nowrap">Ran out of time on this one.</p>
                             </>
                           )}

                           <div className="bg-[#1e293b] text-white text-[11px] sm:text-[12px] font-black tracking-[0.1em] px-3 py-1 rounded-[6px] rounded-b-none shadow-md mt-4 sm:mt-6 relative z-10 translate-y-[1px]">
                              {endState === 'win' ? 'THE WORD' : 'THE WORD WAS'}
                           </div>
                        </motion.div>
                        
                        {/* Bottom Timer */}
                        <motion.div 
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.4, delay: 0.2 }}
                           className="absolute top-[100%] mt-6 sm:mt-12 flex flex-col items-center w-full pointer-events-none"
                        >
                           <p className="text-[#64748b] text-[14px] sm:text-[17px] font-semibold tracking-tight mb-1 whitespace-nowrap">
                              {timeLeft === 0 ? "Round ending..." : "Waiting for others to finish"}
                           </p>
                           {timeLeft > 0 && (
                              <div className="text-[#111827] text-[44px] font-black tracking-tighter leading-none tabular-nums">0:{timeLeft.toString().padStart(2, '0')}</div>
                           )}
                        </motion.div>
                     </>
                   )}
                </AnimatePresence>

              {rowArr.map((tile, cIdx) => {
                let char = tile.char;
                let tState = tile.state;
                
                if (showVictoryCard && rIdx === currentRow) {
                   if (endState === 'win') {
                      char = answer[cIdx];
                      tState = 'correct';
                   } else if (endState === 'tries') {
                      if (timeLeft > 0) {
                         char = '?';
                         tState = 'question';
                      } else {
                         char = answer[cIdx];
                         tState = 'correct';
                      }
                   } else if (endState === 'timeout') {
                      char = answer[cIdx];
                      tState = 'correct';
                   }
                }
                
                const isFilled = char !== '';
                const isPop = animatingTiles[`${rIdx}-${cIdx}`] === 'pop';
                const isShake = animatingTiles[`${rIdx}-${cIdx}`] === 'shake';
                const isFlip = animatingTiles[`${rIdx}-${cIdx}`] === 'flip';
                const isDance = animatingTiles[`${rIdx}-${cIdx}`] === 'dance';
                
                // Base CSS
                let tileClass = "w-[min(12vw,50px)] h-[min(12vw,50px)] sm:w-[48px] sm:h-[48px] flex flex-none items-center justify-center text-[28px] font-black uppercase select-none overflow-hidden ";
                if (tState === 'correct') tileClass += "bg-[#4ade80] text-[#111827] border-none ";
                else if (tState === 'present') tileClass += "bg-[#fbbf24] text-[#111827] border-none ";
                else if (tState === 'absent') tileClass += "bg-[#cbd5e1] text-[#111827] border-none ";
                else if (tState === 'question') tileClass += "bg-white text-[#111827] border-[2px] border-[#cbd5e1] "; 
                else if (isFilled) tileClass += "bg-[#f8fafc] text-[#111827] border-[2px] border-[#cbd5e1] "; 
                else tileClass += "bg-white border-[2px] border-[#cbd5e1] text-transparent ";
                
                const mergeWin = showVictoryCard && endState === 'win' && rIdx === currentRow;

                return (
                  <motion.div 
                    key={cIdx} 
                    id={`wb-tile-${rIdx}-${cIdx}`} 
                    className={`${tileClass} relative z-10 origin-center`}
                    initial={{ borderRadius: 8 }}
                    animate={{
                      y: isDance ? [0, -15, 0] : isFlip ? [0, -10, 0] : 0,
                      rotateX: isFlip ? [0, 90, 0] : 0,
                      x: isShake ? [0, -4, 4, -4, 4, 0] : (mergeWin ? (2 - cIdx) * 6 : 0),
                      scale: isFlip ? [1, 1.15, 1] : 1,
                      borderRadius: mergeWin 
                          ? (cIdx === 0 ? "8px 0px 0px 8px" : cIdx === 4 ? "0px 8px 8px 0px" : "0px") 
                          : "8px",
                      boxShadow: (tState === 'correct' || tState === 'present') ? "inset 0px -3px 0px rgba(0,0,0,0.15)" : "none"
                    }}
                    transition={{ 
                      borderRadius: { duration: 0.8, ease: "easeInOut" },
                      default: {
                        duration: isDance ? 0.5 : isFlip ? 0.4 : isShake ? 0.3 : 0.1,
                        ease: isDance ? "easeInOut" : isFlip ? "easeOut" : "linear"
                      }
                    }}
                  >
                    {isPop ? <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.1 }} className="relative z-10">{char}</motion.span>
                     : <span className="relative z-10">{char}</span>
                    }

                    {/* SHINY REVEAL SWEEP */}
                    <AnimatePresence>
                      {tState && tState !== 'question' && (
                        <motion.div 
                           initial={{ left: '-150%', opacity: 0 }}
                           animate={{ left: '150%', opacity: [0, 1, 0] }}
                           transition={{ duration: 0.7, ease: "easeInOut" }}
                           className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 z-20 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {floatXPText.filter(f => f.row === rIdx && f.col === cIdx).map(f => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="relative bg-[#111827] text-white font-black italic text-[20px] tracking-wider px-3.5 py-1 rounded-[14px] rounded-bl-sm shadow-xl flex items-center justify-center">
                          {f.text}
                          {/* Downward triangle tail */}
                          <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#111827]" />
                          {/* The XP Badge overlap */}
                          <div className="absolute -top-2 -right-3 bg-[#1e8dff] text-white rounded-full w-8 h-8 flex items-center justify-center font-black italic text-[12px] shadow-md border-[2px] border-transparent">
                            XP
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })}
                </motion.div>
             </motion.div>
          ))}
        </div>
      </motion.div>

      {/* KEYBOARD */}
      <motion.div 
         animate={{ opacity: showVictoryCard || endState === 'timeout' ? 0 : 1 }}
         className="w-full flex-none shrink-0 flex flex-col items-center pb-8 px-1 mt-auto z-10 space-y-2 sm:space-y-4"
      >
        {/* QWERTY Cluster (Strict 136px height bound limit) */}
        <div className="flex flex-col gap-[6px] w-full max-w-[400px]">
          {KB_LAYOUT.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-[6px] w-full px-1">
              {row.map(k => {
                const state = k.length === 1 ? keyboardState[k] : null;
                let keyClass = `h-[40px] flex items-center justify-center font-bold rounded-[6px] text-[16px] uppercase select-none transition-all duration-150 active:scale-95 z-20 ease-out flex-none `;
                
                if (k === '⌫') {
                  keyClass += "w-[56px] bg-[#e2e8f0] text-[#111827] ";
                } else {
                  keyClass += "w-[32px] relative ";
                  if (state === 'destroyed') keyClass += "bg-white/40 text-black/20 ";
                  else if (state === 'orange') keyClass += "bg-[#f97316] text-[#111827] ";
                  else if (state === 'correct') keyClass += "bg-[#4ade80] text-[#111827] ";
                  else if (state === 'present') keyClass += "bg-[#fbbf24] text-[#111827] ";
                  else if (state === 'absent') keyClass += "bg-[#cbd5e1] text-[#111827] ";
                  else keyClass += "bg-[#e2e8f0] text-[#111827] ";
                }
                
                return (
                  <button 
                    id={`wb-key-${k}`}
                    key={k} 
                    onPointerDown={(e) => {
                      e.preventDefault();
                      // Only allow left-clicks for mouse devices (button 0), or touch inputs
                      if (e.pointerType === 'mouse' && e.button !== 0) return;
                      handleKey(k);
                    }}
                    className={keyClass}
                  >
                     {/* Destroyd Cross out effect for Extra visual polish */}
                     {state === 'destroyed' && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-[80%] h-[2px] bg-red-500/50 rotate-45 transform origin-center absolute"/><div className="w-[80%] h-[2px] bg-red-500/50 -rotate-45 transform origin-center absolute"/></div>}
                     
                    {k === '⌫' ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="m18 9-6 6"/><path d="m12 9 6 6"/></svg>
                    ) : k}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BAR: Powerups & Submit */}
        <div className="flex gap-[10px] w-full max-w-[400px] px-2 h-[40px] items-stretch">
          <button 
            ref={hintBtnRef}
            onClick={triggerHint}
            disabled={hintsLeft <= 0}
            className={`w-[40px] h-[40px] flex-none rounded-[12px] flex items-center justify-center relative transition-transform active:scale-95 ease-out bg-[#fcd34d] shadow-sm border border-black/5 ${hintsLeft > 0 ? '' : 'opacity-40 grayscale pointer-events-none'}`}
          >
            <span className="text-[20px] font-emoji select-none">🔍</span>
            <div className="absolute -bottom-1 -right-1 bg-[#111827] text-white text-[12px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
              {hintsLeft}
            </div>
          </button>
          
          <button 
            ref={bombBtnRef}
            onClick={triggerBomb}
            disabled={bombsLeft <= 0}
            className={`w-[40px] h-[40px] flex-none rounded-[12px] flex items-center justify-center relative transition-transform active:scale-95 ease-out bg-[#38bdf8] shadow-sm border border-black/5 ${bombsLeft > 0 ? '' : 'opacity-40 grayscale pointer-events-none'}`}
          >
             <span className="text-[20px] font-emoji select-none">💣</span>
            <div className="absolute -bottom-1 -right-1 bg-[#111827] text-white text-[12px] font-black w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
              {bombsLeft}
            </div>
          </button>

          <button 
            onClick={submitRow}
            className="flex-1 rounded-[10px] text-[18px] font-black tracking-widest text-white bg-[#2188ff] flex items-center justify-center transition-all active:scale-95 ease-out"
          >
            SUBMIT
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
