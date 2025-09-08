'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import DailySummary from '@/components/daily-summary'
import LearningSection from '@/components/learning-section'
import Chatbot from '@/components/chatbot'
import { SharedNotebook } from '@/components/shared-notebook'
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Heart, 
  FileText, 
  Video, 
  Mic, 
  Image,
  BookOpen,
  Calendar,
  Bot,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface Community {
  id: string
  name: string
  description: string | null
  image: string | null
  isPublic: boolean
  createdAt: string
  owner: {
    id: string
    name: string | null
  }
  members: Array<{
    id: string
    name: string | null
  }>
  _count: {
    members: number
    posts: number
  }
}

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

export default function CommunityPage() {
  const { data: session } = useSession()
  const params = useParams()
  const communityId = params.id as string
  
  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    if (session && communityId) {
      fetchCommunity()
      fetchPosts()
    }
  }, [session, communityId])

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}`)
      const data = await response.json()
      setCommunity(data)
      setIsMember(data.members.some((member: any) => member.id === session?.user.id))
    } catch (error) {
      console.error('Error fetching community:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      })
      if (response.ok) {
        setIsMember(true)
        fetchCommunity()
      }
    } catch (error) {
      console.error('Error joining community:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!session) return

    setDeletingPostId(postId)
    try {
      const response = await fetch(`/api/communities/${communityId}/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // 删除成功，从列表中移除
        setPosts(prev => prev.filter(post => post.id !== postId))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    } finally {
      setDeletingPostId(null)
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'PDF': return <FileText className="h-4 w-4" />
      case 'SLIDES': return <Image className="h-4 w-4" />
      case 'VOICE_NOTE': return <Mic className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view this community</h1>
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
          <p className="mt-2 text-muted-foreground">Loading community...</p>
        </div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Community not found</h1>
          <Link href="/communities">
            <Button>Back to Communities</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{community.name}</h1>
              <p className="text-muted-foreground">{community.description}</p>
            </div>
            <div className="flex gap-2">
              {!isMember ? (
                <Button onClick={joinCommunity}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              ) : (
                <>
                  <Link href={`/communities/${communityId}/create-post`}>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // This will be handled by the SharedNotebook component
                      const notebooksTab = document.querySelector('[value="notebooks"]') as HTMLElement
                      if (notebooksTab) {
                        notebooksTab.click()
                        // Trigger the create notebook modal after a short delay
                        setTimeout(() => {
                          const createButton = document.querySelector('[data-create-notebook]') as HTMLElement
                          if (createButton) {
                            createButton.click()
                          }
                        }, 100)
                      }
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community._count.members} members</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{community._count.posts} posts</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
              </div>
              <Badge variant={community.isPublic ? "default" : "secondary"}>
                {community.isPublic ? 'Public' : 'Private'}
              </Badge>
            </div>
            
            <Button
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
              variant={isChatbotOpen ? "default" : "outline"}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="notebooks">Shared Notebooks</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share something in this community!
                  </p>
                  {isMember && (
                    <Link href={`/communities/${communityId}/create-post`}>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Post
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <Link href={`/communities/${communityId}/posts/${post.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {getPostIcon(post.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
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
                        {post.authorId === session?.user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                handleDeletePost(post.id)
                              }
                            }}
                            disabled={deletingPostId === post.id}
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
                      <p className="text-muted-foreground mb-4">{post.content}</p>
                    )}
                    {post.fileUrl && (
                      <div className="mb-4">
                        <a 
                          href={post.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {post.fileName || 'View File'}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Link href={`/communities/${communityId}/posts/${post.id}`}>
                        <div className="flex items-center gap-1 hover:text-primary cursor-pointer">
                          <Heart className="h-4 w-4" />
                          <span>{post._count.likes}</span>
                        </div>
                      </Link>
                      <Link href={`/communities/${communityId}/posts/${post.id}`}>
                        <div className="flex items-center gap-1 hover:text-primary cursor-pointer">
                          <MessageSquare className="h-4 w-4" />
                          <span>{post._count.comments}</span>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <CardDescription>
                  {community._count.members} members in this community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {community.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        {member.id === community.owner.id && (
                          <Badge variant="outline" className="text-xs">Owner</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notebooks" className="space-y-4">
            <SharedNotebook communityId={communityId} currentUserId={session?.user?.id} />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <DailySummary communityId={communityId} />
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <LearningSection communityId={communityId} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Chatbot */}
      {community && (
        <Chatbot
          communityId={communityId}
          communityName={community.name}
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        />
      )}
    </div>
  )
}
