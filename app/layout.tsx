import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://board.hrjdev.online';
const SITE_NAME = 'HRJ Board';
const TITLE = 'HRJ Board – Real-Time Kanban Board & Project Management for Teams';
const DESCRIPTION =
  'HRJ Board is a free, real-time kanban board for teams. Create projects, drag and drop tasks, invite teammates instantly, and manage your workflow together - all updates sync live.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | HRJ Board',
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'HRJ Board',
    'hrj board',
    'kanban board',
    'project management',
    'team collaboration',
    'task management',
    'real-time kanban',
    'drag and drop board',
    'online kanban tool',
    'project tracker',
  ],
  authors: [{ name: 'HRJ Board' }],
  creator: 'HRJ Board',
  publisher: 'HRJ Board',
  category: 'productivity',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon',
    shortcut: '/icon',
    // apple-touch-icon is supplied automatically by app/apple-icon.tsx
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'HRJ Board' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/opengraph-image'],
  },
  verification: {
    // Add your Google Search Console verification token here once you have one,
    // e.g. google: 'abcdefghijklmnopqrstuvwxyz'
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
  ],
};

// Structured data helps Google understand what HRJ Board is and can surface
// a rich result (name, description, category) for brand-name searches.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HRJ Board',
  alternateName: 'HRJ Board Kanban',
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: DESCRIPTION,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applied before hydration so the correct theme renders immediately
            with no flash of the wrong color scheme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('hrj_theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: { fontSize: '14px' },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
