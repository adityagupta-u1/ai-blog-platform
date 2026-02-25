export const dynamic = "force-dynamic";

import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { api, HydrateClient } from '@/trpc/server';
import { auth } from '@clerk/nextjs/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardClient from './dashboard-client';

export default async function Dashboard() {
  const session = await auth();
  const userId = session.userId;
  if(!userId) {
    return <div>Please login to view your dashboard</div>
  }
  await api.post.getPosts.prefetch();
  await api.views.getViewsByUserId.prefetch({ userId}); // Prefetch views for a specific user (replace with actual user ID)
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something Went Wrong</div>} >
        <Suspense fallback={<DashboardSkeleton />} >
          <DashboardClient userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}
