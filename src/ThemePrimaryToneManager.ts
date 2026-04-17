import * as Tone from 'tone';

class ThemePrimaryToneManagerClass {
  private masterDb = -2;

  // Track the timer state for 3-2-1
  private tickCount = 0;
  private isInRound = false;

  public async init() { await Tone.start(); console.log("Theme: PRIMARY Loaded"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // --- TIMER LOGIC ---
  roundInfo() {
    this.ctx();
    this.tickCount = 0;
    this.isInRound = false;
  }

  timer10() {
    // "Timer Tick — Last 10 seconds"
    this.ctx();
    this.isInRound = true;

    const vol = new Tone.Volume(this.masterDb - 4).toDestination();
    const env = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.06, sustain: 0.0, release: 0.08 }).connect(vol);
    const noise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.05 } });
    const bp = new Tone.Filter({ frequency: 1800, type: "bandpass", Q: 8 }).connect(vol);
    noise.connect(bp);
    const osc = new Tone.Oscillator({ frequency: 700, type: "triangle" }).connect(env);
    
    const now = this.t();
    osc.start(now); env.triggerAttackRelease(0.07, now); osc.stop(now + 0.15);
    noise.triggerAttackRelease("32n", now);
  }

  timer3() {
    this.ctx();
    const now = this.t();
    if (this.isInRound) {
        // "Timer End 3-2-1"
        const vol = new Tone.Volume(this.masterDb + 2).toDestination();
        const rev = new Tone.Reverb({ decay: 0.3, wet: 0.1 }).connect(vol);
        let freq = 480; let dur = 0.08; let vel = 0.7;
        if (this.tickCount === 1) { freq = 560; dur = 0.07; vel = 0.85; }
        else if (this.tickCount === 2) { freq = 680; dur = 0.06; vel = 1.0; }

        const env = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: dur, sustain: 0.0, release: 0.12 }).connect(rev);
        const g = new Tone.Gain(vel).connect(env);
        const osc = new Tone.Oscillator({ frequency: freq, type: "square" }).connect(g);
        osc.frequency.setValueAtTime(freq * 1.15, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.02);
        osc.start(now); env.triggerAttackRelease(dur + 0.1, now); osc.stop(now + 0.3);
    } else {
        // "3-2-1 Round Countdown"
        const vol = new Tone.Volume(this.masterDb).toDestination();
        const rev = new Tone.Reverb({ decay: 0.6, wet: 0.18 }).connect(vol);
        if (this.tickCount === 0) {
            const env3 = new Tone.AmplitudeEnvelope({ attack: 0.004, decay: 0.18, sustain: 0.0, release: 0.3 }).connect(rev);
            const osc3 = new Tone.Oscillator({ frequency: 392, type: "triangle" }).connect(env3);
            const sub3 = new Tone.Oscillator({ frequency: 196, type: "sine" }).connect(env3);
            osc3.start(now); env3.triggerAttackRelease(0.22, now);
            osc3.stop(now + 0.5); sub3.start(now); sub3.stop(now + 0.5);
        } else {
            const env2 = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: 0.15, sustain: 0.0, release: 0.25 }).connect(rev);
            const osc2 = new Tone.Oscillator({ frequency: 440, type: "triangle" }).connect(env2);
            const sub2 = new Tone.Oscillator({ frequency: 220, type: "sine" }).connect(env2);
            osc2.start(now); env2.triggerAttackRelease(0.18, now);
            osc2.stop(now + 0.4); sub2.start(now); sub2.stop(now + 0.4);
        }
    }
    this.tickCount++;
  }

  timer0() {
    this.ctx();
    const now = this.t();

    // "1" — punchy
    const vol = new Tone.Volume(this.masterDb).toDestination();
    const rev = new Tone.Reverb({ decay: 0.6, wet: 0.18 }).connect(vol);
    const env1 = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: 0.12, sustain: 0.0, release: 0.2 }).connect(rev);
    const osc1a = new Tone.Oscillator({ frequency: 523.25, type: "triangle" }).connect(env1);
    const osc1b = new Tone.Oscillator({ frequency: 784, type: "sine" }).connect(env1);
    const sub1 = new Tone.Oscillator({ frequency: 261.63, type: "sine" }).connect(env1);
    const g1 = new Tone.Gain(0.6).connect(env1);
    osc1a.start(now); osc1b.connect(g1); osc1b.start(now);
    env1.triggerAttackRelease(0.15, now);
    osc1a.stop(now + 0.4); osc1b.stop(now + 0.4); sub1.start(now); sub1.stop(now + 0.4);
    
    this.tickCount = 0;
  }

  // --- HARF İŞLEMLERİ ---
  type() {
    // Letter Type
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 8).toDestination();
    const env = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: 0.045, sustain: 0.0, release: 0.06 }).connect(vol);
    const osc = new Tone.Oscillator({ frequency: 210, type: "triangle" }).connect(env);
    const bp = new Tone.Filter({ frequency: 3200, type: "bandpass", Q: 12 }).connect(vol);
    const noise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.018, sustain: 0, release: 0.02 } }).connect(bp);
    
    const now = this.t();
    osc.start(now); env.triggerAttackRelease(0.05, now); osc.stop(now + 0.12);
    noise.triggerAttackRelease("64n", now);
  }

  delete() {
    // Letter Delete
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 10).toDestination();
    const env = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: 0.055, sustain: 0.0, release: 0.07 }).connect(vol);
    const osc = new Tone.Oscillator({ frequency: 260, type: "triangle" }).connect(env);
    
    const now = this.t();
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

    const bp = new Tone.Filter({ frequency: 2200, type: "bandpass", Q: 10 }).connect(vol);
    const noise = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.022, sustain: 0, release: 0.025 } }).connect(bp);
    
    osc.start(now); env.triggerAttackRelease(0.06, now); osc.stop(now + 0.13);
    noise.triggerAttackRelease("64n", now);
  }

  submit() {
    // Word Submit
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 2).toDestination();
    const rev = new Tone.Reverb({ decay: 0.4, wet: 0.12 }).connect(vol);
    const env = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: 0.1, sustain: 0.0, release: 0.15 }).connect(rev);

    const osc = new Tone.Oscillator({ frequency: 160, type: "triangle" }).connect(env);
    const now = this.t();
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

    const envH = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.03, sustain: 0.0, release: 0.04 }).connect(vol);
    const oscH = new Tone.Oscillator({ frequency: 1100, type: "sine" }).connect(envH);

    osc.start(now); env.triggerAttackRelease(0.12, now); osc.stop(now + 0.28);
    oscH.start(now); envH.triggerAttackRelease(0.035, now); oscH.stop(now + 0.1);
  }

  // --- HARF SONUÇLARI ---
  gray() {
    // Grey Letter
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 12).toDestination();
    const env = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: 0.08, sustain: 0.0, release: 0.1 }).connect(vol);
    const osc = new Tone.Oscillator({ frequency: 130, type: "triangle" }).connect(env);
    
    const now = this.t();
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.07);
    osc.start(now); env.triggerAttackRelease(0.09, now); osc.stop(now + 0.2);
  }

  yellow() {
    // Yellow Letter
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 4).toDestination();
    const rev = new Tone.Reverb({ decay: 0.9, wet: 0.2 }).connect(vol);
    const env = new Tone.AmplitudeEnvelope({ attack: 0.004, decay: 0.22, sustain: 0.0, release: 0.3 }).connect(rev);

    const osc = new Tone.Oscillator({ frequency: 587.33, type: "triangle" }).connect(env);
    const osc2 = new Tone.Oscillator({ frequency: 587.33 * 2, type: "sine" }).connect(env);
    const g2 = new Tone.Gain(0.22).connect(env);
    osc2.disconnect(); osc2.connect(g2);

    const oscH = new Tone.Oscillator({ frequency: 1760, type: "sine" }).connect(env);
    const gH = new Tone.Gain(0.06).connect(env);
    oscH.disconnect(); oscH.connect(gH);

    const now = this.t();
    osc.start(now); osc2.start(now); oscH.start(now);
    env.triggerAttackRelease(0.25, now);
    osc.stop(now + 0.6); osc2.stop(now + 0.6); oscH.stop(now + 0.6);
  }

  green() {
    // Green Letter
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 1).toDestination();
    const rev = new Tone.Reverb({ decay: 1.1, wet: 0.22 }).connect(vol);
    const env = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: 0.28, sustain: 0.0, release: 0.35 }).connect(rev);

    const osc = new Tone.Oscillator({ frequency: 659.25, type: "triangle" }).connect(env);
    const osc5 = new Tone.Oscillator({ frequency: 987.77, type: "sine" }).connect(env);
    const g5 = new Tone.Gain(0.3).connect(env);
    osc5.disconnect(); osc5.connect(g5);

    const now = this.t();
    osc.start(now); osc5.start(now);
    env.triggerAttackRelease(0.3, now);
    osc.stop(now + 0.7); osc5.stop(now + 0.7);
  }

  greenKnown() {
    // Green Repeat
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 8).toDestination();
    const rev = new Tone.Reverb({ decay: 0.7, wet: 0.15 }).connect(vol);
    const env = new Tone.AmplitudeEnvelope({ attack: 0.005, decay: 0.16, sustain: 0.0, release: 0.2 }).connect(rev);

    const osc = new Tone.Oscillator({ frequency: 587.33, type: "triangle" }).connect(env);
    const now = this.t();
    osc.start(now); env.triggerAttackRelease(0.18, now); osc.stop(now + 0.4);
  }

  // --- BAŞARI & BAŞARISIZLIK ---
  win() {
    // Word Found
    this.ctx();
    const vol = new Tone.Volume(this.masterDb + 3).toDestination();
    const rev = new Tone.Reverb({ decay: 1.8, wet: 0.28 }).connect(vol);
    
    // Add chorus but safely check for potential crashes in safari context with async node handling
    let chorus;
    try { chorus = new Tone.Chorus(3, 1.5, 0.4).connect(rev).start(); } catch(e) {}
    const outputNode = chorus || rev;

    const melody = [
      { freq: 523.25, t: 0,    dur: 0.18 },
      { freq: 659.25, t: 0.14, dur: 0.18 },
      { freq: 784.0,  t: 0.28, dur: 0.22 },
      { freq: 1046.5, t: 0.44, dur: 0.45 },
    ];

    const now = this.t();
    melody.forEach(({ freq, t, dur }) => {
      const env = new Tone.AmplitudeEnvelope({ attack: 0.004, decay: dur * 0.6, sustain: 0.15, release: 0.4 }).connect(outputNode);
      const osc = new Tone.Oscillator({ frequency: freq, type: "triangle" }).connect(env);
      const osc2 = new Tone.Oscillator({ frequency: freq * 2, type: "sine" }).connect(env);
      const g2 = new Tone.Gain(0.2).connect(env);
      osc2.disconnect(); osc2.connect(g2);

      osc.start(now + t); osc2.start(now + t);
      env.triggerAttackRelease(dur + 0.3, now + t);
      osc.stop(now + t + dur + 0.8); osc2.stop(now + t + dur + 0.8);
    });

    const subEnv = new Tone.AmplitudeEnvelope({ attack: 0.08, decay: 0.5, sustain: 0.0, release: 0.4 }).connect(vol);
    const sub = new Tone.Oscillator({ frequency: 130.81, type: "sine" }).connect(subEnv);
    sub.start(now + 0.44); subEnv.triggerAttackRelease(0.6, now + 0.44); sub.stop(now + 1.6);
  }

  error() {
    // Error Not Enough Letters
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 3).toDestination();
    const rev = new Tone.Reverb({ decay: 0.35, wet: 0.1 }).connect(vol);

    const notes = [ { freq: 370, t: 0, dur: 0.07 }, { freq: 277, t: 0.11, dur: 0.08 } ];
    const now = this.t();
    notes.forEach(({ freq, t, dur }) => {
      const env = new Tone.AmplitudeEnvelope({ attack: 0.003, decay: dur + 0.06, sustain: 0.0, release: 0.1 }).connect(rev);
      const osc = new Tone.Oscillator({ frequency: freq, type: "triangle" }).connect(env);
      osc.frequency.setValueAtTime(freq, now + t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.88, now + t + dur);
      osc.start(now + t); env.triggerAttackRelease(dur + 0.08, now + t); osc.stop(now + t + 0.25);
    });
  }

  lose() {
    // Out Of Tries
    this.ctx();
    const vol = new Tone.Volume(this.masterDb).toDestination();
    const rev = new Tone.Reverb({ decay: 1.4, wet: 0.25 }).connect(vol);

    const notes = [ { freq: 440, t: 0, dur: 0.22 }, { freq: 349.23, t: 0.2, dur: 0.22 }, { freq: 261.63, t: 0.42, dur: 0.45 } ];
    const now = this.t();
    notes.forEach(({ freq, t, dur }, i) => {
      const env = new Tone.AmplitudeEnvelope({ attack: 0.006, decay: dur * 0.7, sustain: 0.08, release: 0.45 }).connect(rev);
      const osc = new Tone.Oscillator({ frequency: freq, type: "triangle" }).connect(env);
      const g = new Tone.Gain(1 - i * 0.15).connect(rev);
      osc.disconnect(); osc.connect(env);
      osc.start(now + t); env.triggerAttackRelease(dur + 0.35, now + t); osc.stop(now + t + 1.0);
    });

    const droneEnv = new Tone.AmplitudeEnvelope({ attack: 0.12, decay: 0.6, sustain: 0.0, release: 0.5 }).connect(rev);
    const drone = new Tone.Oscillator({ frequency: 130.81, type: "sine" }).connect(droneEnv);
    drone.start(now + 0.42); droneEnv.triggerAttackRelease(0.7, now + 0.42); drone.stop(now + 1.8);

    // Call Round Ended after out of tries or standalone
    setTimeout(() => this.roundEnded(), 2000);
  }

  roundEnded() {
    this.ctx();
    const vol = new Tone.Volume(this.masterDb - 2).toDestination();
    const rev = new Tone.Reverb({ decay: 2.2, wet: 0.35 }).connect(vol);

    const freqs = [130.81, 196.0, 261.63]; 
    const now = this.t();
    freqs.forEach((freq, i) => {
      const env = new Tone.AmplitudeEnvelope({ attack: 0.06 + i * 0.02, decay: 0.5, sustain: 0.3, release: 0.9 }).connect(rev);
      const osc = new Tone.Oscillator({ frequency: freq, type: "sine" }).connect(env);
      osc.start(now); env.triggerAttackRelease(0.9, now); osc.stop(now + 2.2);
    });
  }

  // --- OTHERS & POWER UPS ---
  xp() { this.type(); }
  xpbar() { this.type(); }
  hintWhoosh() { this.yellow(); }
  hintReveal() { this.green(); }
  bombDrop() { this.delete(); }
  bombExplode() { this.error(); }
}

export const ThemePrimaryToneManager = new ThemePrimaryToneManagerClass();
