document.addEventListener('DOMContentLoaded', function () {
    // Define the HTML content
    const htmlContent = `
        <style>
            body {
                padding-bottom: 56px; /* Adjusted for Bootstrap fixed navbar */
                font-family: 'Arial', sans-serif;
                background-color: #f8f9fa;
            }
            
            #toggle-chat-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                background-color: #007bff;
                color: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 50px;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            
            #chat-container {
                background-color: #f0f0f0;
                display: none;
                text-align: center;
                position: fixed;
                bottom: 80px;
                left: 20px;
                width: 300px;
                height: 400px; /* Fixed height for the chat container */
                overflow: hidden; /* Hide overflow content */
                transition: max-height 0.3s ease-out;
                border-radius: 15px;
                z-index: 1000;
            }
            
            #chat-content {
                max-height: calc(100% - 150px); /* Adjust the height as needed */
                overflow-y: auto;
            }
            
            #user-input {
                width: 70%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin-right: 8px;
                margin-bottom: 8px;
                display: inline-block;
            }
            
            #send-btn {
                padding: 8px 16px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                display: inline-block;
            }
            .chat-message {
                margin: 10px;
                padding: 10px;
                border-radius: 15px; /* Rounded corners for the chat bubbles */
                display: block; /* Each message will be on a new line */
                word-wrap: break-word; /* Allow words to break onto the next line if needed */
                width: fit-content;
                word-break: break-word;
                max-width: 80%; /* Adjust as necessary to set the maximum width of a chat bubble */
                min-height: 20px; /* Adjust as needed to ensure minimum height is maintained */
            }
            
            /* Style for user and bot messages */
            .user-message {
                background-color: #007bff;
                color: #fff;
                text-align: right;
                margin-left: auto;
                margin-right: 10px;
                clear: both;
                padding: 10px; /* Adjust padding to ensure text is not too close to the edges */
            }
            
            .bot-message {
                background-color: #b2e0b2;
                color: #000;
                text-align: left;
                margin-right: auto;
                margin-left: 10px;
                clear: both;
                padding: 10px; /* Adjust padding to ensure text is not too close to the edges */
            }
            
            #chat-container.show {
                display: block;
            }
        </style>
        <div id="toggle-chat-btn">
            <img src="./img/gpt.png" alt="Chat Icon" style="width: 100%; height: 100%; border-radius: 50%;">
        </div>
        <div id="chat-container" class="bg-light">
            <div class="p-3" style="height: 400px; overflow: auto;">
                <h5>Chatbot</h5>
                <div id="chat-content" style="height: calc(100% - 56px); overflow-y: auto;"></div>
                <div class="d-flex">
                    <input type="text" id="user-input" placeholder="Type your message">
                    <button id="send-btn">Send</button>
                </div>
            </div>
        </div>
    `;

    // Inject the HTML content
    document.body.insertAdjacentHTML('beforeend', htmlContent);

    // Function to toggle chat container
    function toggleChatContainer() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.classList.toggle('show');
    }

    // Function to scroll the chatbox window to the bottom
    function scrollChatToBottom() {
        var chatContent = document.getElementById('chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    // Event listener for send button click
    document.getElementById('send-btn').addEventListener('click', function () {
        sendUserMessage();
    });

    // Event listener for Enter key press in the input field
    document.getElementById('user-input').addEventListener('keypress', function (e) {
        if (e.which === 13) {
            sendUserMessage();
        }
    });

    // Event listener for toggle button click
    document.getElementById('toggle-chat-btn').addEventListener('click', function () {
        toggleChatContainer();
    });

    // Function to send user messages
    async function sendUserMessage() {
        const baseUrl = 'http://localhost:3000';
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() !== '') {
            sendMessage('user', userInput);
            document.getElementById('user-input').value = '';
            try {
                const response = await fetch(`${baseUrl}/processUserMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userInput }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const botResponse = data.botResponse;
                    sendMessage('bot', botResponse);
                } else {
                    console.error('Server error:', response.statusText);
                }

                var lastMessage = document.querySelector('.user-message:last-child');
                if (lastMessage) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error sending user message:', error);
            }
        }
    }

    // Function to display messages
    function sendMessage(sender, message) {
        const chatContent = document.getElementById('chat-content');
        chatContent.insertAdjacentHTML('beforeend', `<div class="chat-message ${sender}-message">${message}</div>`);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    // Simulate a greeting from the bot
    sendMessage('bot', 'Hello! Ask any question please!');
});
