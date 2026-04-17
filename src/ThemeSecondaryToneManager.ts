import * as Tone from 'tone';

class ThemeSecondaryToneManagerClass {
  // ORGANIC & SOFT THEME BUS
  // We want a very natural, wooden, non-synthetic feel with minimal reverb.
  private appBus = new Tone.Reverb({ decay: 1.2, wet: 0.1 }).toDestination();
  private masterCompressor = new Tone.Compressor({ threshold: -24, ratio: 4 }).connect(this.appBus);

  // INSTRUMENTS
  // 1. Bamboo / Soft Wood (Membrane)
  private bamboo = new Tone.MembraneSynth({
      pitchDecay: 0.01, octaves: 1.5, oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.masterCompressor);

  // 2. Kalimba / Wooden Keys (FMSynth)
  private kalimba = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.2, modulationIndex: 1.2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.005, decay: 0.3, sustain: 0.0, release: 0.3 },
      modulation: { type: "triangle" },
      modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(this.masterCompressor);

  // 3. Acoustic Pluck (String/Tight Wood)
  private pluck = new Tone.PluckSynth({
      attackNoise: 1, dampening: 4000, resonance: 0.7
  }).connect(this.masterCompressor);

  // 4. Paper / Soft Ticks (Noise)
  private paper = new Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0 }
  });
  private paperFilter = new Tone.Filter(800, "lowpass").connect(this.masterCompressor);

  // 5. Deep Heartbeat (For Tension)
  private heartbeat = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 1.2, oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
  });
  private heartbeatFilter = new Tone.Filter(300, "lowpass").connect(this.masterCompressor);

  // 6. Deep Wood Bowl Gong
  private bowl = new Tone.FMSynth({
      harmonicity: 1.5, modulationIndex: 0.5,
      envelope: { attack: 0.05, decay: 1.5, sustain: 0, release: 1 },
      modulationEnvelope: { attack: 0.1, decay: 1, sustain: 0, release: 1 }
  }).connect(this.masterCompressor);

  constructor() {
      this.paper.connect(this.paperFilter);
      this.heartbeat.connect(this.heartbeatFilter);
  }

  public async init() { await Tone.start(); console.log("Theme: SECONDARY (Organic/Soft) Loaded 🪵"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // 1. Geri Sayım İlk (3, 2, 1, Başla)
  roundInfo() { 
      this.ctx(); 
      this.bamboo.triggerAttackRelease("C4", "8n", this.t()); 
  }
  
  // 2. Harf Yazma
  type() { this.ctx(); this.paper.triggerAttackRelease("32n", this.t(), 0.1); }
  
  // 3. Harf Silme
  delete() { this.ctx(); this.bamboo.triggerAttackRelease("E2", "16n", this.t(), 0.1); }
  
  // 4. Kelime Submit Etme
  submit() { this.ctx(); this.bamboo.triggerAttackRelease("E3", "16n", this.t()); this.bamboo.triggerAttackRelease("A3", "16n", this.t() + 0.08); }
  
  // 5. Gri Harf
  gray() { this.ctx(); this.pluck.triggerAttackRelease("A1", this.t()); }
  
  // 6. Sarı Harf
  yellow() { this.ctx(); this.kalimba.triggerAttackRelease("G4", "8n", this.t(), 0.4); }
  
  // 7. Yeşil Harf
  green() { this.ctx(); this.kalimba.triggerAttackRelease("E4", "16n", this.t()); this.kalimba.triggerAttackRelease("G4", "16n", this.t() + 0.08); }
  
  // 8. Yeşil Harf Tekrar (Az önemli)
  greenKnown() { this.ctx(); this.kalimba.triggerAttackRelease("G4", "16n", this.t(), 0.2); }
  
  // 9. Kelime Bulma (Aşırı Önemli, Dopamin)
  win() {
      this.ctx(); const now = this.t();
      this.kalimba.triggerAttackRelease("C4", "8n", now);
      this.kalimba.triggerAttackRelease("E4", "8n", now + 0.1);
      this.kalimba.triggerAttackRelease("G4", "8n", now + 0.2);
      this.kalimba.triggerAttackRelease("C5", "2n", now + 0.3);
  }
  
  // 10. XP Eklenmesi (Prominent ama çok önde değil)
  xp() { this.ctx(); this.pluck.triggerAttackRelease("C5", this.t()); }
  
  // 11. XP Timer Bekleyiş (Çok önde değil)
  xpbar() { this.ctx(); this.bamboo.triggerAttackRelease("C4", "32n", this.t(), 0.1); }
  
  // 12. Round Timer Geri Sayım (10 saniye uyarı vs)
  timer10() { this.ctx(); this.bowl.triggerAttackRelease("C2", "2n", this.t(), 0.8); }
  
  // 13. Son 3 2 1 Gergin
  timer3() { this.ctx(); this.heartbeat.triggerAttackRelease("C2", "8n", this.t()); }
  timer0() { this.ctx(); this.kalimba.triggerAttackRelease("C5", "8n", this.t(), 0.6); }

  // 14. Error (Not Enough Letters)
  error() { this.ctx(); this.bamboo.triggerAttackRelease("A2", "16n", this.t()); this.bamboo.triggerAttackRelease("Eb2", "16n", this.t() + 0.15); }

  // 15. Error (Out of Tries)
  lose() {
      this.ctx(); const now = this.t();
      this.kalimba.triggerAttackRelease("Eb4", "4n", now);
      this.kalimba.triggerAttackRelease("D4", "4n", now + 0.3);
      this.kalimba.triggerAttackRelease("Db4", "2n", now + 0.6);
  }

  // 16. Power-ups (Bomb / Hint)
  hintWhoosh() { this.ctx(); this.pluck.triggerAttackRelease("G4", this.t()); }
  hintReveal() { this.ctx(); this.kalimba.triggerAttackRelease("C6", "16n", this.t()); }
  bombDrop() { this.ctx(); this.pluck.triggerAttackRelease("C3", this.t()); }
  bombExplode() { this.ctx(); this.heartbeat.triggerAttackRelease("C1", "2n", this.t(), 4.0); }
}

export const ThemeSecondaryToneManager = new ThemeSecondaryToneManagerClass();
