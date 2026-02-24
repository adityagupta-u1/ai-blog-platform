

import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { api, HydrateClient } from '@/trpc/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardClient from './dashboard-client';

export default async function Dashboard() {
  await api.post.getPosts.prefetch();
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something Went Wrong</div>} >
        <Suspense fallback={<DashboardSkeleton />} >
          <DashboardClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
