import type React from "react";
import type { WishItem } from "../../../../../../shared/types";
import type { BannerFilterType, WishTrackerProps, WishView } from "../../../../types";
import { useEffect, useState } from "react";
import "../../../../styles/components/games/shared/WishTracker/index.css";
import PityCard from "./PityCard";
import { pityStats } from "../../../../data/wishStats";
import RecentWishHistory from "./RecentWishHistory";
import FullWishHistory from "./FullWishHistory";
import WishHeader from "./WishHeader";
import { useBannerFilter } from "../../../../hooks/useBannerFilter";
import WishStatistics from "./WishStatistics";
import { getUserPityStats, getUserWishes } from "../../../../api/wishService";
// import { getBannerId, getGameIdByUGID } from "../../../../api/gameService";

const WishTracker: React.FC<WishTrackerProps> = ({ gameName, userGameId }) => {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiPityStats, setPityStats] = useState(pityStats[gameName]);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        setLoading(true);
        const response = await getUserWishes(gameName, userGameId);
        setWishes(response.data);
      } catch (err) {
        console.error("Failed to fetch wishes:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPityStats = async () => {
      try {
        setLoading(true);
        const response = await getUserPityStats(gameName, userGameId);
        setPityStats(response.data);
      } catch (err) {
        console.error("Failed to fetch pity stats:", err);
      } finally {
        setLoading(false);
      }
    }

    void fetchWishes();
    void fetchPityStats();
  }, [userGameId, gameName]);

  const [currentView, setCurrentView] = useState<WishView>('recent');

  const {
    selectedBanner,
    filteredWishes,
    handlePityCardClick,
    clearBannerFilter,
    isFiltered,
    bannerIds,
  } = useBannerFilter(wishes, gameName);

  const handlePityCardClickWrapper = (banner: BannerFilterType) => {
    handlePityCardClick(banner);
  };

  const refreshWishes = async () => {
    try {
      setLoading(true);
      const response = await getUserWishes(gameName, userGameId);
      setWishes(response.data);

      const pityResponse = await getUserPityStats(gameName, userGameId);
      setPityStats(pityResponse.data);
    } catch (err) {
      console.error("Failed to refresh wishes:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderWishHistory = () => {
    if (currentView === 'recent') {
      return (
        <RecentWishHistory
          wishes={isFiltered ? filteredWishes : wishes}
          gameName={gameName}
          onViewAll={() => {setCurrentView('full')}}
          selectedBanner={selectedBanner}
          onClearFilter={clearBannerFilter}
          isFiltered={isFiltered}
        />
      );
    } else {
      return (
        <FullWishHistory
          wishes={isFiltered ? filteredWishes : wishes}
          gameName={gameName}
          onBackToRecent={() => {setCurrentView('recent')}}
          selectedBanner={selectedBanner}
          onClearFilter={clearBannerFilter}
          isFiltered={isFiltered}
        />
      );
    }
  };

  if (loading) {
    return <div>Loading wishes...</div>;
  }
  return (
    <div className="wish-tracker">
      <WishHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        totalWishes={isFiltered ? filteredWishes.length : wishes.length}
        userGameId={userGameId}
        gameName={gameName}
        onRefreshWishes={refreshWishes}
      />
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${apiPityStats.length} gap-6 mb-8`}>
        {apiPityStats.map((stat) => {
          const bannerType = stat.gachaType;
          const isSelected = selectedBanner === bannerType;
          const normalizeBannerType = stat.gachaType.substring(0, 1) + stat.gachaType.substring(1).toLowerCase();
          return (
            <PityCard
              userGameId={userGameId}
              key={`stat.${stat.gachaType.toLowerCase()}-${String(userGameId)}`}
              {...stat}
              gachaType={normalizeBannerType}
              onClick={() => { if (!isSelected) handlePityCardClickWrapper(normalizeBannerType as BannerFilterType); }}
              isSelected={isSelected}
            />
          );
        })}
      </div>
      
      <WishStatistics
        gameName={gameName}
        gameId={userGameId}
        bannerIds={isFiltered ? bannerIds : []}
        wishes={isFiltered ? filteredWishes : wishes}
        selectedBanner={selectedBanner}
        isFiltered={isFiltered}
      />

      {renderWishHistory()}
    </div>
  );
};

export default WishTracker;