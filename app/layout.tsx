import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_Telugu } from "next/font/google";
import "./globals.css";

const englishFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-english",
});

const teluguFont = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400"],
  variable: "--font-telugu",
});

export const metadata: Metadata = {
  title: "SELAH",
  icons: {
    icon: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${englishFont.variable} ${teluguFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}