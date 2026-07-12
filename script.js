const app = document.querySelector("#app");
const articles = window.PREFLOP_ARTICLES || [];
const externalLinks = window.PREFLOP_LINKS || [];

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function breakableText(value = "", interval = 8) {
  return Array.from(String(value))
    .map((char, index) => `${escapeHtml(char)}${(index + 1) % interval === 0 ? "<wbr>" : "&#8203;"}`)
    .join("");
}

function chunkedTitle(value = "", interval = 11) {
  const chars = Array.from(String(value));
  const chunks = [];
  for (let i = 0; i < chars.length; i += interval) {
    chunks.push(chars.slice(i, i + interval).map(escapeHtml).join(""));
  }
  return chunks.map((chunk) => `<span class="title-chunk">${chunk}</span>`).join("");
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function articleUrl(article) {
  return `#article/${article.id}`;
}

function sortedArticles() {
  return [...articles].sort((a, b) => (a.order || 999) - (b.order || 999) || a.date.localeCompare(b.date));
}

function episodeLabel(index) {
  return `第${index + 1}回`;
}

function renderHome() {
  const latest = sortedArticles();

  app.innerHTML = `
    <section class="hero compact-hero">
      <div class="hero-copy">
        <p class="eyebrow">PreFlop Poker Guide</p>
        <h1><span>プリフロップ大宮</span><span>ポーカー攻略</span></h1>
        <p class="lead">
          ゆうきさんの記事とX投稿を、スマホでも読みやすい順番に整理したページです。
        </p>
        <div class="hero-actions">
          <a class="primary-button" href="#articles">記事を読む</a>
          <a class="secondary-button" href="#other">その他コンテンツ</a>
        </div>
      </div>
    </section>

    ${renderArticleGrid(latest, "連載一覧", "第1回から順番に読む")}
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
    ${renderArticleGrid(sortedArticles(), "連載一覧", "古い記事から順番に並べています")}
  `;
}

function renderArticleGrid(items, title, subtitle) {
  return `
    <section class="article-library">
      <div class="section-head">
        <div>
          <p class="eyebrow">${escapeHtml(subtitle)}</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
      </div>
      <div class="series-list">
        ${items.map((article, index) => `
          <article class="article-card">
            ${article.heroImage ? `
              <figure class="card-thumb">
                <img src="${escapeHtml(article.heroImage)}?v=20260712-roadmap-clean-v10" alt="" />
              </figure>
            ` : ""}
            <div class="article-card-body">
              <div class="card-meta">
                <span>${episodeLabel(article.order ? article.order - 1 : index)}</span>
                <span>${escapeHtml(article.category)}</span>
                <span>${formatDate(article.date)}</span>
                <span>読了 ${escapeHtml(article.readTime)}</span>
              </div>
              <h3>${chunkedTitle(article.title, 13)}</h3>
              <p>${escapeHtml(article.subtitle)}</p>
              <ul>
                ${article.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
              <a href="${articleUrl(article)}">記事を読む</a>
            </div>
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
  const bodyHtml = article.body
    .filter((block) => !(block.type === "image" && block.src === article.heroImage))
    .map(renderBlock)
    .join("");

  app.innerHTML = `
    <article class="article-page">
      <a class="back-link" href="#articles">記事一覧へ戻る</a>
      <header class="article-hero">
        <div>
          <p class="eyebrow">${escapeHtml(article.category)} / ${formatDate(article.date)}</p>
          <h1>${chunkedTitle(article.title, 10)}</h1>
          <p>${escapeHtml(article.subtitle)}</p>
          <div class="article-meta">
            <span>${escapeHtml(article.author)}</span>
            <span>読了 ${escapeHtml(article.readTime)}</span>
          </div>
        </div>
      </header>
      ${article.heroImage ? `
        <figure class="article-top-image">
          <img src="${escapeHtml(article.heroImage)}?v=20260712-roadmap-clean-v10" alt="" />
        </figure>
      ` : ""}
      <section class="article-summary">
          <h2>この記事の要点</h2>
          <ul>
            ${article.summary.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
      </section>
      <div class="article-layout">
        <div class="article-body">
          ${bodyHtml}
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
      return `<h2>${breakableText(block.text, 9)}</h2>`;
    case "paragraph":
      return `<p>${escapeHtml(block.text)}</p>`;
    case "quote":
      return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
    case "bullets":
      return `<ul class="content-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    case "image":
      return `
        <figure class="article-image">
          <img src="${escapeHtml(block.src)}?v=20260712-roadmap-clean-v10" alt="${escapeHtml(block.alt)}" />
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
    <section class="other-contents">
      <div class="section-head">
        <div>
          <p class="eyebrow">Links</p>
          <h2>その他コンテンツ</h2>
        </div>
      </div>
      <div class="link-list">
        ${externalLinks.map((link, index) => `
          <a class="link-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
            <span>X記事 ${String(index + 1).padStart(2, "0")}${link.date ? ` / ${formatDate(link.date)}` : ""}</span>
            <strong>${escapeHtml(link.title)}</strong>
            <p>${escapeHtml(link.description)}</p>
            <small>${escapeHtml(link.url)}</small>
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
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
