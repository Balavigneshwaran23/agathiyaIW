const chatForm = document.getElementById("chatForm");
const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById('chatInput');
chatInput.focus();
const chatbox = document.getElementById('chatbox');
const spinner = document.querySelector('.spinner');





function displayMessage(message, isUser) {
  const msgElem = document.createElement('p');
  msgElem.textContent = message;
  msgElem.className = isUser ? 'chat-message1' : 'chat-message2';
  chatbox.appendChild(msgElem);
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

  const apiUrl = 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm1CRW5xTnNRaFMtSzJpZW9heVY1V1BDRHZCaFhZU1BDRk9BSFBUSGFqLS0xTTRid2NXWWNVOGZFQlJObE9adllLbWNjNnRobVBRSTVIYWNBN29CbXpERU9xQVE9PQ==';
                                          

  try {
      const prependPersona = apiUrl === 'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm1CRW5xTnNRaFMtSzJpZW9heVY1V1BDRHZCaFhZU1BDRk9BSFBUSGFqLS0xTTRid2NXWWNVOGZFQlJObE9adllLbWNjNnRobVBRSTVIYWNBN29CbXpERU9xQVE9PQ==';
      const data = await callApi(apiUrl, message.startsWith('/') ? message.substring(6).trim() : message, prependPersona);
      if (data.status === 'success') {
          if (message.toLowerCase().startsWith('/')) {
              handleImageResponse(data);
          } else {
              if (data.text.trim().toLowerCase().startsWith('/')) {
                  
                 
              } 
              else {
                  displayMessage(data.text, false);
              }
          }
      } else {
          handleError(data);
      }
  } catch (error) {
      handleError(error);
  }
  
});

// // scroll up
// var autoScrollInterval; // Variable to store auto-scroll interval

// // Function to auto-scroll down
// function autoScroll() {
//     var container = document.getElementById('scrollbar');
//     container.scrollTop = container.scrollHeight; // Set scrollTop to scrollHeight
// }

// // Start auto-scrolling
// function startAutoScroll() {
//     autoScrollInterval = setInterval(autoScroll, 1000); // Change the interval (milliseconds) as needed
// }

// // Stop auto-scrolling
// function stopAutoScroll() {
//     clearInterval(autoScrollInterval);
// }

// // Event listener for detecting manual scroll
// document.getElementById('scrollbar').addEventListener('scroll', function() {
//     // If the user scrolls up, stop auto-scrolling
//     if (this.scrollTop < this.scrollHeight - this.clientHeight) {
//         stopAutoScroll();
//     } else {
//         startAutoScroll();
//     }
// });

// // Start auto-scrolling initially
// startAutoScroll();


