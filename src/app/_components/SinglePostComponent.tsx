'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SanitizeHtml } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { AlertCircle, Calendar, Eye, User } from 'lucide-react';
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import React, { useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
  author?: string;
  views?: number;
}

const SinglePostComponent = ({ 
  post, 
  userId, 
  anonId 
}: { 
  post: Post | undefined; 
  userId: string | null; 
  anonId: RequestCookie | undefined;
}) => {
  const { mutate } = trpc.views.createView.useMutation();

  useEffect(() => {
    if (post?.id) {
      mutate({ 
        anonId: anonId?.value || null, 
        userId: userId, 
        postId: post.id 
      });
    }
  }, [userId, anonId, post?.id, mutate]);

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="animate-in fade-in-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Post not found. The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const cleanHtml = SanitizeHtml(post.content);

  return (
    <article className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                Published
              </Badge>
              {post.author && (
                <Badge variant="outline" className="text-xs">
                  By {post.author}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {post.title}
            </CardTitle>
            
            <CardDescription className="text-base text-muted-foreground">
              <div className="flex items-center gap-4 flex-wrap">
                {post.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                {post.views !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{userId ? 'Authenticated' : 'Guest'}</span>
                </div>
              </div>
            </CardDescription>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 md:p-8">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none
              prose-headings:scroll-m-20 prose-headings:font-bold
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
              prose-p:leading-7 prose-p:mt-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:border prose-img:shadow-sm
              prose-strong:font-semibold
              prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm
              prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
              prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
              prose-ul:list-disc prose-ul:pl-6
              prose-ol:list-decimal prose-ol:pl-6"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </CardContent>

        {/* Footer Section */}
        <div className="border-t bg-muted/5 p-4 md:p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} All rights reserved</p>
            <p>Post ID: {post.id}</p>
          </div>
        </div>
      </Card>
    </article>
  );
};

// Loading skeleton component
export const SinglePostSkeleton = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="border-none shadow-lg">
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 md:p-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-12 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SinglePostComponent;