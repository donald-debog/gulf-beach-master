'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your wedding content and client information',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold text-indigo-700">GBW Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Dashboard</Link>
          <Link href="/admin/weddings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Weddings</Link>
          <Link href="/admin/vendors" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Vendors</Link>
          <Link href="/admin/clients" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Clients</Link>
          <Link href="/admin/blog" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Blog</Link>
          <Link href="/admin/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Settings</Link>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 