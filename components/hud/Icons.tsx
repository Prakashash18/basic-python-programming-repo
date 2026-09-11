export function FlameIcon({ className = "", size = 15 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={(size * 17) / 15} viewBox="0 0 15 17" fill="none" aria-hidden>
      <path
        d="M7.5 1C7.5 1 3 5.2 3 9a4.5 4.5 0 1 0 9 0c0-1.7-1.1-3.3-1.1-3.3S9.7 7.4 8.8 7.4C7.6 7.4 9.2 3.6 7.5 1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BoltIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" aria-hidden>
      <path d="M7.4 1 2.6 7.3h3.2L5.6 12l4.8-6.3H7.2L7.4 1Z" fill="currentColor" />
    </svg>
  );
}

export function StarIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 19 19" fill="none" aria-hidden>
      <path
        d="M9.5 1.8 11.9 6.7l5.4 0.8-3.9 3.8 0.9 5.4-4.8-2.5-4.8 2.5 0.9-5.4L1.7 7.5l5.4-0.8L9.5 1.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ObjectiveDone({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="8" fill="rgba(45,212,191,0.22)" />
      <path d="M5.4 9.2 7.7 11.5 12.6 6.6" stroke="#5eead4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ObjectiveActive({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="7.2" stroke="#5eead4" strokeWidth="1.6" />
      <circle className="hud-live" cx="9" cy="9" r="3.2" fill="#5eead4" />
    </svg>
  );
}

export function ObjectiveLocked({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="4" y="8" width="10" height="7" rx="2" stroke="#6b78ac" strokeWidth="1.4" />
      <path d="M6.4 8V6.2a2.6 2.6 0 0 1 5.2 0V8" stroke="#6b78ac" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
