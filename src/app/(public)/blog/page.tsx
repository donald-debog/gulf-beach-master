"use client";

import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { metadata } from './metadata';

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

const DraggableBlogPost: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-4 border rounded mb-2">
      {title}
    </div>
  );
};

export default async function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([
    { id: '1', title: 'Post 1' },
    { id: '2', title: 'Post 2' },
    { id: '3', title: 'Post 3' },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlogPosts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blogPosts.map((post) => post.id)} strategy={verticalListSortingStrategy}>
                {blogPosts.map((post) => (
                  <DraggableBlogPost key={post.id} id={post.id} title={post.title} />
                ))}
              </SortableContext>
            </DndContext>
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