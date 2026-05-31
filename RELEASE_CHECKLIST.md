# Kimochi Note 本稼働前チェックリスト

最終更新: 2026-05-31

## 1. コード状態

- [ ] リリース対象の差分だけが含まれていることを確認する。
- [ ] `npm.cmd run lint` が成功する。
- [ ] `npm.cmd run build` が成功する。
- [ ] `.env.local` や秘密鍵がGit管理対象に入っていない。
- [ ] `NEXT_PUBLIC_ENABLE_DEV_CHECKOUT` が本番で `false` または未設定になっている。

## 2. Cloudflare

- [ ] 本番ドメインが `https://kimochinote.com` で開ける。
- [ ] `NEXT_PUBLIC_APP_URL=https://kimochinote.com` を設定する。
- [ ] `NEXT_PUBLIC_SITE_URL=https://kimochinote.com` を設定する。
- [ ] Supabaseの公開URL/anon keyを設定する。
- [ ] `SUPABASE_SERVICE_ROLE_KEY` を本番値で設定する。
- [ ] StripeのLive mode `STRIPE_SECRET_KEY` を設定する。
- [ ] StripeのLive mode `STRIPE_WEBHOOK_SECRET` を設定する。

## 3. Supabase

- [ ] `supabase/schema.sql` のテーブルが本番プロジェクトに作成済み。
- [ ] Auth Site URLが `https://kimochinote.com`。
- [ ] Redirect URLに `https://kimochinote.com/auth/callback` がある。
- [ ] Magic Linkメールから本番ドメインへ戻れる。
- [ ] 必要に応じてResendなどのカスタムSMTPを設定済み。

## 4. Stripe

- [ ] Stripeの事業者情報とWebサイトURLが本番表示と一致している。
- [ ] Webhook endpointが `https://kimochinote.com/api/stripe/webhook`。
- [ ] Webhook eventに `checkout.session.completed` が含まれている。
- [ ] 480円のCheckoutが開始できる。
- [ ] 決済成功後にSupabaseの `purchases` に購入情報が保存される。

## 5. リリース確認シナリオ

- [ ] 未ログインで `/checkout/confirm` の購入ボタンを押すとメール認証案内へ誘導される。
- [ ] Magic Linkログイン後、Stripe Checkoutへ進める。
- [ ] 決済成功後、`/checkout/success` から `/plan/7days` に遷移する。
- [ ] localStorage空の別ブラウザでも、同じメールでログインすると購入復元できる。
- [ ] `/plan/7days` でDay1〜Day7が表示される。
- [ ] Day2〜Day7のログ記録と再編集ができる。
- [ ] 最新の記録済みDayカード内に「今日の一歩をシェア」が表示される。
- [ ] 未記録時は共有ボタンではなく「記録後にシェアできます」案内になる。
- [ ] SNS共有文/画像に自由入力の悩み、彼の反応、メール、購入情報が含まれない。
- [ ] `/mypage` で購入状態、診断結果、ログ進捗、復元/保存/ログアウトが確認できる。
- [ ] 特商法ページに `Kimochi Note運営`、`加藤聖也`、`support@kimochinote.com` が表示される。

## 6. リリース後

- [ ] Stripe Dashboardで本番決済とWebhook成功を確認する。
- [ ] Supabaseで購入/ログ保存のレコードを確認する。
- [ ] Magic Linkの到達率と送信エラーを確認する。
- [ ] 問い合わせメール `support@kimochinote.com` の受信確認をする。
