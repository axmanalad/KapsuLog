import { useLocation, useNavigate } from "react-router-dom";
import { type ValidationError, type GameComponentProps } from "../../../types";
import { type HoyoLabSettingsFormData, type GameSettingsField } from "../../../types/settings";
import { validateHoyoLabSettingsForm } from "../../../utils/auth/validation";
import { useState } from "react";
// import { fetchHoyoLabGameData } from "../../../api/gameService";
import GameSettingsForm from "../shared/GameSettingsForm";


const GenshinSettings: React.FC<GameComponentProps> = ({ game }) => {
  const storedSettings = localStorage.getItem(`${game.name}_settings`);
  const parsedSettings = storedSettings ? (JSON.parse(storedSettings) as Partial<HoyoLabSettingsFormData>) : {};
  const [formData, setFormData] = useState<HoyoLabSettingsFormData>({
    ltuid_v2: parsedSettings.ltuid_v2 ?? '',
    ltoken_v2: parsedSettings.ltoken_v2 ?? '',
    uid: parsedSettings.uid || ''
  })

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const from: string = state?.from || '/my-games';

  const settingsFields: GameSettingsField[] = [
    {
      name: 'ltuid_v2',
      label: 'LTUID_V2',
      type: 'text',
      placeholder: 'Enter your LTUID_V2'
    },
    {
      name: 'ltoken_v2',
      label: 'LTOKEN_V2',
      type: 'text',
      placeholder: 'Enter your LTOKEN_V2'
    },
    {
      name: 'uid',
      label: 'UID',
      type: 'text',
      placeholder: 'Enter your UID'
    }
  ]
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateHoyoLabSettingsForm(formData);
    if (errors.length > 0) {
      setErrors(errors);
    } else {
      try {
        // TODO: WIP Node.js proxy requests Python
        // const response = await fetchHoyoLabGameData(
        //   game.name,
        //   formData.ltuid_v2,
        //   formData.ltoken_v2,
        //   formData.uid
        // );
        if (errors.length === 0) {
          // Handle successful data fetch
          void navigate(from);
          localStorage.setItem(`${game.name}_settings`, JSON.stringify(formData))
        } else {
          setErrors([{ field: 'form', message: 'Failed to fetch game data. Please check your credentials.' }]);
        }
      } catch (err) {
        console.error('Error fetching HoyoLab game data:', err);
        setErrors([{ field: 'form', message: 'An error occurred while fetching game data.' }]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });

    if (errors.length > 0) {
      setErrors(errors.filter(error => error.field !== name));
    }
  };

  return (
    <div className="genshin-settings-page">
      <div className="parent-container">
        <h1 className="text-2xl font-bold mb-4">Settings for {game.title}</h1>
        <GameSettingsForm<HoyoLabSettingsFormData>
          game={game}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={(e) => { void handleSubmit(e); }}
          fields={settingsFields}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default GenshinSettings;