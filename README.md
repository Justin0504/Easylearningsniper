# EasyLearning Sniper - AI-Powered Learning Community Platform

An intelligent learning community platform that transforms scattered educational content into structured learning materials using advanced AI technology.

## 🎯 Core Features

### **Community Management**
- Create and join AI learning communities
- Public and private community support
- Member management and permissions

### **Multi-Format Content Sharing**
- **Text Posts**: Share insights and discussions
- **Video Content**: Upload and share educational videos
- **PDF Documents**: Upload and preview PDF files
- **Slides & Images**: Share presentations and visual content
- **Voice Notes**: Record and share audio content

### **AI-Powered Intelligence**
- **Smart Classification**: Automatically categorize posts (AI Courses, Essays, Technical Docs, etc.)
- **Daily AI Summaries**: Generate community activity summaries
- **Learning Content Generation**: Create flashcards and quizzes from community content
- **Resource Recommendations**: AI-curated learning resources
- **Personalized Learning Paths**: Custom study plans based on user activity

### **Collaborative Learning**
- **Shared Notebooks**: Collaborative knowledge repositories
- **Real-time Discussions**: Community-driven learning
- **Progress Tracking**: Monitor learning achievements
- **Social Features**: Like, comment, and engage with content

## 🚀 Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: Google Gemini 1.5 Flash + OpenAI GPT-3.5-turbo
- **File Storage**: Supabase Storage
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or later
- **npm** or **yarn**
- **PostgreSQL** database (or use cloud providers like Supabase)
- **Git** for version control

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/easylearning-sniper.git
cd easylearning-sniper
```

### 2. Install Dependencies

**Important**: Do not manually download the `node_modules` folder! The following command will automatically install all required dependencies:

```bash
# Install all project dependencies
npm install

# Alternative with yarn
yarn install
```

This will automatically download and install all required packages based on `package.json` and `package-lock.json`.

### 3. Environment Configuration

Copy the environment variables template:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_learning_community"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional but recommended)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENAI_API_KEY="your-openai-api-key-here"
GEMINI_API_KEY="your-gemini-api-key-here"

# Supabase (File Storage)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema to your database
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration Guide

### Database Setup Options

#### Option 1: Supabase (Recommended)
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your database URL from Settings > Database
3. Use the connection string as your `DATABASE_URL`

#### Option 2: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database
3. Use the local connection string

#### Option 3: Other Cloud Providers
- **PlanetScale**: MySQL-compatible
- **Railway**: PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

### AI Service Setup

#### Google Gemini (Recommended)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `GEMINI_API_KEY` in your `.env.local`

#### OpenAI (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `OPENAI_API_KEY` in your `.env.local`

### File Storage Setup

#### Supabase Storage
1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `community-files`
3. Set it as public
4. Configure the required environment variables

## 📁 Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication
│   │   ├── communities/   # Community management
│   │   ├── ai/           # AI functionality
│   │   └── upload/       # File upload
│   ├── communities/       # Community pages
│   ├── profile/          # User profile
│   └── auth/             # Authentication pages
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── learning-section.tsx
│   ├── quiz.tsx
│   └── flashcard.tsx
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database connection
│   ├── auth.ts           # Authentication config
│   ├── ai.ts             # AI functionality
│   └── supabase.ts       # Supabase client
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
└── public/               # Static assets
```

## 🧪 Testing

### Run Tests
```bash
# Test basic functionality
node test-simple.js

# Test API endpoints
node test-api-endpoints.js

# Test daily summary feature
node test-daily-summary.js
```

### Test Checklist
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] AI services responding
- [ ] File upload functionality
- [ ] User authentication
- [ ] Community features

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Configure Domain**
   - Add your custom domain
   - Update `NEXTAUTH_URL` in environment variables

### Environment Variables for Production

```env
# Production Database
DATABASE_URL="postgresql://..."

# Production URLs
NEXTAUTH_URL="https://yourdomain.com"

# All other variables remain the same
```

## 🔍 API Endpoints

### Community Management
- `GET /api/communities` - List all communities
- `POST /api/communities` - Create new community
- `GET /api/communities/[id]` - Get community details
- `POST /api/communities/[id]/join` - Join community

### Content Management
- `GET /api/communities/[id]/posts` - Get community posts
- `POST /api/communities/[id]/posts` - Create new post
- `POST /api/communities/[id]/notebooks` - Create shared notebook

### AI Features
- `POST /api/ai/summary` - Generate daily summary
- `POST /api/communities/[id]/learning` - Generate learning content
- `POST /api/ai/resources` - Find relevant resources

### File Management
- `POST /api/upload` - Upload files
- `POST /api/upload-supabase` - Upload to Supabase Storage

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Module Not Found
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Issue 2: Database Connection Error
- Check your `DATABASE_URL` in `.env.local`
- Ensure your database is running
- Verify network connectivity

#### Issue 3: AI Services Not Working
- Verify API keys are correct
- Check API quotas and limits
- Review console logs for specific errors

#### Issue 4: File Upload Issues
- Check Supabase configuration
- Verify bucket permissions
- Ensure file size limits are appropriate

### Getting Help

1. **Check the logs**: Look at browser console and terminal output
2. **Review documentation**: Check this README and other `.md` files
3. **Test components**: Use the provided test scripts
4. **Community support**: Create an issue on GitHub

## 📚 Additional Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Shared Notebook Feature](./SHARED_NOTEBOOK_FEATURE.md)
- [Testing Guide](./TESTING_GUIDE.md)

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Supabase team for the backend services
- Google and OpenAI for AI capabilities
- All contributors and users

---

**Happy Learning! 🎓✨**