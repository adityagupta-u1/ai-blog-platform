import SinglePostComponent from '@/app/_components/SinglePostComponent';
import { api } from '@/trpc/server';

import { auth } from '@clerk/nextjs/server';

import { cookies } from 'next/headers';
import React from 'react';

type EditPageProps = {
  params: Promise<{
    postSlug: string;
  }>;
};

export default async function SinglePost({params}: EditPageProps) {
  const { postSlug } = await params;
  const post = await api.post.getPostBySlug({slug:postSlug}) as unknown as {id:string,title:string,content:string} | undefined;
  const {userId} = await auth();
  const cookieStore = await cookies();
  const anonId = cookieStore.get('anonId');
  console.log(post)

  return(
    <SinglePostComponent post={post} userId={userId} anonId={anonId} />
  )
}
