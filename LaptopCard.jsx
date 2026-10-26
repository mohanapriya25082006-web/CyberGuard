import { useState } from 'react';
import Icon from './Icon';
import { formatDate } from '../utils/alerts';

export default function LaptopCard({ laptop, onArm, onDisarm }) {
  const armed = laptop.armStatus === 'ARMED';
  const [open, setOpen] = useState(false);

  return (
    <article className="panel laptop-card">
      <div className="laptop-thumb"><Icon name="laptop" /></div>
      <div className="laptop-info">
        <span className={`badge ${armed ? 'safe' : 'warning'}`}>{armed ? 'Protected' : 'Disarmed'}</span>
        <h3>{laptop.laptopName}</h3>
        <small>Device ID: <code>{laptop.deviceId}</code></small>
        <small>Brand: {laptop.brand}</small>
        {open && <small>Registered: {formatDate(laptop.registeredAt)}</small>}
      </div>
      <div className="laptop-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}>{open ? 'Hide Details' : 'View Details'}</button>
        {armed ? (
          <button className="btn btn-danger btn-sm" onClick={() => onDisarm(laptop.id)}>Disarm</button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => onArm(laptop.id)}>Arm</button>
        )}
      </div>
    </article>
  );
}
