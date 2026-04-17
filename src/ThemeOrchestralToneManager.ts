import * as Tone from 'tone';

class ThemeOrchestralToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 3.0, wet: 0.35 }).toDestination();
  private masterCompressor = new Tone.Compressor(-16, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Pizzicato pluck
  private pluck = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.0, modulationIndex: 1.0, oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.0, release: 0.2 }
  }).connect(new Tone.Volume(-6).connect(this.masterVolume));

  private stringPad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsawtooth", count: 3, spread: 20 },
    envelope: { attack: 0.8, decay: 1.0, sustain: 0.8, release: 2.0 }
  }).connect(new Tone.Filter(2000, "lowpass").connect(new Tone.Volume(-10).connect(this.masterVolume)));

  private pizzicatoSub = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2, oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(new Tone.Volume(0).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: ORCHESTRAL PLUCKS Loaded 🎻"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pluck.triggerAttackRelease("C2", "32n", this.t(), 0.3); } // muted pluck
  delete() { this.ctx(); this.pluck.triggerAttackRelease("G1", "16n", this.t(), 0.4); }
  submit() { this.ctx(); this.pluck.triggerAttackRelease("C3", "16n", this.t(), 0.5); }
  gray() { this.ctx(); this.pluck.triggerAttackRelease("E2", "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.pluck.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.pluck.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.pluck.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.pluck.triggerAttackRelease(["C4", "E4", "G4", "C5"], "2n", now, 1.0);
    this.stringPad.triggerAttackRelease(["C4", "G4", "E5"], "1n", now, 0.8);
  }
  xp() { this.ctx(); this.pluck.triggerAttackRelease("C5", "16n", this.t(), 0.8); }
  xpbar() { this.ctx(); this.pluck.triggerAttackRelease("G3", "32n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.pluck.triggerAttackRelease("C4", "8n", now, 0.6); this.pluck.triggerAttackRelease("D4", "8n", now+1, 0.7); this.pluck.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.pluck.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.pluck.triggerAttackRelease("E3", "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.stringPad.triggerAttackRelease(["C3", "G3", "C4"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.pluck.triggerAttackRelease(["Eb3", "Ab3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.stringPad.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t(), 0.7); }
  powerUpClick() { this.ctx(); this.pluck.triggerAttackRelease("C4", "32n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.stringPad.triggerAttackRelease("E4", "2n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.pluck.triggerAttackRelease(["G4", "C5", "E5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.pizzicatoSub.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.pizzicatoSub.triggerAttackRelease("C1", "2n", this.t(), 0.9); }
}
export const ThemeOrchestralToneManager = new ThemeOrchestralToneManagerClass();
