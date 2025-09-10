'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  X, 
  FileText, 
  Globe, 
  Video, 
  Plus,
  AlertCircle
} from 'lucide-react'

interface NotebookUploadProps {
  communityId: string
  onNotebookCreated: (notebook: any) => void
  onClose: () => void
}

export function NotebookUpload({ communityId, onNotebookCreated, onClose }: NotebookUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [currentView, setCurrentView] = useState('main')
  const [websiteUrls, setWebsiteUrls] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [notebookTitle, setNotebookTitle] = useState('')
  const [notebookDescription, setNotebookDescription] = useState('')
  const [notebookEmoji, setNotebookEmoji] = useState('📚')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]
        resolve(base64 || '')
      }
      reader.onerror = error => reject(error)
    })
  }

  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    setUploadedFiles(prev => [...prev, ...fileArray])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    processFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      processFiles(files)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!notebookTitle.trim()) {
      setError('Please enter a notebook title')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // Create notebook
      const notebookData = {
        title: notebookTitle,
        description: notebookDescription || null,
        emoji: notebookEmoji,
        communityId
      }

      const notebookResponse = await fetch(`/api/communities/${communityId}/notebooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notebookData),
      })

      if (!notebookResponse.ok) {
        const errorData = await notebookResponse.json()
        console.error('Notebook creation failed:', errorData)
        throw new Error(errorData.error || 'Failed to create notebook')
      }

      const notebook = await notebookResponse.json()
      console.log('Notebook created successfully:', notebook)

      // Upload sources
      const sources = []

      // Process uploaded files
      for (const file of uploadedFiles) {
        // Upload file to Supabase Storage
        const formData = new FormData()
        formData.append('file', file)
        
        const uploadResponse = await fetch('/api/upload-supabase', {
          method: 'POST',
          body: formData,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          console.log('File upload successful:', file.name, uploadData.url)
          const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
          console.log('File type detection:', {
            fileName: file.name,
            mimeType: file.type,
            isPdf: isPdf
          })
          
          sources.push({
            name: file.name,
            type: isPdf ? 'PDF' : 'FILE',
            sourceType: 'file',
            url: uploadData.url,
            fileSize: file.size,
            notebookId: notebook.id
          })
        } else {
          console.error('Failed to upload file:', file.name)
          // Fallback to base64 storage for small files
          if (file.size < 5 * 1024 * 1024) { // 5MB limit
            const base64Data = await fileToBase64(file)
            const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')
            sources.push({
              name: file.name,
              type: isPdf ? 'PDF' : 'FILE',
              sourceType: 'file',
              fileData: base64Data,
              fileSize: file.size,
              notebookId: notebook.id
            })
          }
        }
      }

      // Process website URLs
      if (websiteUrls.trim()) {
        const urls = websiteUrls.split(/[\n\s]+/).filter(url => url.trim())
        for (const url of urls) {
          sources.push({
            name: url,
            type: 'Website',
            sourceType: 'url',
            url: url,
            notebookId: notebook.id
          })
        }
      }

      // Process YouTube URLs
      if (youtubeUrl.trim()) {
        const urls = youtubeUrl.split(/[\n\s]+/).filter(url => url.trim())
        for (const url of urls) {
          console.log('Processing YouTube URL:', url)
          sources.push({
            name: url,
            type: 'YouTube',
            sourceType: 'youtube',
            url: url,
            notebookId: notebook.id
          })
        }
      }

      // Upload sources
      console.log('All sources prepared:', sources)
      console.log('Sources with URLs:', sources.filter(s => s.url))
      console.log('Sources with fileData:', sources.filter(s => s.fileData))
      
      if (sources.length > 0) {
        console.log('Uploading sources:', sources.length)
        const sourcesResponse = await fetch(`/api/communities/${communityId}/notebooks/${notebook.id}/sources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sources }),
        })

        if (!sourcesResponse.ok) {
          const errorData = await sourcesResponse.json()
          console.error('Sources upload failed:', errorData)
          throw new Error(errorData.error || 'Failed to upload sources')
        }
        
        console.log('Sources uploaded successfully')
      }

      onNotebookCreated(notebook)
    } catch (error) {
      console.error('Error creating notebook:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create notebook. Please try again.'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Notebook Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Notebook Title *</Label>
          <Input
            id="title"
            value={notebookTitle}
            onChange={(e) => setNotebookTitle(e.target.value)}
            placeholder="Enter notebook title"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={notebookDescription}
            onChange={(e) => setNotebookDescription(e.target.value)}
            placeholder="Enter notebook description"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="emoji">Emoji</Label>
          <Input
            id="emoji"
            value={notebookEmoji}
            onChange={(e) => setNotebookEmoji(e.target.value)}
            placeholder="📚"
            className="mt-1 w-20"
            maxLength={2}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag & drop files or <span className="text-primary cursor-pointer hover:underline">choose files</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Supported: PDF, TXT, MD, MP3, WAV, M4A
          </p>
        </div>

        <input
          type="file"
          multiple
          accept=".pdf,.txt,.md,.mp3,.wav,.m4a"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg cursor-pointer transition-colors hover:bg-primary/90"
        >
          Choose Files
        </label>
      </div>

      {/* Alternative Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Website URLs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentView('website')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Websites
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-500" />
              <CardTitle className="text-base">YouTube URLs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setCurrentView('youtube')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add YouTube
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderWebsiteView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('main')}
        >
          <X className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Add Website URLs</h3>
      </div>
      
      <div>
        <Label htmlFor="website-urls">Website URLs</Label>
        <Textarea
          id="website-urls"
          value={websiteUrls}
          onChange={(e) => setWebsiteUrls(e.target.value)}
          placeholder="https://example.com/article1&#10;https://example.com/article2"
          className="mt-1"
          rows={6}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Separate multiple URLs with new lines or spaces
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setCurrentView('main')}>
          Cancel
        </Button>
        <Button onClick={() => setCurrentView('main')}>
          Add URLs
        </Button>
      </div>
    </div>
  )

  const renderYouTubeView = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('main')}
        >
          <X className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Add YouTube URLs</h3>
      </div>
      
      <div>
        <Label htmlFor="youtube-urls">YouTube URLs</Label>
        <Textarea
          id="youtube-urls"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=...&#10;https://www.youtube.com/watch?v=..."
          className="mt-1"
          rows={6}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Separate multiple URLs with new lines or spaces
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setCurrentView('main')}>
          Cancel
        </Button>
        <Button onClick={() => setCurrentView('main')}>
          Add URLs
        </Button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Notebook</CardTitle>
              <CardDescription>
                Upload files and add sources to create a shared notebook
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {currentView === 'main' && renderMainView()}
          {currentView === 'website' && renderWebsiteView()}
          {currentView === 'youtube' && renderYouTubeView()}

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || !notebookTitle.trim()}
            >
              {isUploading ? 'Creating...' : 'Create Notebook'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
