const fs = require('fs');
let content = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

const imports = `import { ThemeWoodToneManager } from './ThemeWoodToneManager';
import { ThemeCrystalToneManager } from './ThemeCrystalToneManager';
import { ThemeChillhopToneManager } from './ThemeChillhopToneManager';
import { ThemeScifiToneManager } from './ThemeScifiToneManager';
import { ThemeWaterToneManager } from './ThemeWaterToneManager';
import { ThemeRetroToneManager } from './ThemeRetroToneManager';
import { ThemeOrchestralToneManager } from './ThemeOrchestralToneManager';
import { ThemeSynthwaveToneManager } from './ThemeSynthwaveToneManager';
import { ThemeASMRToneManager } from './ThemeASMRToneManager';
import { ThemeZenToneManager } from './ThemeZenToneManager';\n`;

content = content.replace(
  "import { MainSixToneManager } from './MainSixToneManager';",
  "import { MainSixToneManager } from './MainSixToneManager';\n" + imports
);

content = content.replace(
  "| 'main-6' | 'premium'",
  "| 'main-6' | 'theme-wood' | 'theme-crystal' | 'theme-chillhop' | 'theme-scifi' | 'theme-water' | 'theme-retro' | 'theme-orchestral' | 'theme-synthwave' | 'theme-asmr' | 'theme-zen' | 'premium'"
);

const hooks = [
  'roundInfo', 'type', 'timer10', 'timer3', 'timer0', 'error', 'delete', 'submit', 'gray', 'yellow', 'green', 'xp', 'win', 'xpbar', 'hintWhoosh', 'hintReveal', 'bombDrop', 'bombExplode', 'lose'
];

for (const hook of hooks) {
  const insertStr = `    if(currentTheme === 'theme-wood') { ThemeWoodToneManager.${hook}(); return; }
    if(currentTheme === 'theme-crystal') { ThemeCrystalToneManager.${hook}(); return; }
    if(currentTheme === 'theme-chillhop') { ThemeChillhopToneManager.${hook}(); return; }
    if(currentTheme === 'theme-scifi') { ThemeScifiToneManager.${hook}(); return; }
    if(currentTheme === 'theme-water') { ThemeWaterToneManager.${hook}(); return; }
    if(currentTheme === 'theme-retro') { ThemeRetroToneManager.${hook}(); return; }
    if(currentTheme === 'theme-orchestral') { ThemeOrchestralToneManager.${hook}(); return; }
    if(currentTheme === 'theme-synthwave') { ThemeSynthwaveToneManager.${hook}(); return; }
    if(currentTheme === 'theme-asmr') { ThemeASMRToneManager.${hook}(); return; }
    if(currentTheme === 'theme-zen') { ThemeZenToneManager.${hook}(); return; }\n`;
  content = content.replace(new RegExp(`(${hook}: \\(\\) => \\{\\s*\\n)`), `$1${insertStr}`);
}

const togglerRegex = /\{\/\* THEME TOGGLER \*\/\}([\s\S]*?)<\/div>/;
const newToggler = `{/* THEME TOGGLER */}
        <div className="bg-white pointer-events-auto rounded-[14px] shadow-sm border border-gray-200 p-1 flex flex-wrap gap-1 items-center max-w-[600px] justify-center">
          {(['main-geo', 'main-2', 'main-3', 'main-4', 'main-5', 'main-6', 'theme-wood', 'theme-crystal', 'theme-chillhop', 'theme-scifi', 'theme-water', 'theme-retro', 'theme-orchestral', 'theme-synthwave', 'theme-asmr', 'theme-zen', 'streamer-premium', 'streamer-royal', 'streamer-sweet'] as AudioTheme[]).map((theme, index) => (
              <button
                  key={theme}
                  onClick={() => {
                      if (theme === 'main-geo') { MainGeoToneManager.init(); }
                      if (theme === 'main-2') { MainTwoToneManager.init(); }
                      if (theme === 'main-3') { MainThreeToneManager.init(); }
                      if (theme === 'main-4') { MainFourToneManager.init(); }
                      if (theme === 'main-5') { MainFiveToneManager.init(); }
                      if (theme === 'main-6') { MainSixToneManager.init(); }
                      if (theme === 'theme-wood') { ThemeWoodToneManager.init(); }
                      if (theme === 'theme-crystal') { ThemeCrystalToneManager.init(); }
                      if (theme === 'theme-chillhop') { ThemeChillhopToneManager.init(); }
                      if (theme === 'theme-scifi') { ThemeScifiToneManager.init(); }
                      if (theme === 'theme-water') { ThemeWaterToneManager.init(); }
                      if (theme === 'theme-retro') { ThemeRetroToneManager.init(); }
                      if (theme === 'theme-orchestral') { ThemeOrchestralToneManager.init(); }
                      if (theme === 'theme-synthwave') { ThemeSynthwaveToneManager.init(); }
                      if (theme === 'theme-asmr') { ThemeASMRToneManager.init(); }
                      if (theme === 'theme-zen') { ThemeZenToneManager.init(); }
                      if (theme === 'streamer-premium') { PremiumToneManager.init(); }
                      if (theme === 'streamer-royal') { RoyalToneManager.init(); }
                      if (theme === 'streamer-sweet') { SweetVictoryToneManager.init(); }
                      setActiveAudioTheme(theme);
                  }}
                  className={\`px-2 py-1 text-[10px] font-bold uppercase rounded-[10px] tracking-wider transition-all \${activeAudioTheme === theme ? 'bg-[#111827] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}\`}
              >
                  {theme.replace('main-', 'MAIN ').replace('theme-', '').replace('streamer-', 'OPT ')}
              </button>
          ))}
        </div>`;

content = content.replace(togglerRegex, newToggler);

fs.writeFileSync('src/CasualWordle.tsx', content);
