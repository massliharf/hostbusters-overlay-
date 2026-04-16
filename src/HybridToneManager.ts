import * as Tone from 'tone';

class HybridToneManagerClass {
  // === 1. KANALLAR (SİHRİN OLDUĞU YER) ===
  // Kanal A: BOĞUK KANAL (Secondary Sesler İçin)
  private mutedBus = new Tone.Filter(800, "lowpass").toDestination();

  // Kanal B: CANLI KANAL (Prominent/Ödül Sesleri İçin)
  private brightBus = new Tone.Reverb({ decay: 1.5, wet: 0.2 }).toDestination();

  // === 2. ENSTRÜMANLAR ===
  // İKİNCİL (SECONDARY) ENSTRÜMANLAR -> mutedBus'a bağlı
  private dullTap = new Tone.MembraneSynth({ // Harf yazma, gri harf
      pitchDecay: 0.01, octaves: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mutedBus);

  private softBreath = new Tone.NoiseSynth({ // Silme işlemi
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(this.mutedBus);

  private deepThud = new Tone.MembraneSynth({ // Submit, Fail, 3-2-1
      pitchDecay: 0.05, octaves: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(this.mutedBus);

  // BİRİNCİL (PROMINENT) ENSTRÜMANLAR -> brightBus'a bağlı
  private rewardChime = new Tone.PolySynth(Tone.FMSynth, { // Sarı, Yeşil, Başarı
      harmonicity: 3.5, modulationIndex: 4, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 1 }
  }).connect(this.brightBus);

  private bubblyPop = new Tone.Synth({ // XP ve Power-uplar
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Hybrid Mode (OPT 15) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // 3. STATELERE GÖRE PUNCHY TETİKLEYİCİLER
  // ==========================

  // --- SECONDARY (BOĞUK VE DOKUSAL) ---
  type() {
    this.ctx();
    this.dullTap.triggerAttackRelease("C3", "32n", this.t());
  }

  delete() {
    this.ctx();
    this.softBreath.triggerAttackRelease("16n", this.t());
  }

  submit() {
    this.ctx();
    this.deepThud.triggerAttackRelease("G2", "8n", this.t());
  }

  gray() {
    this.ctx();
    this.dullTap.triggerAttackRelease("G2", "32n", this.t());
  }

  // --- PROMINENT (CANLI VE COŞKULU) ---
  yellow() {
    this.ctx();
    this.rewardChime.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    this.ctx();
    const now = this.t();
    this.rewardChime.triggerAttackRelease("C4", "16n", now);
    this.rewardChime.triggerAttackRelease("G4", "8n", now + 0.1);
  }

  // 🌟 "YAAAY!" ANI (KELİMEYİ BULMA) 🌟
  win() {
    this.ctx();
    const now = this.t();
    this.rewardChime.triggerAttackRelease("C4", "16n", now);
    this.rewardChime.triggerAttackRelease("E4", "16n", now + 0.06);
    this.rewardChime.triggerAttackRelease("G4", "16n", now + 0.12);
    this.rewardChime.triggerAttackRelease("C5", "16n", now + 0.18);
    this.rewardChime.triggerAttackRelease(["E5", "G5", "C6"], "1n", now + 0.25);
  }

  // XP SESLERİ (Tatlı ve Hızlı)
  xp() {
    this.ctx();
    this.bubblyPop.triggerAttackRelease("C5", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.bubblyPop.triggerAttackRelease("E5", "32n", now);
    this.bubblyPop.triggerAttackRelease("G5", "32n", now + 0.08);
    this.bubblyPop.triggerAttackRelease("C6", "32n", now + 0.16);
  }

  // TIME & TENSION
  roundInfo() {
    this.ctx();
    this.deepThud.triggerAttackRelease("C2", "4n", this.t());
  }

  timer10() {
    this.ctx();
    this.dullTap.triggerAttackRelease("C2", "32n", this.t());
  }

  timer3() {
    this.ctx();
    this.deepThud.triggerAttackRelease("C2", "8n", this.t());
  }

  timer0() {
    this.ctx();
    this.bubblyPop.triggerAttackRelease("C6", "16n", this.t());
  }

  lose() {
    this.ctx();
    const now = this.t();
    this.deepThud.triggerAttackRelease("C2", "2n", now);
    this.rewardChime.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n", now + 0.3);
  }

  // POWER-UPS 
  hintWhoosh() {
    this.ctx();
    this.softBreath.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.rewardChime.triggerAttackRelease(["E4", "G4", "C5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.dullTap.triggerAttackRelease("C2", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.deepThud.triggerAttackRelease("C1", "1n", this.t());
    this.softBreath.triggerAttackRelease("2n", this.t());
  }
}

export const HybridToneManager = new HybridToneManagerClass();
