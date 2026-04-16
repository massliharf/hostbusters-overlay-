import * as Tone from 'tone';

class MainThreeToneManagerClass {
  // ==========================================
  // MASTER BUS & GLOBAL EFFECTS
  // ==========================================
  private masterGain = new Tone.Volume(-2).toDestination(); 
  private reverb = new Tone.Reverb({ decay: 1.8, wet: 0.22 }).connect(this.masterGain);
  private compressor = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.003, release: 0.15 }).connect(this.reverb);

  // ==========================================
  // SYNTH INSTANCES
  // ==========================================
  
  // 1. Countdown
  private countdownSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.15, sustain: 0.0, release: 0.08 }
  }).connect(this.compressor);
  private countdownKick = new Tone.MembraneSynth({ octaves: 3 }).connect(this.compressor);

  // 2. Typing
  private typingSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 }
  }).connect(this.masterGain);

  // 3. Deleting
  private deleteSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.08 }
  }).connect(this.masterGain);

  // 4. Submit
  private submitSynth = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
  }).connect(this.compressor);

  // 5. Gray
  private graySynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.25, sustain: 0, release: 0.4 }
  }).connect(this.masterGain);

  // 6. Yellow
  private yellowSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.35 }
  }).connect(this.compressor);

  // 7. Green & Sparkles
  private greenSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.008, decay: 0.25, sustain: 0.15, release: 0.6 }
  }).connect(this.compressor);
  private greenSparkle = new Tone.NoiseSynth({ 
    noise: { type: "pink" }, envelope: { attack: 0.001, decay: 0.18 } 
  }).connect(new Tone.Filter(6200, "highpass").connect(this.compressor));

  // 8. Success Fanfare
  private successSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsawtooth", count: 3 } as any, // Type cast to bypass strict ts checking for FatOscillator
    envelope: { attack: 0.02, decay: 0.35, sustain: 0.25, release: 1.2 }
  }).connect(this.compressor);
  private successGlowSynth = new Tone.Synth({ oscillator: { type: "sine" } })
    .connect(new Tone.Reverb({ decay: 3, wet: 0.45 }).connect(this.masterGain));

  // 9. XP Add
  private xpSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.28, sustain: 0.2, release: 0.65 }
  }).connect(this.compressor);

  // 10. Timer to XP
  private timerSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.4, decay: 0.6, sustain: 0.3, release: 0.8 }
  }).connect(this.compressor);

  // 11. 10s Warning
  private warningSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.4, sustain: 0, release: 0.6 }
  }).connect(this.masterGain);

  // 12. Error Not Enough
  private errorSynth = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.35 }
  }).connect(this.masterGain);

  // 13. Error Out of Tries
  private outOfTriesSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.8, sustain: 0.1, release: 1.1 }
  }).connect(this.compressor);

  // 14. Round End
  private roundEndSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.03, decay: 0.5, sustain: 0.15, release: 1.5 }
  }).connect(this.reverb);

  // 15. Power Up Click
  private powerClickSynth = new Tone.MembraneSynth({ octaves: 4 }).connect(this.compressor);
  private powerClickTone = new Tone.Synth({ oscillator: { type: "square" } }).connect(this.compressor);

  // 16. Hint Reveal
  private hintSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "fatsine", count: 3 } as any,
    envelope: { attack: 0.15, decay: 0.4, sustain: 0.2, release: 1.1 }
  }).connect(this.reverb);

  // 17. Bomb Remove
  private bombMembrane = new Tone.MembraneSynth({ octaves: 3 }).connect(this.compressor);
  private bombSweep = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 }
  }).connect(new Tone.Filter(1800, "lowpass").connect(this.compressor));


  public async init() {
    await Tone.start();
    console.log("Tone.js MAIN 3 (GPT Spec SoundManager) Yüklendi!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  private playWithVariation(synth: any, note: string | number, duration: string | number, time: number, velocity = 0.8) {
    const freq = typeof note === 'string' ? Tone.Frequency(note).toFrequency() : note;
    const randPitch = freq * (1 + (Math.random() * 0.08 - 0.04)); 
    synth.triggerAttackRelease(randPitch, duration, time, velocity * (0.95 + Math.random() * 0.1));
  }

  // ==========================================
  // API METHODS
  // ==========================================

  // 1.
  roundInfo() {
    this.ctx();
    const now = this.t();
    ["C4", "Eb4", "G4"].forEach((note, i) => {
      const time = now + i * 0.45;
      this.countdownSynth.triggerAttackRelease(note, 0.35, time, 0.75);
      this.countdownKick.triggerAttackRelease("C2", 0.12, time, 0.6);
    });
  }

  // 2.
  type() {
    this.ctx();
    const freq = 680 + Math.random() * 120;
    this.typingSynth.triggerAttackRelease(freq, 0.07, this.t(), 0.22); 
  }

  // 3.
  delete() {
    this.ctx();
    this.deleteSynth.triggerAttackRelease(420, 0.18, this.t(), 0.18);
  }

  // 4.
  submit() {
    this.ctx();
    const now = this.t();
    this.submitSynth.triggerAttackRelease("G3", 0.25, now, 0.55);
    this.submitSynth.triggerAttackRelease("Bb3", 0.4, now + 0.08, 0.4);
  }

  // 5.
  gray() {
    this.ctx();
    this.graySynth.triggerAttackRelease(280, 0.45, this.t(), 0.35);
  }

  // 6.
  yellow() {
    this.ctx();
    const now = this.t();
    this.yellowSynth.triggerAttackRelease("E4", 0.25, now, 0.65);
    this.yellowSynth.triggerAttackRelease("G4", 0.4, now + 0.12, 0.5);
  }

  // 7.
  green() {
    this.ctx();
    const now = this.t();
    this.greenSynth.triggerAttackRelease(["C4", "E4", "G4"], 0.35, now, 0.72);
    this.greenSparkle.triggerAttackRelease("8n", now + 0.15, 0.25);
  }

  // 8.
  win() {
    this.ctx();
    const now = this.t();
    const melody = ["C4", "E4", "G4", "C5", "E5"];
    melody.forEach((note, i) => {
      this.successSynth.triggerAttackRelease(note, i < 3 ? 0.45 : 0.8, now + i * 0.09, 0.78 - i*0.05);
    });
    setTimeout(() => {
      this.ctx();
      this.successGlowSynth.triggerAttackRelease("G5", 1.8, this.t(), 0.35);
    }, 650);
  }

  // 9.
  xp() {
    this.ctx();
    const now = this.t();
    this.xpSynth.triggerAttackRelease("A4", 0.22, now, 0.8);
    this.xpSynth.triggerAttackRelease("C5", 0.55, now + 0.11, 0.65);
  }

  // 10.
  xpbar() {
    this.ctx();
    const now = this.t();
    this.timerSynth.triggerAttack("E3", now, 0.6);
    this.timerSynth.frequency.rampTo("G4" as any, 0.65, now);
    this.timerSynth.triggerRelease(now + 0.75);
  }

  // 11.
  timer10() {
    this.ctx();
    this.warningSynth.triggerAttackRelease("Bb4", 0.65, this.t(), 0.48);
  }

  timer3() {
    this.ctx();
    // Additional tension for last 3 seconds
    this.countdownKick.triggerAttackRelease("C1", 0.12, this.t(), 0.6);
  }

  // 14.
  timer0() {
    this.ctx();
    this.roundEndSynth.triggerAttackRelease(["C4", "E4", "G4"], 0.8, this.t(), 0.6);
  }

  // 12.
  error() {
    this.ctx();
    this.errorSynth.triggerAttackRelease("F3", 0.28, this.t(), 0.42);
  }

  // 13.
  lose() {
    this.ctx();
    this.outOfTriesSynth.triggerAttackRelease(["G3", "Eb3"], 1.4, this.t(), 0.55);
  }

  // 15.
  powerUpClick() {
    this.ctx();
    const now = this.t();
    this.powerClickSynth.triggerAttackRelease("C2", 0.25, now, 0.85);
    this.powerClickTone.triggerAttackRelease("G4", 0.12, now + 0.05, 0.6);
  }

  // 16.
  hintWhoosh() {
    this.ctx();
    // Soft wind before reveal
    this.deleteSynth.triggerAttackRelease(200, 0.2, this.t(), 0.2);
  }

  hintReveal() {
    this.ctx();
    this.hintSynth.triggerAttackRelease(["Eb4", "G4", "Bb4"], 0.9, this.t(), 0.68);
  }

  // 17.
  bombDrop() {
    this.ctx();
    // Small drop thud
    this.powerClickSynth.triggerAttackRelease("G1", 0.1, this.t(), 0.5);
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.bombMembrane.triggerAttackRelease("C1", 0.45, now, 0.9);
    this.bombSweep.triggerAttackRelease("G4", 0.55, now + 0.08, 0.65);
  }
}

export const MainThreeToneManager = new MainThreeToneManagerClass();
