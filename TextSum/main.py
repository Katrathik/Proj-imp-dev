import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from collections import defaultdict
from string import punctuation
from heapq import nlargest
from transformers import T5ForConditionalGeneration, T5Tokenizer

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('punkt')

# Import the fine-tuned model and tokenizer
model = T5ForConditionalGeneration.from_pretrained("fine-tuned-t5-model_1")
tokenizer = T5Tokenizer.from_pretrained("fine-tuned-t5-model_1")

# Function to simplify technical text
def simplify_text(technical_text):
    input_text = "simplify: " + technical_text
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, padding="max_length", truncation=True)
    outputs = model.generate(inputs["input_ids"], max_length=512, num_beams=4, early_stopping=True)
    simplified_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return simplified_text

# Function to summarize text
def summarize_text(text, n=3):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Calculate word frequencies
    word_frequencies = defaultdict(int)
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word not in stopwords.words('english') and word not in punctuation:
                word_frequencies[word] += 1
    
    # Calculate sentence scores
    sentence_scores = {sentence: sum(word_frequencies.get(word.lower(), 0) for word in word_tokenize(sentence)) for sentence in sentences}
    
    # Select the top n sentences
    summary = nlargest(n, sentence_scores, key=sentence_scores.get)
    
    return ' '.join(summary)

# User input loop
while True:
    technical_text = input("Enter technical text (or type 'exit' to quit): ")
    if technical_text.lower() == 'exit':
        break
    simplified_text = simplify_text(technical_text)
    print("Simplified text:", simplified_text)
    
    summary = summarize_text(simplified_text,n=5)
    print("Summary:", summary)
