import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import AuthField from '../components/AuthField';
import SocialButtons from '../components/SocialButtons';
import Icon from '../components/Icon';
import { Brand } from '../components/Navbar';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match. Type the same password in both fields.');
      return;
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form; // confirm is only for the form, not the API
      const res = await registerUser(payload);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <Brand />
        <form className="panel auth-card" onSubmit={handleSubmit}>
          <span className="auth-shield"><Icon name="shield" /></span>
          <h2>Create your account</h2>
          <p className="auth-sub">Join CyberGuard and keep your devices safe.</p>
          {error && <div className="error-box" role="alert">{error}</div>}

          <AuthField icon="user" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <AuthField icon="mail" type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          <AuthField icon="lock" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} />
          <AuthField icon="lock" type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} required minLength={6} />

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
          <SocialButtons />
          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
