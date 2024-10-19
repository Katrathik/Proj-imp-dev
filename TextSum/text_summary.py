import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest

text="""Samsung recently cancelled its in-person HMMC 2021 event, instead, committing to an online-only format. The South Korean tech giant
recently made it official, setting a time and date for the Samsung Galaxy MWC Virtual Event. The event will be held on June 28 at 17:15 UTC (22:45 IST) and will be live-streamed on YouTube. In its release, Samsung says that it will
introduce its "ever-expanding Galaxy device ecosystem". Samsung also plans to present the latest technologies and innovation efforts in
relation to the growing importance of smart device security.
Samsung will also showcase its vision for the future of smartwatches to provide new experiences for users and new opportunities for developers. Samsung also shared an image for the event with silhouettes of a smartwatch, a smartphone, a tablet and a laptop."""

def summarizer(rawdocs):
    stopwords = list(STOP_WORDS)
    # print(stopwords) # shows non important words to eliminate 

    nlp = spacy.load('en_core_web_sm')
    doc = nlp(rawdocs)
    # print(doc)

    # makes a list of words and punctuations
    tokens = [token.text for token in doc]
    # print(tokens)

    # make a word dictionary to count occurance of each word
    word_freq ={}
    for word in doc:
        # make a dict only of words not in stopwords and punctuations
        if word.text.lower() not in stopwords and word.text.lower() not in punctuation:
            # freq.keys() means each word in text not in above condition
            if word.text not in word_freq.keys():
                word_freq[word.text] = 1
            else:
                word_freq[word.text] += 1
    # print(word_freq)

    # pick words of max_freq
    max_freq = max(word_freq.values())
    # print(max_freq)

    # normalized_freq = word_freq/max_freq
    for word in word_freq.keys():
        word_freq[word] = word_freq[word]/max_freq
        
    # print(word_freq)

    # makes a list of sentences
    sentence_tokens = [sent for sent in doc.sents]
    # print(sentence_tokens)

    sent_scores={}

    for sent in sentence_tokens:
        # pick every word of a sentence
        for word in sent:
            if word.text.lower() in word_freq.keys():
                if sent not in sent_scores.keys():
                    # if sentence is not in sent_scores.keys(), make a new dict with sentence as key and count of it as 1 
                    sent_scores[sent] = word_freq[word.text]
                else:
                    sent_scores[sent] += word_freq[word.text]
                    
    # print(sent_scores)

    # select length for summary
    select_len = int(len(sentence_tokens) * 0.3)
    # print(select_len) --> 2

    # extract 2 senetnecs of highest frequency
    summary = nlargest(select_len, sent_scores, key=sent_scores.get)
    # print(summary)

    final_summary = [word.text for word in summary]
    summary = ' '.join(final_summary)
    
    return summary,doc,len(rawdocs.split(' ')) , len(summary.split(' '))

    