document.addEventListener('DOMContentLoaded', function() {
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeChatbot = document.querySelector('.close-chatbot');
    const chatInput = document.getElementById('chatbot-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chatbot-messages');

    // Toggle chatbot window
    chatbotIcon.addEventListener('click', function() {
        chatbotWindow.style.display = 'flex';
    });

    closeChatbot.addEventListener('click', function() {
        chatbotWindow.style.display = 'none';
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'user-message');
        chatInput.value = '';

        // Simulate typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message bot-message typing';
        typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Process message and get response
        setTimeout(() => {
            // Remove typing indicator
            chatMessages.removeChild(typingIndicator);
            
            // Get bot response
            const response = getBotResponse(message);
            addMessage(response, 'bot-message');
        }, 1500);
    }

    // Add message to chat
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${className}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get bot response
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Common questions and responses
        const responses = {
            'hi|hello|hey': 'Hello! I am aeon. How can I assist you today?',
            'services|what do you do': 'We offer IT, AI, Robotics, EV, Drones, Design, Construction, IoT, Marketing, Business Development, and Consultancy services. Visit our <a href="services.html">services page</a> for more details.',
            'contact|how to reach': 'You can reach us at info@ambron.com or call +91-9970147351. Visit our <a href="contact.html">contact page</a> for more options.',
            'careers|jobs|hiring': 'We\'re always looking for talented individuals. Check our <a href="careers.html">careers page</a> for current openings.',
            'about|who are you': 'Ambron is an innovation-driven company that empowers organizations with smart, sustainable solutions. Learn more <a href="about.html">about us</a>.',
            'default': 'I\'m sorry, I didn\'t understand that. Could you please rephrase? For specific inquiries, you can contact us directly.'
            
        };

        // Find matching response
        for (const pattern in responses) {
            const regex = new RegExp(pattern, 'i');
            if (regex.test(lowerMessage)) {
                return responses[pattern];
            }
        }

        return responses['default'];
    }

    // Event listeners for sending messages
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});