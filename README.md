# PreFlopポーカー攻略

ポーカー攻略記事を公開する静的サイトです。

## できること

- 毎週の記事追加: `content/articles.js` に記事オブジェクトを追加
- その他コンテンツ: ゆうきさんのX記事リンクを一覧化
- 固定URL運用: Vercelで公開し、同じサイトURLを維持

## 公開URL

```text
https://preflop-poker-strategy.vercel.app/
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

VercelとGitHubを連携しているため、毎週記事を追加しても公開URLは変わりません。

- Repository: `https://github.com/china0630-lab/preflop-omiya-poker-guide`
- Production branch: `main`
- Live URL: `https://preflop-poker-strategy.vercel.app/`

以後は、記事を追加して`main`へpushするだけで同じURLが更新されます。

## 本番会員制にする場合

Supabase設定を入れると、ログイン情報はSupabase Authで管理されます。
詳しい設定手順は `docs/supabase-member-management.md` を参照してください。

現在の構成:

- Supabase Auth: ログインID/メール、パスワード
- Supabase Database: 招待コード、会員ステータス
- Vercel: サイト配信

記事本文の完全な有料保護は次フェーズです。共有前の注意点は `docs/security-sharing-checklist.md` にまとめています。
