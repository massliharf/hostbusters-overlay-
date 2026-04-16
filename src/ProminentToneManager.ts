import * as Tone from 'tone';

class ProminentToneManagerClass {
  // 1. MASTER KANAL (Sıkı ve Net)
  private compressor = new Tone.Compressor(-15, 3).toDestination();
  private masterBus = new Tone.Volume(-5).connect(this.compressor);

  // 2. VURUCU (PUNCHY) ENSTRÜMANLAR
  // A) Tıklamalar ve Arayüz (Aşırı kısa, net, odunsu tık)
  private clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 1,
      oscillator: { type: "square" as any }, // Kare dalga daha "dijital ve net" duyulur
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(this.masterBus);

  // B) Coşkulu Bildirimler (Parlak FM Sentezi)
  private bellSynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,
      modulationIndex: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0.1, release: 0.5 }
  }).connect(this.masterBus);

  // C) Ağır Vuruşlar ve Gerilim (Sub-Bass)
  private impactSynth = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(this.masterBus);

  // D) Silme (Keskin Hışırtı)
  private noiseSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0 }
  }).connect(this.masterBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js Prominent Mode (OPT 13) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // 3. STATELERE GÖRE PUNCHY TETİKLEYİCİLER
  // ==========================

  // === 1. ETKİLEŞİM ===
  type() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("C4", "32n", this.t());
  }

  delete() {
    this.ctx();
    this.noiseSynth.triggerAttackRelease("32n", this.t());
  }

  submit() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("G2", "16n", this.t());
  }

  // === 2. HARF GERİ BİLDİRİMLERİ ===
  gray() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("A2", "32n", this.t());
  }

  yellow() {
    this.ctx();
    this.bellSynth.triggerAttackRelease("E4", "16n", this.t());
  }

  green() {
    this.ctx();
    const now = this.t();
    this.bellSynth.triggerAttackRelease("C4", "32n", now);
    this.bellSynth.triggerAttackRelease("G4", "16n", now + 0.08);
  }

  // === 3. ÖDÜL VE BAŞARI ===
  win() {
    this.ctx();
    const now = this.t();
    this.bellSynth.triggerAttackRelease("C4", "16n", now);
    this.bellSynth.triggerAttackRelease("E4", "16n", now + 0.05);
    this.bellSynth.triggerAttackRelease("G4", "16n", now + 0.1);
    this.bellSynth.triggerAttackRelease("C5", "16n", now + 0.15);
    this.bellSynth.triggerAttackRelease(["E5", "G5"], "2n", now + 0.2); 
  }

  xp() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("C6", "32n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.clickSynth.triggerAttackRelease("C5", "32n", now);
    this.clickSynth.triggerAttackRelease("E5", "32n", now + 0.05);
    this.clickSynth.triggerAttackRelease("G5", "32n", now + 0.1);
    this.clickSynth.triggerAttackRelease("C6", "32n", now + 0.15);
  }

  // === 4. SONUÇLAR VE ZAMAN ===
  roundInfo() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C1", "2n", this.t());
  }

  timer10() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("A1", "32n", this.t());
  }

  timer3() {
    this.ctx();
    // Oyun içi son 3 pıtpıttan ilkini simüle ederiz
    this.clickSynth.triggerAttackRelease("C2", "32n", this.t());
  }

  timer0() {
    this.ctx();
    // Round End temiz bitiş akoru
    this.bellSynth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n", this.t());
  }

  lose() {
    this.ctx();
    // Karanlık bass ve dissonant nota
    this.impactSynth.triggerAttackRelease("C2", "2n", this.t());
    this.bellSynth.triggerAttackRelease(["C3", "Db3"], "4n", this.t());
  }

  // POWER-UPS 
  hintWhoosh() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("C5", "32n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.bellSynth.triggerAttackRelease(["G4", "B4", "D5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.clickSynth.triggerAttackRelease("C3", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    this.impactSynth.triggerAttackRelease("C0", "2n", this.t());
    this.noiseSynth.triggerAttackRelease("8n", this.t());
  }
}

export const ProminentToneManager = new ProminentToneManagerClass();
