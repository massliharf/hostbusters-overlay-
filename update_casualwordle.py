import re

with open('src/CasualWordle.tsx', 'r') as f:
    cw = f.read()

# Let's see the exact text for green: () => {
green_match = re.search(r'(  green: \(\) => \{.+?\},)', cw, re.DOTALL)
if green_match:
    green_block = green_match.group(1)
    greenKnown_block = green_block.replace('green:', 'greenKnown:').replace('.green();', '.greenKnown();')
    cw = cw.replace(green_block, green_block + '\n' + greenKnown_block)

    target_logic = "if (state === 'correct') playSFX('green');\n        else if (state === 'present') playSFX('yellow');\n        else playSFX('gray');"
    new_logic = "if (state === 'correct') {\n          if (newlyGreenCols.has(i)) playSFX('green');\n          else playSFX('greenKnown');\n        } else if (state === 'present') playSFX('yellow');\n        else playSFX('gray');"
    
    if target_logic in cw:
        cw = cw.replace(target_logic, new_logic)
        print("Replaced logic too!")
    else:
        print("Logic string not found exactly.")

    with open('src/CasualWordle.tsx', 'w') as f:
        f.write(cw)
    print("Updated CasualWordle.tsx green proxy")
else:
    print("Green proxy not found")
