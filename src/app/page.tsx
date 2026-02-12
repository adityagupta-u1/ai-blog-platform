import { api } from '@/trpc/server';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import Link from 'next/link';

const getData = async () => {
  const posts = await api.post.getAllPosts() as unknown as { id: string; title: string; slug: string }[] | undefined;
  return posts;
}

export default async function Home() {

  const posts = await getData();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
          <p className="text-lg">Here are some posts:</p>
          <ul className="mt-4 space-y-2">
            {posts && posts.map((post) => (
              <li key={post.id} className="bg-gray-100 p-4 rounded shadow">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
       <SignedOut>
          <SignInButton />
          <SignUpButton />
      </SignedOut>
      <SignedIn>
      </SignedIn>
    </div>
  );
}
