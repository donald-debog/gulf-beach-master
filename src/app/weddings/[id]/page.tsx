'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { CalendarIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon, PhotoIcon, HeartIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Wedding {
  id: string
  title: string
  date: string
  venue: string
  description: string
  status: string
  budget: number
  guest_count: number
  notes: string
  timeline: {
    time: string
    event: string
  }[]
  photos: {
    id: string
    url: string
    caption: string
  }[]
  guest_list: {
    id: string
    name: string
    email: string
    rsvp_status: 'pending' | 'confirmed' | 'declined'
    plus_one: boolean
  }[]
}

export default function WeddingDetailPage() {
  const params = useParams()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    fetchWedding()
  }, [params.id])

  useEffect(() => {
    if (wedding?.date) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const weddingDate = new Date(wedding.date).getTime()
        const distance = weddingDate - now

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [wedding?.date])

  const fetchWedding = async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('slug', params.id)
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

  const handleRSVP = async (guestId: string, status: 'confirmed' | 'declined') => {
    try {
      const { error } = await supabase
        .from('guest_list')
        .update({ rsvp_status: status })
        .eq('id', guestId)

      if (error) throw error

      // Update local state
      setWedding(prev => {
        if (!prev) return null
        return {
          ...prev,
          guest_list: prev.guest_list.map(guest =>
            guest.id === guestId ? { ...guest, rsvp_status: status } : guest
          )
        }
      })
    } catch (err) {
      console.error('Error updating RSVP:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (error || !wedding) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Wedding Not Found</h2>
        <p className="mt-2 text-gray-500">We couldn't find the wedding you're looking for.</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 mb-8">
        <div className="absolute inset-0 bg-black opacity-20" />
        <div className="relative">
          <h1 className="text-4xl font-bold mb-4">{wedding.title}</h1>
          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              <span>{formatDate(wedding.date)}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-6 w-6 mr-2" />
              <span>{wedding.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Counting Down to Our Special Day</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-600">{timeLeft.days}</div>
            <div className="text-sm text-gray-500">Days</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-600">{timeLeft.hours}</div>
            <div className="text-sm text-gray-500">Hours</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-600">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-500">Minutes</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-600">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-500">Seconds</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About the Wedding</h2>
            <p className="text-gray-600 whitespace-pre-line">{wedding.description}</p>
          </div>

          {/* Photo Gallery */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {wedding.photos?.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedPhoto(photo.url)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wedding Timeline</h2>
            <div className="space-y-4">
              {wedding.timeline?.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 font-medium">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guest List</h2>
            <div className="space-y-4">
              {wedding.guest_list?.map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{guest.name}</div>
                    <div className="text-sm text-gray-500">{guest.email}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {guest.rsvp_status}
                    </span>
                    {guest.plus_one && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        +1
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Wedding Details</h2>
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Date & Time</div>
                  <div>{formatDate(wedding.date)} at {formatTime(wedding.date)}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Venue</div>
                  <div>{wedding.venue}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Guest Count</div>
                  <div>{wedding.guest_count} guests</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Budget</div>
                  <div>${wedding.budget.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Status</div>
                  <div className="capitalize">{wedding.status}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">RSVP</h2>
            <p className="text-gray-600 mb-4">Please let us know if you can make it to our special day!</p>
            <div className="space-y-4">
              {wedding.guest_list?.map((guest) => (
                <div key={guest.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">{guest.name}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRSVP(guest.id, 'confirmed')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                        guest.rsvp_status === 'confirmed'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                      }`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRSVP(guest.id, 'declined')}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                        guest.rsvp_status === 'declined'
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'
                      }`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {wedding.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
              <p className="text-gray-600 whitespace-pre-line">{wedding.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Selected photo"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
} 