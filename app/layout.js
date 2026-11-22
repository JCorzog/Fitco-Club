import './globals.css';

export const metadata = {
  title: 'FITCO CLUB — CDMX Boutique Fitness Guide',
  description: 'Descubre, filtra y califica los mejores estudios boutique de CDMX.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-cream text-navy antialiased pb-24">
        {children}
      </body>
    </html>
  );
}
