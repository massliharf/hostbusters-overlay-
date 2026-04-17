const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

// 1. Add import
if (!code.includes("import { ThemeSecondaryToneManager }")) {
  code = code.replace(
    "import { ThemeDuoToneManager } from './ThemeDuoToneManager';",
    "import { ThemeDuoToneManager } from './ThemeDuoToneManager';\nimport { ThemeSecondaryToneManager } from './ThemeSecondaryToneManager';"
  );
}

// 2. Add to AudioTheme map array
code = code.replace(
  "(['main-geo', 'main-2', 'main-3', 'main-6', 'theme-duo', 'streamer-premium', ] as AudioTheme[])",
  "(['main-geo', 'main-2', 'main-3', 'main-6', 'theme-secondary', 'theme-duo', 'streamer-premium', ] as AudioTheme[])"
);

// 3. Add to init
if (!code.includes("if (theme === 'theme-secondary') { ThemeSecondaryToneManager.init(); }")) {
  code = code.replace(
    "if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }",
    "if (theme === 'theme-secondary') { ThemeSecondaryToneManager.init(); }\n                      if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }"
  );
}

// 4. Map functions right below ThemeWoodToneManager
const functions = [
  'roundInfo', 'timer10', 'timer3', 'timer0', 'error', 'type', 'delete', 'submit',
  'gray', 'yellow', 'green', 'greenKnown', 'xp', 'win', 'xpbar', 'hintWhoosh',
  'hintReveal', 'bombDrop', 'bombExplode', 'lose'
];

functions.forEach(fn => {
  const lineToFind = `if(currentTheme === 'theme-wood') { ThemeWoodToneManager.${fn}(); return; }`;
  const linesToAdd = `
    if(currentTheme === 'theme-secondary') { ThemeSecondaryToneManager.${fn}(); return; }
    if(currentTheme === 'theme-duo') { ThemeDuoToneManager.${fn}(); return; }`.trim();
  
  if (code.includes(lineToFind) && !code.includes(`ThemeSecondaryToneManager.${fn}()`)) {
    code = code.replace(lineToFind, `${lineToFind}\n    ${linesToAdd}`);
  }
});

fs.writeFileSync('src/CasualWordle.tsx', code);
