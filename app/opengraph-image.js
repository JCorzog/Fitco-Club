import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Fitco Club · CDMX Fitness Guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FAF8F5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '44px',
        }}
      >
        {/* Marco exterior fino */}
        <div
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid #102132',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          {/* Venado */}
          <svg
            width="92"
            height="92"
            viewBox="0 0 120 120"
            fill="none"
            stroke="#102132"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M51 44 C46 32, 34 24, 30 10" />
            <path d="M40 30 C32 28, 26 22, 24 15" />
            <path d="M46 36 C44 26, 46 18, 42 12" />
            <path d="M69 44 C74 32, 86 24, 90 10" />
            <path d="M80 30 C88 28, 94 22, 96 15" />
            <path d="M74 36 C76 26, 74 18, 78 12" />
            <path d="M47 49 C37 45, 31 48, 33 54 C35 58, 42 58, 47 55" />
            <path d="M73 49 C83 45, 89 48, 87 54 C85 58, 78 58, 73 55" />
            <path d="M47 48 C50 43, 70 43, 73 48 C75 56, 72 67, 68 75 C66 80, 64 85, 60 85 C56 85, 54 80, 52 75 C48 67, 45 56, 47 48 Z" />
            <path d="M56 76 C58 78, 62 78, 64 76" />
            <path d="M60 78 L60 82" />
            <path d="M50 72 C48 86, 44 98, 42 108" />
            <path d="M70 72 C72 86, 76 98, 78 108" />
            <path d="M48 92 C54 100, 66 100, 72 92" />
          </svg>

          {/* Título */}
          <div
            style={{
              fontSize: 68,
              fontFamily: 'Georgia, serif',
              fontWeight: 600,
              color: '#102132',
              letterSpacing: '0.06em',
              marginTop: 18,
            }}
          >
            FITCO CLUB
          </div>

          {/* Subtítulo */}
          <div
            style={{
              fontSize: 22,
              fontFamily: 'sans-serif',
              color: 'rgba(16, 33, 50, 0.72)',
              letterSpacing: '0.32em',
              marginTop: 12,
            }}
          >
            CDMX FITNESS GUIDE
          </div>

          {/* Línea divisoria */}
          <div
            style={{
              width: 140,
              height: 1.5,
              backgroundColor: 'rgba(16, 33, 50, 0.25)',
              marginTop: 32,
              marginBottom: 28,
            }}
          />

          {/* Descripción corta */}
          <div
            style={{
              fontSize: 28,
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              color: '#102132',
            }}
          >
            Estudios · Reseñas · Pasaporte Personal
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
