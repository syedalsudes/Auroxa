import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastProvider } from "@/components/ToastContainer"
import { AuthProvider, ProductsProvider } from "@/contexts"
import React from "react"
import GlobalLoader from "@/components/GlobalLoader"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: {
    default: "Auroxa - Premium Fashion & Lifestyle E-Commerce Store",
    template: "%s | Auroxa",
  },
  description:
    "Discover premium fashion and lifestyle products at Auroxa. Shop the latest trends in clothing, accessories, footwear and more. Fast shipping, quality guaranteed.",
  keywords: [
    "fashion",
    "e-commerce",
    "clothing",
    "accessories",
    "footwear",
    "lifestyle",
    "premium fashion",
    "online shopping",
    "trendy clothes",
    "fashion store",
  ],
  authors: [{ name: "Syed Al-Sudes Hussain" }],
  creator: "Syed Al-Sudes Hussain",
  publisher: "Auroxa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Auroxa",
    title: "Auroxa - Premium Fashion & Lifestyle E-Commerce Store",
    description:
      "Discover premium fashion and lifestyle products at Auroxa. Shop the latest trends with fast shipping and quality guarantee.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Auroxa - Premium Fashion Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auroxa - Premium Fashion & Lifestyle Store",
    description: "Discover premium fashion and lifestyle products. Shop the latest trends with fast shipping.",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@auroxa",
  },
  icons: {
    icon: "/auroxaicon.svg",
    shortcut: "/auroxaicon.svg",
    apple: "/auroxaicon.svg",
  },
  manifest: "/manifest.json",
  category: "e-commerce",
  classification: "Fashion & Lifestyle E-Commerce",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="theme-color" content="#FF6B35" />
          <meta name="color-scheme" content="light dark" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="//images.unsplash.com" />
          <link rel="dns-prefetch" href="//api.clerk.dev" />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Auroxa",
                url: baseUrl,
                logo: `${baseUrl}/mainlogo.svg`,
                description: "Premium fashion and lifestyle e-commerce store",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+92-317-2044347",
                  contactType: "customer service",
                  email: "syedalsudes52@gmail.com",
                },
                sameAs: [
                  "https://facebook.com/auroxa",
                  "https://twitter.com/auroxa",
                  "https://instagram.com/auroxa",
                ],
              }),
            }}
          />
        </head>
        <body className="antialiased">
          <AuthProvider>
            <ToastProvider>
              <ProductsProvider>
                <GlobalLoader />
                <React.Suspense fallback={<div className="h-24 bg-background animate-pulse" />}>
                  <Header />
                </React.Suspense>
                <main id="main-content">{children}</main>
                <React.Suspense fallback={<div className="h-64 bg-background animate-pulse" />}>
                  <Footer />
                </React.Suspense>
              </ProductsProvider>
            </ToastProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
