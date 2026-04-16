const fs = require('fs');

const file = '/Users/tahoe/hostbusters-overlay/src/CasualWordle.tsx';
let content = fs.readFileSync(file, 'utf8');

// The new SFX definition
const newSFX = `const SFX = {
  type: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(150, 'triangle', 0.05, 0.03); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.02, 0.03); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(200, 100, 0.03, 0.05); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(800, 'triangle', 0.02, 0.04); return; }
    if(currentTheme === 'asmr-minimal') { return; }
    if(currentTheme === 'premium') { playSoftNoise(0.01, 0.03); return; }
    if(currentTheme === 'assets') { playAsset('click_type'); return; }
    playAdvancedTone(600, 0.1, 0.05); setTimeout(() => playAdvancedTone(800, 0.2, 0.05), 50);
  },
  timer10: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(120, 'triangle', 0.15, 0.3); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(300, 200, 0.15, 0.3); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(600, 'triangle', 0.1, 0.15); return; }
    if(currentTheme === 'asmr-minimal') { playSoftNoise(0.05, 0.05); return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'triangle', 0.15, 0.2); return; }
    playAdvancedTone(200, 2.0, 0.2);
  },
  timer3: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(120, 'triangle', 0.15, 0.3); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.1, 0.1); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(300, 200, 0.15, 0.3); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(600, 'triangle', 0.1, 0.15); triggerHaptic(50); return; }
    if(currentTheme === 'asmr-minimal') { playSoftNoise(0.05, 0.05); triggerHaptic(50); return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'triangle', 0.15, 0.2); triggerHaptic(50); return; }
    playAdvancedTone(800, 0.1, 0.1);
  },
  timer0: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(250, 'triangle', 0.5, 0.4); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(3000, 'sine', 0.5, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(400, 100, 0.6, 0.5); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(400, 'triangle', 0.4, 0.3); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(200, 'sine', 0.5, 0.2); triggerHaptic([200, 100, 200]); return; }
    if(currentTheme === 'premium') { playSoftADSR(349.23, 'triangle', 0.4, 0.15); triggerHaptic([200, 100, 200]); return; }
    playAdvancedTone(100, 0.5, 0.4);
  },
  delete: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(100, 'triangle', 0.05, 0.05); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.04, 0.05); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(150, 50, 0.05, 0.05); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(400, 'triangle', 0.02, 0.04); return; }
    if(currentTheme === 'asmr-minimal') { return; }
    if(currentTheme === 'premium') { playSoftADSR(100, 'sine', 0.1, 0.2); return; }
    if(currentTheme === 'assets') { playAsset('delete'); return; }
    playAdvancedTone(250, 0.1, 0.2); 
  },
  submit: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(80, 'triangle', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.05, 0.08); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(200, 100, 0.1, 0.1); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(300, 'triangle', 0.05, 0.05); return; }
    if(currentTheme === 'asmr-minimal') { playSoftNoise(0.05, 0.05); return; }
    if(currentTheme === 'premium') { playSoftADSR(180, 'sine', 0.1, 0.1); setTimeout(() => playSoftADSR(250, 'sine', 0.15, 0.1), 30); return; }
    if(currentTheme === 'assets') { playAsset('submit'); return; }
    setTimeout(() => playAdvancedTone(300, 0.15, 0.1), 0);
  },
  gray: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(120, 'triangle', 0.15, 0.08); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.06, 0.06); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(150, 50, 0.1, 0.08); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(200, 'triangle', 0.05, 0.08); return; }
    if(currentTheme === 'asmr-minimal') { return; } // completely silent
    if(currentTheme === 'premium') { playSoftNoise(0.04, 0.06); return; }
    if(currentTheme === 'assets') { playAsset('gray'); return; }
    playAdvancedTone(150, 0.2, 0.3); 
  },
  yellow: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(400, 'triangle', 0.3, 0.2); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(1200, 'sine', 0.3, 0.15); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(300, 'sine', 0.3, 0.2); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(800, 'triangle', 0.1, 0.15); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(400, 'sine', 0.2, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(349.23, 'triangle', 0.4, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('yellow'); return; }
    playAdvancedTone(440, 0.4, 0.2); playAdvancedTone(660, 0.3, 0.05); 
  },
  green: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(600, 'triangle', 0.5, 0.3); setTimeout(() => playSoftADSR(800, 'triangle', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.5, 0.2); setTimeout(() => playSoftADSR(2500, 'sine', 0.6, 0.2), 40); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(500, 'sine', 0.5, 0.3); setTimeout(() => playSoftADSR(750, 'sine', 0.6, 0.3), 40); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1200, 'triangle', 0.2, 0.2); setTimeout(() => playSoftADSR(1600, 'triangle', 0.3, 0.2), 40); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(600, 'sine', 0.4, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(523.25, 'triangle', 0.6, 0.2); playSoftADSR(659.25, 'triangle', 0.6, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playAdvancedTone(523.25, 0.5, 0.25); playAdvancedTone(1046.5, 0.4, 0.08); 
  },
  xp: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(1000, 'triangle', 0.4, 0.1); setTimeout(() => playSoftADSR(1300, 'triangle', 0.5, 0.1), 40); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(3000, 'sine', 0.3, 0.1); setTimeout(() => playSoftADSR(3500, 'sine', 0.4, 0.1), 40); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(800, 'sine', 0.4, 0.15); setTimeout(() => playSoftADSR(1000, 'sine', 0.5, 0.15), 40); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1500, 'triangle', 0.2, 0.1); setTimeout(() => playSoftADSR(2000, 'triangle', 0.2, 0.1), 40); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(800, 'sine', 0.3, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(1046.5, 'sine', 0.4, 0.05); setTimeout(() => playSoftADSR(1567.98, 'sine', 0.6, 0.05), 40); return; }
    if(currentTheme === 'assets') { playAsset('xp'); return; }
    playAdvancedTone(1200, 0.2, 0.05); setTimeout(() => playAdvancedTone(1500, 0.3, 0.05), 50); 
  },
  win: () => {
    if(currentTheme === 'asmr-wood') { [300, 400, 500, 600].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'triangle', 0.8, 0.2), i*80)); return; }
    if(currentTheme === 'asmr-glass') { [1500, 2000, 2500, 3000].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'sine', 0.6, 0.2), i*80)); return; }
    if(currentTheme === 'asmr-synth') { [400, 500, 600, 800].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'sine', 0.8, 0.3), i*80)); return; }
    if(currentTheme === 'asmr-click') { [800, 1000, 1200, 1600].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'triangle', 0.5, 0.15), i*80)); return; }
    if(currentTheme === 'asmr-minimal') { [400, 600].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'sine', 0.5, 0.2), i*100)); return; }
    if(currentTheme === 'premium') { [261.63, 329.63, 392.00, 523.25].forEach((f, i) => setTimeout(() => playSoftADSR(f, 'triangle', 0.8, 0.15), i*80)); return; }
    if(currentTheme === 'assets') { playAsset('win'); return; }
    const chord = [261.63, 329.63, 392.00, 523.25];
    chord.forEach((freq, idx) => setTimeout(() => playAdvancedTone(freq, 0.4, 0.2), idx * 100));
  },
  xpbar: () => {
    if(currentTheme === 'asmr-wood') { playSoftSweep(400, 100, 0.3, 0.2); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2000, 'sine', 0.4, 0.2); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(800, 400, 0.4, 0.2); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(500, 'triangle', 0.2, 0.1); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(300, 'sine', 0.4, 0.2); return; }
    if(currentTheme === 'premium') { playSoftNoise(0.05, 0.08); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playSoftSweep(300, 800, 0.4, 0.2);
  },
  hintWhoosh: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(300, 'triangle', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(1500, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(400, 200, 0.1, 0.1); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(600, 'triangle', 0.05, 0.1); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(200, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(400, 'triangle', 0.05, 0.1); return; } 
    if(currentTheme === 'assets') { playAsset('hint'); return; }
    playSoftSweep(600, 200, 0.3, 0.1);
  },
  hintReveal: () => { 
    if(currentTheme === 'asmr-wood') { playSoftADSR(800, 'triangle', 0.5, 0.3); setTimeout(() => playSoftADSR(1000, 'triangle', 0.6, 0.2), 50); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(2500, 'sine', 0.4, 0.3); setTimeout(() => playSoftADSR(3000, 'sine', 0.3, 0.2), 50); return; }
    if(currentTheme === 'asmr-synth') { playSoftADSR(600, 'sine', 0.5, 0.3); setTimeout(() => playSoftADSR(800, 'sine', 0.6, 0.2), 50); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(1200, 'triangle', 0.2, 0.2); setTimeout(() => playSoftADSR(1600, 'triangle', 0.3, 0.2), 50); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(1000, 'sine', 0.3, 0.2); return; }
    if(currentTheme === 'premium') { playSoftADSR(1500, 'sine', 0.4, 0.3); setTimeout(() => playSoftADSR(2000, 'sine', 0.3, 0.2), 50); return; }
    if(currentTheme === 'assets') { playAsset('green'); return; }
    playAdvancedTone(800, 0.6, 0.2); playAdvancedTone(1200, 0.4, 0.1); 
  },
  bombDrop: () => {
    if(currentTheme === 'asmr-wood') { playSoftADSR(300, 'triangle', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-glass') { playSoftADSR(1500, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(400, 200, 0.1, 0.1); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(600, 'triangle', 0.05, 0.1); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(200, 'sine', 0.1, 0.1); return; }
    if(currentTheme === 'premium') { playSoftADSR(400, 'triangle', 0.05, 0.1); return; } 
    if(currentTheme === 'assets') { playAsset('bomb_drop'); return; }
    playSoftSweep(800, 200, 0.3, 0.15);
  },
  bombExplode: () => { 
    if(currentTheme === 'asmr-wood') { playSoftSweep(200, 50, 0.3, 0.4); return; }
    if(currentTheme === 'asmr-glass') { playSoftNoise(0.1, 0.2); playSoftADSR(1500, 'sine', 0.2, 0.2); return; }
    if(currentTheme === 'asmr-synth') { playSoftSweep(150, 50, 0.4, 0.4); return; }
    if(currentTheme === 'asmr-click') { playSoftADSR(200, 'square', 0.2, 0.2); return; }
    if(currentTheme === 'asmr-minimal') { playSoftADSR(100, 'sine', 0.3, 0.2); return; }
    if(currentTheme === 'premium') { playSoftADSR(80, 'square', 0.2, 0.2); playSoftNoise(0.1, 0.15); return; }
    if(currentTheme === 'assets') { playAsset('bomb_explode'); return; }
    playSoftNoise(0.3, 0.5); playAdvancedTone(80, 0.3, 0.5); 
  }
};`

const startIdx = content.indexOf('const SFX = {');
const endIdx = content.indexOf('const playSFX = (name: keyof typeof SFX) =>');

// Just to be safe, find the exact bounds
const head = content.substring(0, startIdx);
const tail = content.substring(endIdx);

content = head + newSFX + '\n\n' + tail;

fs.writeFileSync(file, content);
