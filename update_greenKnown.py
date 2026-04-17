import os
import re

# 1. Update ToneManager files
managers = [f for f in os.listdir('src') if f.endswith('ToneManager.ts')]

for manager in managers:
    with open(f"src/{manager}", "r") as f:
        content = f.read()

    if "greenKnown()" in content:
        continue

    match = re.search(r'(  yellow\(\)\s*\{.*?\n  })', content, re.DOTALL)
    if match:
        yellow_block = match.group(1)
        greenKnown_block = yellow_block.replace('yellow()', 'greenKnown()')
        
        green_match = re.search(r'(  green\(\)\s*\{.*?\n  })', content, re.DOTALL)
        if green_match:
            green_block = green_match.group(1)
            content = content.replace(green_block, green_block + '\n\n' + greenKnown_block)
            with open(f"src/{manager}", "w") as f:
                f.write(content)
            print(f"Added greenKnown to {manager}")

# 2. Update CasualWordle.tsx SFX proxy
with open('src/CasualWordle.tsx', 'r') as f:
    cw = f.read()

if "greenKnown: () => {" not in cw:
    green_proxy_match = re.search(r'(  green: \(\) => \{\n(?:    if\(currentTheme === .*?\n)+\n?  \},)', cw, re.DOTALL)
    if green_proxy_match:
        green_proxy_block = green_proxy_match.group(1)
        
        # We need to change 'green' inside the string mapping
        greenKnown_proxy_block = green_proxy_block.replace('green:', 'greenKnown:').replace('.green();', '.greenKnown();')
        
        cw = cw.replace(green_proxy_block, green_proxy_block + '\n' + greenKnown_proxy_block)

        # 3. Update the logic where playSFX('green') is called
        target_logic = "if (state === 'correct') playSFX('green');\n        else if (state === 'present') playSFX('yellow');\n        else playSFX('gray');"
        new_logic = "if (state === 'correct') {\n          if (newlyGreenCols.has(i)) playSFX('green');\n          else playSFX('greenKnown');\n        } else if (state === 'present') playSFX('yellow');\n        else playSFX('gray');"
        
        cw = cw.replace(target_logic, new_logic)

        with open('src/CasualWordle.tsx', 'w') as f:
            f.write(cw)
        print("Updated CasualWordle.tsx")
