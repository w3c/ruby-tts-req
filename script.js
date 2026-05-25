(function () {

  'use strict';

  /*
   * Multilingual switcher
   * inspired by JLReq / CLReq
   *
   * Supported languages:
   *   ja
   *   en
   *   zh-Hant
   *   zh-Hans
   *   all
   */

  const STORAGE_KEY = 'w3c-lang';

  function normalizeLang(lang) {

    if (!lang) {
      return 'en';
    }

    lang = lang.trim();

    if (/^ja/i.test(lang)) {
      return 'ja';
    }

    if (
      /^zh-hant/i.test(lang) ||
      /^zh-tw/i.test(lang) ||
      /^zh-hk/i.test(lang)
    ) {
      return 'zh-Hant';
    }

    if (/^zh/i.test(lang)) {
      return 'zh-Hans';
    }

    if (/^en/i.test(lang)) {
      return 'en';
    }

    if (/^all/i.test(lang)) {
      return 'all';
    }

    return 'en';
  }

  function showLanguage(lang) {

    lang = normalizeLang(lang);

    localStorage.setItem(
      STORAGE_KEY,
      lang
    );

    document
      .querySelectorAll(
        '[its-locale-filter-list]'
      )
      .forEach(function (el) {

        const attr =
          el.getAttribute(
            'its-locale-filter-list'
          );

        if (!attr) {
          return;
        }

        const langs =
          attr
            .split(/\s+/)
            .map(normalizeLang);

        if (
          lang === 'all' ||
          langs.includes(lang)
        ) {

          el.hidden = false;

        } else {

          el.hidden = true;
        }
      });

    updateSwitcher(lang);
  }

  function updateSwitcher(lang) {

    document
      .querySelectorAll(
        '#langSwitch a'
      )
      .forEach(function (a) {

        if (
          a.dataset.lang === lang
        ) {

          a.style.fontWeight =
            'bold';

          a.style.textDecoration =
            'none';

          a.removeAttribute('href');

        } else {

          a.style.fontWeight =
            '';

          a.style.textDecoration =
            '';

          a.href =
            '?lang=' + a.dataset.lang;
        }
      });
  }

  function createLink(lang, label) {

    const a =
      document.createElement('a');

    a.textContent = label;

    a.dataset.lang = lang;

    a.href =
      '?lang=' + lang;

    a.setAttribute(
      'data-no-xref',
      'true'
    );

    a.addEventListener(
      'click',
      function (event) {

        event.preventDefault();

        showLanguage(lang);

        history.replaceState(
          null,
          '',
          '?lang=' + lang
        );
      }
    );

    return a;
  }

  function initializeSwitcher() {

    const container =
      document.getElementById(
        'langSwitch'
      );

    if (!container) {
      return;
    }

    container.replaceChildren();

    const langs = [
      ['zh-Hant', '繁體中文'],
      ['zh-Hans', '简体中文'],
      ['en', 'English'],
      ['ja', '日本語'],
      ['all', 'All']
    ];

    langs.forEach(function (item) {

      container.appendChild(
        createLink(
          item[0],
          item[1]
        )
      );
    });
  }

  function getInitialLang() {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const lang =
      params.get('lang');

    if (lang) {
      return normalizeLang(lang);
    }

    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (stored) {
      return normalizeLang(stored);
    }

    return normalizeLang(
      navigator.language ||
      navigator.userLanguage
    );
  }

  function initialize() {

    initializeSwitcher();

    showLanguage(
      getInitialLang()
    );
  }

  window.switchLang =
    showLanguage;

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initialize
    );

  } else {

    initialize();
  }

})();
