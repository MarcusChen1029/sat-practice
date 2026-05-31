import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAT Practice",
  description: "Local SAT practice website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper-2 text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
