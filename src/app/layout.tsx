import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
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
  title: "Brat Generator - Create Your Custom Brat Album Cover",
  description: "The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!",
  keywords: [
    "brat generator",
    "brat text generator", 
    "brat font generator",
    "brat album cover generator",
    "brat generator charli xcx",
    "brat meme generator",
    "charli xcx brat generator",
    "brat cover generator",
    "brat album generator",
    "brat lyric generator",
    "brat charli xcx generator"
  ],
  authors: [{ name: "Brat Generator" }],
  creator: "Brat Generator",
  publisher: "Brat Generator",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Brat Generator',
    title: 'Brat Generator - Create Your Custom Brat Album Cover',
    description: 'The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!',
    images: [
      {
        url: '/og-image.png', // 我们稍后需要创建这个图片
        width: 1200,
        height: 630,
        alt: 'Brat Generator - Create Custom Brat Album Covers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brat Generator - Create Your Custom Brat Album Cover',
    description: 'The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!',
    images: ['/og-image.png'], // 同样需要创建这个图片
    creator: '@bratgenerator', // 如果有Twitter账号可以更新
  },
  verification: {
    google: 'your-google-verification-code', // 稍后需要从Search Console获取
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'application-name': 'Brat Generator',
    'theme-color': '#8ACE00', // brat green color
    'msapplication-TileColor': '#8ACE00',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "name": "Brat Generator",
                "url": "https://brat-generator.site",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://brat-generator.site/?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "SoftwareApplication",
                "name": "Brat Generator",
                "operatingSystem": "Any",
                "applicationCategory": "DesignApplication",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "1280" 
                },
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!",
                "url": "https://brat-generator.site",
                "screenshot": "https://brat-generator.site/og-image.png"
              }
            ]
          })}}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
