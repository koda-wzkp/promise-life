import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promise Life",
  description:
    "Conway's Game of Life with rules derived from Lindblad master equation parameters fitted to institutional commitment data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
