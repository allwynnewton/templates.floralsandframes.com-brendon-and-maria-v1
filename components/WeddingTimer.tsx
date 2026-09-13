'use client';

import { useEffect, useState } from 'react';
import { wedding } from '@/lib/site';
import s from './experience.module.css';

function remainingSeconds() {
  return Math.max(0, Math.ceil((new Date(wedding.dateISO).getTime() - Date.now()) / 1000));
}

export default function WeddingTimer() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(remainingSeconds());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const values = remaining === null ? null : [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];

  return <div className={s.weddingTimer}>
    <p className={s.timerCaption}>{remaining === 0 ? 'Our forever has begun.' : 'Until our forever begins'}</p>
    <div className={s.timerUnits} role="timer" aria-live="off" aria-label="Time until the wedding">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => <div className={s.timerUnit} key={label}>
        <span className={s.timerValue}>{values ? String(values[i]).padStart(2, '0') : '—'}</span>
        <span className={s.timerLabel}>{label}</span>
      </div>)}
    </div>
  </div>;
}
