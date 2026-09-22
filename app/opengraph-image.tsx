import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HRJ Board - Real-time kanban board for teams';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 45%, #6366f1 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 88,
            height: 88,
            borderRadius: 22,
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 36,
          }}
        >
          H
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, color: 'white' }}>HRJ Board</div>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.85)', marginTop: 18, maxWidth: 820 }}>
          Real-time kanban board &amp; project management for teams
        </div>
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 46,
          }}
        >
          {['Drag & drop', 'Live sync', 'Team invites'].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                padding: '10px 20px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontSize: 22,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
