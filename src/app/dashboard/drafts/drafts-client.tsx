'use client'

import { FilterComponent } from '@/app/_components/filterComponent';
import PostCardComponent from '@/app/_components/postCardComponent';
import { trpc } from '@/trpc/client';
import React from 'react';

export default function DraftsClient() {

    const [data] = trpc.post.getDrafts.useSuspenseQuery();
    const drafts = data as unknown as { id: string; title: string; content: string; slug: string }[] | undefined;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>
            <p className="text-muted-foreground mt-2">
                {/* Manage and view all your blog posts */}
            </p>
            </div>

            <FilterComponent>
                {drafts && drafts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drafts.map((draft) => (
                    <PostCardComponent key={draft.id} post={draft} />
                    ))}
                </div>
                ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No drafts found.</p>
                </div>
                )}
            </FilterComponent>
        </div>
    )
}
