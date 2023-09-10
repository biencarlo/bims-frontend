import "./globals.css";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";

const font = Mulish({ subsets: ["latin"], weight: ['300','400','500','600','700','800'] });

export const metadata: Metadata = {
  title: "Barangay Batis Information Management System",
  description: "Barangay Batis Information Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-orange-200">{children}</body>
    </html>
  );
}
