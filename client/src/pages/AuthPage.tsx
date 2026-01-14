import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import '../styles/AuthPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Signup
        if (!email || !username || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        
        // Signup attempt
        try {
          const signupResponse = await authAPI.signup({ email, username, password });
          console.log('Signup successful:', signupResponse);
        } catch (signupErr: any) {
          console.error('Signup error:', signupErr);
          // Handle Pydantic validation errors
          if (signupErr.response?.data?.detail) {
            const detail = signupErr.response.data.detail;
            if (Array.isArray(detail)) {
              const messages = detail.map((e: any) => {
                if (typeof e === 'object' && e.msg) {
                  return e.msg;
                }
                return String(e);
              }).join('; ');
              setError(messages);
            } else if (typeof detail === 'string') {
              setError(detail);
            } else {
              setError('Signup failed');
            }
          } else {
            setError('Signup failed. Please try again.');
          }
          setLoading(false);
          return;
        }
        
        // After successful signup, login automatically
        try {
          const loginResponse = await authAPI.login(username, password);
          console.log('Auto login successful:', loginResponse);
          localStorage.setItem('token', loginResponse.data.access_token);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          navigate('/admin/dashboard');
        } catch (loginErr: any) {
          console.error('Auto login error:', loginErr);
          setError('Account created but automatic login failed. Please login manually.');
          setLoading(false);
          setIsSignup(false);
          setUsername('');
          setPassword('');
          setEmail('');
        }
      } else {
        // Login
        if (!username || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        try {
          const response = await authAPI.login(username, password);
          console.log('Login successful:', response);
          localStorage.setItem('token', response.data.access_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/admin/dashboard');
        } catch (loginErr: any) {
          console.error('Login error:', loginErr);
          if (loginErr.response?.data?.detail) {
            const detail = loginErr.response.data.detail;
            if (typeof detail === 'string') {
              setError(detail);
            } else {
              setError('Invalid username or password');
            }
          } else {
            setError('Login failed. Please try again.');
          }
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-card">
            <div className="auth-header">
              <h1>Foundry</h1>
              <p>{isSignup ? 'Create Admin Account' : 'Admin Login'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                </div>
              )}

              {isSignup && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@foundry.dev"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your-username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
              {!isSignup && (
                <p className="password-hint">
                  Must contain uppercase, lowercase, and number
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {isSignup ? 'Back to Login' : 'Create New Account'}
            </button>
          </form>

          <div className="auth-footer">
            <button
              className="link-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>

          {!isSignup && (
            <div className="auth-info">
              <p>Demo Credentials (if available):</p>
              <code>Hemanth / Admin@123</code>
            </div>
          )}
        </div>
        </motion.div>
      </div>
    </div>
  );
};
