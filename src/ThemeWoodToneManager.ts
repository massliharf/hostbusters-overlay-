import * as Tone from 'tone';

class ThemeWoodToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 1.5, wet: 0.15 }).toDestination();
  private masterCompressor = new Tone.Compressor(-12, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Soft unpitched click (Wood block / Tap)
  private woodTap = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 0.5, oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
  }).connect(new Tone.Filter(800, "lowpass").connect(new Tone.Volume(-8).connect(this.masterVolume)));

  // Soft Wind sweep
  private windSweep = new Tone.NoiseSynth({
    noise: { type: "pink" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0 }
  }).connect(new Tone.Filter(1000, "lowpass").connect(new Tone.Volume(-12).connect(this.masterVolume)));

  // Marimba / Bamboo for melodies
  private marimba = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.0, modulationIndex: 1.2, oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.0, release: 0.8 },
    modulation: { type: "sine" }
  }).connect(new Tone.Volume(-2).connect(this.masterVolume));

  // Deep thump
  private hollowThump = new Tone.MembraneSynth({
    pitchDecay: 0.1, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.8 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: WOOD & BAMBOO Loaded 🎋"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.woodTap.triggerAttackRelease(180, "32n", this.t(), 0.5); }
  delete() { this.ctx(); this.windSweep.triggerAttackRelease("32n", this.t(), 0.3); this.woodTap.triggerAttackRelease(140, "32n", this.t()+0.02, 0.4); }
  submit() { this.ctx(); this.windSweep.triggerAttackRelease("16n", this.t(), 0.5); }
  gray() { this.ctx(); this.woodTap.triggerAttackRelease(120, "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.marimba.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.marimba.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.marimba.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); this.marimba.triggerAttackRelease("C5", "4n", this.t() + 0.12, 0.9); }
  win() {
    this.ctx(); const now = this.t();
    this.marimba.triggerAttackRelease(["C4", "E4", "G4", "C5"], "4n", now, 1.0);
    setTimeout(() => { this.marimba.triggerAttackRelease("E5", "2n", this.t(), 0.6); }, 400);
  }

  greenKnown() { this.ctx(); this.marimba.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.marimba.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.marimba.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); this.marimba.triggerAttackRelease("C5", "4n", this.t() + 0.12, 0.9); }
  win() {
    this.ctx(); const now = this.t();
    this.marimba.triggerAttackRelease(["C4", "E4", "G4", "C5"], "4n", now, 1.0);
    setTimeout(() => { this.marimba.triggerAttackRelease("E5", "2n", this.t(), 0.6); }, 400);
  }
  xp() { this.ctx(); this.marimba.triggerAttackRelease("G4", "8n", this.t(), 0.7); this.marimba.triggerAttackRelease("E5", "8n", this.t() + 0.1, 0.8); }
  xpbar() { this.ctx(); this.windSweep.triggerAttackRelease("32n", this.t(), 0.2); this.marimba.triggerAttackRelease("E4", "16n", this.t(), 0.4); }
  roundInfo() { this.ctx(); const now = this.t(); this.marimba.triggerAttackRelease("C4", "8n", now, 0.6); this.marimba.triggerAttackRelease("D4", "8n", now+1, 0.7); this.marimba.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.marimba.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.woodTap.triggerAttackRelease(100, "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.marimba.triggerAttackRelease(["C3", "C4", "E4"], "2n", this.t(), 0.7); }
  error() { this.ctx(); this.marimba.triggerAttackRelease("Eb3", "8n", this.t(), 0.5); this.woodTap.triggerAttackRelease(130, "16n", this.t(), 0.6); }
  lose() { this.ctx(); this.hollowThump.triggerAttackRelease("C2", "1n", this.t(), 0.8); this.marimba.triggerAttackRelease(["C3", "Eb3"], "1n", this.t(), 0.6); }
  powerUpClick() { this.ctx(); this.hollowThump.triggerAttackRelease("C2", "16n", this.t(), 0.7); }
  hintWhoosh() { this.ctx(); this.windSweep.triggerAttackRelease("4n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.marimba.triggerAttackRelease(["Eb4", "G4", "Bb4"], "2n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.hollowThump.triggerAttackRelease("C2", "16n", this.t(), 0.7); }
  bombExplode() { this.ctx(); this.hollowThump.triggerAttackRelease("C1", "2n", this.t(), 0.9); this.windSweep.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeWoodToneManager = new ThemeWoodToneManagerClass();
