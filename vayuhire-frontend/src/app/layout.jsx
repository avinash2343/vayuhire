import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VayuHire - Find Your Next Job',
  description: 'A platform to find jobs and companies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
