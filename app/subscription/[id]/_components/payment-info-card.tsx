import PaymentSplitBar from "./payment-splitbar";

type PaymentInfoCardProps = {
  splitBar: React.ComponentProps<typeof PaymentSplitBar>;
  nextPaymentAmount: number;
  totalAccumulatedAmount: number;
};

const formatKRW = (amount: number) => amount.toLocaleString("ko-KR") + "원";

export default function PaymentInfoCard({
  splitBar,
  nextPaymentAmount,
  totalAccumulatedAmount,
}: PaymentInfoCardProps) {
  return (
    <div className="w-full bg-gray-50 flex flex-col gap-5 p-6 rounded-lg">
      <PaymentSplitBar {...splitBar} />

      <div className="flex flex-col gap-2">
        <PaymentRow
          label="다음 결제금액"
          value={formatKRW(nextPaymentAmount)}
          valueClassName="text-brand-primary"
        />
        <PaymentRow
          label="과거 누적금액"
          value={formatKRW(totalAccumulatedAmount)}
          valueClassName="text-gray-400"
        />
      </div>
    </div>
  );
}

function PaymentRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="body-lg font-normal text-gray-300">{label}</span>
      <span className={`body-lg font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}
