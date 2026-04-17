const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

// 1. Remove import
code = code.replace("import { ThemeSecondaryToneManager } from './ThemeSecondaryToneManager';\n", "");

// 2. Remove from AudioTheme type
code = code.replace("'theme-secondary' | ", "");

// 3. Remove from Theme dropdown array
code = code.replace("'theme-secondary', ", "");

// 4. Remove init
code = code.replace("if (theme === 'theme-secondary') { ThemeSecondaryToneManager.init(); }\n                      ", "");

// 5. Remove all theme-secondary function calls
const blocks = code.split('\n');
const newBlocks = blocks.filter(line => !line.includes("if(currentTheme === 'theme-secondary') { ThemeSecondaryToneManager."));
code = newBlocks.join('\n');

fs.writeFileSync('src/CasualWordle.tsx', code);
