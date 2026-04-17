import re

with open("src/CasualWordle.tsx", "r") as f:
    cw = f.read()

# 1. Import
if "ThemeDuoToneManager" not in cw:
    cw = cw.replace("import { ThemeWoodToneManager } from './ThemeWoodToneManager';", "import { ThemeWoodToneManager } from './ThemeWoodToneManager';\nimport { ThemeDuoToneManager } from './ThemeDuoToneManager';")

# 2. Type
if "'theme-duo'" not in cw[:1000]: # Check top of file
    cw = re.sub(r"export type AudioTheme = '(.*?)';", r"export type AudioTheme = '\1' | 'theme-duo';", cw)

# 3. SFX Hooks
hooks = ['type', 'delete', 'submit', 'gray', 'yellow', 'green', 'greenKnown', 'xp', 'xpbar', 'roundInfo', 'timer10', 'timer3', 'timer0', 'error', 'lose', 'hintWhoosh', 'hintReveal', 'bombDrop', 'bombExplode', 'win']

for hook in hooks:
    # Match hook: () => {
    # It looks like:
    #   hook: () => {
    #     if(currentTheme === 'theme-wood') ...
    
    # We find the start of the hook map
    match = re.search(f'  {hook}: \\(\\) => \\{{\\n', cw)
    if match:
        insert_idx = match.end()
        insertion = f"    if(currentTheme === 'theme-duo') {{ ThemeDuoToneManager.{hook}(); return; }}\n"
        # Only insert if not already there
        if "ThemeDuoToneManager." + hook not in cw[insert_idx:insert_idx+500]:
            cw = cw[:insert_idx] + insertion + cw[insert_idx:]

# 4. Toggler
cw = cw.replace("'theme-wood', 'streamer-premium'", "'theme-wood', 'theme-duo', 'streamer-premium'")

# 5. Toggler onClick init
cw = cw.replace("if (theme === 'theme-wood') { ThemeWoodToneManager.init(); }", "if (theme === 'theme-wood') { ThemeWoodToneManager.init(); }\n                      if (theme === 'theme-duo') { ThemeDuoToneManager.init(); }")

with open("src/CasualWordle.tsx", "w") as f:
    f.write(cw)
print("Integrated theme-duo")
