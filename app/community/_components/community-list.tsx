"use client";
import CommunityItem from "./community-item";
import type { CommunityListItemData } from "../_types";

type CommunityListProps = {
  items: CommunityListItemData[];
};

export default function CommunityList({ items }: CommunityListProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 pt-6">
      {items.map((item) => (
        <CommunityItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
