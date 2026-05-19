import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export default function CommercialTransactionsPage() {
  return (
    <LegalPage
      title="特定商取引法に基づく表記"
      lead="有料コンテンツ販売に関する表示です。正式販売前に実情報へ差し替えてください。"
    >
      <LegalSection title="販売事業者">
        <p>きもちノート運営（仮）</p>
      </LegalSection>

      <LegalSection title="運営責任者">
        <p>運営責任者名：未定（仮）</p>
      </LegalSection>

      <LegalSection title="所在地">
        <p>請求があった場合、遅滞なく開示します。（MVP仮表記）</p>
      </LegalSection>

      <LegalSection title="お問い合わせ先">
        <p>メールアドレス：support@example.com（仮）</p>
        <p>電話番号：請求があった場合、遅滞なく開示します。（MVP仮表記）</p>
      </LegalSection>

      <LegalSection title="販売価格">
        <p>7日間アクションプラン：480円（税込）</p>
      </LegalSection>

      <LegalSection title="商品代金以外の必要料金">
        <p>インターネット接続に必要な通信料等はユーザーの負担となります。</p>
      </LegalSection>

      <LegalSection title="支払い方法">
        <p>クレジットカード、Apple Pay、Google Pay（Stripe接続後に対応予定）</p>
      </LegalSection>

      <LegalSection title="商品の引き渡し時期">
        <p>購入手続き完了後、すぐにWeb画面上で閲覧できます。</p>
      </LegalSection>

      <LegalSection title="返品・キャンセル">
        <p>
          デジタルコンテンツの性質上、購入後の返品・キャンセルは原則としてお受けできません。ただし、法令上必要な場合はこの限りではありません。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
