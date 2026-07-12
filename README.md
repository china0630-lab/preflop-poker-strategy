# PreFlopポーカー攻略

会員制ポーカー攻略サイトの静的プロトタイプです。

## できること

- 毎週の記事追加: `content/articles.js` に記事オブジェクトを追加
- 会員登録ベース: ログインID/メール、パスワード、招待コード
- 招待コード: `PREFLOP-2026`, `YUJI-WEEKLY`, `RANGE-LAB`
- 会員限定記事: 未ログインの場合はログイン/登録画面へ誘導
- 固定URL運用: GitHub Pagesで公開し、同じサイトURLを維持

## 公開URL

```text
https://china0630-lab.github.io/preflop-omiya-poker-guide/
```

## 毎週の記事更新

1. ユウジさんの記事原稿をMarkdownまたはテキストで `drafts/` に保存する
2. 画像がある場合は `--image` で指定する
3. `scripts/add-article.mjs` を実行する
4. ローカルで表示確認する
5. GitへコミットしてGitHubへpushする

記事URLは `id` から自動で決まります。サイト本体のURLを書き換える必要はありません。

例:

```bash
node scripts/add-article.mjs drafts/weekly-article-sample.md --image /path/to/image.jpg
```

記事本文の型は `templates/article-template.js` を参照してください。

## 固定URL運用

GitHub Pagesを使っているため、毎週記事を追加しても公開URLは変わりません。

- Repository: `https://github.com/china0630-lab/preflop-omiya-poker-guide`
- Pages source: `main` branch / `/ (root)`
- Live URL: `https://china0630-lab.github.io/preflop-omiya-poker-guide/`

以後は、記事を追加して`main`へpushするだけで同じURLが更新されます。

## 本番会員制にする場合

Supabase設定を入れると、ログイン情報はSupabase Authで管理されます。
詳しい設定手順は `docs/supabase-member-management.md` を参照してください。

現在の構成:

- Supabase Auth: ログインID/メール、パスワード
- Supabase Database: 招待コード、会員ステータス
- GitHub Pages: サイト配信

記事本文の完全な有料保護は次フェーズです。共有前の注意点は `docs/security-sharing-checklist.md` にまとめています。
