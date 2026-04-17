import * as Tone from 'tone';

class ThemeASMRToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 1.0, wet: 0.1 }).toDestination();
  private masterCompressor = new Tone.Compressor(-10, 2).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // ASMR Keyboard switch click
  private cherrySwitch = new Tone.MembraneSynth({
    pitchDecay: 0.005, octaves: 0.1, oscillator: { type: "square" },
    envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.01 }
  }).connect(new Tone.Filter(3000, "highpass").connect(new Tone.Volume(-10).connect(this.masterVolume)));

  // ASMR Paper crumple/eraser
  private paperSweep = new Tone.NoiseSynth({
    noise: { type: "white" }, envelope: { attack: 0.05, decay: 0.1, sustain: 0 }
  }).connect(new Tone.Filter(4000, "highpass").connect(new Tone.Volume(-14).connect(this.masterVolume)));

  // Soft Gong for success (minimal)
  private softGong = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 1.5, sustain: 0.2, release: 3.0 }
  }).connect(new Tone.Volume(-4).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: ASMR TACTILE Loaded 🎧"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  private playWithVariation(synth: any, note: string | number, duration: string | number, time: number, velocity = 0.8) {
    const freq = typeof note === 'string' ? Tone.Frequency(note).toFrequency() : note;
    const randPitch = freq * (1 + (Math.random() * 0.04 - 0.02)); 
    synth.triggerAttackRelease(randPitch, duration, time, velocity * (0.9 + Math.random() * 0.2));
  }

  type() { this.ctx(); this.playWithVariation(this.cherrySwitch, 800, "64n", this.t(), 0.6); } 
  delete() { this.ctx(); this.paperSweep.triggerAttackRelease("16n", this.t(), 0.5); }
  submit() { this.ctx(); this.cherrySwitch.triggerAttackRelease(200, "16n", this.t(), 0.8); }
  gray() { this.ctx(); this.cherrySwitch.triggerAttackRelease(400, "16n", this.t(), 0.5); }
  yellow() { this.ctx(); this.softGong.triggerAttackRelease("E4", "8n", this.t(), 0.5); }
  green() { this.ctx(); this.softGong.triggerAttackRelease("G4", "4n", this.t(), 0.7); }
  win() {
    this.ctx(); const now = this.t();
    this.softGong.triggerAttackRelease(["C4", "G4", "C5"], "1n", now, 1.0);
  }
  xp() { this.ctx(); this.softGong.triggerAttackRelease("C5", "8n", this.t(), 0.6); }
  xpbar() { this.ctx(); this.paperSweep.triggerAttackRelease("32n", this.t(), 0.4); }
  roundInfo() { this.ctx(); const now = this.t(); this.cherrySwitch.triggerAttackRelease(600, "16n", now, 0.6); this.cherrySwitch.triggerAttackRelease(600, "16n", now+1, 0.7); this.cherrySwitch.triggerAttackRelease(800, "8n", now+2, 0.8); }
  timer10() { this.ctx(); this.cherrySwitch.triggerAttackRelease(300, "16n", this.t(), 0.5); }
  timer3() { this.ctx(); this.cherrySwitch.triggerAttackRelease(200, "16n", this.t(), 0.6); }
  timer0() { this.ctx(); this.softGong.triggerAttackRelease(["C3", "G3"], "2n", this.t(), 0.8); }
  error() { this.ctx(); this.paperSweep.triggerAttackRelease("8n", this.t(), 0.6); }
  lose() { this.ctx(); this.softGong.triggerAttackRelease("C2", "1n", this.t(), 0.9); }
  powerUpClick() { this.ctx(); this.cherrySwitch.triggerAttackRelease(150, "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.paperSweep.triggerAttackRelease("2n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.softGong.triggerAttackRelease(["G4", "C5"], "1n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.cherrySwitch.triggerAttackRelease(100, "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.paperSweep.triggerAttackRelease("1n", this.t(), 0.9); }
}
export const ThemeASMRToneManager = new ThemeASMRToneManagerClass();
