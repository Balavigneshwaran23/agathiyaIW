const chatForm = document.getElementById("chatForm");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById('chatInput');
const chatbox = document.getElementById('scrollbar');
const spinner = document.querySelector('.spinner');

chatInput.focus();

function displayMessage(message, isUser) {
  const msgElem = document.createElement('p');
  msgElem.textContent = message;
  msgElem.className = isUser ? 'chat-message1' : 'chat-message2';
  chatbox.appendChild(msgElem);

// Scroll the chatbox to the bottom
chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
   
}

async function callApi(apiUrl, prompt, prependPersona = false) {
  const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({prompt})
  });

  chatInput.value = "";
  chatInput.disabled = false;
  sendButton.disabled = false;
  chatInput.focus();
  return response.json();
}

function handleError(error) {
  console.error('Error:', error);
  displayMessage('An error occurred. Please try again.', false);
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  displayMessage(message, true);
  chatInput.value = '';

  if (message.toLowerCase().includes('your name') || 
      message.toLowerCase().includes('what is your name') || 
      message.toLowerCase().includes('can you tell me your name?') || 
      message.toLowerCase().includes('what should i call you?') || 
      message.toLowerCase().includes('how should i address you?') || 
      message.toLowerCase().includes('do you have a name?') || 
      message.toLowerCase().includes('what do people call you?') || 
      message.toLowerCase().includes('what do you go by?') || 
      message.toLowerCase().includes('who am i talking to?') || 
      message.toLowerCase().includes('bot name') || 
      message.toLowerCase().includes('may i know your name?')) {
    displayMessage("I'm a agathiya!", false);
  } else if (message.toLowerCase().includes('tell me about yourself') || 
             message.toLowerCase().includes('Tell me a bit about yourself.') || 
             message.toLowerCase().includes("What's your story?") || 
             message.toLowerCase().includes('Can you share some information about yourself?')) {
          displayMessage("I am Agathiya, a digital assistant created to provide assistance and information to users. I am constantly learning and improving to offer the best possible support. I can answer questions, provide recommendations, and assist with a variety of tasks. My goal is to make your life easier and help you accomplish your goals. I was created by Mr. Balavigneshwaran.", false);
  } else {
    const apiUrl = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm1CRW5xTnNRaFMtSzJpZW9heVY1V1BDRHZCaFhZU1BDRk9BSFBUSGFqLS0xTTRid2NXWWNVOGZFQlJObE9adllLbWNjNnRobVBRSTVIYWNBN29CbXpERU9xQVE9PQ==';
    try {
        const prependPersona = apiUrl === 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm1CRW5xTnNRaFMtSzJpZW9heVY1V1BDRHZCaFhZU1BDRk9BSFBUSGFqLS0xTTRid2NXWWNVOGZFQlJObE9adllLbWNjNnRobVBRSTVIYWNBN29CbXpERU9xQVE9PQ==';
        const data = await callApi(apiUrl, message.startsWith('/') ? message.substring(6).trim() : message, prependPersona);
        if (data.status === 'success') {
            if (message.toLowerCase().startsWith('/')) {
                handleImageResponse(data);
            } else {
                if (data.text.trim().toLowerCase().startsWith('/')) {
                    // handle command response
                    // You can handle command responses here
                } else {
                    displayMessage(data.text, false);
                }
            }
        } else {
            handleError(data);
        }
    } catch (error) {
        handleError(error);
    }
  }
});