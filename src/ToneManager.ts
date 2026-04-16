import * as Tone from 'tone';

class ToneManagerClass {
  // Master Channels
  private masterGain = new Tone.Gain(0.7).toDestination();
  private lowpass = new Tone.Filter(3000, "lowpass").connect(this.masterGain);
  private uiLowpass = new Tone.Filter(2000, "lowpass").connect(this.masterGain);

  // 1. ORGANIC TAP (Kalem ucu, tahta tıkklaması) - Harf yazma
  private tapSynth = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 1.5,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 }
  }).connect(this.uiLowpass);

  // 2. TOK VE KALIN CLICK (Submit) - Tahta boşluk
  private thudSynth = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 2,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
  }).connect(this.uiLowpass);

  // 3. KALIMBA / MARIMBA BENZERİ (Sarı, Yeşil, Wordle Başarı Hissi) - FM Sentezi
  private marimbaSynth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.5,
    modulationIndex: 1.5,
    oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.8 },
    modulation: { type: "triangle" },
    modulationEnvelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.masterGain);

  // 4. SUB BASS (Zamanlayıcı, Bomba) - Sinematik Atmosfer
  private subSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 3,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.6, sustain: 0, release: 1.5 }
  }).connect(this.lowpass);

  // 5. SWIPE / PAPER NOISE (Silme işlemi)
  private paperSweep = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0 }
  }).connect(new Tone.Filter(1500, "lowpass").connect(this.masterGain));

  public async init() {
    await Tone.start();
    console.log("Tone.js Modern Wordle Mode Hazır!");
  }

  public setVolume(val: number) {
    if(this.masterGain) this.masterGain.gain.rampTo(val, 0.1);
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ============================================
  // TRIGGERS (Oyun Statelerine Göre)
  // ============================================

  // Core
  type() {
    this.ctx();
    this.tapSynth.triggerAttackRelease("C4", "32n", this.t());
  }
  
  delete() {
    this.ctx();
    this.paperSweep.triggerAttackRelease("32n", this.t());
  }
  
  submit() {
    this.ctx();
    this.thudSynth.triggerAttackRelease("C2", "16n", this.t());
  }

  // Feedback
  gray() {
    this.ctx();
    // Sessiz, derinden gelen, "boş" hissi veren bir thud
    this.thudSynth.triggerAttackRelease("G1", "16n", this.t());
  }

  yellow() {
    this.ctx();
    // Ilık ve biraz pozitif (Minörden majöre geçiş hissi - Marimba)
    this.marimbaSynth.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    this.ctx();
    // Tamamen doğru, aşırı parlak tatmin edici Majör akor (Marimba)
    this.marimbaSynth.triggerAttackRelease(["C4", "E4", "G4"], "8n", this.t());
  }

  // Rewards
  win() {
    this.ctx();
    // Duolingo tarzı başarı jingle'ı (Tatlı bir yükseliş arpeji)
    const time = this.t();
    this.marimbaSynth.triggerAttackRelease("C4", "16n", time);
    this.marimbaSynth.triggerAttackRelease("E4", "16n", time + 0.1);
    this.marimbaSynth.triggerAttackRelease("G4", "16n", time + 0.2);
    this.marimbaSynth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "2n", time + 0.35);
  }

  xp() {
    this.ctx();
    // XP baloncuk pıt pıt sesleri
    this.tapSynth.triggerAttackRelease("G5", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const time = this.t();
    this.tapSynth.triggerAttackRelease("C5", "16n", time);
    this.tapSynth.triggerAttackRelease("E5", "16n", time + 0.05);
    this.tapSynth.triggerAttackRelease("G5", "16n", time + 0.1);
  }

  // Time & Tension & End
  roundInfo() {
    this.ctx();
    this.subSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer10() {
    this.ctx();
    this.subSynth.triggerAttackRelease("C1", "32n", this.t());
  }

  timer3() {
    this.ctx();
    this.subSynth.triggerAttackRelease("C1", "4n", this.t());
  }

  timer0() {
    this.ctx();
    this.marimbaSynth.triggerAttackRelease("C6", "16n", this.t());
  }

  lose() {
    this.ctx();
    // Olumsuz, düşen sesler.
    const time = this.t();
    this.thudSynth.triggerAttackRelease("D2", "2n", time);
    this.marimbaSynth.triggerAttackRelease(["A3", "C4", "D4"], "1n", time + 0.15);
  }

  // Power-Uplar
  hintWhoosh() {
    this.ctx();
    this.tapSynth.triggerAttackRelease("C6", "32n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.marimbaSynth.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.thudSynth.triggerAttackRelease("C3", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.subSynth.triggerAttackRelease("C0", "2n", this.t());
    this.paperSweep.triggerAttackRelease("8n", this.t());
  }
}

export const ToneManager = new ToneManagerClass();
