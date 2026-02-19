'use client'

import { SanitizeHtml } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { type RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import React, { useEffect } from 'react';

const SinglePostComponent = ({post,userId,anonId}:{post: {id:string,title:string,content:string} | undefined;userId:string | null,anonId:RequestCookie  | undefined}) =>{


  const {mutate} = trpc.views.createView.useMutation()

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