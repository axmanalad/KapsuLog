import type { BannerFilterType } from "./banner";
import type { WishItem } from "../../../shared/types";

type gameName = string;


export interface WishItemProps {
  wish: WishItem;
  compact?: boolean;
  gameName?: string;
};

export type WishView = 'recent' | 'full';

export interface WishHeaderProps {
  currentView: WishView;
  onViewChange: (view: WishView) => void;
  totalWishes: number;
  userGameId: string;
  gameName: string;
  onRefreshWishes: () => Promise<void>;
};

type WishStatType = 'regular' | 'average' | 'streak' | 'ratio';

export interface WishStatLabels {
  totalWishes: number;
  fiveStarWLRatio: [number, number, number]; // Ratio of 5-star wins to losses
  avgFiveStarPity: number; // Average pity for 5-star items
  avgFourStarPity: number; // Average pity for 4-star items
};

export interface WishStatWithStreaks extends WishStatLabels {
  currentWinStreak: number; // Current win streak for 5-star items
  currentLossStreak: number; // Current loss streak for 5-star items
  longestWinStreak: number; // Longest win streak for 5-star items
  longestLossStreak: number; // Longest loss streak for 5-star items
}

export interface WishStatsProps {
  gameId: string;
  gameName: string;
  bannerIds: string[];
  wishes: WishItem[];
  selectedBanner?: string;
  isFiltered?: boolean;
  isLoading?: boolean;
};

export interface WishStatsData {
  label: string;
  value: string | number;
  subtext?: string;
  type: WishStatType;
}

export type WishStatsRecord = Record<gameName, WishStatsData[]>;

interface WishCostData {
  single: number;
  ten: number;
  currency: string; // e.g. 'primogems', 'fates'
}

export type WishCostRecord = Record<gameName, WishCostData>;

export interface WishFilterTypes {
  rarity: 'all' | '3' | '4' | '5';
  itemType: 'all' | 'character' | 'weapon';
  sortBy: 'newest' | 'oldest' | 'rarity';
};

export interface WishFilterProps {
  filters: WishFilterTypes;
  onFilterChange: (filters: WishFilterTypes) => void;
  resultCount: number;
};

interface WishImportInfo {
  gameName: string;
  scriptName: string;
  steps: string[];
}

export type WishImportRecord = Record<gameName, WishImportInfo>;

export interface RecentWishHistoryProps {
  wishes: WishItem[];
  gameName: string;
  onViewAll: () => void;
  selectedBanner?: BannerFilterType;
  onClearFilter?: () => void;
  isFiltered?: boolean;
};

export interface FullWishHistoryProps {
  wishes: WishItem[];
  gameName: string;
  onBackToRecent: () => void;
  selectedBanner?: BannerFilterType;
  onClearFilter?: () => void;
  isFiltered?: boolean;
};

export interface EmptyWishStateProps {
  message?: string;
  showIcon?: boolean;
};

interface PityCounter {
  gachaType: string;
  current: number;
  max: number;
  guaranteed: boolean;
};

export interface PityCardProps extends PityCounter {
  userGameId?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isLoading?: boolean;
};

export type PityStatsRecord = Record<gameName, PityCounter[]>;

export interface WishImportInstructionsProps {
  userGameId: string;
  gameName: string;
  onClose: (isRefreshable: boolean) => void;
  isOpen: boolean;
};

export interface StepCardProps {
  step: string;
  instruction?: string;
  instructionList?: string[];
}

export interface WishImportResults {
  imported: number;
  skipped: number;
  failed: number;
  banners: Record<string, number>;
};

export type WishBannerProps = Record<string, BannerFilterType>;

/* Wishes will associate with the following format to identify their origin:
gameName: { gachaType: string, bannerName: string }
*/
export type WishBannerRecord = Record<string, WishBannerProps>;