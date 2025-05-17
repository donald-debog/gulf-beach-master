import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Wedding Blog',
  description: 'Explore our wedding planning tips, inspiration, and real wedding stories from Gulf Beach Weddings.',
  openGraph: {
    title: 'Wedding Blog - Gulf Beach Weddings',
    description: 'Explore our wedding planning tips, inspiration, and real wedding stories from Gulf Beach Weddings.',
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  created_at: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return posts as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Wedding Blog</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Tips, inspiration, and real wedding stories from our beach weddings
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
                All Posts
              </button>
              <button className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-gray-100">
                Planning Tips
              </button>
              <button className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-gray-100">
                Real Weddings
              </button>
              <button className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-gray-100">
                Vendor Spotlight
              </button>
              <button className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-gray-100">
                Beach Weddings
              </button>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              let imageUrl = '';
              try {
                const content = JSON.parse(post.content);
                const firstImage = content.blocks.find(
                  (block: { type: string }) => block.type === 'image'
                );
                if (firstImage) {
                  imageUrl = firstImage.data.file.url;
                }
              } catch (error) {
                console.error('Error parsing post content:', error);
              }

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  {imageUrl && (
                    <div className="relative h-48">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <time dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{post.category}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-indigo-600"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Newsletter Section */}
          <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600 mb-6">
                Get the latest wedding tips, inspiration, and updates delivered to
                your inbox.
              </p>
              <form className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 