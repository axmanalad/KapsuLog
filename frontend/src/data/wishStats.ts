import type { BannerFilterType, PityStatsRecord, WishBannerRecord, WishCostRecord, WishImportRecord, WishStatsRecord } from "../types";

export const pityStats: PityStatsRecord = {
  // The stats (current, max, and guaranteed) are placeholders
  'genshin-impact': [
    {
      gachaType: 'CHARACTER',
      current: 0,
      max: 90,
      guaranteed: false
    },
    {
      gachaType: 'WEAPON',
      current: 0,
      max: 80,
      guaranteed: false
    },
    {
      gachaType: 'CHRONICLED',
      current: 0,
      max: 90,
      guaranteed: false
    },
    {
      gachaType: 'STANDARD',
      current: 0,
      max: 90,
      guaranteed: false
    }
  ],
  'honkai-star-rail': [
    {
      gachaType: 'CHARACTER',
      current: 0,
      max: 90,
      guaranteed: false
    },
    {
      gachaType: 'WEAPON',
      current: 0,
      max: 80,
      guaranteed: false
    },
    {
      gachaType: 'STANDARD',
      current: 0,
      max: 90,
      guaranteed: false
    }
  ],
  'wuthering-waves': [
    {
      gachaType: 'CHARACTER',
      current: 0,
      max: 90,
      guaranteed: false
    },
    {
      gachaType: 'WEAPON',
      current: 0,
      max: 80,
      guaranteed: false
    },
    {
      gachaType: 'STANDARD',
      current: 0,
      max: 90,
      guaranteed: false
    }
  ]
};

export const wishStats: WishStatsRecord = {
  // Game ID 101
  'genshin-impact': [
    {
      label: 'Total Wishes',
      value: 0, // Placeholder for total wishes
      type: 'regular'
    },
    {
      label: 'Avg 5★ Pity',
      value: 0, // Placeholder for average 5-star pity
      type: 'average'
    },
    {
      label: 'Avg 4★ Pity',
      value: 0, // Placeholder for average 4-star pity
      type: 'average'
    },
    {
      label: '5★ Win Rate',
      value: '0%', // Placeholder for 5-star win rate
      subtext: 'Wins/Losses',
      type: 'ratio'
    },
    {
      label: 'Current 5★ Win Streak',
      value: 0, // Placeholder for current 5-star streak
      type: 'streak'
    },
    {
      label: 'Current 5★ Loss Streak',
      value: 0, // Placeholder for current 5-star loss streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Win Streak',
      value: 0, // Placeholder for longest 5-star win streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Loss Streak',
      value: 0, // Placeholder for longest 5-star loss streak
      type: 'streak'
    }
  ],
  // Game ID 102
  'honkai-star-rail': [
    {
      label: 'Total Warps',
      value: 0, // Placeholder for total warps
      type: 'regular'
    },
    {
      label: 'Avg 5★ Pity',
      value: 0, // Placeholder for average 5-star pity
      type: 'average'
    },
    {
      label: 'Avg 4★ Pity',
      value: 0, // Placeholder for average 4-star pity
      type: 'average'
    },
    {
      label: '5★ Win Rate',
      value: '0%', // Placeholder for 5-star win rate
      subtext: 'Wins/Losses',
      type: 'ratio'
    },
    {
      label: 'Current 5★ Win Streak',
      value: 0, // Placeholder for current 5-star streak
      type: 'streak'
    },
    {
      label: 'Current 5★ Loss Streak',
      value: 0, // Placeholder for current 5-star loss streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Win Streak',
      value: 0, // Placeholder for longest 5-star win streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Loss Streak',
      value: 0, // Placeholder for longest 5-star loss streak
      type: 'streak'
    }
  ],
  // Game ID 103
  'wuthering-waves': [
    {
      label: 'Total Wishes',
      value: 0, // Placeholder for total wishes
      type: 'regular'
    },
    {
      label: 'Avg 5★ Pity',
      value: 0, // Placeholder for average 5-star pity
      type: 'average'
    },
    {
      label: 'Avg 4★ Pity',
      value: 0, // Placeholder for average 4-star pity
      type: 'average'
    },
    {
      label: '5★ Win Rate',
      value: '0%', // Placeholder for 5-star win rate
      subtext: 'Wins/Losses',
      type: 'ratio'
    },
    {
      label: 'Current 5★ Win Streak',
      value: 0, // Placeholder for current 5-star streak
      type: 'streak'
    },
    {
      label: 'Current 5★ Loss Streak',
      value: 0, // Placeholder for current 5-star loss streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Win Streak',
      value: 0, // Placeholder for longest 5-star win streak
      type: 'streak'
    },
    {
      label: 'Longest 5★ Loss Streak',
      value: 0, // Placeholder for longest 5-star loss streak
      type: 'streak'
    }
  ]
};

export const wishCostData: WishCostRecord = {
  'genshin-impact': {
    single: 160,
    ten: 1600,
    currency: 'Primogems'
  },
  'honkai-star-rail': {
    single: 160,
    ten: 1600,
    currency: 'Stellar Jades'
  },
  'wuthering-waves': {
    single: 160,
    ten: 1600,
    currency: 'Astrites'
  }
};

export const wishImportData: WishImportRecord = {
  'genshin-impact': {
    gameName: 'Genshin Impact',
    scriptName: 'genshin-wish-import',
    steps: [
      '- Open Genshin Impact and log in to your account',
      '- Navigate to the Wish History page in-game',
      '- Open the Wish History for any banner (Character, Weapon, or Standard)',
      '- Keep this page open in the background'
    ]
  },
  'honkai-star-rail': {
    gameName: 'Honkai: Star Rail',
    scriptName: 'hsr-warp-export',
    steps: [
      '- Open Honkai: Star Rail and log in to your account',
      '- Navigate to the Warp History page in-game',
      '- Open the Warp History for any banner',
      '- Keep this page open in the background'
    ]
  }
}

export const wishBannerTypes: WishBannerRecord = {
  'genshin-impact': {
    '301': 'Character',
    '400': 'Character',
    '302': 'Weapon',
    '500': 'Chronicled',
    '200': 'Standard'
  },
  // Needs verification
  'honkai-star-rail': {
    '301': 'Character',
    '302': 'Weapon',
    '200': 'Standard'
  },
  // Needs verification
  'wuthering-waves': {
    '301': 'Character',
    '302': 'Weapon',
    '200': 'Standard'
  }
};

export const bannerNameToIdsMap: Record<string, Record<BannerFilterType, string[]>> = {
  'genshin-impact': {
    Character: ['301', '400'],
    Weapon: ['302'],
    Chronicled: ['500'],
    Standard: ['200'],
    All: []
  },
  // ...other games
};