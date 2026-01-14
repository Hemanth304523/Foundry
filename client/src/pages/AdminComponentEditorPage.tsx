import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../services/api';
import { Plus, Trash2, Save } from 'lucide-react';
import '../styles/AdminComponentEditorPage.css';

interface CodeSnippet {
  id: number;
  filename: string;
  language: string;
  code: string;
}

export const AdminComponentEditorPage = () => {
  const { componentId } = useParams<{ componentId: string }>();
  const navigate = useNavigate();
  const isNew = !componentId || componentId === 'create';

  const [title, setTitle] = useState('');
  const [useCase, setUseCase] = useState('');
  const [category, setCategory] = useState('frontend');
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [newSnippet, setNewSnippet] = useState({
    filename: '',
    language: '',
    code: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'devops', label: 'DevOps & Cloud' },
  ];

  useEffect(() => {
    if (!isNew) {
      fetchComponent();
    }
  }, [componentId]);

  const fetchComponent = async () => {
    try {
      if (componentId) {
        const response = await adminAPI.getComponent(parseInt(componentId));
        const data = response.data;
        setTitle(data.title);
        setUseCase(data.use_case);
        setCategory(data.category.toLowerCase());
        setSnippets(data.snippets);
      }
    } catch (error) {
      console.error('Error fetching component:', error);
      setError('Failed to load component');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSnippet = () => {
    if (!newSnippet.filename || !newSnippet.language || !newSnippet.code) {
      setError('Please fill in all snippet fields');
      return;
    }

    setSnippets([...snippets, { ...newSnippet, id: Date.now() }]);
    setNewSnippet({ filename: '', language: '', code: '' });
    setError('');
  };

  const handleRemoveSnippet = (id: number) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const handleSaveComponent = async () => {
    if (!title || !useCase || !category || snippets.length === 0) {
      setError('Please fill in all required fields and add at least one snippet');
      return;
    }

    setSaving(true);
    try {
      let componentData;

      if (isNew) {
        // Create new component
        const createResponse = await adminAPI.createComponent({
          title,
          use_case: useCase,
          category: mapCategoryToEnum(category),
        });
        componentData = createResponse.data;

        // Add snippets
        for (const snippet of snippets.filter(s => !('id' in s) || typeof s.id === 'number' && s.id > 1000)) {
          await adminAPI.createSnippet(componentData.id, {
            filename: snippet.filename,
            language: snippet.language,
            code: snippet.code,
          });
        }
      } else {
        // Update existing component
        if (componentId) {
          await adminAPI.updateComponent(parseInt(componentId), {
            title,
            use_case: useCase,
            category: mapCategoryToEnum(category),
          });

          // Handle snippets - for simplicity, just add new ones
          for (const snippet of snippets.filter(s => typeof s.id === 'number' && s.id > 1000)) {
            await adminAPI.createSnippet(parseInt(componentId), {
              filename: snippet.filename,
              language: snippet.language,
              code: snippet.code,
            });
          }
        }
      }

      setError('');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save component');
    } finally {
      setSaving(false);
    }
  };

  const mapCategoryToEnum = (cat: string) => {
    const mapping: Record<string, string> = {
      frontend: 'frontend',
      backend: 'backend',
      database: 'database',
      devops: 'devops',
    };
    return mapping[cat] || 'frontend';
  };

  if (loading) {
    return <div className="editor-page"><p>Loading component...</p></div>;
  }

  return (
    <div className="editor-page">
      <div className="motion-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="editor-header">
            <h1>{isNew ? 'Create New Component' : 'Edit Component'}</h1>
            <button 
              className="secondary"
              onClick={() => navigate('/admin/dashboard')}
            >
              ← Back
            </button>
          </div>

          {error && (
            <div className="error-message">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.div>
            </div>
          )}

        <div className="editor-content">
          {/* Basic Info Section */}
          <section className="editor-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">Component Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., React Form Handler"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="useCase">Use Case / Description *</label>
              <textarea
                id="useCase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Describe what this component is for and when to use it"
                rows={4}
              />
            </div>
          </section>

          {/* Code Snippets Section */}
          <section className="editor-section">
            <h2>Code Snippets *</h2>

            {snippets.length > 0 && (
              <div className="snippets-preview">
                {snippets.map((snippet) => (
                  <div key={snippet.id} className="snippet-preview-item">
                    <div className="preview-header">
                      <div>
                        <h4>{snippet.filename}</h4>
                        <span className="preview-language">{snippet.language}</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveSnippet(snippet.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <pre className="preview-code">
                      <code>{snippet.code.substring(0, 200)}...</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}

            <div className="add-snippet-form">
              <h3>Add New Snippet</h3>

              <div className="form-group">
                <label htmlFor="filename">Filename *</label>
                <input
                  id="filename"
                  type="text"
                  value={newSnippet.filename}
                  onChange={(e) => setNewSnippet({ ...newSnippet, filename: e.target.value })}
                  placeholder="e.g., useForm.ts"
                />
              </div>

              <div className="form-group">
                <label htmlFor="language">Language *</label>
                <select
                  id="language"
                  value={newSnippet.language}
                  onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                >
                  <option value="">Select language...</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash</option>
                  <option value="yaml">YAML</option>
                  <option value="json">JSON</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="code">Code *</label>
                <textarea
                  id="code"
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  placeholder="Paste your code here..."
                  rows={8}
                />
              </div>

              <button 
                className="secondary"
                onClick={handleAddSnippet}
              >
                <Plus size={20} /> Add Snippet
              </button>
            </div>
          </section>

          {/* Save Section */}
          <div className="editor-actions">
            <button 
              className="primary"
              onClick={handleSaveComponent}
              disabled={saving}
            >
              <Save size={20} /> {saving ? 'Saving...' : 'Save Component'}
            </button>
            <button 
              className="secondary"
              onClick={() => navigate('/admin/dashboard')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
};
