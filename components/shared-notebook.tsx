'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Globe, 
  Video, 
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { NotebookUpload } from './notebook-upload'
import { NotebookViewer } from './notebook-viewer'

interface Notebook {
  id: string
  title: string
  description: string | null
  emoji: string | null
  createdAt: string
  authorId: string
  author: {
    name: string | null
  }
  sources: NotebookSource[]
  _count: {
    sources: number
  }
}

interface NotebookSource {
  id: string
  name: string
  type: string
  sourceType: string
  url: string | null
  fileSize: number | null
  createdAt: string
}

interface SharedNotebookProps {
  communityId: string
  currentUserId?: string
}

export function SharedNotebook({ communityId, currentUserId }: SharedNotebookProps) {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingNotebookId, setDeletingNotebookId] = useState<string | null>(null)

  useEffect(() => {
    fetchNotebooks()
  }, [communityId])

  const fetchNotebooks = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/communities/${communityId}/notebooks`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notebooks: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      console.log('Fetched notebooks data:', data)
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('First notebook:', data[0])
        console.log('First notebook sources:', data[0].sources)
        if (data[0].sources && data[0].sources.length > 0) {
          console.log('First source:', data[0].sources[0])
          console.log('First source URL:', data[0].sources[0].url)
        }
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setNotebooks(data)
      } else {
        console.error('Invalid data format received:', data)
        setNotebooks([])
        setError('Invalid data format received from server')
      }
    } catch (error) {
      console.error('Error fetching notebooks:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch notebooks')
      setNotebooks([])
    } finally {
      setLoading(false)
    }
  }

  const handleNotebookCreated = (notebook: Notebook) => {
    setNotebooks(prev => [notebook, ...prev])
    setIsUploadOpen(false)
  }

  const handleNotebookDeleted = (notebookId: string) => {
    setNotebooks(prev => prev.filter(nb => nb.id !== notebookId))
    if (selectedNotebook?.id === notebookId) {
      setSelectedNotebook(null)
    }
  }

  const handleDeleteNotebook = async (notebookId: string) => {
    if (!currentUserId) return

    setDeletingNotebookId(notebookId)
    try {
      const response = await fetch(`/api/notebooks/${notebookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        handleNotebookDeleted(notebookId)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete notebook')
      }
    } catch (error) {
      console.error('Error deleting notebook:', error)
      alert('Failed to delete notebook')
    } finally {
      setDeletingNotebookId(null)
    }
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-500" />
      case 'Website': return <Globe className="h-4 w-4" />
      case 'YouTube': return <Video className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
  }

  const downloadFile = (source: NotebookSource) => {
    if (!source.fileData) return
    
    try {
      const byteCharacters = atob(source.fileData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: source.type === 'PDF' ? 'application/pdf' : 'application/octet-stream' })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = source.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shared Notebooks</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading notebooks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shared Notebooks</h2>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-destructive mb-4">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Error Loading Notebooks</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchNotebooks}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Ensure notebooks is always an array
  const safeNotebooks = Array.isArray(notebooks) ? notebooks : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shared Notebooks</h2>
          <p className="text-muted-foreground">
            Collaborative learning resources and shared knowledge
          </p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          data-create-notebook
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notebook
        </Button>
      </div>

      {safeNotebooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notebooks yet</h3>
            <p className="text-muted-foreground mb-4">
              Create the first shared notebook for this community!
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              data-create-notebook
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Notebook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeNotebooks.map((notebook) => (
            <Card 
              key={notebook.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedNotebook(notebook)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{notebook.emoji || '📚'}</div>
                    <div>
                      <CardTitle className="text-lg">{notebook.title}</CardTitle>
                      <CardDescription>
                        by {notebook.author.name}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {notebook._count.sources} sources
                    </Badge>
                    {notebook.authorId === currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (confirm(`Are you sure you want to delete "${notebook.title}"?`)) {
                            handleDeleteNotebook(notebook.id)
                          }
                        }}
                        disabled={deletingNotebookId === notebook.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {notebook.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {notebook.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(notebook.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {notebook.sources && notebook.sources.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Recent sources:</p>
                      {notebook.sources?.slice(0, 3).map((source) => (
                        <div key={source.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getSourceIcon(source.type)}
                          <span className="truncate flex-1">{source.name}</span>
                          {source.fileSize && (
                            <span className="text-xs">({formatFileSize(source.fileSize)})</span>
                          )}
                          {source.url ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(source.url!, '_blank', 'noopener,noreferrer')
                              }}
                              className="h-6 w-6 p-0"
                              title={source.type === 'YouTube' ? 'Watch on YouTube' : 'Open link'}
                            >
                              {source.type === 'YouTube' ? (
                                <Video className="h-3 w-3" />
                              ) : (
                                <ExternalLink className="h-3 w-3" />
                              )}
                            </Button>
                          ) : source.fileData ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                downloadFile(source)
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          ) : null}
                        </div>
                      ))}
                      {notebook.sources && notebook.sources.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{notebook.sources.length - 3} more sources
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <NotebookUpload
          communityId={communityId}
          onNotebookCreated={handleNotebookCreated}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {/* Notebook Viewer Modal */}
      {selectedNotebook && (
        <NotebookViewer
          notebook={selectedNotebook}
          onClose={() => setSelectedNotebook(null)}
          onNotebookDeleted={handleNotebookDeleted}
        />
      )}
    </div>
  )
}
