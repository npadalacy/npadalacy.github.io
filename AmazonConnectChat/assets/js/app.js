/*!
 * AmazonConnectChat – app.js
 * Demo chat modal with simple bot automation (no dependencies).
 * CY-1
 */
(function () {
  "use strict";

  /* ── Bot script ──────────────────────────────────── */
  var BOT_SCRIPT = [
    { delay: 800,  text: "Hi there! 👋 Welcome to Amazon Connect Chat support. How can I help you today?" },
    { delay: 2000, text: "You can ask about account setup, pricing, integration guides, or request a live agent." },
  ];

  var AUTO_REPLIES = {
    default:      "Thanks for reaching out! Let me connect you with the right support team. ⏳",
    pricing:      "Our pricing is usage-based. You pay only for what you use — starting at $0.004 per message. 💰 Want a detailed breakdown?",
    setup:        "Getting started is easy! You can launch Amazon Connect in under 10 minutes. Would you like a step-by-step guide?",
    integration:  "Amazon Connect integrates natively with AWS services like Lambda, S3, Lex, and more. Which integration are you looking for?",
    agent:        "Connecting you to a live agent now… ⚡ Average wait time is under 2 minutes.",
    hello:        "Hello! 😊 Great to hear from you. What can I assist you with today?",
    help:         "Sure! Here are some things I can help with:\n• Account & billing\n• Technical setup\n• Integrations\n• Live agent escalation",
  };

  /* ── Helpers ──────────────────────────────────────── */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>");
  }

  function now() {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
  }

  function pickReply(text) {
    var lower = text.toLowerCase();
    if (/hello|hi|hey|greet/.test(lower))         return AUTO_REPLIES.hello;
    if (/price|pricing|cost|fee|charge/.test(lower)) return AUTO_REPLIES.pricing;
    if (/setup|start|begin|onboard|create/.test(lower)) return AUTO_REPLIES.setup;
    if (/integrat|connect|lambda|lex|s3/.test(lower))   return AUTO_REPLIES.integration;
    if (/agent|human|person|live|representative/.test(lower)) return AUTO_REPLIES.agent;
    if (/help|assist|support/.test(lower))         return AUTO_REPLIES.help;
    return AUTO_REPLIES.default;
  }

  /* ── Message renderer ──────────────────────────────── */
  function createMsg(text, isUser) {
    var wrap = document.createElement("div");
    wrap.className = "msg " + (isUser ? "msg-user" : "msg-agent");
    var bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = escapeHtml(text);
    var time = document.createElement("div");
    time.className = "msg-time";
    time.textContent = now();
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    return wrap;
  }

  function createTyping() {
    var wrap = document.createElement("div");
    wrap.className = "msg msg-agent";
    wrap.innerHTML =
      '<div class="typing-indicator">' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
        '<div class="typing-dot"></div>' +
      '</div>';
    return wrap;
  }

  /* ── Modal controller ──────────────────────────────── */
  var ChatModal = (function () {
    var overlay, messageList, inputEl, sendBtn, fab;
    var opened = false;
    var scriptStep = 0;

    function scrollToBottom() {
      messageList.scrollTop = messageList.scrollHeight;
    }

    function addAgentMsg(text) {
      var typing = createTyping();
      messageList.appendChild(typing);
      scrollToBottom();
      var delay = Math.min(600 + text.length * 18, 2200);
      setTimeout(function () {
        messageList.removeChild(typing);
        messageList.appendChild(createMsg(text, false));
        scrollToBottom();
      }, delay);
    }

    function sendUserMsg() {
      var text = inputEl.value.trim();
      if (!text) return;
      inputEl.value = "";
      messageList.appendChild(createMsg(text, true));
      scrollToBottom();
      setTimeout(function () {
        addAgentMsg(pickReply(text));
      }, 400);
    }

    function runScript() {
      if (scriptStep >= BOT_SCRIPT.length) return;
      var step = BOT_SCRIPT[scriptStep++];
      setTimeout(function () {
        addAgentMsg(step.text);
        runScript();
      }, step.delay);
    }

    function open() {
      overlay.classList.add("active");
      inputEl.focus();
      if (!opened) {
        opened = true;
        runScript();
        // hide badge
        var badge = fab.querySelector(".chat-fab-badge");
        if (badge) badge.style.display = "none";
      }
    }

    function close() {
      overlay.classList.remove("active");
    }

    function init() {
      overlay    = document.getElementById("chatModalOverlay");
      messageList = document.getElementById("modalMessages");
      inputEl    = document.getElementById("modalInput");
      sendBtn    = document.getElementById("modalSend");
      fab        = document.getElementById("chatFab");

      if (!overlay) return;

      // Open triggers
      fab.addEventListener("click", open);
      var triggers = document.querySelectorAll("[data-chat-open]");
      for (var i = 0; i < triggers.length; i++) {
        triggers[i].addEventListener("click", function (e) {
          e.preventDefault();
          open();
        });
      }

      // Close
      document.getElementById("modalClose").addEventListener("click", close);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });

      // Send
      sendBtn.addEventListener("click", sendUserMsg);
      inputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") sendUserMsg();
      });

      // Keyboard accessibility
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
      });
    }

    return { init: init };
  })();

  /* ── Smooth scroll for anchor links ──────────────────── */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        var target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  /* ── Intersection-based fade-in ──────────────────────── */
  function initAnimations() {
    if (!window.IntersectionObserver) return;
    var items = document.querySelectorAll(".feature-card, .step, .stat-item");
    items.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ── Boot ──────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    ChatModal.init();
    initSmoothScroll();
    initAnimations();
  });
})();
