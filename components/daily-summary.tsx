'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Calendar, Users, FileText, Heart, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DailySummaryProps {
  communityId: string
}


interface SummaryData {
  summary: string
  postCount: number
  uniqueAuthors: number
  totalLikes: number
  totalComments: number
  topPosts: Post[]
  posts: Post[]
}

interface Post {
  id: string
  title: string
  type: string
  content: string
  author: string
  createdAt: string
  categories: string[]
  likes: number
  comments: number
  engagement: number
}

export default function DailySummary({ communityId }: DailySummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  const fetchSummary = async (isRefresh = false, isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsAutoRefreshing(true)
      }
      
      const response = await fetch(`/api/communities/${communityId}/daily-summary`)
      if (response.ok) {
        const data = await response.json()
        setSummaryData(data)
        setLastUpdate(new Date())
      } else {
        console.error('Failed to fetch daily summary')
      }
    } catch (error) {
      console.error('Error fetching daily summary:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
      if (isAutoRefresh) {
        setTimeout(() => setIsAutoRefreshing(false), 1000) // 显示1秒后隐藏
      }
    }
  }

  useEffect(() => {
    fetchSummary()
    
    // 设置定时刷新（每1分钟检查新帖子）
    const interval = setInterval(() => {
      fetchSummary(true, true)
    }, 1 * 60 * 1000) // 1分钟

    // 监听页面可见性变化，当用户回到页面时刷新
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSummary(true, true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [communityId])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchSummary(true)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            AI Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Generating today's summary...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              AI Daily Summary
            </CardTitle>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                Last updated: {lastUpdate.toLocaleTimeString()}
                {isAutoRefreshing && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Auto-refreshing...
                  </span>
                )}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {summaryData ? (
          <div className="space-y-4">
            {/* Summary content */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div 
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                style={{ 
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
                dangerouslySetInnerHTML={{
                  __html: summaryData.summary
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900 font-semibold">$1</strong>')
                    .replace(/•/g, '<span class="text-blue-600 font-bold">•</span>')
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-1 bg-blue-50 p-3 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">{summaryData.postCount}</div>
                  <div className="text-blue-700">Posts</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-50 p-3 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">{summaryData.uniqueAuthors}</div>
                  <div className="text-green-700">Authors</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-red-50 p-3 rounded-lg">
                <Heart className="h-4 w-4 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">{summaryData.totalLikes}</div>
                  <div className="text-red-700">Likes</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-purple-50 p-3 rounded-lg">
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="font-semibold text-purple-900">{summaryData.totalComments}</div>
                  <div className="text-purple-700">Comments</div>
                </div>
              </div>
            </div>

            {/* Top 3 Most Popular Posts */}
            {summaryData.topPosts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  🔥 Top 3 Most Popular Posts
                </h4>
                <div className="space-y-3">
                  {summaryData.topPosts.map((post, index) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <h5 className="font-medium text-sm text-gray-900">
                              {post.title}
                            </h5>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            Author: {post.author} • {new Date(post.createdAt).toLocaleTimeString()}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {post.type}
                            </Badge>
                            {post.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes} likes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{post.comments} comments</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-orange-600">
                                {post.engagement} total engagement
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Today's Posts */}
            {summaryData.posts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">All Today's Posts</h4>
                <div className="space-y-2">
                  {summaryData.posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">
                            {post.title}
                          </h5>
                          <p className="text-xs text-gray-600 mt-1">
                            Author: {post.author} • {new Date(post.createdAt).toLocaleTimeString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {post.type}
                            </Badge>
                            {post.categories.map((category) => (
                              <Badge key={category} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>AI summaries will appear here once there are posts to analyze.</p>
            <p className="text-sm mt-2">Auto-refreshes every 1 minute</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}