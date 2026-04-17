import re
import os

with open("src/CasualWordle.tsx", "r") as f:
    content = f.read()

imports = re.findall(r"import\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s+from\s+['\"](.*ToneManager)['\"]", content)

for class_name, import_path in imports:
    file_path = f"src/{import_path.replace('./', '')}.ts"
    if not os.path.exists(file_path):
        print(f"MISSING: {class_name} -> {import_path}")
print("Verification complete.")
