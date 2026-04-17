import * as Tone from 'tone';

class ThemeTertiaryToneManagerClass {
  // We want a very tight, thick room sound (tok canlı sesler)
  private masterBus = new Tone.Volume(0).toDestination();
  private rev = new Tone.Reverb({ decay: 0.6, wet: 0.15 }).connect(this.masterBus);

  // Tok Canlı Ses (Thick Woody Marimba/Mallet)
  // Used for letters, win, lose
  private mallet = new Tone.FMSynth({
    harmonicity: 1.5,
    modulationIndex: 1.2,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.0, release: 0.2 },
    modulation: { type: "sine" },
    modulationEnvelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.rev);

  // Kalın Tok Ses (Thick Deep Thud for typing/submitting)
  private thud = new Tone.MembraneSynth({
    pitchDecay: 0.008, 
    octaves: 1.2,
    oscillator: { type: "sine" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.rev);

  // Koyu Ahşap (Hollow block for errors/gray)
  private hollow = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 2,
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 }
  }).connect(this.rev);

  // For the specific countdown provided by the user
  private tickCount = 0;

  public async init() { await Tone.start(); console.log("Theme: TERTIARY (Thick Live) Loaded"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // 1. Geri Sayım İlk (As requested by User)
  roundInfo() { 
      this.ctx(); 
      this.tickCount = 0; // reset tick
  }

  // timer3 is called TWICE by React: once for "3", once for "2".
  timer3() { 
      this.ctx(); 
      const now = this.t();

      if (this.tickCount === 0) {
        // "3" — calm, roomy mallet hit
        const env3 = new Tone.AmplitudeEnvelope({ attack: 0.004, decay: 0.18, sustain: 0.0, release: 0.3 }).connect(this.rev);
        const osc3 = new Tone.Oscillator({ frequency: 392, type: "triangle" }).connect(env3);
        const sub3 = new Tone.Oscillator({ frequency: 196, type: "sine" }).connect(env3);
        osc3.start(now); env3.triggerAttackRelease(0.22, now);
        osc3.stop(now + 0.5); sub3.start(now); sub3.stop(now + 0.5);
      } else {
        // "2" — slightly brighter, more present
        const env2 = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: 0.15, sustain: 0.0, release: 0.25 }).connect(this.rev);
        const osc2 = new Tone.Oscillator({ frequency: 440, type: "triangle" }).connect(env2);
        const sub2 = new Tone.Oscillator({ frequency: 220, type: "sine" }).connect(env2);
        osc2.start(now); env2.triggerAttackRelease(0.18, now);
        osc2.stop(now + 0.4); sub2.start(now); sub2.stop(now + 0.4);
      }
      this.tickCount++;
  }
  
  timer0() { 
      this.ctx(); const now = this.t();
      // "1" / Go — punchy, sharp, anticipation peak
      const env1 = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: 0.12, sustain: 0.0, release: 0.2 }).connect(this.rev);
      const osc1a = new Tone.Oscillator({ frequency: 523.25, type: "triangle" }).connect(env1);
      const osc1b = new Tone.Oscillator({ frequency: 784, type: "sine" }).connect(env1);
      const sub1 = new Tone.Oscillator({ frequency: 261.63, type: "sine" }).connect(env1);
      const g1 = new Tone.Gain(0.6).connect(env1);
      
      osc1a.start(now); osc1b.connect(g1); osc1b.start(now);
      env1.triggerAttackRelease(0.15, now);
      osc1a.stop(now + 0.4); osc1b.stop(now + 0.4); sub1.start(now); sub1.stop(now + 0.4);
      this.tickCount = 0;
  }

  // 2. Harf Yazma (Tok, Canlı Ahşap Masa Vuruşu)
  type() { this.ctx(); this.thud.triggerAttackRelease("C2", "64n", this.t(), 0.3); }
  
  // 3. Harf Silme (Koyu Ahşap Sürtme)
  delete() { this.ctx(); this.hollow.triggerAttackRelease("E1", "32n", this.t(), 0.2); }
  
  // 4. Kelime Submit Etme (İkili Tok Masa Vuruşu)
  submit() { this.ctx(); this.thud.triggerAttackRelease("C2", "32n", this.t(), 0.4); this.thud.triggerAttackRelease("E2", "16n", this.t() + 0.08, 0.5); }
  
  // 5. Gri Harf (Önemsiz Kof Ahşap)
  gray() { this.ctx(); this.hollow.triggerAttackRelease("G2", "16n", this.t(), 0.5); }
  
  // 6. Sarı Harf (Bi tık önemli marimba)
  yellow() { this.ctx(); this.mallet.triggerAttackRelease("E4", "16n", this.t(), 0.6); }
  
  // 7. Yeşil Harf (Önemli, Dopamin)
  green() { this.ctx(); this.mallet.triggerAttackRelease("C5", "16n", this.t(), 0.8); }
  
  // 8. Yeşil Harf Tekrar (Az önemli)
  greenKnown() { this.ctx(); this.mallet.triggerAttackRelease("G4", "16n", this.t(), 0.4); }
  
  // 9. Kelime Bulma (Aşırı Önemli, Success)
  win() {
      this.ctx(); const now = this.t();
      this.mallet.triggerAttackRelease("C4", "16n", now);
      this.mallet.triggerAttackRelease("E4", "16n", now + 0.1);
      this.mallet.triggerAttackRelease("G4", "16n", now + 0.2);
      this.mallet.triggerAttackRelease("C5", "4n", now + 0.3);
  }
  
  // 10. XP Eklenmesi (Prominent ama çok önde değil)
  xp() { this.ctx(); this.thud.triggerAttackRelease("G3", "32n", this.t(), 0.2); }
  
  // 11. XP Timer Bekleyiş (Çok önde değil)
  xpbar() { this.ctx(); this.thud.triggerAttackRelease("C2", "64n", this.t(), 0.1); }
  
  // 12. Round Timer Geri Sayım (10 saniye uyarı) - Büyük Tok Kase
  timer10() { this.ctx(); this.hollow.triggerAttackRelease("C1", "2n", this.t(), 1.0); }
  
  // 14. Error (Not Enough Letters) -> Tok, reddedici çift vuruş
  error() { this.ctx(); this.hollow.triggerAttackRelease("A1", "16n", this.t()); this.hollow.triggerAttackRelease("F1", "8n", this.t() + 0.12); }

  // 15. Error (Out of Tries) -> Üzücü Kalın Marimba
  lose() {
      this.ctx(); const now = this.t();
      this.mallet.triggerAttackRelease("Eb3", "8n", now);
      this.mallet.triggerAttackRelease("D3", "8n", now + 0.3);
      this.mallet.triggerAttackRelease("Db3", "4n", now + 0.6);
  }

  // 16. Power-ups (Bomb / Hint)
  hintWhoosh() { this.ctx(); this.mallet.triggerAttackRelease("G5", "32n", this.t(), 0.6); }
  hintReveal() { this.ctx(); this.mallet.triggerAttackRelease("C6", "16n", this.t(), 0.8); }
  bombDrop() { this.ctx(); this.hollow.triggerAttackRelease("E1", "16n", this.t(), 0.8); }
  bombExplode() { this.ctx(); this.hollow.triggerAttackRelease("C0", "2n", this.t(), 4.0); }
}

export const ThemeTertiaryToneManager = new ThemeTertiaryToneManagerClass();
