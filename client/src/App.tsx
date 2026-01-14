import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { LoginPage } from './pages/AuthPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminComponentEditorPage } from './pages/AdminComponentEditorPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/components" element={<ComponentsPage />} />
            <Route path="/category/:category" element={<CategoriesPage />} />
            <Route path="/components/:componentId" element={<ComponentDetailPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/components/create" element={<AdminComponentEditorPage />} />
            <Route path="/admin/components/:componentId/edit" element={<AdminComponentEditorPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

