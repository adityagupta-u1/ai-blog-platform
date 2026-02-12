
import { api } from '@/trpc/server';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import React from 'react';


import SinglePostComponent from '@/app/_components/SinglePostComponent';



export default async function BlogPost({params}: {params:{slug:string}}) {
  const post = await api.post.getPostBySlug({slug:params.slug}) as unknown as {id:string,title:string,content:string} | undefined;
  console.log(post)
  const {userId} = await auth();
    const cookieStore = await cookies();
    const anonId = cookieStore.get('anonId');

  return(
    <SinglePostComponent post={post} userId={userId} anonId={anonId} />
  )
}
