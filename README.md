# AI Learning Community Platform

一个供学生学习AI知识的社区平台，具有智能内容组织和总结功能。

## 功能特性

### 🎯 核心功能
- **社区管理**: 创建和加入AI学习社区
- **多类型内容分享**: 支持视频、PDF、幻灯片、语音笔记和文本帖子
- **AI智能分类**: 自动将帖子按类型分类（AI课程、论文、技术文档等）
- **每日AI总结**: 自动生成社区每日活动总结
- **智能资源检索**: AI自动搜索并推荐相关学习资源

### 🚀 技术栈
- **前端**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL
- **认证**: NextAuth.js
- **AI集成**: OpenAI GPT-3.5-turbo
- **文件上传**: 支持多种文件类型

## 快速开始

### 1. 环境设置

复制环境变量文件：
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入以下配置：

```env
# 数据库
DATABASE_URL="postgresql://username:password@localhost:5432/ai_learning_community"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (可选)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# 文件上传 (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

### 2. 安装依赖

```bash
npm install
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证相关
│   │   ├── communities/   # 社区管理
│   │   ├── ai/           # AI 功能
│   │   └── upload/       # 文件上传
│   ├── communities/       # 社区页面
│   ├── profile/          # 用户资料
│   └── auth/             # 认证页面
├── components/            # React 组件
│   └── ui/               # UI 组件库
├── lib/                  # 工具库
│   ├── prisma.ts         # 数据库连接
│   ├── auth.ts           # 认证配置
│   └── ai.ts             # AI 功能
└── prisma/               # 数据库模式
    └── schema.prisma     # Prisma 模式定义
```

## 主要功能说明

### 1. 社区管理
- 用户可以创建公开或私有的学习社区
- 支持搜索和发现社区
- 社区成员管理

### 2. 内容分享
- 支持多种内容类型：
  - 📝 文本帖子
  - 🎥 视频文件
  - 📄 PDF 文档
  - 🖼️ 幻灯片/图片
  - 🎤 语音笔记
- 拖拽上传文件
- 文件类型验证

### 3. AI 智能功能
- **自动分类**: 使用 OpenAI 分析帖子内容并自动分类
- **每日总结**: 每天结束时生成社区活动总结
- **资源推荐**: 根据社区主题自动搜索相关学习资源

### 4. 用户体验
- 响应式设计，支持移动端
- 现代化 UI 组件
- 实时状态更新
- 用户个人资料和统计

## API 端点

### 社区相关
- `GET /api/communities` - 获取社区列表
- `POST /api/communities` - 创建社区
- `GET /api/communities/[id]` - 获取社区详情
- `POST /api/communities/[id]/join` - 加入社区

### 帖子相关
- `GET /api/communities/[id]/posts` - 获取社区帖子
- `POST /api/communities/[id]/posts` - 创建帖子

### AI 功能
- `POST /api/ai/summary` - 生成每日总结
- `POST /api/ai/resources` - 搜索相关资源

### 文件上传
- `POST /api/upload` - 上传文件

## 部署

### Vercel 部署
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 数据库
推荐使用 PostgreSQL 数据库：
- [Supabase](https://supabase.com)
- [PlanetScale](https://planetscale.com)
- [Railway](https://railway.app)

## 开发说明

### 添加新的帖子类型
1. 在 `prisma/schema.prisma` 中的 `PostType` 枚举添加新类型
2. 在 `app/communities/[id]/create-post/page.tsx` 中添加 UI 选项
3. 更新文件类型验证逻辑

### 自定义 AI 功能
编辑 `lib/ai.ts` 文件来自定义：
- 内容分类逻辑
- 总结生成提示
- 资源搜索策略

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
