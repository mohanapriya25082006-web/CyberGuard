// Maps backend alert types to the labels/colours used in the UI
const META = {
  MOVEMENT_DETECTED: { label: 'Movement detected', tone: 'critical', status: 'Critical', icon: 'warn' },
  DEVICE_OFFLINE: { label: 'Device offline', tone: 'warning', status: 'Warning', icon: 'bell' },
  ARMED: { label: 'Device armed', tone: 'safe', status: 'Safe', icon: 'check' },
  DISARMED: { label: 'Device disarmed', tone: 'safe', status: 'Safe', icon: 'check' },
};

export const alertMeta = (type) =>
  META[type] || { label: String(type || 'Event').replaceAll('_', ' '), tone: 'info', status: 'Info', icon: 'pin' };

export const alertDevice = (alert) => alert.laptop?.laptopName || 'My laptop';

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Unknown time';

// Count alerts per day for the last 7 days (for the activity chart)
export function weeklyCounts(alerts) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ key: d.toDateString(), label: d.toLocaleDateString('en-GB', { weekday: 'short' }), count: 0 });
  }
  alerts.forEach((a) => {
    const hit = days.find((d) => d.key === new Date(a.timestamp).toDateString());
    if (hit) hit.count += 1;
  });
  return days;
}
