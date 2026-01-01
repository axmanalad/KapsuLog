import type { GameSettingsProps } from "../../../types/settings";
import '../../../styles/pages/auth/error.css';

function GameSettingsForm<T>( props: GameSettingsProps<T>) {
  const { game, formData, handleChange, handleSubmit, fields, errors = null } = props;
  
 const getFieldError = (fieldName: string): string | undefined => {
    return errors?.find(error => error.field === fieldName)?.message;
  };

  // Handle form submission
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {fields.map((field) => {
        const fieldError = getFieldError(field.name);
        return (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={String(formData[field.name as keyof T]) || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={fieldError ? 'form-input-error' : ''}
          />
          {fieldError && <span className="form-error-message">{fieldError}</span>}
        </div>
        );
      })}

      <button type="submit" className="login-form-button">Save for {game.title}</button>
    </form>
  );
}

export default GameSettingsForm;