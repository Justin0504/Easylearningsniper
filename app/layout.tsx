import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasyLearning Sniper - Precision AI Learning Platform',
  description: 'Master AI concepts with precision. Generate instant quizzes, flashcards, and smart summaries. Join the precision learning revolution.',
  keywords: 'AI learning, machine learning, artificial intelligence, quizzes, flashcards, learning platform, precision learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
