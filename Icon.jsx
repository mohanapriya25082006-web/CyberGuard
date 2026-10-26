const PATHS = {
  shield: <><path d="M12 2l8 3v6c0 5-3.5 9.2-8 11-4.5-1.8-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M2 20h20" /></>,
  bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 21a2 2 0 004 0" /></>,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 118 0v4" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
  logout: <path d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  warn: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  headset: <path d="M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  check: <path d="M5 12l5 5 9-10" />,
  sync: <path d="M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 0118.5 5.8M21 4v5h-5M3 20v-5h5" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
};

export default function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
