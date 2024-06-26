import type { Metadata } from "next"
import "./globals.css"
import Header from "./Header"

export const metadata: Metadata = {
  title: "Training Memo App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="container mx-auto bg-slate-700 text-slate-50">
        <Header />
        {children}
      </body>
    </html>
  )
}
