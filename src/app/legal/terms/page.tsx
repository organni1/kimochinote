import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="利用規約"
      lead="きもちノートをご利用いただく前に、本規約の内容をご確認ください。"
    >
      <LegalSection title="第1条（適用）">
        <p>
          本規約は、きもちノート（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーは、本サービスを利用することで本規約に同意したものとみなされます。
        </p>
      </LegalSection>

      <LegalSection title="第2条（サービス内容）">
        <p>
          本サービスは、恋愛不安タイプ、相手の愛情表現タイプ、自由入力された悩みをもとに、関係を見つめ直すためのヒントや行動プランを提供します。
        </p>
        <p>
          本サービスは、相手の気持ち、関係の将来、浮気の有無などを断定するものではありません。
        </p>
      </LegalSection>

      <LegalSection title="第3条（禁止事項）">
        <p>
          ユーザーは、本サービスを不正アクセス、第三者への嫌がらせ、相手の監視や操作、法令または公序良俗に反する目的で利用してはなりません。
        </p>
      </LegalSection>

      <LegalSection title="第4条（有料コンテンツ）">
        <p>
          有料コンテンツは買い切り型です。購入後、対象コンテンツを閲覧できます。MVP期間中は購入状態を端末内のlocalStorageに保存します。
        </p>
      </LegalSection>

      <LegalSection title="第5条（免責事項）">
        <p>
          本サービスで提供する内容は一般的な情報提供であり、医療、心理、法律その他の専門的助言を代替するものではありません。重要な判断は専門家へご相談ください。
        </p>
      </LegalSection>

      <LegalSection title="第6条（規約の変更）">
        <p>
          運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サービス上に表示した時点で効力を生じます。
        </p>
      </LegalSection>

      <LegalSection title="お問い合わせ">
        <p>メールアドレス：support@example.com（仮）</p>
        <p>制定日：2026年5月18日</p>
      </LegalSection>
    </LegalPage>
  );
}
