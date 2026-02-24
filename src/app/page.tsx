
export const dynamic = 'force-dynamic';

import { api, HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import HomeClient from './home-client';
export default async function Home() {
  await api.post.getAllPosts.prefetch();
  return (
    <HydrateClient>
      {/** ... */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <HomeClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}