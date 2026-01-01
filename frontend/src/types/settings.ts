import type { ValidationError } from "./auth";
import type { GameComponentProps } from "./components";

type GameSettingsFormData = {
  [key: string]: string | number | boolean;
}

export interface HoyoLabSettingsFormData extends GameSettingsFormData {
  ltuid_v2: string;
  ltoken_v2: string;
  uid: string;
}

export type GameSettingsFieldType = 'text' | 'number' | 'checkbox' | 'select';

export interface GameSettingsField {
  name: string;
  label: string;
  placeholder?: string;
  type: GameSettingsFieldType;
  options?: string[]; // For 'select' type
  defaultValue?: string | number | boolean;
}

export interface GameSettingsProps<T = GameSettingsFormData> extends GameComponentProps {
  formData: T;
  fields: GameSettingsField[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors?: ValidationError[];
}