import './globals.css';
import type { Metadata } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-baloo',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '800'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'TIZA - Tu ayudante de matemáticas',
  description:
    'TIZA ayuda a chicos y chicas de 6 a 12 años a entender sus ejercicios de matemáticas paso a paso, sin darles la respuesta.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${baloo.variable} ${nunito.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
