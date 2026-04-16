import * as Tone from 'tone';

class GeoCrystalToneManagerClass {
  private mutedBus = new Tone.Filter(2000, "lowpass").toDestination();
  private brightBus = new Tone.Reverb({ decay: 4.0, wet: 0.5 }).toDestination();

  private pinDrop = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mutedBus);

  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0 }
  }).connect(this.mutedBus);

  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0, release: 0.5 }
  }).connect(this.mutedBus);

  private compassChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 5.0, modulationIndex: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.8, sustain: 0.2, release: 2.0 }
  }).connect(this.brightBus); // Glass/Crystal bell

  private popSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js GEO CRYSTAL Mode Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pinDrop.triggerAttackRelease("C5", "32n", this.t(), 0.3); }
  delete() { this.ctx(); this.paperSwoosh.triggerAttackRelease("16n", this.t(), 0.3); }
  submit() { this.ctx(); this.stampThud.triggerAttackRelease("G2", "8n", this.t()); }
  gray() { this.ctx(); this.pinDrop.triggerAttackRelease("G4", "16n", this.t(), 0.3); }
  error() { this.ctx(); this.stampThud.triggerAttackRelease("C2", "16n", this.t()); }
  yellow() { this.ctx(); this.compassChime.triggerAttackRelease("A4", "8n", this.t()); }
  green() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("E4", "16n", now);
    this.compassChime.triggerAttackRelease("C5", "8n", now + 0.1);
  }
  xp() { this.ctx(); this.popSynth.triggerAttackRelease("E6", "32n", this.t(), 0.4); }
  xpbar() {
    this.ctx(); const now = this.t();
    this.popSynth.triggerAttackRelease("C6", "32n", now, 0.4);
    this.popSynth.triggerAttackRelease("E6", "32n", now + 0.05, 0.4);
    this.popSynth.triggerAttackRelease("G6", "32n", now + 0.10, 0.4);
  }
  win() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["C5", "E5", "G5", "C6"], "1n", now);
  }
  roundInfo() { this.ctx(); this.stampThud.triggerAttackRelease("C3", "8n", this.t()); }
  timer3() { this.ctx(); this.stampThud.triggerAttackRelease("C3", "8n", this.t()); }
  timer0() { this.ctx(); this.compassChime.triggerAttackRelease("C6", "4n", this.t()); }
  timer10() { this.ctx(); this.pinDrop.triggerAttackRelease("A3", "32n", this.t(), 0.2); }
  lose() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "1n", this.t()); }
  powerUpClick() { this.ctx(); this.popSynth.triggerAttackRelease("G5", "16n", this.t()); }
  hintWhoosh() { this.ctx(); this.paperSwoosh.triggerAttackRelease("8n", this.t()); }
  hintReveal() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["E5", "G5", "C6"], "2n", now);
  }
  bombDrop() { this.ctx(); this.stampThud.triggerAttackRelease("C2", "16n", this.t()); }
  bombExplode() {
    this.ctx(); const now = this.t();
    this.stampThud.triggerAttackRelease("C1", "2n", now);
    this.paperSwoosh.triggerAttackRelease("2n", now + 0.05);
  }
}
export const GeoCrystalToneManager = new GeoCrystalToneManagerClass();
