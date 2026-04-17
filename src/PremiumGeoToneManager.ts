import * as Tone from 'tone';

class PremiumGeoToneManagerClass {
  // === BUSSES & PREMIUM EFFECTS ===
  // Ultra-smooth subtle bus for typing, avoiding all high-peak fatigue
  private smoothFilter = new Tone.Filter(800, "lowpass").toDestination();
  private smoothGain = new Tone.Volume(-14).connect(this.smoothFilter);

  // Magic exploration bus (Wide, lush Reverb + Chorus)
  private lushChorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
  private magicReverb = new Tone.Reverb({ decay: 3.5, wet: 0.35 }).connect(this.lushChorus);
  private magicGain = new Tone.Volume(-4).connect(this.magicReverb);

  // Deep Premium Impact Bus
  private deepComp = new Tone.Compressor(-20, 4).toDestination();
  private impactFilter = new Tone.Filter(200, "lowpass").connect(this.deepComp);
  private impactGain = new Tone.Volume(2).connect(this.impactFilter);

  // Soft Whoosh Bus (For UI transitions)
  private whooshFilter = new Tone.Filter({ type: "bandpass", Q: 1, frequency: 2000 }).toDestination();
  private whooshGain = new Tone.Volume(-10).connect(this.whooshFilter);

  // === INSTRUMENTS ===

  // 1. Soft bubble pop for typing (very minimal)
  private bubblePop = new Tone.MembraneSynth({
      pitchDecay: 0.005, octaves: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.002, decay: 0.03, sustain: 0, release: 0.01 }
  }).connect(this.smoothGain);

  // 2. Premium Air Whoosh for deletes & gentle transitions
  private premiumAir = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.06, decay: 0.15, sustain: 0 }
  }).connect(this.whooshGain);

  // 3. Luxurious Harmonic Chimes for positive outcomes (Rewards, XP, Green)
  private luxChime = new Tone.PolySynth(Tone.AMSynth, {
      harmonicity: 2.5,
      oscillator: { type: "sine" },
      modulation: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0.1, release: 1.5 }
  }).connect(this.magicGain);

  // 4. Clean Bell for Notifications (10s, Yellow, Small dings)
  private neatBell = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 }
  }).connect(this.magicGain);

  // 5. Huge satisfying cinematic bass (Bomb, Submit, Fail)
  private cinematicSub = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 5, oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 1.0, sustain: 0, release: 1.5 }
  }).connect(this.impactGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Premium Geo Mode (OPT 19) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // OYUN STATELERİ
  // ==========================

  // 1. Letter_Typing
  type() {
    this.ctx();
    this.bubblePop.triggerAttackRelease("G3", "32n", this.t()); // Yumuşak ve tatlı tık
  }

  // 2. Letter_Deleting
  delete() {
    this.ctx();
    this.premiumAir.triggerAttackRelease("32n", this.t()); // Havalı ultra sessiz silme
  }

  // 3. Word_Submit
  submit() {
    this.ctx();
    const now = this.t();
    this.premiumAir.triggerAttackRelease("16n", now);
    this.cinematicSub.triggerAttackRelease("C2", "8n", now + 0.05); // premium, tok, temiz
  }

  // 4. Gray_Feedback
  gray() {
    this.ctx();
    this.bubblePop.triggerAttackRelease("C2", "16n", this.t()); // tamamen sönük ve hissiz
  }

  // 5. Yellow_Feedback
  yellow() {
    this.ctx();
    const now = this.t();
    this.luxChime.triggerAttackRelease("C4", "8n", now);
    this.neatBell.triggerAttackRelease("E4", "16n", now + 0.1); 
  }

  // 6. Green_Feedback
  green() {
    this.ctx();
    const now = this.t();
    this.luxChime.triggerAttackRelease("G4", "16n", now);
    this.luxChime.triggerAttackRelease("C5", "8n", now + 0.1);
    this.neatBell.triggerAttackRelease("G5", "16n", now + 0.2); // extra sparkle
  }

  greenKnown() {
    this.ctx();
    const now = this.t();
    this.luxChime.triggerAttackRelease("C4", "8n", now);
    this.neatBell.triggerAttackRelease("E4", "16n", now + 0.1); 
  }

  // 7. XP_Add
  xp() {
    this.ctx();
    this.neatBell.triggerAttackRelease("E5", "32n", this.t()); // altın gibi neşeli ding
  }

  // 8. Timer_To_XP
  xpbar() {
    this.ctx();
    const now = this.t();
    this.premiumAir.triggerAttackRelease("8n", now); // smooth flowing energy
    this.luxChime.triggerAttackRelease("C6", "16n", now + 0.15); // şahane kapanış
  }

  // 9. Word_Success (Triumphant)
  win() {
    this.ctx();
    const now = this.t();
    this.cinematicSub.triggerAttackRelease("C1", "1n", now); // Warm bass
    this.luxChime.triggerAttackRelease(["E4", "G4", "C5"], "8n", now);
    this.luxChime.triggerAttackRelease(["G4", "C5", "E5"], "8n", now + 0.2);
    this.luxChime.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", now + 0.4);
  }

  // 10. Out_Of_Tries
  lose() {
    this.ctx();
    this.cinematicSub.triggerAttackRelease("E0", "1n", this.t()); // very low slow sub drop
  }

  // 11. Round_End
  timer0() {
    this.ctx();
    const now = this.t();
    this.premiumAir.triggerAttackRelease("2n", now);
    this.luxChime.triggerAttackRelease(["A3", "C4", "E4"], "2n", now + 0.2); // satisfying closure
  }

  // 12. Round_Countdown_10s
  timer10() {
    this.ctx();
    this.neatBell.triggerAttackRelease("C4", "16n", this.t(), 0.3); // calm notification
  }

  // 13. Round_Countdown_321
  roundInfo() {
    this.ctx();
    this.cinematicSub.triggerAttackRelease("G1", "4n", this.t()); // deep tension builder
  }

  timer3() {
    this.ctx();
    // mapped to the last 3-2-1
    this.neatBell.triggerAttackRelease("G4", "16n", this.t());
  }

  // 14. PowerUp_Click
  powerUpClick() {
    this.ctx();
    const now = this.t();
    this.cinematicSub.triggerAttackRelease("C1", "16n", now); // satisfying Deep button press
    this.luxChime.triggerAttackRelease("C4", "32n", now + 0.05); // light energy
  }

  // 15. Hint_Reveal
  hintWhoosh() {
    this.ctx();
    this.premiumAir.triggerAttackRelease("4n", this.t()); 
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.luxChime.triggerAttackRelease(["C5", "E5", "G5"], "4n", now); // magical discovery
    this.neatBell.triggerAttackRelease("E6", "8n", now + 0.1); // sparkling finish
  }

  // 16. Bomb_Remove
  bombDrop() {
    this.ctx();
    this.powerUpClick();
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.cinematicSub.triggerAttackRelease("C0", "1n", now); // ultra heavy bass clearing
    this.premiumAir.triggerAttackRelease("2n", now + 0.05); // clean clearing impact
  }
}

export const PremiumGeoToneManager = new PremiumGeoToneManagerClass();
