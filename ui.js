document.addEventListener('DOMContentLoaded', function () {
    // Define the HTML content
    const htmlContent = `
    <style>
        .chatbot-widget {
            font-family: 'Arial', sans-serif !important;
            background-color: #f8f9fa !important;
        }
        
        /* Popup message styling */
        .chatbot-widget #popup-message {
            position: fixed !important;
            bottom: 80px !important;
            left: 20px !important;
            background-color: #007bff !important;
            color: #fff !important;
            padding: 10px !important;
            border-radius: 10px !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) !important;
            font-size: 14px !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: opacity 0.5s ease, visibility 0s 0.5s !important;
            z-index: 1001 !important;
        }
        .chatbot-widget #popup-message.show {
            opacity: 1 !important;
            visibility: visible !important;
            transition-delay: 0s !important;
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
            max-height: calc(100% - 175px) !important;
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
            text-align: left !important;
        }
        
        .chatbot-widget .user-message {
            background-color: #007bff !important;
            color: #fff !important;
            margin-left: auto !important;
            margin-right: 10px !important;
            text-align: left !important;
        }
        
        .chatbot-widget .bot-message {
            background-color: #b2e0b2 !important;
            color: #000 !important;
            margin-left: 10px !important;
            margin-right: auto !important;
            text-align: left !important;
        }
        
        .chatbot-widget #chat-container.show {
            display: block !important;
        }

        .chatbot-widget #typing-indicator {
            font-style: italic !important;
            color: #666 !important;
            margin-bottom: 8px !important;
            margin-left: 40px !important;
            height: 20px !important; /* Keeps the padding consistent */
            display: block !important;
            text-align: left !important;
        }

        .chatbot-widget .d-flex {
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
                <!-- Typing indicator aligned with text box -->
                <div id="typing-indicator">Bot is typing...</div>
                <div class="d-flex">
                    <input type="text" id="user-input" placeholder="Type your message">
                    <button id="send-btn">Send</button>
                </div>
            </div>
        </div>
    <!-- Popup message -->
        <div id="popup-message">Click the chatbot to ask your questions!</div>
    </div>
    `;

    // Define the custom element
    class ChatbotWidget extends HTMLElement {
        constructor() {
            super();
            // Attach shadow DOM and add styles and HTML content
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = htmlContent;
        }

        connectedCallback() {
            this.setupEventListeners();
            this.hideTypingIndicator();
            this.sendMessage('bot', 'Hello there! Ask any question at once!');

            // Show the popup message with a delay
            setTimeout(() => {
                this.showPopupMessage();
            }, 777); // Adjust the delay as needed

        }

        setupEventListeners() {
            const shadowRoot = this.shadowRoot;

            const toggleChatContainer = () => {
                const chatContainer = shadowRoot.getElementById('chat-container');
                chatContainer.classList.toggle('show');
                this.hidePopupMessage(); // Hide popup when chat is opened
            };

            shadowRoot.getElementById('send-btn').addEventListener('click', () => {
                this.sendUserMessage();
            });

            shadowRoot.getElementById('user-input').addEventListener('keypress', (e) => {
                if (e.which === 13) {
                    this.sendUserMessage();
                }
            });

            shadowRoot.getElementById('toggle-chat-btn').addEventListener('click', () => {
                toggleChatContainer();
            });
        }

        async sendUserMessage() {
            const baseUrl = 'https://chatbotnode-4.onrender.com';
            const userInput = this.shadowRoot.getElementById('user-input').value;
            if (userInput.trim() !== '') {
                this.sendMessage('user', userInput);
                this.shadowRoot.getElementById('user-input').value = '';
        
                try {
                    // Add a short delay before showing the typing indicator
                    setTimeout(() => {
                        this.showTypingIndicator();
                    }, 1000);  // Delay of 1000ms before showing the indicator
        
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
                        this.sendMessage('bot', botResponse);
                    } else {
                        console.error('Server error:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error sending user message:', error);
                } finally {
                    // Hide typing indicator when response is fetched
                    this.hideTypingIndicator();
                }
            }
        }
        

        sendMessage(sender, message) {
            const chatContent = this.shadowRoot.getElementById('chat-content');
        
            // Regular expression to match URLs while handling potential trailing punctuation
            const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
        
            // Convert URLs in the message to clickable links
            let formattedMessage = message.replace(urlRegex, (url) => {
                const linkText = url.replace(/[.,;?)]$/, ''); // Remove trailing punctuation
                return `<a href="${linkText}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            });
        
            // Regular expression to remove citation references (e.g., " ")
            const citationRegex = /【\d+:\d+†source】/g; // Regex to match citation references
        
            // Remove citations from the formatted message
            formattedMessage = formattedMessage.replace(citationRegex, '');
        
            // Insert the cleaned-up message into the chat content
            chatContent.insertAdjacentHTML('beforeend', `<div class="chat-message ${sender}-message">${formattedMessage}</div>`);
            chatContent.scrollTop = chatContent.scrollHeight;
        }
        
        
        
        showTypingIndicator() {
            this.shadowRoot.getElementById('typing-indicator').textContent = 'Bot is typing...';
        }

        hideTypingIndicator() {
            this.shadowRoot.getElementById('typing-indicator').textContent = '';
        }

        showPopupMessage() {
            const popup = this.shadowRoot.getElementById('popup-message');
            popup.classList.add('show');
            // Automatically hide the popup after a certain time
            setTimeout(() => {
                this.hidePopupMessage();
            }, 4000); // Adjust the duration as needed
        }

        hidePopupMessage() {
            const popup = this.shadowRoot.getElementById('popup-message');
            popup.classList.remove('show');
        }
    }

    customElements.define('chatbot-widget', ChatbotWidget);
    const widget = document.createElement('chatbot-widget');
    document.body.appendChild(widget);
});
