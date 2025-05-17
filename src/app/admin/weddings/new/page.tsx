'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

interface Vendor {
  id: string
  name: string
  category: string
}

interface WeddingFormData {
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
  vendor_ids: string[]
}

export default function AddWeddingPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [formData, setFormData] = useState<WeddingFormData>({
    title: '',
    date: '',
    venue: '',
    description: '',
    status: 'planning',
    client_name: '',
    client_email: '',
    client_phone: '',
    budget: 0,
    guest_count: 0,
    notes: '',
    vendor_ids: [],
  })

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, category')
        .order('name')
      
      if (error) throw error
      setVendors(data || [])
    } catch (err) {
      console.error('Error fetching vendors:', err)
      setError('Failed to load vendors')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      // First, create the wedding
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .insert([{
          title: formData.title,
          date: formData.date,
          venue: formData.venue,
          description: formData.description,
          status: formData.status,
          client_name: formData.client_name,
          client_email: formData.client_email,
          client_phone: formData.client_phone,
          budget: formData.budget,
          guest_count: formData.guest_count,
          notes: formData.notes,
        }])
        .select()
        .single()

      if (weddingError) throw weddingError

      // Then, create wedding_vendor relationships
      if (formData.vendor_ids.length > 0) {
        const weddingVendors = formData.vendor_ids.map(vendor_id => ({
          wedding_id: wedding.id,
          vendor_id: vendor_id
        }))

        const { error: vendorError } = await supabase
          .from('wedding_vendors')
          .insert(weddingVendors)

        if (vendorError) throw vendorError
      }

      router.push('/admin/weddings')
    } catch (err) {
      console.error('Error creating wedding:', err)
      setError('Failed to add wedding')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' || name === 'guest_count' ? Number(value) : value,
    }))
  }

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    setFormData(prev => ({
      ...prev,
      vendor_ids: selectedOptions
    }))
  }

  // Group vendors by category
  const vendorsByCategory = vendors.reduce((acc, vendor) => {
    if (!acc[vendor.category]) {
      acc[vendor.category] = []
    }
    acc[vendor.category].push(vendor)
    return acc
  }, {} as Record<string, Vendor[]>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Wedding</h1>
      </div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Wedding Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Basic information about the wedding.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="planning">Planning</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                      Venue
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="venue"
                        id="venue"
                        required
                        value={formData.venue}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Vendors
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select the vendors for this wedding.
                  </p>
                </div>
                <div className="mt-6">
                  <label htmlFor="vendors" className="block text-sm font-medium text-gray-700">
                    Select Vendors
                  </label>
                  <div className="mt-1">
                    <select
                      id="vendors"
                      name="vendors"
                      multiple
                      value={formData.vendor_ids}
                      onChange={handleVendorChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      size={6}
                    >
                      {Object.entries(vendorsByCategory).map(([category, categoryVendors]) => (
                        <optgroup key={category} label={category}>
                          {categoryVendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      Hold Ctrl (Windows) or Command (Mac) to select multiple vendors.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Client Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Contact details for the wedding client.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                      Client Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="client_name"
                        id="client_name"
                        required
                        value={formData.client_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="client_email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="client_email"
                        id="client_email"
                        required
                        value={formData.client_email}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="client_phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="client_phone"
                        id="client_phone"
                        required
                        value={formData.client_phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                      Budget
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="budget"
                        id="budget"
                        min="0"
                        step="0.01"
                        required
                        value={formData.budget}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="guest_count" className="block text-sm font-medium text-gray-700">
                      Guest Count
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="guest_count"
                        id="guest_count"
                        min="0"
                        required
                        value={formData.guest_count}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/admin/weddings')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 