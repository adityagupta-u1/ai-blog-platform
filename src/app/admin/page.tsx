import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { BarChart, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { ViewChart } from "../_components/dashboard/viewChart";
import AnimatedCardComponent from "../_components/ui/AnimatedCardComponent";
import { Button } from "../_components/ui/button";

const isAdmin = async (id:string) => {
  const dbUser = await db.select({
    role: users.role
  }).from(users).where(
    eq(users.id, id)
  ); 
  return dbUser[0].role === "admin";
}

export default async function Admin() {
  
  const allPosts = await api.post.getPosts();
  const users = await api.users.getAllUsers() as unknown as {id:string}[];
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return (
      <div>
        You need to be logged in to view this page.
      </div>
    );
  }
  const admin = await isAdmin(clerkUser.id);

  if( !admin) {
    return (
      <div>
        You do not have permission to view this page.
      </div>
    );
  }
  if (!posts) {
    return (
      <div>
        ...Loading
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* Summary Cards */}
      <AnimatedCardComponent title={"posts"} value={allPosts.length} />
      <AnimatedCardComponent title={"views"} value={"28k"} />
      <AnimatedCardComponent title={"subscribers"} value={"1.4k"} />
      <AnimatedCardComponent title={"users"} value={users.length} />
      <div className="md:col-start-1 md:col-end-4">
        <ViewChart />
      </div>
      <div className="md:col-start-4 md:col-end- flex flex-col gap-4">
        {/**Latest Posts */}
        <div className="text-xl font-semibold mb-4">
          Latest Posts
        </div>
        {
          allPosts && allPosts.map((post) => (
            <div key={post.id} className="p-4 mb-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <Link href={`/dashboard/posts/${post.id}`} className="text-lg font-semibold hover:underline">
              {post.title}
              </Link>
            </div>
          ))
        }
      </div>

      {/* Action & Navigation */}
      <div className="col-span-1 md:col-span-4 flex flex-wrap justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button className="rounded-2xl shadow" variant="default" >
            <Link  href={'/dashboard/createPost'}>
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Link>
          </Button>
          <Button className="rounded-2xl shadow" variant="outline">
            <BarChart className="w-4 h-4 mr-2" /> Analytics
          </Button>
        </div>
        <Button variant="ghost">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </Button> 
      </div>
    </div>
  );
}
