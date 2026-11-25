import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata = {
  metadataBase: new URL('https://www.fitcoclub.com'),
  title: 'Fitco Club · CDMX Fitness Guide',
  description:
    'Descubre, compara y reseña los mejores estudios de fitness en CDMX. Arma tu Top 4 y sella tu Pasaporte.',
  openGraph: {
    title: 'Fitco Club · CDMX Fitness Guide',
    description:
      'Estudios · Reseñas · Pasaporte Personal. La guía independiente de fitness en CDMX.',
    url: 'https://www.fitcoclub.com',
    siteName: 'Fitco Club',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitco Club · CDMX Fitness Guide',
    description:
      'Estudios · Reseñas · Pasaporte Personal. La guía independiente de fitness en CDMX.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body
        className="bg-cream text-navy antialiased pb-24"
        style={{ fontFamily: 'var(--font-sans), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
