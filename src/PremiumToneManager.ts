import * as Tone from 'tone';

class PremiumToneManagerClass {
  // 1. MASTER ZİNCİR: Seslerin 'pahalı' duyulmasını sağlayan ana kanal
  private reverb = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();
  private lowpass = new Tone.Filter(3000, "lowpass").connect(this.reverb);
  private masterBus = new Tone.Volume(-5).connect(this.lowpass);

  // 2. ÖZEL ENSTRÜMANLAR
  // Mekanik/Organik tık sesleri için (Letter Type, Delete)
  private pluckingSynth = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 10,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
      modulationEnvelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
  }).connect(this.masterBus);

  // Coşkulu başarı sesleri için (Success, Green Letter)
  private successSynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1 }
  }).connect(this.masterBus);

  // Derin Bass/Bomba sesleri için
  private impactSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 1 }
  }).connect(this.masterBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Premium Mode (OPT 11) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // KLAVYE
  type() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("C5", "32n", this.t());
  }

  delete() {
    this.ctx();
    const noise = new Tone.NoiseSynth({ envelope: { attack: 0.001, decay: 0.05, sustain: 0 } }).connect(this.masterBus);
    noise.triggerAttackRelease("32n", this.t());
  }

  submit() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("G3", "16n", this.t());
  }

  // RENKLER
  gray() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("A2", "16n", this.t());
  }

  yellow() {
    this.ctx();
    this.successSynth.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    this.ctx();
    const now = this.t();
    this.successSynth.triggerAttackRelease("C4", "16n", now);
    this.successSynth.triggerAttackRelease("G4", "16n", now + 0.05);
  }

  greenKnown() {
    this.ctx();
    this.successSynth.triggerAttackRelease("E4", "8n", this.t());
  }

  // REWARDS
  win() {
    this.ctx();
    const now = this.t();
    // Majör 9'lu Akor dizilimi (Çok tatmin edici ve 'premium' bir bitiş)
    ["C4", "E4", "G4", "B4", "D5"].forEach((note, i) => {
        this.successSynth.triggerAttackRelease(note, "2n", now + (i * 0.08));
    });
  }

  xp() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("G5", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.pluckingSynth.triggerAttackRelease("C5", "32n", now);
    this.pluckingSynth.triggerAttackRelease("E5", "32n", now + 0.05);
    this.pluckingSynth.triggerAttackRelease("G5", "32n", now + 0.1);
  }

  // TIME & TENSION
  roundInfo() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer10() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C1", "32n", this.t());
  }

  timer3() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer0() {
    this.ctx();
    this.successSynth.triggerAttackRelease("C6", "16n", this.t());
  }

  lose() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("D2", "2n", this.t());
  }

  // POWER-UPS
  hintWhoosh() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("C5", "16n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.successSynth.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.pluckingSynth.triggerAttackRelease("C3", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C1", "2n", this.t());
    const noise = new Tone.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.1, decay: 0.8, sustain: 0 } }).connect(this.masterBus);
    noise.triggerAttackRelease("2n", this.t());
  }
}

export const PremiumToneManager = new PremiumToneManagerClass();
