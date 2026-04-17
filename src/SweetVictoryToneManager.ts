import * as Tone from 'tone';

class SweetVictoryToneManagerClass {
  // === BUSSES ===
  // Warm gentle bus for interactions
  private gentleBus = new Tone.Filter(1500, "lowpass").toDestination();
  private gentleGain = new Tone.Volume(-12).connect(this.gentleBus);

  // Sweet lush reverb for success and melodic sparkles
  private sweetReverb = new Tone.Reverb({ decay: 2.0, wet: 0 }).toDestination();
  private sweetDrop = new Tone.PingPongDelay("16n", 0.2).connect(this.sweetReverb);
  private sweetGain = new Tone.Volume(-5).connect(this.sweetDrop);

  // === INSTRUMENTS ===
  
  // Very light, cute bubble pop
  private cutePop = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.1 }
  }).connect(this.gentleGain);

  // Sweet sparkling chime (for the victory fanfare)
  private sparkleChime = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1.0 }
  }).connect(this.sweetGain);

  // Warm melodic bass pad (for the victory undertone)
  private warmBass = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5, modulationIndex: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.1, decay: 0.5, sustain: 0.4, release: 1.0 }
  }).connect(this.gentleBus);

  // Soft swoosh for transitions
  private softSwoosh = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(this.gentleGain);

  public async init() {
    await Tone.start();
    console.log("Tone.js Sweet Victory Mode (OPT 20) Hazır!");
  }

  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // ==========================
  // OYUN STATELERİ
  // ==========================

  type() {
    this.ctx();
    this.cutePop.triggerAttackRelease("C4", "32n", this.t()); 
  }

  delete() {
    this.ctx();
    this.softSwoosh.triggerAttackRelease("32n", this.t()); 
  }

  submit() {
    this.ctx();
    const now = this.t();
    this.softSwoosh.triggerAttackRelease("16n", now);
    this.cutePop.triggerAttackRelease("G3", "16n", now + 0.05);
  }

  gray() {
    this.ctx();
    this.cutePop.triggerAttackRelease("C3", "16n", this.t());
  }

  yellow() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("E4", "8n", this.t()); 
  }

  green() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease("G4", "16n", now);
    this.sparkleChime.triggerAttackRelease("C5", "8n", now + 0.1);
  }

  greenKnown() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("E4", "8n", this.t()); 
  }

  xp() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("E5", "32n", this.t()); 
  }

  xpbar() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease("C5", "16n", now);
    this.sparkleChime.triggerAttackRelease("E5", "16n", now + 0.1);
    this.sparkleChime.triggerAttackRelease("G5", "16n", now + 0.2);
  }

  // 🌟 THE SWEET VICTORY FANFARE (1.5 seconds) 🌟
  win() {
    this.ctx();
    const now = this.t();

    // Warm, hugging bass undertone
    this.warmBass.triggerAttackRelease(["C2", "G2", "E3"], "1n", now);

    // Uplifting, sparkling ascending fanfare with triangle synths
    this.sparkleChime.triggerAttackRelease("C4", "8n", now);
    this.sparkleChime.triggerAttackRelease("E4", "8n", now + 0.15);
    this.sparkleChime.triggerAttackRelease("G4", "8n", now + 0.3);
    this.sparkleChime.triggerAttackRelease("C5", "8n", now + 0.45);
    
    // The final joyful "I solved it!" burst of sparkle
    this.sparkleChime.triggerAttackRelease(["E5", "G5", "C6"], "2n", now + 0.6);
  }

  lose() {
    this.ctx();
    this.warmBass.triggerAttackRelease(["C2", "Eb2", "G2"], "1n", this.t()); 
  }

  timer0() {
    this.ctx();
    const now = this.t();
    this.softSwoosh.triggerAttackRelease("2n", now);
    this.sparkleChime.triggerAttackRelease(["C4", "E4", "A4"], "2n", now + 0.2); 
  }

  timer10() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("G4", "16n", this.t(), 0.2); 
  }

  roundInfo() {
    this.ctx();
    this.warmBass.triggerAttackRelease("C3", "4n", this.t());
  }

  timer3() {
    this.ctx();
    this.sparkleChime.triggerAttackRelease("C5", "16n", this.t());
  }

  powerUpClick() {
    this.ctx();
    this.cutePop.triggerAttackRelease("G2", "16n", this.t()); 
  }

  hintWhoosh() {
    this.ctx();
    this.softSwoosh.triggerAttackRelease("4n", this.t()); 
  }

  hintReveal() {
    this.ctx();
    const now = this.t();
    this.sparkleChime.triggerAttackRelease(["C5", "E5"], "4n", now); 
  }

  bombDrop() {
    this.ctx();
    this.cutePop.triggerAttackRelease("C2", "16n", this.t());
  }

  bombExplode() {
    this.ctx();
    const now = this.t();
    this.warmBass.triggerAttackRelease("C1", "1n", now); 
    this.softSwoosh.triggerAttackRelease("2n", now + 0.05); 
  }
}

export const SweetVictoryToneManager = new SweetVictoryToneManagerClass();
