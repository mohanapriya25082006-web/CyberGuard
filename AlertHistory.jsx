import { useEffect, useMemo, useState } from 'react';
import { getAllAlerts, getAlertsForLaptop } from '../api/alertApi';
import { getMyLaptops } from '../api/laptopApi';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { alertMeta, alertDevice, formatDate } from '../utils/alerts';

const FILTERS = [['all', 'All'], ['critical', 'Critical'], ['warning', 'Warning'], ['safe', 'Safe']];
const PAGE_SIZE = 8;

export default function AlertHistory() {
  const [laptops, setLaptops] = useState([]);
  const [laptopId, setLaptopId] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => { getMyLaptops().then((r) => setLaptops(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = laptopId === 'all' ? await getAllAlerts() : await getAlertsForLaptop(laptopId);
        setAlerts(res.data);
        setError('');
      } catch {
        setError('Could not load alert history');
      }
    };
    load();
    setPage(1);
  }, [laptopId]);

  const shown = useMemo(
    () => alerts.filter((a) => filter === 'all' || alertMeta(a.alertType).tone === (filter === 'critical' ? 'critical' : filter)),
    [alerts, filter]
  );
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const rows = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <PageHeader title="Alert History" subtitle="View all security events and system activities.">
        <select className="select" value={laptopId} onChange={(e) => setLaptopId(e.target.value)} aria-label="Filter by device">
          <option value="all">All Devices</option>
          {laptops.map((l) => <option key={l.id} value={l.id}>{l.laptopName}</option>)}
        </select>
      </PageHeader>

      {error && <div className="error-box" role="alert">{error}</div>}

      <div className="panel">
        <div className="chips">
          {FILTERS.map(([key, label]) => (
            <button key={key} className={`chip ${filter === key ? 'on' : ''}`} onClick={() => { setFilter(key); setPage(1); }}>{label}</button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="empty-panel"><Icon name="check" /><h3>No alert events found</h3><p>When CyberGuard detects an event, it will appear in this table.</p></div>
        ) : (
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Date &amp; Time</th><th>Device</th><th>Alert Type</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map((a) => {
                  const m = alertMeta(a.alertType);
                  return (
                    <tr key={a.id}>
                      <td>{formatDate(a.timestamp)}</td>
                      <td>{alertDevice(a)}</td>
                      <td><span className={`alert-icon sm ${m.tone}`}><Icon name={m.icon} /></span> {m.label}</td>
                      <td><span className={`badge ${m.tone}`}>{m.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="pager">
            <button onClick={() => setPage(Math.max(1, page - 1))} aria-label="Previous page">&lsaquo;</button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} className={page === i + 1 ? 'on' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(Math.min(pages, page + 1))} aria-label="Next page">&rsaquo;</button>
          </div>
        )}
      </div>
    </div>
  );
}
