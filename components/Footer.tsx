'use client';
import { creator, music, whatsappEnquiryUrl } from '@/lib/site';
export default function Footer() {
  return (
    <footer className="site-footer">
      <a
        className="footer-brand"
        href="https://floralsandframes.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Florals <em>&</em> Frames
      </a>
      <p>Thoughtfully crafted wedding websites · {creator.location}</p>
      <div className="footer-links">
        <a href={whatsappEnquiryUrl()} target="_blank" rel="noopener noreferrer">
          Create your invitation ↗
        </a>
        <a href="#top">Back to the beginning ↑</a>
      </div>
      <details>
        <summary>Music & artwork credits</summary>
        <p>
          Music: {music.track} — {music.artist}
        </p>
        <p>
          “3D Ring” by{' '}
          <a href="https://sketchfab.com/EmmaTurk" target="_blank" rel="noopener noreferrer">
            EmmaTurk
          </a>
          ,{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
          . Materials, lighting and presentation adapted for this invitation.
        </p>
      </details>
    </footer>
  );
}
