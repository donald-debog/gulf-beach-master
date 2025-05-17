import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wedding Packages',
  description: 'Explore our comprehensive wedding planning packages designed to make your beach wedding dreams come true.',
  openGraph: {
    title: 'Wedding Packages - Gulf Beach Weddings',
    description: 'Explore our comprehensive wedding planning packages designed to make your beach wedding dreams come true.',
  },
};

const packages = [
  {
    name: 'Essential',
    price: 2500,
    description: 'Perfect for couples who want professional coordination on their wedding day',
    features: [
      'Wedding day timeline creation',
      'Vendor coordination',
      'Ceremony & reception setup',
      'Day-of coordination team',
      'Emergency kit',
      'Vendor contact list',
    ],
    recommended: false,
  },
  {
    name: 'Complete',
    price: 4500,
    description: 'Our most popular package for couples who want full planning support',
    features: [
      'Everything in Essential, plus:',
      'Full planning from engagement to wedding day',
      'Vendor recommendations & management',
      'Budget planning & tracking',
      'Timeline creation & management',
      'Venue selection assistance',
      'Unlimited planning meetings',
      'Guest list management',
    ],
    recommended: true,
  },
  {
    name: 'Luxury',
    price: 7500,
    description: 'The ultimate wedding planning experience with personalized attention',
    features: [
      'Everything in Complete, plus:',
      'Dedicated planning team',
      'Luxury vendor connections',
      'Destination wedding support',
      'Welcome bags for guests',
      'Rehearsal dinner planning',
      'Post-wedding brunch planning',
      'VIP guest coordination',
    ],
    recommended: false,
  },
];

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Wedding Packages</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Choose the perfect package for your dream beach wedding
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  pkg.recommended ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {pkg.recommended && (
                  <div className="bg-indigo-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-indigo-600 mb-4">
                    ${pkg.price.toLocaleString()}
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold ${
                      pkg.recommended
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    } transition-colors`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">What's included in each package?</h3>
              <p className="text-gray-600">
                Each package includes a comprehensive set of services as listed above. We can also customize
                packages to meet your specific needs and budget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">When should we book our package?</h3>
              <p className="text-gray-600">
                We recommend booking at least 12-18 months before your wedding date for the Complete and
                Luxury packages, and 6-12 months for the Essential package.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can we upgrade our package later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade your package at any time, subject to availability. We'll prorate the
                difference based on the remaining time until your wedding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Planning?</h2>
          <p className="text-xl mb-8">
            Contact us today to discuss your dream wedding and find the perfect package for you
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
} 