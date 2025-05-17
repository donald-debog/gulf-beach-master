'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import WeddingTimeline from '@/components/WeddingTimeline'
import PhotoGallery from '@/components/PhotoGallery'
import GuestList from '@/components/GuestList'
import BudgetTracker from '@/components/BudgetTracker'
import WeddingClients from '@/components/WeddingClients'

interface Wedding {
  id: string
  title: string
  date: string
  venue: string
  description: string
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled'
  client_name: string
  client_email: string
  client_phone: string
  budget: number
  guest_count: number
  notes: string
  created_at: string
  updated_at: string
}

export default function WeddingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWedding()
  }, [params.id])

  const fetchWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setWedding(data)
    } catch (err) {
      console.error('Error fetching wedding:', err)
      setError('Failed to load wedding details')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!wedding) {
    return (
      <div className="p-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                Wedding not found
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{wedding.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(wedding.date).toLocaleDateString()} at {wedding.venue}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/weddings/${wedding.id}/edit`}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit Wedding
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Wedding Details</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Description</h4>
                      <p className="mt-1 text-sm text-gray-900">{wedding.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Status</h4>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{wedding.status}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Budget</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        ${wedding.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Guest Count</h4>
                      <p className="mt-1 text-sm text-gray-900">{wedding.guest_count}</p>
                    </div>
                    {wedding.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                        <p className="mt-1 text-sm text-gray-900">{wedding.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <WeddingClients weddingId={wedding.id} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <PhotoGallery weddingId={wedding.id} />
        </div>
        <div>
          <GuestList weddingId={wedding.id} />
        </div>
      </div>

      <div className="mt-8">
        <BudgetTracker weddingId={wedding.id} />
      </div>

      <div className="mt-8">
        <WeddingTimeline weddingId={wedding.id} />
      </div>
    </div>
  )
} 