import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { BlogProvider } from '@/lib/blog-context'
import { SessionProvider } from '@/components/providers/session-provider'
import { GoogleOneTap } from '@/components/providers/google-one-tap'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Alpha Tax Consultant',
  description: 'Reliable accounting and tax services to help your business stay compliant and grow financially. 10+ years of experience.',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <SessionProvider>
          <GoogleOneTap clientId={process.env.GOOGLE_CLIENT_ID || ''} />
          <BlogProvider>
            {children}
          </BlogProvider>
        </SessionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  )
}
