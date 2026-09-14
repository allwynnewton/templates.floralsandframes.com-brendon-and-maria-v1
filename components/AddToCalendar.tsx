'use client';

import { googleCalendarUrl, icsContent } from '@/lib/site';

/**
 * AddToCalendar — lets guests drop the wedding into their calendar in one tap.
 * Google Calendar opens in a new tab; Apple / Outlook download a standard .ics.
 */
export default function AddToCalendar() {
  const gcal = googleCalendarUrl();

  const downloadIcs = () => {
    const blob = new Blob([icsContent()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brendon-and-maria-wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="eyebrow text-mauve">Save the date</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a href={gcal} target="_blank" rel="noopener noreferrer" className="btn-ghost text-ink">
          Google Calendar
        </a>
        <button type="button" onClick={downloadIcs} className="btn-ghost text-ink">
          Apple / Outlook
        </button>
      </div>
    </div>
  );
}
