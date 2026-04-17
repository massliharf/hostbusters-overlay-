import * as Tone from 'tone';

class ThemeDuoToneManagerClass {
  // Duolingo Style: VERY DRY, NO REVERB, NO ECHO (Gamified, bright, perky)
  private masterCompressor = new Tone.Compressor(-12, 3).toDestination();
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // 1. Yazma ve Silme (Boops & Bops)
  private boopSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 1.5, oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.masterVolume);

  // 2. Doğru ve Yanlış (Marimba / Xylophone style bright plucks)
  private malletSynth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.0, modulationIndex: 1.2, oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 },
    modulation: { type: "sine" }
  }).connect(this.masterVolume);

  // 3. Win / Lose Fanfares (Bright Brass / Synth)
  private synthBrass = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.5 }
  }).connect(this.masterVolume);

  // 4. Timer / Ui Ticks
  private tickSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.03 }
  }).connect(new Tone.Filter(3000, "highpass").connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: DUOLINGO STYLE Loaded 🦉"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // --- SECONDARY (Typing/Deleting) ---
  type() { this.ctx(); this.boopSynth.triggerAttackRelease("C4", "64n", this.t(), 0.1); }
  delete() { this.ctx(); this.boopSynth.triggerAttackRelease("G3", "64n", this.t(), 0.1); }
  
  // --- SUBMIT / NEUTRAL ---
  submit() { this.ctx(); this.boopSynth.triggerAttackRelease("C3", "16n", this.t(), 0.3); }

  // --- FEEDBACK ---
  gray() { this.ctx(); this.boopSynth.triggerAttackRelease("A2", "16n", this.t(), 0.2); }
  yellow() { this.ctx(); this.malletSynth.triggerAttackRelease("E5", "16n", this.t(), 0.6); }
  greenKnown() { this.ctx(); this.malletSynth.triggerAttackRelease("E5", "16n", this.t(), 0.4); } // Subtle confirmation
  green() { 
    this.ctx(); const now = this.t(); 
    this.malletSynth.triggerAttackRelease("G5", "16n", now, 0.8); 
    this.malletSynth.triggerAttackRelease("C6", "16n", now + 0.1, 0.8); 
  } // Ding-Ding!

  // --- REWARDS ---
  win() {
    this.ctx(); const now = this.t();
    // Ta-Da!
    this.synthBrass.triggerAttackRelease(["C5", "E5", "G5"], "8n", now, 0.8);
    this.synthBrass.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", now + 0.15, 1.0);
  }
  xp() { this.ctx(); this.malletSynth.triggerAttackRelease("E6", "32n", this.t(), 0.4); }
  xpbar() {
    this.ctx(); const now = this.t();
    this.malletSynth.triggerAttackRelease("G5", "32n", now, 0.3);
    this.malletSynth.triggerAttackRelease("C6", "32n", now + 0.05, 0.3);
  }

  // --- ROUND & TIMER ---
  roundInfo() { this.ctx(); this.synthBrass.triggerAttackRelease(["C4", "G4"], "4n", this.t(), 0.6); }
  timer10() { this.ctx(); this.tickSynth.triggerAttackRelease("32n", this.t(), 0.2); }
  timer3() { this.ctx(); this.malletSynth.triggerAttackRelease("C5", "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.malletSynth.triggerAttackRelease("C6", "8n", this.t(), 0.8); }

  // --- PENALTIES & LOSE ---
  error() { this.ctx(); this.synthBrass.triggerAttackRelease(["C4", "F4", "A4"], "8n", this.t(), 0.5); }
  lose() {
    this.ctx(); const now = this.t();
    // Wah-wah-waaah
    this.synthBrass.triggerAttackRelease(["F4", "Af4", "C5"], "4n", now, 0.7);
    this.synthBrass.triggerAttackRelease(["E4", "G4", "B4"], "4n", now + 0.3, 0.7);
    this.synthBrass.triggerAttackRelease(["Ef4", "Gf4", "Bf4"], "2n", now + 0.6, 0.7);
  }

  // --- POWER UPS ---
  powerUpClick() { this.ctx(); this.malletSynth.triggerAttackRelease("C6", "16n", this.t(), 0.5); }
  hintWhoosh() { this.ctx(); this.tickSynth.triggerAttackRelease("32n", this.t(), 0.3); }
  hintReveal() { this.ctx(); this.malletSynth.triggerAttackRelease(["E5", "G5"], "16n", this.t(), 0.6); }
  bombDrop() { this.ctx(); this.boopSynth.triggerAttackRelease("F2", "16n", this.t(), 0.4); }
  bombExplode() { this.ctx(); this.boopSynth.triggerAttackRelease("C1", "8n", this.t(), 0.8); this.tickSynth.triggerAttackRelease("16n", this.t(), 0.8); }
}

export const ThemeDuoToneManager = new ThemeDuoToneManagerClass();
