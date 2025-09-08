# Shared Notebook Feature

## 概述

Shared Notebook 功能已经成功集成到你的 EasyLearning 项目中。这个功能允许社区成员创建和共享协作学习资源，包括文档、网站链接和 YouTube 视频。

## 功能特性

### 1. 核心功能
- **创建笔记本**: 社区成员可以创建共享笔记本
- **多种源类型**: 支持 PDF 文件、网站 URL 和 YouTube 视频
- **协作学习**: 所有社区成员都可以查看和贡献内容
- **统一 UI**: 与现有项目 UI 风格保持一致

### 2. 数据模型
- **Notebook**: 存储笔记本基本信息（标题、描述、表情符号）
- **NotebookSource**: 存储各种类型的源文件（PDF、网站、YouTube）

### 3. 用户界面
- **社区页面**: 新增 "Shared Notebooks" 标签页
- **创建按钮**: 在 "Create Post" 旁添加 "Create Note" 按钮
- **上传界面**: 支持拖拽上传和多种源类型
- **查看器**: 完整的笔记本查看和管理界面

## 使用方法

### 创建笔记本
1. 进入任意社区页面
2. 点击 "Create Note" 按钮或切换到 "Shared Notebooks" 标签页
3. 填写笔记本标题、描述和表情符号
4. 上传文件或添加网站/YouTube 链接
5. 点击 "Create Notebook" 完成创建

### 查看笔记本
1. 在社区页面切换到 "Shared Notebooks" 标签页
2. 浏览所有可用的共享笔记本
3. 点击任意笔记本查看详细信息和源文件

### 管理笔记本
- 只有笔记本创建者或社区管理员可以删除笔记本
- 源文件会在删除笔记本时自动清理

## 技术实现

### 数据库更改
- 新增 `Notebook` 模型
- 新增 `NotebookSource` 模型
- 更新 `User` 和 `Community` 模型以支持关系

### API 端点
- `GET/POST /api/communities/[id]/notebooks` - 获取/创建笔记本
- `POST /api/communities/[id]/notebooks/[notebookId]/sources` - 添加源文件
- `DELETE /api/notebooks/[id]` - 删除笔记本

### 组件结构
- `SharedNotebook` - 主笔记本列表组件
- `NotebookUpload` - 笔记本创建/上传组件
- `NotebookViewer` - 笔记本查看器组件

## 文件结构

```
components/
├── shared-notebook.tsx      # 主笔记本组件
├── notebook-upload.tsx      # 上传组件
└── notebook-viewer.tsx      # 查看器组件

app/api/
├── communities/[id]/notebooks/
│   ├── route.ts             # 笔记本 CRUD
│   └── [notebookId]/sources/
│       └── route.ts         # 源文件管理
└── notebooks/[id]/
    └── route.ts             # 笔记本删除

prisma/
└── schema.prisma            # 更新的数据模型
```

## 部署说明

1. **数据库迁移**: 运行 `npx prisma generate` 生成新的 Prisma 客户端
2. **环境变量**: 确保 Supabase 配置正确
3. **权限设置**: 确保用户有适当的社区访问权限

## 未来扩展

- 添加笔记本搜索和过滤功能
- 实现源文件的预览功能
- 添加笔记本评论和评分系统
- 支持更多文件类型（音频、图片等）
- 实现笔记本版本控制

## 注意事项

- 大文件上传可能需要调整服务器配置
- 建议设置文件大小限制
- 考虑添加内容审核机制
- 定期清理未使用的源文件

这个功能现在已经完全集成到你的项目中，用户可以在社区中创建和共享学习资源了！
