import type { GameComponentProps } from "../../../types";


const GenshinSettings: React.FC<GameComponentProps> = ({ game }) => {
  return (
    <div className="genshin-settings-page">
      <div className="parent-container">
        <h1 className="text-2xl font-bold mb-4">Settings for {game.title}</h1>
        <p>Game Settings page for {game.title} is under construction. Please check back later!</p>
      </div>
    </div>
  );
}

export default GenshinSettings;