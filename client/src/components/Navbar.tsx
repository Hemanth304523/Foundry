import { motion } from 'framer-motion';
import '../styles/Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  return (
    <div className="navbar">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              🌱Foundry
            </h2>
          </div>

        <div className="navbar-links">
          <button 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${location.pathname.includes('/components') ? 'active' : ''}`}
            onClick={() => navigate('/components')}
          >
            Components
          </button>
        </div>

        <div className="navbar-actions">
          {token ? (
            <>
              <button 
                className="nav-admin-btn"
                onClick={() => navigate('/admin/dashboard')}
              >
                Admin Dashboard
              </button>
              <button 
                className="nav-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              className="nav-login-btn"
              onClick={() => navigate('/auth/login')}
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
      </motion.nav>
    </div>
  );
};
