import { useEffect, useState } from 'react';
import { registerLaptop, getMyLaptops, armLaptop, disarmLaptop } from '../api/laptopApi';
import LaptopCard from '../components/LaptopCard';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';

const EMPTY = { laptopName: '', brand: '', deviceId: '' };

export default function Laptops() {
  const [laptops, setLaptops] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadLaptops = async () => {
    try {
      const res = await getMyLaptops();
      setLaptops(res.data);
      setError('');
    } catch {
      setError('Could not load laptops. Make sure the backend is running.');
    }
  };

  useEffect(() => { loadLaptops(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerLaptop(form);
      setForm(EMPTY);
      setShowForm(false);
      await loadLaptops();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not register laptop');
    } finally {
      setLoading(false);
    }
  };

  const handleArm = async (id) => { try { await armLaptop(id); await loadLaptops(); } catch { setError('Could not arm this laptop'); } };
  const handleDisarm = async (id) => { try { await disarmLaptop(id); await loadLaptops(); } catch { setError('Could not disarm this laptop'); } };

  const armed = laptops.filter((l) => l.armStatus === 'ARMED').length;
  const allArmed = laptops.length > 0 && armed === laptops.length;

  return (
    <div className="page">
      <PageHeader title="My Laptops" subtitle="Manage and monitor your registered laptops.">
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}><Icon name="plus" /> Add Laptop</button>
      </PageHeader>

      {error && <div className="error-box" role="alert">{error}</div>}

      {showForm && (
        <form className="panel device-form" onSubmit={handleSubmit}>
          <input name="laptopName" placeholder="Laptop name" value={form.laptopName} onChange={handleChange} required aria-label="Laptop name" />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required aria-label="Brand" />
          <input name="deviceId" placeholder="ESP32 Device ID" value={form.deviceId} onChange={handleChange} required aria-label="ESP32 Device ID" />
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Register laptop'}</button>
        </form>
      )}

      {laptops.length === 0 ? (
        <div className="panel empty-panel"><Icon name="laptop" /><h3>No laptops registered</h3><p>Choose Add Laptop to connect your first device.</p></div>
      ) : (
        <div className="laptop-grid">
          {laptops.map((l) => <LaptopCard key={l.id} laptop={l} onArm={handleArm} onDisarm={handleDisarm} />)}
        </div>
      )}

      {laptops.length > 0 && (
        <div className="panel status-banner">
          <span className="banner-icon"><Icon name="shield" /></span>
          <b>{allArmed ? 'All devices are protected and being monitored in real-time.' : `${armed} of ${laptops.length} devices are protected. Arm the rest before you leave them unattended.`}</b>
          <span className="live-pill"><i /> Live</span>
        </div>
      )}
    </div>
  );
}
