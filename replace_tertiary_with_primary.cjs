const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

code = code.split('ThemeTertiaryToneManager').join('ThemePrimaryToneManager');
code = code.split("'theme-tertiary'").join("'primary'");
code = code.split("theme === 'theme-tertiary'").join("theme === 'primary'");
code = code.split("currentTheme === 'theme-tertiary'").join("currentTheme === 'primary'");
code = code.split("'theme-duo', 'theme-tertiary',").join("'theme-duo', 'primary',");

fs.writeFileSync('src/CasualWordle.tsx', code);
