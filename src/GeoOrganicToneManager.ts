import * as Tone from 'tone';

class GeoOrganicToneManagerClass {
  private mutedBus = new Tone.Volume(-5).toDestination();
  private brightBus = new Tone.Reverb({ decay: 1.0, wet: 0.1 }).toDestination();

  private pinDrop = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 4, oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(this.mutedBus); // Woodblock feel

  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
  }).connect(this.mutedBus);

  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.1, octaves: 1, oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 }
  }).connect(this.mutedBus);

  private compassChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 8.0, modulationIndex: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 }
  }).connect(this.brightBus); // Marimba feel

  private popSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js GEO ORGANIC Mode Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pinDrop.triggerAttackRelease("C4", "32n", this.t(), 0.5); }
  delete() { this.ctx(); this.paperSwoosh.triggerAttackRelease("16n", this.t(), 0.3); }
  submit() { this.ctx(); this.stampThud.triggerAttackRelease("C2", "8n", this.t()); }
  gray() { this.ctx(); this.pinDrop.triggerAttackRelease("G3", "16n", this.t(), 0.5); }
  error() { this.ctx(); this.stampThud.triggerAttackRelease("D1", "16n", this.t()); }
  yellow() { this.ctx(); this.compassChime.triggerAttackRelease("E4", "8n", this.t()); }
  green() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("A4", "8n", now + 0.1);
  }
  xp() { this.ctx(); this.popSynth.triggerAttackRelease("G4", "32n", this.t()); }
  xpbar() {
    this.ctx(); const now = this.t();
    this.popSynth.triggerAttackRelease("C5", "32n", now);
    this.popSynth.triggerAttackRelease("D5", "32n", now + 0.05);
    this.popSynth.triggerAttackRelease("E5", "32n", now + 0.10);
  }
  win() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n", now);
  }
  roundInfo() { this.ctx(); this.stampThud.triggerAttackRelease("E2", "8n", this.t()); }
  timer3() { this.ctx(); this.stampThud.triggerAttackRelease("E2", "8n", this.t()); }
  timer0() { this.ctx(); this.compassChime.triggerAttackRelease("C5", "4n", this.t()); }
  timer10() { this.ctx(); this.pinDrop.triggerAttackRelease("A2", "32n", this.t(), 0.3); }
  lose() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "1n", this.t()); }
  powerUpClick() { this.ctx(); this.popSynth.triggerAttackRelease("E5", "16n", this.t()); }
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
export const GeoOrganicToneManager = new GeoOrganicToneManagerClass();
