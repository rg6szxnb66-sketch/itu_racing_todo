import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistPoppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-geist-poppins",
});

export const metadata: Metadata = {
  title: "FiniList - Kayıt Ol",
  description: "İTÜ Racing Takımı için yapılmış görev yönetim uygulaması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistPoppins.variable} ${geistPoppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
