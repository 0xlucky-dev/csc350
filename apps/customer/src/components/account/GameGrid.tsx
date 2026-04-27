/**
 * FILE: apps/customer/src/components/account/GameGrid.tsx
 * PURPOSE: Grid layout สำหรับแสดงรูปเกมทั้งหมดใน Account Card (Fixed aspect ratio)
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.4)
 * REQUIREMENTS: 2.1–2.3
 */

import Image from 'next/image'
import type { Game } from '@ninja-shop/shared'

interface GameGridProps {
  games: Game[]
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="w-full aspect-square bg-card-bg flex items-center justify-center rounded-lg">
        <p className="text-sm text-text-secondary">ยังไม่มีเกม</p>
      </div>
    )
  }

  // Always use square aspect ratio for consistency
  let gridClass = ''
  let displayGames = games

  if (games.length === 1) {
    gridClass = 'grid-cols-1 grid-rows-1'
    displayGames = games.slice(0, 1)
  } else if (games.length === 2) {
    gridClass = 'grid-cols-2 grid-rows-1'
    displayGames = games.slice(0, 2)
  } else if (games.length === 3) {
    gridClass = 'grid-cols-3 grid-rows-1'
    displayGames = games.slice(0, 3)
  } else if (games.length <= 4) {
    gridClass = 'grid-cols-2 grid-rows-2'
    displayGames = games.slice(0, 4)
  } else if (games.length <= 6) {
    gridClass = 'grid-cols-3 grid-rows-2'
    displayGames = games.slice(0, 6)
  } else if (games.length <= 9) {
    gridClass = 'grid-cols-3 grid-rows-3'
    displayGames = games.slice(0, 9)
  } else if (games.length <= 12) {
    gridClass = 'grid-cols-4 grid-rows-3'
    displayGames = games.slice(0, 12)
  } else if (games.length <= 16) {
    gridClass = 'grid-cols-4 grid-rows-4'
    displayGames = games.slice(0, 16)
  } else if (games.length <= 20) {
    gridClass = 'grid-cols-5 grid-rows-4'
    displayGames = games.slice(0, 20)
  } else {
    gridClass = 'grid-cols-6 grid-rows-4'
    displayGames = games.slice(0, 24)
  }

  return (
    <div className={`grid ${gridClass} gap-0 w-full aspect-square bg-card-bg overflow-hidden rounded-lg`}>
      {displayGames.map((game) => (
        <div key={game.id} className="relative w-full h-full">
          <Image
            src={game.image_url}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
