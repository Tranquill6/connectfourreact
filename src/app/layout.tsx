import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ConnectFour React',
  description: 'Created by Riley Redfern',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='./favicon.png'/>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
