# きもちノート / Kimochi Note

恋愛不安タイプと彼の愛情表現タイプを診断し、自由入力の悩みも踏まえて、今日の行動アドバイスと7日間アクションプランを提供するNext.js MVPです。

## 起動方法

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 環境変数

`.env.local` に以下を設定します。実値はGitにコミットしないでください。

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true
```

`NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true` はローカル開発用です。本番では `false` または未設定にしてください。実装側でも `NODE_ENV === "development"` の時だけ有効になります。

## Supabase Auth設定

Magic Linkを使うため、Supabase Dashboardで以下を確認します。

1. `Authentication` → `URL Configuration` を開く
2. `Site URL` にローカルでは `http://localhost:3000` を設定する
3. `Redirect URLs` に `http://localhost:3000/auth/callback` を追加する
4. 本番公開後は本番URLも追加する
5. Vercelなどのプレビュー環境を使う場合は、必要に応じてSupabaseのRedirect URLワイルドカードを設定する

参考: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

## Magic Linkメールが届かない場合

Supabaseの標準メール送信は開発・検証用で制限があります。メールが届かない、または本番販売に進む場合は、`Authentication` のSMTP設定でResend、AWS SES、Postmark、SendGridなどのSMTPを接続してください。

Supabase公式ドキュメントでは、カスタムSMTP未設定の場合に送信先やレート制限があるため、本番用途ではカスタムSMTPが推奨されています。

参考: [Supabase Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

ローカルでStripe決済だけ確認したい場合は、`NEXT_PUBLIC_ENABLE_DEV_CHECKOUT=true` の状態で `/checkout/confirm` に表示される「テスト購入へ進む」を使います。

## StripeローカルWebhook確認

Stripe CLIを起動して、SandboxイベントをローカルのWebhookへ転送します。

```powershell
C:\Tools\stripe\stripe.exe listen --forward-to localhost:3000/api/stripe/webhook
```

表示された `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定し、`npm run dev` を再起動します。

## 検証コマンド

```bash
npm run lint
npm run build
```

文字化け確認は、UTF-8としてファイルを読める環境で以下を実行します。

```bash
node -e "const fs=require('fs'),p=require('path'),bad=new Set([0xe3,0xe8,0xe5,0xe6,0xe7,0xe2,0xa0]);function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=p.join(d,e.name);if(e.isDirectory())w(f);else if(/\.(ts|tsx|sql|css|md)$/.test(f)){const s=fs.readFileSync(f,'utf8');for(const ch of s){if(bad.has(ch.codePointAt(0))){console.log(f);break;}}}}}['src','supabase'].forEach(w)"
```

PowerShellの表示設定によっては、`Get-Content` の出力だけが文字化けして見えることがあります。その場合はブラウザ表示、`rg`、またはNode.jsでUTF-8として読み込んだ結果を優先してください。

## 次の候補

- SupabaseのカスタムSMTP設定
- Magic Linkが不安定な場合のメール+パスワード認証
- Day2以降の行動ログ入力
- マイページと購入復元導線
