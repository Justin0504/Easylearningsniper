// Enhanced AI Learning Tools - Better Post Analysis and Content Generation

interface Post {
  id: string
  title: string
  content: string | null
  type: string
  createdAt: string
  author: {
    name: string | null
  }
  categories: any[]
  _count: {
    likes: number
    comments: number
  }
}

interface ProcessedPost {
  id: string
  title: string
  content: string
  type: string
  keyTopics: string[]
  mainConcepts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  summary: string
  createdAt: string
  author: string
  engagement: number
}

// Extract key topics and concepts from post content
function extractKeyTopics(content: string): string[] {
  const topics: string[] = []
  
  // Common AI/ML/Programming keywords
  const keywords = [
    'machine learning', 'deep learning', 'neural network', 'artificial intelligence',
    'python', 'javascript', 'react', 'next.js', 'typescript', 'node.js',
    'algorithm', 'data structure', 'database', 'API', 'frontend', 'backend',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    'web development', 'mobile development', 'cloud computing', 'AWS', 'Azure',
    'docker', 'kubernetes', 'microservices', 'agile', 'devops'
  ]
  
  const lowerContent = content.toLowerCase()
  keywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      topics.push(keyword)
    }
  })
  
  return [...new Set(topics)] // Remove duplicates
}

// Extract main concepts from post content
function extractMainConcepts(content: string): string[] {
  const concepts: string[] = []
  
  // Look for technical terms and concepts
  const conceptPatterns = [
    /\b(?:function|class|method|variable|constant|interface|type|enum)\s+(\w+)/gi,
    /\b(?:algorithm|pattern|framework|library|tool|technology)\s+(\w+)/gi,
    /\b(?:concept|principle|theory|approach|technique|strategy)\s+(\w+)/gi
  ]
  
  conceptPatterns.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      concepts.push(...matches.map(match => match.split(' ').pop() || '').filter(Boolean))
    }
  })
  
  return [...new Set(concepts)].slice(0, 5) // Limit to 5 main concepts
}

// Determine post difficulty based on content analysis
function determineDifficulty(content: string, title: string): 'beginner' | 'intermediate' | 'advanced' {
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  
  // Advanced indicators
  const advancedTerms = [
    'optimization', 'performance', 'scalability', 'architecture', 'enterprise',
    'microservices', 'distributed', 'concurrent', 'asynchronous', 'advanced',
    'complex', 'sophisticated', 'enterprise-grade', 'production-ready'
  ]
  
  // Beginner indicators
  const beginnerTerms = [
    'introduction', 'getting started', 'tutorial', 'basics', 'fundamentals',
    'beginner', 'simple', 'easy', 'basic', 'overview', 'guide'
  ]
  
  const advancedCount = advancedTerms.filter(term => 
    lowerContent.includes(term) || lowerTitle.includes(term)
  ).length
  
  const beginnerCount = beginnerTerms.filter(term => 
    lowerContent.includes(term) || lowerTitle.includes(term)
  ).length
  
  if (advancedCount > beginnerCount && advancedCount > 2) return 'advanced'
  if (beginnerCount > advancedCount && beginnerCount > 2) return 'beginner'
  return 'intermediate'
}

// Categorize post based on content
function categorizePost(content: string, title: string, type: string): string {
  const lowerContent = content.toLowerCase()
  const lowerTitle = title.toLowerCase()
  
  if (type === 'PDF' || lowerContent.includes('document') || lowerContent.includes('paper')) {
    return 'Documentation'
  }
  if (type === 'VIDEO' || lowerContent.includes('video') || lowerContent.includes('tutorial')) {
    return 'Tutorial'
  }
  if (lowerContent.includes('question') || lowerContent.includes('help') || lowerContent.includes('problem')) {
    return 'Q&A'
  }
  if (lowerContent.includes('project') || lowerContent.includes('build') || lowerContent.includes('create')) {
    return 'Project'
  }
  if (lowerContent.includes('news') || lowerContent.includes('update') || lowerContent.includes('announcement')) {
    return 'News'
  }
  if (lowerContent.includes('code') || lowerContent.includes('programming') || lowerContent.includes('development')) {
    return 'Programming'
  }
  if (lowerContent.includes('ai') || lowerContent.includes('machine learning') || lowerContent.includes('neural')) {
    return 'AI/ML'
  }
  
  return 'General'
}

// Generate summary of post content
function generateSummary(content: string, title: string): string {
  // Simple extractive summarization - take first 2-3 sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences.slice(0, 2).join('. ').trim() + '.'
}

// Process posts to extract meaningful information
export function processPosts(posts: Post[]): ProcessedPost[] {
  return posts.map(post => {
    const content = post.content || ''
    const keyTopics = extractKeyTopics(content)
    const mainConcepts = extractMainConcepts(content)
    const difficulty = determineDifficulty(content, post.title)
    const category = categorizePost(content, post.title, post.type)
    const summary = generateSummary(content, post.title)
    const engagement = post._count.likes + post._count.comments
    
    return {
      id: post.id,
      title: post.title,
      content: content,
      type: post.type,
      keyTopics,
      mainConcepts,
      difficulty,
      category,
      summary,
      createdAt: post.createdAt,
      author: post.author.name || 'Unknown',
      engagement
    }
  })
}

// Enhanced prompt templates with better post analysis
const ENHANCED_FLASHCARD_PROMPT = `Based on these detailed community posts, generate {count} educational flashcards:

POSTS ANALYSIS:
{posts}

INSTRUCTIONS:
- Focus on the key topics and main concepts identified in each post
- Create questions that test understanding of the specific content shared
- Use the difficulty level and category information to guide question complexity
- Ensure questions are directly related to the actual post content
- Include source attribution to specific posts

Return JSON array: [{"id":"1","question":"Q?","answer":"A","category":"AI","difficulty":"Easy","source":"Post title","postId":"post_id"}]`

const ENHANCED_QUIZ_PROMPT = `Based on these detailed community posts, generate {count} {difficulty} quiz questions:

POSTS ANALYSIS:
{posts}

INSTRUCTIONS:
- Create questions that test understanding of the specific concepts discussed in the posts
- Use the key topics and main concepts to guide question creation
- Ensure questions are directly related to the actual post content
- Include detailed explanations that reference the source material
- Use the difficulty level to determine question complexity
- Include source attribution to specific posts

Return JSON array: [{"id":"1","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"E","category":"AI","difficulty":"Easy","source":"Post title","postId":"post_id"}]`

// Enhanced content generation with better post analysis
export async function generateEnhancedFlashcards(posts: Post[], count: number = 5): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockFlashcards(posts, count)
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    })
    
    // Process posts to extract meaningful information
    const processedPosts = processPosts(posts)
    
    // Create detailed post analysis for AI
    const postAnalysis = processedPosts.map(post => `
POST: ${post.title}
Author: ${post.author}
Category: ${post.category}
Difficulty: ${post.difficulty}
Key Topics: ${post.keyTopics.join(', ')}
Main Concepts: ${post.mainConcepts.join(', ')}
Summary: ${post.summary}
Content: ${post.content.substring(0, 500)}...
Engagement: ${post.engagement} interactions
---`).join('\n')

    const prompt = ENHANCED_FLASHCARD_PROMPT
      .replace('{count}', count.toString())
      .replace('{posts}', postAnalysis)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const flashcards = JSON.parse(content)
      return Array.isArray(flashcards) ? flashcards : generateMockFlashcards(posts, count)
    } catch {
      return generateMockFlashcards(posts, count)
    }
  } catch (error) {
    console.error('Error generating enhanced flashcards:', error)
    return generateMockFlashcards(posts, count)
  }
}

export async function generateEnhancedQuiz(posts: Post[], questionCount: number = 3, difficulty: string = 'mixed'): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockQuiz(posts, questionCount, difficulty)
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      }
    })
    
    // Process posts to extract meaningful information
    const processedPosts = processPosts(posts)
    
    // Create detailed post analysis for AI
    const postAnalysis = processedPosts.map(post => `
POST: ${post.title}
Author: ${post.author}
Category: ${post.category}
Difficulty: ${post.difficulty}
Key Topics: ${post.keyTopics.join(', ')}
Main Concepts: ${post.mainConcepts.join(', ')}
Summary: ${post.summary}
Content: ${post.content.substring(0, 500)}...
Engagement: ${post.engagement} interactions
---`).join('\n')

    const prompt = ENHANCED_QUIZ_PROMPT
      .replace('{count}', questionCount.toString())
      .replace('{difficulty}', difficulty)
      .replace('{posts}', postAnalysis)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const quiz = JSON.parse(content)
      return Array.isArray(quiz) ? quiz : generateMockQuiz(posts, questionCount, difficulty)
    } catch {
      return generateMockQuiz(posts, questionCount, difficulty)
    }
  } catch (error) {
    console.error('Error generating enhanced quiz:', error)
    return generateMockQuiz(posts, questionCount, difficulty)
  }
}

// Parallel generation for both flashcards and quiz
export async function generateEnhancedLearningContent(
  posts: Post[], 
  quizCount: number = 3, 
  flashcardCount: number = 3, 
  quizDifficulty: string = 'mixed'
): Promise<{ flashcards: any[], quiz: any[] }> {
  try {
    const [flashcards, quiz] = await Promise.all([
      generateEnhancedFlashcards(posts, flashcardCount),
      generateEnhancedQuiz(posts, quizCount, quizDifficulty)
    ])
    
    return { flashcards, quiz }
  } catch (error) {
    console.error('Error generating enhanced learning content:', error)
    return { 
      flashcards: generateMockFlashcards(posts, flashcardCount), 
      quiz: generateMockQuiz(posts, quizCount, quizDifficulty) 
    }
  }
}

// Mock data generators (fallback)
function generateMockFlashcards(posts: Post[], count: number): any[] {
  const mockFlashcards = []
  for (let i = 0; i < Math.min(count, posts.length); i++) {
    const post = posts[i]
    mockFlashcards.push({
      id: `mock_flashcard_${i + 1}`,
      question: `What is the main topic discussed in "${post.title}"?`,
      answer: `This post discusses ${post.title} and covers various aspects of the topic.`,
      category: 'General',
      difficulty: 'Easy',
      source: post.title,
      postId: post.id
    })
  }
  return mockFlashcards
}

function generateMockQuiz(posts: Post[], count: number, difficulty: string): any[] {
  const mockQuiz = []
  for (let i = 0; i < Math.min(count, posts.length); i++) {
    const post = posts[i]
    mockQuiz.push({
      id: `mock_quiz_${i + 1}`,
      question: `What is the primary focus of "${post.title}"?`,
      options: [
        'Technical implementation',
        'Theoretical concepts', 
        'Practical applications',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: `The post "${post.title}" covers multiple aspects including technical implementation, theoretical concepts, and practical applications.`,
      category: 'General',
      difficulty: difficulty === 'mixed' ? 'Easy' : difficulty,
      source: post.title,
      postId: post.id
    })
  }
  return mockQuiz
}
