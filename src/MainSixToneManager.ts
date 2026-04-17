import * as Tone from 'tone';

class MainSixToneManagerClass {
  // ==========================================
  // MASTER BUS & EFEKTLER (Soft, Sweet Vibe)
  // ==========================================
  private masterReverb = new Tone.Reverb({ decay: 2.2, wet: 0 }).toDestination();
  private masterCompressor = new Tone.Compressor(-15, 3).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // ==========================================
  // ENSTRÜMAN POOL (Casual & Cozy Game Feel)
  // ==========================================

  // 1. Unpitched Soft Pop (Type)
  private tinyPop = new Tone.MembraneSynth({
    pitchDecay: 0.005, octaves: 1.2, oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.06, sustain: 0, release: 0.01 }
  }).connect(new Tone.Volume(-14).connect(this.masterVolume));

  // 2. Unpitched Soft Sweep (Delete, Submit, Gray)
  private softSweep = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(new Tone.Filter(800, "lowpass").connect(new Tone.Volume(-10).connect(this.masterVolume)));

  // 3. Kalimba / Soft Mallet / Bell (Sarı, Yeşil, Success, XP - Çok Tatlı)
  private sweetMallet = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.0,
    modulationIndex: 1.5,
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1.2 },
    modulation: { type: "triangle" },
    modulationEnvelope: { attack: 0.02, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(new Tone.Volume(-4).connect(this.masterVolume));

  // 4. Soft Sine Pad (Chords, Errors, Glows - Sıcak & Yumuşak)
  private warmPad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.3, release: 1.5 }
  }).connect(new Tone.Volume(-6).connect(this.masterVolume));

  // 5. Soft Impact (Bomb, Loses, Kicks - Sarsıntısız organik)
  private softBass = new Tone.MembraneSynth({
    pitchDecay: 0.03, octaves: 2, oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.5 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 6: SOFT SWEET CASUAL (Kalimba & Sine) Yüklendi! 🌸");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ----------------------------------------------------
  // RANDOMİZASYON MOTORU: Tekdüze hissettirmesin
  // ----------------------------------------------------
  private playWithVariation(synth: any, note: string | number, duration: string | number, time: number, velocity = 0.8) {
    const freq = typeof note === 'string' ? Tone.Frequency(note).toFrequency() : note;
    const randPitch = freq * (1 + (Math.random() * 0.04 - 0.02)); 
    synth.triggerAttackRelease(randPitch, duration, time, velocity * (0.9 + Math.random() * 0.2));
  }

  // ==========================================
  // 17 MADDELİK SOUND BIBLE (Kademeli Güzellik)
  // ==========================================

  // 2. Letter_Typing: Notasız, zarif, rahatsız etmeyen tık
  type() {
    this.ctx();
    this.playWithVariation(this.tinyPop, 220, "64n", this.t(), 0.1);
  }

  // 3. Letter_Deleting: Çok soft ve kısa sweep
  delete() {
    this.ctx();
    this.softSweep.triggerAttackRelease("64n", this.t(), 0.1); 
    this.playWithVariation(this.tinyPop, 150, "64n", this.t() + 0.02, 0.1);
  }

  // 4. Word_Submit: Nötr
  submit() {
    this.ctx();
    this.softSweep.triggerAttackRelease("16n", this.t(), 0.5);
    this.playWithVariation(this.tinyPop, 180, "32n", this.t() + 0.05, 0.5);
  }

  // 5. Gray_Feedback: Önemsiz notasız çok soft
  gray() {
    this.ctx();
    this.playWithVariation(this.tinyPop, 130, "16n", this.t(), 0.5);
  }

  // 6. Yellow_Feedback: Bir tık güzel, hafif umutlu (Kalimba)
  yellow() {
    this.ctx();
    const now = this.t();
    this.sweetMallet.triggerAttackRelease("C4", "16n", now, 0.4);
    this.sweetMallet.triggerAttackRelease("E4", "8n", now + 0.1, 0.5);
  }

  // 7. Green_Feedback: Belirgin güzel, çok tatlı melodik (Kalimba Arp)
  green() {
    this.ctx();
    const now = this.t();
    this.sweetMallet.triggerAttackRelease(["C4", "E4", "G4"], "8n", now, 0.6);
    this.sweetMallet.triggerAttackRelease("C5", "4n", now + 0.1, 0.7);
  }

  greenKnown() {
    this.ctx();
    const now = this.t();
    this.sweetMallet.triggerAttackRelease("C4", "16n", now, 0.4);
    this.sweetMallet.triggerAttackRelease("E4", "8n", now + 0.1, 0.5);
  }

  // 8. Word_Success: AŞIRI ÖNEMLİ (Success, Dopamin - Abartısız Tatlı Bell Chord)
  win() {
    this.ctx();
    const now = this.t();

    // Fanfare yok, harika duyulan tatlı major bell akoru
    this.sweetMallet.triggerAttackRelease(["C4", "E4", "G4", "C5"], "2n", now, 0.8);
    
    // Uzayan çok sıcak, sarılan glow pad
    this.warmPad.triggerAttackRelease(["C3", "E3", "G3"], "1m", now + 0.1, 0.5);

    // Kapanışta tatlı minik damla
    setTimeout(() => {
      this.sweetMallet.triggerAttackRelease("E5", "4n", this.t(), 0.5);
    }, 450);
  }

  // 9. XP_Add: Prominent ama önde değil (Tek tatlı nota)
  xp() {
    this.ctx();
    const now = this.t();
    this.sweetMallet.triggerAttackRelease("G4", "8n", now, 0.6);
    this.sweetMallet.triggerAttackRelease("C5", "8n", now + 0.12, 0.6);
  }

  // 10. Timer_To_XP_Conversion: Akıcı sweep + soft kapanış
  xpbar() {
    this.ctx();
    this.softSweep.triggerAttackRelease("32n", this.t(), 0.3);
    this.playWithVariation(this.sweetMallet, "E4", "16n", this.t(), 0.3);
  }

  // 1. Round_Countdown_321: Gergin tık
  roundInfo() {
    this.ctx();
    const now = this.t();
    this.sweetMallet.triggerAttackRelease("C4", "8n", now, 0.5);
    this.sweetMallet.triggerAttackRelease("D4", "8n", now + 1, 0.55);
    this.sweetMallet.triggerAttackRelease("E4", "4n", now + 2, 0.6);
  }

  // 11. 10s Uyarı: Subtle
  timer10() {
    this.ctx();
    this.sweetMallet.triggerAttackRelease("Bb3", "16n", this.t(), 0.4); 
  }

  timer3() {
    this.ctx();
    this.tinyPop.triggerAttackRelease(140, "16n", this.t(), 0.5);
  }

  // 14. Round_Ended: Round bitişi tatlı chord
  timer0() {
    this.ctx();
    this.warmPad.triggerAttackRelease(["C4", "E4", "G4"], "2n", this.t(), 0.5);
  }

  // 12. Error_Not_Enough_Letters: Soft
  error() {
    this.ctx();
    this.warmPad.triggerAttackRelease("Eb3", "8n", this.t(), 0.4);
    this.tinyPop.triggerAttackRelease(180, "16n", this.t(), 0.5);
  }

  // 13. Error_Out_Of_Tries: Soft üzüntü
  lose() {
    this.ctx();
    this.softBass.triggerAttackRelease("C2", "2n", this.t(), 0.6);
    this.warmPad.triggerAttackRelease(["C3", "Eb3", "G3"], "1n", this.t(), 0.5); 
  }

  // 15. PowerUp_Click: Soft Thumb
  powerUpClick() {
    this.ctx();
    this.softBass.triggerAttackRelease("C2", "16n", this.t(), 0.6);
  }

  // 16. Letter_Hint_Reveal: Soft Reveal
  hintWhoosh() {
    this.ctx();
    this.softSweep.triggerAttackRelease("4n", this.t(), 0.4);
  }

  hintReveal() {
    this.ctx();
    this.sweetMallet.triggerAttackRelease(["Eb4", "G4", "Bb4"], "2n", this.t(), 0.6);
  }

  // 17. Letter_Bomb_Remove: Soft Bomb
  bombDrop() {
    this.ctx();
    this.softBass.triggerAttackRelease("C2", "16n", this.t(), 0.6);
  }

  bombExplode() {
    this.ctx();
    this.softBass.triggerAttackRelease("C1", "2n", this.t(), 0.7);  
    this.softSweep.triggerAttackRelease("2n", this.t() + 0.05, 0.6); 
  }
}

export const MainSixToneManager = new MainSixToneManagerClass();
