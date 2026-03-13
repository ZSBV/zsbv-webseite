/**
 * chatbot.js — "Max, dein Sicherheitsberater"
 * 
 * Rule-based chatbot for sicherheit-karriere.de
 * Styled as a friendly security guard to help visitors find jobs & apply.
 * 
 * TO REMOVE: Simply delete this file and remove the <script> tags
 * referencing chatbot.js from index.html and job-template.html.
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION
  // ============================================================

  const CONFIG = {
    botName: 'Max',
    botTitle: 'Dein Sicherheitsberater',
    autoOpenDelay: 20000,       // Auto-open after 20 seconds
    typingDelay: 600,           // Typing indicator delay
    messageDelay: 300,          // Delay between messages
    storageKey: 'zsbv_chatbot_state',
  };

  // ============================================================
  // CONVERSATION FLOWS
  // ============================================================

  const FLOWS = {
    welcome: {
      messages: [
        'Hey! 👋 Ich bin <strong>Max</strong>, dein Sicherheitsberater.',
        'Wie kann ich dir helfen?'
      ],
      options: [
        { label: '🔍 Job finden', action: 'jobSearch' },
        { label: '💰 Gehalt & Verdienst', action: 'salary' },
        { label: '📋 §34a Sachkunde', action: 'sachkunde' },
        { label: '🎓 Kostenlose Ausbildung', action: 'bildungsgutschein' },
        { label: '✉️ Kontakt', action: 'contact' },
      ]
    },

    jobSearch: {
      messages: [
        'Super, dass du einen Job in der Sicherheitsbranche suchst! 💪',
        'Wir haben über <strong>4.500 offene Stellen</strong> in ganz Deutschland.',
        'Am besten schaust du direkt in unsere Stellenangebote – du kannst dort nach deiner PLZ filtern.'
      ],
      options: [
        { label: '📍 Zu den Stellenangeboten', action: 'goToJobs' },
        { label: '📝 Direkt bewerben', action: 'apply' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },

    salary: {
      messages: [
        'Gute Frage! 💰 In der Sicherheitsbranche verdienst du als Einsteiger zwischen <strong>2.400 € und 3.200 € brutto</strong> im Monat.',
        'Dazu kommen oft <strong>Nachtzuschläge, Feiertagszuschläge</strong> und weitere Extras.',
        'Mit Erfahrung und Zusatzqualifikationen steigt das Gehalt schnell weiter! 📈'
      ],
      options: [
        { label: '🔍 Jobs mit Gehalt ansehen', action: 'goToJobs' },
        { label: '📋 Welche Qualifikation brauche ich?', action: 'sachkunde' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },

    sachkunde: {
      messages: [
        'Für die meisten Jobs in der Sicherheitsbranche brauchst du die <strong>§34a Sachkundeprüfung</strong> (IHK).',
        'Die gute Nachricht: <strong>Wir bereiten dich kostenlos darauf vor!</strong> 🎉',
        'Die Ausbildung ist online möglich, dauert wenige Wochen und wird über einen <strong>Bildungsgutschein</strong> komplett finanziert.'
      ],
      options: [
        { label: '📖 Mehr über §34a erfahren', action: 'goToSachkunde' },
        { label: '🎓 Wie bekomme ich den Bildungsgutschein?', action: 'qualify_german' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },

    bildungsgutschein: {
      messages: [
        'Der <strong>Bildungsgutschein</strong> ist dein Ticket zur kostenlosen Qualifizierung! 🎓',
        'So bekommst du ihn:',
        '1️⃣ Melde dich beim <strong>Jobcenter</strong> oder der <strong>Agentur für Arbeit</strong> arbeitssuchend\n2️⃣ Frage nach einem <strong>Bildungsgutschein</strong> für die Sicherheitsbranche\n3️⃣ Damit übernimmt der Staat <strong>100% der Kosten</strong> für deine Ausbildung',
        'Wir helfen dir gerne beim ganzen Prozess! 🤝'
      ],
      options: [
        { label: '📝 Jetzt bewerben & Hilfe erhalten', action: 'qualify_german' },
        { label: '✉️ Persönlich beraten lassen', action: 'contact' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },

    qualify_german: {
      messages: [
        'Bevor wir loslegen, muss ich kurz zwei Dinge prüfen, damit wir dich optimal beraten können.',
        'Hast du <strong>Deutschkenntnisse auf dem Niveau B2</strong> oder höher?'
      ],
      options: [
        { label: '✅ Ja, habe ich', action: 'qualify_stay' },
        { label: '❌ Nein, noch nicht', action: 'qualify_failed' },
      ]
    },

    qualify_stay: {
      messages: [
        'Super! Letzte Frage: Bist du bereits seit <strong>mindestens 5 Jahren</strong> in Deutschland?'
      ],
      options: [
        { label: '✅ Ja, bin ich', action: 'qualify_success' },
        { label: '❌ Nein', action: 'qualify_failed' },
      ]
    },

    qualify_success: {
      messages: [
        'Hervorragend! 🎉 Du erfüllst die wichtigsten Voraussetzungen für unsere geförderten Programme.',
        'Wir können dich direkt für die Sachkundeprüfung anmelden und an unsere Partner vermitteln.',
        'Wie möchtest du weitermachen?'
      ],
      options: [
        { label: '📝 Direkt bewerben', action: 'apply' },
        { label: '💬 Mit Max via WhatsApp schreiben', action: 'contact' },
        { label: '⬅️ Zurück zum Start', action: 'welcome' },
      ]
    },

    qualify_failed: {
      messages: [
        'Vielen Dank für deine Ehrlichkeit! 🙏',
        'Momentan können wir unsere <strong>kostenlose Ausbildung</strong> leider nur anbieten, wenn diese Voraussetzungen (B2 Deutsch & 5 Jahre Aufenthalt) erfüllt sind.',
        'Du kannst dich aber trotzdem gerne bei uns melden – vielleicht finden wir einen anderen Weg oder beraten dich zu den nächsten Schritten!'
      ],
      options: [
        { label: '✉️ Kontakt aufnehmen', action: 'contact' },
        { label: '🔍 Jobs ohne Voraussetzungen suchen', action: 'goToJobs' },
        { label: '⬅️ Zurück zum Start', action: 'welcome' },
      ]
    },

    apply: {
      messages: [
        'Klasse, dass du dich bewerben möchtest! 🚀',
        'Am schnellsten geht es, wenn du dir eine passende Stelle aussuchst und dich direkt dort bewirbst.',
        'Du brauchst nur deinen <strong>Namen, E-Mail und Lebenslauf</strong> – das wars!'
      ],
      options: [
        { label: '🔍 Passende Stelle finden', action: 'goToJobs' },
        { label: '✉️ Lieber erst Kontakt aufnehmen', action: 'contact' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },

    contact: {
      messages: [
        'Klar, meld dich gerne bei uns! 📬',
        '📧 <strong>E-Mail:</strong> <a href="mailto:info@sicherheit-karriere.de" style="color:#C8A84E;">info@sicherheit-karriere.de</a>',
        '💬 <strong>WhatsApp:</strong> <a href="https://wa.me/4915172868394?text=Hallo%2C%20ich%20habe%20eine%20Frage." target="_blank" style="color:#25D366;">Direkt chatten</a>',
        'Wir melden uns normalerweise innerhalb von <strong>24 Stunden</strong>! ⚡'
      ],
      options: [
        { label: '🔍 Erstmal Stellen anschauen', action: 'goToJobs' },
        { label: '⬅️ Zurück', action: 'welcome' },
      ]
    },
  };

  // ============================================================
  // INJECT STYLES
  // ============================================================

  function injectStyles() {
    const css = `
      /* ===== CHATBOT WIDGET ===== */

      #zsbv-chatbot-toggle {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid rgba(200, 168, 78, 0.6);
        background: linear-gradient(135deg, #0A1628 0%, #142238 100%);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(200, 168, 78, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: zsbv-pulse 3s infinite;
      }

      #zsbv-chatbot-toggle:hover {
        transform: scale(1.1);
        border-color: #C8A84E;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(200, 168, 78, 0.25);
      }

      #zsbv-chatbot-toggle.active {
        animation: none;
      }

      @keyframes zsbv-pulse {
        0%, 100% { box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(200,168,78,0.15); }
        50% { box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(200,168,78,0.3); }
      }

      #zsbv-chatbot-toggle svg {
        width: 32px;
        height: 32px;
        transition: all 0.3s;
      }

      #zsbv-chatbot-toggle .chat-icon { display: block; }
      #zsbv-chatbot-toggle .close-icon { display: none; }
      #zsbv-chatbot-toggle.active .chat-icon { display: none; }
      #zsbv-chatbot-toggle.active .close-icon { display: block; }

      /* Badge */
      #zsbv-chatbot-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 22px;
        height: 22px;
        background: #C8A84E;
        color: #0A1628;
        font-family: 'Outfit', sans-serif;
        font-size: 12px;
        font-weight: 800;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s;
      }

      #zsbv-chatbot-badge.show {
        opacity: 1;
        transform: scale(1);
      }

      /* Chat Window */
      #zsbv-chatbot-window {
        position: fixed;
        bottom: 104px;
        right: 28px;
        z-index: 9998;
        width: 380px;
        max-height: 540px;
        background: rgba(10, 22, 40, 0.97);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border: 1px solid rgba(200, 168, 78, 0.2);
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(200, 168, 78, 0.08);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      #zsbv-chatbot-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      /* Header */
      .zsbv-chat-header {
        padding: 18px 20px;
        background: linear-gradient(135deg, rgba(20, 34, 56, 0.95) 0%, rgba(10, 22, 40, 0.95) 100%);
        border-bottom: 1px solid rgba(200, 168, 78, 0.15);
        display: flex;
        align-items: center;
        gap: 14px;
        flex-shrink: 0;
      }

      .zsbv-chat-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        box-shadow: 0 4px 16px rgba(200, 168, 78, 0.3);
        border: 2px solid rgba(200, 168, 78, 0.4);
      }

      .zsbv-chat-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .zsbv-chat-header-info h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 15px;
        font-weight: 700;
        color: #fff;
        margin: 0;
        line-height: 1.2;
      }

      .zsbv-chat-header-info p {
        font-size: 12px;
        color: #C8A84E;
        margin: 2px 0 0;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .zsbv-chat-header-info p::before {
        content: '';
        width: 7px;
        height: 7px;
        background: #4ade80;
        border-radius: 50%;
        display: inline-block;
        animation: zsbv-online-pulse 2s infinite;
      }

      @keyframes zsbv-online-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* Messages */
      .zsbv-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 200px;
        max-height: 320px;
        scroll-behavior: smooth;
      }

      .zsbv-chat-messages::-webkit-scrollbar {
        width: 4px;
      }
      .zsbv-chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      .zsbv-chat-messages::-webkit-scrollbar-thumb {
        background: rgba(200, 168, 78, 0.3);
        border-radius: 2px;
      }

      .zsbv-msg {
        max-width: 88%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.55;
        animation: zsbv-msgIn 0.3s ease-out;
        word-wrap: break-word;
      }

      @keyframes zsbv-msgIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .zsbv-msg.bot {
        align-self: flex-start;
        background: rgba(200, 168, 78, 0.08);
        border: 1px solid rgba(200, 168, 78, 0.15);
        color: #C0C8D4;
        border-bottom-left-radius: 4px;
      }

      .zsbv-msg.bot strong {
        color: #fff;
      }

      .zsbv-msg.bot a {
        color: #C8A84E;
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .zsbv-msg.bot a:hover {
        color: #E8C95A;
      }

      .zsbv-msg.user {
        align-self: flex-end;
        background: linear-gradient(135deg, #A08030, #C8A84E);
        color: #0A1628;
        font-weight: 600;
        border-bottom-right-radius: 4px;
      }

      /* Typing indicator */
      .zsbv-typing {
        display: flex;
        gap: 5px;
        padding: 14px 18px;
        align-self: flex-start;
        background: rgba(200, 168, 78, 0.08);
        border: 1px solid rgba(200, 168, 78, 0.12);
        border-radius: 16px;
        border-bottom-left-radius: 4px;
      }

      .zsbv-typing span {
        width: 7px;
        height: 7px;
        background: #C8A84E;
        border-radius: 50%;
        animation: zsbv-typingDot 1.4s infinite;
      }

      .zsbv-typing span:nth-child(2) { animation-delay: 0.2s; }
      .zsbv-typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes zsbv-typingDot {
        0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
        30% { opacity: 1; transform: scale(1); }
      }

      /* Quick Reply Options */
      .zsbv-chat-options {
        padding: 12px 16px 16px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        border-top: 1px solid rgba(200, 168, 78, 0.1);
        flex-shrink: 0;
        background: rgba(6, 14, 26, 0.6);
      }

      .zsbv-option-btn {
        padding: 9px 16px;
        background: rgba(200, 168, 78, 0.08);
        border: 1px solid rgba(200, 168, 78, 0.25);
        border-radius: 20px;
        color: #C8A84E;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        white-space: nowrap;
        line-height: 1.2;
      }

      .zsbv-option-btn:hover {
        background: rgba(200, 168, 78, 0.18);
        border-color: #C8A84E;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(200, 168, 78, 0.15);
      }

      .zsbv-option-btn:active {
        transform: translateY(0);
      }

      /* Branding */
      .zsbv-chat-branding {
        padding: 8px 16px;
        text-align: center;
        font-size: 10px;
        color: rgba(192, 200, 212, 0.3);
        font-family: 'Outfit', sans-serif;
        letter-spacing: 0.5px;
        flex-shrink: 0;
        border-top: 1px solid rgba(200, 168, 78, 0.05);
      }


      /* ===== MOBILE ===== */
      @media (max-width: 480px) {
        #zsbv-chatbot-window {
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          max-height: 100vh;
          max-height: 100dvh;
          border-radius: 0;
          border: none;
        }

        #zsbv-chatbot-toggle {
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
        }



        .zsbv-chat-messages {
          max-height: calc(100vh - 220px);
          max-height: calc(100dvh - 220px);
        }
      }
    `;

    const style = document.createElement('style');
    style.id = 'zsbv-chatbot-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============================================================
  // BUILD DOM
  // ============================================================

  function buildDOM() {
    // Toggle Button
    const toggle = document.createElement('button');
    toggle.id = 'zsbv-chatbot-toggle';
    toggle.setAttribute('aria-label', 'Chat öffnen');
    toggle.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 5.58 2 10c0 2.24 1.12 4.27 2.94 5.74L4 22l4.73-2.37C9.77 19.87 10.87 20 12 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z" fill="#C8A84E"/>
        <circle cx="8" cy="10" r="1.2" fill="#0A1628"/>
        <circle cx="12" cy="10" r="1.2" fill="#0A1628"/>
        <circle cx="16" cy="10" r="1.2" fill="#0A1628"/>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="#C8A84E" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <span id="zsbv-chatbot-badge">1</span>
    `;
    document.body.appendChild(toggle);

    // Chat Window
    const win = document.createElement('div');
    win.id = 'zsbv-chatbot-window';
    win.innerHTML = `
      <div class="zsbv-chat-header">
        <div class="zsbv-chat-avatar">
          <img src="images/max-profile.png" alt="Max - Sicherheitsberater">
        </div>
        <div class="zsbv-chat-header-info">
          <h3>${CONFIG.botName}</h3>
          <p>${CONFIG.botTitle}</p>
        </div>
      </div>
      <div class="zsbv-chat-messages" id="zsbv-chat-messages"></div>
      <div class="zsbv-chat-options" id="zsbv-chat-options"></div>
      <div class="zsbv-chat-branding">sicherheit-karriere.de</div>
    `;
    document.body.appendChild(win);


  }

  // ============================================================
  // CHATBOT LOGIC
  // ============================================================

  let isOpen = false;
  let hasInteracted = false;

  function toggleChat() {
    const toggle = document.getElementById('zsbv-chatbot-toggle');
    const win = document.getElementById('zsbv-chatbot-window');
    const badge = document.getElementById('zsbv-chatbot-badge');

    isOpen = !isOpen;

    if (isOpen) {
      win.classList.add('open');
      toggle.classList.add('active');
      badge.classList.remove('show');
      hasInteracted = true;

      // Start conversation on first open
      const messages = document.getElementById('zsbv-chat-messages');
      if (messages.children.length === 0) {
        playFlow('welcome');
      }
    } else {
      win.classList.remove('open');
      toggle.classList.remove('active');
    }
  }

  function addMessage(text, sender) {
    const messages = document.getElementById('zsbv-chat-messages');
    const msg = document.createElement('div');
    msg.className = `zsbv-msg ${sender}`;
    msg.innerHTML = text.replace(/\n/g, '<br>');
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const messages = document.getElementById('zsbv-chat-messages');
    const typing = document.createElement('div');
    typing.className = 'zsbv-typing';
    typing.id = 'zsbv-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('zsbv-typing');
    if (typing) typing.remove();
  }

  function showOptions(options) {
    const container = document.getElementById('zsbv-chat-options');
    container.innerHTML = '';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'zsbv-option-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => handleOption(opt));
      container.appendChild(btn);
    });
  }

  function clearOptions() {
    const container = document.getElementById('zsbv-chat-options');
    container.innerHTML = '';
  }

  async function playFlow(flowName) {
    const flow = FLOWS[flowName];
    if (!flow) return;

    clearOptions();

    for (let i = 0; i < flow.messages.length; i++) {
      showTyping();
      await sleep(CONFIG.typingDelay + Math.random() * 400);
      hideTyping();
      addMessage(flow.messages[i], 'bot');
      if (i < flow.messages.length - 1) {
        await sleep(CONFIG.messageDelay);
      }
    }

    if (flow.options) {
      await sleep(200);
      showOptions(flow.options);
    }
  }

  function handleOption(opt) {
    // Add user message
    addMessage(opt.label, 'user');
    clearOptions();

    // Handle special actions
    switch (opt.action) {
      case 'goToJobs':
        addMessage('Ich bringe dich zu den Stellenangeboten… 🚀', 'bot');
        setTimeout(() => {
          const isJobPage = window.location.pathname.includes('/jobs/');
          const jobsUrl = isJobPage ? '../index.html#jobs' : '#jobs';
          window.location.href = jobsUrl;
          // Focus the PLZ input after navigation
          setTimeout(() => {
            const plzInput = document.getElementById('plzInput');
            if (plzInput) {
              plzInput.focus();
              plzInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 500);
        }, 800);
        return;

      case 'goToSachkunde':
        addMessage('Öffne die §34a Infoseite… 📖', 'bot');
        setTimeout(() => {
          const isJobPage = window.location.pathname.includes('/jobs/');
          window.location.href = isJobPage ? '../sachkunde-34a.html' : 'sachkunde-34a.html';
        }, 800);
        return;

      case 'apply':
        addMessage('Öffne das Bewerbungsformular… ✍️', 'bot');
        setTimeout(() => {
          // Try to open the apply modal if available
          if (typeof window.openJobModal === 'function') {
            window.openJobModal('Sicherheitsmitarbeiter', 'Ihre Region', '2.620 – 2.850');
          } else {
            const isJobPage = window.location.pathname.includes('/jobs/');
            const jobsUrl = isJobPage ? '../index.html#jobs' : '#jobs';
            window.location.href = jobsUrl;
          }
        }, 800);
        return;

      default:
        // Regular flow transition
        setTimeout(() => playFlow(opt.action), 300);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================
  // AUTO-OPEN
  // ============================================================

  function setupAutoOpen() {
    setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        const badge = document.getElementById('zsbv-chatbot-badge');
        if (badge) badge.classList.add('show');
      }
    }, CONFIG.autoOpenDelay);
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    // Don't init on print page or certain paths
    if (window.matchMedia && window.matchMedia('print').matches) return;

    injectStyles();
    buildDOM();

    // Event listeners
    document.getElementById('zsbv-chatbot-toggle').addEventListener('click', toggleChat);

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
      }
    });

    // Auto-open logic
    setupAutoOpen();
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
