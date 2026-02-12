import PostCardComponent from '@/app/_components/postCardComponent';
import { api } from '@/trpc/server';

import React from 'react';
import { FilterComponent } from "../../_components/filterComponent";



export default async function Posts() {

  const posts = await api.post.getPosts() as unknown as {id:string,title:string,slug:string}[] | undefined;

  return (  
    <>
      <div>
        <FilterComponent>
          {
            posts && posts.map((post) => (
              <PostCardComponent key={post.id} post={post} />
            ))
          }
        </FilterComponent>
      </div>
    </>
  )
}
