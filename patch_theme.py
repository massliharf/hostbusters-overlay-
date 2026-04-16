import re

with open('src/CasualWordle.tsx', 'r') as f:
    content = f.read()

# Update AudioTheme
content = content.replace(
    "type AudioTheme = 'asmr-wood' | 'asmr-glass' | 'asmr-synth' | 'asmr-click' | 'asmr-minimal' | 'premium' | 'casual' | 'assets';",
    "type AudioTheme = 'asmr-wood' | 'asmr-glass' | 'asmr-synth' | 'asmr-click' | 'asmr-minimal' | 'asmr-pure' | 'premium' | 'casual' | 'assets';"
)

# Update UI Map
content = content.replace(
    "{(['asmr-wood', 'asmr-synth', 'asmr-click', 'asmr-minimal'] as AudioTheme[]).map((theme, index) => (",
    "{(['asmr-wood', 'asmr-synth', 'asmr-click', 'asmr-minimal', 'asmr-pure'] as AudioTheme[]).map((theme, index) => ("
)

pure_configs = {
    'type': "playSoftADSR(150, 'sine', 0.05, 0.1); return;",
    'timer10': "playSoftADSR(100, 'sine', 0.05, 0.1); return;",
    'timer3': "playSoftADSR(400, 'sine', 0.1, 0.2); triggerHaptic(50); return;",
    'timer0': "playSoftADSR(800, 'sine', 0.1, 0.3); triggerHaptic([200, 100, 200]); return;",
    'delete': "playSoftSweep(200, 100, 0.05, 0.15); return;",
    'submit': "playSoftADSR(500, 'triangle', 0.15, 0.4); return;",
    'gray': "playSoftADSR(150, 'sine', 0.05, 0.2); return;",
    'yellow': "playSoftADSR(300, 'sine', 0.08, 0.3); return;",
    'green': "playSoftADSR(880, 'sine', 0.2, 1.0); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.5), 100); return;",
    'xp': "playSoftADSR(880, 'sine', 0.2, 0.5); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.0), 100); return;",
    'win': """[
          { f: 261.63, t: 0 }, { f: 329.63, t: 150 }, { f: 392.00, t: 300 }, { f: 523.25, t: 450 },
          { f: 659.25, t: 600, d: 2.0 }, { f: 1046.50, t: 900, d: 3.0 }
        ].forEach(n => setTimeout(() => playSoftADSR(n.f, 'sine', 0.2, n.d || 0.6), n.t));
        setTimeout(() => playSoftNoise(0.02, 3.0), 900);
        return;""",
    'xpbar': "playSoftADSR(200, 'sine', 0.1, 0.2); return;",
    'hintWhoosh': "playSoftSweep(400, 200, 0.1, 0.2); return;",
    'hintReveal': "playSoftADSR(880, 'sine', 0.2, 1.0); setTimeout(() => playSoftADSR(1760, 'sine', 0.1, 1.5), 100); return;",
    'bombDrop': "playSoftNoise(0.03, 0.1); return;",
    'bombExplode': "playSoftADSR(150, 'sine', 0.1, 0.2); playSoftNoise(0.04, 0.1); return;"
}

for func_name, code in pure_configs.items():
    # Find the start of the function in SFX
    # e.g.  type: () => { 
    # we want to insert directly after that line, or before the premium check.
    # Let's insert it right above `if(currentTheme === 'premium')`
    
    # We will use regex to find `if(currentTheme === 'premium')` within the block
    # and insert `if(currentTheme === 'asmr-pure') { code }` before it.
    
    pattern = rf"({func_name}:\s*\(\)\s*=>\s*{{[\s\S]*?)(if\(currentTheme === 'premium'\))"
    replacement = rf"\1if(currentTheme === 'asmr-pure') {{ {code} }}\n    \2"
    
    content = re.sub(pattern, replacement, content)

with open('src/CasualWordle.tsx', 'w') as f:
    f.write(content)

print("Patched.")
