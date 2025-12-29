import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import '../../styles/pages/auth/login.css';
import { type ValidationError, type AuthFormField, type BaseAuthFormData } from '../../types/auth';
import { validateLoginForm } from '../../utils/auth/validation';
import { useAuth } from '../../hooks/useAuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<BaseAuthFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const from: string = state?.from || '/my-games';

  const loginFields: AuthFormField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await login(formData.email, formData.password);
        if (response.success) {
          void navigate(from);
        } else {
          if (response.message?.includes('Email')) {
            setErrors([{ field: 'email', message: `${response.message} Please register first.` }]);
          } else {
            setErrors([{ field: 'password', message: `${response.message} Please try again.`}])
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        setErrors([{ field: 'password', message: 'An error occurred during login.' }]);
      }
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors.length > 0) {
      // Clear errors when user starts typing
      setErrors(errors.filter(error => error.field !== e.target.name));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-header">Login to KapsuLog</h2>
        <AuthForm<BaseAuthFormData>
          formData={formData}
          handleChange={handleChange}
          handleSubmit={(e) => { void handleSubmit(e); }}
          submitButtonText="Login"
          fields={loginFields}
          errors={errors}
        />

        <div className="auth-footer">
          <p className="auth-text">Don't have an account?
            <Link to="/register" className="auth-link">Register</Link>
          </p>
          <Link to="/" className="auth-link">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;