with open("src/CasualWordle.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "GeoToneManager" in line and not "MainGeoToneManager" in line and not "PremiumGeoToneManager" in line and not "PerfectGeoToneManager" in line:
        pass # Skip lines with exact GeoToneManager
    elif "GeoEnergeticToneManager" in line:
        pass # Skip lines with GeoEnergeticToneManager
    else:
        new_lines.append(line)

with open("src/CasualWordle.tsx", "w") as f:
    f.writelines(new_lines)
