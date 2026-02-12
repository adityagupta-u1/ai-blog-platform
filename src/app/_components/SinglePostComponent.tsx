'use client'

import { SanitizeHtml } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import React, { useEffect } from 'react';

const SinglePostComponent = ({post,userId,anonId}:{post: {id:string,title:string,content:string} | undefined;userId:string | null,anonId:RequestCookie  | undefined}) =>{

  const trpc = useTRPC();
  const {mutate} = useMutation(trpc.views.createView.mutationOptions())

  useEffect(()=>{
    if(post?.id){
      mutate({anonId:anonId?.value || null,userId:userId,postId:post?.id})
    }
    //update the post view count
  },[userId,anonId,post?.id,mutate])

  if(!post) {
    return <div>Post not found</div>
  }
  // To sanitize the HTML content
  const cleanHtml = SanitizeHtml(post.content);
  console.log(cleanHtml)
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  )
}

export default SinglePostComponent