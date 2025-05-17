import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import EditorJSRenderer from 'editorjs-react-renderer';
import Image from 'next/image';
import type { Metadata, ResolvingMetadata } from 'next';

interface WeddingMicrositeProps {
  params: { slug: string }
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
};

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
};

export async function generateMetadata(
  { params }: WeddingMicrositeProps,
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

export default async function WeddingMicrositePage({ params }: WeddingMicrositeProps) {
  const { slug } = params;
  if (!slug) return notFound();

  // Fetch wedding by slug using the Supabase client
  const { data: wedding, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !wedding) return notFound();

  let editorContent = null;
  try {
    editorContent = wedding.content && typeof wedding.content === 'string'
      ? JSON.parse(wedding.content)
      : wedding.content;
  } catch (e) {
    editorContent = null;
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">{wedding.title}</h1>
      <p className="text-lg text-gray-600 mb-8">
        {wedding.description || 'No description available.'}
      </p>
      {/* Editor.js Content */}
      {editorContent ? (
        <div className="text-left max-w-2xl mx-auto mb-8">
          <EditorJSRenderer data={editorContent} customBlock={customBlock} blockStyle={blockStyle} />
        </div>
      ) : (
        <div className="text-gray-400 italic mb-8">No additional content available.</div>
      )}
      <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 p-8 text-indigo-700 mb-8">
        <span className="font-mono">/weddings/{slug}</span>
      </div>
    </div>
  );
} 