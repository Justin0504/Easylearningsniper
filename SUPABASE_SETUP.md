# Supabase Storage Setup Guide

## Problem Resolution

The "no source update yet" issue you're experiencing is because files are not being properly uploaded to Supabase Storage. Follow these steps to set it up:

## 1. Environment Variables Configuration

Add the following Supabase configuration to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## 2. Get Supabase Credentials

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the following information:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Create Storage Bucket

In the Supabase Dashboard:

1. Go to Storage
2. Click "New bucket"
3. Create a bucket named `community-files`
4. Set it as a Public bucket (so files can be publicly accessed)

## 4. Set Bucket Permissions

In Storage > community-files > Settings:

1. Go to the Policies tab
2. Add the following policies:

### Upload Policy (INSERT)
```sql
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'community-files' 
  AND auth.role() = 'authenticated'
);
```

### Read Policy (SELECT)
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'community-files');
```

### Delete Policy (DELETE)
```sql
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'community-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 5. Test File Upload

After setup, restart your development server:

```bash
npm run dev
```

Then try creating a notebook in a community and uploading files.

## 6. Troubleshooting

If you still encounter issues:

1. **Check Environment Variables**: Ensure all Supabase environment variables are correctly set
2. **Check Network**: Ensure you can access Supabase services
3. **Check Console**: Look at browser console and server logs for error messages
4. **Check Storage**: Verify in Supabase Dashboard that files are successfully uploaded

## 7. File Access

After setup, uploaded files will:
- Be stored in Supabase Storage
- Get public URLs
- Be accessible by anyone in the community
- Support direct download and preview

## 8. Performance Optimization

- Large files (>5MB) will use Supabase Storage
- Small files (<5MB) will fall back to base64 storage
- PDF files support inline preview
- Other files support direct download

## 9. Security Considerations

### File Type Validation
Ensure your application validates file types before upload:

```typescript
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'];
const maxFileSize = 10 * 1024 * 1024; // 10MB
```

### Access Control
- Files are publicly accessible by default
- Consider implementing user-specific access controls
- Monitor storage usage and costs

### Content Moderation
- Implement file content scanning
- Add virus scanning for uploaded files
- Consider implementing content filtering

## 10. Monitoring and Maintenance

### Storage Usage
- Monitor storage usage in Supabase Dashboard
- Set up alerts for storage limits
- Implement cleanup policies for old files

### Performance Monitoring
- Track upload/download speeds
- Monitor API response times
- Set up error tracking

### Cost Management
- Monitor Supabase storage costs
- Implement file compression
- Consider CDN integration for better performance

## 11. Advanced Configuration

### Custom Storage Policies
For more granular control, you can create custom policies:

```sql
-- Allow users to upload only to their own folders
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'community-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow community members to read files
CREATE POLICY "Community members can read files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'community-files' 
  AND EXISTS (
    SELECT 1 FROM communities 
    WHERE id = (storage.foldername(name))[2]::uuid
    AND members @> to_jsonb(auth.uid()::text)
  )
);
```

### File Processing
Consider implementing file processing pipelines:

```typescript
// Example: Process uploaded images
const processImage = async (file: File) => {
  // Resize, compress, or convert images
  // Generate thumbnails
  // Extract metadata
};
```

## 12. Migration from Other Storage

If migrating from other storage solutions:

1. **Export existing files** from current storage
2. **Upload to Supabase** using the migration script
3. **Update file URLs** in your database
4. **Test thoroughly** before switching

### Migration Script Example
```typescript
import { createClient } from '@supabase/supabase-js';

const migrateFiles = async () => {
  const supabase = createClient(url, key);
  
  // Upload files to Supabase
  // Update database records
  // Verify migration success
};
```

After this setup, your shared notebook functionality will work perfectly!