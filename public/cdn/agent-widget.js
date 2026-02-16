(function () {
  var STYLE_ID = 'sulta-ai-widget-styles';

  function getScriptOrigin() {
    try {
      if (document.currentScript && document.currentScript.src) {
        return new URL(document.currentScript.src).origin;
      }
    } catch (error) {
      console.error('[Sulta AI Widget] Failed to detect script origin:', error);
    }
    return window.location.origin;
  }

  function clamp(value, min, max, fallback) {
    var n = Number(value);
    if (Number.isNaN(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function toText(value) {
    return typeof value === 'string' ? value : '';
  }

  function normalizeApiBase(apiBase) {
    var resolved = toText(apiBase).trim() || getScriptOrigin();
    return resolved.replace(/\/+$/, '');
  }

  function generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  class AIAgentWidget {
    constructor(config) {
      if (!config || !config.agentId) {
        throw new Error('initAIWidget requires an "agentId".');
      }

      this.config = {
        agentId: String(config.agentId),
        apiBase: normalizeApiBase(config.apiBase),
        position: config.position === 'bottom-left' ? 'bottom-left' : 'bottom-right',
        primaryColor: toText(config.primaryColor).trim() || '#3254f4',
        title: toText(config.title).trim() || 'Chat with our assistant',
        subtitle: toText(config.subtitle).trim() || 'We usually reply in a few seconds',
        placeholder: toText(config.placeholder).trim() || 'Type your message...',
        greeting: toText(config.greeting).trim() || 'Hello! How can I help you today?',
        sendButtonLabel: toText(config.sendButtonLabel).trim() || 'Send',
        errorMessage: toText(config.errorMessage).trim() || 'Sorry, I ran into an error. Please try again.',
        requestTimeoutMs: clamp(config.requestTimeoutMs, 3000, 120000, 30000),
        maxHistory: clamp(config.maxHistory, 2, 40, 20),
        maxStoredMessages: clamp(config.maxStoredMessages, 10, 120, 60),
        autoOpen: Boolean(config.autoOpen),
      };

      this.storageKey = 'sulta_widget_messages_' + this.config.agentId;
      this.isOpen = false;
      this.isSending = false;
      this.typingNode = null;

      this.messages = this.loadMessages();
      if (!this.messages.length) {
        this.messages = [
          {
            id: generateMessageId(),
            role: 'assistant',
            content: this.config.greeting,
            synthetic: true,
            timestamp: Date.now(),
          },
        ];
      }

      this.injectStyles();
      this.render();
      this.renderMessages();
      this.updateSendState();

      if (this.config.autoOpen) {
        this.toggleChat(true);
      }
    }

    injectStyles() {
      if (document.getElementById(STYLE_ID)) return;

      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = this.createStyles();
      document.head.appendChild(style);
    }

    createStyles() {
      return `
        .sulta-ai-widget-container {
          position: fixed;
          z-index: 999999;
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.4;
        }

        .sulta-ai-widget-container.bottom-right {
          right: 20px;
          bottom: 20px;
        }

        .sulta-ai-widget-container.bottom-left {
          left: 20px;
          bottom: 20px;
        }

        .sulta-ai-widget-button {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
          transition: transform 0.15s ease, filter 0.15s ease;
          color: #fff;
        }

        .sulta-ai-widget-button:hover {
          transform: translateY(-1px) scale(1.02);
          filter: brightness(1.05);
        }

        .sulta-ai-widget-button:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 2px;
        }

        .sulta-ai-widget-chat {
          position: absolute;
          bottom: 72px;
          width: min(380px, calc(100vw - 24px));
          height: min(560px, calc(100vh - 96px));
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.24);
          display: none;
          flex-direction: column;
          border: 1px solid rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .sulta-ai-widget-container.bottom-right .sulta-ai-widget-chat {
          right: 0;
        }

        .sulta-ai-widget-container.bottom-left .sulta-ai-widget-chat {
          left: 0;
        }

        .sulta-ai-widget-chat.open {
          display: flex;
          animation: sulta-widget-slide-in 0.18s ease-out;
        }

        @keyframes sulta-widget-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sulta-ai-widget-header {
          padding: 14px 14px 12px;
          background: var(--sulta-widget-primary, #3254f4);
          color: #fff;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: flex-start;
        }

        .sulta-ai-widget-title-wrap {
          min-width: 0;
        }

        .sulta-ai-widget-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1px;
        }

        .sulta-ai-widget-subtitle {
          margin: 2px 0 0;
          font-size: 12px;
          opacity: 0.9;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .sulta-ai-widget-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sulta-ai-widget-action-btn {
          border: 0;
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background 0.15s ease;
        }

        .sulta-ai-widget-action-btn:hover {
          background: rgba(255, 255, 255, 0.28);
        }

        .sulta-ai-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: linear-gradient(180deg, #f9fafb 0%, #fff 30%);
        }

        .sulta-ai-widget-message {
          max-width: 86%;
          padding: 10px 12px;
          border-radius: 12px;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 14px;
          animation: sulta-widget-bubble-in 0.16s ease-out;
        }

        @keyframes sulta-widget-bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sulta-ai-widget-message.user {
          background: var(--sulta-widget-primary, #3254f4);
          color: #fff;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .sulta-ai-widget-message.assistant {
          background: #eef1f5;
          color: #0f172a;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .sulta-ai-widget-message.assistant.error {
          background: #fef2f2;
          color: #991b1b;
        }

        .sulta-ai-widget-typing {
          background: #eef1f5;
          border-radius: 12px;
          padding: 10px 12px;
          display: inline-flex;
          gap: 5px;
          align-self: flex-start;
        }

        .sulta-ai-widget-typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #64748b;
          opacity: 0.35;
          animation: sulta-widget-typing 1s infinite;
        }

        .sulta-ai-widget-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .sulta-ai-widget-typing-dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes sulta-widget-typing {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 0.85; transform: translateY(-1px); }
        }

        .sulta-ai-widget-input-wrap {
          border-top: 1px solid #e5e7eb;
          padding: 10px;
          background: #fff;
        }

        .sulta-ai-widget-input {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sulta-ai-widget-input input {
          flex: 1;
          min-width: 0;
          border: 1px solid #d1d5db;
          border-radius: 999px;
          padding: 10px 12px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .sulta-ai-widget-input input:focus {
          border-color: #94a3b8;
          box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.18);
        }

        .sulta-ai-widget-send {
          border: none;
          color: #fff;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .sulta-ai-widget-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .sulta-ai-widget-powered-by {
          margin: 8px 4px 2px;
          text-align: center;
          font-size: 11px;
          color: #64748b;
        }

        .sulta-ai-widget-powered-by a {
          color: inherit;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .sulta-ai-widget-container.bottom-right {
            right: 12px;
            bottom: 12px;
          }
          .sulta-ai-widget-container.bottom-left {
            left: 12px;
            bottom: 12px;
          }
          .sulta-ai-widget-chat {
            bottom: 68px;
            width: min(380px, calc(100vw - 24px));
            height: min(560px, calc(100vh - 88px));
          }
        }
      `;
    }

    render() {
      this.root = document.createElement('div');
      this.root.className = 'sulta-ai-widget-container ' + this.config.position;
      this.root.setAttribute('data-agent-id', this.config.agentId);

      this.root.innerHTML = `
        <button class="sulta-ai-widget-button" type="button" aria-label="Open chat assistant">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <section class="sulta-ai-widget-chat" aria-live="polite" aria-label="AI assistant chat panel">
          <header class="sulta-ai-widget-header">
            <div class="sulta-ai-widget-title-wrap">
              <h3 class="sulta-ai-widget-title"></h3>
              <p class="sulta-ai-widget-subtitle"></p>
            </div>
            <div class="sulta-ai-widget-actions">
              <button class="sulta-ai-widget-action-btn sulta-ai-widget-clear" type="button" title="Start a new conversation" aria-label="Start a new conversation">
                &#8635;
              </button>
              <button class="sulta-ai-widget-action-btn sulta-ai-widget-close" type="button" aria-label="Close chat">
                &#10005;
              </button>
            </div>
          </header>
          <div class="sulta-ai-widget-messages"></div>
          <div class="sulta-ai-widget-input-wrap">
            <form class="sulta-ai-widget-input">
              <input type="text" maxlength="2000" />
              <button class="sulta-ai-widget-send" type="submit"></button>
            </form>
            <p class="sulta-ai-widget-powered-by">
              Powered by <a href="https://ai.sultatech.com" target="_blank" rel="noopener noreferrer">Sulta AI</a>
            </p>
          </div>
        </section>
      `;

      document.body.appendChild(this.root);

      this.elements = {
        button: this.root.querySelector('.sulta-ai-widget-button'),
        chat: this.root.querySelector('.sulta-ai-widget-chat'),
        title: this.root.querySelector('.sulta-ai-widget-title'),
        subtitle: this.root.querySelector('.sulta-ai-widget-subtitle'),
        close: this.root.querySelector('.sulta-ai-widget-close'),
        clear: this.root.querySelector('.sulta-ai-widget-clear'),
        messages: this.root.querySelector('.sulta-ai-widget-messages'),
        form: this.root.querySelector('.sulta-ai-widget-input'),
        input: this.root.querySelector('.sulta-ai-widget-input input'),
        send: this.root.querySelector('.sulta-ai-widget-send'),
      };

      this.elements.title.textContent = this.config.title;
      this.elements.subtitle.textContent = this.config.subtitle;
      this.elements.input.placeholder = this.config.placeholder;
      this.elements.send.textContent = this.config.sendButtonLabel;

      this.root.style.setProperty('--sulta-widget-primary', this.config.primaryColor);
      this.elements.button.style.backgroundColor = this.config.primaryColor;
      this.elements.send.style.backgroundColor = this.config.primaryColor;
      this.elements.messages.style.scrollBehavior = 'smooth';

      this.bindEvents();
    }

    bindEvents() {
      this.elements.button.addEventListener('click', () => this.toggleChat());
      this.elements.close.addEventListener('click', () => this.toggleChat(false));
      this.elements.clear.addEventListener('click', () => this.clearConversation());
      this.elements.form.addEventListener('submit', (event) => this.handleSubmit(event));
      this.elements.input.addEventListener('input', () => this.updateSendState());
    }

    toggleChat(forceState) {
      if (typeof forceState === 'boolean') {
        this.isOpen = forceState;
      } else {
        this.isOpen = !this.isOpen;
      }

      this.elements.chat.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        this.scrollMessagesToBottom();
        this.elements.input.focus();
      }
    }

    clearConversation() {
      this.messages = [
        {
          id: generateMessageId(),
          role: 'assistant',
          content: this.config.greeting,
          synthetic: true,
          timestamp: Date.now(),
        },
      ];
      this.persistMessages();
      this.renderMessages();
    }

    handleSubmit(event) {
      event.preventDefault();
      if (this.isSending) return;

      var message = this.elements.input.value.trim();
      if (!message) return;

      this.elements.input.value = '';
      this.updateSendState();
      this.sendMessage(message);
    }

    async sendMessage(message) {
      this.addMessage('user', message);
      this.showTypingIndicator();
      this.isSending = true;
      this.updateSendState();
      this.elements.input.disabled = true;

      try {
        var data = await this.requestCompletion(message);
        var assistantContent = toText(data && (data.content || data.text)).trim();
        if (!assistantContent && data && data.choices && data.choices[0] && data.choices[0].message) {
          assistantContent = toText(data.choices[0].message.content).trim();
        }
        if (!assistantContent) {
          throw new Error('Empty completion response');
        }
        this.addMessage('assistant', assistantContent);
      } catch (error) {
        var errorSummary = error && error.message ? error.message : error;
        console.error('[Sulta AI Widget] sendMessage error:', errorSummary, error);
        this.addMessage('assistant', this.getDisplayErrorMessage(error), { error: true });
      } finally {
        this.hideTypingIndicator();
        this.isSending = false;
        this.elements.input.disabled = false;
        this.updateSendState();
        this.elements.input.focus();
      }
    }

    async requestCompletion(message) {
      var history = this.messages
        .filter(function (entry) {
          return (entry.role === 'user' || entry.role === 'assistant') && !entry.synthetic;
        })
        .slice(-this.config.maxHistory)
        .map(function (entry) {
          return {
            role: entry.role,
            content: entry.content,
          };
        });

      var userMessages = history.filter(function (entry) {
        return entry.role === 'user';
      }).length;

      var controller = new AbortController();
      var timeout = setTimeout(function () {
        controller.abort();
      }, this.config.requestTimeoutMs);

      try {
        var response = await fetch(this.config.apiBase + '/api/embed/chat', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            agentId: this.config.agentId,
            message: message,
            history: history,
            newChat: userMessages <= 1,
          }),
          signal: controller.signal,
        });

        var data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          var errorMessage = toText(data && data.error) || 'Request failed';
          var requestError = new Error(errorMessage);
          requestError.code = toText(data && data.code) || 'REQUEST_FAILED';
          requestError.status = response.status;
          requestError.payload = data;
          throw requestError;
        }

        return data;
      } catch (error) {
        if (error && error.name === 'AbortError') {
          var timeoutError = new Error('Request timed out. Please try again.');
          timeoutError.code = 'REQUEST_TIMEOUT';
          throw timeoutError;
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    }

    getDisplayErrorMessage(error) {
      var code = toText(error && error.code).toUpperCase();
      var message = toText(error && error.message);

      if (code === 'AGENT_PRIVATE') {
        return 'This agent is private. Set it to Public in your dashboard before using embed.';
      }
      if (code === 'AGENT_NOT_FOUND') {
        return 'This embedded agent could not be found. Please copy the embed code again.';
      }
      if (code === 'INVALID_AGENT_ID') {
        return 'Embed setup is missing an agentId. Please update your embed snippet.';
      }
      if (code === 'REQUEST_TIMEOUT') {
        return 'The request timed out. Please check your connection and try again.';
      }
      if (code === 'MODEL_AUTH_ERROR') {
        return 'The embed model is not configured on the server. Please set the model API key.';
      }
      if (code === 'MODEL_UNAVAILABLE') {
        return 'The selected model is currently unavailable. Please try again shortly.';
      }
      if (code === 'EMBED_INTERNAL_ERROR') {
        return 'Server error while generating a reply. Please try again.';
      }

      if (message) {
        return message;
      }

      return this.config.errorMessage;
    }

    showTypingIndicator() {
      this.hideTypingIndicator();

      var typing = document.createElement('div');
      typing.className = 'sulta-ai-widget-typing';
      for (var i = 0; i < 3; i += 1) {
        var dot = document.createElement('span');
        dot.className = 'sulta-ai-widget-typing-dot';
        typing.appendChild(dot);
      }

      this.typingNode = typing;
      this.elements.messages.appendChild(typing);
      this.scrollMessagesToBottom();
    }

    hideTypingIndicator() {
      if (this.typingNode && this.typingNode.parentNode) {
        this.typingNode.parentNode.removeChild(this.typingNode);
      }
      this.typingNode = null;
    }

    addMessage(role, content, options) {
      var entry = {
        id: generateMessageId(),
        role: role,
        content: toText(content),
        synthetic: Boolean(options && options.synthetic),
        error: Boolean(options && options.error),
        timestamp: Date.now(),
      };

      this.messages.push(entry);
      if (this.messages.length > this.config.maxStoredMessages) {
        this.messages = this.messages.slice(-this.config.maxStoredMessages);
      }

      this.persistMessages();
      this.renderMessages();
    }

    renderMessages() {
      this.elements.messages.innerHTML = '';

      for (var i = 0; i < this.messages.length; i += 1) {
        var msg = this.messages[i];
        var bubble = document.createElement('div');
        bubble.className = 'sulta-ai-widget-message ' + msg.role + (msg.error ? ' error' : '');
        bubble.textContent = msg.content;
        this.elements.messages.appendChild(bubble);
      }

      this.scrollMessagesToBottom();
    }

    scrollMessagesToBottom() {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    updateSendState() {
      var hasInput = this.elements.input.value.trim().length > 0;
      this.elements.send.disabled = this.isSending || !hasInput;
      this.elements.send.textContent = this.isSending ? '...' : this.config.sendButtonLabel;
      this.elements.send.style.backgroundColor = this.config.primaryColor;
    }

    loadMessages() {
      try {
        var raw = window.localStorage.getItem(this.storageKey);
        if (!raw) return [];

        var parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed
          .filter(function (entry) {
            return (
              entry &&
              (entry.role === 'user' || entry.role === 'assistant') &&
              typeof entry.content === 'string'
            );
          })
          .slice(-this.config.maxStoredMessages)
          .map(function (entry) {
            return {
              id: generateMessageId(),
              role: entry.role,
              content: entry.content,
              synthetic: Boolean(entry.synthetic),
              error: Boolean(entry.error),
              timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : Date.now(),
            };
          });
      } catch (error) {
        console.error('[Sulta AI Widget] Failed to load local history:', error);
        return [];
      }
    }

    persistMessages() {
      try {
        var serializable = this.messages.map(function (entry) {
          return {
            role: entry.role,
            content: entry.content,
            synthetic: Boolean(entry.synthetic),
            error: Boolean(entry.error),
            timestamp: entry.timestamp,
          };
        });
        window.localStorage.setItem(this.storageKey, JSON.stringify(serializable));
      } catch (error) {
        console.error('[Sulta AI Widget] Failed to persist local history:', error);
      }
    }
  }

  window.initAIWidget = function initAIWidget(config) {
    try {
      return new AIAgentWidget(config || {});
    } catch (error) {
      console.error('[Sulta AI Widget] Initialization failed:', error);
      return null;
    }
  };
})();
