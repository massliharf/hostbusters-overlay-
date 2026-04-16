import * as Tone from 'tone';

class MainTwoToneManagerClass {
  // ==========================================
  // 1. KANALLAR VE MASTER EFEKTLER
  // ==========================================

  // Modern Oyun Şovu Ambiyansı (Yankı ve Derinlik)
  private studioReverb = new Tone.Reverb({ decay: 1.8, wet: 0.25 }).toDestination();
  private studioDelay = new Tone.FeedbackDelay("8n", 0.15).connect(this.studioReverb);
  private melodicBus = new Tone.Volume(-4).connect(this.studioDelay);

  // Tok, Net Arayüz Tıklamaları (Kuru, Yormaz)
  private uiFilter = new Tone.Filter(3000, "lowpass").toDestination();
  private uiBus = new Tone.Volume(-10).connect(this.uiFilter);

  // Ağır Atmosferik Bass (Sub)
  private subCompressor = new Tone.Compressor(-24, 6).toDestination();
  private subBus = new Tone.Volume(2).connect(this.subCompressor);

  // ==========================================
  // 2. ENSTRÜMANLAR (Custom Modern Vibes)
  // ==========================================

  // 1. Arayüz: Cam/Tahta karışımı çok tatlı, kısa tıklamalar (Yazma/Silme)
  private slickClick = new Tone.PluckSynth({
      attackNoise: 2, dampening: 2000, resonance: 0.5,
  }).connect(this.uiBus);

  private reverseWhoosh = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.1, decay: 0.05, sustain: 0 }
  }).connect(this.uiBus);

  // 2. Renk Geribildirimleri: Tok ve Parlak Sentezleyiciler
  // Gri: Sönük, boş odunsu tık
  private hollowThud = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 1, oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
  }).connect(this.uiBus);

  // Sarı, Yeşil, XP: Zengin FM Akorları (Cam/Rhodes Hissiyatı)
  private glassKeys = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5, modulationIndex: 3,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1.2 }
  }).connect(this.melodicBus);

  // 3. Ağır Dramatik Sentez (Submit, Bomba, Zaman)
  private heavyLock = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 1.5 }
  }).connect(this.subBus);

  private tensionPulse = new Tone.Synth({
      oscillator: { type: "pwm", modulationFrequency: 0.2 },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0, release: 0.5 }
  }).connect(this.subBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 2 (Custom Modern Broadcast Tema) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================================
  // 3. OYUN STATELERİ
  // ==========================================

  // --- KLAVYE İŞLEMLERİ ---
  type() {
    this.ctx();
    this.slickClick.triggerAttackRelease("C4", "16n", this.t()); // Pürüzsüz Kalimba Click
  }

  delete() {
    this.ctx();
    this.reverseWhoosh.triggerAttackRelease("32n", this.t()); // Geriye doğu hızlı kayış
  }

  submit() {
    this.ctx();
    // Ağır, stüdyo kapısı gibi "KLAK" diye oturan kilit sesi
    this.heavyLock.triggerAttackRelease("G1", "8n", this.t());
  }

  // --- HARF DÖNÜŞÜMLERİ ---
  gray() {
    this.ctx();
    this.hollowThud.triggerAttackRelease("C2", "16n", this.t()); // Boş
  }

  error() {
    this.ctx();
    // KIsa, rahatsız etmeyen tok bir hata uyarısı
    this.heavyLock.triggerAttackRelease("C1", "32n", this.t()); 
    this.tensionPulse.triggerAttackRelease("C2", "32n", this.t());
  }

  yellow() {
    this.ctx();
    this.glassKeys.triggerAttackRelease(["E4", "B4"], "8n", this.t()); // Umut verici, yarım akor
  }

  green() {
    this.ctx();
    const now = this.t();
    this.glassKeys.triggerAttackRelease(["C4", "G4"], "16n", now);
    this.glassKeys.triggerAttackRelease(["G4", "C5", "E5"], "8n", now + 0.1); // Tam bir başarı, parlak vuruş
  }

  // --- BAŞARILAR VE XP ---
  xp() {
    this.ctx();
    this.glassKeys.triggerAttackRelease("C6", "32n", this.t()); // Jeton sesi gibi çok parlak minik tık
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.glassKeys.triggerAttackRelease("E5", "32n", now);
    this.glassKeys.triggerAttackRelease("F5", "32n", now + 0.05);
    this.glassKeys.triggerAttackRelease("G5", "32n", now + 0.1);
    this.glassKeys.triggerAttackRelease("C6", "16n", now + 0.15); // Suyun bardağa dolması gibi
  }

  win() {
    this.ctx();
    const now = this.t();
    // İnanılmaz ferah, yükselen ve kalbi ısıtan majör arpej
    this.heavyLock.triggerAttackRelease("C1", "2n", now); // Derin yatak
    this.glassKeys.triggerAttackRelease(["C4", "E4"], "16n", now);
    this.glassKeys.triggerAttackRelease(["E4", "G4"], "16n", now + 0.12);
    this.glassKeys.triggerAttackRelease(["G4", "B4"], "16n", now + 0.24);
    this.glassKeys.triggerAttackRelease(["C5", "E5", "G5", "C6"], "1n", now + 0.36); // Zirveyi buluş
  }

  // --- ZAMANLAYICI VE ROUND OLAYLARI ---
  roundInfo() {
    this.ctx();
    this.heavyLock.triggerAttackRelease("E1", "4n", this.t()); // Gergin açılış gümlemesi
  }

  timer10() {
    this.ctx();
    this.tensionPulse.triggerAttackRelease("A2", "16n", this.t(), 0.5); // Gergin kalp atışı
  }

  timer3() {
    this.ctx();
    this.heavyLock.triggerAttackRelease("C2", "8n", this.t()); // Acil kalın ritim
  }

  timer0() {
    this.ctx();
    this.glassKeys.triggerAttackRelease(["F3", "A3", "C4"], "4n", this.t()); // Stüdyo Süre Bitti zili
  }

  lose() {
    this.ctx();
    const now = this.t();
    // Hakkın bitişi: Dissonant, sönen kalın akor ve çakılma
    this.heavyLock.triggerAttackRelease("C0", "1n", now);
    this.glassKeys.triggerAttackRelease(["C3", "Eb3", "Gb3"], "1n", now + 0.1); 
  }

  // --- POWER-UPS ---
  powerUpClick() {
    this.ctx();
    this.slickClick.triggerAttackRelease("C3", "16n", this.t()); 
    this.glassKeys.triggerAttackRelease("C5", "32n", this.t());
  }

  hintWhoosh() {
    this.ctx();
    this.reverseWhoosh.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.glassKeys.triggerAttackRelease(["C5", "E5", "G5"], "4n", now); // Sihirli peri tozu
  }

  bombDrop() {
    this.ctx();
    this.heavyLock.triggerAttackRelease("C1", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.heavyLock.triggerAttackRelease("G0", "1n", now);     // Sarsıcı sub-bass
    this.reverseWhoosh.triggerAttackRelease("1n", now + 0.05); // Kirli süpürülme efekti
  }
}

export const MainTwoToneManager = new MainTwoToneManagerClass();
