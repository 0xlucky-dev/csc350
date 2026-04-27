/**
 * FILE: apps/customer/src/app/layout.tsx
 * PURPOSE: Root layout for Ninja Shop Customer Website
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 4.1–4.8
 */

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Footer from '../components/Footer'

const fcSaraSamkan = localFont({
  src: [
    {
      path: '../../public/fonts/FC Sara Samkan [Non-commercial] Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/FC Sara Samkan [Non-commercial] Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-thai',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ninja Shop — PlayStation ID Rental',
  description: 'เช่าไอดี PlayStation ราคาถูก พร้อมเกมหลากหลาย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${fcSaraSamkan.variable} bg-background text-text-primary min-h-screen flex flex-col font-thai`}>
        {/* Background with image */}
        <div className="animated-bg" />
        
        {/* Twinkling stars */}
        <div className="stars">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star" />
          ))}
        </div>
        
        {/* Floating orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        
        {/* pt-24 md:pt-20 offsets the fixed header height (compact header) */}
        <div className="flex-1 pt-24 md:pt-20">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
