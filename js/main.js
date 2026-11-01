/**
 * AH Nord GmbH - Enterprise Site Controller
 * Handles Themes, Language Switching, Dynamic DB Loading, Forms & Animations
 */

(function () {
  'use strict';

  let currentLang = localStorage.getItem('ahnord_lang') || 'de';
  let currentTheme = localStorage.getItem('ahnord_theme') || 'light';
  let translations = {};
  let siteDB = {};

  // Theme Management
  function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  window.toggleTheme = function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ahnord_theme', currentTheme);
    initTheme();
  };

  // Language & Translation Engine
  async function loadTranslations() {
    try {
      const basePath = getBasePath();
      const resp = await fetch(basePath + 'translations.json');
      translations = await resp.json();
      applyLanguage(currentLang);
    } catch (e) {
      console.warn('Translations fallback mode', e);
    }
  }

  function getBasePath() {
    const depth = (window.location.pathname.match(/\/pages\//) ? '../' : './');
    return depth;
  }

  window.setLanguage = function (lang) {
    if (!['de', 'en', 'fr'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('ahnord_lang', lang);
    applyLanguage(lang);
    const select = document.getElementById('langSelect');
    if (select) select.value = lang;
  };

  function applyLanguage(lang) {
    const dict = translations[lang] || {};
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
  }

  // Cookie Consent Banner
  function initCookieBanner() {
    const consent = localStorage.getItem('ahnord_cookie_consent');
    const banner = document.getElementById('cookieBanner');
    if (!consent && banner) {
      setTimeout(() => banner.classList.add('visible'), 1200);
    }
  }

  window.acceptCookies = function () {
    localStorage.setItem('ahnord_cookie_consent', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('visible');
  };

  window.declineCookies = function () {
    localStorage.setItem('ahnord_cookie_consent', 'declined');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('visible');
  };

  // Form Submission & Validation
  window.handleContactSubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;

    // Simulate enterprise lead submission & verification
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Verarbeite...</span>';

    setTimeout(() => {
      const basePath = getBasePath();
      window.location.href = basePath + 'pages/thank-you.html';
    }, 900);
  };

  // DOM Content Loaded Initializer
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTranslations();
    initCookieBanner();

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', window.toggleTheme);
    }

    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener('change', (e) => window.setLanguage(e.target.value));
    }
  });
})();
