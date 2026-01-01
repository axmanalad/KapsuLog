import type { BaseAuthFormData, RegisterFormData, ValidationError } from "../../types/auth";
import type { HoyoLabSettingsFormData } from "../../types/settings";

export const validateRegisterForm = (formData: RegisterFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (formData.password !== formData.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match'
    })
  }

  if (formData.password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters long'
    })
  }

  if (formData.username.length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters long'
    })
  }

  return errors;
};

export const validateLoginForm = (formData: BaseAuthFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.email) {
    errors.push({
      field: 'email',
      message: 'Email is required'
    });
  }

  if (!formData.password) {
    errors.push({
      field: 'password',
      message: 'Password is required'
    });
  }

  return errors;
};

export const validateHoyoLabSettingsForm = (formData: HoyoLabSettingsFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.ltuid_v2 || formData.ltuid_v2.length < 8) {
    errors.push({
      field: 'ltuid_v2',
      message: 'LTUID_V2 must be at least 8 digits long'
    });
  }
  
  if (!formData.ltoken_v2.includes('v2_')) {
    errors.push({
      field: 'ltoken_v2',
      message: 'LTOKEN_V2 must include "v2_"'
    });
  }

  if (!formData.uid || formData.uid.length < 9) {
    errors.push({
      field: 'uid',
      message: 'UID must be at least 9 digits long'
    });
  }

  return errors;
};