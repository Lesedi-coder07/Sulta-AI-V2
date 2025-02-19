import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Sulta AI - Your Personal AI Workforce Revolution",
  description: "Transform Your Productivity: Build Custom AI Agents in Minutes, No Coding Required",
  icons: {
      icon: "/vercel.svg",
  },
  openGraph: {
      images: [
          {
              url: 'https://www.sultatech.com/img/ai-thumb.jpg',
              width: 1200,
              height: 800,
              alt: 'Sulta AI - Custom AI Agents',
          }
      ],
  },
  twitter: {
      card: 'summary_large_image',
      images: ['https://www.sultatech.com/img/ai-thumb.jpg'],
      description: "Unleash the Power of AI: Create Custom AI Agents That Work for You 24/7",
}}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
