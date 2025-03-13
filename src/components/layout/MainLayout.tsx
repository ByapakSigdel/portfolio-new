'use client';
import { ReactNode } from 'react';
import Navigation from './Navigation';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}