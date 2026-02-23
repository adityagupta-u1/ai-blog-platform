import PostCardComponent from '@/app/_components/postCardComponent'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/trpc/server'
import React from 'react'
import { FilterComponent } from "../../_components/filterComponent"

export default async function Posts() {
  const posts = await api.post.getPosts() as unknown as { id: string; title: string; slug: string }[] | undefined

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all your blog posts
        </p>
      </div>

      <FilterComponent>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCardComponent key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found.</p>
          </div>
        )}
      </FilterComponent>
    </div>
  )
}

// Optional: Loading skeleton for Suspense
export function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}