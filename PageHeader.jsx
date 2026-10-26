import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

export default function PageHeader({ title, subtitle, children }) {
  const { user } = useAuth();
  const name = user?.fullName || 'User';
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="header-right">
        {children}
        <span className="bell" aria-label="Notifications"><Icon name="bell" /></span>
        <div className="who">
          <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          <div><strong>{name}</strong><small>User</small></div>
        </div>
      </div>
    </header>
  );
}
