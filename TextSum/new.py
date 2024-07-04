from fastapi import FastAPI, File, UploadFile
from pydub import AudioSegment
import speech_recognition as sr
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import cohere

cohere_client = cohere.Client(api_key="LZRnRv5n01FstPlegclWMSQjnN40iTGSNZboecQQ")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (change as needed)
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def remove_artifacts(audio_path):
    # Apply artifact removal techniques here
    # For example, you can use AudioSegment's built-in methods to apply filters or effects
    audio = AudioSegment.from_file(audio_path)
    # Apply noise reduction, normalization, filtering, etc.
    cleaned_audio = audio  # Placeholder, replace with actual artifact-free audio
    return cleaned_audio

@app.post("/upload")
async def convert_audio_to_text(audio_file: UploadFile = File(...)):
    try:
        # Save the uploaded audio file
        with open("tejas.mp3", "wb") as f:
            shutil.copyfileobj(audio_file.file, f)
        
        # Remove artifacts from audio
        cleaned_audio = remove_artifacts("tejas.mp3")
        cleaned_audio.export("cleaned_tejas.wav", format="wav")
        
        # Use speech recognition library to transcribe cleaned audio
        recognizer = sr.Recognizer()
        with sr.AudioFile("cleaned_tejas.wav") as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
        
        # Save the transcribed text to a local file
        with open("transcribed_text.txt", "w") as txt_file:
            txt_file.write(text)
        
        return {"message": "Transcription complete. Text saved to transcribed_text.txt"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/process")
async def process_text():
    try:
        # Read the transcribed text from the file
        with open("transcribed_text.txt", "r") as txt_file:
            transcribed_text = txt_file.read().strip()
        
        # Construct message for Cohere
        message = f"""
        Simplify the medical jargon into simple language below such that an illiterate person understands, don't ask follow up.

        {transcribed_text}
        """

        # Use Cohere to process the text
        response = cohere_client.chat(
            message=message,
            model="command-r-plus",
            temperature=0.3
        )

        return response.text
    except Exception as e:
        return {"error": str(e)}

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)