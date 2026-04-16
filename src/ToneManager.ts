import * as Tone from 'tone';

class ToneManagerClass {
  private initialized = false;
  
  // Synths
  private uiSynth!: Tone.Synth;
  private thudSynth!: Tone.Synth;
  private chimeSynth!: Tone.PolySynth;
  private bassSynth!: Tone.MembraneSynth;
  private noiseSynth!: Tone.NoiseSynth;

  // Master Gain
  private masterGain!: Tone.Gain;

  public async init() {
    if (this.initialized) return;
    
    await Tone.start();

    this.masterGain = new Tone.Gain(0.8).toDestination();

    // 1. Çok kısa, tiz ve yumuşak arayüz tıklamaları için (Harf yazma vb.)
    this.uiSynth = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.01 }
    }).connect(this.masterGain);

    // 2. Tok ve kısa arayüz sesleri için (Submit, Gri harf)
    this.thudSynth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
    }).connect(this.masterGain);

    // 3. Melodik, yumuşak zil sesleri için (Sarı, Yeşil harf)
    this.chimeSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 1 }
    }).connect(this.masterGain);

    // 4. Derin basslar ve kalp atışı/bomba sesleri için
    this.bassSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 1.2 }
    }).connect(this.masterGain);

    // 5. Silme işlemi için rüzgar/fısıltı benzeri ses (Noise)
    this.noiseSynth = new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
    }).connect(this.masterGain);
    
    this.initialized = true;
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
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C6", "32n", this.t());
  }
  
  delete() {
    if(!this.initialized) return;
    this.noiseSynth.triggerAttackRelease("32n", this.t());
  }
  
  submit() {
    if(!this.initialized) return;
    this.thudSynth.triggerAttackRelease("G2", "16n", this.t());
  }

  // Feedback
  gray() {
    if(!this.initialized) return;
    this.thudSynth.triggerAttackRelease("C2", "16n", this.t());
  }

  yellow() {
    if(!this.initialized) return;
    this.chimeSynth.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    if(!this.initialized) return;
    this.chimeSynth.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t());
  }

  // Rewards
  win() {
    if(!this.initialized) return;
    this.chimeSynth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "2n", this.t());
  }

  xp() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("G5", "32n", this.t());
  }

  xpbar() {
    if(!this.initialized) return;
    const time = this.t();
    this.uiSynth.triggerAttackRelease("C5", "16n", time);
    this.uiSynth.triggerAttackRelease("E5", "16n", time + 0.1);
    this.uiSynth.triggerAttackRelease("G5", "16n", time + 0.2);
  }

  // Time & Tension & End
  roundInfo() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer10() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "32n", this.t());
  }

  timer3() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer0() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C6", "8n", this.t());
  }

  lose() {
    if(!this.initialized) return;
    // Out of tries
    this.thudSynth.triggerAttackRelease("C2", "2n", this.t());
    // Round end
    this.chimeSynth.triggerAttackRelease(["A3", "C4", "E4"], "1n", this.t() + 0.2);
  }

  // Power-Uplar
  hintWhoosh() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C5", "16n", this.t());
  }

  hintReveal() {
    if(!this.initialized) return;
    this.chimeSynth.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C5", "16n", this.t());
  }

  bombExplode() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C0", "2n", this.t());
    this.noiseSynth.triggerAttackRelease("8n", this.t());
  }
}

export const ToneManager = new ToneManagerClass();
