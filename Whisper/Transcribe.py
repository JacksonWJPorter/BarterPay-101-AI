import whisper

model = whisper.load_model("base")
result = model.transcribe("/Users/jackson/Library/CloudStorage/OneDrive-UniversityofWaterloo/VS Code/Whisper/bpCPA.mp4")

with open("transcription.txt", "w") as f:
    f.write(result["text"])


