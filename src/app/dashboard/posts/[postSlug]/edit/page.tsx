// EditPost (server component)

import { api } from '@/trpc/server';
import React from 'react';
import ClientEditorWrapper from '../../../../_components/ClientEditorWrapper';

interface EditPageProps {
  params: {
    postSlug: string;
  };
}

export default async function EditPost({ params: { postSlug } }: EditPageProps) {
  
  const post = await api.post.getPostBySlug({ slug: postSlug }) as unknown as { id: string; title: string; content: string; slug: string,category:string | null; tags: string[] | null } | undefined;


  if (!post) {
    return <div>Post not found</div>;
  }

  const tags = await api.tags.getTags();
  const categories = await api.categories.getCategories();
  console.log("Post to edit:", post);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <ClientEditorWrapper
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          slug: post.slug,
          category: post.category, // Assuming category is not needed for edit
          tags: post.tags, // Assuming tags are not needed for edit
        }}
        tags={tags}
        categories={categories}
      />
    </div>
  );
}
