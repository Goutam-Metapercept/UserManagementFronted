import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import { authService } from '../service/authService';

const Login = () => {
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationErrors = {};
    if (!username.trim()) validationErrors.username = 'Username is required';
    if (!password.trim()) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.login(username, password);
      console.log('Logged in user:', user);

      // Optionally reload to refresh the Navbar (you can remove this if using React Context)
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 400) {
        setErrors({ server: '🚫 Invalid username or password' });
      } else {
        setErrors({ server: '⚠️ An unexpected error occurred. Please try again later.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>✨ Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        {errors.server && <div className="error-message server-error">{errors.server}</div>}

        <div className="form-group">
          <label htmlFor="username">👤 Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
            }}
            className={errors.username ? 'error' : ''}
            placeholder="Enter your username"
            disabled={isLoading}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">🔒 Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
            className={errors.password ? 'error' : ''}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? '🔄 Signing In...' : '🚀 Sign In'}
        </button>

        <p>
          Don't have an account? <Link to="/signup">Create one here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
