import * as Tone from 'tone';

class ThemeSynthwaveToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 2.0, wet: 0.25 }).toDestination();
  private masterCompressor = new Tone.Compressor(-14, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  private moogBass = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.4 }
  }).connect(new Tone.Filter(800, "lowpass").connect(new Tone.Volume(-2).connect(this.masterVolume)));

  private waveLead = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 1.0 }
  }).connect(new Tone.Volume(-8).connect(this.masterVolume));

  private wavePad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.5, decay: 1.0, sustain: 0.8, release: 2.0 }
  }).connect(new Tone.Filter(1500, "lowpass").connect(new Tone.Volume(-10).connect(this.masterVolume)));

  private retroKick = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: SYNTHWAVE NIGHT-DRIVE Loaded 🌃"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.moogBass.triggerAttackRelease("C2", "32n", this.t(), 0.3); } 
  delete() { this.ctx(); this.moogBass.triggerAttackRelease("G1", "16n", this.t(), 0.4); }
  submit() { this.ctx(); this.moogBass.triggerAttackRelease("C3", "16n", this.t(), 0.5); }
  gray() { this.ctx(); this.moogBass.triggerAttackRelease("E2", "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.waveLead.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.waveLead.triggerAttackRelease("G4", "8n", this.t() + 0.15, 0.7); }
  green() { this.ctx(); this.waveLead.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.waveLead.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n", now, 1.0);
    this.wavePad.triggerAttackRelease(["C3", "G3", "E4"], "1n", now, 0.8);
  }
  xp() { this.ctx(); this.waveLead.triggerAttackRelease("C5", "16n", this.t(), 0.8); }
  xpbar() { this.ctx(); this.moogBass.triggerAttackRelease("G2", "32n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.waveLead.triggerAttackRelease("C4", "8n", now, 0.6); this.waveLead.triggerAttackRelease("D4", "8n", now+1, 0.7); this.waveLead.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.waveLead.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.moogBass.triggerAttackRelease("E2", "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.wavePad.triggerAttackRelease(["C3", "G3", "C4"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.waveLead.triggerAttackRelease(["Eb3", "Ab3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.retroKick.triggerAttackRelease("C2", "1n", this.t(), 0.9); this.wavePad.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t(), 0.7); }
  powerUpClick() { this.ctx(); this.waveLead.triggerAttackRelease("C4", "32n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.wavePad.triggerAttackRelease("E4", "2n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.waveLead.triggerAttackRelease(["G4", "C5", "E5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.retroKick.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.retroKick.triggerAttackRelease("C1", "2n", this.t(), 0.9); }
}
export const ThemeSynthwaveToneManager = new ThemeSynthwaveToneManagerClass();
