import * as Tone from 'tone';

class GeoToneManagerClass {
  // === KANALLAR ===
  // Harita etkileşimleri için boğuk/dokusal kanal (Kulağı yormaz)
  private mapBus = new Tone.Filter(800, "lowpass").toDestination();
  // Puan ve keşif başarıları için geniş, parlak ve yankılı kanal (Ferah hissettirir)
  private exploreBus = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();

  // === ENSTRÜMANLAR ===
  // Pin bırakma ve damga vurma (Tok ve kısa)
  private pinDrop = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.mapBus);

  // Harita hışırtısı (Kağıt dokusu)
  private paperSwoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(this.mapBus);

  // Puan sayacı ve çınlamalar (Pusula/Mekanik saat hissi)
  private compassChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.0, modulationIndex: 2,
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.5 }
  }).connect(this.exploreBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Geo Mode (OPT 16) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // OYUN STATELERİ
  // ==========================

  // 1. HARİTA (KLAVYE) ETKİLEŞİMLERİ 
  type() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C3", "32n", this.t()); // Haritaya pin saplama
  }

  delete() {
    this.ctx();
    this.paperSwoosh.triggerAttackRelease("16n", this.t()); // Haritayı kaydırma/Pini alma
  }

  submit() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("G1", "8n", this.t()); // Pasaport damgası gibi ağır "GÜM"
  }

  // 2. TAHMİN SONUÇLARI (RENKLER)
  gray() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("E2", "16n", this.t()); // Uzak kıta (Kötü tahmin, pes tık)
  }

  yellow() {
    this.ctx();
    this.compassChime.triggerAttackRelease("E4", "8n", this.t()); // Yakın tahmin (Tekli sıcak çınlama)
  }

  green() {
    this.ctx();
    const now = this.t();
    this.compassChime.triggerAttackRelease("C4", "16n", now);
    this.compassChime.triggerAttackRelease("G4", "8n", now + 0.1);
  }

  // 3. MÜKEMMEL SONUÇ VE PUANLAR
  win() {
    this.ctx();
    // Tam isabet! Geniş, keşif hissiyatlı, ferah bir majör akor
    const now = this.t();
    this.compassChime.triggerAttackRelease(["C4", "G4", "E5"], "2n", now);
    this.compassChime.triggerAttackRelease(["G4", "C5", "G5"], "1n", now + 0.15); // Arkasından gelen yankılı patlama
  }

  xp() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C5", "64n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.pinDrop.triggerAttackRelease("C5", "64n", now);
    this.pinDrop.triggerAttackRelease("D5", "64n", now + 0.05);
    this.pinDrop.triggerAttackRelease("E5", "64n", now + 0.10);
    this.pinDrop.triggerAttackRelease("G5", "64n", now + 0.15);
  }

  // 4. ZAMAN & ROUND
  roundInfo() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C2", "4n", this.t());
  }

  timer10() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C2", "32n", this.t()); // Son 10 saniye kalp atışı
  }

  timer3() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("C2", "8n", this.t());
  }

  timer0() {
    this.ctx();
    this.compassChime.triggerAttackRelease(["A3", "C4", "E4"], "2n", this.t()); // Round bitti (hafif melankolik)
  }

  lose() {
    this.ctx();
    const now = this.t();
    this.pinDrop.triggerAttackRelease("E2", "2n", now); 
    this.compassChime.triggerAttackRelease(["A3", "C4", "E4"], "2n", now + 0.3);
  }

  // POWER-UPS 
  hintWhoosh() {
    this.ctx();
    this.paperSwoosh.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.compassChime.triggerAttackRelease(["G4", "E5"], "2n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.pinDrop.triggerAttackRelease("A1", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.pinDrop.triggerAttackRelease("G1", "1n", now);
    this.paperSwoosh.triggerAttackRelease("2n", now + 0.1);
  }
}

export const GeoToneManager = new GeoToneManagerClass();
