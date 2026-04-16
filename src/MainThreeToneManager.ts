import * as Tone from 'tone';

class MainThreeToneManagerClass {
  // ==========================================
  // MASTER BUS & GLOBAL EFFECTS
  // ==========================================
  private bgmReverb = new Tone.Reverb({ decay: 2.0, wet: 0.15 }).toDestination();
  private sweetReverb = new Tone.Reverb({ decay: 2.5, wet: 0.35 }).toDestination();
  private subCompressor = new Tone.Compressor(-20, 4).toDestination();

  // Volume channels
  private subtleBus = new Tone.Volume(-15).connect(this.bgmReverb);  // Extremely subtle
  private neutralBus = new Tone.Volume(-8).connect(this.bgmReverb);  // Neutral/gray
  private brightBus = new Tone.Volume(-4).connect(this.sweetReverb); // Green/Success/XP
  private bassBus = new Tone.Volume(2).connect(this.subCompressor);  // Bomb/Impact

  // ==========================================
  // INSTRUMENTS
  // ==========================================
  
  // 1. Subtle UI Clicks (Typing, Gray)
  private tinyClick = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1, oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
  }).connect(this.subtleBus);

  // 2. Soft Whooshes (Delete, Submit, Hints)
  private softWind = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.05, decay: 0.15, sustain: 0 }
  }).connect(this.neutralBus);

  // 3. Melodic Elements (Yellow, Green, XP, Success)
  private sparkleChime = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1.0 }
  }).connect(this.brightBus);

  // 4. Warm Pads (Success background, Errors)
  private warmPad = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5, modulationIndex: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.1, decay: 0.4, sustain: 0.2, release: 1.0 }
  }).connect(this.neutralBus);

  // 5. Deep Impacts (Bomb, Out of Tries, Powerups)
  private deepImpact = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 3, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 1.0 }
  }).connect(this.bassBus);


  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 3 (Ultimate 17-Point Geo Spec) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================================
  // GAME STATES (Exact 17 Specs)
  // ==========================================

  // 2. Letter_Typing: Extremely subtle soft electronic pop
  type() {
    this.ctx();
    this.tinyClick.triggerAttackRelease("C4", "32n", this.t()); 
  }

  // 3. Letter_Deleting: Extremely subtle quick soft whoosh
  delete() {
    this.ctx();
    this.softWind.triggerAttackRelease("32n", this.t()); 
  }

  // 4. Word_Submit: Clean neutral confirmation whoosh + soft tone
  submit() {
    this.ctx();
    const now = this.t();
    this.softWind.triggerAttackRelease("16n", now);
    this.warmPad.triggerAttackRelease("G3", "8n", now + 0.05);
  }

  // 5. Gray_Feedback: Very soft low tone ding or thud
  gray() {
    this.ctx();
    this.tinyClick.triggerAttackRelease("C3", "16n", this.t()); 
  }

  // 6. Yellow_Feedback: Soft ascending chime with light positive energy
  yellow() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease("E4", "16n", now);
    this.sparkleChime.triggerAttackRelease("A4", "8n", now + 0.08);
  }

  // 7. Green_Feedback: Bright melodic chime with sparkle and clear positive reward
  green() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease("C5", "16n", now);
    this.sparkleChime.triggerAttackRelease("E5", "16n", now + 0.05);
    this.sparkleChime.triggerAttackRelease("G5", "8n", now + 0.1);
  }

  // 8. Word_Success: Joyful melodic fanfare, dopamine hit
  win() {
    this.ctx();
    const now = this.t();
    // Warm background glow
    this.warmPad.triggerAttackRelease(["C3", "E3", "G3"], "1n", now);
    // Ascending sparkle 
    this.sparkleChime.triggerAttackRelease("C5", "8n", now);
    this.sparkleChime.triggerAttackRelease("E5", "8n", now + 0.15);
    this.sparkleChime.triggerAttackRelease("G5", "8n", now + 0.3);
    this.sparkleChime.triggerAttackRelease("C6", "8n", now + 0.45);
    // Peak celebration
    this.sparkleChime.triggerAttackRelease(["E6", "G6", "C7"], "2n", now + 0.6); 
  }

  // 9. XP_Add: Prominent cheerful energetic melodic ding
  xp() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("E5", "32n", this.t()); 
  }

  // 10. Timer_To_XP_Conversion: Smooth flowing energy transfer
  xpbar() {
    this.ctx();
    const now = this.t();
    this.softWind.triggerAttackRelease("16n", now);
    this.sparkleChime.triggerAttackRelease("G5", "32n", now + 0.05);
  }

  // 1. Round_Countdown_321: Building tension electronic beeps with rising pitch
  roundInfo() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease("C4", "8n", now);     // 3
    this.sparkleChime.triggerAttackRelease("E4", "8n", now + 1); // 2
    this.sparkleChime.triggerAttackRelease("G4", "8n", now + 2); // 1
  }

  // 11. Round_Countdown_10s_Warning: Subtle calm notification ping
  timer10() {
    this.ctx();
    this.sparkleChime.set({ volume: -15 }); // Quieten for this specific warning
    this.sparkleChime.triggerAttackRelease("A4", "16n", this.t()); 
    setTimeout(() => this.sparkleChime.set({ volume: -4 }), 100);
  }

  timer3() {
    this.ctx(); // Additional tension for last 3 seconds
    this.tinyClick.triggerAttackRelease("C2", "16n", this.t());
  }

  // 14. Round_Ended: Satisfying closing whoosh + gentle completion chime
  timer0() {
    this.ctx();
    const now = this.t();
    this.softWind.triggerAttackRelease("2n", now);
    this.sparkleChime.triggerAttackRelease(["C4", "F4", "A4"], "2n", now + 0.2);
  }

  // 12. Error_Not_Enough_Letters: Soft neutral error tone
  error() {
    this.ctx();
    this.warmPad.triggerAttackRelease(["C3", "Eb3"], "16n", this.t()); 
  }

  // 13. Error_Out_Of_Tries: Gentle low bassy disappointing fade-out
  lose() {
    this.ctx();
    this.deepImpact.triggerAttackRelease("C1", "1n", this.t());
    this.warmPad.triggerAttackRelease(["C2", "Eb2", "Gb2"], "1n", this.t()); 
  }

  // 15. PowerUp_Click: Deep satisfying bassy button press + light burst
  powerUpClick() {
    this.ctx();
    const now = this.t();
    this.deepImpact.triggerAttackRelease("C2", "32n", now);
    this.sparkleChime.triggerAttackRelease("C5", "32n", now + 0.05); 
  }

  // 16. Letter_Hint_Reveal: Soft magical sparkling whoosh + positive chimes
  hintWhoosh() {
    this.ctx();
    this.softWind.triggerAttackRelease("4n", this.t());
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease(["E5", "G5"], "8n", now);
    this.sparkleChime.triggerAttackRelease(["G5", "C6"], "2n", now + 0.1); 
  }

  // 17. Letter_Bomb_Remove: Soft bass-heavy whoosh + clean clearing impact
  bombDrop() {
    this.ctx();
    this.deepImpact.triggerAttackRelease("C1", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.deepImpact.triggerAttackRelease("C0", "2n", now);     // Soft bass-heavy impact
    this.softWind.triggerAttackRelease("1n", now + 0.05);      // Clean sweeping whoosh
  }
}

export const MainThreeToneManager = new MainThreeToneManagerClass();
