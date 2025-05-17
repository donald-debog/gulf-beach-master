import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL('https://gulfbeachweddings.com'),
  title: {
    default: "Gulf Beach Weddings",
    template: "%s | Gulf Beach Weddings"
  },
  description: "Premier wedding planning and coordination services in the Gulf Coast area. Create your perfect beach wedding with our expert team.",
  keywords: ["wedding planning", "beach weddings", "Gulf Coast weddings", "wedding coordination", "destination weddings"],
  authors: [{ name: "Gulf Beach Weddings" }],
  creator: "Gulf Beach Weddings",
  publisher: "Gulf Beach Weddings",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gulfbeachweddings.com",
    siteName: "Gulf Beach Weddings",
    title: "Gulf Beach Weddings",
    description: "Premier wedding planning and coordination services in the Gulf Coast area.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gulf Beach Weddings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gulf Beach Weddings",
    description: "Premier wedding planning and coordination services in the Gulf Coast area.",
    images: ["/og-image.jpg"],
    creator: "@gulfbeachweddings",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
    yahoo: "your-yahoo-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
