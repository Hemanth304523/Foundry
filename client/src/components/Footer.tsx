import { motion } from 'framer-motion';
import '../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="footer-container">
          <div className="footer-section">
            <h4>Foundry</h4>
          <p>Enterprise Development & Deployment Starter Platform</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/category/frontend">Frontend</a></li>
            <li><a href="/category/backend">Backend</a></li>
            <li><a href="/category/database">Database</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="/docs" target="_blank" rel="noopener noreferrer">API Documentation</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="/docs/contributing" target="_blank" rel="noopener noreferrer">Contributing</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="mailto:contact@foundry.dev">Email</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Foundry. All rights reserved.</p>
        <p>Crafted with ❤️ for developers, Production-ready components.</p>
      </div>
      </motion.footer>
    </div>
  );
};
