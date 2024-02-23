let currentThreadId = null;

document.addEventListener('DOMContentLoaded', function () {
  startNewConversation();
});

function startNewConversation() {
  fetch('http://127.0.0.1:5000/start')
    .then((response) => response.json())
    .then((data) => {
      currentThreadId = data.thread_id;
      // Enable chat input and send button here if necessary
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
    messageElement.classList.add('chat-message', sender.toLowerCase());
  
    // Use the marked function imported at the top
    const messageHtml = marked(message);
    const safeHtml = DOMPurify.sanitize(messageHtml);
    messageElement.innerHTML = safeHtml;
  
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
