import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mahan Sigdel Portfolio',
  description: 'Engineer, student and enthusiastic learner',
  icons: {
    icon: '/profile-image.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}