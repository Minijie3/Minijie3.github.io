(() => {
  'use strict';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const read = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch (_) { return fallback; }
  };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const requested = new URLSearchParams(location.search).get('lang');
  let language = ['zh', 'en'].includes(requested) ? requested : read('jie-language', 'en');
  if (!['zh', 'en'].includes(language)) language = 'en';
  if (requested === language) save('jie-language', language);
  let preference = read('jie-theme', 'system');
  if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
  root.dataset.language = language;
  root.lang = language === 'zh' ? 'zh-CN' : 'en';

  const icons = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a17 17 0 0 1 0 18 17 17 0 0 1 0-18Z"/>',
    system: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8M12 17v4"/>',
    dark: '<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  const icon = name => `<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
  const label = (zh, en) => `<span data-zh="${zh}" data-en="${en}">${language === 'zh' ? zh : en}</span>`;

  function applyLanguage(scope = document) {
    scope.querySelectorAll('[data-zh][data-en]').forEach(node => {
      // These values are authored in static HTML, never supplied by URL or user input.
      node.innerHTML = language === 'zh' ? node.dataset.zh : node.dataset.en;
    });
    scope.querySelectorAll('[data-placeholder-zh][data-placeholder-en]').forEach(node => {
      node.placeholder = language === 'zh' ? node.dataset.placeholderZh : node.dataset.placeholderEn;
    });
    scope.querySelectorAll('[data-aria-zh][data-aria-en]').forEach(node => {
      node.setAttribute('aria-label', language === 'zh' ? node.dataset.ariaZh : node.dataset.ariaEn);
    });
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.innerHTML = icon('globe') + `<span>${language === 'zh' ? '中文' : 'EN'}</span>`;
      button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
      button.title = language === 'zh' ? 'Switch to English' : '切换为中文';
    });
    // Keep the explicit selection while navigating, even when storage is disabled.
    scope.querySelectorAll('a[href]').forEach(link => {
      const raw = link.dataset.languageHref || link.getAttribute('href');
      if (!raw.startsWith('/') || raw.startsWith('//')) return;
      const url = new URL(raw, location.origin);
      if (/\.(pdf|png|jpe?g|svg|zip|ico)$/i.test(url.pathname)) return;
      link.dataset.languageHref = raw;
      url.searchParams.set('lang', language);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
  }

  function applyTheme() {
    root.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    const words = language === 'zh'
      ? { system: '跟随系统', dark: '深色', light: '浅色' }
      : { system: 'System', dark: 'Dark', light: 'Light' };
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.innerHTML = icon(preference);
      button.title = language === 'zh' ? `主题：${words[preference]}` : `Theme: ${words[preference]}`;
      button.setAttribute('aria-label', language === 'zh' ? `当前${words[preference]}，切换主题` : `Current theme: ${words[preference]}; switch theme`);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = root.dataset.theme === 'dark' ? '#0b0b10' : '#f9fbfd';
  }

  function setLanguage(next) {
    if (!['zh', 'en'].includes(next)) return;
    language = next;
    save('jie-language', language);
    root.dataset.language = language;
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    applyLanguage();
    applyTheme();
    window.dispatchEvent(new CustomEvent('site:language', { detail: { language } }));
  }
  window.SiteLanguage = { get: () => language, set: setLanguage, apply: applyLanguage };
  applyTheme();
  media.addEventListener('change', applyTheme);

  function mountShell() {
    document.querySelectorAll('.site-header, [data-site-header]').forEach(header => {
      header.className = 'site-header';
      header.innerHTML = `
        <a class="brand" href="/">${label('Minijie3 的博客', "Minijie3's Blog")}</a>
        <nav class="nav" id="site-nav" data-aria-zh="主导航" data-aria-en="Main navigation">
          <details class="nav-dropdown">
            <summary>${label('博客', 'Blog')} <span aria-hidden="true">⌄</span></summary>
            <div class="nav-dropdown-panel">
              <a href="/blog/">${label('全部文章', 'All posts')}</a>
              <a href="/blog/collections/programming/">${label('编程笔记', 'Programming')}</a>
              <a href="/blog/collections/mathematics/">${label('数学与统计', 'Mathematics')}</a>
              <a href="/blog/collections/life/">${label('生活随想', 'Life notes')}</a>
            </div>
          </details>
          <a href="/research/">${label('学术', 'Academic')}</a>
          <a href="/news/">${label('动态', 'News')}</a>
          <a href="/about/">${label('关于', 'About')}</a>
        </nav>
        <div class="header-actions">
          <button type="button" class="language-button" data-language-toggle></button>
          <button type="button" class="icon-button" data-theme-toggle></button>
          <button type="button" class="icon-button menu-toggle" data-menu-toggle aria-controls="site-nav" aria-expanded="false" data-aria-zh="展开导航" data-aria-en="Toggle navigation">${icon('menu')}</button>
        </div>`;
      const current = location.pathname;
      header.querySelectorAll('.nav > a').forEach(link => {
        if (current.startsWith(link.getAttribute('href'))) {
          link.setAttribute('aria-current', 'page');
        }
      });
      if (current.startsWith('/blog/')) {
        header.querySelector('summary').classList.add('is-current');
      }
    });
    document.querySelectorAll('.site-footer, .blog-footer, [data-site-footer]').forEach(footer => {
      footer.className = 'site-footer';
      footer.innerHTML = `<div><span>© ${new Date().getFullYear()} Jie He / Minijie3</span><p>${label('没有理想的人不伤心', 'Keep your ideals close.')}</p></div><div class="footer-links"><a href="https://github.com/Minijie3">GitHub ↗</a><a href="mailto:19869342420@163.com">${label('联系我', 'Contact')} ↗</a><a href="/about/">${label('关于本站', 'About this site')}</a></div>`;
    });
  }

  function init() {
    // Old homepage deep links still lead to the equivalent independent section.
    if (location.pathname === '/' || location.pathname === '/index.html') {
      const oldSections = { about: '/about/', education: '/about/#education', research: '/research/#interests', publications: '/research/', news: '/news/' };
      const target = oldSections[location.hash.slice(1)];
      if (target) {
        const url = new URL(target, location.origin);
        url.searchParams.set('lang', language);
        location.replace(url.pathname + url.search + url.hash);
        return;
      }
    }
    mountShell();
    applyLanguage();
    applyTheme();
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const modes = ['system', 'dark', 'light'];
        preference = modes[(modes.indexOf(preference) + 1) % modes.length];
        save('jie-theme', preference);
        applyTheme();
      });
    });
    const menu = document.querySelector('[data-menu-toggle]');
    const nav = document.getElementById('site-nav');
    const close = () => {
      if (menu && nav) { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
      document.querySelectorAll('.nav-dropdown').forEach(node => { node.open = false; });
    };
    menu?.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav?.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { close(); menu?.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) close(); });
    const header = document.querySelector('.site-header');
    const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const tocLinks = [...document.querySelectorAll('.page-toc a[href^="#"]')];
    if (tocLinks.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries.find(item => item.isIntersecting);
        if (!entry) return;
        tocLinks.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-100px 0px -55% 0px', threshold: 0 });
      tocLinks.forEach(link => {
        const section = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (section) observer.observe(section);
      });
    }
    window.dispatchEvent(new CustomEvent('site:language', { detail: { language } }));
    const query = new URLSearchParams(location.search).get('q');
    const search = document.querySelector('.blog-search input');
    if (query && search && !search.value) {
      search.value = query;
      search.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
