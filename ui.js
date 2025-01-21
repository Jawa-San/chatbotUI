document.addEventListener('DOMContentLoaded', (function(document) {
    // Encapsulate the entire script to prevent global scope pollution

    // Define the HTML content without global functions
    const htmlContent = `
    <style>
        /* Container Styles */
        .chatbot-widget {
            font-family: 'Arial', sans-serif;
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
        }

        /* Toggle Button Styles */
        #toggle-chat-btn {
            width: 50px;
            height: 50px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
        }

        #toggle-chat-btn:hover,
        #toggle-chat-btn:focus {
            background-color: #0056b3;
            outline: none;
        }

        /* Popup Message Styles */
        #popup-message {
            position: fixed;
            bottom: 80px;
            left: 20px;
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0s 0.5s;
        }

        #popup-message.show {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        /* Chat Container Styles */
        #chat-container {
            background-color: #f0f0f0;
            display: none;
            text-align: center;
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 300px;
            height: 500px;
            overflow: hidden;
            transition: max-height 0.3s ease-out, opacity 0.3s ease;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        #chat-container.show {
            display: block;
            opacity: 1;
        }

        /* Chat Content Styles */
        .p-3 {
            padding: 15px;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        #chat-content {
            flex-grow: 1;
            overflow-y: auto;
            margin-bottom: 10px;
        }

        .chat-message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 15px;
            word-wrap: break-word;
            width: fit-content;
            max-width: 80%;
            min-height: 20px;
            text-align: left;
        }

        .user-message {
            background-color: #007bff;
            color: #fff;
            margin-left: auto;
            margin-right: 10px;
        }

        .bot-message {
            background-color: #b2e0b2;
            color: #000;
            margin-left: 10px;
            margin-right: auto;
        }

        /* Typing Indicator Styles */
        #typing-indicator {
            font-style: italic;
            color: #666;
            margin-bottom: 8px;
            margin-left: 10px;
            height: 20px; /* Maintains consistent padding */
            display: none;
            text-align: left;
        }

        /* Input and Button Styles */
        .input-container {
            display: flex;
            align-items: center;
        }

        #user-input {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 8px;
        }

        #send-btn {
            padding: 8px 16px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        #send-btn:hover,
        #send-btn:focus {
            background-color: #0056b3;
            outline: none;
        }

        /* FAQ Button Styles */
        .faq-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 10px;
        }

        .faq-container button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80%;
            margin: 5px 0;
            padding: 8px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .faq-container button:hover,
        .faq-container button:focus {
            background-color: #0056b3;
            outline: none;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            #chat-container {
                width: 90%;
                height: 80%;
                left: 5%;
                bottom: 70px;
            }

            #toggle-chat-btn {
                width: 40px;
                height: 40px;
                bottom: 15px;
                left: 15px;
            }
        }
    </style>
    <div class="chatbot-widget">
        <!-- Toggle Button -->
        <button id="toggle-chat-btn" role="button" aria-label="Open chat" tabindex="0">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAKUlEQVR4Ae3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAgD9GAAAFgN4aAAAAAElFTkSuQmCC" alt="Chat Icon" style="width: 100%; height: 100%; border-radius: 50%;">
        </button>

        <!-- Popup Message -->
        <div id="popup-message" aria-live="polite">Click this icon to answer any questions you may have!</div>

        <!-- Chat Container -->
        <div id="chat-container" role="dialog" aria-modal="true" aria-labelledby="chat-title">
            <div class="p-3">
                <h5 id="chat-title">Chatbot</h5>
                <div id="chat-content">
                    <div class="chat-message bot-message">
                        Hi there! Ask a question or choose from the options below!
                    </div>
                    <!-- FAQ Section -->
                    <div class="faq-container">
                        <button>Who is Joshua?</button>
                        <button>What skills does Joshua have?</button>
                        <button>Which college did Joshua attend?</button>
                    </div>
                </div>
                <!-- Typing Indicator -->
                <div id="typing-indicator" aria-live="polite">Bot is typing...</div>
                <!-- Input and Send Button -->
                <div class="input-container">
                    <input type="text" id="user-input" placeholder="Type your message" aria-label="User input">
                    <button id="send-btn" aria-label="Send message">Send</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Define the custom element
    class ChatbotWidget extends HTMLElement {
        constructor() {
            super();
            // Attach closed shadow DOM for better encapsulation
            const shadow = this.attachShadow({ mode: 'closed' });
            shadow.innerHTML = htmlContent;
        }

        connectedCallback() {
            this.setupEventListeners();
            this.hideTypingIndicator();

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

                if (chatContainer.classList.contains('show')) {
                    shadowRoot.getElementById('user-input').focus();
                }
            };

            // Toggle Chat on Button Click
            const toggleBtn = shadowRoot.getElementById('toggle-chat-btn');
            toggleBtn.addEventListener('click', () => {
                toggleChatContainer();
            });

            // Toggle Chat on Keyboard (Enter or Space)
            toggleBtn.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    toggleChatContainer();
                }
            });

            // Send Button Click
            shadowRoot.getElementById('send-btn').addEventListener('click', () => {
                this.sendUserMessage();
            });

            // Send Message on Enter Key in Input
            shadowRoot.getElementById('user-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendUserMessage();
                }
            });

            // FAQ Buttons Click
            shadowRoot.querySelectorAll('.faq-container button').forEach(button => {
                button.addEventListener('click', () => {
                    const question = button.textContent.trim();
                    this.handleFaqQuestion(question);
                });
            });
        }

        async sendUserMessage() {
            const baseUrl = 'https://chatbotnode-4.onrender.com';
            const userInputElem = this.shadowRoot.getElementById('user-input');
            const userInput = userInputElem.value;
            const faqContainer = this.shadowRoot.querySelector('.faq-container');

            if (userInput.trim() !== '') {
                this.sendMessage('user', userInput);
                userInputElem.value = '';

                try {
                    // Hide the FAQ options whenever a user message is sent
                    faqContainer.style.display = 'none';
                    // Add a short delay before showing the typing indicator
                    setTimeout(() => {
                        this.showTypingIndicator();
                    }, 500);  // Delay of 500ms before showing the indicator

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
                        this.sendMessage('bot', 'Sorry, there was an error processing your request.');
                    }
                } catch (error) {
                    console.error('Error sending user message:', error);
                    this.sendMessage('bot', 'Sorry, something went wrong.');
                } finally {
                    // Hide typing indicator when response is fetched
                    this.hideTypingIndicator();
                }
            }
        }

        handleFaqQuestion(question) {
            const userInputElem = this.shadowRoot.getElementById('user-input');
            userInputElem.value = question;
            this.sendUserMessage();
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

            // Regular expression to remove citation references (e.g., "【1:2†source】")
            const citationRegex = /【\d+:\d+†source】/g; // Regex to match citation references

            // Remove citations from the formatted message
            formattedMessage = formattedMessage.replace(citationRegex, '');

            // Insert the cleaned-up message into the chat content
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', `${sender}-message`);
            messageDiv.innerHTML = formattedMessage;
            chatContent.appendChild(messageDiv);
            chatContent.scrollTop = chatContent.scrollHeight;
        }

        showTypingIndicator() {
            const typingIndicator = this.shadowRoot.getElementById('typing-indicator');
            typingIndicator.textContent = 'Bot is typing...';
            typingIndicator.style.display = 'block';
        }

        hideTypingIndicator() {
            const typingIndicator = this.shadowRoot.getElementById('typing-indicator');
            typingIndicator.textContent = '';
            typingIndicator.style.display = 'none';
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

    // Define and append the custom element
    customElements.define('chatbot-widget', ChatbotWidget);
    const widget = document.createElement('chatbot-widget');
    document.body.appendChild(widget);

})(document));
