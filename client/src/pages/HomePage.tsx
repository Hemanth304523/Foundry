import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicAPI } from '../services/api';
import '../styles/HomePage.css';
import { Code2, Package, Shield, Zap } from 'lucide-react';

interface Component {
  id: number;
  title: string;
  category: string;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await publicAPI.getComponents(0, 30);
        setComponents(response.data);
      } catch (error) {
        console.error('Error fetching components:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  const features = [
    {
      icon: <Code2 size={32} />,
      title: 'Copy-Paste Ready',
      description: 'Production-ready code snippets you can use immediately',
    },
    {
      icon: <Package size={32} />,
      title: 'Component Registry',
      description: 'Organized by Frontend, Backend, Database, and DevOps',
    },
    {
      icon: <Shield size={32} />,
      title: 'Enterprise Grade',
      description: 'Built with security and scalability in mind',
    },
    {
      icon: <Zap size={32} />,
      title: 'Always Updated',
      description: 'Admin-curated components keep your stack current',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      y: -15,
      boxShadow: '0 20px 40px rgba(255, 82, 82, 0.15)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
        <div className="hero-content">
          <motion.div 
            {...{
              className: "hero-badge",
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, delay: 0.2 },
            }}
          >
            <span className="badge-icon">✨</span>
            <span>Introducing Foundry</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="hero-highlight">Enterprise Development</span>
            <br />
            <span className="hero-highlight-accent">Starter Platform</span>
          </motion.h1>
          <motion.p 
            {...{
              className: "hero-description",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.4 },
            }}
          >
           A Unified, production-grade component registry spanning Frontend, Backend, Database, and DevOps.
            Every component is copy-paste ready, standards-compliant, and designed for direct integration into enterprise-scale systems.          </motion.p>
          <motion.div 
            {...{
              className: "hero-actions",
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.5 },
            }}
          >
            <button 
              className="primary"
              onClick={() => navigate('/category/frontend')}
            >
              Browse Components
              <span className="arrow">→</span>
            </button>
            <button 
              className="outline"
              onClick={() => navigate('/components')}
            >
              View All Components
            </button>
          </motion.div>
        </div>
        </motion.section>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Why Foundry?</h2>
          <motion.div 
            variants={containerVariants as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true } as any}
          >
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  {...{
                    className: "feature-card",
                    variants: featureCardVariants as any,
                    whileHover: "hover",
                    initial: "hidden",
                    whileInView: "visible",
                    viewport: { once: true } as any,
                  }}
                >
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-accent"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Latest Components Section */}
      <section className="latest-components-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <h2 className="section-title">Latest Components</h2>
            <button 
              className="secondary"
              onClick={() => navigate('/components')}
            >
              View All Components →
            </button>
          </div>
          
          {loading ? (
            <p>Loading components...</p>
          ) : components.length > 0 ? (
            <motion.div 
              variants={containerVariants as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true } as any}
            >
              <div className="components-grid">
                {components.slice(0, 8).map((component) => (
                  <motion.div
                    key={component.id}
                    {...{
                      className: "component-card",
                      variants: featureCardVariants as any,
                      whileHover: "hover",
                      initial: "hidden",
                      whileInView: "visible",
                      viewport: { once: true } as any,
                      onClick: () => navigate(`/components/${component.id}`),
                      style: { cursor: 'pointer' }
                    }}
                  >
                    <div className="component-category">{component.category}</div>
                    <h3>{component.title}</h3>
                    <p>Click to view code snippets and details →</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <p>No components available yet.</p>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <div className="cta-section">
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Standardize Your Development?</h2>
          <p>Join the Foundry community and accelerate your development with production-ready components.</p>
          <button 
            className="primary"
            onClick={() => navigate('/category/frontend')}
          >
            Explore Components Now
          </button>
        </motion.section>
      </div>
    </div>
  );
};
