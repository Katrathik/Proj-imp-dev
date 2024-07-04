const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const voiceText = document.getElementById('voiceText');
const textInput = document.getElementById('textInput');
const finalTextContainers = document.getElementById('finalTextContainers');
const enterConditionButton = document.getElementById('enterConditionButton');
const simplifyButton = document.getElementById('simplifyButton');
const translateButton = document.getElementById('translateButton');

let recognition;
let isRecording = false;
let resultant_text = '';

recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
enterConditionButton.addEventListener('click', enterCondition);
simplifyButton.addEventListener('click', processText);
translateButton.addEventListener('click', translateToKan);

function startRecording() {
    recordButton.disabled = true;
    stopButton.disabled = false;
    resultant_text = '';  

    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition.');
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isRecording = true;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                let finalText = capitalizeAndPunctuate(event.results[i][0].transcript);
                voiceText.innerHTML += `<p>${finalText}</p>`;
                resultant_text += `${finalText} `;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        voiceText.innerHTML = `<p>${interimTranscript}</p>`;
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };

    recognition.onend = () => {
        isRecording = false;
        recordButton.disabled = false;
        stopButton.disabled = true;
        console.log('Final text:', resultant_text);
        displayFinalText(resultant_text);
        sendTextToBackend(resultant_text);
    };

    recognition.start();
}

function stopRecording() {
    if (isRecording && recognition) {
        recognition.stop();
    }
}

function capitalizeAndPunctuate(text) {
    text = text.trim();
    if (text.length === 0) return text;

  
    text = text[0].toUpperCase() + text.slice(1);

   
    if (text[text.length - 1] !== '.' && text[text.length - 1] !== '?' && text[text.length - 1] !== '!') {
        text += '.';
    }

    return text;
}

function writeTextToFile(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-file.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function displayFinalText(text) {
    const newTextContainer = document.createElement('div');
    newTextContainer.classList.add('final-text-container');
    newTextContainer.innerText = text;
    finalTextContainers.appendChild(newTextContainer);
    finalTextContainers.style.display = 'block'; 


    writeTextToFile(text);
}

function enterCondition() {
    const enteredText = textInput.value.trim();
    if (enteredText !== '') {
        displayFinalText(enteredText);
        sendTextToBackend(enteredText); 
    }
}

async function processText() {
    try {
        const response = await fetch('http://localhost:8888/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.response) {
            const newTextContainer = document.createElement('div');
            newTextContainer.classList.add('new-final-text-container');
            newTextContainer.style.float = 'left';
            newTextContainer.innerText = data.response; 
            finalTextContainers.appendChild(newTextContainer);
            newTextContainer.style.display = 'block';
        } else {
            console.error('Error:', data.error);
            alert('Error processing text: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing text.');
    }
}

async function translateToKan() {
    try {
       
        const newFinalTextContainers = document.getElementsByClassName('new-final-text-container');
        const mostRecentContainer = newFinalTextContainers[newFinalTextContainers.length - 1];
        const textToTranslate = mostRecentContainer ? mostRecentContainer.innerText : '';

        if (!textToTranslate) {
            alert('No text available for translation');
            return;
        }

        const response = await fetch('http://localhost:8888/translate_to_kan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: textToTranslate })
        });

        const data = await response.json();
        if (data.translated_response) {
            const newTextContainer = document.createElement('div');
            newTextContainer.classList.add('kan-text-container');
            newTextContainer.style.float = 'left';
            newTextContainer.innerText = data.translated_response; 
            finalTextContainers.appendChild(newTextContainer);
            newTextContainer.style.display = 'block';
        } else {
            console.error('Error:', data.error);
            alert('Error processing text: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing text.');
    }
}
