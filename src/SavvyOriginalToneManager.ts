import { ThemeDuoToneManager } from './ThemeDuoToneManager';
import { MainSixToneManager } from './MainSixToneManager';
import { PremiumToneManager } from './PremiumToneManager';

// ═══════════════════════════════════════════════════════════════════════════
// SAVVY ORIGINAL — Thin routing layer over existing ToneManagers
// Uses the actual DUO, MAIN 6, and OPT PREMIUM sounds directly
// ═══════════════════════════════════════════════════════════════════════════

class SavvyOriginalToneManagerClass {

  public async init() {
    // Initialize all three source engines
    await ThemeDuoToneManager.init();
    await MainSixToneManager.init();
    await PremiumToneManager.init();
    console.log("Theme: SAVVY ORIGINAL (DUO + MAIN6 + PREMIUM routing) ✨");
  }

  // ═══════════════════════════════════════
  // KEYBOARD — DUO
  // ═══════════════════════════════════════
  type()   { ThemeDuoToneManager.type(); }
  delete() { ThemeDuoToneManager.delete(); }
  submit() { ThemeDuoToneManager.submit(); }

  // ═══════════════════════════════════════
  // COLORS — Mixed sources
  // ═══════════════════════════════════════
  gray()       { ThemeDuoToneManager.gray(); }           // DUO
  yellow()     { MainSixToneManager.yellow(); }           // MAIN 6
  greenKnown() { MainSixToneManager.greenKnown(); }      // MAIN 6 (repeating green)
  green()      { PremiumToneManager.green(); }            // OPT PREMIUM

  // ═══════════════════════════════════════
  // WIN / LOSE — DUO
  // ═══════════════════════════════════════
  win()  { ThemeDuoToneManager.win(); }
  lose() { ThemeDuoToneManager.lose(); }  // Out of Rows: DUO

  // ═══════════════════════════════════════
  // XP — DUO
  // ═══════════════════════════════════════
  xp()    { ThemeDuoToneManager.xp(); }
  xpbar() { ThemeDuoToneManager.xpbar(); }  // Time to XP conversion: DUO

  // ═══════════════════════════════════════
  // TIME & TENSION — DUO
  // ═══════════════════════════════════════
  roundInfo() { ThemeDuoToneManager.roundInfo(); }
  timer10()   { ThemeDuoToneManager.timer10(); }  // Every second from 10 to 0: DUO
  timer3()    { ThemeDuoToneManager.timer3(); }   // DUO
  timer0()    { ThemeDuoToneManager.lose(); }     // Out of Time: DUO lose (not the chime)

  // ═══════════════════════════════════════
  // ERROR — OPT PREMIUM (slightly louder)
  // ═══════════════════════════════════════
  error() { PremiumToneManager.error(); }

  // ═══════════════════════════════════════
  // POWER-UPS
  // ═══════════════════════════════════════
  hintWhoosh() { ThemeDuoToneManager.type(); }       // Same as typing on keyboard: DUO
  hintReveal() { ThemeDuoToneManager.hintReveal(); } // Hint reveal: DUO
  bombDrop()   { ThemeDuoToneManager.type(); }       // Same as typing on keyboard: DUO
  bombExplode(){ PremiumToneManager.bombExplode(); }  // Explosions: OPT PREMIUM
}

export const SavvyOriginalToneManager = new SavvyOriginalToneManagerClass();
