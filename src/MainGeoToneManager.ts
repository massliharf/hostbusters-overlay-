import * as Tone from 'tone';

class MainGeoToneManagerClass {
  // ==========================================
  // 1. KANALLAR (SESİN DOKUSUNU BELİRLEYEN YER)
  // ==========================================

  // BOĞUK KANAL (Secondary): Yazma, silme, gri harf gibi yormaması gereken sesler için
  private mutedBus = new Tone.Filter(800, "lowpass").toDestination();

  // CANLI KANAL (Primary): Başarı, power-up, yeşil harf gibi ödül sesleri için
  private brightBus = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();


  // ==========================================
  // 2. ENSTRÜMANLAR (GEO-AESTHETIC)
  // ==========================================

  // Harita Pini / Tok Tıklamalar (Boğuk)
  private pinDrop = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mutedBus);

  // Kağıt Hışırtısı / Silme İşlemi (Boğuk)
  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(this.mutedBus);

  // Pasaport Damgası / Derin Güm (Boğuk)
  private stampThud = new Tone.MembraneSynth({
      pitchDecay: 0.1, octaves: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(this.mutedBus);

  // Pusula Çınlaması / Ödüller (Canlı ve Parlak)
  private compassChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.0, modulationIndex: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
  }).connect(this.brightBus);

  // XP ve Hızlı Baloncuklar (Canlı)
  private popSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.brightBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN GEO Mode (Ana Tema) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================================
  // 3. OYUN STATE TETİKLEYİCİLERİ
  // ==========================================

  // --- A. İKİNCİL (SECONDARY) ETKİLEŞİMLER (Çok Az Belirgin) ---
  type() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C3", "32n", this.t()); // Harf Yazma (Haritaya iğne batırma)
  }

  delete() {
    this.ctx();
    this.paperSwoosh.triggerAttackRelease("16n", this.t()); // Harf Silme (Kağıt kaydırma)
  }

  submit() {
    this.ctx();
    this.stampThud.triggerAttackRelease("G1", "8n", this.t()); // Kelime Submit (Pasaport damgası)
  }
  
  // --- B. RENK GERİ BİLDİRİMLERİ ---
  gray() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("E2", "16n", this.t()); // Gri (Uzak kıta, pes boğuk tık)
  }

  error() {
    this.ctx();
    this.stampThud.triggerAttackRelease("C1", "16n", this.t()); 
  }

  yellow() {
    this.ctx();
    this.compassChime.triggerAttackRelease("E4", "8n", this.t()); // Sarı (Biraz olumlu, tek çınlama)
  }

  green() {
    this.ctx();
    // Yeşil (Olumlu, iki notalı ferah çınlama)
    const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("G4", "8n", now + 0.1);
  }

  // --- C. ÖDÜL VE BAŞARI (Canlı ve Coşkulu) ---
  xp() {
    this.ctx();
    this.popSynth.triggerAttackRelease("C5", "32n", this.t()); // Tekil XP eklenmesi
  }

  xpbar() {
    this.ctx();
    // Süreden XP'ye dönüşüm (Hızla artan tıkırtılar)
    const now = this.t();
    this.popSynth.triggerAttackRelease("E5", "32n", now);
    this.popSynth.triggerAttackRelease("G5", "32n", now + 0.05);
    this.popSynth.triggerAttackRelease("C6", "32n", now + 0.10);
  }

  win() {
    this.ctx();
    // Kelimeyi Bulma (Tam İsabet! Geniş, ferah bir majör akor serisi)
    const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("E4", "16n", now + 0.06);
    this.compassChime.triggerAttackRelease("G4", "16n", now + 0.12);
    this.compassChime.triggerAttackRelease(["C5", "G5"], "1n", now + 0.2); // YAAAAY anı!
  }

  // --- D. ZAMAN, GERİLİM VE SONUÇ ---
  roundInfo() {
    this.ctx();
    // Intro/Tension
    const now = this.t();
    this.stampThud.triggerAttackRelease("C1", "8n", now);     // 3
  }

  timer3() {
    this.ctx();
    // Countdowns mapped mostly into timer3 or handled individually by UI
    this.stampThud.triggerAttackRelease("C1", "8n", this.t()); 
  }

  timer0() {
    this.ctx();
    // Start or End of round exactly
    this.compassChime.triggerAttackRelease("C5", "4n", this.t()); // Başla veya Bitiş
  }

  timer10() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("A1", "32n", this.t()); // 10'da bir bildirim (Hafif nabız atışı)
  }

  lose() {
    this.ctx();
    this.stampThud.triggerAttackRelease("C1", "1n", this.t()); // Hakkı bitme (Kalın, uzun, düşen bass)
  }

  // --- E. POWER-UP'LAR (Özel Efektler) ---
  powerUpClick() {
    this.ctx();
    this.popSynth.triggerAttackRelease("C6", "16n", this.t()); // Tıklama (Parlak pop)
  }

  hintWhoosh() {
    this.ctx();
    this.paperSwoosh.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    // Hint Power-Up (Sihirli, ışıltılı kayma)
    const now = this.t();
    this.compassChime.triggerAttackRelease("C5", "32n", now);
    this.compassChime.triggerAttackRelease("E5", "32n", now + 0.05);
    this.compassChime.triggerAttackRelease("G5", "32n", now + 0.1);
    this.compassChime.triggerAttackRelease("B5", "2n", now + 0.15);
  }

  bombDrop() {
    this.ctx();
    this.stampThud.triggerAttackRelease("C1", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    // Bomb Power-Up (Derin patlama ve toz bulutu)
    const now = this.t();
    this.stampThud.triggerAttackRelease("C0", "2n", now);     // Kulaklıkta titreyen sub-bass
    this.paperSwoosh.triggerAttackRelease("2n", now + 0.05);  // Yıkıntı hışırtısı
  }
}

export const MainGeoToneManager = new MainGeoToneManagerClass();
