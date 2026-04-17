import * as Tone from 'tone';

class ThemeScifiToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 4.0, wet: 0.5 }).toDestination();
  private masterCompressor = new Tone.Compressor(-15, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Deep sine bleeps
  private spacePing = new Tone.MembraneSynth({
    pitchDecay: 0.01, octaves: 1, oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(new Tone.Volume(-12).connect(this.masterVolume));

  private spaceSweep = new Tone.NoiseSynth({
    noise: { type: "white" }, envelope: { attack: 0.1, decay: 0.3, sustain: 0 }
  }).connect(new Tone.Filter(2000, "bandpass").connect(new Tone.Volume(-12).connect(this.masterVolume)));

  // Epic deep FM pads
  private spacePad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsawtooth", count: 3, spread: 20 },
    envelope: { attack: 0.5, decay: 1.0, sustain: 0.5, release: 3.0 }
  }).connect(new Tone.Filter(1500, "lowpass").connect(new Tone.Volume(-2).connect(this.masterVolume)));

  private spaceSub = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.8, sustain: 0, release: 1.0 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: ZERO-GRAVITY SCIFI Loaded 🌌"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.spacePing.triggerAttackRelease(800, "32n", this.t(), 0.3); }
  delete() { this.ctx(); this.spaceSweep.triggerAttackRelease("32n", this.t(), 0.3); }
  submit() { this.ctx(); this.spaceSweep.triggerAttackRelease("16n", this.t(), 0.5); }
  gray() { this.ctx(); this.spacePing.triggerAttackRelease(400, "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.spacePing.triggerAttackRelease("E5", "16n", this.t(), 0.6); this.spacePing.triggerAttackRelease("G5", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.spacePad.triggerAttackRelease(["C5", "E5", "G5"], "8n", this.t(), 0.6); }
  win() {
    this.ctx(); const now = this.t();
    this.spacePad.triggerAttackRelease(["C4", "G4", "C5", "E5"], "1n", now, 1.0);
    this.spaceSub.triggerAttackRelease("C2", "1n", now, 0.8);
  }
  xp() { this.ctx(); this.spacePing.triggerAttackRelease("C6", "8n", this.t(), 0.8); }
  xpbar() { this.ctx(); this.spaceSweep.triggerAttackRelease("32n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.spacePing.triggerAttackRelease("C4", "8n", now, 0.6); this.spacePing.triggerAttackRelease("D4", "8n", now+1, 0.7); this.spacePing.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.spacePing.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.spacePing.triggerAttackRelease(200, "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.spacePad.triggerAttackRelease(["C3", "G3", "C4"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.spacePad.triggerAttackRelease(["Eb3", "Ab3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.spaceSub.triggerAttackRelease("C1", "1n", this.t(), 0.9); this.spacePad.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t(), 0.7); }
  powerUpClick() { this.ctx(); this.spaceSub.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.spaceSweep.triggerAttackRelease("4n", this.t(), 0.6); }
  hintReveal() { this.ctx(); this.spacePad.triggerAttackRelease(["E4", "B4", "E5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.spaceSub.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.spaceSub.triggerAttackRelease("C1", "2n", this.t(), 0.9); this.spaceSweep.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeScifiToneManager = new ThemeScifiToneManagerClass();
