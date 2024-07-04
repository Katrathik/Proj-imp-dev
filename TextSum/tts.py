from gtts import gTTS
import os

def text_to_speech(text, lang='kn'):
    # Create a gTTS object
    tts = gTTS(text=text, lang=lang, slow=False)

    # Save the audio file
    tts.save("output.mp3")

    # Play the audio file
    os.system("play output.mp3")  # For Windows
    # os.system("afplay output.mp3")For Linux, you can use the following command:
    # os.system("mpg321 output.mp3")

# Example usage:
text = "ನನ್ನ ಹೆಸರು ಗೋಪಾಲ್​"
text_to_speech(text)