#!/usr/bin/env node

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import vm from "node:vm";

const args = process.argv.slice(2);
const markdownPath = args.find((arg) => !arg.startsWith("--"));

if (!markdownPath) {
  console.error("Usage: node scripts/add-article.mjs drafts/article.md [--image path/to/image.jpg] [--date YYYY-MM-DD]");
  process.exit(1);
}

const options = parseArgs(args);
const rootDir = resolve(dirname(new URL(import.meta.url).pathname), "..");
const sourcePath = resolve(markdownPath);
const source = readFileSync(sourcePath, "utf8").trim();
const { meta, markdown } = splitFrontmatter(source);
const lines = markdown.split(/\r?\n/);
const title = meta.title || getTitle(lines) || basename(sourcePath, extname(sourcePath));
const slug = ensureSlug(meta.id || meta.slug || toSlug(basename(sourcePath, extname(sourcePath))) || toSlug(title));
const date = meta.date || options.date || new Date().toISOString().slice(0, 10);
const assetDir = join(rootDir, "assets", "articles", slug);
const copiedImages = copyImages(options.images, assetDir, rootDir);
const body = markdownToBlocks(lines, copiedImages);

const article = {
  id: slug,
  title,
  subtitle: meta.subtitle || firstParagraph(lines) || "新しい攻略記事です。",
  author: meta.author || "ユウジ",
  category: meta.category || "ポーカー攻略",
  date,
  readTime: meta.readTime || `${Math.max(3, Math.ceil(markdown.replace(/\s/g, "").length / 500))}分`,
  memberOnly: parseBoolean(meta.memberOnly, true),
  featured: parseBoolean(meta.featured, false),
  tags: parseList(meta.tags, ["ポーカー"]),
  summary: parseList(meta.summary, buildSummary(lines)),
  body
};

const articlesPath = join(rootDir, "content", "articles.js");
const articles = readArticles(articlesPath);
const existingIndex = articles.findIndex((item) => item.id === article.id);

if (existingIndex >= 0 && !options.replace) {
  console.error(`Article id already exists: ${article.id}`);
  console.error("Use --replace if you want to overwrite it.");
  process.exit(1);
}

if (existingIndex >= 0) {
  articles[existingIndex] = article;
} else {
  articles.push(article);
}

articles.sort((a, b) => b.date.localeCompare(a.date));
writeArticles(articlesPath, articles);

console.log(`Added article: ${article.title}`);
console.log(`ID: ${article.id}`);
console.log(`URL: https://china0630-lab.github.io/preflop-poker-members/#article/${article.id}`);
if (copiedImages.length) {
  console.log(`Images: ${copiedImages.length}`);
}

function parseArgs(values) {
  const parsed = { images: [], replace: false };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--image") parsed.images.push(values[++index]);
    else if (value === "--date") parsed.date = values[++index];
    else if (value === "--replace") parsed.replace = true;
  }
  return parsed;
}

function splitFrontmatter(value) {
  if (!value.startsWith("---")) return { meta: {}, markdown: value };
  const end = value.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, markdown: value };
  return {
    meta: parseFrontmatter(value.slice(3, end).trim()),
    markdown: value.slice(end + 4).trim()
  };
}

function parseFrontmatter(value) {
  const meta = {};
  let currentKey = "";
  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("- ") && currentKey) {
      meta[currentKey] = [...parseList(meta[currentKey], []), line.slice(2).trim()];
      continue;
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    currentKey = match[1];
    meta[currentKey] = match[2].replace(/^["']|["']$/g, "");
  }
  return meta;
}

function getTitle(lines) {
  const line = lines.find((item) => item.startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : "";
}

function firstParagraph(lines) {
  const line = lines.find((item) => {
    const trimmed = item.trim();
    return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">") && !trimmed.startsWith("![");
  });
  return line ? line.trim().slice(0, 90) : "";
}

function markdownToBlocks(lines, copiedImages) {
  const blocks = [];
  const referencedImages = new Set();

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading", text: line.replace(/^##\s+/, "") });
      continue;
    }
    if (line.startsWith("> ")) {
      blocks.push({ type: "callout", text: line.replace(/^>\s+/, "") });
      continue;
    }
    const imageMatch = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (imageMatch) {
      const image = resolveImage(imageMatch[2], copiedImages, referencedImages);
      if (image) {
        referencedImages.add(image.src);
        blocks.push({ type: "image", src: image.src, alt: imageMatch[1] || image.alt, caption: imageMatch[1] || image.alt });
      }
      continue;
    }
    blocks.push({ type: "paragraph", text: line });
  }

  const unreferencedImages = copiedImages.filter((image) => !referencedImages.has(image.src));
  if (unreferencedImages.length === 1) {
    blocks.push({ type: "image", ...unreferencedImages[0] });
  } else if (unreferencedImages.length > 1) {
    blocks.push({ type: "image-gallery", items: unreferencedImages });
  }

  return blocks;
}

function copyImages(images, assetDir, rootDir) {
  if (!images.length) return [];
  mkdirSync(assetDir, { recursive: true });

  return images.map((imagePath, index) => {
    const absolutePath = resolve(imagePath);
    const safeName = `${String(index + 1).padStart(2, "0")}-${toFileName(basename(imagePath))}`;
    const destination = join(assetDir, safeName);
    copyFileSync(absolutePath, destination);
    const src = `./${relative(rootDir, destination).replaceAll("\\", "/")}`;
    return { src, alt: `記事画像 ${index + 1}`, caption: `記事画像 ${index + 1}` };
  });
}

function resolveImage(markdownSrc, copiedImages, referencedImages) {
  const fileName = basename(markdownSrc);
  return copiedImages.find((image) => image.src.endsWith(fileName)) || copiedImages.find((image) => !referencedImages.has(image.src));
}

function readArticles(filePath) {
  const context = { window: {} };
  vm.runInNewContext(readFileSync(filePath, "utf8"), context);
  return context.window.PREFLOP_ARTICLES || [];
}

function writeArticles(filePath, articles) {
  writeFileSync(filePath, `window.PREFLOP_ARTICLES = ${JSON.stringify(articles, null, 2)};\n`);
}

function buildSummary(lines) {
  return lines
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("#") && !trimmed.startsWith(">") && !trimmed.startsWith("![");
    })
    .slice(0, 3)
    .map((line) => line.trim().slice(0, 56));
}

function parseList(value, fallback) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return fallback;
  return String(value)
    .split(/[,、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === "") return fallback;
  return ["true", "yes", "1", "on"].includes(String(value).toLowerCase());
}

function ensureSlug(value) {
  return value || `article-${Date.now()}`;
}

function toSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 80);
}

function toFileName(value) {
  const extension = extname(value).toLowerCase();
  const name = basename(value, extension);
  return `${toSlug(name) || "image"}${extension || ".jpg"}`;
}
