/**
 * AH Nord GmbH - Enterprise Site Controller
 * Handles Themes, Comprehensive i18n Language Switching,
 * Sticky Header, Mobile Drawer, Back-To-Top FAB, FAQ Accordions,
 * Forms, and Animated Conical Visual Elements.
 */

(function () {
  'use strict';

  let currentLang = localStorage.getItem('ahnord_lang') || 'de';
  let currentTheme = localStorage.getItem('ahnord_theme') || 'dark';
  let translations = {};

  // Theme Management (Dual Theme with High Contrast & Contrast Protection)
  function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');
    
    if (currentTheme === 'dark') {
      sunIcons.forEach(el => el.style.display = 'inline-block');
      moonIcons.forEach(el => el.style.display = 'none');
    } else {
      sunIcons.forEach(el => el.style.display = 'none');
      moonIcons.forEach(el => el.style.display = 'inline-block');
    }
  }

  window.toggleTheme = function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ahnord_theme', currentTheme);
    initTheme();
  };

  // Language & Translation Engine
  function getBasePath() {
    return (window.location.pathname.match(/\/pages\//) ? '../' : './');
  }

  async function loadTranslations() {
    try {
      const basePath = getBasePath();
      const resp = await fetch(basePath + 'translations.json');
      translations = await resp.json();
      applyLanguage(currentLang);
    } catch (e) {
      console.warn('Failed to load translations:', e);
    }
  }

  window.setLanguage = function (lang) {
    if (!['de', 'en', 'fr'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('ahnord_lang', lang);
    applyLanguage(lang);
    updateLangUI(lang);
    
    // Close dropdown
    const dropdown = document.getElementById('langDropdownMenu');
    if (dropdown) dropdown.classList.remove('show');
  };

  function updateLangUI(lang) {
    document.querySelectorAll('.lang-option').forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    const currentLabel = document.querySelector('.current-lang-code');
    if (currentLabel) {
      currentLabel.textContent = lang.toUpperCase();
    }
    
    const currentFlag = document.querySelector('.current-lang-flag');
    if (currentFlag) {
      currentFlag.textContent = lang === 'de' ? '🇩🇪' : (lang === 'en' ? '🇬🇧' : '🇫🇷');
    }
  }

  function applyLanguage(lang) {
    const dict = translations[lang] || {};
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
  }

  // Sticky Header Scroll State
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // FAQ Accordion Interaction
  window.toggleFaq = function (btn) {
    const item = btn.closest('.faq-item');
    if (item) {
      item.classList.toggle('active');
    }
  };

  // Mobile Drawer Toggle
  window.toggleMobileMenu = function () {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileOverlay');

    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('active');
      if (isOpen) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  window.closeMobileMenu = function () {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileOverlay');
    if (drawer) drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Back to Top Button
  function initBackToTop() {
    const btt = document.getElementById('backToTopBtn');
    if (!btt) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Contact Form Submission
  window.handleContactSubmit = function (event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = '<span class="spinner"></span> <span>Wird gesendet...</span>';
    }

    setTimeout(() => {
      const basePath = getBasePath();
      window.location.href = basePath + 'pages/thank-you.html';
    }, 900);
  };

  // Custom Language Dropdown Toggle
  window.toggleLangMenu = function (e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('langDropdownMenu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdownMenu');
    if (dropdown && dropdown.classList.contains('show')) {
      if (!e.target.closest('.lang-dropdown-wrapper')) {
        dropdown.classList.remove('show');
      }
    }
  });

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTranslations();
    initStickyHeader();
    initBackToTop();
    initCookieBanner();
    updateLangUI(currentLang);

    // Theme toggles
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.addEventListener('click', window.toggleTheme);
    });

    // Mobile nav item clicks auto close drawer
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', window.closeMobileMenu);
    });
  });
})();
