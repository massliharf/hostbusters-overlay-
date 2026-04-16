import * as Tone from 'tone';

class ToneManagerClass {
  // Master Channels
  private masterFilter = new Tone.Filter(3000, "lowpass").toDestination();
  private masterGain = new Tone.Gain(0.6).connect(this.masterFilter); // Using Gain instead of Volume for relative control

  // 1. ORGANIC POP
  private organicPop = new Tone.MembraneSynth({
      pitchDecay: 0.02, 
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.01 }
  }).connect(this.masterGain);

  // 2. MARIMBA CHIME
  private marimbaChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.01,
      modulationIndex: 1,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
      modulation: { type: "square" },
      modulationEnvelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.masterGain);

  // 3. FRICTION NOISE
  private frictionNoise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.005, decay: 0.04, sustain: 0, release: 0.01 }
  }).connect(this.masterGain);

  // 4. SUB BASS
  private subBass = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 1 }
  }).connect(this.masterGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Premium Wordle Mode Hazır!");
  }

  public setVolume(val: number) {
    if(this.masterGain) this.masterGain.gain.rampTo(val, 0.1);
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ============================================
  // TRIGGERS (Oyun Statelerine Göre)
  // ============================================

  // KLAVYE & ARAYÜZ
  type() {
    this.ctx();
    this.organicPop.triggerAttackRelease("G4", "32n", this.t());
  }
  
  delete() {
    this.ctx();
    this.frictionNoise.triggerAttackRelease("32n", this.t());
  }
  
  submit() {
    this.ctx();
    this.organicPop.triggerAttackRelease("C3", "16n", this.t());
  }

  // RENK GERİ BİLDİRİMLERİ
  gray() {
    this.ctx();
    this.organicPop.triggerAttackRelease("E2", "16n", this.t());
  }

  yellow() {
    this.ctx();
    this.marimbaChime.triggerAttackRelease("E4", "16n", this.t());
  }

  green() {
    this.ctx();
    this.marimbaChime.triggerAttackRelease(["C4", "G4"], "16n", this.t());
  }

  // ÖDÜL VE BAŞARI
  win() {
    this.ctx();
    this.marimbaChime.triggerAttackRelease(["C4", "E4", "G4", "C5"], "8n", this.t());
  }

  xp() {
    this.ctx();
    this.organicPop.triggerAttackRelease("C5", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const time = this.t();
    this.organicPop.triggerAttackRelease("C4", "32n", time);
    this.organicPop.triggerAttackRelease("E4", "32n", time + 0.05);
    this.organicPop.triggerAttackRelease("G4", "32n", time + 0.1);
  }

  // GERİLİM VE ZAMAN
  roundInfo() {
    this.ctx();
    this.subBass.triggerAttackRelease("C1", "8n", this.t());
  }

  timer10() {
    this.ctx();
    this.organicPop.triggerAttackRelease("C2", "32n", this.t());
  }

  timer3() {
    this.ctx();
    this.subBass.triggerAttackRelease("C1", "8n", this.t());
  }

  timer0() {
    this.ctx();
    this.marimbaChime.triggerAttackRelease("C5", "8n", this.t());
  }

  lose() {
    this.ctx();
    this.organicPop.triggerAttackRelease("A1", "8n", this.t());
    this.marimbaChime.triggerAttackRelease(["A3", "C4"], "4n", this.t() + 0.2);
  }

  // POWER-UP'LAR
  hintWhoosh() {
    this.ctx();
    this.organicPop.triggerAttackRelease("C6", "32n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.marimbaChime.triggerAttackRelease(["G4", "D5", "G5"], "8n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.organicPop.triggerAttackRelease("C6", "32n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.subBass.triggerAttackRelease("C0", "2n", this.t());
    this.frictionNoise.triggerAttackRelease("8n", this.t() + 0.1);
  }
}

export const ToneManager = new ToneManagerClass();
