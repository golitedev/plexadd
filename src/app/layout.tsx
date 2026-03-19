import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "plexadd",
  description: "Simple request board for movies, TV shows, and music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[var(--color-bg)] font-sans text-[var(--color-text)] antialiased">
        {children}
      </body>
    </html>
  );
}
