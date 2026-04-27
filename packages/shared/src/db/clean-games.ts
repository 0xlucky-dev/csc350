/**
 * FILE: packages/shared/src/db/clean-games.ts
 * PURPOSE: Clean up duplicate games in database
 *          - Remove games with "Digital" suffix if non-Digital version exists
 *          - Remove duplicate game titles (keep only one)
 */

import pool from './client'

async function cleanGames() {
  const conn = await pool.getConnection()
  
  try {
    console.log('🧹 Starting game cleanup...\n')
    
    // 1. Find and remove "Digital" duplicates
    console.log('[1/3] Finding Digital duplicates...')
    const [digitalGames] = await conn.query<any[]>(
      `SELECT id, title FROM games WHERE title LIKE '% Digital' ORDER BY title`
    )
    
    let digitalRemoved = 0
    for (const game of digitalGames) {
      const baseTitle = game.title.replace(' Digital', '')
      const [baseGame] = await conn.query<any[]>(
        `SELECT id FROM games WHERE title = ? AND id != ?`,
        [baseTitle, game.id]
      )
      
      if (baseGame.length > 0) {
        // Base game exists, remove Digital version
        await conn.execute('DELETE FROM games WHERE id = ?', [game.id])
        console.log(`  ✓ Removed: ${game.title}`)
        digitalRemoved++
      }
    }
    console.log(`  → Removed ${digitalRemoved} Digital duplicates\n`)
    
    // 2. Find and remove exact duplicates
    console.log('[2/3] Finding exact duplicates...')
    const [duplicates] = await conn.query<any[]>(
      `SELECT title, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
       FROM games
       GROUP BY title
       HAVING count > 1
       ORDER BY count DESC, title`
    )
    
    let exactRemoved = 0
    for (const dup of duplicates) {
      const ids = dup.ids.split(',').map((id: string) => parseInt(id))
      const keepId = ids[0] // Keep first one
      const removeIds = ids.slice(1) // Remove rest
      
      for (const removeId of removeIds) {
        await conn.execute('DELETE FROM games WHERE id = ?', [removeId])
        exactRemoved++
      }
      console.log(`  ✓ Kept 1, removed ${removeIds.length}: ${dup.title}`)
    }
    console.log(`  → Removed ${exactRemoved} exact duplicates\n`)
    
    // 3. Show summary
    console.log('[3/3] Summary:')
    const [totalGames] = await conn.query<any[]>('SELECT COUNT(*) as count FROM games')
    console.log(`  → Total games remaining: ${totalGames[0].count}`)
    console.log(`  → Total removed: ${digitalRemoved + exactRemoved}`)
    
    console.log('\n✅ Game cleanup completed!')
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  } finally {
    conn.release()
    await pool.end()
  }
}

cleanGames()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
