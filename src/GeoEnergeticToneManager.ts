import * as Tone from 'tone';

class GeoEnergeticToneManagerClass {
  // === KANALLAR ===
  // Çok düşük, sessiz ve boğuk arka plan işlemleri (Harf yazma, silme)
  private mutedBus = new Tone.Filter(600, "lowpass").toDestination();
  private mutedGain = new Tone.Volume(-12).connect(this.mutedBus);

  // Enerjik ve melodik işlemler (Yeşil harf, XP, Kazanma)
  private brightBus = new Tone.Reverb({ decay: 2.0, wet: 0.25 }).toDestination();
  private brightDelay = new Tone.FeedbackDelay("8n", 0.2).connect(this.brightBus);
  private brightGain = new Tone.Volume(-4).connect(this.brightDelay);

  // Derin basslar ve oyunun gidişatı (Submit, Bomba, Zamanlayıcı)
  private bassBus = new Tone.Filter(200, "lowpass").toDestination();
  private bassGain = new Tone.Volume(-2).connect(this.bassBus);

  // === ENSTRÜMANLAR ===

  // 1. SECONDARY (Çok az belirgin, rahatsız etmez)
  private softMembrane = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(this.mutedGain);

  private softNoise = new Tone.NoiseSynth({
      noise: { type: "brown" }, // Brown noise pink'e göre daha boğuk ve rahattır
      envelope: { attack: 0.05, decay: 0.1, sustain: 0 }
  }).connect(this.mutedGain);

  // 2. ENERGETIC & MELODIC
  private melodicSynth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2.0, modulationIndex: 5,
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.8 }
  }).connect(this.brightGain);

  private brightTap = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.brightGain);

  // 3. BASSLI VE TOK (Geoguessr Pin & Atmosferik Vuruş)
  private heavySub = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 4, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.6, sustain: 0, release: 1.5 }
  }).connect(this.bassGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Geo v2 Energetic Mode (OPT 17) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // OYUN STATELERİ
  // ==========================

  // 1. İKİNCİL İŞLEMLER (Harf yazma/silme)
  type() {
    this.ctx();
    this.softMembrane.triggerAttackRelease("C2", "32n", this.t()); // Çook hafif "tık"
  }

  delete() {
    this.ctx();
    this.softNoise.triggerAttackRelease("32n", this.t()); // Hafif fırça/rüzgar sesi
  }

  // 2. OYUN GİDİŞATI
  submit() {
    this.ctx();
    // Ağır, basslı mekanik kilit vurusu (Geoguessr ağır pin hissiyatı)
    this.heavySub.triggerAttackRelease("C1", "8n", this.t()); 
  }

  // 3. HARF RENKLERİ (Melodik)
  gray() {
    this.ctx();
    this.softMembrane.triggerAttackRelease("G1", "16n", this.t()); // Pes, sönük tık
  }

  yellow() {
    this.ctx();
    this.melodicSynth.triggerAttackRelease("E4", "8n", this.t()); // İyimser, umutlu çınlama
  }

  green() {
    this.ctx();
    // Tam isabet! Enerjik Majör geçiş.
    const now = this.t();
    this.melodicSynth.triggerAttackRelease("C4", "16n", now);
    this.melodicSynth.triggerAttackRelease("G4", "8n", now + 0.1);
  }

  // 4. MÜKEMMEL SONUÇ VE XP (Enerjetik)
  win() {
    this.ctx();
    const now = this.t();
    // Kelimenin tamamı bulunduğunda büyük melodik patlama
    this.melodicSynth.triggerAttackRelease(["C4", "E4", "G4"], "8n", now);
    this.melodicSynth.triggerAttackRelease(["F4", "A4", "C5"], "8n", now + 0.15);
    this.melodicSynth.triggerAttackRelease(["G4", "B4", "D5"], "8n", now + 0.3);
    this.melodicSynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", now + 0.45);
  }

  xp() {
    this.ctx();
    // Animasyonu izlerken damlayan neşeli "Pop" sesleri
    this.brightTap.triggerAttackRelease("C5", "64n", this.t());
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.brightTap.triggerAttackRelease("E5", "64n", now);
    this.brightTap.triggerAttackRelease("F5", "64n", now + 0.05);
    this.brightTap.triggerAttackRelease("G5", "64n", now + 0.10);
    this.brightTap.triggerAttackRelease("C6", "32n", now + 0.15);
  }

  // 5. ZAMAN VE ROUND (Ağır Bass ve Gerilim)
  roundInfo() {
    this.ctx();
    this.heavySub.triggerAttackRelease("G0", "4n", this.t()); // Round başlarken sinematik nefes/bass
  }

  timer10() {
    this.ctx();
    // Sessiz bir kalp atışı hissi
    this.softMembrane.triggerAttackRelease("C1", "32n", this.t()); 
  }

  timer3() {
    this.ctx();
    // Son 3 saniye giderek vuran tok basslar
    this.heavySub.triggerAttackRelease("C1", "8n", this.t());
  }

  timer0() {
    this.ctx();
    // Süre bitimi net ve temiz sinyal
    this.melodicSynth.triggerAttackRelease("C5", "16n", this.t()); 
  }

  lose() {
    this.ctx();
    // Out of tries: Gergin, düşen karanlık akor ve bass
    const now = this.t();
    this.heavySub.triggerAttackRelease("C1", "2n", now); 
    this.melodicSynth.triggerAttackRelease(["A3", "C4", "Eb4"], "1n", now + 0.2); // Minör, dissonant kapanış
  }

  // 6. POWER-UPS 
  hintWhoosh() {
    this.ctx();
    this.softNoise.triggerAttackRelease("8n", this.t());
  }

  hintReveal() {
    this.ctx();
    this.melodicSynth.triggerAttackRelease(["E4", "G4", "C5"], "4n", this.t());
  }

  bombDrop() {
    this.ctx();
    this.softMembrane.triggerAttackRelease("G1", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    // Basslı patlama ve gürültü
    this.heavySub.triggerAttackRelease("C0", "1n", now);
    this.softNoise.triggerAttackRelease("2n", now + 0.1);
  }
}

export const GeoEnergeticToneManager = new GeoEnergeticToneManagerClass();
