import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead="本サービスにおけるユーザー情報の取り扱いについて定めます。"
    >
      <LegalSection title="取得する情報">
        <p>
          本サービスは、メールアドレス、診断回答、自由入力された悩み、診断結果、
          7日間プランの行動ログ、購入履歴を取得・保存します。
        </p>
        <p>
          端末内のlocalStorageにも、診断結果や行動ログをフォールバックとして保存する場合があります。
        </p>
      </LegalSection>

      <LegalSection title="利用目的">
        <p>
          取得した情報は、診断結果の表示、悩みに応じた行動提案、購入済みコンテンツの表示、
          行動ログの再表示、購入情報の復元のために利用します。
        </p>
      </LegalSection>

      <LegalSection title="保存先">
        <p>
          診断結果、行動ログ、購入履歴はSupabaseに保存します。
          決済情報はStripeにより処理され、本サービス運営者がクレジットカード番号を直接保持することはありません。
        </p>
      </LegalSection>

      <LegalSection title="第三者提供">
        <p>
          法令に基づく場合を除き、ユーザーが入力した診断情報や悩みを第三者へ販売・提供することはありません。
          決済処理とデータ保存のため、StripeおよびSupabaseを利用します。
        </p>
      </LegalSection>

      <LegalSection title="情報の削除">
        <p>
          保存情報の削除を希望する場合は、お問い合わせ先までご連絡ください。
          端末内の情報は、ブラウザのサイトデータまたはlocalStorageを削除することで消去できます。
        </p>
      </LegalSection>

      <LegalSection title="お問い合わせ">
        <p>メールアドレス：support@example.com（仮）</p>
        <p>制定日：2026年5月18日</p>
      </LegalSection>
    </LegalPage>
  );
}
