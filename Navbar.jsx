import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const navItems = [
  { to: '/dashboard', icon: 'grid', label: 'Dashboard' },
  { to: '/laptops', icon: 'laptop', label: 'My Laptops' },
  { to: '/alerts', icon: 'bell', label: 'Alert History' },
  { to: '/settings', icon: 'gear', label: 'Settings' },
  { to: '/profile', icon: 'user', label: 'Profile' },
];

export function Brand({ to = '/' }) {
  return (
    <Link to={to} className="brand">
      <i><Icon name="shield" /></i>CyberGuard
    </Link>
  );
}

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <nav className="public-navbar">
        <div className="public-inner">
          <Brand />
          <div className="public-menu">
            <a href="/#top">Home</a>
            <a href="/#features">Features</a>
            <a href="/#how">How It Works</a>
            <a href="/#about">About</a>
          </div>
          <div className="public-links">
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <aside className="sidebar">
      <Brand to="/dashboard" />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button type="button" className="sidebar-link logout" onClick={handleLogout}>
          <Icon name="logout" />
          <span>Logout</span>
        </button>
      </nav>
      <div className="sys-box">
        <strong>System Status</strong>
        <span><i className="dot" /> Online</span>
        <small>All systems operational</small>
      </div>
    </aside>
  );
}
