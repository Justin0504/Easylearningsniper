'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Plus, Search } from 'lucide-react'
import Link from 'next/link'

interface Community {
  id: string
  name: string
  description: string | null
  image: string | null
  isPublic: boolean
  createdAt: string
  owner: {
    name: string | null
  }
  _count: {
    members: number
    posts: number
  }
}

export default function CommunitiesPage() {
  const { data: session } = useSession()
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (session) {
      fetchCommunities()
    }
  }, [session])

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities')
      const data = await response.json()
      setCommunities(data)
    } catch (error) {
      console.error('Error fetching communities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view communities</h1>
          <Button onClick={() => window.location.href = '/api/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Communities
            </h1>
            <p className="text-muted-foreground mt-2">
              Join focused AI learning communities and accelerate your knowledge growth
            </p>
          </div>
          <Link href="/create-community">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading communities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{community.name}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      community.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {community.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{community._count.members} members</span>
                      </div>
                      <div>
                        <span>{community._count.posts} posts</span>
                      </div>
                    </div>
                    <div>
                      by {community.owner.name}
                    </div>
                  </div>
                  <Link href={`/communities/${community.id}`}>
                    <Button className="w-full">
                      View Community
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No communities found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a community!'}
            </p>
            <Link href="/create-community">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
