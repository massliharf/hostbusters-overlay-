import * as Tone from 'tone';

class GeoDeepToneManagerClass {
  private mutedBus = new Tone.Filter(400, "lowpass").toDestination();
  private brightBus = new Tone.Reverb({ decay: 3.5, wet: 0.4 }).toDestination();

  private pinDrop = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mutedBus);

  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0 }
  }).connect(this.mutedBus);

  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.1, octaves: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0, release: 0.5 }
  }).connect(new Tone.Volume(5).toDestination()); // Extra sub bass

  private compassChime = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.05, decay: 0.5, sustain: 0.2, release: 1.0 }
  }).connect(this.brightBus);

  private popSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js GEO DEEP Mode Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.pinDrop.triggerAttackRelease("C1", "32n", this.t(), 0.8); }
  delete() { this.ctx(); this.paperSwoosh.triggerAttackRelease("16n", this.t(), 0.6); }
  submit() { this.ctx(); this.stampThud.triggerAttackRelease("F1", "8n", this.t()); }
  gray() { this.ctx(); this.pinDrop.triggerAttackRelease("E1", "16n", this.t(), 0.8); }
  error() { this.ctx(); this.stampThud.triggerAttackRelease("A0", "16n", this.t()); }
  yellow() { this.ctx(); this.compassChime.triggerAttackRelease("C3", "8n", this.t()); }
  green() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease("A3", "16n", now);
    this.compassChime.triggerAttackRelease("E4", "8n", now + 0.1);
  }
  xp() { this.ctx(); this.popSynth.triggerAttackRelease("A4", "32n", this.t()); }
  xpbar() {
    this.ctx(); const now = this.t();
    this.popSynth.triggerAttackRelease("A3", "32n", now);
    this.popSynth.triggerAttackRelease("C4", "32n", now + 0.05);
    this.popSynth.triggerAttackRelease("E4", "32n", now + 0.10);
  }
  win() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["A3", "C4", "E4", "A4"], "1n", now);
  }
  roundInfo() { this.ctx(); this.stampThud.triggerAttackRelease("A0", "8n", this.t()); }
  timer3() { this.ctx(); this.stampThud.triggerAttackRelease("A0", "8n", this.t()); }
  timer0() { this.ctx(); this.compassChime.triggerAttackRelease("A4", "4n", this.t()); }
  timer10() { this.ctx(); this.pinDrop.triggerAttackRelease("E1", "32n", this.t(), 0.5); }
  lose() { this.ctx(); this.stampThud.triggerAttackRelease("C0", "1n", this.t()); }
  powerUpClick() { this.ctx(); this.popSynth.triggerAttackRelease("C4", "16n", this.t()); }
  hintWhoosh() { this.ctx(); this.paperSwoosh.triggerAttackRelease("8n", this.t()); }
  hintReveal() {
    this.ctx(); const now = this.t();
    this.compassChime.triggerAttackRelease(["A3", "C4", "E4"], "2n", now);
  }
  bombDrop() { this.ctx(); this.stampThud.triggerAttackRelease("C1", "16n", this.t()); }
  bombExplode() {
    this.ctx(); const now = this.t();
    this.stampThud.triggerAttackRelease("C0", "2n", now);
    this.paperSwoosh.triggerAttackRelease("1n", now + 0.05);
  }
}
export const GeoDeepToneManager = new GeoDeepToneManagerClass();
