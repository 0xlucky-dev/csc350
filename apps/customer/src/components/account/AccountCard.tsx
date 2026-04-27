/**
 * FILE: apps/customer/src/components/account/AccountCard.tsx
 * PURPOSE: Card หลักของแต่ละ PlayStation ID แสดงสถานะ เกม ราคา และปุ่มติดต่อ
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.10)
 * REQUIREMENTS: 1.5–1.10
 */

import Link from 'next/link'
import type { Account, RentalPrice, ContactSettings } from '@ninja-shop/shared'
import GameGrid from './GameGrid'
import PriceStatusCard from './PriceStatusCard'

interface AccountCardProps {
  account: Account
  prices: RentalPrice[]
  contactSettings: ContactSettings
}

export default function AccountCard({ account, prices, contactSettings }: AccountCardProps) {
  return (
    <div
      id={`account-${account.id}`}
      className="flex flex-col gap-4 rounded-xl glass p-6 glow-on-hover"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Link href={`/detail/${account.account_number}`} className="hover:text-accent-blue transition-colors">
          <h3 className="text-text-primary font-bold text-xl">
            ID No.{account.account_number}
          </h3>
        </Link>
      </div>

      {/* Game library - clickable */}
      <Link href={`/detail/${account.account_number}`} className="block">
        <GameGrid games={account.games} />
      </Link>

      {/* Price and Status Cards */}
      <div className="flex flex-col gap-2">
        <PriceStatusCard
          label="PS5 ไอดีตัวเอง"
          price={account.price_ps5_own}
          duration={30}
          status={account.status_ps5_own}
          rentedUntil={account.rented_until_ps5_own}
        />
        <PriceStatusCard
          label="PS5 ไอดีร้าน"
          price={account.price_ps5_shop}
          duration={30}
          status={account.status_ps5_shop}
          rentedUntil={account.rented_until_ps5_shop}
        />
        <PriceStatusCard
          label="PS4"
          price={account.price_ps4}
          duration={30}
          status={account.status_ps4}
          rentedUntil={account.rented_until_ps4}
        />
      </div>

      {/* Contact button */}
      <div className="grid grid-cols-1 gap-2">
        {(contactSettings.line_url || contactSettings.facebook_url) ? (
          <>
            {contactSettings.line_url && contactSettings.facebook_url ? (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={contactSettings.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  LINE
                </a>
                <a
                  href={contactSettings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            ) : contactSettings.line_url ? (
              <a
                href={contactSettings.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-lg bg-green-600 text-white font-bold text-center hover:bg-green-700 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
                ติดต่อเช่าเกม
              </a>
            ) : (
              <a
                href={contactSettings.facebook_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-bold text-center hover:bg-blue-700 transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                ติดต่อเช่าเกม
              </a>
            )}
          </>
        ) : contactSettings.contact_url ? (
          <a
            href={contactSettings.contact_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-accent-blue to-accent-blue2 text-white font-bold text-center hover:shadow-lg hover:shadow-accent-blue/50 transition-all min-h-[44px] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            ติดต่อเช่าเกม
          </a>
        ) : null}
      </div>
    </div>
  )
}
