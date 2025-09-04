import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// src/app/layout.js
export const metadata = {
  title: "JobCore",
  description: "Chavez Concrete job tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
