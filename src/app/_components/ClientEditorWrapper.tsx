'use client';

import TextEditor from '@/app/_components/form/textEditor';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect } from 'react';

interface ClientEditorWrapperProps {
    post: {
        id: string;
        title: string;
        content: string;
        slug: string;
        category: string | null;
        tags: string[] | null;
    };    
    tags: { id: string; name: string }[];
    categories: { id: string; name: string }[];
}

const ClientEditorWrapper:FC<ClientEditorWrapperProps> = ({post, tags, categories})=> {
      const router = useRouter();
    const trpc = useTRPC();
    const {mutate,isSuccess,data} = useMutation(trpc.post.editPost.mutationOptions());
  

    useEffect(() => {   
        if(isSuccess && data) {
            console.log("Post edited successfully");
            console.log("Post Data getting from the edit post page",post)
            router.push("/dashboard/posts/"+post.slug);
        }
    },[isSuccess,data,router,post]);


  return (
    <TextEditor
          post={{
            content: post.content,
            tags: post.tags || [],
            category: post.category || null,
          }}
          functions='edit'
          title={post.title}
          editPostMutate={(data) => mutate({ ...data, slug: data.slug ?? post.slug })}
          postId={post.id}
          tags={tags}
          categories={categories} 
          savePostMutate={undefined} 
          slug={post.slug}
    />
  )
}

export default ClientEditorWrapper;