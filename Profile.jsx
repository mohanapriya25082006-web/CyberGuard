import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function Profile() {
  const { user } = useAuth();
  const name = user?.fullName || 'User';
  return (
    <div className="page">
      <PageHeader title="Profile" subtitle="Your account details." />
      <div className="panel profile-card">
        <div className="avatar big">{name.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{name}</h2>
          <p className="muted">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
