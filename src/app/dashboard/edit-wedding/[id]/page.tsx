"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type Wedding = {
  id: string;
  title: string;
  slug: string;
  user_id: string;
  created_at?: string;
  content?: any;
};

export default function EditWeddingPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialContent, setInitialContent] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchWedding = async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', params.id)
        .single();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setTitle(data.title);
      setSlug(data.slug);
      setInitialContent(data.content);
      setLoading(false);
    };
    fetchWedding();
  }, [params.id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Get Editor.js data
    const content = await editorRef.current?.save();

    // Update in Supabase
    const { error: updateError } = await supabase
      .from('weddings')
      .update({
        title,
        slug,
        content,
      })
      .eq('id', params.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push('/dashboard');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Wedding</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Wedding Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Slug"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
        />
        <div>
          <label className="block mb-2 font-semibold">Content</label>
          <Editor ref={editorRef} data={initialContent} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Wedding'}
        </button>
      </form>
    </div>
  );
} 