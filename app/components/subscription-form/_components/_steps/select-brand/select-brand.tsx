"use client";

import { useMemo, useState } from "react";
import BottomCTA from "@/app/components/bottom-cta";
import Button from "@/app/components/button";
import {
  CATEGORY_FILTER_OPTIONS,
  getBrandsByCategory,
} from "@/app/utils/brand/brand";
import { SubscriptableBrandType } from "@/app/utils/brand/type";
import FilterChips from "../../filter-chips";
import BrandGrid from "./brand-grid";

interface Values {
  service: SubscriptableBrandType;
}

interface Props {
  values?: Partial<Values>;
  onNext: (values: Values) => void;
}
export default function SelectBrand({ values, onNext }: Props) {
  const [filter, setFilter] = useState("all");
  const [selectedBrand, setSelectedBrand] =
    useState<SubscriptableBrandType | null>(values?.service ?? null);

  const filteredBrands = useMemo(() => getBrandsByCategory(filter), [filter]);

  const handleNext = () => {
    if (!selectedBrand) return;
    onNext({ service: selectedBrand });
  };

  return (
    <>
      <div className="flex flex-col gap-5 px-6 relative">
        <h1 className="header-md leading-tight">
          구독하고 있는
          <br />
          서비스를 선택 하세요
        </h1>

        <FilterChips
          options={CATEGORY_FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
        />

        <BrandGrid
          brandKeys={filteredBrands}
          selectedBrand={selectedBrand}
          onSelect={setSelectedBrand}
        />
      </div>

      <BottomCTA>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!selectedBrand}
        >
          다음
        </Button>
      </BottomCTA>
    </>
  );
}
