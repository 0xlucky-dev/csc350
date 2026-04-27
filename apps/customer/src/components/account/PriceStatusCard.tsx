/**
 * FILE: apps/customer/src/components/account/PriceStatusCard.tsx
 * PURPOSE: แสดงราคาและสถานะการเช่าแบบใหม่ (แยกตามประเภท PS5/PS4)
 *          - แสดงราคา + ระยะเวลา + สถานะ + วันคงเหลือ
 *          - เช่น: "PS5 ไอดีตัวเอง 350 บาท 30 วัน | ว่าง"
 *          - เช่น: "PS4 250 บาท 30 วัน | ไม่ว่าง | เหลือ: 9 วัน"
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

interface PriceStatusCardProps {
  label: string
  price: number | null
  duration: number
  status: 'available' | 'rented' | null
  rentedUntil: string | null
}

function calculateDaysRemaining(rentedUntil: string | null): number {
  if (!rentedUntil) return 0
  
  const now = new Date()
  const until = new Date(rentedUntil)
  const diffTime = until.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays > 0 ? diffDays : 0
}

export default function PriceStatusCard({ label, price, duration, status, rentedUntil }: PriceStatusCardProps) {
  // ถ้าไม่มีราคา ไม่แสดง
  if (!price || price <= 0) {
    return null
  }
  
  const daysRemaining = status === 'rented' ? calculateDaysRemaining(rentedUntil) : 0
  const isAvailable = !status || status === 'available'
  
  return (
    <div
      className={`
        w-full px-4 py-3 rounded-lg border-2 transition-all
        ${isAvailable 
          ? 'bg-green-500/10 border-green-500/40 hover:border-green-500/60' 
          : 'bg-red-500/10 border-red-500/40 hover:border-red-500/60'
        }
      `}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* ราคาและระยะเวลา */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-text-primary font-semibold">{label}</span>
          <span className="text-accent-blue font-bold text-lg">฿{price}</span>
          <span className="text-text-secondary text-sm">{duration} วัน</span>
        </div>
        
        {/* สถานะ */}
        <div className="flex items-center gap-2">
          <span className="text-sm">|</span>
          {isAvailable ? (
            <span className="text-green-400 font-semibold">ว่าง</span>
          ) : (
            <>
              <span className="text-red-400 font-semibold">ไม่ว่าง</span>
              {daysRemaining > 0 && (
                <>
                  <span className="text-sm">|</span>
                  <span className="text-orange-400 font-semibold">
                    เหลือ: {daysRemaining} วัน
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
