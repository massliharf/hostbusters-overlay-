const fs = require('fs');
let code = fs.readFileSync('src/CasualWordle.tsx', 'utf8');

code = code.replace(/globalThis\.ytPlayerRef/g, '(globalThis as any).ytPlayerRef');

fs.writeFileSync('src/CasualWordle.tsx', code);
