import { ImageResponse } from 'next/og';

// iOS home-screen icon (rounded automatically by the OS).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fbf4f2 0%, #f7e4e7 100%)',
        color: '#9c6b78',
        fontSize: 118,
        fontFamily: 'serif',
      }}
    >
      &
    </div>,
    { ...size },
  );
}
