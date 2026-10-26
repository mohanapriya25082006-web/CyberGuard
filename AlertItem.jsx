import Icon from './Icon';
import { alertMeta, alertDevice, formatDate } from '../utils/alerts';

// Compact row used in the dashboard "Recent Alerts" panel
export default function AlertItem({ alert }) {
  const meta = alertMeta(alert.alertType);
  return (
    <div className="alert-row">
      <span className={`alert-icon ${meta.tone}`}><Icon name={meta.icon} /></span>
      <div className="alert-text">
        <strong>{meta.label}</strong>
        <small>{alertDevice(alert)} · {formatDate(alert.timestamp)}</small>
      </div>
      <span className={`badge ${meta.tone}`}>{meta.status}</span>
    </div>
  );
}
