import * as Tone from 'tone';

class ToneManagerClass {
  private initialized = false;
  
  // Synths
  private uiSynth!: Tone.Synth;
  private chimeSynth!: Tone.PolySynth;
  private bassSynth!: Tone.MembraneSynth;
  private noiseSynth!: Tone.NoiseSynth;
  private filter!: Tone.Filter;
  private clickFilter!: Tone.Filter;

  // Master Gain
  private masterGain!: Tone.Gain;

  public async init() {
    if (this.initialized) return;
    
    await Tone.start();

    this.masterGain = new Tone.Gain(0.8).toDestination();

    // Filters for "muffled" / "soft" sound design
    this.filter = new Tone.Filter(2000, "lowpass").connect(this.masterGain);
    this.clickFilter = new Tone.Filter(8000, "lowpass").connect(this.masterGain);

    // 1. CORE UI SYNTH (Short, muted, non-melodic)
    this.uiSynth = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 }
    }).connect(this.clickFilter);

    // 2. CHIME SYNTH (Harmonic, warm)
    this.chimeSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.5 }
    }).connect(this.filter);

    // 3. MEMBRANE SYNTH (Tension, Sub-bass pulse)
    this.bassSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.5, sustain: 0, release: 0.2 }
    }).connect(this.filter);

    // 4. NOISE SYNTH (Whoosh, sweeps, deletes)
    this.noiseSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
    }).connect(this.filter);
    
    this.initialized = true;
    console.log("Tone.js Initialized!");
  }

  public setVolume(val: number) {
    if(this.masterGain) this.masterGain.gain.rampTo(val, 0.1);
  }

  private t() { return Tone.now(); }

  // ============================================
  // TRIGGERS
  // ============================================

  // 1. Core
  type() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C5", "32n", this.t(), 0.3);
  }
  
  delete() {
    if(!this.initialized) return;
    this.noiseSynth.triggerAttackRelease("16n", this.t(), 0.2);
    this.bassSynth.triggerAttackRelease("C2", "16n", this.t(), 0.1);
  }
  
  submit() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("G2", "8n", this.t(), 0.3);
    this.uiSynth.triggerAttackRelease("C3", "16n", this.t(), 0.4);
  }

  // 2. Feedback
  gray() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C2", "8n", this.t(), 0.4);
  }

  yellow() {
    if(!this.initialized) return;
    const time = this.t();
    this.chimeSynth.triggerAttackRelease("G4", "8n", time, 0.5);
    this.chimeSynth.triggerAttackRelease("B4", "8n", time + 0.05, 0.4);
  }

  green() {
    if(!this.initialized) return;
    const time = this.t();
    this.chimeSynth.triggerAttackRelease(["C5", "E5", "G5"], "8n", time, 0.5);
  }

  // 3. Rewards
  win() {
    if(!this.initialized) return;
    const time = this.t();
    ["C5", "E5", "G5", "C6"].forEach((note, i) => {
      this.chimeSynth.triggerAttackRelease(note, "8n", time + i * 0.06, 0.4);
    });
    this.chimeSynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", time + 0.24, 0.6);
  }

  xp() {
    if(!this.initialized) return;
    const time = this.t();
    this.uiSynth.triggerAttackRelease("E5", "32n", time, 0.2);
    this.uiSynth.triggerAttackRelease("G5", "32n", time + 0.05, 0.2);
    this.uiSynth.triggerAttackRelease("C6", "32n", time + 0.1, 0.2);
  }

  xpbar() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("C6", "32n", this.t(), 0.1);
    this.noiseSynth.triggerAttackRelease("32n", this.t(), 0.05);
  }

  // 4. Time & Tension
  roundInfo() {
    if(!this.initialized) return;
    const time = this.t();
    this.bassSynth.triggerAttackRelease("C1", "2n", time, 0.5);
    this.bassSynth.triggerAttackRelease("C1", "2n", time + 0.2, 0.5);
    this.bassSynth.triggerAttackRelease("C1", "2n", time + 0.4, 0.5);
    this.chimeSynth.triggerAttackRelease("C6", "8n", time + 0.6, 0.3);
  }

  timer10() {
    if(!this.initialized) return;
    const time = this.t();
    this.bassSynth.triggerAttackRelease("C1", "16n", time, 0.4);
    this.bassSynth.triggerAttackRelease("C1", "16n", time + 0.15, 0.3);
  }

  timer3() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "2n", this.t(), 0.6);
  }

  timer0() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "1m", this.t(), 0.8);
    this.chimeSynth.triggerAttackRelease("C6", "8n", this.t(), 0.4);
  }

  lose() {
    if(!this.initialized) return;
    const time = this.t();
    this.uiSynth.triggerAttackRelease("C4", "8n", time, 0.4);
    this.bassSynth.triggerAttackRelease("C2", "2n", time + 0.2, 0.6);
    this.noiseSynth.triggerAttackRelease("4n", time + 0.2, 0.2);
  }

  hintWhoosh() {
    if(!this.initialized) return;
    const time = this.t();
    this.uiSynth.triggerAttackRelease("C5", "16n", time, 0.2);
    this.noiseSynth.triggerAttackRelease("16n", time + 0.05, 0.1);
  }

  hintReveal() {
    if(!this.initialized) return;
    const time = this.t();
    ["C5", "D5", "E5", "G5", "C6"].forEach((note, i) => {
      this.chimeSynth.triggerAttackRelease(note, "16n", time + i * 0.05, 0.3);
    });
  }

  bombDrop() {
    if(!this.initialized) return;
    this.uiSynth.triggerAttackRelease("G4", "16n", this.t(), 0.2);
  }

  bombExplode() {
    if(!this.initialized) return;
    this.bassSynth.triggerAttackRelease("C1", "1m", this.t(), 0.8);
    this.noiseSynth.triggerAttackRelease("2n", this.t(), 0.4);
  }
}

export const ToneManager = new ToneManagerClass();
