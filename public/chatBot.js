(function () {

  const API_URL = "http://localhost:3000/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag && scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.warn("[Haze Desk AI] data-owner-id attribute is missing.");
    return;
  }

  /* ── Prevent double-init ── */
  if (window.__hazeDeskLoaded) return;
  window.__hazeDeskLoaded = true;

  /* ── State ── */
  let isOpen = false;
  let isTyping = false;
  let greetingDone = false;

  /* ───────────────────────────────────────────
     STYLES
  ─────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    #hd-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #111827;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      outline: none;
    }
    #hd-launcher:hover {
      background: #000;
      transform: scale(1.07);
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
    }
    #hd-launcher:active { transform: scale(0.95); }
    #hd-launcher svg { transition: transform 0.25s ease, opacity 0.2s ease; }
    #hd-launcher.open .hd-icon-chat   { transform: scale(0) rotate(-45deg); opacity: 0; }
    #hd-launcher.open .hd-icon-close  { transform: scale(1) rotate(0deg);  opacity: 1; }
    #hd-launcher:not(.open) .hd-icon-close { transform: scale(0) rotate(45deg); opacity: 0; }
    #hd-launcher:not(.open) .hd-icon-chat  { transform: scale(1) rotate(0deg);  opacity: 1; }

    #hd-widget {
      position: fixed;
      bottom: 88px;
      right: 24px;
      z-index: 99998;
      width: 360px;
      max-height: 540px;
      display: flex;
      flex-direction: column;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      box-shadow: 0 8px 48px rgba(0,0,0,0.13);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transform-origin: bottom right;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    }
    #hd-widget.hd-hidden {
      transform: scale(0.88) translateY(12px);
      opacity: 0;
      pointer-events: none;
    }

    #hd-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: #111827;
      border-bottom: 1px solid #1f2937;
      flex-shrink: 0;
    }
    #hd-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .hd-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #374151;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .hd-avatar svg { color: #d1d5db; }
    #hd-header-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #fff;
      letter-spacing: -0.3px;
    }
    #hd-header-sub {
      font-size: 11px;
      color: #6b7280;
      margin-top: 1px;
    }
    #hd-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      padding: 4px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      transition: color 0.15s, background 0.15s;
      outline: none;
    }
    #hd-close-btn:hover { color: #d1d5db; background: #1f2937; }

    #hd-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #hd-messages::-webkit-scrollbar { width: 4px; }
    #hd-messages::-webkit-scrollbar-track { background: transparent; }
    #hd-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

    .hd-bubble {
      max-width: 82%;
      padding: 10px 13px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.55;
      word-break: break-word;
      animation: hdBubbleIn 0.22s ease forwards;
    }
    @keyframes hdBubbleIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hd-bubble.user {
      align-self: flex-end;
      background: #111827;
      color: #fff;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .hd-bubble.assistant {
      align-self: flex-start;
      background: #f3f4f6;
      color: #374151;
      border-bottom-left-radius: 4px;
    }

    .hd-typing {
      align-self: flex-start;
      background: #f3f4f6;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      padding: 11px 14px;
      display: flex;
      gap: 4px;
      align-items: center;
      animation: hdBubbleIn 0.22s ease forwards;
    }
    .hd-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #9ca3af;
      display: block;
      animation: hdDot 1s infinite ease-in-out;
    }
    .hd-typing span:nth-child(1) { animation-delay: 0s; }
    .hd-typing span:nth-child(2) { animation-delay: 0.15s; }
    .hd-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes hdDot {
      0%, 80%, 100% { transform: translateY(0); }
      40%           { transform: translateY(-5px); }
    }

    #hd-footer {
      padding: 10px 12px;
      border-top: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      background: #fff;
    }
    #hd-input {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 9px 13px;
      font-size: 13px;
      font-family: inherit;
      color: #111827;
      background: #f9fafb;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
      resize: none;
      max-height: 100px;
      line-height: 1.4;
    }
    #hd-input::placeholder { color: #d1d5db; }
    #hd-input:focus {
      border-color: #9ca3af;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(156,163,175,0.15);
    }
    #hd-send {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: #111827;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.15s;
      outline: none;
    }
    #hd-send:hover:not(:disabled) { background: #000; }
    #hd-send:active:not(:disabled) { transform: scale(0.92); }
    #hd-send:disabled { opacity: 0.45; cursor: not-allowed; }
    #hd-send svg { color: #fff; }

    #hd-branding {
      text-align: center;
      padding: 6px 0 8px;
      font-size: 10.5px;
      color: #d1d5db;
      letter-spacing: 0.1px;
      flex-shrink: 0;
    }
    #hd-branding a {
      color: #9ca3af;
      text-decoration: none;
      font-weight: 500;
    }
    #hd-branding a:hover { color: #6b7280; }

    #hd-error-bar {
      margin: 0 12px 8px;
      padding: 8px 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      font-size: 12px;
      color: #b91c1c;
      display: none;
    }
    #hd-error-bar.visible { display: block; }

    @media (max-width: 420px) {
      #hd-widget {
        width: calc(100vw - 24px);
        right: 12px;
        bottom: 80px;
      }
      #hd-launcher { right: 12px; bottom: 14px; }
    }
  `;
  document.head.appendChild(style);

  /* ───────────────────────────────────────────
     DOM — Launcher button
  ─────────────────────────────────────────── */
  const launcher = document.createElement("button");
  launcher.id = "hd-launcher";
  launcher.setAttribute("aria-label", "Open chat");
  launcher.innerHTML = `
    <svg class="hd-icon-chat" style="position:absolute" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg class="hd-icon-close" style="position:absolute" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;
  document.body.appendChild(launcher);

  /* ───────────────────────────────────────────
     DOM — Widget
  ─────────────────────────────────────────── */
  const widget = document.createElement("div");
  widget.id = "hd-widget";
  widget.classList.add("hd-hidden");
  widget.setAttribute("role", "dialog");
  widget.setAttribute("aria-label", "Customer Support Chat");
  widget.innerHTML = `
    <div id="hd-header">
      <div id="hd-header-left">
        <div class="hd-avatar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <div id="hd-header-title">Customer Support</div>
          <div id="hd-header-sub">● Online</div>
        </div>
      </div>
      <button id="hd-close-btn" aria-label="Close chat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div id="hd-messages"></div>

    <div id="hd-error-bar" role="alert"></div>

    <div id="hd-footer">
      <textarea id="hd-input" rows="1" placeholder="Type a message…"></textarea>
      <button id="hd-send" aria-label="Send message">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>

    <div id="hd-branding">Powered by <a href="https://hazedesk.ai" target="_blank">Haze Desk AI</a></div>
  `;
  document.body.appendChild(widget);

  /* ── Element refs ── */
  const messagesEl = widget.querySelector("#hd-messages");
  const inputEl    = widget.querySelector("#hd-input");
  const sendBtn    = widget.querySelector("#hd-send");
  const closeBtn   = widget.querySelector("#hd-close-btn");
  const errorBar   = widget.querySelector("#hd-error-bar");

  /* ───────────────────────────────────────────
     HELPERS
  ─────────────────────────────────────────── */
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showError(msg) {
    errorBar.textContent = msg;
    errorBar.classList.add("visible");
    setTimeout(() => errorBar.classList.remove("visible"), 4000);
  }

  function appendBubble(role, text) {
    const div = document.createElement("div");
    div.className = `hd-bubble ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "hd-typing";
    el.id = "hd-typing-indicator";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("hd-typing-indicator");
    if (el) el.remove();
  }

  /* Auto-resize textarea */
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + "px";
  });

  /* ───────────────────────────────────────────
     OPEN / CLOSE
  ─────────────────────────────────────────── */
  function openWidget() {
    isOpen = true;
    widget.classList.remove("hd-hidden");
    launcher.classList.add("open");
    launcher.setAttribute("aria-label", "Close chat");

    // Show greeting only once
    if (!greetingDone) {
      greetingDone = true;
      showGreeting();
    }

    setTimeout(() => inputEl.focus(), 260);
  }

  function closeWidget() {
    isOpen = false;
    widget.classList.add("hd-hidden");
    launcher.classList.remove("open");
    launcher.setAttribute("aria-label", "Open chat");
  }

  launcher.addEventListener("click", () => isOpen ? closeWidget() : openWidget());
  closeBtn.addEventListener("click", closeWidget);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeWidget();
  });

  /* ───────────────────────────────────────────
     GREETING
     Sends "Hello" so the bot introduces itself
     using the business name from settings.
  ─────────────────────────────────────────── */
  async function showGreeting() {
    showTyping();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: "Hello" }),
      });

      hideTyping();

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      appendBubble("assistant", data.reply || "Hello! How can I help you today?");

    } catch {
      hideTyping();
      appendBubble("assistant", "Hello! How can I help you today?");
    }
  }

  /* ───────────────────────────────────────────
     SEND MESSAGE
  ─────────────────────────────────────────── */
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isTyping) return;

    appendBubble("user", text);

    inputEl.value = "";
    inputEl.style.height = "auto";

    isTyping = true;
    sendBtn.disabled = true;
    inputEl.disabled = true;

    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, message: text }),
      });

      hideTyping();

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error ${res.status}`);
      }

      const data = await res.json();
      appendBubble("assistant", data.reply || "Sorry, I couldn't understand that.");

    } catch (err) {
      hideTyping();
      showError("Something went wrong. Please try again.");
      console.error("[Haze Desk AI]", err);
    } finally {
      isTyping = false;
      sendBtn.disabled = false;
      inputEl.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();