# Supabase Storage 设置指南

## 问题解决

你遇到的 "no source update yet" 问题是因为文件没有正确上传到 Supabase Storage。按照以下步骤设置：

## 1. 环境变量配置

在你的 `.env.local` 文件中添加以下 Supabase 配置：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

## 2. 获取 Supabase 凭据

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制以下信息：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`

## 3. 创建 Storage Bucket

在 Supabase Dashboard 中：

1. 进入 Storage
2. 点击 "New bucket"
3. 创建名为 `community-files` 的 bucket
4. 设置为 Public bucket（这样文件可以被公开访问）

## 4. 设置 Bucket 权限

在 Storage > community-files > Settings 中：

1. 进入 Policies 标签
2. 添加以下策略：

### 上传策略 (INSERT)
```sql
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'community-files' 
  AND auth.role() = 'authenticated'
);
```

### 读取策略 (SELECT)
```sql
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'community-files');
```

### 删除策略 (DELETE)
```sql
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'community-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 5. 测试文件上传

设置完成后，重新启动开发服务器：

```bash
npm run dev
```

然后尝试在社区中创建 notebook 并上传文件。

## 6. 故障排除

如果仍然遇到问题：

1. **检查环境变量**：确保所有 Supabase 环境变量都正确设置
2. **检查网络**：确保可以访问 Supabase 服务
3. **检查控制台**：查看浏览器控制台和服务器日志中的错误信息
4. **检查 Storage**：在 Supabase Dashboard 中查看文件是否成功上传

## 7. 文件访问

设置完成后，上传的文件将：
- 存储在 Supabase Storage 中
- 获得公共 URL
- 可以被社区中的任何人访问
- 支持直接下载和预览

## 8. 性能优化

- 大文件（>5MB）会使用 Supabase Storage
- 小文件（<5MB）会回退到 base64 存储
- PDF 文件支持内联预览
- 其他文件支持直接下载

这样设置后，你的 shared notebook 功能就能正常工作了！
