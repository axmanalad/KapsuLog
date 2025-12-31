import { Link } from "react-router-dom";
import type { GameComponentProps } from "../../../types";
import "../../../styles/components/games/shared/game-header.css";
import GameHeaderStatCard from "./GameHeaderStatCard";
import { gameStats } from "../../../data/gameStats";

const GameHeader: React.FC<GameComponentProps> = ({ game }) => {
  const gameId = game.id;
  const currentGameStats = gameStats[gameId];
  
  return (
    <header className="game-header">
      <div 
        className="game-banner-bg" 
        style={{ backgroundImage: `url(${game.bgImageURL})` }}
      ></div>
      <div className="game-header-content">
        <div className="flex justify-between items-start">
          <div className="game-header-info">
            <Link to="/my-games" className="text-purple-200 hover:text-white mb-2 inline-block text-sm">
              ← Back to My Games
            </Link>
            <h1 className="game-title">{game.title}</h1>
            <p className="game-subtitle">
              {game.isAvailable ? `Manage your ${game.title}'s progress` : `${game.title} is not available yet`}
            </p>
            
            {game.isAvailable && (
              <div className="game-stats mt-4">
                {currentGameStats.map((stat) => (
                  <GameHeaderStatCard title={stat.title} value={stat.value} key={`stat.${stat.title}-${String(gameId)}`} />
                ))}
              </div>
            )}
          </div>
          {game.isAvailable && (
            <div className="game-header-actions">
              <button type="button" className="game-header-btn">
                <Link to='settings'>⚙️ Settings</Link>
              </button>
              <button type="button" className="game-header-btn primary">
                🔄 Sync Data
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default GameHeader;