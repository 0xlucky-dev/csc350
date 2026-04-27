/**
 * FILE: apps/customer/src/components/account/GameThumbnail.tsx
 * PURPOSE: แสดงรูปเกมพร้อม hover/tap title overlay และ error fallback
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * TASKS: .kiro/specs/ninja-shop/tasks.md (Task 6.3)
 * REQUIREMENTS: 2.4–2.8
 */

'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Game } from '@ninja-shop/shared'

interface GameThumbnailProps {
  game: Pick<Game, 'id' | 'title' | 'image_url' | 'thumbnail_url'>
}

export default function GameThumbnail({ game }: GameThumbnailProps) {
  const [imgError, setImgError] = useState(false)

  const src = game.thumbnail_url ?? game.image_url

  return (
    <div className="relative group aspect-[3/4] w-full overflow-hidden rounded bg-secondary-bg">
      {!imgError && src ? (
        <Image
          src={src}
          alt={game.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-text-secondary">
          <span className="text-3xl">🎮</span>
          <span className="text-xs text-center px-1 leading-tight">{game.title}</span>
        </div>
      )}

      {/* Title overlay on hover/tap */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="w-full px-2 pb-2 text-xs text-white font-medium leading-tight line-clamp-2">
          {game.title}
        </p>
      </div>
    </div>
  )
}
