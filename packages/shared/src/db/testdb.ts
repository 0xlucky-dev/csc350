/**
 * FILE: packages/shared/src/db/testdb.ts
 * PURPOSE: Create 20 mock accounts with real games from database
 */

import pool from './client'

const ACCOUNTS: Array<{
  num: number
  priceOwn: number
  priceShop: number
  pricePs4: number
  statusOwn: 'available' | 'rented'
  statusShop: 'available' | 'rented'
  statusPs4: 'available' | 'rented'
  daysOwn: number
  daysShop: number
  daysPs4: number
  games: string[]
}> = [
  { num: 1,  priceOwn: 450, priceShop: 300, pricePs4: 250, statusOwn: 'rented',    statusShop: 'available', statusPs4: 'available', daysOwn: 25, daysShop: 0,  daysPs4: 0,  games: ["Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Baldur's Gate 3", "Final Fantasy 7 Rebirth"] },
  { num: 2,  priceOwn: 500, priceShop: 350, pricePs4: 280, statusOwn: 'available', statusShop: 'rented',    statusPs4: 'available', daysOwn: 0,  daysShop: 18, daysPs4: 0,  games: ["Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Death Stranding 2: On the Beach", "Clair Obscur: Expedition 33", "Metaphor: ReFantazio", "Dragon Age: The Veilguard", "Kingdom Come: Deliverance 2"] },
  { num: 3,  priceOwn: 550, priceShop: 380, pricePs4: 300, statusOwn: 'available', statusShop: 'available', statusPs4: 'available', daysOwn: 0,  daysShop: 0,  daysPs4: 0,  games: ["Resident Evil 4", "Resident Evil Requiem", "Demon's Souls", "Returnal", "Helldivers 2", "Gran Turismo 7", "Horizon Forbidden West", "Astro Bot", "Marvel's Spider-Man: Miles Morales", "Grand Theft Auto V", "Tony Hawk's Pro Skater 3 + 4", "Arc Raiders"] },
  { num: 4,  priceOwn: 420, priceShop: 280, pricePs4: 220, statusOwn: 'available', statusShop: 'available', statusPs4: 'rented',    daysOwn: 0,  daysShop: 0,  daysPs4: 22, games: ["The Elder Scrolls 4: Oblivion Remastered", "Baldur's Gate 3", "Metaphor: ReFantazio", "Dragon Age: The Veilguard", "Monster Hunter Stories 3: Twisted Reflection", "Final Fantasy 7 Rebirth"] },
  { num: 5,  priceOwn: 520, priceShop: 360, pricePs4: 290, statusOwn: 'rented',    statusShop: 'rented',    statusPs4: 'available', daysOwn: 15, daysShop: 20, daysPs4: 0,  games: ["Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Resident Evil 4", "Demon's Souls", "Returnal", "Helldivers 2"] },
  { num: 6,  priceOwn: 400, priceShop: 270, pricePs4: 210, statusOwn: 'rented',    statusShop: 'rented',    statusPs4: 'rented',    daysOwn: 28, daysShop: 25, daysPs4: 30, games: ["Resident Evil 4", "Resident Evil Requiem", "Demon's Souls", "Returnal"] },
  { num: 7,  priceOwn: 480, priceShop: 320, pricePs4: 260, statusOwn: 'available', statusShop: 'available', statusPs4: 'available', daysOwn: 0,  daysShop: 0,  daysPs4: 0,  games: ["Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Death Stranding 2: On the Beach", "Marvel's Spider-Man 2", "God of War Ragnarök", "Elden Ring"] },
  { num: 8,  priceOwn: 600, priceShop: 420, pricePs4: 340, statusOwn: 'rented',    statusShop: 'available', statusPs4: 'available', daysOwn: 17, daysShop: 0,  daysPs4: 0,  games: ["Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Baldur's Gate 3", "Final Fantasy 7 Rebirth", "Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Death Stranding 2: On the Beach", "Clair Obscur: Expedition 33", "Metaphor: ReFantazio", "Dragon Age: The Veilguard", "Kingdom Come: Deliverance 2", "Resident Evil 4", "Demon's Souls"] },
  { num: 9,  priceOwn: 380, priceShop: 250, pricePs4: 190, statusOwn: 'available', statusShop: 'available', statusPs4: 'rented',    daysOwn: 0,  daysShop: 0,  daysPs4: 24, games: ["Grand Theft Auto V", "Marvel's Spider-Man: Miles Morales", "Astro Bot"] },
  { num: 10, priceOwn: 510, priceShop: 340, pricePs4: 270, statusOwn: 'available', statusShop: 'rented',    statusPs4: 'available', daysOwn: 0,  daysShop: 19, daysPs4: 0,  games: ["The Elder Scrolls 4: Oblivion Remastered", "Baldur's Gate 3", "Metaphor: ReFantazio", "Dragon Age: The Veilguard", "Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Ghost of Yōtei", "Assassin's Creed Shadows"] },
  { num: 11, priceOwn: 540, priceShop: 370, pricePs4: 295, statusOwn: 'available', statusShop: 'available', statusPs4: 'available', daysOwn: 0,  daysShop: 0,  daysPs4: 0,  games: ["Gran Turismo 7", "Helldivers 2", "Returnal", "Horizon Forbidden West", "Death Stranding 2: On the Beach", "Marvel's Spider-Man 2", "Astro Bot", "Tony Hawk's Pro Skater 3 + 4", "Arc Raiders", "Pragmata", "Hollow Knight Silksong"] },
  { num: 12, priceOwn: 430, priceShop: 290, pricePs4: 230, statusOwn: 'rented',    statusShop: 'available', statusPs4: 'rented',    daysOwn: 21, daysShop: 0,  daysPs4: 26, games: ["Romeo is a Dead Man", "Dispatch", "Sword of the Sea", "Ghost of Yōtei", "Clair Obscur: Expedition 33"] },
  { num: 13, priceOwn: 490, priceShop: 330, pricePs4: 265, statusOwn: 'available', statusShop: 'rented',    statusPs4: 'available', daysOwn: 0,  daysShop: 16, daysPs4: 0,  games: ["Helldivers 2", "Arc Raiders", "Monster Hunter Wilds", "Assassin's Creed Shadows", "Ghost of Yōtei", "Marvel's Spider-Man 2", "God of War Ragnarök", "Elden Ring"] },
  { num: 14, priceOwn: 460, priceShop: 310, pricePs4: 245, statusOwn: 'available', statusShop: 'available', statusPs4: 'available', daysOwn: 0,  daysShop: 0,  daysPs4: 0,  games: ["Sword of the Sea", "Hollow Knight Silksong", "Horizon Forbidden West", "Death Stranding 2: On the Beach", "Astro Bot", "Pragmata"] },
  { num: 15, priceOwn: 570, priceShop: 400, pricePs4: 320, statusOwn: 'rented',    statusShop: 'available', statusPs4: 'available', daysOwn: 23, daysShop: 0,  daysPs4: 0,  games: ["Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Baldur's Gate 3", "Final Fantasy 7 Rebirth", "The Elder Scrolls 4: Oblivion Remastered", "Metaphor: ReFantazio", "Dragon Age: The Veilguard", "Kingdom Come: Deliverance 2", "Resident Evil 4", "Demon's Souls", "Returnal", "Helldivers 2"] },
  { num: 16, priceOwn: 390, priceShop: 260, pricePs4: 200, statusOwn: 'available', statusShop: 'available', statusPs4: 'rented',    daysOwn: 0,  daysShop: 0,  daysPs4: 27, games: ["Gran Turismo 7", "Tony Hawk's Pro Skater 3 + 4", "Astro Bot", "Marvel's Spider-Man: Miles Morales"] },
  { num: 17, priceOwn: 530, priceShop: 350, pricePs4: 280, statusOwn: 'rented',    statusShop: 'rented',    statusPs4: 'rented',    daysOwn: 2,  daysShop: 3,  daysPs4: 1,  games: ["Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Death Stranding 2: On the Beach", "Clair Obscur: Expedition 33", "Marvel's Spider-Man 2", "God of War Ragnarök", "Elden Ring", "Baldur's Gate 3", "Final Fantasy 7 Rebirth"] },
  { num: 18, priceOwn: 470, priceShop: 315, pricePs4: 250, statusOwn: 'available', statusShop: 'rented',    statusPs4: 'available', daysOwn: 0,  daysShop: 20, daysPs4: 0,  games: ["Resident Evil 4", "Resident Evil Requiem", "Demon's Souls", "Returnal", "Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2"] },
  { num: 19, priceOwn: 580, priceShop: 410, pricePs4: 330, statusOwn: 'available', statusShop: 'available', statusPs4: 'available', daysOwn: 0,  daysShop: 0,  daysPs4: 0,  games: ["Elden Ring", "God of War Ragnarök", "Marvel's Spider-Man 2", "Baldur's Gate 3", "Final Fantasy 7 Rebirth", "Ghost of Yōtei", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Gran Turismo 7", "Helldivers 2", "Horizon Forbidden West", "Death Stranding 2: On the Beach", "Astro Bot", "Grand Theft Auto V"] },
  { num: 20, priceOwn: 520, priceShop: 360, pricePs4: 290, statusOwn: 'rented',    statusShop: 'rented',    statusPs4: 'available', daysOwn: 29, daysShop: 30, daysPs4: 0,  games: ["Romeo is a Dead Man", "Dispatch", "Sword of the Sea", "Ghost of Yōtei", "Clair Obscur: Expedition 33", "Assassin's Creed Shadows", "Monster Hunter Wilds", "Death Stranding 2: On the Beach", "Kingdom Come: Deliverance 2"] },
]

async function run() {
  const conn = await pool.getConnection()
  try {
    // Clear
    await conn.query('DELETE FROM account_games')
    await conn.query('DELETE FROM accounts')
    console.log('✅ Cleared existing accounts')

    // Load all game titles → id map
    const [rows] = await conn.query('SELECT id, title FROM games') as any[]
    const gameMap = new Map<string, number>()
    for (const r of rows) gameMap.set(r.title, r.id)
    console.log(`📦 Loaded ${gameMap.size} games from database`)

    let created = 0
    for (const a of ACCOUNTS) {
      const untilOwn  = a.statusOwn  === 'rented' ? `DATE_ADD(NOW(), INTERVAL ${a.daysOwn} DAY)`  : 'NULL'
      const untilShop = a.statusShop === 'rented' ? `DATE_ADD(NOW(), INTERVAL ${a.daysShop} DAY)` : 'NULL'
      const untilPs4  = a.statusPs4  === 'rented' ? `DATE_ADD(NOW(), INTERVAL ${a.daysPs4} DAY)`  : 'NULL'

      const [res] = await conn.query(`
        INSERT INTO accounts (
          account_number, price_ps5_own, price_ps5_shop, price_ps4,
          status_ps5_own, status_ps5_shop, status_ps4,
          rented_until_ps5_own, rented_until_ps5_shop, rented_until_ps4
        ) VALUES (
          '${a.num}', ${a.priceOwn}, ${a.priceShop}, ${a.pricePs4},
          '${a.statusOwn}', '${a.statusShop}', '${a.statusPs4}',
          ${untilOwn}, ${untilShop}, ${untilPs4}
        )
      `) as any[]

      const accountId = res.insertId
      let gamesAdded = 0

      for (const title of a.games) {
        const gameId = gameMap.get(title)
        if (!gameId) { console.warn(`  ⚠️  ไม่พบเกม: "${title}"`) ; continue }
        await conn.query(
          'INSERT IGNORE INTO account_games (account_id, game_id) VALUES (?, ?)',
          [accountId, gameId]
        )
        gamesAdded++
      }

      console.log(`  ✅ Account ${a.num}: ${gamesAdded} games`)
      created++
    }

    const [stats] = await conn.query(`
      SELECT 
        COUNT(*) as total,
        SUM(status_ps5_own='rented' OR status_ps5_shop='rented' OR status_ps4='rented') as rented
      FROM accounts
    `) as any[]

    console.log(`\n🎮 สร้างสำเร็จ ${created}/20 accounts`)
    console.log(`📊 Total: ${stats[0].total} | Rented: ${stats[0].rented} | Available: ${stats[0].total - stats[0].rented}`)
    process.exit(0)
  } catch (e) {
    console.error('❌ Error:', e)
    process.exit(1)
  } finally {
    conn.release()
  }
}

run()
