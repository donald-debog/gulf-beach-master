import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">Gulf Beach</Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/packages" className="text-gray-700 hover:text-indigo-600 transition">Packages</Link>
              <Link href="/weddings" className="text-gray-700 hover:text-indigo-600 transition">Weddings</Link>
              <Link href="/blog" className="text-gray-700 hover:text-indigo-600 transition">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</Link>
            </div>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button could go here */}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 to-blue-400 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">Gulf Beach Weddings</h1>
          <p className="text-lg sm:text-xl mb-8 drop-shadow">Beautiful, memorable weddings on the Gulf Coast. Explore our packages, real weddings, and more.</p>
          <Link href="/packages">
            <span className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-50 transition">View Packages</span>
          </Link>
        </div>
        {/* Optional: Add a subtle background image or overlay */}
        <div className="absolute inset-0 bg-[url('/beach-hero.jpg')] bg-cover bg-center opacity-20 z-0" aria-hidden="true" />
      </section>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-600 text-sm">
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <div>contact@gulfbeachweddings.com</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Follow Us</div>
            <div className="flex space-x-4">
              {/* Social icons can go here */}
              <a href="#" className="hover:text-indigo-600">Instagram</a>
              <a href="#" className="hover:text-indigo-600">Facebook</a>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">About</div>
            <div>Your premier destination for beach weddings in the Gulf Coast</div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 pb-4">© {new Date().getFullYear()} Gulf Beach Weddings. All rights reserved.</div>
      </footer>
    </div>
  )
} 