import { useState } from 'react';
import PageHeader from '../components/PageHeader';

const KEY = 'cyberguard_settings';
const DEFAULTS = { dashboardRefresh: true };

function Toggle({ on, onChange, label }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'on' : ''}`} onClick={onChange} />;
}

// Preferences are saved in this browser only (not on the server yet)
export default function Settings() {
  const [prefs, setPrefs] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return DEFAULTS; }
  });

  const flip = (name) => {
    const next = { ...prefs, [name]: !prefs[name] };
    setPrefs(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  };

  const rows = [
    ['dashboardRefresh', 'Live dashboard refresh', 'Reload alerts and device status every few seconds.'],
  ];

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Preferences for this browser." />
      <div className="panel settings-list">
        {rows.map(([key, title, text]) => (
          <div className="setting-row" key={key}>
            <div><b>{title}</b><small>{text}</small></div>
            <Toggle on={prefs[key]} onChange={() => flip(key)} label={title} />
          </div>
        ))}
      </div>
    </div>
  );
}
