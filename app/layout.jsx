import Navbar from '../components/navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import ToastProvider from './providers/toast-provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Crypto Domains',
  description: 'DApp for Domains',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
