import os
import re

managers = [
    "MainGeoToneManager.ts", "MainTwoToneManager.ts", "MainThreeToneManager.ts", 
    "MainSixToneManager.ts", "ThemeWoodToneManager.ts", "PremiumToneManager.ts"
]

for m in managers:
    try:
        with open(f"src/{m}", "r") as f:
            content = f.read()
            type_m = re.search(r'(  type\(\)\s*\{.*?\n  })', content, re.DOTALL)
            del_m = re.search(r'(  delete\(\)\s*\{.*?\n  })', content, re.DOTALL)
            print(f"--- {m} ---")
            if type_m: print(type_m.group(1))
            if del_m: print(del_m.group(1))
    except Exception as e:
        print(f"Failed {m}")
