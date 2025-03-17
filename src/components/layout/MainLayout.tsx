'use client';
import { ReactNode } from 'react';
import Navigation from './Navigation';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="terminal-container mx-auto max-w-7xl my-8 px-6 py-8 border-dotted border-2 border-foreground rounded-lg">
        <div className="terminal-header">
          <span className="terminal-button terminal-button-red"></span>
          <span className="terminal-button terminal-button-yellow"></span>
          <span className="terminal-button terminal-button-green"></span>
        </div>
        <main className="terminal-content">
          {children}
        </main>
      </div>
    </div>
  );
}