import * as Tone from 'tone';

class ToneManagerClass {
  
  // Master Gain
  private masterGain = new Tone.Gain(0.8).toDestination();

  // 1. Çok kısa, tiz ve yumuşak arayüz tıklamaları için (Harf yazma vb.)
  private uiSynth = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(this.masterGain);

  // 2. Tok ve kısa arayüz sesleri için (Submit, Gri harf)
  private thudSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.masterGain);

  // 3. Melodik, yumuşak zil sesleri için (Sarı, Yeşil harf)
  private chimeSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 1 }
  }).connect(this.masterGain);

  // 4. Derin basslar ve kalp atışı/bomba sesleri için
  private bassSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.2 }
  }).connect(this.masterGain);

  // 5. Silme işlemi için rüzgar/fısıltı benzeri ses (Noise)
  private noiseSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
  }).connect(this.masterGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Yüklendi ve Hazır!");
  }

  public setVolume(val: number) {
    if(this.masterGain) this.masterGain.gain.rampTo(val, 0.1);
  }

  private t() { return Tone.now(); }

  // ============================================
  // TRIGGERS (Oyun Statelerine Göre)
  // ============================================

  // Core
  type() {
    if (Tone.context.state !== 'running') Tone.start();
    this.uiSynth.triggerAttackRelease("C6", "32n", this.t());
  }
  
  delete() {
    if (Tone.context.state !== 'running') Tone.start();
    this.noiseSynth.triggerAttackRelease("32n", this.t());
  }
  
  submit() {
    if (Tone.context.state !== 'running') Tone.start();
    this.thudSynth.triggerAttackRelease("G2", "16n", this.t());
  }

  // Feedback
  gray() {
    this.thudSynth.triggerAttackRelease("C2", "16n", this.t());
  }

  yellow() {
    this.chimeSynth.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    this.chimeSynth.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t());
  }

  // Rewards
  win() {
    this.chimeSynth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "2n", this.t());
  }

  xp() {
    this.uiSynth.triggerAttackRelease("G5", "32n", this.t());
  }

  xpbar() {
    const time = this.t();
    this.uiSynth.triggerAttackRelease("C5", "16n", time);
    this.uiSynth.triggerAttackRelease("E5", "16n", time + 0.1);
    this.uiSynth.triggerAttackRelease("G5", "16n", time + 0.2);
  }

  // Time & Tension & End
  roundInfo() {
    this.bassSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer10() {
    this.bassSynth.triggerAttackRelease("C1", "32n", this.t());
  }

  timer3() {
    this.bassSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer0() {
    this.uiSynth.triggerAttackRelease("C6", "8n", this.t());
  }

  lose() {
    // Out of tries
    this.thudSynth.triggerAttackRelease("C2", "2n", this.t());
    // Round end
    this.chimeSynth.triggerAttackRelease(["A3", "C4", "E4"], "1n", this.t() + 0.2);
  }

  // Power-Uplar
  hintWhoosh() {
    if (Tone.context.state !== 'running') Tone.start();
    this.uiSynth.triggerAttackRelease("C5", "16n", this.t());
  }

  hintReveal() {
    this.chimeSynth.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    if (Tone.context.state !== 'running') Tone.start();
    this.uiSynth.triggerAttackRelease("C5", "16n", this.t());
  }

  bombExplode() {
    this.bassSynth.triggerAttackRelease("C0", "2n", this.t());
    this.noiseSynth.triggerAttackRelease("8n", this.t());
  }
}

export const ToneManager = new ToneManagerClass();
