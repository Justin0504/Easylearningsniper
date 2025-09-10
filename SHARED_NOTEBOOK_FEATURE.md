# Shared Notebook Feature

## Overview

The Shared Notebook feature has been successfully integrated into your EasyLearning project. This feature allows community members to create and share collaborative learning resources, including documents, website links, and YouTube videos.

## Features

### 1. Core Functionality
- **Create Notebooks**: Community members can create shared notebooks
- **Multiple Source Types**: Support for PDF files, website URLs, and YouTube videos
- **Collaborative Learning**: All community members can view and contribute content
- **Unified UI**: Consistent with existing project UI design

### 2. Data Models
- **Notebook**: Stores basic notebook information (title, description, emoji)
- **NotebookSource**: Stores various types of source files (PDF, website, YouTube)

### 3. User Interface
- **Community Page**: New "Shared Notebooks" tab
- **Create Button**: "Create Note" button next to "Create Post"
- **Upload Interface**: Drag-and-drop upload with multiple source types
- **Viewer**: Complete notebook viewing and management interface

## Usage Guide

### Creating a Notebook
1. Go to any community page
2. Click the "Create Note" button or switch to the "Shared Notebooks" tab
3. Fill in notebook title, description, and emoji
4. Upload files or add website/YouTube links
5. Click "Create Notebook" to complete creation

### Viewing Notebooks
1. Switch to the "Shared Notebooks" tab on the community page
2. Browse all available shared notebooks
3. Click any notebook to view detailed information and source files

### Managing Notebooks
- Only notebook creators or community administrators can delete notebooks
- Source files are automatically cleaned up when notebooks are deleted

## Technical Implementation

### Database Changes
- Added `Notebook` model
- Added `NotebookSource` model
- Updated `User` and `Community` models to support relationships

### API Endpoints
- `GET/POST /api/communities/[id]/notebooks` - Get/create notebooks
- `POST /api/communities/[id]/notebooks/[notebookId]/sources` - Add source files
- `DELETE /api/notebooks/[id]` - Delete notebook

### Component Structure
- `SharedNotebook` - Main notebook list component
- `NotebookUpload` - Notebook creation/upload component
- `NotebookViewer` - Notebook viewer component

## File Structure

```
components/
├── shared-notebook.tsx      # Main notebook component
├── notebook-upload.tsx      # Upload component
└── notebook-viewer.tsx      # Viewer component

app/api/
├── communities/[id]/notebooks/
│   ├── route.ts             # Notebook CRUD
│   └── [notebookId]/sources/
│       └── route.ts         # Source file management
└── notebooks/[id]/
    └── route.ts             # Notebook deletion

prisma/
└── schema.prisma            # Updated data models
```

## Deployment Instructions

1. **Database Migration**: Run `npx prisma generate` to generate new Prisma client
2. **Environment Variables**: Ensure Supabase configuration is correct
3. **Permissions**: Ensure users have appropriate community access permissions

## API Documentation

### Create Notebook
```typescript
POST /api/communities/[id]/notebooks
{
  "title": "Machine Learning Basics",
  "description": "Introduction to ML concepts",
  "emoji": "🤖",
  "sources": [
    {
      "name": "ML Tutorial",
      "type": "pdf",
      "fileData": "base64-encoded-data"
    }
  ]
}
```

### Add Source to Notebook
```typescript
POST /api/communities/[id]/notebooks/[notebookId]/sources
{
  "name": "YouTube Video",
  "type": "youtube",
  "url": "https://youtube.com/watch?v=..."
}
```

### Get Community Notebooks
```typescript
GET /api/communities/[id]/notebooks
// Returns array of notebooks with sources
```

## User Experience Features

### Drag and Drop Upload
- Support for multiple file types
- Visual feedback during upload
- Progress indicators
- Error handling for invalid files

### File Preview
- PDF files: Inline preview
- Images: Thumbnail preview
- Videos: Embedded player
- Documents: Download link

### Search and Filter
- Search notebooks by title/description
- Filter by source type
- Sort by creation date
- Tag-based organization

## Security Considerations

### File Upload Security
```typescript
// File type validation
const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'video/mp4'
];

// File size limits
const maxFileSize = 10 * 1024 * 1024; // 10MB
```

### Access Control
- Community members can view all notebooks
- Only creators can edit/delete their notebooks
- Admin users have full access

### Content Moderation
- File content scanning
- Malware detection
- Inappropriate content filtering

## Performance Optimization

### File Storage Strategy
- Large files (>5MB): Supabase Storage
- Small files (<5MB): Base64 in database
- Thumbnails: Generated and cached
- CDN: For better global performance

### Database Optimization
```sql
-- Indexes for better performance
CREATE INDEX idx_notebook_community_id ON notebooks(community_id);
CREATE INDEX idx_notebook_author_id ON notebooks(author_id);
CREATE INDEX idx_notebook_source_notebook_id ON notebook_sources(notebook_id);
```

### Caching Strategy
- Redis for frequently accessed notebooks
- CDN for static file delivery
- Browser caching for UI components

## Future Enhancements

### Planned Features
- **Notebook Search**: Full-text search across notebook content
- **Source Preview**: Enhanced preview for all file types
- **Comments & Ratings**: Community feedback system
- **Version Control**: Track notebook changes over time
- **Export Options**: Download notebooks as PDF/ZIP
- **Collaborative Editing**: Real-time collaborative editing

### Advanced Features
- **AI-Powered Organization**: Auto-categorize notebooks
- **Content Recommendations**: Suggest related notebooks
- **Learning Paths**: Create structured learning sequences
- **Analytics**: Track notebook usage and engagement

## Troubleshooting

### Common Issues

#### File Upload Fails
```bash
# Check Supabase configuration
npm run test:supabase

# Verify file permissions
ls -la public/uploads/
```

#### Database Connection Issues
```bash
# Reset database
npx prisma db push --force-reset

# Regenerate client
npx prisma generate
```

#### UI Not Loading
- Check browser console for errors
- Verify component imports
- Check API endpoint responses

### Debug Mode
Enable debug logging:
```typescript
// In your environment variables
DEBUG=notebook:*
```

## Testing

### Unit Tests
```bash
# Test notebook creation
npm test -- --grep "notebook creation"

# Test file upload
npm test -- --grep "file upload"
```

### Integration Tests
```bash
# Test full workflow
npm run test:integration:notebooks
```

### Manual Testing Checklist
- [ ] Create notebook with PDF
- [ ] Add YouTube video source
- [ ] Upload multiple files
- [ ] Delete notebook
- [ ] View notebook in different browsers
- [ ] Test mobile responsiveness

## Monitoring and Analytics

### Key Metrics
- Notebook creation rate
- File upload success rate
- User engagement with notebooks
- Storage usage trends

### Error Tracking
- File upload failures
- Database connection errors
- API response times
- User error reports

### Performance Monitoring
- Page load times
- File upload speeds
- Database query performance
- Memory usage

## Migration Guide

### From Other Systems
If migrating from other notebook systems:

1. **Export existing data** in JSON format
2. **Transform data** to match new schema
3. **Import using migration script**
4. **Verify data integrity**
5. **Update file URLs** if needed

### Migration Script Example
```typescript
import { prisma } from './lib/prisma';

const migrateNotebooks = async (oldData: any[]) => {
  for (const notebook of oldData) {
    await prisma.notebook.create({
      data: {
        title: notebook.title,
        description: notebook.description,
        emoji: notebook.emoji || '📚',
        communityId: notebook.communityId,
        authorId: notebook.authorId,
        sources: {
          create: notebook.sources.map(source => ({
            name: source.name,
            type: source.type,
            url: source.url,
            fileData: source.fileData
          }))
        }
      }
    });
  }
};
```

This feature is now fully integrated into your project, and users can create and share learning resources in communities!