'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import EditorJSRenderer from 'editorjs-react-renderer'
import Image from 'next/image'
import { CalendarIcon, MapPinIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon, PhotoIcon, HeartIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Metadata, ResolvingMetadata } from 'next'

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
  content: any
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

const customBlock = {
  image: ({ data }: any) => (
    <div className="my-8 flex flex-col items-center">
      {data.file && data.file.url && (
        <Image
          src={data.file.url}
          alt={data.caption || 'Wedding image'}
          width={800}
          height={500}
          className="rounded-xl shadow-lg border border-indigo-100 max-w-full h-auto"
        />
      )}
      {data.caption && (
        <div className="text-sm text-indigo-700 mt-3 italic bg-indigo-50 px-3 py-1 rounded-lg shadow-inner">{data.caption}</div>
      )}
    </div>
  ),
  gallery: ({ data }: any) => (
    <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {data.images && data.images.map((img: any, idx: number) => (
        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-indigo-100 shadow-md">
          <Image
            src={img.url}
            alt={img.caption || `Gallery image ${idx + 1}`}
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
          {img.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 text-center rounded-b-xl">{img.caption}</div>
          )}
        </div>
      ))}
    </div>
  ),
}

const blockStyle = {
  paragraph: 'my-4 text-lg text-gray-800',
  header: {
    1: 'my-8 text-4xl font-extrabold text-indigo-800',
    2: 'my-6 text-3xl font-bold text-indigo-700',
    3: 'my-4 text-2xl font-semibold text-indigo-600',
    4: 'my-3 text-xl font-semibold text-indigo-500',
    5: 'my-2 text-lg font-semibold text-indigo-400',
    6: 'my-2 text-base font-semibold text-indigo-300',
  },
  list: 'my-4 pl-6 text-base text-gray-700 list-disc',
  quote: 'my-8 border-l-4 border-indigo-400 pl-6 italic text-indigo-700 bg-indigo-50 py-3 rounded-r-lg',
  code: 'my-4 bg-gray-900 text-green-300 font-mono text-sm rounded-lg p-4 overflow-x-auto',
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  // Fetch wedding data
  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!wedding) {
    return {
      title: 'Wedding Not Found - Gulf Beach Weddings',
      description: 'The requested wedding microsite could not be found.',
    };
  }

  // Get the first image URL from the content if available
  let imageUrl = '';
  try {
    const content = wedding.content && typeof wedding.content === 'string'
      ? JSON.parse(wedding.content)
      : wedding.content;
    
    if (content?.blocks) {
      const imageBlock = content.blocks.find((block: any) => block.type === 'image');
      if (imageBlock?.data?.file?.url) {
        imageUrl = imageBlock.data.file.url;
      }
    }
  } catch (e) {
    console.error('Error parsing wedding content:', e);
  }

  return {
    title: `${wedding.title} - Gulf Beach Weddings`,
    description: wedding.description || `Wedding details for ${wedding.title}`,
    openGraph: {
      title: `${wedding.title} - Gulf Beach Weddings`,
      description: wedding.description || `Wedding details for ${wedding.title}`,
      type: 'website',
      url: `https://gulfbeachweddings.com/weddings/${slug}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: wedding.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wedding.title} - Gulf Beach Weddings`,
      description: wedding.description || `Wedding details for ${wedding.title}`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
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
  }, [params.slug])

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
        .eq('slug', params.slug)
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

  let editorContent = null
  try {
    editorContent = wedding.content && typeof wedding.content === 'string'
      ? JSON.parse(wedding.content)
      : wedding.content
  } catch (e) {
    editorContent = null
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
            <p className="text-gray-600">{wedding.description}</p>
          </div>

          {/* Editor.js Content */}
          {editorContent && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <EditorJSRenderer data={editorContent} customBlock={customBlock} blockStyle={blockStyle} />
            </div>
          )}

          {/* Timeline */}
          {wedding.timeline && wedding.timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wedding Timeline</h2>
              <div className="space-y-4">
                {wedding.timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                      {formatTime(event.time)}
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {wedding.photos && wedding.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wedding.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setSelectedPhoto(photo.url)}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Wedding photo'}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Guest List */}
          {wedding.guest_list && wedding.guest_list.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guest List</h2>
              <div className="space-y-4">
                {wedding.guest_list.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{guest.name}</p>
                      <p className="text-sm text-gray-500">{guest.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRSVP(guest.id, 'confirmed')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          guest.rsvp_status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800'
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRSVP(guest.id, 'declined')}
                        className={`px-3 py-1 rounded-full text-sm ${
                          guest.rsvp_status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-800'
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wedding Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wedding Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-gray-600">{wedding.guest_count} Guests</span>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-gray-600">Budget: ${wedding.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-gray-600">{formatTime(wedding.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <Image
              src={selectedPhoto}
              alt="Selected wedding photo"
              width={1200}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
} 