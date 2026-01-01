export interface StatCardProps {
  title: string;
  value: string | number;
}

type gameId = number;

export type GameStatsRecord = Record<gameId, StatCardProps[]>;

export type GameAPIStats = {
  success: string;
  data: GenshinStats;
}; 

export interface GenshinStats {
  stats: {
    achievements: number;
    days_active: number;
    characters_owned: number;
    spiral_abyss: number;
    anemoculus_collected: number;
    geoculus_collected: number;
    electroculus_collected: number;
    dendroculus_collected: number;
    hydroculus_collected: number;
    pyroculus_collected: number;
    lunoculus_collected: number;
    common_chests: number;
    exquisite_chests: number;
    precious_chests: number;
    luxurious_chests: number;
    remarkable_chests: number;
    unlocked_waypoints: number;
    unlocked_domains: number;
    max_friendships: number;
    theater: {
      unlocked: boolean;
      max_act: number;
      has_data: boolean;
      has_detail_data: boolean;
    }
    stygian_onslaught: {
      difficulty: number;
      name: string;
      has_data: boolean;
      unlocked: boolean;
    }
  };
  real_time_notes: {
    current_resin: number;
    max_resin: number;
    resin_recovery_time: string;
    completed_commissions: number;
    max_commissions: number;
    remaining_resin_discounts: number;
    max_resin_discounts: number;
    expeditions: Array<{
      character: string;
      status: string;
    }>;
  };
};