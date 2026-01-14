import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import '../styles/CategoriesPage.css';
import { Sidebar } from '../components/Sidebar';

interface Component {
  id: number;
  title: string;
  use_case: string;
  category: string;
}

export const CategoriesPage = () => {
  const { category } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo: Record<string, { name: string; description: string }> = {
    frontend: {
      name: 'Frontend',
      description: 'React, TypeScript, and UI component patterns for modern web applications',
    },
    backend: {
      name: 'Backend',
      description: 'API design patterns, middleware, and backend architecture with FastAPI and Node.js',
    },
    database: {
      name: 'Database',
      description: 'Database schemas, queries, and ORM patterns for SQLite, PostgreSQL, and MongoDB',
    },
    devops: {
      name: 'DevOps & Cloud',
      description: 'Docker, Kubernetes, CI/CD pipelines, and cloud deployment configurations',
    },
  };

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        if (category) {
          const response = await publicAPI.getComponentsByCategory(category);
          setComponents(response.data);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [category]);

  const info = categoryInfo[category || 'frontend'];

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
      <div className="categories-page">
        <div className="category-hero">
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>{info?.name || 'Components'}</h1>
            <p>{info?.description || 'Browse and discover production-ready components'}</p>
          </motion.section>
        </div>

        <section className="components-section">
          {loading ? (
            <p>Loading components...</p>
          ) : components.length > 0 ? (
            <>
              <p className="component-count">
                Showing {components.length} component{components.length !== 1 ? 's' : ''}
              </p>
              <motion.div 
                variants={containerVariants as any}
                initial="hidden"
                animate="visible"
              >
                <div className="components-grid">
                  {components.map((component) => (
                    <motion.div
                      key={component.id}
                      {...{
                        className: "category-component-card",
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
              No components found in this category yet. Check back soon!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
