import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'

import QueryProvider from '@/lib/query-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="scroll-smooth">
          <QueryProvider>{children}</QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
