// AI Learning Tools - Generate Flashcards and Quiz from Posts

export async function generateFlashcards(posts: any[]): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockFlashcards(posts)
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const postSummaries = posts.map(post => 
      `• ${post.title} (${post.type}): ${post.content?.substring(0, 200)}...`
    ).join('\n\n')

    const prompt = `Based on these AI learning community posts, generate 5-8 educational flashcards:

    POSTS:
    ${postSummaries}

    Create flashcards with:
    - Clear, concise questions
    - Detailed, educational answers
    - Appropriate difficulty level (Easy/Medium/Hard)
    - Relevant categories
    - Source attribution

    Return as JSON array with this structure:
    [
      {
        "id": "unique_id",
        "question": "What is...?",
        "answer": "Detailed explanation...",
        "category": "AI/Machine Learning/Programming",
        "difficulty": "Easy/Medium/Hard",
        "source": "Post title or topic"
      }
    ]

    Make questions educational and test understanding of key concepts.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const flashcards = JSON.parse(content)
      return Array.isArray(flashcards) ? flashcards : generateMockFlashcards(posts)
    } catch {
      return generateMockFlashcards(posts)
    }
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return generateMockFlashcards(posts)
  }
}

export async function generateQuiz(posts: any[], questionCount: number = 3, difficulty: string = 'mixed'): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockQuiz(posts, questionCount, difficulty)
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const postSummaries = posts.map(post => 
      `• ${post.title} (${post.type}): ${post.content?.substring(0, 200)}...`
    ).join('\n\n')

    const difficultyInstruction = difficulty === 'mixed' 
      ? 'Mix of Easy, Medium, and Hard questions'
      : `All questions should be ${difficulty} difficulty`

    const prompt = `Based on these AI learning community posts, generate ${questionCount} quiz questions:

    POSTS:
    ${postSummaries}

    DIFFICULTY REQUIREMENT: ${difficultyInstruction}

    Create quiz questions with:
    - Multiple choice questions (4 options each)
    - One correct answer per question
    - Detailed explanations
    - Difficulty level: ${difficulty === 'mixed' ? 'Mix of Easy, Medium, and Hard' : difficulty}
    - Relevant categories
    - Source attribution

    Return as JSON array with this structure:
    [
      {
        "id": "unique_id",
        "question": "What is the main purpose of...?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Detailed explanation of why this is correct...",
        "category": "AI/Machine Learning/Programming",
        "difficulty": "Easy/Medium/Hard",
        "source": "Post title or topic"
      }
    ]

    Make questions test understanding and application of concepts.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const quiz = JSON.parse(content)
      return Array.isArray(quiz) ? quiz : generateMockQuiz(posts, questionCount)
    } catch {
      return generateMockQuiz(posts, questionCount, difficulty)
    }
  } catch (error) {
    console.error('Error generating quiz:', error)
    return generateMockQuiz(posts, questionCount)
  }
}

// Mock data generators for fallback
function generateMockFlashcards(posts: any[]): any[] {
  return [
    {
      id: "1",
      question: "What is machine learning?",
      answer: "Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.",
      category: "AI",
      difficulty: "Easy",
      source: "AI Learning Community"
    },
    {
      id: "2", 
      question: "What is the difference between supervised and unsupervised learning?",
      answer: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in data without labels.",
      category: "Machine Learning",
      difficulty: "Medium",
      source: "AI Learning Community"
    },
    {
      id: "3",
      question: "What is overfitting in machine learning?",
      answer: "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new, unseen data.",
      category: "Machine Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    }
  ]
}

function generateMockQuiz(posts: any[], questionCount: number = 3, difficulty: string = 'mixed'): any[] {
  return [
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
      explanation: "Machine learning aims to enable computers to learn patterns from data and make predictions or decisions without explicit programming.",
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
      explanation: "Supervised learning uses labeled training data where the correct answers are provided during training.",
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
      explanation: "Dropout regularization randomly sets some neurons to zero during training, preventing overfitting by reducing model complexity.",
      category: "Deep Learning",
      difficulty: "Hard",
      source: "AI Learning Community"
    }
  ]
}
