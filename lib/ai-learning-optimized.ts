// Optimized AI Learning Tools - Fast Generation with Caching and Parallel Processing

// Cache for storing generated content
const contentCache = new Map<string, any>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CacheItem {
  data: any
  timestamp: number
}

// Optimized prompt templates
const FLASHCARD_PROMPT_TEMPLATE = `Generate {count} flashcards from these posts:

POSTS:
{posts}

Return JSON array: [{"id":"1","question":"Q?","answer":"A","category":"AI","difficulty":"Easy","source":"Post"}]`

const QUIZ_PROMPT_TEMPLATE = `Generate {count} {difficulty} quiz questions from these posts:

POSTS:
{posts}

Return JSON array: [{"id":"1","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"E","category":"AI","difficulty":"Easy","source":"Post"}]`

// Fast content generation with optimized prompts
export async function generateFlashcardsFast(posts: any[], count: number = 3): Promise<any[]> {
  const cacheKey = `flashcards_${posts.length}_${count}_${Date.now() - (Date.now() % 60000)}` // Cache per minute
  
  // Check cache first
  const cached = getCachedContent(cacheKey)
  if (cached) {
    console.log('🚀 Using cached flashcards')
    return cached
  }

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
    
    // Optimized post summaries - shorter and more focused
    const postSummaries = posts.slice(0, 10).map(post => 
      `${post.title}: ${post.content?.substring(0, 100)}...`
    ).join('\n')

    const prompt = FLASHCARD_PROMPT_TEMPLATE
      .replace('{count}', count.toString())
      .replace('{posts}', postSummaries)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const flashcards = JSON.parse(content)
      const validFlashcards = Array.isArray(flashcards) ? flashcards : generateMockFlashcards(posts, count)
      
      // Cache the result
      setCachedContent(cacheKey, validFlashcards)
      
      return validFlashcards
    } catch {
      return generateMockFlashcards(posts, count)
    }
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return generateMockFlashcards(posts, count)
  }
}

export async function generateQuizFast(posts: any[], questionCount: number = 3, difficulty: string = 'mixed'): Promise<any[]> {
  const cacheKey = `quiz_${posts.length}_${questionCount}_${difficulty}_${Date.now() - (Date.now() % 60000)}`
  
  // Check cache first
  const cached = getCachedContent(cacheKey)
  if (cached) {
    console.log('🚀 Using cached quiz')
    return cached
  }

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
    
    // Optimized post summaries - shorter and more focused
    const postSummaries = posts.slice(0, 10).map(post => 
      `${post.title}: ${post.content?.substring(0, 100)}...`
    ).join('\n')

    const prompt = QUIZ_PROMPT_TEMPLATE
      .replace('{count}', questionCount.toString())
      .replace('{difficulty}', difficulty)
      .replace('{posts}', postSummaries)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const quiz = JSON.parse(content)
      const validQuiz = Array.isArray(quiz) ? quiz : generateMockQuiz(posts, questionCount, difficulty)
      
      // Cache the result
      setCachedContent(cacheKey, validQuiz)
      
      return validQuiz
    } catch {
      return generateMockQuiz(posts, questionCount, difficulty)
    }
  } catch (error) {
    console.error('Error generating quiz:', error)
    return generateMockQuiz(posts, questionCount, difficulty)
  }
}

// Parallel generation for both flashcards and quiz
export async function generateLearningContentFast(
  posts: any[], 
  quizCount: number = 3, 
  flashcardCount: number = 3, 
  quizDifficulty: string = 'mixed'
): Promise<{ flashcards: any[], quiz: any[] }> {
  console.log('🚀 Generating learning content in parallel...')
  
  // Generate both in parallel for maximum speed
  const [flashcards, quiz] = await Promise.all([
    generateFlashcardsFast(posts, flashcardCount),
    generateQuizFast(posts, quizCount, quizDifficulty)
  ])
  
  return { flashcards, quiz }
}

// Cache management functions
function getCachedContent(key: string): any | null {
  const item = contentCache.get(key) as CacheItem
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    return item.data
  }
  if (item) {
    contentCache.delete(key) // Remove expired cache
  }
  return null
}

function setCachedContent(key: string, data: any): void {
  contentCache.set(key, {
    data,
    timestamp: Date.now()
  })
  
  // Clean up old cache entries
  if (contentCache.size > 50) {
    const now = Date.now()
    for (const [k, v] of contentCache.entries()) {
      if (now - (v as CacheItem).timestamp > CACHE_DURATION) {
        contentCache.delete(k)
      }
    }
  }
}

// Optimized mock data generators
function generateMockFlashcards(posts: any[], count: number = 3): any[] {
  const baseFlashcards = [
    {
      id: "1",
      question: "What is machine learning?",
      answer: "Machine learning is a subset of AI that enables computers to learn from data without explicit programming.",
      category: "AI",
      difficulty: "Easy",
      source: "AI Learning Community"
    },
    {
      id: "2", 
      question: "What is the difference between supervised and unsupervised learning?",
      answer: "Supervised learning uses labeled data, while unsupervised learning finds patterns without labels.",
      category: "Machine Learning",
      difficulty: "Medium",
      source: "AI Learning Community"
    },
    {
      id: "3",
      question: "What is overfitting in machine learning?",
      answer: "Overfitting occurs when a model learns training data too well and performs poorly on new data.",
      category: "Machine Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    },
    {
      id: "4",
      question: "What is a neural network?",
      answer: "A neural network is a computing system inspired by biological neural networks, consisting of interconnected nodes.",
      category: "Deep Learning",
      difficulty: "Medium",
      source: "AI Learning Community"
    },
    {
      id: "5",
      question: "What is the purpose of activation functions?",
      answer: "Activation functions introduce non-linearity to neural networks, enabling them to learn complex patterns.",
      category: "Deep Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    }
  ]
  
  // Return requested number of flashcards
  return baseFlashcards.slice(0, Math.min(count, baseFlashcards.length))
}

function generateMockQuiz(posts: any[], questionCount: number = 3, difficulty: string = 'mixed'): any[] {
  const baseQuestions = [
    {
      id: "1",
      question: "What is the primary goal of machine learning?",
      options: [
        "To replace human intelligence completely",
        "To enable computers to learn from data",
        "To make computers faster",
        "To reduce data storage needs"
      ],
      correctAnswer: 1,
      explanation: "Machine learning aims to enable computers to learn patterns from data and make predictions.",
      category: "AI",
      difficulty: "Easy",
      source: "AI Learning Community"
    },
    {
      id: "2",
      question: "Which type of learning uses labeled training data?",
      options: [
        "Unsupervised learning",
        "Reinforcement learning", 
        "Supervised learning",
        "Deep learning"
      ],
      correctAnswer: 2,
      explanation: "Supervised learning uses labeled training data where correct answers are provided.",
      category: "Machine Learning",
      difficulty: "Medium",
      source: "AI Learning Community"
    },
    {
      id: "3",
      question: "What technique helps prevent overfitting in neural networks?",
      options: [
        "Increasing the learning rate",
        "Adding more layers",
        "Using dropout regularization",
        "Training for more epochs"
      ],
      correctAnswer: 2,
      explanation: "Dropout regularization randomly sets neurons to zero, preventing overfitting.",
      category: "Deep Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    },
    {
      id: "4",
      question: "What is the purpose of backpropagation?",
      options: [
        "To initialize neural network weights",
        "To update weights based on prediction errors",
        "To select the best features",
        "To normalize input data"
      ],
      correctAnswer: 1,
      explanation: "Backpropagation updates network weights by propagating errors backward through the network.",
      category: "Deep Learning",
      difficulty: "Medium",
      source: "AI Learning Community"
    },
    {
      id: "5",
      question: "What is the vanishing gradient problem?",
      options: [
        "Gradients become too large during training",
        "Gradients become too small in deep networks",
        "Gradients change direction frequently",
        "Gradients are not calculated correctly"
      ],
      correctAnswer: 1,
      explanation: "The vanishing gradient problem occurs when gradients become too small in deep networks, slowing learning.",
      category: "Deep Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    }
  ]
  
  // Filter by difficulty if not mixed
  let filteredQuestions = baseQuestions
  if (difficulty !== 'mixed') {
    filteredQuestions = baseQuestions.filter(q => q.difficulty.toLowerCase() === difficulty)
  }
  
  // Return requested number of questions
  return filteredQuestions.slice(0, Math.min(questionCount, filteredQuestions.length))
}

// Clear cache function for testing
export function clearCache(): void {
  contentCache.clear()
  console.log('🧹 Cache cleared')
}
