"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type Wedding = {
  id: string;
  title: string;
  slug: string;
  user_id: string;
  created_at?: string;
};

export default function CreateWeddingPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in.');
      setSaving(false);
      return;
    }

    // Get Editor.js data
    const content = await editorRef.current?.save();

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from('weddings')
      .insert([{
        title,
        slug,
        content,
        user_id: user.id,
      }]);

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create New Wedding</h1>
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
          placeholder="Slug (e.g. smith-jones-2024)"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
        />
        <div>
          <label className="block mb-2 font-semibold">Content</label>
          <Editor ref={editorRef} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Create Wedding'}
        </button>
      </form>
    </div>
  );
} 