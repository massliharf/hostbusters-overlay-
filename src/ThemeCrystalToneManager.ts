import * as Tone from 'tone';

class ThemeCrystalToneManagerClass {
  private masterReverb = new Tone.Reverb({ decay: 3.5, wet: 0.4 }).toDestination();
  private masterCompressor = new Tone.Compressor(-20, 4).connect(this.masterReverb);
  private masterVolume = new Tone.Volume(-2).connect(this.masterCompressor);

  // Soft unpitched crystal clink (Typing)
  private crystalClink = new Tone.MembraneSynth({
    pitchDecay: 0.01, octaves: 1, oscillator: { type: "triangle" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(new Tone.Filter(3000, "highpass").connect(new Tone.Volume(-10).connect(this.masterVolume)));

  private glassSwoosh = new Tone.NoiseSynth({
    noise: { type: "white" }, envelope: { attack: 0.05, decay: 0.2, sustain: 0 }
  }).connect(new Tone.Filter(6000, "highpass").connect(new Tone.Volume(-14).connect(this.masterVolume)));

  // Crystal singing bowl / bells
  private crystalBell = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.5, sustain: 0.2, release: 2.0 }
  }).connect(new Tone.Volume(-2).connect(this.masterVolume));

  private deepResonance = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.8, sustain: 0.4, release: 3.0 }
  }).connect(new Tone.Volume(2).connect(this.masterVolume));

  public async init() { await Tone.start(); console.log("Theme: GLASS & CRYSTAL Loaded 💎"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  type() { this.ctx(); this.crystalClink.triggerAttackRelease(3000, "32n", this.t(), 0.4); }
  delete() { this.ctx(); this.glassSwoosh.triggerAttackRelease("32n", this.t(), 0.3); }
  submit() { this.ctx(); this.glassSwoosh.triggerAttackRelease("16n", this.t(), 0.5); }
  gray() { this.ctx(); this.crystalClink.triggerAttackRelease(2000, "16n", this.t(), 0.3); }
  yellow() { this.ctx(); this.crystalBell.triggerAttackRelease("E5", "16n", this.t(), 0.5); this.crystalBell.triggerAttackRelease("A5", "8n", this.t() + 0.1, 0.6); }
  green() { this.ctx(); this.crystalBell.triggerAttackRelease(["C5", "E5", "A5"], "8n", this.t(), 0.7); this.crystalBell.triggerAttackRelease("C6", "4n", this.t() + 0.12, 0.8); }
  win() {
    this.ctx(); const now = this.t();
    this.crystalBell.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n", now, 1.0);
    this.deepResonance.triggerAttackRelease(["C4", "G4"], "1n", now + 0.1, 0.6);
  }
  xp() { this.ctx(); this.crystalBell.triggerAttackRelease("C6", "8n", this.t(), 0.6); this.crystalBell.triggerAttackRelease("E6", "8n", this.t() + 0.1, 0.7); }
  xpbar() { this.ctx(); this.glassSwoosh.triggerAttackRelease("32n", this.t(), 0.2); this.crystalBell.triggerAttackRelease("G5", "16n", this.t(), 0.3); }
  roundInfo() { this.ctx(); const now = this.t(); this.crystalBell.triggerAttackRelease("C5", "8n", now, 0.5); this.crystalBell.triggerAttackRelease("D5", "8n", now+1, 0.6); this.crystalBell.triggerAttackRelease("E5", "4n", now+2, 0.7); }
  timer10() { this.ctx(); this.crystalBell.triggerAttackRelease("A4", "16n", this.t(), 0.4); }
  timer3() { this.ctx(); this.crystalClink.triggerAttackRelease(1500, "16n", this.t(), 0.5); }
  timer0() { this.ctx(); this.crystalBell.triggerAttackRelease(["C4", "C5", "E5"], "2n", this.t(), 0.6); }
  error() { this.ctx(); this.crystalBell.triggerAttackRelease("Eb4", "8n", this.t(), 0.4); }
  lose() { this.ctx(); this.deepResonance.triggerAttackRelease(["C3", "Eb3", "G3"], "1n", this.t(), 0.7); }
  powerUpClick() { this.ctx(); this.deepResonance.triggerAttackRelease("C3", "16n", this.t(), 0.8); }
  hintWhoosh() { this.ctx(); this.glassSwoosh.triggerAttackRelease("4n", this.t(), 0.5); }
  hintReveal() { this.ctx(); this.crystalBell.triggerAttackRelease(["E5", "G5", "B5"], "2n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.deepResonance.triggerAttackRelease("C3", "16n", this.t(), 0.6); }
  bombExplode() { this.ctx(); this.deepResonance.triggerAttackRelease("C2", "2n", this.t(), 0.9); this.glassSwoosh.triggerAttackRelease("1n", this.t()+0.05, 0.8); }
}
export const ThemeCrystalToneManager = new ThemeCrystalToneManagerClass();
