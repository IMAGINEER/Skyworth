import fs from 'fs';
import path from 'path';

const BASE = 'D:/SkyworthCopy/SkyworthCopy/skyworth-static';

const headerHtml = fs.readFileSync(path.join(BASE, 'components/header-nav-vn.html'), 'utf8');
const footerHtml = fs.readFileSync(path.join(BASE, 'components/footer-vn.html'), 'utf8');

function escapeTemplate(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

const headerEscaped = escapeTemplate(headerHtml);
const footerEscaped = escapeTemplate(footerHtml);

const jsContent = `// Auto-generated component loader (VN version) - do not edit manually
const headerNavHTML = \`${headerEscaped}\`;

const footerHTML = \`${footerEscaped}\`;

// Inject immediately (script runs at end of body, DOM is ready)
(function () {
  var h = document.getElementById('header-nav-placeholder');
  if (h) h.innerHTML = headerNavHTML;
  var f = document.getElementById('footer-placeholder');
  if (f) f.innerHTML = footerHTML;

  // --- Chat Window: Initialize after footer is injected ---
  // Open chat window
  var openChatBtn = document.getElementById('open-chat');
  if (openChatBtn) {
    openChatBtn.onclick = function() {
      var chatWindow = document.getElementById('chat-window');
      if (chatWindow) chatWindow.classList.add('act');
    };
  }
  // Close chat window
  var closeChatBtn = document.getElementById('chat-close');
  if (closeChatBtn) {
    closeChatBtn.onclick = function() {
      var chatWindow = document.getElementById('chat-window');
      if (chatWindow) chatWindow.classList.remove('act');
    };
  }
  // Send message
  var sendChatBtn = document.getElementById('chat-send-btn');
  if (sendChatBtn) {
    sendChatBtn.onclick = function() {
      var input = document.getElementById('chat-input');
      if (!input || !input.value.trim()) return;
      var message = input.value;
      var chatBody = document.querySelector('.chat-body');
      if (!chatBody) return;
      var userMsg = document.createElement('div');
      userMsg.className = 'chat-message';
      userMsg.style.cssText = 'justify-content:flex-end;display:flex;';
      userMsg.innerHTML = '<div class="chat-bubble" style="background:#0063B2;color:#fff;padding:10px 14px;border-radius:16px 16px 4px 16px;"><p>' + message + '</p></div>';
      chatBody.appendChild(userMsg);
      input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(function() {
        var botMsg = document.createElement('div');
        botMsg.className = 'chat-message';
        botMsg.style.cssText = 'display:flex;gap:10px;align-items:flex-start;';
        botMsg.innerHTML = '<div class="chat-avatar"><img src="Public/Uploads/uploadfile/images/20250830/logo-circle.svg" alt="Skyworth"></div><div class="chat-bubble" style="background:#fff;padding:12px 16px;border-radius:16px 16px 16px 4px;box-shadow:0 2px 8px rgba(0,0,0,0.06);"><p>Cảm ơn bạn đã liên hệ!</p><p>Đội ngũ của chúng tôi sẽ phản hồi sớm nhất có thể.</p><p>Thank you for contacting us!</p></div>';
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    };
  }
  // Quick reply buttons
  var quickBtns = document.querySelectorAll('.quick-reply-btn');
  quickBtns.forEach(function(btn) {
    btn.onclick = function() {
      var message = this.getAttribute('data-message');
      var chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.value = message;
        if (sendChatBtn) sendChatBtn.onclick();
      }
    };
  });

  // --- ROI Calculator: dynamic resource loading ---
  // 1. Load CSS
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'assets/css/solar-calculator.css';
  document.head.appendChild(cssLink);

  // 2. Load JS (will auto-init #solar-calculator-app)
  var script = document.createElement('script');
  script.src = 'assets/js/solar-calculator.js';
  script.onload = function () {
    // 3. Bind modal open/close after calculator is ready
    var overlay = document.getElementById('roi-modal-overlay');
    var trigger = document.getElementById('roi-calc-trigger');
    var closeBtn = document.getElementById('roi-modal-close');
    var triggerPh = document.getElementById('roi-calc-trigger-ph');
    [trigger, triggerPh].forEach(function (btn) {
      if (overlay && btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          overlay.style.display = 'flex';
        });
      }
    });
    if (overlay && closeBtn) {
      closeBtn.addEventListener('click', function () {
        overlay.style.display = 'none';
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    }
  };
  document.body.appendChild(script);
})();
`;

fs.writeFileSync(path.join(BASE, 'assets/js/components-vn.js'), jsContent, 'utf8');
console.log(`components-vn.js written (${jsContent.length} bytes)`);
