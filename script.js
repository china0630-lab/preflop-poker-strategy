const app = document.querySelector("#app");
const articles = window.PREFLOP_ARTICLES || [];
const externalLinks = window.PREFLOP_LINKS || [];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function articleUrl(article) {
  return `#article/${article.id}`;
}

function sortedArticles() {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

function renderHome() {
  const latest = sortedArticles();

  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">PreFlop Poker Guide</p>
        <h1>PreFlopポーカー攻略</h1>
        <p class="lead">
          ゆうきさんの記事内容を、スマホでもPCでも読みやすいように整理したページです。
          ここでは、渡された記事だけを掲載しています。
        </p>
        <div class="hero-actions">
          <a class="primary-button" href="#articles">記事を読む</a>
          <a class="secondary-button" href="#other">その他コンテンツ</a>
        </div>
      </div>
      <figure class="hero-visual">
        <img src="./assets/preflop-logo.jpg" alt="PreFlop ポーカー攻略班ロゴ" />
      </figure>
    </section>

    <section class="summary-band" aria-label="掲載内容">
      <div>
        <span>掲載記事</span>
        <strong>${latest.length}本</strong>
      </div>
      <div>
        <span>形式</span>
        <strong>公開ページ</strong>
      </div>
      <div>
        <span>対応</span>
        <strong>スマホ / iPad / PC</strong>
      </div>
    </section>

    ${renderArticleGrid(latest, "記事一覧", "現在掲載している記事")}
    ${renderOtherContents()}
  `;
}

function renderArticlesPage() {
  app.innerHTML = `
    <section class="page-title">
      <p class="eyebrow">Articles</p>
      <h1>記事一覧</h1>
      <p>いま掲載している記事だけを一覧にしています。</p>
    </section>
    ${renderArticleGrid(sortedArticles(), "掲載記事", "ゆうきさんの記事内容の整理")}
  `;
}

function renderArticleGrid(items, title, subtitle) {
  return `
    <section id="articles" class="article-library">
      <div class="section-head">
        <div>
          <p class="eyebrow">${escapeHtml(subtitle)}</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
      </div>
      <div class="cards">
        ${items.map((article) => `
          <article class="article-card">
            ${article.heroImage ? `
              <figure class="card-thumb">
                <img src="${escapeHtml(article.heroImage)}" alt="" />
              </figure>
            ` : ""}
            <div class="card-meta">
              <span>${escapeHtml(article.category)}</span>
              <span>${formatDate(article.date)}</span>
              <span>読了 ${escapeHtml(article.readTime)}</span>
            </div>
            <h3>${escapeHtml(article.title)}</h3>
            <p>${escapeHtml(article.subtitle)}</p>
            <ul>
              ${article.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <a href="${articleUrl(article)}">記事を読む</a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderArticlePage(id) {
  const article = articles.find((item) => item.id === id);
  if (!article) {
    renderNotFound();
    return;
  }

  app.innerHTML = `
    <article class="article-page">
      <a class="back-link" href="#articles">記事一覧へ戻る</a>
      <header class="article-hero">
        <div>
          <p class="eyebrow">${escapeHtml(article.category)} / ${formatDate(article.date)}</p>
          <h1>${escapeHtml(article.title)}</h1>
          <p>${escapeHtml(article.subtitle)}</p>
          <div class="article-meta">
            <span>${escapeHtml(article.author)}</span>
            <span>読了 ${escapeHtml(article.readTime)}</span>
          </div>
        </div>
      </header>
      <div class="article-layout">
        <aside class="article-summary">
          <h2>この記事の要点</h2>
          <ul>
            ${article.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </aside>
        <div class="article-body">
          ${article.body.map(renderBlock).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderBlock(block) {
  switch (block.type) {
    case "lead":
      return `<p class="article-lead">${escapeHtml(block.text)}</p>`;
    case "heading":
      return `<h2>${escapeHtml(block.text)}</h2>`;
    case "paragraph":
      return `<p>${escapeHtml(block.text)}</p>`;
    case "quote":
      return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
    case "bullets":
      return `<ul class="content-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    case "image":
      return `
        <figure class="article-image">
          <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" />
          <figcaption>${escapeHtml(block.caption)}</figcaption>
        </figure>
      `;
    case "compare":
      return `
        <div class="compare-grid">
          ${block.items.map((item) => `
            <section>
              <span>${escapeHtml(item.label)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </section>
          `).join("")}
        </div>
      `;
    case "info":
      return `
        <section class="info-table">
          <h3>${escapeHtml(block.title)}</h3>
          ${block.rows.map(([label, value]) => `
            <div>
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </div>
          `).join("")}
        </section>
      `;
    case "timeline":
      return `
        <ol class="timeline">
          ${block.items.map(([label, value]) => `
            <li>
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </li>
          `).join("")}
        </ol>
      `;
    default:
      return "";
  }
}

function renderOtherPage() {
  app.innerHTML = `
    <section class="page-title">
      <p class="eyebrow">Other Contents</p>
      <h1>その他コンテンツ</h1>
      <p>記事以外の関連リンクをまとめています。</p>
    </section>
    ${renderOtherContents()}
  `;
}

function renderOtherContents() {
  return `
    <section id="other" class="other-contents">
      <div class="section-head">
        <div>
          <p class="eyebrow">Links</p>
          <h2>その他コンテンツ</h2>
        </div>
      </div>
      <div class="link-list">
        ${externalLinks.map((link) => `
          <a class="link-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
            <span>外部リンク</span>
            <strong>${escapeHtml(link.title)}</strong>
            <p>${escapeHtml(link.description)}</p>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="page-title">
      <p class="eyebrow">404</p>
      <h1>ページが見つかりません</h1>
      <p>記事一覧から読みたい記事を選んでください。</p>
      <a class="primary-button" href="#articles">記事一覧へ</a>
    </section>
  `;
}

function setActiveNav(route) {
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    const active = route === href || (route.startsWith("article/") && href === "articles");
    link.classList.toggle("active", active);
  });
}

function render() {
  const route = location.hash.replace("#", "") || "home";
  setActiveNav(route);

  if (route === "home") renderHome();
  else if (route === "articles") renderArticlesPage();
  else if (route === "other") renderOtherPage();
  else if (route.startsWith("article/")) renderArticlePage(route.replace("article/", ""));
  else renderNotFound();

  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", render);
render();
