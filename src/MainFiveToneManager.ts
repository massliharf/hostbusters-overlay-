import * as Tone from 'tone';

class MainFiveToneManagerClass {
  // ==========================================
  // MASTER BUS & EFEKTLER
  // ==========================================
  private masterReverb = new Tone.Reverb({
    decay: 2.5,
    wet: 0,
    preDelay: 0.02
  }).toDestination();

  private masterDelay = new Tone.FeedbackDelay({
    delayTime: "12n",
    feedback: 0.20,
    wet: 0
  }).connect(this.masterReverb);

  private masterGain = new Tone.Gain(0.90).connect(this.masterDelay);

  // Piano Sampler (Salamander Grand Piano)
  private pianoSampler = new Tone.Sampler({
    urls: {
      "C3": "C3.mp3",
      "Eb3": "Ds3.mp3", // Note: The urls on tonejs salamander repo use Ds3 not Eb3
      "F#3": "Fs3.mp3",
      "A3": "A3.mp3",
      "C4": "C4.mp3",
      "Eb4": "Ds4.mp3",
      "F#4": "Fs4.mp3",
      "A4": "A4.mp3",
      "C5": "C5.mp3",
      "Eb5": "Ds5.mp3",
    },
    release: 1.4,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).connect(this.masterGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 5: PURE PIANO SUCCESS (Salamander Edition) Yüklendi! 🎹");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================================
  // 17 MADDELİK SOUND BIBLE (PURE PIANO)
  // ==========================================

  // 2. Letter_Typing: Very soft frequency-based (unpitched clicky) piano
  type() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(920, 0.07, this.t(), 0.16);
  }

  // 3. Letter_Deleting: Low unpitched piano thump
  delete() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(580, 0.18, this.t(), 0.19);
  }

  // 4. Word_Submit: Neutral
  submit() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("G3", 0.28, this.t(), 0.50);
  }

  // 5. Gray_Feedback: Soft unimportant
  gray() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("C4", 0.32, this.t(), 0.35);
  }

  // 6. Yellow_Feedback: A bit positive
  yellow() {
    this.ctx();
    const now = this.t();
    this.pianoSampler.triggerAttackRelease("E4", 0.40, now, 0.62);
    this.pianoSampler.triggerAttackRelease("G4", 0.45, now + 0.10, 0.55);
  }

  // 7. Green_Feedback: Clearly beautiful
  green() {
    this.ctx();
    const now = this.t();
    this.pianoSampler.triggerAttackRelease(["C4", "E4", "G4"], 0.65, now, 0.78);
  }

  greenKnown() {
    this.ctx();
    const now = this.t();
    this.pianoSampler.triggerAttackRelease("E4", 0.40, now, 0.62);
    this.pianoSampler.triggerAttackRelease("G4", 0.45, now + 0.10, 0.55);
  }

  // 8. Word_Success: The dopamin hit, tasteful and short piano chord
  win() {
    this.ctx();
    const now = this.t();

    // Tatlı, sıcak, abartısız major chord
    this.pianoSampler.triggerAttackRelease(["C4", "E4", "G4"], 0.95, now, 0.82);

    // Yumuşak yüksek kapanış + echo ile uzasın
    this.pianoSampler.triggerAttackRelease("C5", 2.4, now + 0.32, 0.58);

    // Çok hafif ekstra sıcaklık (dopamin için)
    setTimeout(() => {
      this.pianoSampler.triggerAttackRelease("E5", 1.9, this.t(), 0.42);
    }, 420);
  }

  // 9. XP_Add: Prominent but secondary
  xp() {
    this.ctx();
    const now = this.t();
    this.pianoSampler.triggerAttackRelease("A4", 0.25, now, 0.78);
    this.pianoSampler.triggerAttackRelease("C5", 0.55, now + 0.12, 0.68);
  }

  // 10. Timer_To_XP_Conversion: Flow
  xpbar() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("E4", 0.85, this.t(), 0.65);
  }

  // 1. Round_Countdown_321: Building tension
  roundInfo() {
    this.ctx();
    const now = this.t();
    const notes = ["C4", "Eb4", "G4"]; // Yükselen gerilim
    notes.forEach((note, i) => {
      this.pianoSampler.triggerAttackRelease(note, 0.38, now + i * 0.42, 0.82);
    });
  }

  // 11. 10s Uyarı Ping: Subtle
  timer10() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("Bb4", 0.60, this.t(), 0.48); 
  }

  timer3() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("E3", 0.30, this.t(), 0.60);
  }

  // 14. Round_Ended: Round bitişi
  timer0() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(["C4", "E4", "G4"], 0.75, this.t(), 0.65);
  }

  // 12. Error_Not_Enough_Letters: Soft
  error() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("F3", 0.30, this.t(), 0.45);
  }

  // 13. Error_Out_Of_Tries: Soft sorrow
  lose() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(["G3", "Eb3"], 1.5, this.t(), 0.58);
  }

  // 15. PowerUp_Click: Satisfying click
  powerUpClick() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("C3", 0.32, this.t(), 0.88);
  }

  // 16. Letter_Hint_Reveal: Soft reveal
  hintWhoosh() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("Eb4", 0.3, this.t(), 0.4);
  }

  hintReveal() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 1.05, this.t(), 0.70);
  }

  // 17. Letter_Bomb_Remove: Soft sweep
  bombDrop() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease("C3", 0.5, this.t(), 0.8);
  }

  bombExplode() {
    this.ctx();
    this.pianoSampler.triggerAttackRelease(["C3", "Eb3"], 0.52, this.t(), 0.78);
  }
}

export const MainFiveToneManager = new MainFiveToneManagerClass();
