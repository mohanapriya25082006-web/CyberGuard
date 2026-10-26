import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary, getAllAlerts } from '../api/alertApi';
import { getMyLaptops } from '../api/laptopApi';
import AlertItem from '../components/AlertItem';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { weeklyCounts } from '../utils/alerts';

const POLL_INTERVAL_MS = 8000; // dashboard refreshes itself automatically

function ActivityChart({ alerts }) {
  const days = useMemo(() => weeklyCounts(alerts), [alerts]);
  const max = Math.max(1, ...days.map((d) => d.count));
  const pts = days.map((d, i) => [i * (400 / 6), 120 - (d.count / max) * 100]);
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
  return (
    <>
      <svg viewBox="0 0 400 130" className="chart" preserveAspectRatio="none" role="img" aria-label="Alerts in the last 7 days">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b44cff" stopOpacity=".7" /><stop offset="1" stopColor="#b44cff" stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,125 ${line} 400,125`} fill="url(#area)" />
        <polyline points={line} fill="none" stroke="#ff4fd8" strokeWidth="2.5" />
      </svg>
      <div className="chart-days">{days.map((d) => <span key={d.key}>{d.label}</span>)}</div>
    </>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [laptops, setLaptops] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [s, l, a] = await Promise.all([getDashboardSummary(), getMyLaptops(), getAllAlerts()]);
      setSummary(s.data);
      setLaptops(l.data);
      setAlerts(a.data);
      setError('');
    } catch {
      setError('Could not load dashboard data. Make sure the backend is running.');
    }
  };

  useEffect(() => {
    load();
    let live = true;
    try { live = JSON.parse(localStorage.getItem('cyberguard_settings'))?.dashboardRefresh !== false; } catch { /* default on */ }
    if (!live) return undefined;
    const t = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  const percent = useMemo(() => {
    if (!summary || summary.totalLaptops === 0) return 0;
    return Math.round((summary.armedLaptops / summary.totalLaptops) * 100);
  }, [summary]);

  if (error && !summary) return <div className="page"><div className="error-box">{error}</div></div>;
  if (!summary) return <div className="page loading-page"><div className="loading-ring" /> Loading your security dashboard...</div>;

  const stats = [
    ['laptop', 'purple', 'Total Laptops', summary.totalLaptops],
    ['shield', 'green', 'Protected', summary.armedLaptops],
    ['warn', 'red', 'Recent Alerts', summary.movementAlerts],
    ['lock', 'cyan', 'Security Events', summary.totalAlerts],
  ];

  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Here's what's happening with your devices.">
        <span className="live-pill"><i /> Live Monitoring</span>
      </PageHeader>
      {error && <div className="inline-warning">{error}</div>}

      <section className="stats-grid">
        {stats.map(([icon, tone, label, value]) => (
          <div className="panel stat" key={label}>
            <span className={`stat-icon ${tone}`}><Icon name={icon} /></span>
            <div><small>{label}</small><strong>{value}</strong></div>
          </div>
        ))}
      </section>

      <section className="dash-grid">
        <div className="panel ring-panel">
          <div className="ring big-ring" style={{ '--p': percent, '--c': percent === 100 ? 'var(--green)' : 'var(--amber)', '--t': '10px' }}>
            <div><strong>{percent}%</strong><small>Protection</small></div>
          </div>
          <b>{percent === 100 ? 'Full Security' : percent > 0 ? 'Needs attention' : 'Not protected'}</b>
          <small>{percent === 100 ? 'All systems are secure' : 'Arm your laptops to stay protected'}</small>
        </div>

        <div className="panel">
          <div className="panel-title"><h3>Recent Alerts</h3><Link to="/alerts">View All</Link></div>
          {summary.recentAlerts.length === 0
            ? <p className="muted">No alerts yet. Events will appear here.</p>
            : summary.recentAlerts.map((a) => <AlertItem key={a.id} alert={a} />)}
        </div>

        <div className="panel">
          <div className="panel-title"><h3>Quick Actions</h3></div>
          <div className="quick-actions">
            <Link to="/laptops"><Icon name="lock" /> Arm / Disarm Devices</Link>
            <Link to="/alerts"><Icon name="eye" /> View Alert History</Link>
            <Link to="/laptops"><Icon name="plus" /> Add New Laptop</Link>
            <Link to="/settings"><Icon name="gear" /> Settings</Link>
          </div>
        </div>
      </section>

      <section className="dash-bottom">
        <div className="panel">
          <div className="panel-title"><h3>Laptop Status</h3><Link to="/laptops">View All</Link></div>
          {laptops.length === 0 ? <p className="muted">No laptops registered yet.</p> : (
            <div className="mini-laptops">
              {laptops.slice(0, 2).map((l) => (
                <div className="mini-laptop" key={l.id}>
                  <div className="laptop-thumb small"><Icon name="laptop" /></div>
                  <div>
                    <b>{l.laptopName}</b> <span className={`badge ${l.armStatus === 'ARMED' ? 'safe' : 'warning'}`}>{l.armStatus === 'ARMED' ? 'Protected' : 'Disarmed'}</span>
                    <small>Device ID: {l.deviceId}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="panel">
          <div className="panel-title"><h3>Security Activity</h3><small className="muted">Last 7 days</small></div>
          <ActivityChart alerts={alerts} />
        </div>
      </section>
    </div>
  );
}
