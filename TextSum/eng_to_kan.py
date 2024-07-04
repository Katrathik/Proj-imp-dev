from googletrans import Translator

def translate_to_kannada(text):
    # Initialize the translator
    translator = Translator()

    # Translate the text to Kannada
    translated_text = translator.translate(text, src='en', dest='kn')

    return translated_text.text

# Example text to be translated
english_text = "Hello, how are you?"

# Translate the text to Kannada
kannada_text = translate_to_kannada(english_text)
print("Translated text in Kannada:", kannada_text)