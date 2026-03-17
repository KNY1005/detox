type SoloProps = {
  type: "solo";
  myAmount: number;
  label?: string;
};

type GroupProps = {
  type: "group";
  myAmount: number;
  totalAmount: number;
  /** 나를 제외한 파티원 수 */
  partyCount: number;
  label?: string;
};

type PaymentSplitBarProps = SoloProps | GroupProps;

const formatKRW = (amount: number) => amount.toLocaleString("ko-KR") + "원";

export default function PaymentSplitBar(props: PaymentSplitBarProps) {
  const { myAmount, label = "내 부담금" } = props;
  const isGroup = props.type === "group";

  const partyTotal = isGroup
    ? Math.max(props.totalAmount - props.myAmount, 0)
    : 0;
  const hasPartyShare = isGroup && props.totalAmount > 0 && partyTotal > 0;
  const myPct = hasPartyShare
    ? Math.round((props.myAmount / props.totalAmount) * 100)
    : 100;
  const partyPct = hasPartyShare ? 100 - myPct : 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Bar */}
      <div className="flex w-full rounded-md overflow-hidden">
        {/* 내 부담금 */}
        <div
          className="flex items-center justify-center px-3 py-1 bg-state-primary shrink-0 transition-all duration-300"
          style={{ width: `${myPct}%`, minWidth: 80 }}
        >
          <span className="body-md font-bold text-white whitespace-nowrap">
            {formatKRW(myAmount)}
          </span>
        </div>

        {/* 파티원 부담금 (multi only) */}
        {hasPartyShare && (
          <div
            className="flex items-center justify-center px-3 py-1 bg-blue-100 shrink-0 transition-all duration-300"
            style={{ width: `${partyPct}%`, minWidth: 80 }}
          >
            <span className="body-md font-bold text-gray-400 whitespace-nowrap">
              {formatKRW(partyTotal)}&nbsp;({props.partyCount}명)
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 px-0.5">
        <Dot className="bg-state-primary" />
        <span className="body-md font-bold text-gray-400 mr-4">{label}</span>

        {hasPartyShare && (
          <>
            <Dot className="bg-blue-100" />
            <span className="body-md font-bold text-gray-400">
              파티원 부담금
            </span>
          </>
        )}
      </div>
    </div>
  );
}
function Dot({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block w-3.5 h-3.5 rounded-sm shrink-0 ${className}`}
    />
  );
}
