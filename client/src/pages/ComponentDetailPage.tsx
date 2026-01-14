import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/api';
import { Copy, Check } from 'lucide-react';
import '../styles/ComponentDetailPage.css';

interface CodeSnippet {
  id: number;
  filename: string;
  language: string;
  code: string;
  created_at: string;
}

interface Component {
  id: number;
  title: string;
  use_case: string;
  category: string;
  snippets: CodeSnippet[];
  created_at: string;
  updated_at: string;
}

export const ComponentDetailPage = () => {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        if (componentId) {
          const response = await publicAPI.getComponentDetail(parseInt(componentId));
          setComponent(response.data);
        }
      } catch (error) {
        console.error('Error fetching component:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComponent();
  }, [componentId]);

  const handleCopyCode = (code: string, snippetId: number) => {
    navigator.clipboard.writeText(code);
    setCopied(snippetId);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return <div className="detail-page"><p>Loading component...</p></div>;
  }

  if (!component) {
    return (
      <div className="detail-page">
        <p>Component not found</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="detail-header">
          <div>
            <span className="detail-category">{component.category}</span>
            <h1>{component.title}</h1>
            <p className="detail-description">{component.use_case}</p>
          </div>
          <button 
            className="secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <section className="snippets-section">
          <h2>Code Snippets</h2>
          {component.snippets.length > 0 ? (
            <div className="snippets-list">
              {component.snippets.map((snippet, index) => (
                <div key={snippet.id} className="snippet-card">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="snippet-header">
                      <div>
                        <h3>{snippet.filename}</h3>
                        <span className="snippet-language">{snippet.language}</span>
                      </div>
                      <button
                        className={`copy-btn ${copied === snippet.id ? 'copied' : ''}`}
                        onClick={() => handleCopyCode(snippet.code, snippet.id)}
                        title="Copy to clipboard"
                    >
                      {copied === snippet.id ? (
                        <>
                          <Check size={18} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={18} /> Copy
                        </>
                      )}
                    </button>
                    </div>
                    <pre className="code-block">
                      <code>{snippet.code}</code>
                    </pre>
                  </motion.div>
                </div>
              ))}
            </div>
          ) : (
            <p>No code snippets available for this component.</p>
          )}
        </section>

        <section className="component-info">
          <div className="info-card">
            <h3>Component Details</h3>
            <p><strong>Category:</strong> {component.category}</p>
            <p><strong>Created:</strong> {new Date(component.created_at).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> {new Date(component.updated_at).toLocaleDateString()}</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};
