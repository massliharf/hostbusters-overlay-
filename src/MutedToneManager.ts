import * as Tone from 'tone';

class MutedToneManagerClass {
  // === 1. KADİFE FİLTRE VE YANKI (Sırrımız Burada) ===
  // 1200Hz üstü frekansları kesiyoruz. Bu sese o "boğuk/muted" ve tatlı hissiyatı verir.
  private softFilter = new Tone.Filter(1200, "lowpass").toDestination();

  // Çok hafif, sıcak bir oda yankısı. Sesin kuru (dry) kalmasını engeller, "güzel" yapar.
  private warmRoom = new Tone.Reverb({ decay: 1.5, wet: 0.15 }).connect(this.softFilter);
  private masterBus = new Tone.Volume(-2).connect(this.warmRoom);

  // === 2. YUMUŞAK ENSTRÜMANLAR ===

  // A) Kitap Tıklaması (Harf yazma için - asla 'bip' yapmaz)
  private softTap = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 1,
      oscillator: { type: "sine" }, // Sadece yumuşak sinüs
      envelope: { attack: 0.02, decay: 0.08, sustain: 0, release: 0.1 } // attack: 0.02 "tık" sesini yokedip yumuşatır
  }).connect(this.masterBus);

  // B) Muted Rhodes Piyano (Renkler ve Başarı için - Zil/Bell DEĞİL)
  private mutedKeys = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.04, decay: 0.4, sustain: 0.1, release: 1 } // Yumuşacık girer ve kaybolur
  }).connect(this.masterBus);

  // C) Nefes / Yumuşak Fırça (Silme için)
  private softBreath = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0, release: 0.1 }
  }).connect(this.masterBus);

  // D) Derin, Uzak Kalp Atışı (Submit ve Geri Sayım için)
  private subThud = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.4, sustain: 0, release: 1 }
  }).connect(this.masterBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Muted Mode (OPT 14) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // 3. STATELERE GÖRE PUNCHY TETİKLEYİCİLER
  // ==========================

  // === 1. ETKİLEŞİM ===
  type() {
    this.ctx();
    this.softTap.triggerAttackRelease("C3", "32n", this.t());
  }

  delete() {
    this.ctx();
    this.softBreath.triggerAttackRelease("16n", this.t());
  }

  submit() {
    this.ctx();
    this.subThud.triggerAttackRelease("G2", "8n", this.t());
  }

  // === 2. HARF GERİ BİLDİRİMLERİ ===
  gray() {
    this.ctx();
    this.softTap.triggerAttackRelease("G2", "32n", this.t());
  }

  yellow() {
    this.ctx();
    this.mutedKeys.triggerAttackRelease("E4", "8n", this.t());
  }

  green() {
    this.ctx();
    const now = this.t();
    this.mutedKeys.triggerAttackRelease("C4", "8n", now);
    this.mutedKeys.triggerAttackRelease("E4", "8n", now + 0.1);
  }

  // === 3. ÖDÜL VE BAŞARI ===
  win() {
    this.ctx();
    const now = this.t();
    this.mutedKeys.triggerAttackRelease("C4", "2n", now);
    this.mutedKeys.triggerAttackRelease("E4", "2n", now + 0.05);
    this.mutedKeys.triggerAttackRelease("G4", "2n", now + 0.1);
    this.mutedKeys.triggerAttackRelease("B4", "2n", now + 0.15); // B4 notası sesi "şık" yapar
  }

  xp() {
    this.ctx();
    this.softTap.triggerAttackRelease("C5", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.softTap.triggerAttackRelease("C4", "32n", now);
    this.softTap.triggerAttackRelease("E4", "32n", now + 0.08);
    this.softTap.triggerAttackRelease("G4", "32n", now + 0.16);
  }

  // === 4. SONUÇLAR VE ZAMAN ===
  roundInfo() {
    this.ctx();
    const now = this.t();
    this.subThud.triggerAttackRelease("C2", "8n", now);
  }

  timer10() {
    this.ctx();
    this.softTap.triggerAttackRelease("C2", "32n", this.t());
  }

  timer3() {
    this.ctx();
    this.subThud.triggerAttackRelease("C2", "8n", this.t());
  }

  timer0() {
    this.ctx();
    this.mutedKeys.triggerAttackRelease("C5", "4n", this.t());
  }

  lose() {
    this.ctx();
    this.subThud.triggerAttackRelease("C2", "2n", this.t());
  }

  // POWER-UPS 
  hintWhoosh() {
    this.ctx();
    this.softBreath.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.mutedKeys.triggerAttackRelease(["E4", "G4", "B4"], "2n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.softTap.triggerAttackRelease("C2", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.subThud.triggerAttackRelease("C1", "1n", this.t());
    this.softBreath.triggerAttackRelease("2n", this.t());
  }
}

export const MutedToneManager = new MutedToneManagerClass();
