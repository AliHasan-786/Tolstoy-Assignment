import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const sans = Heebo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Signal | AI Content-to-Sales Prototype",
  description:
    "Measure what content drives sales, then generate more of what works, on-brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sans.variable}>{children}</body>
    </html>
  );
}
