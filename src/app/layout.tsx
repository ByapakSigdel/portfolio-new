import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="terminal-container">
          {children}
        </div>
      </body>
    </html>
  );
}