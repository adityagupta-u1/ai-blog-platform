'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/trpc/client'
import { AlertCircle, CheckCircle2, Edit, Eye, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
  }
}

export default function PostCardComponent({ post }: PostCardProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  const { mutate, isPending } = trpc.post.deletePost.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully', {
        description: `"${post.title}" has been removed.`,
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 4000,
      })
      setIsDeleteDialogOpen(false)
      router.refresh()
    },
    onError: (error) => {
      toast.error('Failed to delete post', {
        description: error.message || 'Something went wrong. Please try again.',
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      })
    },
  })

  const handleDelete = () => {
    mutate({ postId: post.id })
  }

  const handleView = () => {
    toast.info('Navigating to post', {
      description: `Viewing "${post.title}"`,
      duration: 2000,
    })
  }

  const handleEdit = () => {
    toast.info('Opening editor', {
      description: `Editing "${post.title}"`,
      duration: 2000,
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          Post ID: {post.id}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          disabled={isPending}
          onClick={handleView}
        >
          <Link href={`/blog/${post.slug}`}>
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          asChild 
          disabled={isPending}
          onClick={handleEdit}
        >
          <Link href={`/dashboard/posts/${post.slug}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm" 
              disabled={isPending}
              className="ml-auto"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                <span className="font-semibold">&quot;{post.title}&quot;</span> and remove it
                from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}