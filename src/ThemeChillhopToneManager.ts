import * as Tone from 'tone';

class ThemeChillhopToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();
  private masterCompressor = new Tone.Compressor(-20, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Dusty vinyl pop
  private vinylPop = new Tone.MembraneSynth({
    pitchDecay: 0.05, octaves: 1, oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(new Tone.Filter(1500, "lowpass").connect(new Tone.Volume(-14).connect(this.masterVolume)));

  private tapeHiss = new Tone.NoiseSynth({
    noise: { type: "brown" }, envelope: { attack: 0.05, decay: 0.2, sustain: 0 }
  }).connect(new Tone.Filter(3000, "lowpass").connect(new Tone.Volume(-16).connect(this.masterVolume)));

  // Rhodes/E.Piano equivalent
  private rhodes = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2.0, modulationIndex: 1.5, oscillator: { type: "sine" },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 1.5 },
    modulation: { type: "triangle" }
  }).connect(new Tone.Filter(2000, "lowpass").connect(new Tone.Volume(2).connect(this.masterVolume)));

  private lofiKick = new Tone.MembraneSynth({
    pitchDecay: 0.2, octaves: 4, oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(new Tone.Filter(300, "lowpass").connect(new Tone.Volume(5).connect(this.masterVolume)));

  public async init() { await Tone.start(); console.log("Theme: LO-FI CHILLHOP Loaded ☕"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.vinylPop.triggerAttackRelease(200, "32n", this.t(), 0.5); }
  delete() { this.ctx(); this.tapeHiss.triggerAttackRelease("32n", this.t(), 0.4); }
  submit() { this.ctx(); this.tapeHiss.triggerAttackRelease("16n", this.t(), 0.5); }
  gray() { this.ctx(); this.vinylPop.triggerAttackRelease(150, "16n", this.t(), 0.6); }
  yellow() { this.ctx(); this.rhodes.triggerAttackRelease("E4", "16n", this.t(), 0.6); this.rhodes.triggerAttackRelease("G4", "8n", this.t() + 0.1, 0.7); }
  green() { this.ctx(); this.rhodes.triggerAttackRelease(["C4", "E4", "A4"], "8n", this.t(), 0.8); this.rhodes.triggerAttackRelease("C5", "4n", this.t() + 0.15, 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.rhodes.triggerAttackRelease(["C4", "E4", "G4", "B4"], "1n", now, 1.0); // Maj7 Chord
    this.lofiKick.triggerAttackRelease("C2", "8n", now, 0.8);
  }
  xp() { this.ctx(); this.rhodes.triggerAttackRelease("D5", "8n", this.t(), 0.7); }
  xpbar() { this.ctx(); this.tapeHiss.triggerAttackRelease("32n", this.t(), 0.3); this.rhodes.triggerAttackRelease("C4", "16n", this.t(), 0.5); }
  roundInfo() { this.ctx(); const now = this.t(); this.rhodes.triggerAttackRelease("C4", "8n", now, 0.6); this.rhodes.triggerAttackRelease("D4", "8n", now+1, 0.7); this.rhodes.triggerAttackRelease("E4", "4n", now+2, 0.8); }
  timer10() { this.ctx(); this.rhodes.triggerAttackRelease("A3", "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.vinylPop.triggerAttackRelease(100, "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.rhodes.triggerAttackRelease(["C3", "G3", "B3"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.rhodes.triggerAttackRelease(["Eb3", "A3"], "8n", this.t(), 0.6); }
  lose() { this.ctx(); this.lofiKick.triggerAttackRelease("C1", "1n", this.t(), 0.8); this.rhodes.triggerAttackRelease(["C3", "Eb3", "G3", "Bb3"], "1n", this.t(), 0.7); } // Min7
  powerUpClick() { this.ctx(); this.lofiKick.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.tapeHiss.triggerAttackRelease("4n", this.t(), 0.6); }
  hintReveal() { this.ctx(); this.rhodes.triggerAttackRelease(["F4", "A4", "C5", "E5"], "2n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.lofiKick.triggerAttackRelease("C2", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.lofiKick.triggerAttackRelease("C1", "2n", this.t(), 0.9); this.tapeHiss.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeChillhopToneManager = new ThemeChillhopToneManagerClass();
