// Simplified AI Learning Tools - Focus on Topic Keywords and Knowledge Points

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

interface TopicAnalysis {
  mainTopics: string[]
  knowledgePoints: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

// Extract main topics from post title and content
function extractMainTopics(title: string, content: string): string[] {
  const topics: string[] = []
  
  // Common AI/ML/Programming topic keywords
  const topicKeywords = [
    // AI/ML Topics
    'machine learning', 'deep learning', 'neural network', 'artificial intelligence',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'opencv',
    'computer vision', 'natural language processing', 'nlp', 'reinforcement learning',
    'supervised learning', 'unsupervised learning', 'clustering', 'classification',
    'regression', 'feature engineering', 'model training', 'hyperparameter tuning',
    
    // Programming Languages & Frameworks
    'python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'vue.js',
    'angular', 'django', 'flask', 'express', 'fastapi', 'spring boot',
    'java', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin',
    
    // Web Development
    'frontend', 'backend', 'full stack', 'responsive design', 'api', 'rest api',
    'graphql', 'websocket', 'microservices', 'serverless', 'jwt', 'oauth',
    'html', 'css', 'bootstrap', 'tailwind', 'sass', 'less',
    
    // Database & Storage
    'database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis',
    'elasticsearch', 'data modeling', 'indexing', 'query optimization',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins',
    'terraform', 'ansible', 'monitoring', 'logging', 'scaling',
    
    // Data Science
    'data analysis', 'data visualization', 'statistics', 'probability',
    'data mining', 'big data', 'hadoop', 'spark', 'kafka',
    
    // Software Engineering
    'design patterns', 'clean code', 'refactoring', 'testing', 'tdd',
    'agile', 'scrum', 'git', 'version control', 'code review',
    
    // Mobile Development
    'mobile development', 'ios', 'android', 'flutter', 'react native',
    'swift', 'kotlin', 'xamarin', 'cordova',
    
    // Security
    'cybersecurity', 'encryption', 'authentication', 'authorization',
    'vulnerability', 'penetration testing', 'ssl', 'tls'
  ]
  
  const text = `${title} ${content}`.toLowerCase()
  
  topicKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      topics.push(keyword)
    }
  })
  
  // Remove duplicates and return top 5 most relevant topics
  return [...new Set(topics)].slice(0, 5)
}

// Extract knowledge points (concepts, techniques, tools)
function extractKnowledgePoints(title: string, content: string): string[] {
  const knowledgePoints: string[] = []
  
  // Look for specific concepts, techniques, and tools
  const conceptPatterns = [
    // Technical concepts
    /\b(?:algorithm|pattern|framework|library|tool|technology|method|technique|approach|strategy|principle|concept|theory|model|architecture|design|implementation|optimization|performance|scalability|security|testing|deployment|monitoring)\b/gi,
    
    // Programming concepts
    /\b(?:function|class|method|variable|constant|interface|type|enum|object|array|string|number|boolean|null|undefined|callback|promise|async|await|closure|scope|hoisting|prototype|inheritance|polymorphism|encapsulation|abstraction)\b/gi,
    
    // AI/ML concepts
    /\b(?:neural network|deep learning|machine learning|supervised|unsupervised|reinforcement|classification|regression|clustering|feature|model|training|validation|testing|overfitting|underfitting|bias|variance|gradient|optimization|backpropagation|activation|loss|accuracy|precision|recall|f1-score|roc|auc)\b/gi,
    
    // Web development concepts
    /\b(?:component|state|props|hook|lifecycle|routing|middleware|controller|service|repository|entity|migration|seed|factory|singleton|observer|mvc|mvp|mvvm|spa|ssr|csr|pwa|seo|accessibility|responsive|progressive)\b/gi
  ]
  
  const text = `${title} ${content}`
  
  conceptPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      knowledgePoints.push(...matches.map(match => match.toLowerCase()).filter(Boolean))
    }
  })
  
  // Remove duplicates and return top 8 most relevant knowledge points
  return [...new Set(knowledgePoints)].slice(0, 8)
}

// Determine difficulty based on topic complexity - lean towards harder questions
function determineDifficulty(topics: string[], knowledgePoints: string[]): 'beginner' | 'intermediate' | 'advanced' {
  const advancedTopics = [
    'deep learning', 'neural network', 'reinforcement learning', 'microservices',
    'kubernetes', 'distributed', 'concurrent', 'asynchronous', 'optimization',
    'scalability', 'architecture', 'enterprise', 'production', 'advanced',
    'machine learning', 'tensorflow', 'pytorch', 'computer vision', 'nlp',
    'docker', 'aws', 'azure', 'gcp', 'devops', 'ci/cd', 'monitoring'
  ]
  
  const beginnerTopics = [
    'introduction', 'getting started', 'tutorial', 'basics', 'fundamentals',
    'beginner', 'simple', 'easy', 'basic', 'overview', 'guide', 'hello world'
  ]
  
  const advancedConcepts = [
    'optimization', 'performance', 'scalability', 'architecture', 'enterprise',
    'microservices', 'distributed', 'concurrent', 'asynchronous', 'advanced',
    'complex', 'sophisticated', 'production-ready', 'enterprise-grade',
    'algorithm', 'pattern', 'framework', 'library', 'tool', 'technology',
    'method', 'technique', 'approach', 'strategy', 'principle', 'concept'
  ]
  
  const allText = [...topics, ...knowledgePoints].join(' ').toLowerCase()
  
  const advancedCount = advancedTopics.filter(topic => allText.includes(topic)).length +
                       advancedConcepts.filter(concept => allText.includes(concept)).length
  
  const beginnerCount = beginnerTopics.filter(topic => allText.includes(topic)).length
  
  // Lean towards harder questions - only return beginner if explicitly beginner content
  if (beginnerCount > advancedCount && beginnerCount > 3) return 'beginner'
  if (advancedCount > 1) return 'advanced'  // Lower threshold for advanced
  return 'intermediate'
}

// Categorize based on main topics
function categorizeByTopics(topics: string[]): string {
  const aiMlTopics = ['machine learning', 'deep learning', 'neural network', 'artificial intelligence', 'tensorflow', 'pytorch', 'scikit-learn']
  const webTopics = ['react', 'next.js', 'node.js', 'vue.js', 'angular', 'frontend', 'backend', 'api', 'web development']
  const dataTopics = ['data analysis', 'data visualization', 'pandas', 'numpy', 'statistics', 'data science']
  const cloudTopics = ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'cloud', 'devops']
  const mobileTopics = ['mobile development', 'ios', 'android', 'flutter', 'react native']
  const securityTopics = ['cybersecurity', 'encryption', 'authentication', 'security']
  
  if (topics.some(topic => aiMlTopics.includes(topic))) return 'AI/ML'
  if (topics.some(topic => webTopics.includes(topic))) return 'Web Development'
  if (topics.some(topic => dataTopics.includes(topic))) return 'Data Science'
  if (topics.some(topic => cloudTopics.includes(topic))) return 'Cloud/DevOps'
  if (topics.some(topic => mobileTopics.includes(topic))) return 'Mobile Development'
  if (topics.some(topic => securityTopics.includes(topic))) return 'Security'
  
  return 'General Programming'
}

// Analyze posts to extract topic keywords and knowledge points
export function analyzePosts(posts: Post[]): TopicAnalysis[] {
  return posts.map(post => {
    const content = post.content || ''
    const mainTopics = extractMainTopics(post.title, content)
    const knowledgePoints = extractKnowledgePoints(post.title, content)
    const difficulty = determineDifficulty(mainTopics, knowledgePoints)
    const category = categorizeByTopics(mainTopics)
    
    return {
      mainTopics,
      knowledgePoints,
      difficulty,
      category
    }
  })
}

// Simplified prompt templates focused on topics and knowledge points
const SIMPLIFIED_FLASHCARD_PROMPT = `Based on these community discussion topics, generate {count} challenging educational flashcards:

DISCUSSION TOPICS:
{topics}

INSTRUCTIONS:
- Focus on the main topics and knowledge points identified
- Create DIFFICULT questions that test deep understanding and application of these topics
- Questions should challenge learners with complex scenarios, edge cases, and advanced concepts
- Test knowledge points like: implementation details, performance implications, best practices, common pitfalls, advanced techniques
- Use the difficulty level to guide question complexity, but lean towards harder questions
- Ensure questions are educational and test deep conceptual understanding
- Include source attribution to discussion topics

Return JSON array: [{"id":"1","question":"Q?","answer":"A","category":"AI","difficulty":"Hard","source":"Topic"}]`

const SIMPLIFIED_QUIZ_PROMPT = `Based on these community discussion topics, generate {count} CHALLENGING {difficulty} quiz questions:

DISCUSSION TOPICS:
{topics}

INSTRUCTIONS:
- Create DIFFICULT questions that test deep understanding and application of the identified topics and knowledge points
- Questions should challenge learners with complex scenarios, edge cases, and advanced concepts
- Test advanced knowledge points like: implementation details, performance implications, best practices, common pitfalls, advanced techniques, optimization strategies
- Use the difficulty level to guide question complexity, but lean towards harder questions
- Focus on conceptual understanding AND practical application
- Include detailed explanations that help learners understand the advanced concepts
- Include source attribution to discussion topics
- Make questions that require critical thinking and problem-solving skills

Return JSON array: [{"id":"1","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"E","category":"AI","difficulty":"Hard","source":"Topic"}]`

// Generate flashcards based on topic analysis
export async function generateTopicBasedFlashcards(posts: Post[], count: number = 8): Promise<any[]> {
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
    
    // Analyze posts to extract topics and knowledge points
    const topicAnalysis = analyzePosts(posts)
    
    // Create topic summary for AI
    const topicSummary = topicAnalysis.map((analysis, index) => {
      const post = posts[index]
      return `
Topic ${index + 1}: ${post.title}
Main Topics: ${analysis.mainTopics.join(', ')}
Knowledge Points: ${analysis.knowledgePoints.join(', ')}
Difficulty: ${analysis.difficulty}
Category: ${analysis.category}
---`
    }).join('\n')

    const prompt = SIMPLIFIED_FLASHCARD_PROMPT
      .replace('{count}', count.toString())
      .replace('{topics}', topicSummary)

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
    console.error('Error generating topic-based flashcards:', error)
    return generateMockFlashcards(posts, count)
  }
}

// Generate quiz based on topic analysis
export async function generateTopicBasedQuiz(posts: Post[], questionCount: number = 5, difficulty: string = 'hard'): Promise<any[]> {
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
    
    // Analyze posts to extract topics and knowledge points
    const topicAnalysis = analyzePosts(posts)
    
    // Create topic summary for AI
    const topicSummary = topicAnalysis.map((analysis, index) => {
      const post = posts[index]
      return `
Topic ${index + 1}: ${post.title}
Main Topics: ${analysis.mainTopics.join(', ')}
Knowledge Points: ${analysis.knowledgePoints.join(', ')}
Difficulty: ${analysis.difficulty}
Category: ${analysis.category}
---`
    }).join('\n')

    const prompt = SIMPLIFIED_QUIZ_PROMPT
      .replace('{count}', questionCount.toString())
      .replace('{difficulty}', difficulty)
      .replace('{topics}', topicSummary)

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
    console.error('Error generating topic-based quiz:', error)
    return generateMockQuiz(posts, questionCount, difficulty)
  }
}

// Generate both flashcards and quiz based on topics
export async function generateTopicBasedLearningContent(
  posts: Post[], 
  quizCount: number = 5, 
  flashcardCount: number = 8, 
  quizDifficulty: string = 'hard'
): Promise<{ flashcards: any[], quiz: any[] }> {
  try {
    const [flashcards, quiz] = await Promise.all([
      generateTopicBasedFlashcards(posts, flashcardCount),
      generateTopicBasedQuiz(posts, quizCount, quizDifficulty)
    ])
    
    return { flashcards, quiz }
  } catch (error) {
    console.error('Error generating topic-based learning content:', error)
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
      answer: `This discussion covers the topic of ${post.title} and related concepts.`,
      category: 'General',
      difficulty: 'Easy',
      source: post.title
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
      explanation: `The discussion "${post.title}" covers multiple aspects including technical implementation, theoretical concepts, and practical applications.`,
      category: 'General',
      difficulty: difficulty === 'mixed' ? 'Easy' : difficulty,
      source: post.title
    })
  }
  return mockQuiz
}
