import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { UpdateChecker } from '@/components/update-checker'
import './globals.css'

export const metadata: Metadata = {
  title: '到时候记得提醒我',
  description: '一个极简的待办提醒软件',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className="bg-background"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = document.cookie.replace(/(?:(?:^|.*;\\s*)theme\\s*\\=\\s*([^;]*).*$)|^.*$/, "$1");
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch(e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <UpdateChecker />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
