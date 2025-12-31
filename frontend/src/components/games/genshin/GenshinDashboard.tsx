import type React from "react";
import { useEffect, useState } from "react";
import type { GenshinDashboardProps } from "../../../types";
import TabNavigation from "../shared/TabNavigation";
import WishTracker from "../shared/WishTracker";
import { useAuth } from "../../../hooks/useAuthContext";
import { getUserGameId } from "../../../api/authService";

const GenshinDashboard: React.FC<GenshinDashboardProps> = ({ game }) => {
  const [activeTab, setActiveTab] = useState('wishes');
  const [userGameId, setUserGameId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()

  useEffect(() => {
    // Fetch user game ID based on user ID and game
    const fetchUserGameId = async () => {
      if (!user) {
        console.error('No user found in context.');
        return;
      }

      try {
        setLoading(true);
        const id = await getUserGameId(game.name);
        if (id) {
          setUserGameId(id);
        }
      } catch (err) {
        console.error('Error fetching user game ID:', err);
      } finally {
        setLoading(false)
      }
    };

    void fetchUserGameId();
  }, [user, game.name]);

  const tabs = [
    { id: 'wishes', label: 'Wish Tracker', available: true },
    { id: 'achievements', label: 'Achievements', available: false },
    { id: 'characters', label: 'Characters', available: false },
    { id: 'daily', label: 'Daily Commissions', available: false },
    { id: 'events', label: 'Events', available: false }
  ];

  const renderTabContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    switch (activeTab) {
      case 'wishes':
        return userGameId ? <WishTracker gameName={game.name} userGameId={userGameId} /> : <div>No game data found</div>;
      default:
        return (
          <div className="coming-soon">
            <h3>Coming Soon!</h3>
            <p>This feature is currently in development. Stay tuned for updates!</p>
          </div>
        );
    }
  };

  return (
    <div className="genshin-dashboard">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GenshinDashboard;