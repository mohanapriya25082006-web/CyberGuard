import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import AuthField from '../components/AuthField';
import SocialButtons from '../components/SocialButtons';
import Icon from '../components/Icon';
import { Brand } from '../components/Navbar';
import { forgotPasswordUser } from '../api/authApi';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
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
          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to your account</p>
          {error && <div className="error-box" role="alert">{error}</div>}

          <AuthField icon="mail" type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          <AuthField icon="lock" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <div className="auth-between">
            <label>
              <input type="checkbox" /> Remember me
            </label>

            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <SocialButtons />
          <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
