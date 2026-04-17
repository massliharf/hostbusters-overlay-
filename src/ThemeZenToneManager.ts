import * as Tone from 'tone';

class ThemeZenToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 5.0, wet: 0.5 }).toDestination();
  private masterCompressor = new Tone.Compressor(-15, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Bamboo rustle
  private bambooRustle = new Tone.NoiseSynth({
    noise: { type: "pink" }, envelope: { attack: 0.1, decay: 0.3, sustain: 0 }
  }).connect(new Tone.Filter(2000, "bandpass").connect(new Tone.Volume(-14).connect(this.masterVolume)));

  // Singing bowl (Crystal/Metal resonance)
  private singingBowl = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.5, decay: 2.0, sustain: 0.5, release: 4.0 }
  }).connect(new Tone.Volume(-4).connect(this.masterVolume));

  // Wind chime
  private windChime = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 4.0, modulationIndex: 2.0, oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 1.5 },
    modulation: { type: "sine" }
  }).connect(new Tone.Volume(-6).connect(this.masterVolume));

  // Soft Gong
  private deepGong = new Tone.MembraneSynth({
    pitchDecay: 0.02, octaves: 4, oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 1.0, sustain: 0, release: 2.0 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: ZEN GARDEN Loaded 🧘"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.bambooRustle.triggerAttackRelease("32n", this.t(), 0.3); } 
  delete() { this.ctx(); this.bambooRustle.triggerAttackRelease("16n", this.t(), 0.5); }
  submit() { this.ctx(); this.deepGong.triggerAttackRelease("C3", "4n", this.t(), 0.4); }
  gray() { this.ctx(); this.bambooRustle.triggerAttackRelease("8n", this.t(), 0.4); }
  yellow() { this.ctx(); this.windChime.triggerAttackRelease("E5", "16n", this.t(), 0.5); this.windChime.triggerAttackRelease("G5", "8n", this.t() + 0.1, 0.6); }
  green() { this.ctx(); this.windChime.triggerAttackRelease(["C5", "E5", "A5"], "8n", this.t(), 0.7); }
  win() {
    this.ctx(); const now = this.t();
    this.windChime.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", now, 1.0);
    this.singingBowl.triggerAttackRelease(["C4", "G4"], "1m", now + 0.2, 0.8);
  }
  xp() { this.ctx(); this.windChime.triggerAttackRelease("C6", "8n", this.t(), 0.6); }
  xpbar() { this.ctx(); this.bambooRustle.triggerAttackRelease("16n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.windChime.triggerAttackRelease("C5", "8n", now, 0.5); this.windChime.triggerAttackRelease("D5", "8n", now+1, 0.6); this.windChime.triggerAttackRelease("E5", "4n", now+2, 0.7); }
  timer10() { this.ctx(); this.windChime.triggerAttackRelease("A4", "16n", this.t(), 0.4); }
  timer3() { this.ctx(); this.deepGong.triggerAttackRelease("G2", "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.singingBowl.triggerAttackRelease(["C3", "E3", "G3"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.deepGong.triggerAttackRelease("Eb2", "2n", this.t(), 0.6); }
  lose() { this.ctx(); this.deepGong.triggerAttackRelease("C2", "1m", this.t(), 0.9); }
  powerUpClick() { this.ctx(); this.windChime.triggerAttackRelease("C5", "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.bambooRustle.triggerAttackRelease("2n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.singingBowl.triggerAttackRelease(["G4", "C5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.deepGong.triggerAttackRelease("C3", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.deepGong.triggerAttackRelease("C2", "1n", this.t(), 0.9); this.bambooRustle.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeZenToneManager = new ThemeZenToneManagerClass();
