import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecResearch - Advanced Security Intelligence Platform",
  description:
    "Comprehensive vulnerability intelligence platform aggregating CVE databases, exploit repositories, zero-day advisories, and real-time security feeds.",
  keywords: "security, vulnerability, CVE, exploit, PoC, cybersecurity, threat intelligence, zero-day",
  authors: [{ name: "Security Research Team" }],
  openGraph: {
    title: "SecResearch - Security Intelligence Platform",
    description: "Advanced security research platform for vulnerability intelligence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecResearch - Security Intelligence Platform",
    description: "Advanced security research platform for vulnerability intelligence",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
