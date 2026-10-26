import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Laptops from './pages/Laptops';
import AlertHistory from './pages/AlertHistory';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className={isAuthenticated ? 'app-shell' : ''}>
        <Navbar />
        <main className={isAuthenticated ? 'app-content' : ''}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/laptops" element={<ProtectedRoute><Laptops /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertHistory /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
