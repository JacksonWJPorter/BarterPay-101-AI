let currentThreadId = null;

document.addEventListener('DOMContentLoaded', function () {
  startNewConversation();
});

function startNewConversation() {
  fetch('http://127.0.0.1:5000/start')
    .then((response) => response.json())
    .then((data) => {
      currentThreadId = data.thread_id;
    })
    .catch((error) => {
      console.error('Error starting a new conversation:', error);
    });
}

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('chat-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const inputElement = document.getElementById('chat-input');
  const message = inputElement.value.trim();

  if (message && currentThreadId) {
    addMessageToChatbox('user', message);
    inputElement.value = '';

    fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, thread_id: currentThreadId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          addMessageToChatbox('system', data.error);
        } else {
          addMessageToChatbox('bot', data.response);
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        addMessageToChatbox('system', 'Could not send message.');
      });
  }
}

function addMessageToChatbox(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    const baseClasses =  'block mb-2 text-sm p-2 rounded-lg fit-content'; 
    const userClasses = 'bg-pink-500 text-white self-end max-w-[275px] float-right';
    const botClasses = 'bg-gray-100 text-black self-start max-w-[325px] float-left'; 
    const cleanedMessage = message.replace(/\[\d+\^source\]/g, '');
    const clearDiv = document.createElement('div');

    clearDiv.className = 'clear-both';
    messageElement.className = `${baseClasses} ${sender.toLowerCase() === 'user' ? userClasses : botClasses}`;
    messageElement.innerHTML = DOMPurify.sanitize(marked.parse(cleanedMessage)); // Parse the Markdown and sanitize it
  
    chatBox.appendChild(messageElement); // Append the element with parsed HTML
    chatBox.appendChild(clearDiv); // Clear the floats
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat box
}


  
