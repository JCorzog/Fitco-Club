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
  title: 'Fitco Club | Guía de Fitness Boutique CDMX',
  description: 'Descubre, compara y reseña los mejores estudios boutique de la CDMX.',
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
