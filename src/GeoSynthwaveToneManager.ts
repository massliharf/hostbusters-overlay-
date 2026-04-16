import * as Tone from 'tone';

class GeoSynthwaveToneManagerClass {
  private mutedBus = new Tone.Filter(1000, "lowpass").toDestination();
  private brightBus = new Tone.Chorus(4, 2.5, 0.5).toDestination();

  private pinDrop = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.05 }
  }).connect(this.mutedBus);

  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
  }).connect(this.mutedBus);

  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.2, octaves: 2, oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(this.mutedBus);

  private compassChime = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.8 }
  }).connect(this.brightBus);

  private popSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.1, release: 0.1 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js GEO SYNTHWAVE Mode Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pinDrop.triggerAttackRelease("C2", "32n", this.t(), 0.5); }
  delete() { this.ctx(); this.paperSwoosh.triggerAttackRelease("16n", this.t(), 0.5); }
  submit() { this.ctx(); this.stampThud.triggerAttackRelease("G1", "8n", this.t()); }
  gray() { this.ctx(); this.pinDrop.triggerAttackRelease("C1", "16n", this.t()); }
  error() { this.ctx(); this.stampThud.triggerAttackRelease("A1", "16n", this.t()); }
  yellow() { this.ctx(); this.compassChime.triggerAttackRelease("E4", "8n", this.t(), 0.5); }
  green() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("G4", "8n", now + 0.1);
  }
  xp() { this.ctx(); this.popSynth.triggerAttackRelease("C5", "32n", this.t(), 0.5); }
  xpbar() {
    this.ctx(); const now = this.t();
    this.popSynth.triggerAttackRelease("C5", "32n", now);
    this.popSynth.triggerAttackRelease("E5", "32n", now + 0.05);
    this.popSynth.triggerAttackRelease("G5", "32n", now + 0.10);
  }
  win() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n", now);
  }
  roundInfo() { this.ctx(); this.stampThud.triggerAttackRelease("C2", "8n", this.t()); }
  timer3() { this.ctx(); this.stampThud.triggerAttackRelease("C2", "8n", this.t()); }
  timer0() { this.ctx(); this.compassChime.triggerAttackRelease("C5", "4n", this.t()); }
  timer10() { this.ctx(); this.pinDrop.triggerAttackRelease("A2", "32n", this.t(), 0.3); }
  lose() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "1n", this.t()); }
  powerUpClick() { this.ctx(); this.popSynth.triggerAttackRelease("A5", "16n", this.t()); }
  hintWhoosh() { this.ctx(); this.paperSwoosh.triggerAttackRelease("8n", this.t()); }
  hintReveal() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["C5", "E5", "G5"], "2n", now);
  }
  bombDrop() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "16n", this.t()); }
  bombExplode() {
    this.ctx(); const now = this.t();
    this.stampThud.triggerAttackRelease("C0", "2n", now);
    this.paperSwoosh.triggerAttackRelease("2n", now + 0.05);
  }
}
export const GeoSynthwaveToneManager = new GeoSynthwaveToneManagerClass();
