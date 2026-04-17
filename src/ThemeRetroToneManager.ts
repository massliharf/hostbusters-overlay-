import * as Tone from 'tone';

class ThemeRetroToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 1.0, wet: 0.15 }).toDestination();
  private masterCompressor = new Tone.Compressor(-12, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // 8-bit chip blip
  private chipBlip = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.0, release: 0.1 }
  }).connect(new Tone.Volume(-14).connect(this.masterVolume));

  private chipNoise = new Tone.NoiseSynth({
    noise: { type: "white" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
  }).connect(new Tone.Filter(2000, "highpass").connect(new Tone.Volume(-16).connect(this.masterVolume)));

  // 8-bit melody
  private chipMelody = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 0.4 }
  }).connect(new Tone.Volume(-8).connect(this.masterVolume));

  private chipBass = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.4, sustain: 0.2, release: 0.5 }
  }).connect(new Tone.Volume(-4).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: MODERN 8-BIT Loaded 🕹️"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.chipNoise.triggerAttackRelease("32n", this.t(), 0.5); }
  delete() { this.ctx(); this.chipNoise.triggerAttackRelease("16n", this.t(), 0.6); }
  submit() { this.ctx(); this.chipBlip.triggerAttackRelease("C3", "16n", this.t(), 0.5); }
  gray() { this.ctx(); this.chipBlip.triggerAttackRelease("E3", "16n", this.t(), 0.4); }
  yellow() { this.ctx(); this.chipMelody.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.chipMelody.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.chipMelody.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t(), 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.chipMelody.triggerAttackRelease(["C4", "E4", "G4"], "8n", now, 1.0);
    this.chipMelody.triggerAttackRelease(["E4", "G4", "B4"], "8n", now + 0.15, 1.0);
    this.chipMelody.triggerAttackRelease(["G4", "B4", "D5"], "8n", now + 0.3, 1.0);
    this.chipMelody.triggerAttackRelease(["C5", "E5", "G5"], "1n", now + 0.45, 1.0);
  }
  xp() { this.ctx(); this.chipMelody.triggerAttackRelease("C6", "16n", this.t(), 0.8); }
  xpbar() { this.ctx(); this.chipNoise.triggerAttackRelease("32n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.chipMelody.triggerAttackRelease("C4", "8n", now, 0.6); this.chipMelody.triggerAttackRelease("D4", "8n", now+1, 0.7); this.chipMelody.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.chipBlip.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.chipBlip.triggerAttackRelease("E3", "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.chipMelody.triggerAttackRelease(["C3", "G3", "C4"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.chipMelody.triggerAttackRelease(["Eb3", "Ab3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.chipBass.triggerAttackRelease("C2", "2n", this.t(), 0.9); this.chipMelody.triggerAttackRelease(["C3", "Eb3", "G3"], "1n", this.t() + 0.5, 0.7); }
  powerUpClick() { this.ctx(); this.chipBlip.triggerAttackRelease("C4", "32n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.chipNoise.triggerAttackRelease("4n", this.t(), 0.6); }
  hintReveal() { this.ctx(); this.chipMelody.triggerAttackRelease(["G4", "C5", "E5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.chipBass.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.chipBass.triggerAttackRelease("C1", "2n", this.t(), 0.9); this.chipNoise.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeRetroToneManager = new ThemeRetroToneManagerClass();
