import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chess Master - Play Chess Online',
  description: 'A modern chess website with full game logic, move validation, and beautiful interface. Play chess with complete rule enforcement including check, checkmate, castling, and en passant.',
  keywords: ['chess', 'game', 'strategy', 'online chess', 'chess board', 'chess pieces'],
  authors: [{ name: 'Chess Master' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-amber-50 to-amber-100`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}