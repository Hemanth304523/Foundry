import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import '../styles/ComponentsPage.css';
import { Sidebar } from '../components/Sidebar';

interface Component {
  id: number;
  title: string;
  use_case: string;
  category: string;
}

export const ComponentsPage = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'frontend', 'backend', 'database', 'devops'];

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await publicAPI.getComponents(0, 100);
        setComponents(response.data);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  const filteredComponents = selectedCategory === 'all' 
    ? components 
    : components.filter(c => c.category.toLowerCase() === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -12,
      boxShadow: '0 20px 40px rgba(255, 82, 82, 0.15)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="components-page">
        <div className="components-hero">
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>All Components</h1>
            <p>Browse and discover production-ready components across all categories</p>
          </motion.section>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <section className="components-section">
          {loading ? (
            <p className="loading-text">Loading components...</p>
          ) : filteredComponents.length > 0 ? (
            <>
              <p className="component-count">
                Showing {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
              </p>
              <motion.div 
                variants={containerVariants as any}
                initial="hidden"
                animate="visible"
                key={selectedCategory}
              >
                <div className="components-grid">
                  {filteredComponents.map((component) => (
                    <motion.div
                      key={component.id}
                      {...{
                        className: "component-card",
                        variants: itemVariants as any,
                        whileHover: "hover",
                        onClick: () => navigate(`/components/${component.id}`),
                        style: { cursor: 'pointer' }
                      }}
                    >
                      <div className="component-category">{component.category}</div>
                      <h3>{component.title}</h3>
                      <p>{component.use_case}</p>
                      <div className="card-footer">
                        <span className="view-link">View Details →</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          ) : (
            <p className="no-components">
              No components found. Check back soon!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
