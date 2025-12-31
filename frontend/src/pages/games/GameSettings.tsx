import { Navigate, useParams } from "react-router-dom";
import { useGameContext } from "../../hooks/useGameContext";
import GenshinSettings from "../../components/games/genshin/GenshinSettings";

const GameSettings: React.FC = () => {
  const { gameTitle } = useParams<{ gameTitle: string }>();
  const { myGames } = useGameContext();


  // Check if user has this game.
  const currentGame = myGames.find(game => game.title.toLowerCase().replace(/\s+/g, '-') === gameTitle);

  if (!currentGame) {
    return <Navigate to ="/my-games" replace />;
  }

  const renderGameSettings = () => {
    switch (gameTitle) {
      case 'genshin-impact':
        return <GenshinSettings game={currentGame} />;
      case 'honkai-star-rail':
      case 'wuthering-waves':
      default:
        return (
          <div className="game-settings-page">
            <div className="parent-container">
              <h1 className="text-2xl font-bold mb-4">Settings for {currentGame.title}</h1>
              <p>Game Settings page for {currentGame.title} is under construction. Please check back later!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="game-settings-page">
      {renderGameSettings()}
    </div>
  )
}

export default GameSettings;