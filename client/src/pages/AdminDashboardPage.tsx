import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import '../styles/AdminDashboardPage.css';

interface Component {
  id: number;
  title: string;
  use_case: string;
  category: string;
}

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login');
      return;
    }

    fetchComponents();
  }, [navigate]);

  const fetchComponents = async () => {
    try {
      const response = await adminAPI.listComponents(0, 100);
      setComponents(response.data);
    } catch (error) {
      console.error('Error fetching components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await adminAPI.deleteComponent(id);
        setComponents(components.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting component:', error);
        alert('Failed to delete component');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const filteredComponents = filter === 'all' 
    ? components 
    : components.filter(c => c.category === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Manage Foundry Components</p>
        </div>
        <div className="admin-actions">
          <button 
            className="primary"
            onClick={() => navigate('/admin/components/create')}
          >
            <Plus size={20} /> Create Component
          </button>
          <button 
            className="secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Components ({components.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'frontend' ? 'active' : ''}`}
              onClick={() => setFilter('Frontend')}
            >
              Frontend ({components.filter(c => c.category === 'Frontend').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'backend' ? 'active' : ''}`}
              onClick={() => setFilter('Backend')}
            >
              Backend ({components.filter(c => c.category === 'Backend').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'database' ? 'active' : ''}`}
              onClick={() => setFilter('Database')}
            >
              Database ({components.filter(c => c.category === 'Database').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'devops' ? 'active' : ''}`}
              onClick={() => setFilter('DevOps & Cloud')}
            >
              DevOps ({components.filter(c => c.category === 'DevOps & Cloud').length})
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading components...</p>
        ) : filteredComponents.length > 0 ? (
          <div className="components-table">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="table-header">
                <div className="col-title">Title</div>
                <div className="col-category">Category</div>
                <div className="col-use-case">Use Case</div>
                <div className="col-actions">Actions</div>
              </div>

              {filteredComponents.map((component) => (
                <div key={component.id} className="table-row">
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f9f9f9' }}
                  >
                    <div className="col-title">{component.title}</div>
                    <div className="col-category">
                      <span className="category-badge">{component.category}</span>
                    </div>
                    <div className="col-use-case">{component.use_case.substring(0, 50)}...</div>
                    <div className="col-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => navigate(`/admin/components/${component.id}/edit`)}
                        title="Edit component"
                      >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(component.id)}
                      title="Delete component"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No components found</h3>
            <p>Create your first component to get started</p>
            <button 
              className="primary"
              onClick={() => navigate('/admin/components/create')}
            >
              <Plus size={20} /> Create Component
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
