import type React from "react";
import type { WishStatsData, WishStatsProps } from "../../../../types";
import { useState, useEffect } from "react";
import { wishCostData, wishStats } from "../../../../data/wishStats";
import WishStatCard from "./WishStatCard";
import "../../../../styles/components/games/shared/WishTracker/wish-statistics.css";
import { calculateCombinedStats, calculateWishStats } from "../../../../utils/wishStatCalculation";
import type { WishItem } from "../../../../../../shared/types";

const WishStatistics: React.FC<WishStatsProps> = ({
  gameId,
  gameName,
  bannerIds,
  wishes,
  selectedBanner,
  isFiltered = false,
  isLoading: externalLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<WishStatsData[]>();

  useEffect(() => {
    // If external loading is true, wait for it to complete
    if (externalLoading) {
      setIsLoading(true);
      return;
    }

    if (wishes.length === 0) {
      setStatistics([]);
      setIsLoading(false);
      return;
    }

    // If isFiltered is true but bannerId is empty, we're still loading the banner ID
    if (isFiltered && !bannerIds) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    
    let filtered = wishes;
    let calculatedStats;
    if (isFiltered && selectedBanner != 'All') {
      filtered = wishes.filter(wish => bannerIds.includes(wish.gachaType));
      const fiveStarWishes = filtered.filter(wish => wish.rarity === '5');
      const fourStarWishes = filtered.filter(wish => wish.rarity === '4');
      calculatedStats = calculateWishStats(filtered, fiveStarWishes, fourStarWishes)
    } else {
      const wishesByBanner = wishes.reduce((acc, wish) => {
        if (!acc[wish.bannerId]) acc[wish.bannerId] = [];
        acc[wish.bannerId].push(wish);
        return acc;
      }, {} as Record<string, WishItem[]>);

      const statsArr = Object.values(wishesByBanner).map(bannerWishes => {
        const fiveStarWishes = bannerWishes.filter(wish => wish.rarity === '5');
        const fourStarWishes = bannerWishes.filter(wish => wish.rarity === '4');
        return calculateWishStats(bannerWishes, fiveStarWishes, fourStarWishes);
      });

      calculatedStats = calculateCombinedStats(statsArr);
    }

    const currentStatsData = wishStats[gameName].map(stat => ({ ...stat }));
    const wishCost = wishCostData[gameName];

    for (const stat of currentStatsData) {
      if (stat.type === 'regular') {
        if (stat.label === 'Total Wishes') {
          stat.value = calculatedStats.totalWishes;
          stat.subtext = `${(wishCost.single * calculatedStats.totalWishes).toString()} ${wishCost.currency}`;
        }
      } else if (stat.type === 'average') {
        if (stat.label === 'Avg 5★ Pity') {
          stat.value = calculatedStats.avgFiveStarPity;
        } else if (stat.label === 'Avg 4★ Pity') {
          stat.value = calculatedStats.avgFourStarPity;
        }
      } else if (stat.type === 'ratio') {
        const [wins, losses, winRate] = calculatedStats.fiveStarWLRatio;
        if (stat.label === '5★ Win Rate') {
          stat.value = `${winRate.toString()}%`;
          stat.subtext = `${wins.toString()} Wins / ${losses.toString()} Losses`;
        }
      } else {
        if (stat.label === 'Current 5★ Win Streak') {
          stat.value = calculatedStats.currentWinStreak;
        } else if (stat.label === 'Current 5★ Loss Streak') {
          stat.value = calculatedStats.currentLossStreak;
        } else if (stat.label === 'Longest 5★ Win Streak') {
          stat.value = calculatedStats.longestWinStreak;
        } else if (stat.label === 'Longest 5★ Loss Streak') {
          stat.value = calculatedStats.longestLossStreak;
        }
      }
    }
    setStatistics(currentStatsData);
    setIsLoading(false);
  }, [gameId, gameName, bannerIds, wishes, selectedBanner, isFiltered, externalLoading]);

  if (!isLoading) {
    if (!statistics) {
      return (
        <div className="wish-statistics">
          <div className="wish-statistics-header">
            <h2>Wish Statistics</h2>
            <p className="text-base text-gray-500 dark:text-gray-400">
              No wish data available. Please add wishes to see statistics.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="wish-statistics">
        <div className="wish-statistics-header">
          <h2>
            {isFiltered && selectedBanner ?
              `${selectedBanner.charAt(0) + selectedBanner.slice(1).toLowerCase()} Banner Statistics` :
              'Wish Statistics'
            }
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {isFiltered ? 'Statistics for the selected banner.' : 'Overall wish statistics.'}
          </p>
        </div>

        <div className="wish-statistics-grid">
          {statistics.map((stat, index) => (
            <WishStatCard
              key={`${stat.label}-${index.toString()}`}
              label={stat.label}
              value={stat.value}
              subtext={stat.subtext}
              type={stat.type}
            />
          ))}
        </div>
      </div>
    );
  }
};

export default WishStatistics;