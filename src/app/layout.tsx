import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
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
  metadataBase: new URL('https://www.brat-generator.site'),
  title: "Brat Generator - Create Your Custom Brat Album Cover",
  description: "The fastest, ad-free Brat Generator. Create your Charli XCX brat cover meme in seconds.",
  keywords: [
    "Charli XCX Brat generator",
    "brat generator",
    "brat text generator", 
    "brat font generator",
    "brat album cover generator",
    "brat meme generator",
    "charli xcx brat generator",
    "brat charli xcx generator"
  ],
  authors: [{ name: "Brat Generator" }],
  creator: "Brat Generator",
  publisher: "Brat Generator",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        sizes: '16x16 32x32',
        url: '/favicon.ico',
      },
    ],
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Brat Generator',
    title: 'Brat Generator - Create Your Custom Brat Album Cover',
    description: 'The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
    creator: '@bratgenerator',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'application-name': 'Brat Generator',
    'theme-color': '#8ACE00',
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "name": "Brat Generator",
                "url": "https://www.brat-generator.site",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://www.brat-generator.site/?q={search_term_string}",
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
                "description": "The fastest, ad-free Brat Generator. Create your Charli XCX brat cover meme in seconds.",
                "url": "https://www.brat-generator.site",
                "screenshot": "https://www.brat-generator.site/og-image.png"
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
        <Script 
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-E14XRMSHJM" 
        />
        <Script 
          id="google-analytics" 
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', 'G-E14XRMSHJM');
          `}
        </Script>
      </body>
    </html>
  );
}
