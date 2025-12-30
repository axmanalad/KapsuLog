import type { WishStatLabels } from "../../../frontend/src/types";
import type { WishItem } from "../../../shared/types";

/**
 * Calculates all wish statistics based on the provided wishes.
 * @param wishes The list of all wishes
 * @param fiveStarWishes The list of 5-star wishes
 * @param fourStarWishes The list of 4-star wishes
 * @returns The calculated wish statistics
 */
export function calculateWishStats<T extends WishItem>(
  wishes: T[], 
  fiveStarWishes: T[],
  fourStarWishes: T[]
): WishStatLabels {
  const totalWishes = wishes.length;

  return {
    totalWishes,
    fiveStarWLRatio: getWLRatio(fiveStarWishes),
    avgFiveStarPity: avgPity(fiveStarWishes, '5'),
    avgFourStarPity: avgPity(fourStarWishes, '4'),
    currentWinStreak: getCurrentStreak(fiveStarWishes, true),
    currentLossStreak: getCurrentStreak(fiveStarWishes, false),
    longestWinStreak: getLongestStreak(fiveStarWishes, true),
    longestLossStreak: getLongestStreak(fiveStarWishes, false)
  };
}

/**
 * Combines stats from multiple banners, similar to backend logic.
 */
export function calculateCombinedStats(statsArr: WishStatLabels[]): WishStatLabels {
  let totalWishes = 0;
  let fiveStarWLRatio: [number, number, number] = [0, 0, 0];
  let avgFiveStarPity = 0;
  let avgFourStarPity = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let totalFiveStarPity = 0;
  let totalFourStarPity = 0;
  let totalFiveStarCount = 0;

  for (const stat of statsArr) {
    totalWishes += stat.totalWishes;
    fiveStarWLRatio = fiveStarWLRatio.map((v, i) => v + stat.fiveStarWLRatio[i]) as [number, number, number];
    longestWinStreak = Math.max(longestWinStreak, stat.longestWinStreak);
    longestLossStreak = Math.max(longestLossStreak, stat.longestLossStreak);
    currentWinStreak += stat.currentWinStreak;
    currentLossStreak += stat.currentLossStreak;
    totalFiveStarPity += stat.avgFiveStarPity;
    totalFourStarPity += stat.avgFourStarPity;
    totalFiveStarCount += stat.fiveStarWLRatio[0] + stat.fiveStarWLRatio[1];
  }

  // Calculate averages
  fiveStarWLRatio[2] = totalFiveStarCount > 0 ? parseFloat(((fiveStarWLRatio[0] / totalFiveStarCount) * 100).toFixed(2)) : 0;
  avgFiveStarPity = statsArr.length > 0 ? parseFloat((totalFiveStarPity / statsArr.length).toFixed(2)) : 0;
  avgFourStarPity = statsArr.length > 0 ? parseFloat((totalFourStarPity / statsArr.length).toFixed(2)) : 0;

  return {
    totalWishes,
    fiveStarWLRatio,
    avgFiveStarPity,
    avgFourStarPity,
    currentWinStreak,
    currentLossStreak,
    longestWinStreak,
    longestLossStreak,
  };
}

/**
 * Calculates the average pity count from a list of wishes.
 * @param wishes The list of wishes to calculate the average pity from
 * @returns The average pity count
 */
function avgPity<T extends WishItem>(wishes: T[], type: '5' | '4'): number {
  if (wishes.length === 0) {
    return 0;
  }
  if (type === '5') {
    return parseFloat((wishes.reduce((sum, wish) => sum + wish.pityCount, 0) / wishes.length).toFixed(2));
  }
  
  // Calculate average pity for 4 star wish based on pity difference between two 4 stars
  let totalPity = 0;
  let count = 0;

  for (let i = 0; i < wishes.length - 1; i++) {
    const currentWish = wishes[i];
    const nextWish = wishes[i + 1];

    if (currentWish.rarity === '4' && nextWish.rarity === '4') {
      totalPity += currentWish.wishNumber - nextWish.wishNumber;
      count++;
    }
  }

  return count > 0 ? parseFloat((totalPity / count).toFixed(2)) : 0;
}

/**
 * Calculates the average pity for 5-star wishes.
 * @param wishes The list of 5-star wishes
 * @returns The average pity for 5-star wishes (wins, losses, and win rate)
 */
function getWLRatio<T extends WishItem>(wishes: T[]): [wins: number, losses: number, winRate: number] {
  if (wishes.length === 0) {
    return [0, 0, 0];
  }
  const wins = wishes.filter(wish => wish.isWin || wish.isGuaranteed).length;
  const losses = wishes.filter(wish => wish.isWin !== null && wish.isWin === false && wish.isGuaranteed !== null && wish.isGuaranteed === false).length;
  const winRate = parseFloat(((wins / wishes.length) * 100).toFixed(2));
  return [wins, losses, winRate];
}

/**
 * Calculates the current streak of 5-star wishes based on the type.
 * @param fiveStarWishes The list of 5-star wishes
 * @param type The type of streak to calculate (Win: True or Loss: False)
 * @returns The current streak count
 */
function getCurrentStreak<T extends WishItem>(fiveStarWishes: T[], type: boolean): number {
  if (fiveStarWishes.length === 0) {
    return 0;
  }
  const sortedWishes = sortFiveStarWishes(fiveStarWishes, false);

  let count = 0;

  for (const wish of sortedWishes) {
    const wishIsType = wish.isWin === type;
    if (wishIsType) {
      count++;
    } else if (wish.isGuaranteed === true) {
      continue; // Skip guaranteed wishes
    } else {
      break; // Stop counting when wish is a different type
    }
  }

  return count;
}

/**
 * Calculates the longest streak of 5-star wishes based on the type.
 * @param fiveStarWishes The list of 5-star wishes
 * @param type The type of streak to calculate (Win: True or Loss: False)
 * @returns The longest streak count for the specified type
 */
function getLongestStreak<T extends WishItem>(fiveStarWishes: T[], type: boolean): number {
  let longestTypeStreak = 0;
  let currentTypeStreak = 0;

  if (fiveStarWishes.length === 0) {
    return longestTypeStreak;
  }

  // Start counting from the first wish
  const sortedWishes = sortFiveStarWishes(fiveStarWishes, true);

  for (const wish of sortedWishes) {
    const isType = wish.isWin === type;
    if (isType && wish.isGuaranteed === false) {
      currentTypeStreak++;
    } else if (wish.isGuaranteed === true) {
      continue; // Skip guaranteed wishes
    } else {
      if (currentTypeStreak >= longestTypeStreak) {
        longestTypeStreak = currentTypeStreak;
      }
      currentTypeStreak = 0; // Reset streak count
    }
  }

  // Check if current calculated streak is the longest
  currentTypeStreak = getCurrentStreak(fiveStarWishes, type);
  if (currentTypeStreak >= longestTypeStreak) {
    longestTypeStreak = currentTypeStreak;
  }
  return longestTypeStreak;
}

/**
 * Sorts 5-star wishes by time and wish number.
 * @param fiveStarWishes The list of 5-star wishes to sort
 * @param isAscending Whether to sort in ascending order (true) or descending order (false)
 * @returns The sorted list of 5-star wishes
 */
function sortFiveStarWishes<T extends WishItem>(fiveStarWishes: T[], isAscending: boolean): T[] {
  return fiveStarWishes.sort((a, b) => {
    const aDate = new Date(a.time).getTime();
    const bDate = new Date(b.time).getTime();
    if (!isAscending) {
      if (aDate !== bDate) {
        return bDate - aDate;
      }
      return b.wishNumber - a.wishNumber;
    }
    if (aDate !== bDate) {
      return aDate - bDate;
    }
    return a.wishNumber - b.wishNumber;
  });
}