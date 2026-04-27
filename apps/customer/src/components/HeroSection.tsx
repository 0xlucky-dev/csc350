/**
 * FILE: apps/customer/src/components/HeroSection.tsx
 * PURPOSE: Hero banner with logo and service description
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 4.1–4.8
 */

import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="py-8 md:py-12 px-4 relative">
      <div className="container mx-auto text-center max-w-5xl relative z-10">
        {/* Logo with enhanced effects */}
        <div className="flex justify-center mb-6 relative">
          {/* Glow effect behind logo */}
          <div className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-br from-accent-blue via-accent-blue2 to-accent-blue animate-pulse" />
          
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Ninja Shop"
              width={1000}
              height={1000}
              className="w-80 h-80 md:w-96 md:h-96 lg:w-[32rem] lg:h-[32rem] object-contain 
                drop-shadow-[0_0_40px_rgba(0,212,255,0.8)] 
                drop-shadow-[0_0_80px_rgba(0,102,255,0.6)]
                hover:drop-shadow-[0_0_60px_rgba(0,212,255,1)] 
                hover:drop-shadow-[0_0_100px_rgba(0,102,255,0.8)]
                transition-all duration-500 
                hover:scale-110 
                hover:rotate-2
                animate-float"
              priority
            />
          </div>
        </div>

        {/* Title with enhanced styling */}
        <div className="relative inline-block">
          {/* Background glow for text */}
          <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-accent-blue via-accent-blue2 to-accent-blue" />
          
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold 
            text-transparent bg-clip-text 
            bg-gradient-to-r from-accent-blue via-white to-accent-blue2
            leading-tight tracking-wide
            drop-shadow-[0_0_20px_rgba(0,212,255,0.8)]
            animate-gradient-x
            px-4 py-2
            whitespace-nowrap">
            เช่าไอดี PlayStation
          </h1>
          
          {/* Decorative line */}
          <div className="mt-4 mx-auto w-48 h-1 bg-gradient-to-r from-transparent via-accent-blue to-transparent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
