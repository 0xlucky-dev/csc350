# 🔧 แก้ปัญหา MySQL บน Ubuntu 24.04

## ปัญหาที่เจอ:
1. MySQL บน Ubuntu 24.04 ใช้ `auth_socket` plugin → user `root` ไม่มี password
2. Node.js พยายามเชื่อมต่อผ่าน IPv6 (::1) แทน IPv4 (127.0.0.1)

## วิธีแก้:

### 1. สร้าง MySQL user ใหม่ (ทำแล้ว ✅)
```bash
sudo mysql -e "CREATE USER IF NOT EXISTS 'ninja_shop'@'localhost' IDENTIFIED BY 'ninja_shop_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ninja_shop.* TO 'ninja_shop'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 2. แก้ IPv6 issue (ต้องทำ!)
```bash
sudo nano /etc/hosts
```

แก้บรรทัดนี้:
```
::1     localhost ip6-localhost ip6-loopback
```

เป็น (เพิ่ม # ข้างหน้า):
```
#::1     localhost ip6-localhost ip6-loopback
```

บันทึกแล้วออก (Ctrl+X, Y, Enter)

### 3. อัพเดท .env บนเซิร์ฟเวอร์
```bash
cd ~/csc350
nano .env
```

แก้เป็น:
```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=ninja_shop
DB_PASSWORD=ninja_shop_password
DB_NAME=ninja_shop

# JWT
JWT_SECRET=change-this-to-a-random-secret-in-production

# Internal URL สำหรับ server-side fetch
INTERNAL_BASE_URL=http://localhost:7000
```

บันทึกแล้วออก (Ctrl+X, Y, Enter)

### 4. ทดสอบ seed database
```bash
npm run db:seed --workspace=@ninja-shop/shared
```

ถ้าสำเร็จ จะเห็น:
```
✅ Seeded rental_prices
✅ Seeded admin_users
✅ Seeded settings
🎉 Seed completed successfully!
```

### 5. Import games
```bash
npm run db:import-games --workspace=@ninja-shop/shared
```

### 6. Clean duplicate games
```bash
npm run db:clean-games --workspace=@ninja-shop/shared
```

### 7. Start dev servers
```bash
npm run dev
```

## ตรวจสอบว่าแก้สำเร็จ:
```bash
# ตรวจสอบ MySQL user
sudo mysql -e "SELECT user, host, plugin FROM mysql.user WHERE user='ninja_shop';"

# ควรเห็น:
# +------------+-----------+-----------------------+
# | user       | host      | plugin                |
# +------------+-----------+-----------------------+
# | ninja_shop | localhost | caching_sha2_password |
# +------------+-----------+-----------------------+

# ตรวจสอบ /etc/hosts
cat /etc/hosts | grep localhost

# ควรเห็น:
# 127.0.0.1 localhost
# #::1     localhost ip6-localhost ip6-loopback  ← มี # ข้างหน้า
```

## หมายเหตุ:
- ✅ `setup.sh` อัพเดทแล้ว (จะทำทุกอย่างอัตโนมัติในครั้งถัดไป)
- ✅ `.env.example` อัพเดทแล้ว (ใช้ user ใหม่)
- ⚠️ ครั้งนี้ต้องทำ manual เพราะ setup.sh รันไปแล้ว
