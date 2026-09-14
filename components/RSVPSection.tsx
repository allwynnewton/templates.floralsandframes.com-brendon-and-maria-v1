// 'use client';
// import { FormEvent, useState } from 'react';
// import Reveal from './Reveal';
// import { couple, wedding } from '@/lib/site';
// export default function RSVPSection() {
//   const [status, setStatus] = useState(''),
//     [sending, setSending] = useState(false);
//   const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT;
//   async function submit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const data = Object.fromEntries(new FormData(e.currentTarget).entries());
//     setSending(true);
//     setStatus('');
//     try {
//       if (endpoint) {
//         const response = await fetch(endpoint, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(data),
//         });
//         if (!response.ok) throw Error('Unable to send');
//         setStatus('Thank you. Your reply has been sent with love.');
//       } else {
//         const body = `Wedding RSVP — ${couple.groom} & ${couple.bride}\n${wedding.dateLabel}\n\n${Object.entries(
//           data,
//         )
//           .map(([k, v]) => `${k}: ${v}`)
//           .join('\n')}\n`;
//         const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'wedding-rsvp.txt';
//         a.click();
//         setTimeout(() => URL.revokeObjectURL(url), 1000);
//         setStatus('Your reply is ready. Please share the downloaded file with the couple.');
//       }
//     } catch {
//       setStatus('Your reply could not be sent. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   }
//   return (
//     <section className="rsvp-section" id="rsvp">
//       <Reveal className="rsvp-paper">
//         <div className="section-heading">
//           <p className="eyebrow">Kindly reply by 1 December 2026</p>
//           <h2>
//             Will you <em>join us?</em>
//           </h2>
//         </div>
//         <form className="rsvp-form" onSubmit={submit}>
//           <label>
//             <span>Your name</span>
//             <input
//               name="Name"
//               required
//               autoComplete="name"
//               placeholder="Full name"
//               maxLength={120}
//             />
//           </label>
//           <label>
//             <span>Your reply</span>
//             <select name="Reply">
//               <option>Joyfully accept</option>
//               <option>Regretfully decline</option>
//             </select>
//           </label>
//           <label>
//             <span>Number of guests</span>
//             <input type="number" required name="Guests" min={1} max={10} defaultValue={1} />
//           </label>
//           <label>
//             <span>Celebrating with us at</span>
//             <select name="Events">
//               <option>Ceremony & reception</option>
//               <option>Ceremony only</option>
//               <option>Reception only</option>
//               <option>Unable to attend</option>
//             </select>
//           </label>
//           <label className="rsvp-wide">
//             <span>A note for the couple</span>
//             <textarea
//               name="Note"
//               placeholder="A little wish, or any dietary requests…"
//               maxLength={1000}
//             />
//           </label>
//           <button className="btn-ghost rsvp-submit rsvp-wide" disabled={sending}>
//             {sending ? 'Sending…' : endpoint ? 'Send with love' : 'Download my reply ↗'}
//           </button>
//         </form>
//         {!endpoint && (
//           <p className="rsvp-help">Download your reply and share it with the couple.</p>
//         )}
//         <p className="rsvp-status" role="status">
//           {status}
//         </p>
//       </Reveal>
//     </section>
//   );
// }


'use client';

import Image from 'next/image';
import {
  FormEvent,
  useRef,
  useState,
} from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import {
  couple,
  photos,
  wedding,
} from '@/lib/site';

type Status = {
  type: 'success' | 'error' | '';
  message: string;
};

export default function RSVPSection() {
  const root = useRef<HTMLElement>(null);

  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState<Status>({
    type: '',
    message: '',
  });

  const endpoint =
    process.env.NEXT_PUBLIC_RSVP_ENDPOINT;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.current,
                start: 'top 68%',
              },
            })
            .fromTo(
              '.rsvp-visual',
              {
                autoAlpha: 0,
                x: -55,
                clipPath:
                  'inset(0% 100% 0% 0% round 48% 48% 0 0)',
              },
              {
                autoAlpha: 1,
                x: 0,
                clipPath:
                  'inset(0% 0% 0% 0% round 48% 48% 0 0)',
                duration: 1.6,
                ease: 'power3.inOut',
              },
            )
            .fromTo(
              '.rsvp-content > *',
              {
                autoAlpha: 0,
                y: 25,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                stagger: 0.08,
                ease: 'power3.out',
              },
              '-=0.8',
            );
        },
      );

      return () => mm.revert();
    },
    {
      scope: root,
    },
  );

  async function submitRSVP(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = Object.fromEntries(
      new FormData(form).entries(),
    );

    setSending(true);

    setStatus({
      type: '',
      message: '',
    });

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Unable to send RSVP');
        }

        setStatus({
          type: 'success',
          message:
            'Thank you. Your reply has been sent with love.',
        });

        form.reset();

        return;
      }

      const reply = [
        `Wedding RSVP — ${couple.groom} & ${couple.bride}`,
        wedding.dateLabel,
        '',
        ...Object.entries(formData).map(
          ([key, value]) => `${key}: ${value}`,
        ),
      ].join('\n');

      const file = new Blob([reply], {
        type: 'text/plain;charset=utf-8',
      });

      const url = URL.createObjectURL(file);

      const download = document.createElement('a');

      download.href = url;
      download.download = 'wedding-rsvp.txt';
      download.click();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setStatus({
        type: 'success',
        message:
          'Your reply is ready. Please share the downloaded file with the couple.',
      });
    } catch {
      setStatus({
        type: 'error',
        message:
          'Your reply could not be sent. Please try again.',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      ref={root}
      className="rsvp-experience"
      id="rsvp"
      data-music-vol="0.32"
    >
      <div
        className="rsvp-background-glow rsvp-glow-one"
        aria-hidden
      />

      <div
        className="rsvp-background-glow rsvp-glow-two"
        aria-hidden
      />

      <div className="rsvp-shell">
        <div className="rsvp-visual">
          <Image
            src={photos.rsvp}
            alt={`${couple.groom} and ${couple.bride} together`}
            fill
            sizes="(max-width: 850px) 92vw, 44vw"
            className="rsvp-visual-image"
          />

          <div className="rsvp-visual-overlay" />

          <div className="rsvp-visual-copy">
            <p className="eyebrow">
              Your presence is our present
            </p>

            <blockquote>
              “The best part of our celebration will be
              sharing it with the people we love.”
            </blockquote>

            <p className="rsvp-signature">
              {couple.groom} &amp; {couple.bride}
            </p>
          </div>
        </div>

        <div className="rsvp-content">
          <div className="rsvp-ornament" aria-hidden>
            <span />
            <i>✧</i>
            <span />
          </div>

          <p className="eyebrow rsvp-deadline">
            Kindly reply by 1 December 2026
          </p>

          <h2 className="rsvp-title">
            Will you
            <em>join us?</em>
          </h2>

          <p className="rsvp-introduction">
            We would be delighted to celebrate this
            beautiful beginning with you.
          </p>

          <form
            className="rsvp-form-refined"
            onSubmit={submitRSVP}
          >
            <label className="rsvp-field">
              <span>Your name</span>

              <input
                name="Name"
                required
                autoComplete="name"
                placeholder="Full name"
                maxLength={120}
              />
            </label>

            <fieldset className="rsvp-field rsvp-wide-field">
              <legend>Your reply</legend>

              <div className="rsvp-choice-grid">
                <label className="rsvp-choice">
                  <input
                    type="radio"
                    name="Reply"
                    value="Joyfully accept"
                    defaultChecked
                  />

                  <span>
                    <i>✓</i>

                    <strong>Joyfully accept</strong>

                    <small>
                      I’ll be there to celebrate
                    </small>
                  </span>
                </label>

                <label className="rsvp-choice">
                  <input
                    type="radio"
                    name="Reply"
                    value="Regretfully decline"
                  />

                  <span>
                    <i>♡</i>

                    <strong>Regretfully decline</strong>

                    <small>
                      I’ll celebrate from afar
                    </small>
                  </span>
                </label>
              </div>
            </fieldset>

            <label className="rsvp-field">
              <span>Number of guests</span>

              <input
                type="number"
                name="Guests"
                required
                min={1}
                max={10}
                defaultValue={1}
              />
            </label>

            <label className="rsvp-field">
              <span>Celebrating with us at</span>

              <select
                name="Events"
                defaultValue="Ceremony & reception"
              >
                <option>Ceremony &amp; reception</option>
                <option>Ceremony only</option>
                <option>Reception only</option>
                <option>Unable to attend</option>
              </select>
            </label>

            <label className="rsvp-field rsvp-wide-field">
              <span>A note for the couple</span>

              <textarea
                name="Note"
                placeholder="A little wish, message or dietary request…"
                maxLength={1000}
                rows={3}
              />
            </label>

            <button
              type="submit"
              className="rsvp-submit-button rsvp-wide-field"
              disabled={sending}
            >
              <span>
                {sending
                  ? 'Sending your reply…'
                  : endpoint
                    ? 'Send with love'
                    : 'Download my reply'}
              </span>

              <i aria-hidden>↗</i>
            </button>
          </form>

          {!endpoint && (
            <p className="rsvp-helper">
              Download your RSVP and share it with the
              couple.
            </p>
          )}

          {status.message && (
            <p
              className={`rsvp-message rsvp-message-${status.type}`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
