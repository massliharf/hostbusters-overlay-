with open("src/CasualWordle.tsx", "r") as f:
    text = f.read()

# Replace 'streamer-sweet', from the array
text = text.replace("'streamer-sweet']", "]")
text = text.replace("'streamer-sweet', ", "")

with open("src/CasualWordle.tsx", "w") as f:
    f.write(text)

print("Hidden sweet")
