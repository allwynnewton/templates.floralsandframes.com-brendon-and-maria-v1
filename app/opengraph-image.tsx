import { ImageResponse } from 'next/og';
import { couple, wedding, creator } from '@/lib/site';

// The link-preview card shown when the site is shared (WhatsApp, iMessage, FB…).
export const alt = `${couple.groom} & ${couple.bride} — ${wedding.dateLabel}, ${wedding.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fbf4f2 0%, #f7e4e7 55%, #eef2e9 100%)',
        color: '#4a403c',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          fontSize: 26,
          letterSpacing: 14,
          textTransform: 'uppercase',
          color: '#9c6b78',
        }}
      >
        Together with their families
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 26 }}>
        <span style={{ fontSize: 128, letterSpacing: 8 }}>{couple.groom.toUpperCase()}</span>
        <span style={{ fontSize: 76, color: '#d98b98', margin: '0 34px' }}>&</span>
        <span style={{ fontSize: 128, letterSpacing: 8 }}>{couple.bride.toUpperCase()}</span>
      </div>

      <div style={{ width: 140, height: 2, background: '#d98b98', margin: '38px 0' }} />

      <div style={{ fontSize: 42, letterSpacing: 12 }}>{wedding.dateLabel}</div>
      <div
        style={{
          fontSize: 24,
          letterSpacing: 8,
          textTransform: 'uppercase',
          color: 'rgba(74,64,60,0.65)',
          marginTop: 16,
        }}
      >
        {wedding.city}
      </div>

      <div
        style={{
          fontSize: 18,
          letterSpacing: 6,
          textTransform: 'uppercase',
          color: '#9c6b78',
          marginTop: 64,
        }}
      >
        {creator.brand}
      </div>
    </div>,
    { ...size },
  );
}
