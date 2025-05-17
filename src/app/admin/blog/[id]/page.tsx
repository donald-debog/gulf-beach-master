'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import type { OutputData } from '@editorjs/editorjs';

export default function BlogPostEditor() {
  const params = useParams();
  const router = useRouter();
  const isNewPost = !params.id || params.id === 'new';
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<OutputData>({ blocks: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement blog post creation/update logic with Supabase
      console.log('Submitting blog post:', { title, content });
      
      // After successful submission, redirect to the blog list
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <Editor
            data={content}
            onChange={setContent}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isNewPost ? 'Create Post' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 