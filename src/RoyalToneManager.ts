import * as Tone from 'tone';

class RoyalToneManagerClass {
  // 1. TAHT ODASI AKUSTİĞİ (Geniş Yankı ve Filtre)
  private castleReverb = new Tone.Reverb({ decay: 3, wet: 0.35 }).toDestination();
  private masterBus = new Tone.Volume(-6).connect(this.castleReverb);

  // 2. KRALİYET ENSTRÜMANLARI
  // A) Saray Arpı / Lavta (Harf yazma için)
  private harpSynth = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.8
  }).connect(this.masterBus);

  // B) Altın/Gümüş Sikkeler ve Çanlar (Renk bildirimleri için)
  private treasuryBells = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.2, // Metalik çınlama tınısı
      modulationIndex: 3,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.4 }
  }).connect(this.masterBus);

  // C) Savaş Davulları / Kale Kapısı (Submit ve Geri Sayım için)
  private timpaniDrum = new Tone.MembraneSynth({
      pitchDecay: 0.1,
      octaves: 3,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.8, sustain: 0.1, release: 1.5 }
  }).connect(this.masterBus);

  // D) Kılıç / Büyü Rüzgarı (Silme ve efektler için)
  private swordNoise = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(this.masterBus);

  // E) Kraliyet Fanfarı (Zafer ve Başarı için Trompet hissiyatı)
  private brassFanfare = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" }, // Parlak, pirinç üflemeli tınısı
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 1 }
  }).connect(this.masterBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Royal Mode (OPT 12) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // 3. TETİKLEYİCİLER
  // ==========================

  // KLAVYE: Arp telleri ve Kılıç
  type() {
    this.ctx();
    this.harpSynth.triggerAttack("C4", this.t());
  }

  delete() {
    this.ctx();
    this.swordNoise.triggerAttackRelease("16n", this.t());
  }

  submit() {
    this.ctx();
    this.timpaniDrum.triggerAttackRelease("G1", "4n", this.t());
  }

  // HAZİNE (Renkler): Sikkeler ve Çanlar
  gray() {
    this.ctx();
    this.harpSynth.triggerAttack("A2", this.t());
  }

  yellow() {
    this.ctx();
    this.treasuryBells.triggerAttackRelease("E5", "8n", this.t());
  }

  green() {
    this.ctx();
    this.treasuryBells.triggerAttackRelease(["G5", "B5"], "8n", this.t());
  }

  greenKnown() {
    this.ctx();
    this.treasuryBells.triggerAttackRelease("E5", "8n", this.t());
  }

  // ZAFER VE XP
  win() {
    this.ctx();
    const now = this.t();
    // Normalleştirilmiş temiz ve tatlı başarı sesi
    this.brassFanfare.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n", now);
    this.treasuryBells.triggerAttackRelease(["C5", "E5", "G5"], "1n", now);
  }

  xp() {
    this.ctx();
    this.harpSynth.triggerAttack("C6", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.harpSynth.triggerAttack("C5", now);
    this.harpSynth.triggerAttack("E5", now + 0.05);
    this.harpSynth.triggerAttack("G5", now + 0.1);
  }

  // TIME & TENSION
  roundInfo() {
    this.ctx();
    this.timpaniDrum.triggerAttackRelease("C1", "2n", this.t());
  }

  timer10() {
    this.ctx();
    this.timpaniDrum.triggerAttackRelease("C2", "16n", this.t());
  }

  timer3() {
    this.ctx();
    this.timpaniDrum.triggerAttackRelease("G1", "4n", this.t());
  }

  timer0() {
    this.ctx();
    this.treasuryBells.triggerAttackRelease("C6", "16n", this.t());
  }

  lose() {
    this.ctx();
    const now = this.t();
    this.timpaniDrum.triggerAttackRelease("C1", "1n", now);
    this.brassFanfare.triggerAttackRelease(["A3", "C4", "D4"], "1n", now + 0.2);
  }

  // POWER-UPS
  hintWhoosh() {
    this.ctx();
    this.swordNoise.triggerAttackRelease("16n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.treasuryBells.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.harpSynth.triggerAttack("C3", this.t());
  }

  bombExplode() {
    this.ctx();
    this.timpaniDrum.triggerAttackRelease("C0", "1n", this.t());
    this.swordNoise.triggerAttackRelease("2n", this.t());
  }
}

export const RoyalToneManager = new RoyalToneManagerClass();
