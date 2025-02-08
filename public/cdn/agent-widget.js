

class AIAgentWidget {
    constructor(config) {
      this.config = {
        agentId: config.agentId,
        position: config.position || 'bottom-right',
        primaryColor: config.primaryColor || '#3254f4'
      };
      this.isOpen = false;
      this.messages = [{
        role: 'assistant',
        content: 'Hello! How can I help you today?'
      }];

      this.systemMessage = null;
      this.render();
    }
  
    async getSystemMessage() {
      try {
        const response = await fetch(`http://localhost:3000/api/LLM/openai/getSystemMessage`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          body: JSON.stringify({ agentId: this.config.agentId })
        });

        const data = await response.json();
        this.systemMessage = data.systemMessage;
        console.log(this.systemMessage)
      } catch (error) {
        console.error('Error fetching system message:', error);
        this.systemMessage = null;
      }
    }
    
  
    createStyles() {
      return `
        .ai-widget-container {
          position: fixed;
          ${this.config.position === 'bottom-right' ? 'right: 20px' : 'left: 20px'};
          bottom: 20px;
          z-index: 999999;
          font-family: system-ui, -apple-system, sans-serif;
        }
  
        .ai-widget-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: ${this.config.primaryColor};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
  
        .ai-widget-button:hover {
          transform: scale(1.05);
        }
  
        .ai-widget-chat {
          position: fixed;
          ${this.config.position === 'bottom-right' ? 'right: 20px' : 'left: 20px'};
          bottom: 90px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          display: none;
          flex-direction: column;
          transition: opacity 0.3s, transform 0.3s;
          opacity: 0;
          transform: translateY(10px);
        }
  
        .ai-widget-chat.open {
          display: flex;
          opacity: 1;
          transform: translateY(0);
        }
  
        .ai-widget-header {
          padding: 16px;
          background: ${this.config.primaryColor};
          color: white;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        .ai-widget-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
  
        .ai-widget-close:hover {
          background-color: rgba(255,255,255,0.1);
        }
  
        .ai-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
  
        .ai-widget-message {
          max-width: 80%;
          padding: 12px;
          border-radius: 12px;
          line-height: 1.4;
          font-size: 14px;
          animation: message-fade-in 0.3s ease-out;
        }
  
        @keyframes message-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
  
        .ai-widget-message.user {
          background: ${this.config.primaryColor};
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
  
        .ai-widget-message.assistant {
          background: #f0f0f0;
          color: black;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
  
        .ai-widget-input {
          padding: 16px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 8px;
        }
  
        .ai-widget-input input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s;
        }
  
        .ai-widget-input input:focus {
          border-color: ${this.config.primaryColor};
        }
  
        .ai-widget-send {
          padding: 8px 16px;
          background: ${this.config.primaryColor};
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: opacity 0.2s;
        }
  
        .ai-widget-powered-by {
      
          font-size: 12px;
          text-align: center;
          font-size: 12px;
        }
  
        .ai-widget-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
  
        .ai-widget-typing {
          display: flex;
          gap: 4px;
          padding: 12px;
          background: #f0f0f0;
          border-radius: 12px;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
  
        .ai-widget-typing-dot {
          width: 8px;
          height: 8px;
          background: #665;
          border-radius: 50%;
          opacity: 0.4;
        }
  
        .ai-widget-typing-dot:nth-child(1) { animation: typing 1s infinite; }
        .ai-widget-typing-dot:nth-child(2) { animation: typing 1s infinite 0.2s; }
        .ai-widget-typing-dot:nth-child(3) { animation: typing 1s infinite 0.4s; }
  
        @keyframes typing {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `;
    }
  
    async sendMessage(message) {
      const sendButton = document.querySelector('.ai-widget-send');
      const input = document.querySelector('.ai-widget-input input');
      sendButton.disabled = true;
      input.disabled = true;
  
      // Add user message
      this.addMessage('user', message);
  
      // Show typing indicator
      this.showTypingIndicator();
  
      try {
        const response = await fetch('https://ai.sultatech.com/api/LLM/openai/embedded-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: this.messages,
            prompt: message,
            systemMessage: this.systemMessage
          })
        });
  
        const data = await response.json();
        console.log(data)

        const botMessage = data.choices[0].message.content
        // Remove typing indicator and add response
        this.hideTypingIndicator();
        this.addMessage('assistant', botMessage);
      } catch (error) {
        this.hideTypingIndicator();
        this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
      }
  
      sendButton.disabled = false;
      input.disabled = false;
      input.focus();
    }
  
    showTypingIndicator() {
      const messagesDiv = document.querySelector('.ai-widget-messages');
      const typing = document.createElement('div');
      typing.className = 'ai-widget-typing';
      typing.innerHTML = `
        <div class="ai-widget-typing-dot"></div>
        <div class="ai-widget-typing-dot"></div>
        <div class="ai-widget-typing-dot"></div>
      `;
      messagesDiv.appendChild(typing);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  
    hideTypingIndicator() {
      const typing = document.querySelector('.ai-widget-typing');
      if (typing) typing.remove();
    }
  
    addMessage(role, content) {
      this.messages.push({ "role": role, "content": content });
      this.updateMessages();
    }
  
    updateMessages() {
      const messagesDiv = document.querySelector('.ai-widget-messages');
      messagesDiv.innerHTML = this.messages
        .map(msg => `
          <div class="ai-widget-message ${msg.role}">
            ${msg.content}
          </div>
        `)
        .join('');
      
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const input = document.querySelector('.ai-widget-input input');
      const message = input.value.trim();
      
      if (message) {
        this.sendMessage(message);
        input.value = '';
      }
    }
  
    render() {
      // Add styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = this.createStyles();
      document.head.appendChild(styleSheet);

      this.getSystemMessage();
  
      // Create widget HTML
      const widget = document.createElement('div');
      widget.className = 'ai-widget-container';
      widget.innerHTML = `
        <button class="ai-widget-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <div class="ai-widget-chat">
          <div class="ai-widget-header">
            <span>Chat with our team</span>
            <button class="ai-widget-close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="ai-widget-messages"></div>
          <form class="ai-widget-input">
            <input type="text" placeholder="Type your message..." />
            <button type="submit" class="ai-widget-send">Send</button>
          </form>
          <p class="ai-widget-powered-by">Powered by <a href='https://ai.sultatech.com'>Sulta AI</a></p>
        </div>
      `;
  
      // Add event listeners
      widget.querySelector('.ai-widget-button').addEventListener('click', () => this.toggleChat());
      widget.querySelector('.ai-widget-close').addEventListener('click', () => this.toggleChat());
      widget.querySelector('.ai-widget-input').addEventListener('submit', (e) => this.handleSubmit(e));
  
      // Add widget to page
      document.body.appendChild(widget);
  
      // Initialize messages
      this.updateMessages();
    }
  
    toggleChat() {
      this.isOpen = !this.isOpen;
      const chat = document.querySelector('.ai-widget-chat');
      chat.classList.toggle('open');
  
      if (this.isOpen) {
        document.querySelector('.ai-widget-input input').focus();
      }
    }
  }
  
  // Initialize widget
function initAIWidget (config) {
    new AIAgentWidget(config);
  };

  console.log('hbrebf!')