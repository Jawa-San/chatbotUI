document.addEventListener('DOMContentLoaded', function () {
    // Define the HTML content
    const htmlContent = `
    <style>
        .chatbot-widget {
            font-family: 'Arial', sans-serif !important;
            background-color: #f8f9fa !important;
        }
        
        .chatbot-widget #toggle-chat-btn {
            position: fixed !important;
            bottom: 20px !important;
            left: 20px !important;
            width: 50px !important;
            height: 50px !important;
            background-color: #007bff !important;
            color: #fff !important;
            border-radius: 50% !important;
            text-align: center !important;
            line-height: 50px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
        }
        
        .chatbot-widget #chat-container {
            background-color: #f0f0f0 !important;
            display: none !important;
            text-align: center !important;
            position: fixed !important;
            bottom: 80px !important;
            left: 20px !important;
            width: 300px !important;
            height: 400px !important;
            overflow: hidden !important;
            transition: max-height 0.3s ease-out !important;
            border-radius: 15px !important;
            z-index: 1000 !important;
        }
        
        .chatbot-widget #chat-content {
            max-height: calc(100% - 150px) !important;
            overflow-y: auto !important;
        }
        
        .chatbot-widget #user-input {
            width: 70% !important;
            padding: 8px !important;
            border: 1px solid #ccc !important;
            border-radius: 5px !important;
            margin-right: 8px !important;
            margin-bottom: 8px !important;
        }
        
        .chatbot-widget #send-btn {
            padding: 8px 16px !important;
            background-color: #007bff !important;
            color: #fff !important;
            border: none !important;
            border-radius: 5px !important;
            cursor: pointer !important;
        }
        
        .chatbot-widget .chat-message {
            margin: 10px !important;
            padding: 10px !important;
            border-radius: 15px !important;
            word-wrap: break-word !important;
            width: fit-content !important;
            max-width: 80% !important;
            min-height: 20px !important;
            text-align: left !important; /* Ensures text is left-aligned */
        }
        
        .chatbot-widget .user-message {
            background-color: #007bff !important;
            color: #fff !important;
            margin-left: auto !important;
            margin-right: 10px !important;
            text-align: left !important; /* Ensures text is left-aligned */
        }
        
        .chatbot-widget .bot-message {
            background-color: #b2e0b2 !important;
            color: #000 !important;
            margin-left: 10px !important;
            margin-right: auto !important;
            text-align: left !important; /* Ensures text is left-aligned */
        }
        
        .chatbot-widget #chat-container.show {
            display: block !important;
        }
    </style>
    <div class="chatbot-widget">
        <div id="toggle-chat-btn">
            <img src="https://openai.com/favicon.ico" alt="Chat Icon" style="width: 100%; height: 100%; border-radius: 50%;">
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
    sendMessage('bot', 'Hi Boss! Ask any question at once!');
});
