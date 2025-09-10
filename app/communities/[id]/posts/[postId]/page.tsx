'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from '@/components/comment-section'
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  FileText, 
  Video, 
  Mic, 
  Image,
  File,
  Volume2,
  Trash2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string | null
  type: string
  fileUrl: string | null
  fileName: string | null
  createdAt: string
  authorId: string
  author: {
    name: string | null
    image: string | null
  }
  _count: {
    comments: number
    likes: number
  }
  categories: Array<{
    category: string
  }>
}

export default function PostDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const communityId = params.id as string
  const postId = params.postId as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (session && postId) {
      fetchPost()
    }
  }, [session, postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        setLikeCount(data._count.likes)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleDelete = async () => {
    if (!session || !post) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // 删除成功，重定向到社区页面
        router.push(`/communities/${communityId}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const canDelete = post && (post.authorId === session?.user?.id)

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'PDF': return <File className="h-4 w-4" />
      case 'SLIDES': return <Image className="h-4 w-4" />
      case 'VOICE_NOTE': return <Volume2 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view this post</h1>
          <Button onClick={() => window.location.href = '/api/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href={`/communities/${communityId}`}>
            <Button>Back to Community</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/communities/${communityId}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>

          {/* Post Content */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getPostIcon(post.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>by {post.author.name}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.categories.map((category, index) => (
                    <Badge key={index} variant="outline">
                      {category.category}
                    </Badge>
                  ))}
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {post.content && (
                <div className="mb-6">
                  <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                </div>
              )}
              
              {post.fileUrl && (
                <div className="mb-6">
                  <a 
                    href={post.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    {getPostIcon(post.type)}
                    {post.fileName || 'View File'}
                  </a>
                </div>
              )}

              {/* Like and Comment Actions */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <Button
                  variant="ghost"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${liked ? 'text-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post._count.comments}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection postId={postId} />
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Post
              </CardTitle>
              <CardDescription>
                Are you sure you want to delete "{post.title}"? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
