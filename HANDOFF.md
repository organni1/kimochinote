# きもちノート / Kimochi Note Handoff

最終更新: 2026-05-31

## プロジェクト概要

「きもちノート」は、恋愛不安タイプと彼の愛情表現タイプを診断し、自由入力の悩みも踏まえて、今日の行動アドバイスと7日間アクションプランを提供する日本語Webサービスです。

現在の実装は Next.js App Router + TypeScript + Tailwind CSS の本稼働前候補です。Supabase Auth/DB、Stripe Checkout、Stripe Webhook、購入復元、Day1〜Day7ログ、マイページ、SNS共有まで実装済みです。

主な画面:

- `/`: トップページ
- `/diagnosis/start`: 診断開始
- `/diagnosis/self`: 自分側診断
- `/diagnosis/partner`: 彼側診断
- `/diagnosis/context`: 自由入力
- `/diagnosis/loading`: 結果生成
- `/diagnosis/result`: 診断結果
- `/plan/offer`: 7日間プラン紹介
- `/checkout/confirm`: 購入確認
- `/checkout/success`: Stripe決済成功後
- `/plan/7days`: 購入済み7日間プラン
- `/plan/log/day/[day]`: 行動ログ入力
- `/legal/terms`, `/legal/privacy`, `/legal/commercial-transactions`: 法務ページ

## 現在の状態

完了済み:

- 主要画面の実装
- Sample UI / icons / illustrations を `public/assets` 配下に整理
- 診断20問、スコアリング、悩みカテゴリ判定、今日の行動出し分け
- localStorage保存
- 7日間プラン、Day1〜Day7行動ログ保存
- 法務ページ追加
- Stripe Checkout API追加
- `/checkout/success` で決済成功後に購入済みフラグを保存
- Supabase Auth Magic Link導入
- Supabase保存用の `profiles`, `diagnosis_results`, `action_logs`, `purchases` 想定実装
- Stripe Webhook `checkout.session.completed` 受信実装
- 開発用Checkout導線を `NODE_ENV === "development"` かつ `NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true` の時だけ表示
- AuthPanelにメール未着時の案内を追加
- READMEにSupabase/Stripe運用手順を追加
- 購入復元導線、マイページ、SNS共有、法務ページ本番文言を追加

最新の主要コミット:

- `45c8075 Initial Kimochi Note MVP`
- `f4ad593 Add Supabase persistence and Stripe checkout verification`
- `a4145fb Stabilize Supabase auth setup guidance`

## ローカル起動

```powershell
npm install
npm run dev
```

通常は `http://localhost:3000` を開きます。既に3000番が使われている場合、Next.jsが別ポートを使うことがあります。

検証:

```powershell
npm run lint
npm run build
```

## 必要な環境変数

`.env.local` に設定します。実値は絶対にGitへコミットしないでください。

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://kimochinote.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true
```

本番では `NEXT_PUBLIC_APP_URL=https://kimochinote.com`、`NEXT_PUBLIC_SITE_URL=https://kimochinote.com`、`NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=false` または未設定にします。StripeとSupabaseの秘密値は本番用をCloudflareに設定します。

## Supabase設定

Supabase Dashboardで以下を確認します。

1. `Authentication` -> `URL Configuration`
2. ローカル `Site URL`: `http://localhost:3000`
3. ローカル `Redirect URLs`: `http://localhost:3000/auth/callback`
4. 本番 `Site URL`: `https://kimochinote.com`
5. 本番 `Redirect URLs`: `https://kimochinote.com/auth/callback`
6. Vercel Previewを使う場合は、Preview URLも追加

DBテーブルは `supabase/schema.sql` をSupabase SQL Editorで実行して作成します。

重要:

- `SUPABASE_SERVICE_ROLE_KEY` は `Project Settings` -> `API Keys` から取得します。
- `anon` / `publishable` / `JWT Secret` ではなく、Service Role系のキーを使います。
- 現在、通常購入で「購入情報を保存する準備に失敗しました」と出る場合は、まず `SUPABASE_SERVICE_ROLE_KEY` が正しいか確認してください。
- ローカル確認では、Supabase REST APIが `Invalid API key` を返していたため、キーの取り違えが最有力原因です。

Magic Linkが届かない場合:

- ResendなどのSMTPサービスをSupabase Authに接続します。
- 送信元ドメインをResendでVerifyし、SPF / DKIM / DMARCをDNSへ設定します。
- SupabaseのSMTP設定例:
  - Host: `smtp.resend.com`
  - Port: `465`
  - Username: `resend`
  - Password: Resend API Key
  - Sender email: `no-reply@認証済みドメイン`
  - Sender name: `Kimochi Note`

## Stripe設定

ローカルではStripe CheckoutをSandbox/Test Modeで確認します。

ローカルWebhook:

```powershell
C:\Tools\stripe\stripe.exe listen --forward-to localhost:3000/api/stripe/webhook
```

表示された `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定し、`npm run dev` を再起動します。

購入確認:

1. `/checkout/confirm` を開く
2. Magic Linkでログイン
3. `480円で購入する` を押す
4. Stripe Checkoutへ遷移
5. テストカード `4242 4242 4242 4242` で支払い
6. `/checkout/success` 経由で `/plan/7days` が表示される
7. Stripe CLIに `checkout.session.completed` が届くことを確認

開発用の認証スキップ購入:

- `.env.local` で `NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true`
- `NODE_ENV === "development"` の時だけ `/checkout/confirm` に「テスト購入へ進む」が表示されます。
- 本番ビルドには表示されないガード済みです。

本番ではStripe DashboardでWebhook endpointを `https://kimochinote.com/api/stripe/webhook` に設定し、`checkout.session.completed` を購読します。Stripeの事業者情報、WebサイトURL、特商法ページ、問い合わせ先が一致していることを確認してください。

## 次にやること

最優先:

1. Cloudflareに本番環境変数を設定する
2. Supabase Authの本番Site URL / Redirect URLを設定する
3. Stripe Live modeのWebhookを `https://kimochinote.com/api/stripe/webhook` に設定する
4. `npm run lint` と `npm run build` を通す
5. 本番ドメインでMagic Link、480円購入、Webhook保存、購入復元を確認する

次の実装候補:

- Resend SMTPの本番設定と送信ログ確認
- メール+パスワード認証の追加検討
- 1か月アクションプランの別途検討
- 本番リリース後のアクセス解析/エラー監視

## 注意点

- `.env.local` やAPIキーは絶対にコミットしないでください。
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー側専用です。クライアントコンポーネントで使わないでください。
- Supabase Service Role KeyはRLSを回避できる強いキーです。GitHubに漏れると危険です。
- `Get-Content` の表示だけが文字化けして見える場合があります。実ファイル確認はブラウザ表示、`rg`、Node.jsのUTF-8読み込みを優先してください。
- `.codex/` はCodexアプリの自動生成メタデータです。現時点ではコミット対象にしていません。
- `public/assets/sample-ui` は参照画像です。実画面はNext.js/Tailwindで再現しています。
- Supabase/StripeのDashboard設定はコードだけでは完了しません。別端末では必ずDashboard側も確認してください。
- 本番公開前の最終確認は `RELEASE_CHECKLIST.md` に沿って進めてください。

## 参考ファイル

- `README.md`: 起動・Supabase・Stripeの基本手順
- `.env.example`: 必要な環境変数
- `supabase/schema.sql`: Supabaseテーブル定義
- `src/app/api/checkout/session/route.ts`: Stripe Checkout Session作成
- `src/app/api/stripe/webhook/route.ts`: Stripe Webhook
- `src/components/auth/AuthPanel.tsx`: Magic Link認証UI
- `src/lib/supabase/userData.ts`: Supabase保存/読込処理
- `src/lib/storage/diagnosisStorage.ts`: localStorage保存処理
