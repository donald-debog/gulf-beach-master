'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PlusIcon, XMarkIcon, PencilIcon, FunnelIcon, ArrowsUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
}

interface WeddingClientsProps {
  weddingId: string
}

type SortField = 'first_name' | 'last_name' | 'email' | 'status'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField
  direction: SortDirection
}

interface StatusCount {
  lead: number
  prospect: number
  client: number
  past: number
  total: number
}

const placeholderClients: Client[] = [
  {
    id: '1',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    status: 'client'
  },
  {
    id: '2',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'mchen@example.com',
    phone: '(555) 234-5678',
    status: 'lead'
  },
  {
    id: '3',
    first_name: 'Emma',
    last_name: 'Rodriguez',
    email: 'emma.r@example.com',
    phone: '(555) 345-6789',
    status: 'prospect'
  },
  {
    id: '4',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'jwilson@example.com',
    phone: '(555) 456-7890',
    status: 'past'
  }
]

const statusColors = {
  lead: 'bg-blue-100 text-blue-800',
  prospect: 'bg-yellow-100 text-yellow-800',
  client: 'bg-green-100 text-green-800',
  past: 'bg-gray-100 text-gray-800'
}

export default function WeddingClients({ weddingId }: WeddingClientsProps) {
  const [clients, setClients] = useState<Client[]>(placeholderClients)
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Client[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'first_name',
    direction: 'asc'
  })
  const [statusCounts, setStatusCounts] = useState<StatusCount>({
    lead: 0,
    prospect: 0,
    client: 0,
    past: 0,
    total: 0
  })
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'lead' as const
  })
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    filterAndSortClients()
  }, [clients, selectedStatus, sortConfig])

  useEffect(() => {
    updateStatusCounts()
  }, [clients])

  const updateStatusCounts = () => {
    const counts = clients.reduce((acc, client) => {
      acc[client.status as keyof StatusCount]++
      acc.total++
      return acc
    }, {
      lead: 0,
      prospect: 0,
      client: 0,
      past: 0,
      total: 0
    })
    setStatusCounts(counts)
  }

  const filterAndSortClients = () => {
    let filtered = selectedStatus === 'all'
      ? [...clients]
      : clients.filter(client => client.status === selectedStatus)

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field].toLowerCase()
      const bValue = b[sortConfig.field].toLowerCase()
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    setFilteredClients(filtered)
  }

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`first_name.ilike.%${value}%,last_name.ilike.%${value}%,email.ilike.%${value}%`)
        .is('wedding_id', null)
        .limit(5)

      if (error) throw error
      setSearchResults(data || [])
    } catch (err) {
      console.error('Error searching clients:', err)
      setError('Failed to search clients')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ wedding_id: weddingId })
        .eq('id', clientId)

      if (error) throw error

      // Add the client to the local state
      const addedClient = searchResults.find(c => c.id === clientId)
      if (addedClient) {
        setClients([...clients, addedClient])
      }

      // Clear search
      setSearchTerm('')
      setSearchResults([])
    } catch (err) {
      console.error('Error adding client to wedding:', err)
      setError('Failed to add client to wedding')
    }
  }

  const handleRemoveClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ wedding_id: null })
        .eq('id', clientId)

      if (error) throw error

      // Remove the client from the local state
      setClients(clients.filter(c => c.id !== clientId))
    } catch (err) {
      console.error('Error removing client from wedding:', err)
      setError('Failed to remove client from wedding')
    }
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...newClient, wedding_id: weddingId }])
        .select()
        .single()

      if (error) throw error

      // Add the new client to the local state
      if (data) {
        setClients([...clients, data])
      }

      // Reset form
      setNewClient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'lead'
      })
      setIsCreating(false)
    } catch (err) {
      console.error('Error creating client:', err)
      setError('Failed to create client')
    }
  }

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewClient(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClient = (client: Client) => {
    setEditingClientId(client.id)
    setEditingClient(client)
  }

  const handleEditClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingClient) {
      setEditingClient({ ...editingClient, [name]: value })
    }
  }

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClient) return

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          first_name: editingClient.first_name,
          last_name: editingClient.last_name,
          email: editingClient.email,
          phone: editingClient.phone,
          status: editingClient.status
        })
        .eq('id', editingClient.id)

      if (error) throw error

      // Update the client in the local state
      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c))
      setEditingClientId(null)
      setEditingClient(null)
    } catch (err) {
      console.error('Error updating client:', err)
      setError('Failed to update client')
    }
  }

  const handleCancelEdit = () => {
    setEditingClientId(null)
    setEditingClient(null)
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Linked Clients</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage clients associated with this wedding
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search clients..."
            className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => {
            if (status === 'total') return null
            return (
              <div
                key={status}
                className={`rounded-lg p-4 ${statusColors[status as keyof typeof statusColors]}`}
              >
                <div className="text-2xl font-semibold">{count}</div>
                <div className="text-sm capitalize">{status}</div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="all">All Statuses</option>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="client">Client</option>
              <option value="past">Past Client</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="sort-field" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort-field"
              value={sortConfig.field}
              onChange={(e) => handleSort(e.target.value as SortField)}
              className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredClients.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No clients found with the selected status.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <li key={client.id} className="p-6 hover:bg-gray-50">
                {editingClientId === client.id && editingClient ? (
                  <form onSubmit={handleUpdateClient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`edit-first_name-${client.id}`} className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id={`edit-first_name-${client.id}`}
                          required
                          value={editingClient.first_name}
                          onChange={handleEditClientChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-last_name-${client.id}`} className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id={`edit-last_name-${client.id}`}
                          required
                          value={editingClient.last_name}
                          onChange={handleEditClientChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`edit-email-${client.id}`} className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id={`edit-email-${client.id}`}
                        required
                        value={editingClient.email}
                        onChange={handleEditClientChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor={`edit-phone-${client.id}`} className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id={`edit-phone-${client.id}`}
                        value={editingClient.phone}
                        onChange={handleEditClientChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor={`edit-status-${client.id}`} className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        id={`edit-status-${client.id}`}
                        required
                        value={editingClient.status}
                        onChange={handleEditClientChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="client">Client</option>
                        <option value="past">Past Client</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </h4>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[client.status as keyof typeof statusColors]}`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-500">{client.email}</p>
                        {client.phone && (
                          <p className="text-sm text-gray-500">{client.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => handleEditClient(client)}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveClient(client.id)}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create Client Form */}
      {isCreating && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Client</h3>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    required
                    value={newClient.first_name}
                    onChange={handleNewClientChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    required
                    value={newClient.last_name}
                    onChange={handleNewClientChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={newClient.email}
                  onChange={handleNewClientChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={newClient.phone}
                  onChange={handleNewClientChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  value={newClient.status}
                  onChange={handleNewClientChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="client">Client</option>
                  <option value="past">Past Client</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 