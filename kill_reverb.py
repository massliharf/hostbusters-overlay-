import os
import re

files = [f for f in os.listdir('src') if f.endswith('ToneManager.ts')]

for f_name in files:
    with open(f"src/{f_name}", "r") as f:
        content = f.read()

    # Kill Reverb and Delay
    content = re.sub(r'wet:\s*[0-9.]+', 'wet: 0', content)
    
    with open(f"src/{f_name}", "w") as f:
        f.write(content)

print("Killed all reverbs and delays.")
