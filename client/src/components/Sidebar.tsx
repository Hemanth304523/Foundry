import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar = ({ isOpen = true }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: 'Frontend', path: 'frontend' },
    { name: 'Backend', path: 'backend' },
    { name: 'Database', path: 'database' },
    { name: 'DevOps & Cloud', path: 'devops' },
  ];

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar">
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-section">
          <h3 className="sidebar-title">Categories</h3>
        {categories.map((category) => (
          <button
            key={category.path}
            onClick={() => navigate(`/category/${category.path}`)}
            className={`sidebar-item ${isActive(category.path) ? 'active' : ''}`}
          >
            <motion.span whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              {category.name}
            </motion.span>
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Resources</h3>
        <a href="/docs" className="sidebar-item" target="_blank" rel="noopener noreferrer">
          API Docs
        </a>
        <a href="https://github.com" className="sidebar-item" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
      </motion.aside>
    </div>
  );
};
