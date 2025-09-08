'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDropzone } from 'react-dropzone'
import { 
  FileText, 
  Video, 
  Mic, 
  Image, 
  Upload, 
  X,
  File,
  FileImage,
  FileVideo,
  Volume2
} from 'lucide-react'

const POST_TYPES = [
  { value: 'TEXT', label: 'Text', icon: <FileText className="h-4 w-4" /> },
  { value: 'VIDEO', label: 'Video', icon: <Video className="h-4 w-4" /> },
  { value: 'PDF', label: 'PDF', icon: <File className="h-4 w-4" /> },
  { value: 'SLIDES', label: 'Slides', icon: <FileImage className="h-4 w-4" /> },
  { value: 'VOICE_NOTE', label: 'Voice Note', icon: <Mic className="h-4 w-4" /> },
]

const ACCEPTED_FILE_TYPES = {
  'VIDEO': {
    'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    'application/pdf': ['.pdf'],
    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    'audio/*': ['.mp3', '.wav', '.m4a', '.aac']
  }
}

export default function CreatePostPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const communityId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'TEXT' as string,
    topicId: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setUploading(true)
      
      try {
        // Upload file to local storage
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])
        
        const response = await fetch('/api/upload-supabase', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          setUploadedFileUrl(data.url)
          console.log('File uploaded successfully:', data.url)
        } else {
          const error = await response.json()
          console.error('Upload error details:', error)
          alert(`Failed to upload file: ${error.error}${error.details ? ` - ${error.details}` : ''}`)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        alert('Failed to upload file')
      } finally {
        setUploading(false)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: formData.type === 'TEXT' ? {} : ACCEPTED_FILE_TYPES[formData.type as keyof typeof ACCEPTED_FILE_TYPES] || {},
    multiple: false,
    disabled: formData.type === 'TEXT' || uploading
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          fileUrl: uploadedFileUrl,
          fileName: file?.name || null,
          fileType: file?.type || null,
          fileSize: file?.size || null,
        }),
      })

      if (response.ok) {
        router.push(`/communities/${communityId}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <FileVideo className="h-8 w-8 text-red-500" />
      case 'PDF': return <File className="h-8 w-8 text-blue-500" />
      case 'SLIDES': return <FileImage className="h-8 w-8 text-green-500" />
      case 'VOICE_NOTE': return <Volume2 className="h-8 w-8 text-purple-500" />
      default: return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to create a post</h1>
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">Share your knowledge with the community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>
                Choose the type of content you want to share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter a descriptive title..."
                    required
                  />
                </div>

                {formData.type === 'TEXT' && (
                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your post content here..."
                      rows={8}
                      required
                    />
                  </div>
                )}

                {formData.type !== 'TEXT' && (
                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-primary/50'
                      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input {...getInputProps()} />
                      {file ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            {getFileIcon(formData.type)}
                          </div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFile(null)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                          <div>
                            <p className="font-medium">
                              {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formData.type === 'VIDEO' && 'MP4, MOV, AVI, MKV'}
                              {formData.type === 'PDF' && 'PDF files'}
                              {formData.type === 'SLIDES' && 'JPG, PNG, GIF'}
                              {formData.type === 'VOICE_NOTE' && 'MP3, WAV, M4A, AAC'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {uploading && (
                      <p className="text-sm text-muted-foreground text-center">
                        Uploading file...
                      </p>
                    )}
                  </div>
                )}

                {formData.type !== 'TEXT' && (
                  <div className="space-y-2">
                    <Label htmlFor="content">Description (Optional)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Add a description or additional context..."
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || uploading || !formData.title || (formData.type !== 'TEXT' && !uploadedFileUrl)}
                  >
                    {loading ? 'Creating...' : 'Create Post'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
