// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Unilever Sri Lanka - Sales Dashboard',
  description: 'Executive sales performance dashboard with AI forecasting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-tableau antialiased">
        {children}
      </body>
    </html>
  );
}