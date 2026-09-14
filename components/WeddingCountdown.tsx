'use client';
import { useEffect, useState } from 'react';
import { wedding } from '@/lib/site';
export default function WeddingCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () =>
      setRemaining(Math.max(0, new Date(wedding.dateISO).getTime() - Date.now()));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.floor((remaining ?? 0) / 1000);
  const values = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  return (
    <div className="countdown-inline" role="timer" aria-label="Time until the wedding">
      <p className="eyebrow">
        {remaining === 0 ? 'Our forever has begun' : 'Counting the moments until forever'}
      </p>
      <div className="countdown-units">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => (
          <div className="countdown-unit" key={label}>
            <strong>{remaining === null ? '—' : String(values[i]).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
