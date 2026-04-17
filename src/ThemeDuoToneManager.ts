import * as Tone from 'tone';

class ThemeDuoToneManagerClass {
  // === 1. PARLAK VE TEMİZ KANAL ===
  // Duolingo sesleri boğuk değildir, çok temizdir. Kullanıcının genel tercihine uygun olarak yankı (reverb) kapalı.
  private appBus = new Tone.Reverb({ decay: 1.0, wet: 0.0 }).toDestination();

  // === 2. DUOLINGO ENSTRÜMANLARI ===

  // A) Klasik Marimba / Ksilofon (Yeşil harf, Başarı, Sarı harf)
  // Bu FM (Frekans Modülasyonu) ayarı tam olarak o meşhur tahta/cam çınlamasını verir.
  private marimba = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.2,
      modulationIndex: 1.5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0.0, release: 0.2 },
      modulation: { type: "square" },
      modulationEnvelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.appBus);

  // B) "Bloop" ve "Pop" Sesleri (Harf yazma, Etkileşim)
  // Çok sevimli, zıplayan bir su damlası veya UI tıklaması.
  private bloopSynth = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2, oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
  }).connect(this.appBus);

  // C) "Bonk" Sesi (Hata, Gri Harf, Out of Tries)
  // Arcade "bounce" yerine çok daha soft, mat ve akustik vokalsi bir thud.
  private bonkSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.03, decay: 0.3, sustain: 0.05, release: 0.2 }
  }).connect(this.appBus);

  public async init() { await Tone.start(); console.log("Theme: DUOLINGO STYLE Loaded 🦉"); }
  private t() { return Tone.now(); }
  private ctx() { if (Tone.context.state !== 'running') Tone.start(); }

  // --- ETKİLEŞİM (Temiz ve Tatlı Pop'lar) ---
  // Yazma ve silmeler önceki isteğe bağlı kalarak secondary/kısa (velocity düşük) yapıldı
  type() { this.ctx(); this.bloopSynth.triggerAttackRelease("C4", "64n", this.t(), 0.1); } 
  delete() { this.ctx(); this.bloopSynth.triggerAttackRelease("G3", "64n", this.t(), 0.1); }
  submit() { this.ctx(); this.bloopSynth.triggerAttackRelease("E3", "16n", this.t()); }

  // --- RENKLER (Dopamin Merkezi) ---
  gray() { this.ctx(); this.bonkSynth.triggerAttackRelease("A2", "16n", this.t()); }
  yellow() { this.ctx(); this.marimba.triggerAttackRelease("E5", "16n", this.t()); }
  greenKnown() { this.ctx(); this.marimba.triggerAttackRelease("E5", "16n", this.t(), 0.4); }
  green() { 
      this.ctx(); const now = this.t();
      this.marimba.triggerAttackRelease("C5", "16n", now);
      this.marimba.triggerAttackRelease("G5", "16n", now + 0.08); 
  }

  // --- ÖDÜL VE BAŞARI (Lesson Complete!) ---
  win() {
    this.ctx(); const now = this.t();
    this.marimba.triggerAttackRelease("C5", "16n", now);
    this.marimba.triggerAttackRelease("E5", "16n", now + 0.1);
    this.marimba.triggerAttackRelease("G5", "16n", now + 0.2);
    this.marimba.triggerAttackRelease("C6", "2n", now + 0.35); 
  }
  xp() { this.ctx(); this.marimba.triggerAttackRelease("C6", "32n", this.t(), 0.6); }
  xpbar() {
    this.ctx();
    this.marimba.triggerAttackRelease("G5", "32n", this.t(), 0.2);
  }

  // --- BAŞARISIZLIK VE ZAMAN ---
  lose() {
    this.ctx(); const now = this.t();
    this.bonkSynth.triggerAttackRelease("Eb3", "8n", now);
    this.bonkSynth.triggerAttackRelease("D3", "8n", now + 0.15);
    this.bonkSynth.triggerAttackRelease("Db3", "2n", now + 0.3);
  }
  
  // --- TIME & TENSION ---
  roundInfo() { 
    this.ctx(); 
    this.bloopSynth.triggerAttackRelease("C4", "8n", this.t());
  }

  timer10() { this.ctx(); this.bloopSynth.triggerAttackRelease("C4", "32n", this.t(), 0.4); }
  timer3() { this.ctx(); this.bloopSynth.triggerAttackRelease("C4", "16n", this.t(), 0.8); }
  timer0() { this.ctx(); this.marimba.triggerAttackRelease("G5", "8n", this.t()); }

  error() {
      this.ctx(); const now = this.t();
      // Duolingo tarzı ikonik "uh-oh" (minor third aşağı)
      this.bonkSynth.triggerAttackRelease("F3", "16n", now, 0.6);
      this.bonkSynth.triggerAttackRelease("D3", "8n", now + 0.16, 0.8);
  }

  // --- POWER-UPS ---
  hintWhoosh() { 
      this.ctx(); 
      this.bloopSynth.triggerAttackRelease("C5", "32n", this.t(), 0.2);
      this.bloopSynth.triggerAttackRelease("E5", "32n", this.t() + 0.08, 0.2);
  }
  hintReveal() { 
      this.ctx(); 
      this.marimba.triggerAttackRelease("G5", "16n", this.t(), 0.3); 
  }
  
  bombDrop() { 
      this.ctx(); 
      this.bloopSynth.triggerAttackRelease("G3", "16n", this.t(), 0.2); 
  }
  bombExplode() { 
      this.ctx(); const now = this.t();
      // Absürt gürültü yerine şirin bir "pıp-pop" baloncuk patlaması
      this.bloopSynth.triggerAttackRelease("D3", "32n", now, 0.4); 
      this.bloopSynth.triggerAttackRelease("F3", "16n", now + 0.1, 0.5);
  }
}

export const ThemeDuoToneManager = new ThemeDuoToneManagerClass();
