/**
 * FILE: packages/shared/src/db/import-games.ts
 * PURPOSE: Import games from game-store-catalog folder to database
 *
 * USAGE: npm run db:import-games
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import fs from 'fs'
import path from 'path'
import pool from './client'

interface GameData {
  name: string
  image: string
  platforms: string[]
}

async function importGames(): Promise<void> {
  const conn = await pool.getConnection()
  
  try {
    console.log('🎮 Starting game import...\n')
    
    // Clear existing games first
    console.log('🗑️  Clearing existing games...')
    await conn.query('DELETE FROM games')
    console.log('✅ Cleared!\n')
    
    const catalogPath = path.join(process.cwd(), '..', '..', 'game-store-catalog')
    const platforms = ['ps4', 'ps5']
    
    let totalImported = 0
    let totalSkipped = 0
    let totalErrors = 0
    
    for (const platform of platforms) {
      const platformPath = path.join(catalogPath, platform)
      
      if (!fs.existsSync(platformPath)) {
        console.log(`⚠️  Platform folder not found: ${platform}`)
        continue
      }
      
      console.log(`📁 Processing ${platform.toUpperCase()} games...`)
      
      const files = fs.readdirSync(platformPath).filter(f => f.endsWith('.json'))
      
      for (const file of files) {
        const filePath = path.join(platformPath, file)
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8')
          const games: GameData[] = JSON.parse(fileContent)
          
          // Validate that games is an array
          if (!Array.isArray(games)) {
            console.error(`  ✗ ${file}: Not an array, skipping...`)
            continue
          }
          
          for (const game of games) {
            try {
              // Skip if missing required fields
              if (!game.name || !game.image || !game.platforms) {
                totalSkipped++
                continue
              }
              
              // Insert game (only name, image, platforms)
              await conn.query(
                `INSERT INTO games (title, image_url, thumbnail_url, genre) 
                 VALUES (?, ?, ?, ?)`,
                [
                  game.name,
                  game.image,
                  game.image, // Use same image for thumbnail
                  game.platforms.join(', ') // Store platforms in genre field (e.g. "PS4, PS5")
                ]
              )
              
              totalImported++
              
              if (totalImported % 500 === 0) {
                console.log(`  ✓ Imported ${totalImported} games...`)
              }
            } catch (error) {
              totalErrors++
              if (totalErrors <= 5) {
                console.error(`  ✗ Failed to import "${game.name}":`, error)
              }
            }
          }
        } catch (error) {
          console.error(`  ✗ Failed to read ${file}:`, error)
        }
      }
      
      console.log(`  ✅ Finished ${platform.toUpperCase()}\n`)
    }
    
    console.log('========================================')
    console.log(`✅ Import completed!`)
    console.log(`   Imported: ${totalImported} games`)
    console.log(`   Skipped:  ${totalSkipped} games (invalid data)`)
    if (totalErrors > 0) {
      console.log(`   Errors:   ${totalErrors} games (failed to import)`)
    }
    console.log('========================================')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  } finally {
    conn.release()
  }
}

importGames()
