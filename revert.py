import re
import os

with open("src/CasualWordle.tsx", "r") as f:
    content = f.read()

themes_to_remove = [
    "theme-crystal", "theme-chillhop", "theme-scifi", "theme-water",
    "theme-retro", "theme-orchestral", "theme-synthwave", "theme-asmr", "theme-zen"
]

manager_patterns = [
    "ThemeCrystalToneManager", "ThemeChillhopToneManager", "ThemeScifiToneManager",
    "ThemeWaterToneManager", "ThemeRetroToneManager", "ThemeOrchestralToneManager",
    "ThemeSynthwaveToneManager", "ThemeASMRToneManager", "ThemeZenToneManager"
]

# Remove from AudioTheme type
for t in themes_to_remove:
    content = content.replace(f" | '{t}'", "")

# Remove imports and if statements and toggler map strings
lines = content.split('\n')
new_lines = []
for line in lines:
    remove_line = False
    for p in manager_patterns:
        if p in line:
            remove_line = True
            break
    
    if not remove_line:
        # Check if line contains the TOGGLER map array and remove the strings from it
        if "as AudioTheme[]).map" in line:
            for t in themes_to_remove:
                line = line.replace(f"'{t}', ", "")
        
        new_lines.append(line)

with open("src/CasualWordle.tsx", "w") as f:
    f.write('\n'.join(new_lines))

# Delete the files
for m in manager_patterns:
    try:
        os.remove(f"src/{m}.ts")
        print(f"Deleted src/{m}.ts")
    except FileNotFoundError:
        pass

print("Reverted themes crystal through zen.")
