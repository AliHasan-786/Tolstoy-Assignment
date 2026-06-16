import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const sans = Heebo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tolstoy Account Workbench",
  description:
    "A seeded case workflow for measuring content-to-sales signals before guarded AI generation.",
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
