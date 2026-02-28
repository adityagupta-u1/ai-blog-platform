'use client';

import TextEditor from '@/app/_components/form/textEditor';
import { trpc } from '@/trpc/client';
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
        status:string;
    };    
    tags: { id: string; name: string }[];
    categories: { id: string; name: string }[];
}

const ClientEditorWrapper:FC<ClientEditorWrapperProps> = ({post, tags, categories})=> {
      const router = useRouter();
    const {mutate,isSuccess,data} = trpc.post.editPost.useMutation();

    useEffect(() => {   
        if(isSuccess && data) {
            console.log("Post edited successfully");
            console.log("Post Data getting from the edit post page",post)
            console.log(data)
            if(data.status === "draft"){ console.log("status is draft"); router.push("/dashboard/draft")}
            else router.push(`/dashboard/posts/`+post.slug);
        }
    },[isSuccess,data,router,post]);


  return (
    <TextEditor
          post={{
            content: post.content,
            tags: post.tags || [],
            category: post.category || null,
            status:post.status
          }}
          functions='edit'
          title={post.title}
          editPostMutate={(data) => mutate({
            ...data, slug: data.slug ?? post.slug
          })}
          postId={post.id}
          tags={tags}
          categories={categories} 
          savePostMutate={undefined} 
          slug={post.slug}
    />
  )
}

export default ClientEditorWrapper;