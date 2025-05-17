import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Create your dream beach wedding with Gulf Beach Weddings. Expert planning and coordination services for your perfect day.',
  openGraph: {
    title: 'Gulf Beach Weddings - Your Dream Beach Wedding Awaits',
    description: 'Create your dream beach wedding with Gulf Beach Weddings. Expert planning and coordination services for your perfect day.',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-wedding.jpg"
            alt="Beautiful beach wedding setup"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Dream Beach Wedding Awaits
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Let us help you create the perfect beach wedding experience
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </section>

      {/* Featured Weddings */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Weddings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured wedding cards will be dynamically loaded */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-64">
                <Image
                  src="/images/featured-wedding-1.jpg"
                  alt="Featured wedding"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sarah & John's Beach Ceremony</h3>
                <p className="text-gray-600 mb-4">A beautiful sunset ceremony on the Gulf Coast</p>
                <Link
                  href="/weddings/sarah-john-2024"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Wedding →
                </Link>
              </div>
            </div>
            {/* Add more featured wedding cards */}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Planning</h3>
              <p className="text-gray-600">Complete wedding planning and coordination from start to finish</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Day-Of Coordination</h3>
              <p className="text-gray-600">Professional coordination services for your wedding day</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Venue Selection</h3>
              <p className="text-gray-600">Expert guidance in finding your perfect beach venue</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Let's create your perfect beach wedding together</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
} 