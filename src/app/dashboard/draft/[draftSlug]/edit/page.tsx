// EditPost (server component)

import { api } from '@/trpc/server';
import React from 'react';
import ClientEditorWrapper from '../../../../_components/ClientEditorWrapper';

type EditPageProps = {
    params: Promise<{
        draftSlug: string;
    }>;
};
export default async function SingleDraft({ params }: EditPageProps) {
    const { draftSlug } = await params;

    const post = await api.post.getPostBySlug({ slug: draftSlug }) as unknown as { id: string; title: string; content: string; slug: string,category:string | null; tags: string[] | null,status:string } | undefined;


    if (!post) {
        return <div>Post not found</div>;
    }

    const tags = await api.tags.getTags();
    const categories = await api.categories.getCategories();
    console.log("Post to edit:", post);
    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Draft</h1>
        <ClientEditorWrapper
            post={{
            id: post.id,
            title: post.title,
            content: post.content,
            slug: post.slug,
            category: post.category, // Assuming category is not needed for edit
            tags: post.tags, 
            status:post.status// Assuming tags are not needed for edit
            }}
            tags={tags}
            categories={categories}
        />
        </div>
    );
}
