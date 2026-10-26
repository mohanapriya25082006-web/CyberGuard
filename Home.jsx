import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { Brand } from '../components/Navbar';

const quick = [
  ['laptop', 'Real-time Monitoring'],
  ['bell', 'Instant Alerts'],
  ['pin', 'Location Tracking'],
  ['shield', '24/7 Protection'],
];

const features = [
  ['laptop', 'Real-time Monitoring', 'Detects suspicious activity instantly.'],
  ['bell', 'Instant Alerts', 'Get notified about any unusual movement or access.'],
  ['pin', 'Location Tracking', 'Know where your device is always.'],
  ['bolt', 'Easy to Use', 'Simple setup, powerful protection.'],
  ['headset', '24/7 Support', "We're always here to help you."],
];

const steps = [
  ['1', 'Register', 'Create your account in seconds.'],
  ['2', 'Add Laptop', 'Register your device and get protected.'],
  ['3', 'Stay Secured', 'Receive alerts and monitor in real-time.'],
];

function HeroArt() {
  return (
    <svg viewBox="0 0 520 360" className="hero-art" aria-hidden="true">
      <defs>
        <linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a1470" /><stop offset="1" stopColor="#0d0731" /></linearGradient>
        <linearGradient id="shd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b44cff" /><stop offset="1" stopColor="#4da3ff" /></linearGradient>
      </defs>
      <ellipse cx="260" cy="305" rx="215" ry="42" fill="none" stroke="#b44cff" strokeWidth="2" opacity=".7" />
      <ellipse cx="260" cy="305" rx="165" ry="30" fill="none" stroke="#29d9ff" strokeWidth="2" opacity=".8" />
      <ellipse cx="260" cy="305" rx="115" ry="20" fill="rgba(180,76,255,.35)" stroke="#ff4fd8" strokeWidth="2" />
      <g transform="rotate(-4 260 190)">
        <rect x="120" y="50" width="280" height="190" rx="12" fill="url(#scr)" stroke="#b44cff" strokeWidth="3" />
        <path d="M95 245h330l-22 34H117z" fill="#1b1052" stroke="#7a3dff" strokeWidth="2" />
        <path d="M260 82l56 20v46c0 38-24 62-56 76-32-14-56-38-56-76v-46z" fill="rgba(122,61,255,.35)" stroke="url(#shd)" strokeWidth="5" />
        <rect x="238" y="140" width="44" height="36" rx="6" fill="#d8b4ff" />
        <path d="M246 140v-12a14 14 0 0128 0v12" fill="none" stroke="#d8b4ff" strokeWidth="6" />
        <circle cx="260" cy="157" r="5" fill="#2a1470" />
      </g>
    </svg>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const start = isAuthenticated ? '/dashboard' : '/register';

  return (
    <div className="home" id="top">
      <header className="hero">
        <div className="hero-copy">
          <small className="kicker">Your Laptop, Our Priority</small>
          <h1 className="grad-text">CyberGuard</h1>
          <h2>Smart Security for a Safer Tomorrow</h2>
          <p>Protect your laptops from theft, unauthorized access and suspicious activity with real-time monitoring, smart alerts and advanced security.</p>
          <div className="hero-actions">
            <Link to={start} className="btn btn-primary">{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</Link>
            <a href="#features" className="btn btn-ghost">Learn More</a>
          </div>
          <div className="quick-row">
            {quick.map(([icon, label]) => (
              <div key={label}><i><Icon name={icon} /></i>{label}</div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <HeroArt />
          <div className="float f-red"><Icon name="warn" /><div><b>Threat Detected</b><small>Motion detected on your laptop!</small></div></div>
          <div className="float f-green"><Icon name="shield" /><div><b>Laptop Protected</b><small>All systems secure</small></div></div>
          <div className="float f-score"><div className="ring" style={{ '--p': 98, width: 58, height: 58, '--t': '7px' }} /><div><small>Security Score</small><b>98%</b></div></div>
        </div>
      </header>

      <section className="home-section" id="features">
        <h2>Why Choose CyberGuard?</h2>
        <p className="section-sub">Advanced security. Simple setup. Complete peace of mind.</p>
        <div className="feature-grid">
          {features.map(([icon, title, text]) => (
            <article className="panel feature" key={title}>
              <span className="feature-icon"><Icon name={icon} /></span>
              <div><b>{title}</b><small>{text}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="how">
        <div className="how-grid">
          <div>
            <h2>How It Works?</h2>
            <p className="section-sub">Get started in 3 simple steps</p>
            <div className="steps">
              {steps.map(([n, title, text]) => (
                <article className="panel step" key={n}>
                  <i>{n}</i>
                  <div><b>{title}</b><small>{text}</small></div>
                </article>
              ))}
            </div>
          </div>
          <article className="panel mission" id="about">
            <span className="mission-icon"><Icon name="shield" /></span>
            <div>
              <h2>Your Security, Our Mission</h2>
              <p>CyberGuard keeps your digital life safe with intelligent monitoring, instant alerts and powerful protection.</p>
              <Link to={start} className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          </article>
        </div>
      </section>

      <footer className="home-footer">
        <Brand />
        <span>© 2026 CyberGuard. All rights reserved.</span>
        <span className="tagline">Stay Alert · Stay Secure · CyberGuard</span>
      </footer>
    </div>
  );
}
