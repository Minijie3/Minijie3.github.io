(() => {
  'use strict';
  // These are UI translations only. Never translate inside #article-container.
  const posts = [
    ['2025/02/06', '【C && JavaScript】关于Closure（闭包）', '[C && JavaScript] Understanding Closures'],
    ['2025/01/20', '【概率论与数理统计】多方法在次序统计量分布中的应用综述', '[Probability & Statistics] A Review of Methods for Order Statistic Distributions'],
    ['2025/01/06', '山静似太古，日长如小年', 'Mountains Still as Antiquity, Days Long as a Year']
  ].map(([date, zh, en]) => ({ date, zh, en, href: `/blog/${date}/${encodeURIComponent(zh)}/` }));
  const translations = new Map([
    ...posts.map(post => [post.zh, post.en]),
    ['发表于', 'Published on'], ['更新于', 'Updated on'],
    ['总字数:', 'Word count:'], ['阅读时长:', 'Reading time:'], ['浏览量:', 'Views:'],
    ['文章作者:', 'Author:'], ['文章链接:', 'Permalink:'], ['版权声明:', 'License:'],
    ['上一篇', 'Previous post'], ['下一篇', 'Next post'],
    ['何为闭包？', 'What is a closure?'], ['C 中的指针', 'Pointers in C'],
    ['C 中的 callback function', 'Callback functions in C'], ['函数指针', 'Function pointers'],
    ['JavaScript 中的 closure（闭包）', 'Closures in JavaScript'],
    ['两个闭包的好例子', 'Two examples of closures'], ['模块模式：封装实现', 'The module pattern: encapsulation'],
    ['事件处理程序：保留上下文', 'Event handlers: preserving context'],
    ['使用IIFE的解决方案：', 'A solution using an IIFE'], ['使用let的现代解决方案：', 'A modern solution using let'],
    ['为什么做这个综述？', 'Why write this review?'],
    ['单个次序统计量的概率密度函数', 'The probability density of a single order statistic'],
    ['基于累积分布函数的推导', 'Derivation using the cumulative distribution function'],
    ['从离散化与概率重构角度思考此方法', 'Discretization and probability reconstruction'],
    ['利用概率微元的推导', 'Derivation using infinitesimal probabilities'],
    ['连续型与离散型随机变量在次序统计量分布推导中的区别', 'Continuous versus discrete random variables in order statistic derivations'],
    ['离散型随机变量值的可重复性', 'Repeated values of discrete random variables'],
    ['多个次序统计量的联合概率分布', 'The joint distribution of multiple order statistics'],
    ['延展概率微元方法做推导', 'Extending the infinitesimal probability method'],
    ['延展离散化与概率重构方法做推导', 'Extending discretization and probability reconstruction'],
    ['先讨论求和内部', 'Examining the summand first'],
    ['我有亿点困惑', 'A few things puzzle me'], ['加速访问此站', 'Accessing this site faster'],
    ['关于本站', 'About this site'], ['关于笔者', 'About the author']
  ]);
  const bilingual = (node, zh, en) => {
    node.dataset.zh = zh;
    node.dataset.en = en;
    node.textContent = zh;
    return node;
  };
  const text = (tag, zh, en) => bilingual(document.createElement(tag), zh, en);
  const language = () => {
    if (window.SiteLanguage) return window.SiteLanguage.get();
    const query = new URLSearchParams(location.search).get('lang');
    if (query === 'en' || query === 'zh') return query;
    try { return localStorage.getItem('jie-language') === 'zh' ? 'zh' : 'en'; }
    catch (_) { return 'en'; }
  };
  // Fallback renders page content while the shared API is being integrated.
  // It deliberately does not introduce another language toggle or persistence.
  const applyLanguage = () => {
    const lang = language();
    if (window.SiteLanguage) window.SiteLanguage.apply(document);
    else {
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
      document.querySelectorAll('[data-zh][data-en]').forEach(node => {
        node.innerHTML = node.dataset[lang];
      });
    }
    document.querySelectorAll('[data-placeholder-zh][data-placeholder-en]').forEach(node => {
      node.placeholder = node.getAttribute(`data-placeholder-${lang}`);
    });
    document.querySelectorAll('[data-title-zh][data-title-en]').forEach(node => {
      node.title = node.getAttribute(`data-title-${lang}`);
    });
  };
  const legacy = Boolean(document.querySelector('#body-wrap'));
  if (legacy) {
    // Remove old theme styles; preserve the article's original DOM and code spans.
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (!['/site.css', '/blog-redesign.css'].includes(link.getAttribute('href'))) link.remove();
    });
    document.querySelectorAll('#sidebar, #aside-content, #rightside, #nav, #footer, canvas, .social-share, .post-share')
      .forEach(node => node.remove());
    const header = document.createElement('header');
    header.className = 'site-header';
    header.setAttribute('data-site-header', '');
    document.body.prepend(header);
    const skip = document.createElement('a');
    skip.className = 'blog-skip';
    skip.href = '#content-inner';
    bilingual(skip, '跳至正文', 'Skip to content');
    document.body.prepend(skip);
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('data-site-footer', '');
    document.body.append(footer);
    // Only these UI regions are eligible for translation, never the article.
    document.querySelectorAll('.post-title, #site-title, #post-meta span, .post-copyright-meta').forEach(node => {
      const zh = node.textContent.trim();
      const en = translations.get(zh)
        || (/^\d+分钟$/.test(zh) ? zh.replace('分钟', ' min') : '');
      if (en) bilingual(node, zh, en);
    });
    document.querySelectorAll('#post-meta time[title]').forEach(node => {
      node.dataset.titleZh = node.title;
      node.dataset.titleEn = node.title.replace('发表于', 'Published on').replace('更新于', 'Updated on');
    });
    const license = document.querySelector('.post-copyright__notice .post-copyright-info');
    if (license) {
      license.dataset.zh = license.innerHTML;
      license.dataset.en = 'Unless otherwise stated, articles on this blog are licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>. Please credit <a href="https://minijie3.github.io/">Jie He / Minijie3</a> when reusing them.';
    }
    const permalink = document.querySelector('.post-copyright__type .post-copyright-info a');
    if (permalink) bilingual(permalink, '文章永久链接', 'Permanent article link');
    const heading = document.querySelector('.post-title, #site-title');
    if (heading) {
      const zh = heading.dataset.zh || heading.textContent;
      const en = heading.dataset.en || heading.textContent;
      bilingual(document.querySelector('title'), `${zh} | Jie He`, `${en} | Jie He`);
    }
    const article = document.querySelector('#article-container');
    if (article) {
      const back = text('a', '← 返回博客', '← Back to the blog');
      back.href = '/blog/';
      back.className = 'blog-back';
      document.querySelector('#post-info').prepend(back);
      const note = text('p', '本文以中文撰写，英文界面不改变原文', 'This article is written in Chinese; the original text is preserved.');
      note.className = 'blog-language-note';
      article.before(note);
      const headings = [...article.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')];
      if (headings.length) {
        const toc = document.createElement('nav');
        toc.className = 'page-toc blog-toc';
        toc.append(text('h2', '本页目录', 'On this page'));
        const list = document.createElement('ol');
        headings.forEach(heading => {
          const zh = heading.textContent.trim();
          const link = text('a', zh, translations.get(zh) || zh);
          link.href = `#${encodeURIComponent(heading.id)}`;
          const item = document.createElement('li');
          item.append(link);
          list.append(item);
        });
        toc.append(list);
        const layout = document.querySelector('#content-inner');
        layout.classList.add('reading-layout');
        layout.append(toc);
      }
      const current = posts.findIndex(post => location.pathname.includes(post.date));
      const pager = document.querySelector('#pagination');
      if (pager && current >= 0) {
        pager.replaceChildren();
        [[current - 1, '上一篇', 'Previous post', 'prev-post'], [current + 1, '下一篇', 'Next post', 'next-post']].forEach(([index, zh, en, cls]) => {
          if (!posts[index]) return;
          const post = posts[index];
          const link = document.createElement('a');
          link.className = cls;
          link.href = post.href;
          link.append(text('small', zh, en), text('div', post.zh, post.en));
          pager.append(link);
        });
      }
    }
  }
  // Theme/menu event handling belongs exclusively to site.js, loaded after this
  // adapter on legacy pages so it can find the newly mounted header.
  try {
    const theme = localStorage.getItem('jie-theme');
    if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme;
  } catch (_) { /* Storage may be unavailable; reading must still work. */ }

  let updateSearch = () => {};
  const form = document.querySelector('.blog-search');
  if (form) {
    form.hidden = false;
    const input = form.querySelector('input');
    const cards = [...document.querySelectorAll('.blog-card')];
    // Cache both translations, not just the currently visible text.
    const searchText = new Map(cards.map(card => [card, [
      card.dataset.search, card.textContent,
      ...[...card.querySelectorAll('[data-zh][data-en]')].flatMap(node => [node.dataset.zh, node.dataset.en])
    ].join(' ').normalize('NFKC').toLocaleLowerCase()]));
    const update = () => {
      const terms = input.value.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      let count = 0;
      cards.forEach(card => {
        const text = searchText.get(card);
        card.hidden = !terms.every(term => text.includes(term));
        if (!card.hidden) count++;
      });
      const status = document.querySelector('#blog-search-status');
      status.dataset.zh = `共 ${count} 篇文章`;
      status.dataset.en = `${count} ${count === 1 ? 'post' : 'posts'}`;
      status.textContent = status.dataset[language()];
      document.querySelector('.blog-empty').hidden = count !== 0;
    };
    input.addEventListener('input', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', () => { input.value = ''; update(); });
    updateSearch = update;
  }
  const refresh = () => { applyLanguage(); updateSearch(); };
  window.addEventListener('site:language', refresh);
  // The legacy adapter precedes site.js; DOMContentLoaded also covers APIs
  // installed after this script. No duplicate shared header/menu handlers.
  document.addEventListener('DOMContentLoaded', refresh);
  refresh();

  const article = document.querySelector('#article-container');
  if (!article) return;
  // The generated article contains both $$ display math and $ inline math.
  // Render both forms, including formulas inside tables and list items.
  const formulas = [...article.querySelectorAll('p, li, td, th')].filter(node =>
    !node.querySelector('code, pre, .katex') && node.textContent.includes('$$'));
  const hasInline = [...article.querySelectorAll('*')].some(node =>
    !node.querySelector('code, pre, .katex') && /(^|[^$])\$(?!\$)[^$\n]+\$(?!\$)/.test(node.textContent));
  if (!formulas.length && !hasInline && !article.querySelector('.katex')) return;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
  document.head.append(css);
  formulas.forEach(p => p.classList.add('math-source'));
  const script = document.createElement('script');
  script.nonce = 'jie-blog';
  script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
  script.onload = () => {
    formulas.forEach(p => {
      const matches = [...p.textContent.matchAll(/\$\$([\s\S]*?)\$\$/g)].reverse();
      matches.forEach(match => {
        const view = document.createElement('span');
        try {
          window.katex.render(match[1], view, {
            displayMode: true, throwOnError: true, trust: false, strict: 'ignore'
          });
          const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          const end = match.index + match[0].length;
          let offset = 0;
          let started = false;
          let node;
          while ((node = walker.nextNode())) {
            const next = offset + node.textContent.length;
            if (!started && match.index < next) {
              range.setStart(node, match.index - offset);
              started = true;
            }
            if (started && end <= next) {
              range.setEnd(node, end - offset);
              range.deleteContents();
              range.insertNode(view);
              break;
            }
            offset = next;
          }
        } catch (_) { /* Preserve complete TeX if an original expression is invalid. */ }
      });
    });
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.parentElement || node.parentElement.closest('code, pre, script, style, .katex')) {
          return NodeFilter.FILTER_REJECT;
        }
        return /(^|[^$])\$(?!\$)[^$\n]+\$(?!\$)/.test(node.textContent)
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const inlineNodes = [];
    let textNode;
    while ((textNode = walker.nextNode())) inlineNodes.push(textNode);
    inlineNodes.forEach(node => {
      const source = node.textContent;
      const pattern = /(^|[^$])\$(?!\$)([^$\n]+)\$(?!\$)/g;
      let cursor = 0;
      let match;
      const fragment = document.createDocumentFragment();
      while ((match = pattern.exec(source))) {
        const start = match.index + match[1].length;
        const end = pattern.lastIndex - 1;
        fragment.append(source.slice(cursor, start));
        const view = document.createElement('span');
        try {
          window.katex.render(match[2], view, {
            displayMode: false, throwOnError: true, trust: false, strict: 'ignore'
          });
          fragment.append(view);
          cursor = end + 1;
        } catch (_) {
          fragment.append(source.slice(start, end + 1));
          cursor = end + 1;
        }
      }
      if (cursor) {
        fragment.append(source.slice(cursor));
        node.parentNode.replaceChild(fragment, node);
      }
    });
  };
  // A CDN failure must never hide the original formula source.
  script.onerror = () => { script.remove(); };
  document.head.append(script);
})();
