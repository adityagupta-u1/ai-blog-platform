import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { api } from '@/trpc/server';
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
} from '@clerk/nextjs';
import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

const getData = async () => {
  const posts = await api.post.getAllPosts() as unknown as { id: string; title: string; slug: string }[] | undefined;
  return posts;
}

export default async function Home() {
  const posts = await getData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl lg:text-7xl">
              Welcome to Your
              <span className="block text-primary mt-2">Blog Platform</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover insightful articles, share your thoughts, and connect with a community of writers and readers.
            </p>
            
            {/* Auth Buttons - Centered */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="font-semibold">
                    Get Started
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button size="lg" variant="outline" className="font-semibold">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto" />

      {/* Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Explore our most recent articles and insights
            </p>
          </div>

          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {posts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span>Article {index + 1}</span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" asChild className="p-0 hover:bg-transparent hover:text-primary">
                      <Link href={`/blog/${post.slug}`} className="flex items-center">
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-center">No posts yet</p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Check back later for new content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Your Blog Platform. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}