'use client'
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function PostCardComponent({post}:{post:{id:string,title:string,slug:string}}) {
    const trpc = useTRPC();
    const router = useRouter();
    const {mutate,isSuccess,data,isPending} = useMutation(trpc.post.deletePost.mutationOptions());
    useEffect(() => {
        if(isSuccess && data) {
            console.log("Post deleted successfully");
            router.replace(window.location.pathname);
        }
    },[isSuccess,data,router]);
  return (

    <div key={post.id} className="p-4 border rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold">{post.title}</h2>
    {/* <p className="text-gray-500">Post ID: {post.id}</p> */}

    <button type="button" disabled={isPending}>
      <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">View Post</Link>
    </button>
    <button type="button" disabled={isPending}>
      <Link href={`/dashboard/posts/${post.slug}/edit`} className="text-black hover:underline">Edit Post</Link>
    </button>
    <button type="button"  className="text-red-500 hover:underline" onClick={() => mutate({postId:post.id})} disabled={isPending}>Delete Post</button>
    

  </div>
  )
}
