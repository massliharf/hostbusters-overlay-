import * as Tone from 'tone';

class PerfectGeoToneManagerClass {
  // === BUSSES & EFFECTS ===
  // Ultra subtle bus for frequent UI
  private subtleBus = new Tone.Filter(1000, "lowpass").toDestination();
  private subtleGain = new Tone.Volume(-15).connect(this.subtleBus);

  // Bright magic bus for positive outcomes
  private sparkleReverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
  private sparkleGain = new Tone.Volume(-4).connect(this.sparkleReverb);

  // Deep impact bus
  private impactFilter = new Tone.Filter(300, "lowpass").toDestination();
  private impactGain = new Tone.Volume(0).connect(this.impactFilter);

  // Whoosh bus
  private whooshFilter = new Tone.Filter({ type: "bandpass", Q: 2, frequency: 1500 }).toDestination();
  private whooshGain = new Tone.Volume(-8).connect(this.whooshFilter);

  // === INSTRUMENTS ===

  // 1 & 2. Letter_Typing & Gray_Feedback
  private softPop = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1.5, oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0, release: 0.01 }
  }).connect(this.subtleGain);

  // 2. Letter_Deleting
  private quietWhoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0 }
  }).connect(this.subtleGain);

  // 3 & 11 & 15. Clean Whooshes
  private cleanWhoosh = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0 }
  }).connect(this.whooshGain);

  // 4 & 10 & 14 & 16. Bass Impacts
  private deepImpact = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 4, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.8, sustain: 0, release: 1.0 }
  }).connect(this.impactGain);

  // 5 & 6 & 7 & 9. Melodic Chimes & Sparkles
  private magicChime = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.0, modulationIndex: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1.2 }
  }).connect(this.sparkleGain);

  private brightDing = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 }
  }).connect(this.sparkleGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Perfect Geo Mode (OPT 18) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // OYUN STATELERİ
  // ==========================

  // 1. Letter_Typing (very subtle soft electronic pop/click)
  type() {
    this.ctx();
    this.softPop.triggerAttackRelease("C4", "32n", this.t());
  }

  // 2. Letter_Deleting (very subtle quick backspace whoosh)
  delete() {
    this.ctx();
    this.quietWhoosh.triggerAttackRelease("32n", this.t());
  }

  // 3. Word_Submit (clean neutral confirmation whoosh + soft electronic tone)
  submit() {
    this.ctx();
    const now = this.t();
    this.cleanWhoosh.triggerAttackRelease("16n", now);
    this.softPop.triggerAttackRelease("C3", "8n", now + 0.05);
  }

  // 4. Gray_Feedback (soft, neutral, low-tone muted thud/ding)
  gray() {
    this.ctx();
    this.softPop.triggerAttackRelease("G2", "16n", this.t());
  }

  // 5. Yellow_Feedback (slightly positive, soft ascending chime)
  yellow() {
    this.ctx();
    const now = this.t();
    this.magicChime.triggerAttackRelease("C4", "16n", now);
    this.magicChime.triggerAttackRelease("E4", "8n", now + 0.08);
  }

  // 6. Green_Feedback (bright uplifting melodic chime with sparkle)
  green() {
    this.ctx();
    const now = this.t();
    this.magicChime.triggerAttackRelease("G4", "16n", now);
    this.magicChime.triggerAttackRelease("C5", "16n", now + 0.08);
    this.brightDing.triggerAttackRelease("E5", "8n", now + 0.16);
  }

  // 7. XP_Add (cheerful energetic melodic ding, coin-like)
  xp() {
    this.ctx();
    this.brightDing.triggerAttackRelease("C6", "32n", this.t());
  }

  // 8. Timer_To_XP_Conversion (smooth energy transfer whoosh ending with positive chime)
  xpbar() {
    this.ctx();
    const now = this.t();
    this.cleanWhoosh.triggerAttackRelease("8n", now);
    this.brightDing.triggerAttackRelease("G5", "32n", now + 0.1);
    this.brightDing.triggerAttackRelease("C6", "16n", now + 0.18);
  }

  // 9. Word_Success (triumphant short melodic victory fanfare, chimes + warm bass)
  win() {
    this.ctx();
    const now = this.t();
    this.deepImpact.triggerAttackRelease("C2", "2n", now); // warm bass undertone
    this.magicChime.triggerAttackRelease(["C4", "G4", "C5"], "8n", now);
    this.magicChime.triggerAttackRelease(["E4", "C5", "E5"], "8n", now + 0.15);
    this.magicChime.triggerAttackRelease(["G4", "E5", "G5", "C6"], "2n", now + 0.3);
  }

  // 10. Out_Of_Tries (gentle disappointing low bassy fade-out)
  lose() {
    this.ctx();
    this.deepImpact.triggerAttackRelease("E1", "1n", this.t());
  }

  // 11. Round_End (satisfying closing whoosh + gentle chime)
  timer0() {
    this.ctx();
    const now = this.t();
    this.cleanWhoosh.triggerAttackRelease("4n", now);
    this.magicChime.triggerAttackRelease(["F3", "A3", "C4"], "2n", now + 0.2);
  }

  // 12. Round_Countdown_10s_Notification (subtle soft ping/bell)
  timer10() {
    this.ctx();
    this.brightDing.triggerAttackRelease("G4", "16n", this.t(), 0.3); // sessiz ping
  }

  // 13. Round_Countdown_321 (rising pitch, energetic and exciting)
  roundInfo() {
    this.ctx();
    this.deepImpact.triggerAttackRelease("G1", "4n", this.t());
  }

  timer3() {
    this.ctx();
    // 3, 2, 1 rise - assuming called sequentially somehow or triggered. We will just play 1 beep here since SFX.timer3 mapped.
    this.brightDing.triggerAttackRelease("C5", "16n", this.t());
  }

  // 14. PowerUp_Click (satisfying deep bassy button press + light energy burst)
  powerUpClick() {
    this.ctx();
    const now = this.t();
    this.deepImpact.triggerAttackRelease("C2", "16n", now);
    this.brightDing.triggerAttackRelease("C4", "32n", now + 0.05);
  }

  // 15. Hint_PowerUp_Reveal (magical sparkling whoosh + positive chimes)
  hintWhoosh() {
    this.ctx();
    this.cleanWhoosh.triggerAttackRelease("4n", this.t());
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.magicChime.triggerAttackRelease(["C5", "E5", "G5"], "4n", now);
    this.brightDing.triggerAttackRelease("C6", "16n", now + 0.1);
  }

  // 16. Bomb_PowerUp_Remove (clean bass-heavy explosion whoosh + letter clearing)
  bombDrop() {
    this.ctx();
    this.powerUpClick();
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.deepImpact.triggerAttackRelease("C1", "1n", now); // heavy bass explosion
    this.cleanWhoosh.triggerAttackRelease("2n", now + 0.05); // letter clearing whoosh
  }
}

export const PerfectGeoToneManager = new PerfectGeoToneManagerClass();
