import { wishBannerTypes } from "../data/wishStats";
import type { BannerFilterType } from "../types/banner";

/**
 * Displays the name of the banner based on the gacha type for a single wish item 
 */
export const getBannerDisplayName = (gachaType: string, gameName?: string): string => {
  if (!gameName) {
    return gachaType;
  }
  const gameBanners = wishBannerTypes[gameName];
  const bannerName = gameBanners[gachaType];
  return bannerName || gachaType;
};

/**
 * Filters all wishes based on the selected banner
 * @param wishes The wishes that should be filtered
 * @param bannerFilter The selected banner to filter
 * @param gachaType The gacha ID of the banner
 * @returns A list of filtered wishes
 */
export const getFilteredWishesByBanner = <T extends { gachaType: string; bannerId: string }> (
  wishes: T[],
  bannerFilter: BannerFilterType,
  gachaType: string,
): T[] => {
  return bannerFilter === 'All'
    ? wishes
    : wishes.filter(wish => wish.gachaType === gachaType);
};