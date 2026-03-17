type MetaItem = {
  label: string;
  value: string;
};

type SubscriptionMetaListProps = {
  items: MetaItem[];
};

export default function SubscriptionMetaList({
  items,
}: SubscriptionMetaListProps) {
  return (
    <div className="w-full flex flex-col px-6">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between py-2">
          <span className="body-lg font-normal text-gray-300">{label}</span>
          <span className="body-lg font-bold text-gray-400">{value}</span>
        </div>
      ))}
    </div>
  );
}
