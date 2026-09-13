'use client';
import { FormEvent, useRef, useState } from 'react';
import { wedding } from '@/lib/site';
import s from './experience.module.css';
export default function RSVPSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [reviewed, setReviewed] = useState(false);
  const [ceremony, setCeremony] = useState('');
  const [reception, setReception] = useState('');
  const declining = ceremony === 'no' && reception === 'no';
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = e.currentTarget.elements.namedItem('name') as HTMLInputElement;
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
    if (!e.currentTarget.reportValidity()) return;
    setReviewed(true);
  }
  function close() { dialog.current?.close(); }
  function trapTab(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key !== 'Tab') return;
    const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href]')).filter(el => !el.hasAttribute('disabled'));
    const first = controls[0]; const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
  return <>
    <button className={s.button} ref={trigger} onClick={() => dialog.current?.showModal()} type="button">RSVP <span aria-hidden>↗</span></button>
    <p className={s.rsvpDemo}>Demo form · Responses are not sent or saved.</p>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="rsvp-dialog-title" aria-describedby="rsvp-demo-description" onKeyDown={trapTab} onClose={() => { setReviewed(false); trigger.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) close(); } }}>
      <button className={s.dialogClose} type="button" onClick={close} aria-label="Close RSVP dialog">×</button><p className={s.eyebrow}>Kindly respond by {wedding.rsvpDeadline}</p><h2 id="rsvp-dialog-title">Will you join us?</h2><p id="rsvp-demo-description" className={s.demoNotice}>This is a demonstration. Responses are not sent or saved. Please use sample information.</p>
      {reviewed ? <div role="status" className={s.demoResult}><h3>Demo preview complete.</h3><p>No RSVP was submitted. Your answers have not been sent or saved.</p><button type="button" className={s.button} onClick={() => setReviewed(false)}>Try the form again</button></div> : <form onSubmit={submit} className={s.form}>
        <label>Your name *<input autoFocus required name="name" autoComplete="off" maxLength={100} placeholder="Your full name" onInput={e => e.currentTarget.setCustomValidity('')} /></label>
        <div className={s.formColumns}><label>Attending the nuptials? *<select name="ceremony" required value={ceremony} onChange={e => setCeremony(e.target.value)}><option value="">Please choose</option><option value="yes">Joyfully accept</option><option value="no">Regretfully decline</option></select></label><label>Attending the reception? *<select name="reception" required value={reception} onChange={e => setReception(e.target.value)}><option value="">Please choose</option><option value="yes">Joyfully accept</option><option value="no">Regretfully decline</option></select></label></div>
        <label>Number of guests (including you) *<input type="number" name="guests" required min={declining ? 0 : 1} max={10} defaultValue={1} /></label><label>Dietary notes <span className={s.optional}>(optional)</span><textarea name="dietary" rows={2} maxLength={500} placeholder="Anything you would like us to know" /></label><button className={s.button} type="submit">Preview demo response <span aria-hidden>↗</span></button>
      </form>}
    </dialog>
  </>;
}
