import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import EditorJSRenderer from 'editorjs-react-renderer';
import type { Metadata, ResolvingMetadata } from 'next';

interface BlogPostProps {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: BlogPostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  
  // Fetch blog post data
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) {
    return {
      title: 'Blog Post Not Found - Gulf Beach Weddings',
      description: 'The requested blog post could not be found.',
    };
  }

  // Get the first image URL from the content if available
  let imageUrl = '';
  try {
    const content = post.content && typeof post.content === 'string'
      ? JSON.parse(post.content)
      : post.content;
    
    if (content?.blocks) {
      const imageBlock = content.blocks.find((block: any) => block.type === 'image');
      if (imageBlock?.data?.file?.url) {
        imageUrl = imageBlock.data.file.url;
      }
    }
  } catch (e) {
    console.error('Error parsing blog post content:', e);
  }

  // Get author information
  const { data: author } = post.author_id ? await supabase
    .from('users')
    .select('email')
    .eq('id', post.author_id)
    .single() : { data: null };

  return {
    title: post.title,
    description: post.description || `Read our latest article about ${post.title}`,
    authors: author ? [{ name: author.email }] : undefined,
    openGraph: {
      title: post.title,
      description: post.description || `Read our latest article about ${post.title}`,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: author ? [author.email] : undefined,
      url: `https://gulfbeachweddings.com/blog/${slug}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read our latest article about ${post.title}`,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = params;
  if (!slug) return notFound();

  // Fetch blog post by slug using the Supabase client
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) return notFound();

  let editorContent = null;
  try {
    editorContent = post.content && typeof post.content === 'string'
      ? JSON.parse(post.content)
      : post.content;
  } catch (e) {
    editorContent = null;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-8">
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString()}
        </time>
      </div>
      {editorContent ? (
        <div className="prose max-w-none">
          <EditorJSRenderer data={editorContent} />
        </div>
      ) : (
        <div className="text-gray-400 italic">No content available.</div>
      )}
    </div>
  );
} 