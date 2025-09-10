'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  FileText, 
  Globe, 
  Video, 
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  ExternalLink,
  AlertCircle,
  Play
} from 'lucide-react'

interface NotebookSource {
  id: string
  name: string
  type: string
  sourceType: string
  url: string | null
  fileSize: number | null
  createdAt: string
}

interface Notebook {
  id: string
  title: string
  description: string | null
  emoji: string | null
  createdAt: string
  author: {
    name: string | null
  }
  sources: NotebookSource[]
  _count: {
    sources: number
  }
}

interface NotebookViewerProps {
  notebook: Notebook
  onClose: () => void
  onNotebookDeleted: (notebookId: string) => void
}

export function NotebookViewer({ notebook, onClose, onNotebookDeleted }: NotebookViewerProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [previewingSource, setPreviewingSource] = useState<NotebookSource | null>(null)

  // Debug: Log notebook data
  console.log('NotebookViewer - notebook:', notebook)
  console.log('NotebookViewer - sources:', notebook.sources)
  console.log('NotebookViewer - sources length:', notebook.sources?.length || 0)

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

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notebooks/${notebook.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onNotebookDeleted(notebook.id)
        onClose()
      } else {
        throw new Error('Failed to delete notebook')
      }
    } catch (error) {
      console.error('Error deleting notebook:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleSourceClick = (source: NotebookSource) => {
    console.log('Source clicked:', source)
    console.log('Source type:', source.type)
    console.log('Source URL:', source.url)
    console.log('Source fileData:', source.fileData ? 'Present' : 'Not present')
    
    if (source.url) {
      // Special handling for YouTube URLs
      if (source.type === 'YouTube' || isYouTubeUrl(source.url)) {
        window.open(source.url, '_blank', 'noopener,noreferrer')
        return
      }
      
      // For PDF files with URL, show preview
      if (source.type === 'PDF') {
        setPreviewingSource(source)
        return
      }
      
      // If it's a Supabase Storage URL or other URL, open directly
      if (source.url.includes('supabase') || source.url.includes('http')) {
        window.open(source.url, '_blank', 'noopener,noreferrer')
      } else {
        // Download the file
        const link = document.createElement('a')
        link.href = source.url
        link.download = source.name
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else if (source.fileData) {
      // Fallback to base64 data
      if (source.type === 'PDF') {
        setPreviewingSource(source)
      } else {
        downloadFile(source)
      }
    }
  }

  const downloadFile = (source: NotebookSource) => {
    try {
      const byteCharacters = atob(source.fileData!)
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

  const getPreviewUrl = (source: NotebookSource) => {
    // If source has URL, use it directly
    if (source.url) {
      return source.url
    }
    
    // Fallback to base64 data
    if (!source.fileData) return ''
    const byteCharacters = atob(source.fileData)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    return URL.createObjectURL(blob)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{notebook.emoji || '📚'}</div>
              <div>
                <CardTitle className="text-2xl">{notebook.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {notebook.author.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(notebook.createdAt).toLocaleDateString()}
                  </span>
                  <Badge variant="outline">
                    {notebook._count.sources} sources
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {notebook.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{notebook.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Sources ({notebook.sources?.length || 0})</h3>
            {!notebook.sources || notebook.sources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sources uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notebook.sources?.map((source) => (
                  <Card 
                    key={source.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleSourceClick(source)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0">
                            {getSourceIcon(source.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{source.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {source.type}
                              </Badge>
                              {source.fileSize && (
                                <span>{formatFileSize(source.fileSize)}</span>
                              )}
                              <span>•</span>
                              <span>{new Date(source.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2 flex gap-1">
                          {source.url ? (
                            <>
                              {source.type === 'PDF' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setPreviewingSource(source)
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
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
                            </>
                          ) : source.fileData ? (
                            <>
                              {source.type === 'PDF' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setPreviewingSource(source)
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadFile(source)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Delete Notebook
              </CardTitle>
              <CardDescription>
                Are you sure you want to delete "{notebook.title}"? This action cannot be undone.
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

      {/* PDF Preview Modal */}
      {previewingSource && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {previewingSource.name}
                  </CardTitle>
                  <CardDescription>
                    PDF Preview
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(previewingSource)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewingSource(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="w-full h-full">
                <iframe
                  src={getPreviewUrl(previewingSource)}
                  className="w-full h-full border-0 rounded-lg"
                  title={previewingSource.name}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
