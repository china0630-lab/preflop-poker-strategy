# 毎週の記事更新フロー

## 目的

ユウジさんが毎週作成する記事を、PreFlopサイトに1ページずつ追加していく。

## 更新手順

1. ユウジさんの記事本文を受け取る
2. 原稿を `drafts/` に保存する
3. 画像がある場合は手元の画像パスを控える
4. `scripts/add-article.mjs` を実行して記事と画像を自動追加する
5. ブラウザで記事一覧と詳細ページを確認する
6. GitにコミットしてGitHubへpushする
7. Vercelのデプロイ完了後、公開URLで確認する

## URLの考え方

記事URLは次の形式です。

```text
https://preflop-poker-strategy.vercel.app/#article/{article-id}
```

サイト本体のURLは固定し、記事だけを追加していきます。

サイト本体のURLを書き換える必要はありません。毎週変わるのは `article-id` の部分だけです。

## 記事追加時のチェック

- タイトルが一覧に出ている
- 未ログイン時は会員限定ガードが出る
- ログイン後に本文が読める
- スマホで画像と本文が横にはみ出さない
- 日付とカテゴリが正しい

## Codexに送る時の形

次の2つを送れば、Codex側で記事追加まで進められます。

- 記事本文
- 使用する画像ファイル

原稿にメタ情報を入れる場合:

```markdown
---
id: btn-open-range
title: BTNで参加レンジが広がる理由
subtitle: 後ろに残る人数が少ないほど、強いハンドにぶつかる確率は下がる。
category: プリフロップ
tags: BTN, ポジション, レンジ
summary:
- BTNは後ろがSB/BBだけ。
- 広げてよい理由は運ではなく確率。
- 広げすぎるとBBのディフェンスに負ける。
---

# BTNで参加レンジが広がる理由

## なぜBTNは広く参加できるのか

本文をここに入れます。
```

## 自動追加コマンド

ユウジさんからMarkdownやテキスト原稿を受け取ったら、まず `drafts/` に保存します。

例:

```text
drafts/2026-06-20-btn-open-range.md
```

次に自動追加スクリプトを実行します。

```bash
node scripts/add-article.mjs drafts/2026-06-20-btn-open-range.md --image /path/to/image.jpg
```

このコマンドで、次の処理をまとめて行います。

- 画像を `assets/articles/{article-id}/` にコピー
- `content/articles.js` に記事を追加
- 記事URLを表示

見出しと本文の変換ルール:

- `# タイトル` → 記事タイトル
- `## 見出し` → 記事内見出し
- `> 強調文` → コールアウト
- `![説明](画像名.jpg)` → 記事内画像
- その他の行 → 段落

最終公開前に `subtitle`, `summary`, `tags`, `category` は人の目で整えてください。
