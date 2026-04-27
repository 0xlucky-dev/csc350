/**
 * FILE: apps/customer/src/components/account/AccountGridWithSearch.tsx
 * PURPOSE: Client component wrapper for AccountGrid with game-based search
 *          - Autocomplete game search (type partial name, shows suggestions)
 *          - Multi-game selection (tag-based)
 *          - Real-time filtering
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import type { Account, RentalPrice, ContactSettings } from '@ninja-shop/shared'
import Header from '../Header'
import AccountGrid from './AccountGrid'

interface AccountGridWithSearchProps {
  accounts: Account[]
  prices: RentalPrice[]
  contactSettings: ContactSettings
}

interface Game {
  id: number
  title: string
}

export default function AccountGridWithSearch({
  accounts,
  prices,
  contactSettings,
}: AccountGridWithSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGames, setSelectedGames] = useState<Game[]>([])
  const [gameSuggestions, setGameSuggestions] = useState<Game[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Get all unique games from accounts
  const allGames = useMemo(() => {
    const gameMap = new Map<number, Game>()
    accounts.forEach(account => {
      account.games?.forEach(game => {
        if (!gameMap.has(game.id)) {
          gameMap.set(game.id, { id: game.id, title: game.title })
        }
      })
    })
    return Array.from(gameMap.values())
  }, [accounts])

  // Filter game suggestions based on search query
  useEffect(() => {
    if (searchQuery.length < 2) {
      setGameSuggestions([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const normalizedQuery = query.replace(/\s+/g, '')
    
    const filtered = allGames.filter(game => {
      // Skip already selected games
      if (selectedGames.some(g => g.id === game.id)) return false
      
      const gameTitle = game.title.toLowerCase()
      const normalizedTitle = gameTitle.replace(/\s+/g, '')
      
      return gameTitle.includes(query) || normalizedTitle.includes(normalizedQuery)
    }).slice(0, 10) // Limit to 10 suggestions
    
    setGameSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [searchQuery, allGames, selectedGames])

  // Filter accounts by selected games (real-time)
  const filteredAccounts = useMemo(() => {
    if (selectedGames.length === 0) {
      return accounts
    }

    return accounts.filter(account => {
      // Account must have ALL selected games
      return selectedGames.every(selectedGame =>
        account.games?.some(game => game.id === selectedGame.id)
      )
    })
  }, [accounts, selectedGames])

  function handleGameSelect(game: Game) {
    setSelectedGames(prev => [...prev, game])
    setSearchQuery('')
    setGameSuggestions([])
    setShowSuggestions(false)
  }

  function handleGameRemove(gameId: number) {
    setSelectedGames(prev => prev.filter(g => g.id !== gameId))
  }

  return (
    <>
      <Header onSearch={setSearchQuery} />
      
      {/* Game Search Section */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาเกม... (เช่น gta, spiderman)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(gameSuggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full bg-card-bg border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue"
          />
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && gameSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-card-bg border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {gameSuggestions.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleGameSelect(game)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary-bg transition-colors text-text-primary"
                >
                  {game.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Games Tags */}
        {selectedGames.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {selectedGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-sm"
                >
                  <span className="text-text-primary">{game.title}</span>
                  <button
                    type="button"
                    onClick={() => handleGameRemove(game.id)}
                    className="text-text-secondary hover:text-red-400 transition-colors font-bold text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show search results count */}
      {selectedGames.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-text-secondary">
            พบ <span className="text-accent-blue font-bold">{filteredAccounts.length}</span> ไอดี
            ที่มีเกม {selectedGames.map(g => g.title).join(', ')}
            {filteredAccounts.length === 0 && (
              <span className="block mt-2 text-sm">ลองค้นหาเกมอื่น</span>
            )}
          </p>
        </div>
      )}

      <AccountGrid
        accounts={filteredAccounts}
        prices={prices}
        contactSettings={contactSettings}
      />
    </>
  )
}
