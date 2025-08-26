import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = { title: 'Gemini AI Clone', description: 'A chatbot application inspired by Gemini AI, built with Next.js and Supabase.', }

export default function RootLayout({ children }) { return ( <html lang="en"> <body className={inter.className}>{children}</body> </html> ) }