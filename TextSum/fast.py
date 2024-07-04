from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import cohere
import os
import re
from translate import Translator

cohere_client = cohere.Client(api_key="your api key here")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def remove_artifacts(audio_path):

    audio = AudioSegment.from_file(audio_path)
    cleaned_audio = audio
    return cleaned_audio

def get_most_recent_file(directory: str, base_filename: str):
    pattern = re.compile(rf'{re.escape(base_filename)} \((\d+)\)\.txt')
    files = os.listdir(directory)
    
  
    matching_files = [file for file in files if pattern.match(file)]
    
    if matching_files:

        matching_files.sort(key=lambda file: os.path.getmtime(os.path.join(directory, file)), reverse=True)
        return os.path.join(directory, matching_files[0])
    else:

        default_file = os.path.join(directory, f"{base_filename}.txt")
        if os.path.exists(default_file):
            return default_file
        else:
            raise FileNotFoundError(f"No file found matching pattern {base_filename} (*) or {base_filename}.txt")

def translate_to_kannada(text):

    translator = Translator(to_lang="kn")


    translated_text = translator.translate(text)

    return translated_text

@app.post("/process")
async def process_text():
    try:

        directory = "C:/Users/Lenovo/Downloads"
        base_filename = "my-file"


        file_path = get_most_recent_file(directory, base_filename)


        with open(file_path, "r") as txt_file:
            transcribed_text = txt_file.read().strip()
        

        message = f"""
        Simplify and summarize the medical jargon into simple language below such that an illiterate person understands, don't ask follow-up.

        When the user describes their condition or procedure, provide them with the health needs and self care at home for such a condition in brief.
        Also, identify the symptoms of cardiac problem for an early detection when they describe their condition or procedure in brief.

        The above two lines only apply if the user describes their condition, otherwise, do not provide answers for it.

        Also provide relevant youtube links or terms that they can search up for their condition or the procedure.

        {transcribed_text}
        """

        response = cohere_client.chat(
            message=message,
            model="command-r-plus",
            temperature=0.3
        )

        simplified_text = response.text

        return {
            "response": simplified_text,
        }
    except FileNotFoundError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": str(e)}

@app.post("/translate_to_kan")
async def translate_to_kan(request: Request):
    try:
        request_data = await request.json()
        text_to_translate = request_data.get('text', '')

        if not text_to_translate:
            return {"error": "No text provided for translation"}


        translated_text = translate_to_kannada(text_to_translate)

        return {
            "translated_response": translated_text
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)
