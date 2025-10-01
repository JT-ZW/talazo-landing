import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";

// Enhanced metadata with comprehensive SEO
export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    creator: "@talazoagritech",
    images: ["/og-image.jpg"],
  },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  category: "technology",
  classification: "Agriculture Technology",
  other: {
    "msapplication-TileColor": "#16a34a",
    "theme-color": "#16a34a",
  },
};

// Enhanced viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+263-XX-XXXXXX", // Replace with actual phone
    contactType: "Customer Service",
    availableLanguage: ["English", "Shona", "Ndebele"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Harare",
    addressCountry: "ZW",
  },
  sameAs: [
    "https://facebook.com/talazoagritech",
    "https://twitter.com/talazoagritech",
    "https://linkedin.com/company/talazo",
  ],
  serviceType: "Agricultural Technology",
  areaServed: {
    "@type": "Country",
    name: "Zimbabwe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Preconnect to important third-party origins */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.name} />

        {/* Zimbabwe specific meta */}
        <meta name="geo.region" content="ZW" />
        <meta name="geo.placename" content="Zimbabwe" />
        <meta name="language" content="English" />

        {/* Security headers */}
        <meta name="referrer" content="origin-when-cross-origin" />
      </head>
      <body
        className="
          antialiased 
          font-sans 
          text-slate-900 
          bg-gradient-to-br 
          from-slate-50 
          via-white 
          to-green-50/30
          min-h-screen
          overflow-x-hidden
          relative
        "
      >
        {/* Background Elements for Premium Feel */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          {/* Subtle animated background gradients */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-100/20 to-blue-100/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "0s", animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s", animationDuration: "10s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-green-100/15 to-emerald-100/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s", animationDuration: "12s" }}
          />

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0V0zm30 0h1v1h-1V0zm30 0h1v1h-1V0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10">{children}</div>

        {/* Performance optimization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Smooth loading experience
              window.addEventListener('load', function() {
                document.body.classList.add('loaded');
              });
              
              // Prevent FOUC (Flash of Unstyled Content)
              document.documentElement.classList.add('js-enabled');
            `,
          }}
        />

        {/* Analytics placeholder - replace with your analytics */}
        {process.env.NODE_ENV === "production" && (
          <>
            {/* Google Analytics - replace with your tracking ID */}
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
              strategy="afterInteractive"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
