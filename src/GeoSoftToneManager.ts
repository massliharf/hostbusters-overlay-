import * as Tone from 'tone';

class GeoSoftToneManagerClass {
  private mutedBus = new Tone.Filter(600, "lowpass").toDestination();
  private brightBus = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();

  private pinDrop = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1.5, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mutedBus);

  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "brown" }, // Softer noise
      envelope: { attack: 0.1, decay: 0.2, sustain: 0 }
  }).connect(this.mutedBus);

  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0, release: 0.5 }
  }).connect(this.mutedBus);

  private compassChime = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 1.5, oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0, release: 0.5 }
  }).connect(this.brightBus);

  private popSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js GEO SOFT Mode Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pinDrop.triggerAttackRelease("C3", "32n", this.t()); }
  delete() { this.ctx(); this.paperSwoosh.triggerAttackRelease("16n", this.t()); }
  submit() { this.ctx(); this.stampThud.triggerAttackRelease("E1", "8n", this.t()); }
  gray() { this.ctx(); this.pinDrop.triggerAttackRelease("D2", "16n", this.t()); }
  error() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "16n", this.t()); }
  yellow() { this.ctx(); this.compassChime.triggerAttackRelease("D4", "8n", this.t()); }
  
  green() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("E4", "8n", now + 0.1);
  }
  xp() { this.ctx(); this.popSynth.triggerAttackRelease("E5", "32n", this.t()); }
  
  xpbar() {
    this.ctx(); const now = this.t();
    this.popSynth.triggerAttackRelease("D5", "32n", now);
    this.popSynth.triggerAttackRelease("F5", "32n", now + 0.05);
    this.popSynth.triggerAttackRelease("A5", "32n", now + 0.10);
  }
  
  win() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n", now); 
  }
  
  roundInfo() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "8n", this.t()); }
  timer3() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "8n", this.t()); }
  timer0() { this.ctx(); this.compassChime.triggerAttackRelease("E5", "4n", this.t()); }
  timer10() { this.ctx(); this.pinDrop.triggerAttackRelease("A1", "32n", this.t()); }
  lose() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "1n", this.t()); }
  powerUpClick() { this.ctx(); this.popSynth.triggerAttackRelease("C5", "16n", this.t()); }
  hintWhoosh() { this.ctx(); this.paperSwoosh.triggerAttackRelease("8n", this.t()); }
  
  hintReveal() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("E5", "32n", now);
    this.compassChime.triggerAttackRelease("G5", "32n", now + 0.05);
    this.compassChime.triggerAttackRelease("C6", "2n", now + 0.1);
  }
  
  bombDrop() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "16n", this.t()); }
  bombExplode() {
    this.ctx(); const now = this.t();
    this.stampThud.triggerAttackRelease("C0", "2n", now);
    this.paperSwoosh.triggerAttackRelease("2n", now + 0.05);
  }
}
export const GeoSoftToneManager = new GeoSoftToneManagerClass();
