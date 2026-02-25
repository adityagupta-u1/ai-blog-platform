export const dynamic = "force-dynamic";

import { PostsSkeleton } from '@/components/posts-skeleton';
import { api, HydrateClient } from '@/trpc/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DraftsClient from './drafts-client';

export default async function Drafts() {

    await api.post.getDrafts.prefetch();

    return (
        <HydrateClient>
        <ErrorBoundary fallback={<div>Something Went Wrong</div>} >
            <Suspense fallback={<PostsSkeleton />} >
            <DraftsClient />
            </Suspense>
        </ErrorBoundary>
        </HydrateClient>

    )
}

