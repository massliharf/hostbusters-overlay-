import * as Tone from 'tone';

class ThemeWaterToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
  private masterCompressor = new Tone.Compressor(-15, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Water droplets
  private waterDrop = new Tone.MembraneSynth({
    pitchDecay: 0.1, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.1 }
  }).connect(new Tone.Filter(2000, "bandpass").connect(new Tone.Volume(-12).connect(this.masterVolume)));

  private waterSwoosh = new Tone.NoiseSynth({
    noise: { type: "pink" }, envelope: { attack: 0.05, decay: 0.2, sustain: 0 }
  }).connect(new Tone.Filter(1000, "bandpass").connect(new Tone.Volume(-12).connect(this.masterVolume)));

  // Watery resonance pad
  private waterPad = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.5, modulationIndex: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.4, sustain: 0.2, release: 1.2 },
    modulation: { type: "sine" }
  }).connect(new Tone.Volume(0).connect(this.masterVolume));

  private waterSub = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.6, sustain: 0, release: 0.5 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: WATER & AQUARIUM Loaded 💧"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.waterDrop.triggerAttackRelease(600, "32n", this.t(), 0.5); }
  delete() { this.ctx(); this.waterSwoosh.triggerAttackRelease("32n", this.t(), 0.4); }
  submit() { this.ctx(); this.waterSwoosh.triggerAttackRelease("16n", this.t(), 0.5); }
  gray() { this.ctx(); this.waterDrop.triggerAttackRelease(300, "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.waterPad.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.waterPad.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.waterPad.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.waterPad.triggerAttackRelease(["C4", "E4", "G4", "C5", "E5"], "1n", now, 1.0);
    this.waterSub.triggerAttackRelease("C2", "2n", now, 0.6);
  }
  xp() { this.ctx(); this.waterDrop.triggerAttackRelease("C6", "8n", this.t(), 0.8); }
  xpbar() { this.ctx(); this.waterSwoosh.triggerAttackRelease("32n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.waterPad.triggerAttackRelease("C4", "8n", now, 0.6); this.waterPad.triggerAttackRelease("D4", "8n", now+1, 0.7); this.waterPad.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.waterDrop.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.waterDrop.triggerAttackRelease(150, "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.waterPad.triggerAttackRelease(["C3", "G3", "C4"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.waterPad.triggerAttackRelease(["Eb3", "Ab3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.waterSub.triggerAttackRelease("C1", "1n", this.t(), 0.9); this.waterPad.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t(), 0.7); }
  powerUpClick() { this.ctx(); this.waterSub.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.waterSwoosh.triggerAttackRelease("4n", this.t(), 0.6); }
  hintReveal() { this.ctx(); this.waterPad.triggerAttackRelease(["G4", "C5", "E5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.waterSub.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.waterSub.triggerAttackRelease("C1", "2n", this.t(), 0.9); this.waterSwoosh.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeWaterToneManager = new ThemeWaterToneManagerClass();
