import { useMemo, useState } from "react";
import type { WishItem } from "../../../shared/types";
import type { BannerFilterType } from "../types";
// import { getFilteredWishesByBanner } from "../utils/bannerUtils";
import { bannerNameToIdsMap } from "../data/wishStats";

export const useBannerFilter = (wishes: WishItem[], gameName: string) => {
  const [selectedBanner, setSelectedBanner] = useState<BannerFilterType>('All');

  const bannerIds = useMemo(() => {
    if (selectedBanner === 'All') return [];
    return bannerNameToIdsMap[gameName]?.[selectedBanner] ?? []
  }, [selectedBanner, gameName]);

  const filteredWishes = useMemo(() => {
    if (selectedBanner === 'All') {
      return wishes;
    }
    if (bannerIds.length > 0) {
      return wishes.filter(wish => bannerIds.includes(wish.gachaType));
    }
    // // Only filter if we have a bannerId
    // if (bannerId) {
    //   return getFilteredWishesByBanner(wishes, selectedBanner, bannerId);
    // }
    return wishes;
  }, [wishes, selectedBanner, bannerIds]);

  // Sets the selected banner dependent on pending
  const handlePityCardClick = (banner: BannerFilterType) => {
    setSelectedBanner(banner);
  };

  const clearBannerFilter = () => {
    setSelectedBanner('All');
  };

  const isFiltered = selectedBanner !== 'All';

  return {
    selectedBanner,
    filteredWishes,
    handlePityCardClick,
    clearBannerFilter,
    isFiltered,
    bannerIds
  };
};