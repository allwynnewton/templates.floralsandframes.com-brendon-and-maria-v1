'use client';
import { googleCalendarUrl, icsContent } from '@/lib/site';
import s from './experience.module.css';
export default function AddToCalendar() {
  function downloadIcs() {
    const url = URL.createObjectURL(new Blob([icsContent()], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'brendon-and-maria-wedding.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={s.calendarLinks}><a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">Google Calendar <span aria-hidden>↗</span></a><span aria-hidden>·</span><button type="button" onClick={downloadIcs}>Apple / Outlook <span className={s.downloadLabel}>.ics ↓</span></button></div>;
}
