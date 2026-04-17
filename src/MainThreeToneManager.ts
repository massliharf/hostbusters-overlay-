import * as Tone from 'tone';

class MainThreeToneManagerClass {
  // ==========================================
  // MASTER BUS & AKUSTİK MİMARİ (Sound Bible)
  // ==========================================
  private masterChannel = new Tone.Channel({ volume: -4 }).toDestination();
  private bgmReverb = new Tone.Reverb({ decay: 2.5, wet: 0.2 }).connect(this.masterChannel);
  private subCompressor = new Tone.Compressor({ threshold: -20, ratio: 4 }).connect(this.masterChannel);

  // Frekans Ayrışması (Frequency Separation)
  // Maskelemeyi önlemek için kritik seviyelendirme
  private subtleLowBus = new Tone.Filter(600, "lowpass").connect(new Tone.Volume(-15).connect(this.masterChannel)); 
  private neutralMidBus = new Tone.Filter(2000, "lowpass").connect(new Tone.Volume(-8).connect(this.masterChannel));
  private brightHighBus = new Tone.Volume(-3).connect(this.bgmReverb); 
  private bassImpactBus = new Tone.Filter(300, "lowpass").connect(new Tone.Volume(2).connect(this.subCompressor));

  // ==========================================
  // ENSTRÜMAN POOL (Performans & Non-repetitive)
  // ==========================================
  
  // 1. Ultra-Subtle Typing/Deleting (Sine/Square Pop)
  private tinyPop = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1.5, oscillator: { type: "square" },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.01 }
  }).connect(this.subtleLowBus);

  // 2. Whoosh / Rüzgar & Sweep Efektleri
  private sweepNoise = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0 }
  }).connect(this.neutralMidBus);

  private sparkleNoise = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0 }
  }).connect(new Tone.Filter(8000, "highpass").connect(this.brightHighBus));

  // 3. Bright Melodic Chimes (Sarı, Yeşil, XP, Win)
  private crystalChime = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" }, // Temiz kristal ton
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1.5 }
  }).connect(this.brightHighBus);

  // 4. Kalp Isıtan Fanfare & Warm Tones
  private warmGlowPad = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5, modulationIndex: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.2, decay: 0.5, sustain: 0.3, release: 2.0 }
  }).connect(this.bgmReverb);

  // 5. Tension & Deep Bass
  private subKick = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(this.bassImpactBus);

  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 3: LIVE STREAM DEEP DIVE (Psychoacoustic Edition) Yüklendi! 🔥");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ----------------------------------------------------
  // RANDOMİZASYON MOTORU: Her tık farklı hissettirsin
  // ----------------------------------------------------
  private playWithVariation(synth: any, note: string | number, duration: string | number, time: number, velocity = 0.8) {
    const freq = typeof note === 'string' ? Tone.Frequency(note).toFrequency() : note;
    const randPitch = freq * (1 + (Math.random() * 0.04 - 0.02)); // ±%2 pitch oynaması
    synth.triggerAttackRelease(randPitch, duration, time, velocity * (0.9 + Math.random() * 0.2));
  }

  // ==========================================
  // 17 MADDELİK SOUND BIBLE UYGULAMASI
  // ==========================================

  // 2. Letter_Typing: Non-repetitive soft variations
  type() {
    this.ctx();
    const baseFreqs = [200, 220, 250, 280]; // Klavye harfleri gibi farklı notalar
    const randomFreq = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
    this.playWithVariation(this.tinyPop, randomFreq, "32n", this.t(), 0.6);
  }

  // 3. Letter_Deleting: Ters whoosh + çok düşük pop
  delete() {
    this.ctx();
    const now = this.t();
    this.sweepNoise.triggerAttackRelease("32n", now, 0.4); 
    this.playWithVariation(this.tinyPop, 150, "32n", now + 0.02, 0.5);
  }

  // 4. Word_Submit: Neutral but confirmed
  submit() {
    this.ctx();
    const now = this.t();
    this.sweepNoise.triggerAttackRelease("16n", now, 0.5);
    this.crystalChime.triggerAttackRelease("E3", "16n", now + 0.05, 0.3); // Tok tık
  }

  // 5. Gray_Feedback: Neredeyse önemsiz
  gray() {
    this.ctx();
    this.playWithVariation(this.tinyPop, 120, "16n", this.t(), 0.6);
  }

  // 6. Yellow_Feedback: Ascent (Umut verici)
  yellow() {
    this.ctx();
    const now = this.t();
    this.crystalChime.triggerAttackRelease("C4", "16n", now, 0.4);
    this.crystalChime.triggerAttackRelease("E4", "8n", now + 0.08, 0.5);
  }

  // 7. Green_Feedback: 3 Notalık mini arpeggio + Sparkle. Dopamin Peak.
  green() {
    this.ctx();
    const now = this.t();
    this.crystalChime.triggerAttackRelease("C5", "16n", now, 0.6);
    this.crystalChime.triggerAttackRelease("E5", "16n", now + 0.05, 0.7);
    this.crystalChime.triggerAttackRelease("G5", "8n", now + 0.1, 0.8);
    this.sparkleNoise.triggerAttackRelease("16n", now, 0.3);
  }

  greenKnown() {
    this.ctx();
    const now = this.t();
    this.crystalChime.triggerAttackRelease("C4", "16n", now, 0.4);
    this.crystalChime.triggerAttackRelease("E4", "8n", now + 0.08, 0.5);
  }

  // 8. Word_Success: Fanfare ve Lingering Glow
  win() {
    this.ctx();
    const now = this.t();
    // 0.0s: Warm Sparkle
    this.sparkleNoise.triggerAttackRelease("4n", now, 0.5);
    // 0.2s: Ascending Sweet Fanfare
    const fanfareTimer = now + 0.2;
    this.crystalChime.triggerAttackRelease("C4", "8n", fanfareTimer, 0.6);
    this.crystalChime.triggerAttackRelease("E4", "8n", fanfareTimer + 0.1, 0.7);
    this.crystalChime.triggerAttackRelease("G4", "8n", fanfareTimer + 0.2, 0.8);
    this.crystalChime.triggerAttackRelease("C5", "8n", fanfareTimer + 0.3, 0.9);
    this.crystalChime.triggerAttackRelease(["E5", "G5", "C6"], "1n", fanfareTimer + 0.45, 1.0);
    // 0.8s: Övgü dolu kalıcı sıcak eko
    this.warmGlowPad.triggerAttackRelease(["C3", "E3", "G3"], "1n", now + 0.5, 0.4);
  }

  // 9. XP_Add: Coin-like Melodic
  xp() {
    this.ctx();
    const now = this.t();
    this.playWithVariation(this.crystalChime, "A5", "16n", now, 0.5);
    this.playWithVariation(this.crystalChime, "E6", "8n", now + 0.06, 0.5);
  }

  // 10. Timer_To_XP_Conversion: Rising filter + Chime
  xpbar() {
    this.ctx();
    const now = this.t();
    this.sweepNoise.triggerAttackRelease("32n", now, 0.3);
    this.playWithVariation(this.crystalChime, 1200, "32n", now + 0.02, 0.3); // Hızlı tıkırtılar
  }

  // 1. Round_Countdown_321: Gergin ama temiz progress
  roundInfo() {
    this.ctx();
    const now = this.t();
    // 3
    this.subKick.triggerAttackRelease("C2", "16n", now);
    this.crystalChime.triggerAttackRelease("C4", "8n", now, 0.6);
    // 2
    this.subKick.triggerAttackRelease("C2", "16n", now + 1);
    this.crystalChime.triggerAttackRelease("E4", "8n", now + 1, 0.7);
    // 1
    this.subKick.triggerAttackRelease("C2", "16n", now + 2);
    this.crystalChime.triggerAttackRelease("G4", "8n", now + 2, 0.8);
    this.sparkleNoise.triggerAttackRelease("16n", now + 2, 0.4);
  }

  // 11. 10s Uyarı Ping: Non-intrusive
  timer10() {
    this.ctx();
    this.crystalChime.triggerAttackRelease("A4", "16n", this.t(), 0.3); 
  }

  // Sona doğru artan timer
  timer3() {
    this.ctx();
    this.subKick.triggerAttackRelease("E1", "16n", this.t(), 0.6);
  }

  // 14. Round_Ended: Closing whoosh + completion 
  timer0() {
    this.ctx();
    const now = this.t();
    this.sweepNoise.triggerAttackRelease("2n", now, 0.5);
    this.warmGlowPad.triggerAttackRelease(["C4", "G4", "C5"], "2n", now + 0.2, 0.6);
  }

  // 12. Error_Not_Enough_Letters: Soft boing error
  error() {
    this.ctx();
    // Hafif boing hissi için hızlı envelope drop
    this.warmGlowPad.triggerAttackRelease(["Eb3"], "16n", this.t(), 0.5); 
    this.tinyPop.triggerAttackRelease("G2", "16n", this.t(), 0.6);
  }

  // 13. Error_Out_Of_Tries: Low minor chord fade
  lose() {
    this.ctx();
    this.subKick.triggerAttackRelease("C1", "1n", this.t(), 0.8);
    this.warmGlowPad.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t(), 0.6); 
  }

  // 15. PowerUp_Click: Deep thumb + burst
  powerUpClick() {
    this.ctx();
    const now = this.t();
    this.subKick.triggerAttackRelease("C2", "16n", now, 0.8);
    this.sparkleNoise.triggerAttackRelease("16n", now + 0.02, 0.3);
  }

  // 16. Letter_Hint_Reveal: Magic Sparkle whoosh + melodic
  hintWhoosh() {
    this.ctx();
    this.sweepNoise.triggerAttackRelease("4n", this.t(), 0.4);
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.sparkleNoise.triggerAttackRelease("8n", now, 0.4);
    this.crystalChime.triggerAttackRelease(["C5", "E5"], "16n", now, 0.6);
    this.crystalChime.triggerAttackRelease(["E5", "G5"], "8n", now + 0.1, 0.7);
  }

  // 17. Letter_Bomb_Remove: Bass-heavy clean impact
  bombDrop() {
    this.ctx();
    this.subKick.triggerAttackRelease("C1", "16n", this.t(), 0.8);
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.subKick.triggerAttackRelease("C0", "2n", now, 1.0);  
    this.sweepNoise.triggerAttackRelease("1n", now + 0.05, 0.8); 
  }
}

export const MainThreeToneManager = new MainThreeToneManagerClass();
