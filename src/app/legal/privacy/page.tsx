import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead="本サービスにおけるユーザー情報の取り扱いについて定めます。"
    >
      <LegalSection title="取得する情報">
        <p>
          本サービスは、診断回答、自由入力された悩み、診断結果、7日間プランの行動ログ、購入済みフラグを端末内のlocalStorageに保存します。
        </p>
        <p>
          現在のMVPでは、Supabase等の外部データベースへの保存は行っていません。
        </p>
      </LegalSection>

      <LegalSection title="利用目的">
        <p>
          取得した情報は、診断結果の表示、悩みに応じた行動提案、購入済みコンテンツの表示、行動ログの再表示のために利用します。
        </p>
      </LegalSection>

      <LegalSection title="第三者提供">
        <p>
          MVP期間中、ユーザーが入力した診断情報や悩みを第三者へ提供することはありません。将来的に外部サービスと連携する場合は、本ポリシーを更新します。
        </p>
      </LegalSection>

      <LegalSection title="決済情報">
        <p>
          Stripe実接続後の決済情報はStripeにより処理され、本サービス運営者がクレジットカード番号を直接保持することはありません。
        </p>
      </LegalSection>

      <LegalSection title="情報の削除">
        <p>
          MVP期間中に保存された情報は、ブラウザのサイトデータまたはlocalStorageを削除することで消去できます。
        </p>
      </LegalSection>

      <LegalSection title="お問い合わせ">
        <p>メールアドレス：support@example.com（仮）</p>
        <p>制定日：2026年5月18日</p>
      </LegalSection>
    </LegalPage>
  );
}
