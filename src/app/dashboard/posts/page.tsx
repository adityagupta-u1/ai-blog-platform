export const dynamic = "force-dynamic";

import { PostsSkeleton } from '@/components/posts-skeleton';
import { api, HydrateClient } from '@/trpc/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PostsClient from './posts-client';

export default async function Posts() {

  await api.post.getPosts.prefetch();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something Went Wrong</div>} >
        <Suspense fallback={<PostsSkeleton />} >
          <PostsClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>

  )
}

