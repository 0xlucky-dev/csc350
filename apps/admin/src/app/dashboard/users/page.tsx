'use client'

/**
 * FILE: apps/admin/src/app/dashboard/users/page.tsx
 * PURPOSE: User management page — เพิ่ม/แก้ไข/ลบ admin users
 *   - super_admin: จัดการได้ทุก user
 *   - user: แก้ไขได้แค่ password ตัวเอง
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 */

import { useEffect, useState } from 'react'

interface AdminUser {
  id: number
  username: string
  role: 'super_admin' | 'user'
  created_at: string
}

interface Me {
  sub: number
  username: string
  role: 'super_admin' | 'user'
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // modal state
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState<AdminUser | null>(null)
  const [showDelete, setShowDelete] = useState<AdminUser | null>(null)

  // form state
  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [formRole, setFormRole] = useState<'super_admin' | 'user'>('user')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // get current user from JWT cookie
  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('admin_token='))
    if (cookie) {
      try {
        const token = cookie.split('=')[1]
        const payload = JSON.parse(atob(token.split('.')[1]))
        setMe({ sub: payload.sub, username: payload.username, role: payload.role })
      } catch {}
    }
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data.data)
    } else {
      setError('ไม่มีสิทธิ์เข้าถึง')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (me?.role === 'super_admin') fetchUsers()
    else setLoading(false)
  }, [me])

  const openEdit = (user: AdminUser) => {
    setShowEdit(user)
    setFormPassword('')
    setFormRole(user.role)
    setFormError('')
  }

  const openAdd = () => {
    setShowAdd(true)
    setFormUsername('')
    setFormPassword('')
    setFormRole('user')
    setFormError('')
  }

  const handleAdd = async () => {
    if (!formUsername || !formPassword) { setFormError('กรุณากรอกข้อมูลให้ครบ'); return }
    setSaving(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: formUsername, password: formPassword, role: formRole }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setFormError(data.error ?? 'เกิดข้อผิดพลาด'); return }
    setShowAdd(false)
    fetchUsers()
  }

  const handleEdit = async () => {
    if (!formPassword && me?.role !== 'super_admin') { setFormError('กรุณากรอก password ใหม่'); return }
    setSaving(true)
    const body: any = {}
    if (formPassword) body.password = formPassword
    if (me?.role === 'super_admin') body.role = formRole

    const res = await fetch(`/api/admin/users/${showEdit!.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setFormError(data.error ?? 'เกิดข้อผิดพลาด'); return }
    setShowEdit(null)
    if (me?.role === 'super_admin') fetchUsers()
  }

  const handleDelete = async () => {
    setSaving(true)
    await fetch(`/api/admin/users/${showDelete!.id}`, { method: 'DELETE' })
    setSaving(false)
    setShowDelete(null)
    fetchUsers()
  }

  // ถ้าไม่ใช่ super_admin แสดงแค่ฟอร์มเปลี่ยน password ตัวเอง
  if (me && me.role !== 'super_admin') {
    return (
      <div className="p-6 max-w-md">
        <h1 className="text-xl font-bold text-text-primary mb-6">เปลี่ยนรหัสผ่าน</h1>
        <div className="bg-card-bg border border-border rounded-xl p-6 space-y-4">
          <p className="text-text-secondary text-sm">บัญชี: <span className="text-text-primary font-medium">{me.username}</span></p>
          <div>
            <label className="block text-sm text-text-secondary mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              value={formPassword}
              onChange={e => setFormPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent-blue"
              placeholder="กรอกรหัสผ่านใหม่"
            />
          </div>
          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          <button
            onClick={async () => {
              if (!formPassword) { setFormError('กรุณากรอกรหัสผ่านใหม่'); return }
              setSaving(true)
              const res = await fetch(`/api/admin/users/${me.sub}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: formPassword }),
              })
              setSaving(false)
              if (res.ok) { setFormPassword(''); setFormError(''); alert('เปลี่ยนรหัสผ่านสำเร็จ') }
              else setFormError('เกิดข้อผิดพลาด')
            }}
            disabled={saving}
            className="w-full bg-accent-blue hover:bg-blue-600 text-white rounded-lg py-2 font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">จัดการผู้ใช้</h1>
        <button
          onClick={openAdd}
          className="bg-accent-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + เพิ่มผู้ใช้
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary">กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="bg-card-bg border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="text-left px-4 py-3">Username</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">สร้างเมื่อ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-background/50">
                  <td className="px-4 py-3 text-text-primary font-medium">
                    {user.username}
                    {user.id === me?.sub && <span className="ml-2 text-xs text-accent-blue">(คุณ)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'super_admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role === 'super_admin' ? 'Super Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-accent-blue hover:underline text-xs"
                      >
                        แก้ไข
                      </button>
                      {user.id !== me?.sub && (
                        <button
                          onClick={() => setShowDelete(user)}
                          className="text-red-400 hover:underline text-xs"
                        >
                          ลบ
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add User */}
      {showAdd && (
        <Modal title="เพิ่มผู้ใช้ใหม่" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <Field label="Username">
              <input type="text" value={formUsername} onChange={e => setFormUsername(e.target.value)}
                className={inputCls} placeholder="กรอก username" />
            </Field>
            <Field label="Password">
              <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)}
                className={inputCls} placeholder="กรอก password" />
            </Field>
            <Field label="Role">
              <select value={formRole} onChange={e => setFormRole(e.target.value as any)} className={inputCls}>
                <option value="user">User</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </Field>
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <button onClick={handleAdd} disabled={saving} className={btnCls}>
              {saving ? 'กำลังบันทึก...' : 'เพิ่มผู้ใช้'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Edit User */}
      {showEdit && (
        <Modal title={`แก้ไข: ${showEdit.username}`} onClose={() => setShowEdit(null)}>
          <div className="space-y-3">
            <Field label="Password ใหม่ (เว้นว่างถ้าไม่เปลี่ยน)">
              <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)}
                className={inputCls} placeholder="กรอก password ใหม่" />
            </Field>
            <Field label="Role">
              <select value={formRole} onChange={e => setFormRole(e.target.value as any)} className={inputCls}>
                <option value="user">User</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </Field>
            {formError && <p className="text-red-400 text-sm">{formError}</p>}
            <button onClick={handleEdit} disabled={saving} className={btnCls}>
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Delete Confirm */}
      {showDelete && (
        <Modal title="ยืนยันการลบ" onClose={() => setShowDelete(null)}>
          <p className="text-text-secondary mb-4">ต้องการลบ <span className="text-text-primary font-medium">{showDelete.username}</span> ใช่ไหม?</p>
          <div className="flex gap-3">
            <button onClick={() => setShowDelete(null)} className="flex-1 border border-border rounded-lg py-2 text-text-secondary hover:bg-card-bg transition-colors">
              ยกเลิก
            </button>
            <button onClick={handleDelete} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 font-medium transition-colors disabled:opacity-50">
              {saving ? 'กำลังลบ...' : 'ลบ'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent-blue'
const btnCls = 'w-full bg-accent-blue hover:bg-blue-600 text-white rounded-lg py-2 font-medium transition-colors disabled:opacity-50'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-1">{label}</label>
      {children}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-secondary-bg border border-border rounded-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
