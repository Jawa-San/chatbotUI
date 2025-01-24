document.addEventListener('DOMContentLoaded', function () {
    // Define the HTML content with CSS variables
    const htmlContent = `
    <style>
        :host {
            --chatbot-primary-color: #007bff;
            --chatbot-bg-color: #f8f9fa;
            --chatbot-text-color: #000;
            --chatbot-font: 'Arial', sans-serif;
            --chatbot-border-radius: 15px;
            --chatbot-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            all: initial;  /* Reset all properties */
        }

        * {
            box-sizing: border-box;
            font-family: var(--chatbot-font);
        }

        .chatbot-container * {
            all: revert;
            box-sizing: border-box;
        }

        #popup-message {
            position: fixed;
            bottom: 80px;
            left: 20px;
            background-color: var(--chatbot-primary-color);
            color: white;
            padding: 10px;
            border-radius: 10px;
            box-shadow: var(--chatbot-shadow);
            font-size: 14px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0s 0.5s;
            z-index: 2147483647;
        }

        #popup-message.show {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        #toggle-chat-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            background-color: var(--chatbot-primary-color);
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            box-shadow: var(--chatbot-shadow);
            z-index: 2147483646;
        }

        #chat-container {
            background-color: var(--chatbot-bg-color);
            display: none;
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 300px;
            height: 500px;
            border-radius: var(--chatbot-border-radius);
            overflow: hidden;
            box-shadow: var(--chatbot-shadow);
            z-index: 2147483645;
        }

        #chat-content {
            height: calc(100% - 120px);
            overflow-y: auto;
            padding: 10px;
            background-color: white;
            display: flex;
            flex-direction: column;
        }

        .input-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            background-color: var(--chatbot-bg-color);
        }

        #user-input {
            width: 75%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-right: 5px;
        }

        #send-btn {
            width: 20%;
            padding: 8px;
            background-color: var(--chatbot-primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .chat-message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
            word-wrap: break-word;
        }

        .user-message {
            background-color: var(--chatbot-primary-color);
            color: white;
            margin-left: auto;
        }

        .bot-message {
            background-color:rgb(136, 150, 212);
            color: var(--chatbot-text-color);
            margin-right: auto;
        }

        #chat-container.show {
            display: block;
            z-index: 2147483646;
        }

        #typing-indicator {
            font-style: italic;
            color: #666;
            margin: 1px 20px;
            height: 20px;
        }

        .faq-container {
            padding: 10px;
        }

        .faq-container button {
            display: block;
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            background-color: var(--chatbot-primary-color);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: left;
        }

        .faq-container button:hover {
            opacity: 0.9;
        }
    </style>
    <div class="chatbot-container">
        <div id="toggle-chat-btn">
            <img src="https://openai.com/favicon.ico" alt="Chat Icon" style="width: 100%; height: 100%; border-radius: 50%;">
        </div>
        <div id="chat-container">
            <div style="padding: 15px; background-color: var(--chatbot-primary-color); color: white;">
                <h5 style="margin: 0;">Chatbot</h5>
            </div>
            <div id="chat-content">
                <div class="chat-message bot-message">
                    Hi there! How can I help you?
                </div>
                <div class="faq-container">
                    <button data-question="Who is Joshua?">Who is Joshua?</button>
                    <button data-question="What skills does Joshua have?">What skills does Joshua have?</button>
                    <button data-question="Which college did Joshua attend?">Which college did Joshua attend?</button>
                </div>
            </div>
            <div id="typing-indicator"></div>
            <div class="input-container">
                <input type="text" id="user-input" placeholder="Type your message">
                <button id="send-btn">Send</button>
            </div>
        </div>
        <div id="popup-message">Click this button to answer any questions you may have!</div>
    </div>
    `;

    class ChatbotWidget extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'closed' });
            this.shadow.innerHTML = htmlContent;
        }

        connectedCallback() {
            this.setupEventListeners();
            this.hideTypingIndicator();

            setTimeout(() => {
                this.showPopupMessage();
            }, 777);
        }

        setupEventListeners() {
            const toggleChatContainer = () => {
                const chatContainer = this.shadow.getElementById('chat-container');
                chatContainer.classList.toggle('show');
                this.hidePopupMessage();
            };

            this.shadow.getElementById('send-btn').addEventListener('click', () => {
                this.sendUserMessage();
            });

            this.shadow.getElementById('user-input').addEventListener('keypress', (e) => {
                if (e.which === 13) {
                    this.sendUserMessage();
                }
            });

            this.shadow.getElementById('toggle-chat-btn').addEventListener('click', () => {
                toggleChatContainer();
            });

            // Add event listener for FAQ buttons
            const faqContainer = this.shadow.querySelector('.faq-container');
            faqContainer.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    const question = e.target.dataset.question;
                    this.handleFaqQuestion(question);
                }
            });
        }

        handleFaqQuestion(question) {
            const userInput = this.shadow.getElementById('user-input');
            userInput.value = question;
            this.sendUserMessage();
            
            // Hide FAQ options after a question is clicked
            const faqContainer = this.shadow.querySelector('.faq-container');
            faqContainer.style.display = 'none';
            
            // Scroll to bottom
            const chatContent = this.shadow.getElementById('chat-content');
            chatContent.scrollTop = chatContent.scrollHeight;
        }

        async sendUserMessage() {
            const baseUrl = 'https://chatbotnode-4.onrender.com';
            const userInput = this.shadow.getElementById('user-input').value;
            const faqContainer = this.shadow.querySelector('.faq-container');

            if (userInput.trim() !== '') {
                this.sendMessage('user', userInput);
                this.shadow.getElementById('user-input').value = '';
        
                try {
                    faqContainer.style.display = 'none';
                    setTimeout(() => {
                        this.showTypingIndicator();
                    }, 1000);
        
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
                    this.hideTypingIndicator();
                }
            }
        }

        sendMessage(sender, message) {
            const chatContent = this.shadow.getElementById('chat-content');
            const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
        
            let formattedMessage = message.replace(urlRegex, (url) => {
                const linkText = url.replace(/[.,;?)]$/, '');
                return `<a href="${linkText}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
            });
        
            const citationRegex = /【\d+:\d+†source】/g;
            formattedMessage = formattedMessage.replace(citationRegex, '');
        
            chatContent.insertAdjacentHTML('beforeend', `<div class="chat-message ${sender}-message">${formattedMessage}</div>`);
            chatContent.scrollTop = chatContent.scrollHeight;
        }

        showTypingIndicator() {
            this.shadow.getElementById('typing-indicator').textContent = 'Bot is typing...';
        }

        hideTypingIndicator() {
            this.shadow.getElementById('typing-indicator').textContent = '';
        }

        showPopupMessage() {
            const popup = this.shadow.getElementById('popup-message');
            popup.classList.add('show');
            setTimeout(() => {
                this.hidePopupMessage();
            }, 4000);
        }

        hidePopupMessage() {
            const popup = this.shadow.getElementById('popup-message');
            popup.classList.remove('show');
        }
    }

    customElements.define('chatbot-widget', ChatbotWidget);
    const widget = document.createElement('chatbot-widget');
    document.body.appendChild(widget);
});
