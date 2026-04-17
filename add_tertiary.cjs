const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

// 1. Add import
if (!code.includes("import { ThemeTertiaryToneManager }")) {
  code = code.replace(
    "import { ThemeDuoToneManager } from './ThemeDuoToneManager';",
    "import { ThemeDuoToneManager } from './ThemeDuoToneManager';\nimport { ThemeTertiaryToneManager } from './ThemeTertiaryToneManager';"
  );
}

// 2. Add to AudioTheme map array
code = code.replace(
  "(['main-geo', 'main-2', 'main-3', 'main-6', 'theme-duo', 'streamer-premium', ] as AudioTheme[])",
  "(['main-geo', 'main-2', 'main-3', 'main-6', 'theme-duo', 'theme-tertiary', 'streamer-premium', ] as AudioTheme[])"
);
code = code.replace(
  "'streamer-sweet' | 'theme-duo';",
  "'streamer-sweet' | 'theme-duo' | 'theme-tertiary';"
);

// 3. Add to init
if (!code.includes("if (theme === 'theme-tertiary') { ThemeTertiaryToneManager.init(); }")) {
  code = code.replace(
    "if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }",
    "if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }\n                      if (theme === 'theme-tertiary') { ThemeTertiaryToneManager.init(); }"
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
    if(currentTheme === 'theme-tertiary') { ThemeTertiaryToneManager.${fn}(); return; }`.trim();
  
  if (code.includes(lineToFind) && !code.includes(`ThemeTertiaryToneManager.${fn}()`)) {
    code = code.replace(lineToFind, `${lineToFind}\n    ${linesToAdd}`);
  }
});

fs.writeFileSync('src/CasualWordle.tsx', code);
