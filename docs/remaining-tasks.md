# PreFlopポーカー攻略 残タスク

## 完了済み

- GitHub Pagesで固定URL公開
- Supabase Auth接続
- PreFlop専用テーブル作成
  - `preflop_profiles`
  - `preflop_invite_codes`
  - `preflop_invite_redemptions`
- 招待コードによる会員化RPC
  - `claim_preflop_invite_code`
- サイトURL/Redirect URLのSupabase Auth設定
- 共有用ZIP作成
- TJstudyとPreFlopポーカーのローカルフォルダ分離

## すぐ確認すること

- 新URLでサイトが開けるか
- 会員登録フォームがSupabaseモードになっているか
- 招待コード付き登録後、確認メールを踏んでログインできるか
- 会員限定記事がログイン後に読めるか
- LINE共有時のサムネイル/タイトルが意図通りか

## 運用前にやること

- SupabaseプロジェクトをTJstudyとPreFlopポーカーで完全分離する
- PreFlop用の本番招待コードを作成する
- 使い捨て/人数制限付き招待コードの運用ルールを決める
- 管理者が会員ステータスを確認・停止できる運用手順を作る
- パスワード再設定メールの文面を整える
- 利用規約、プライバシーポリシー、問い合わせ導線を追加する

## 有料会員化前にやること

- Stripe商品とCheckoutを作成する
- Stripe Webhookで `preflop_profiles.membership_status` を更新する
- 支払い失敗、解約、返金時のステータスルールを決める
- 有料記事本文を静的JSからSupabase DatabaseまたはStorageへ移す
- `membership_status = active` のユーザーだけ本文を取得できるRLS/Edge Functionにする

## コンテンツ運用

- 毎週の記事追加テンプレートを固定する
- 記事タイトル、カテゴリ、タグ、読了時間のルールを作る
- 図解画像の命名ルールを作る
- 古い記事の更新日と改訂履歴を残す
- 初心者向け、レンジ、エクイティ、実戦レビューなどのカテゴリを増やす

## デザイン改善

- LINE共有用OGP画像を作る
- スマホで記事本文と図解の余白を再確認する
- レンジチェックをより実戦的なハンド表UIにする
- 会員登録後の案内画面を作る
- 404ページまたは記事未発見ページを整える

## 技術メモ

- 現在の公開URL予定:
  - `https://china0630-lab.github.io/preflop-poker-strategy/`
- 旧URL:
  - `https://china0630-lab.github.io/preflop-poker-members/`
- Supabaseの公開可能キーはフロントに置いてよい
- Supabaseのservice role keyは絶対にフロントへ置かない
