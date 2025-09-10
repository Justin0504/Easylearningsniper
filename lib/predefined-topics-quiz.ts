// Predefined Topics Quiz Generator - Generate challenging questions on specific topics

interface TopicDefinition {
  name: string
  description: string
  keywords: string[]
  knowledgePoints: string[]
  difficulty: 'intermediate' | 'advanced'
  category: string
}

// Predefined topics with their knowledge points
const PREDEFINED_TOPICS: TopicDefinition[] = [
  {
    name: 'Generative AI (genAI)',
    description: 'Advanced concepts in Generative Artificial Intelligence',
    keywords: [
      'generative ai', 'large language models', 'llm', 'gpt', 'claude', 'gemini',
      'transformer', 'attention mechanism', 'self-attention', 'multi-head attention',
      'prompt engineering', 'few-shot learning', 'zero-shot learning', 'in-context learning',
      'retrieval augmented generation', 'rag', 'fine-tuning', 'instruction tuning',
      'reinforcement learning from human feedback', 'rlhf', 'constitutional ai',
      'alignment', 'safety', 'bias', 'hallucination', 'evaluation', 'benchmarking'
    ],
    knowledgePoints: [
      'transformer architecture', 'attention mechanisms', 'positional encoding',
      'layer normalization', 'residual connections', 'feed-forward networks',
      'tokenization', 'vocabulary', 'embedding layers', 'output projection',
      'beam search', 'nucleus sampling', 'temperature scaling', 'top-k sampling',
      'prompt design', 'chain-of-thought', 'few-shot prompting', 'zero-shot prompting',
      'instruction following', 'conversation modeling', 'code generation',
      'text summarization', 'question answering', 'text classification',
      'fine-tuning strategies', 'parameter-efficient tuning', 'lora', 'qlora',
      'distillation', 'pruning', 'quantization', 'model compression',
      'safety measures', 'bias detection', 'factual accuracy', 'harmful content',
      'evaluation metrics', 'perplexity', 'bleu score', 'rouge score',
      'human evaluation', 'automated evaluation', 'adversarial testing'
    ],
    difficulty: 'advanced',
    category: 'AI/ML'
  },
  {
    name: 'Machine Learning Fundamentals',
    description: 'Core concepts and advanced techniques in machine learning',
    keywords: [
      'supervised learning', 'unsupervised learning', 'reinforcement learning',
      'classification', 'regression', 'clustering', 'dimensionality reduction',
      'overfitting', 'underfitting', 'bias-variance tradeoff', 'cross-validation',
      'feature engineering', 'feature selection', 'data preprocessing',
      'gradient descent', 'stochastic gradient descent', 'adam optimizer',
      'regularization', 'l1 regularization', 'l2 regularization', 'dropout',
      'ensemble methods', 'random forest', 'gradient boosting', 'xgboost',
      'neural networks', 'backpropagation', 'activation functions',
      'hyperparameter tuning', 'grid search', 'random search', 'bayesian optimization'
    ],
    knowledgePoints: [
      'learning algorithms', 'optimization techniques', 'loss functions',
      'gradient computation', 'automatic differentiation', 'computational graphs',
      'model selection', 'cross-validation strategies', 'holdout validation',
      'feature scaling', 'normalization', 'standardization', 'one-hot encoding',
      'dimensionality reduction', 'pca', 't-sne', 'umap', 'lda',
      'clustering algorithms', 'k-means', 'hierarchical clustering', 'dbscan',
      'classification metrics', 'precision', 'recall', 'f1-score', 'roc-auc',
      'regression metrics', 'mse', 'mae', 'r-squared', 'adjusted r-squared',
      'ensemble techniques', 'bagging', 'boosting', 'stacking', 'voting',
      'neural network architectures', 'cnn', 'rnn', 'lstm', 'gru', 'attention',
      'deep learning', 'batch normalization', 'residual connections', 'skip connections'
    ],
    difficulty: 'advanced',
    category: 'AI/ML'
  },
  {
    name: 'Web Development (Full Stack)',
    description: 'Advanced full-stack web development concepts and practices',
    keywords: [
      'react', 'next.js', 'vue.js', 'angular', 'typescript', 'javascript',
      'node.js', 'express', 'fastapi', 'django', 'flask', 'spring boot',
      'rest api', 'graphql', 'websocket', 'microservices', 'serverless',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud computing',
      'database design', 'sql', 'nosql', 'mongodb', 'postgresql', 'redis',
      'authentication', 'authorization', 'jwt', 'oauth', 'security',
      'testing', 'unit testing', 'integration testing', 'e2e testing',
      'ci/cd', 'devops', 'monitoring', 'logging', 'performance optimization'
    ],
    knowledgePoints: [
      'frontend frameworks', 'component architecture', 'state management',
      'routing', 'middleware', 'hooks', 'lifecycle methods', 'virtual dom',
      'backend architecture', 'mvc pattern', 'repository pattern', 'service layer',
      'api design', 'restful principles', 'http methods', 'status codes',
      'database optimization', 'indexing', 'query optimization', 'connection pooling',
      'caching strategies', 'redis', 'memcached', 'cdn', 'browser caching',
      'security practices', 'cors', 'csrf protection', 'sql injection prevention',
      'authentication flows', 'session management', 'token-based auth', 'oauth flows',
      'testing strategies', 'mocking', 'stubbing', 'test-driven development',
      'deployment strategies', 'blue-green deployment', 'canary releases',
      'monitoring and observability', 'metrics', 'tracing', 'logging best practices',
      'performance optimization', 'code splitting', 'lazy loading', 'bundle optimization'
    ],
    difficulty: 'advanced',
    category: 'Web Development'
  },
  {
    name: 'Data Science & Analytics',
    description: 'Advanced data science techniques and analytical methods',
    keywords: [
      'data analysis', 'data visualization', 'statistics', 'probability',
      'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'plotly',
      'machine learning', 'scikit-learn', 'tensorflow', 'pytorch',
      'data preprocessing', 'feature engineering', 'data cleaning',
      'exploratory data analysis', 'eda', 'statistical testing',
      'time series analysis', 'forecasting', 'anomaly detection',
      'big data', 'hadoop', 'spark', 'kafka', 'streaming data',
      'a/b testing', 'experimental design', 'causal inference',
      'business intelligence', 'dashboarding', 'reporting'
    ],
    knowledgePoints: [
      'statistical analysis', 'hypothesis testing', 'confidence intervals',
      'regression analysis', 'correlation analysis', 'causation vs correlation',
      'data visualization', 'chart selection', 'color theory', 'accessibility',
      'data preprocessing', 'missing data handling', 'outlier detection',
      'feature engineering', 'feature selection', 'dimensionality reduction',
      'time series analysis', 'seasonality', 'trend analysis', 'forecasting models',
      'machine learning pipelines', 'data validation', 'model validation',
      'experimental design', 'randomization', 'control groups', 'statistical power',
      'big data processing', 'distributed computing', 'mapreduce', 'spark sql',
      'streaming analytics', 'real-time processing', 'event-driven architecture',
      'data quality', 'data governance', 'data lineage', 'metadata management'
    ],
    difficulty: 'advanced',
    category: 'Data Science'
  }
]

// Generate challenging questions for predefined topics
export async function generatePredefinedTopicQuiz(
  topicName: string, 
  questionCount: number = 3, 
  difficulty: string = 'hard'
): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockPredefinedQuiz(topicName, questionCount, difficulty)
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
    
    // Find the predefined topic
    const topic = PREDEFINED_TOPICS.find(t => t.name.toLowerCase().includes(topicName.toLowerCase()))
    if (!topic) {
      throw new Error(`Topic "${topicName}" not found`)
    }

    const prompt = `Generate ${questionCount} UNIQUE and CHALLENGING quiz questions about ${topic.name}:

TOPIC: ${topic.name}
DESCRIPTION: ${topic.description}
KEYWORDS: ${topic.keywords.join(', ')}
KNOWLEDGE POINTS: ${topic.knowledgePoints.join(', ')}
DIFFICULTY: ${difficulty}
GENERATION_ID: ${Date.now()}

INSTRUCTIONS:
- Create UNIQUE and DIVERSE questions that test different aspects of ${topic.name}
- Each question should focus on a DIFFERENT concept, technique, or application area
- Questions should challenge learners with complex scenarios, edge cases, and advanced concepts
- Test advanced knowledge points like: implementation details, performance implications, best practices, common pitfalls, advanced techniques, optimization strategies
- Focus on practical application and real-world scenarios
- Include detailed explanations that help learners understand the advanced concepts
- Make questions that require critical thinking and problem-solving skills
- Use the specific keywords and knowledge points provided for this topic
- AVOID using "All of the above" as an answer option
- Make each question DISTINCT and cover different subtopics
- Vary the question types: some about concepts, some about implementation, some about best practices, some about troubleshooting
- Generate DIFFERENT questions each time - avoid repetition
- Use creative scenarios and edge cases

Return JSON array: [{"id":"1","question":"Q?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"E","category":"${topic.category}","difficulty":"${difficulty}","source":"${topic.name}"}]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const quiz = JSON.parse(content)
      return Array.isArray(quiz) ? quiz : generateMockPredefinedQuiz(topicName, questionCount, difficulty)
    } catch {
      return generateMockPredefinedQuiz(topicName, questionCount, difficulty)
    }
  } catch (error) {
    console.error('Error generating predefined topic quiz:', error)
    return generateMockPredefinedQuiz(topicName, questionCount, difficulty)
  }
}

// Generate challenging flashcards for predefined topics
export async function generatePredefinedTopicFlashcards(
  topicName: string, 
  count: number = 3
): Promise<any[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return generateMockPredefinedFlashcards(topicName, count)
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
    
    // Find the predefined topic
    const topic = PREDEFINED_TOPICS.find(t => t.name.toLowerCase().includes(topicName.toLowerCase()))
    if (!topic) {
      throw new Error(`Topic "${topicName}" not found`)
    }

    const prompt = `Generate ${count} UNIQUE and CHALLENGING flashcards about ${topic.name}:

TOPIC: ${topic.name}
DESCRIPTION: ${topic.description}
KEYWORDS: ${topic.keywords.join(', ')}
KNOWLEDGE POINTS: ${topic.knowledgePoints.join(', ')}
DIFFICULTY: ${topic.difficulty}
GENERATION_ID: ${Date.now()}

INSTRUCTIONS:
- Create UNIQUE and DIVERSE flashcards that test different aspects of ${topic.name}
- Each flashcard should focus on a DIFFERENT concept, technique, or application area
- Questions should challenge learners with complex scenarios, edge cases, and advanced concepts
- Test advanced knowledge points like: implementation details, performance implications, best practices, common pitfalls, advanced techniques
- Focus on practical application and real-world scenarios
- Include detailed answers that help learners understand the advanced concepts
- Use the specific keywords and knowledge points provided for this topic
- Make each flashcard DISTINCT and cover different subtopics
- Vary the question types: some about concepts, some about implementation, some about best practices, some about troubleshooting
- Generate DIFFERENT flashcards each time - avoid repetition
- Use creative scenarios and edge cases

Return JSON array: [{"id":"1","question":"Q?","answer":"A","category":"${topic.category}","difficulty":"${topic.difficulty}","source":"${topic.name}"}]`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    try {
      const flashcards = JSON.parse(content)
      return Array.isArray(flashcards) ? flashcards : generateMockPredefinedFlashcards(topicName, count)
    } catch {
      return generateMockPredefinedFlashcards(topicName, count)
    }
  } catch (error) {
    console.error('Error generating predefined topic flashcards:', error)
    return generateMockPredefinedFlashcards(topicName, count)
  }
}

// Generate both flashcards and quiz for predefined topics
export async function generatePredefinedTopicLearningContent(
  topicName: string, 
  quizCount: number = 3, 
  flashcardCount: number = 3, 
  quizDifficulty: string = 'hard'
): Promise<{ flashcards: any[], quiz: any[] }> {
  try {
    const [flashcards, quiz] = await Promise.all([
      generatePredefinedTopicFlashcards(topicName, flashcardCount),
      generatePredefinedTopicQuiz(topicName, quizCount, quizDifficulty)
    ])
    
    return { flashcards, quiz }
  } catch (error) {
    console.error('Error generating predefined topic learning content:', error)
    return { 
      flashcards: generateMockPredefinedFlashcards(topicName, flashcardCount), 
      quiz: generateMockPredefinedQuiz(topicName, quizCount, quizDifficulty) 
    }
  }
}

// Get available predefined topics
export function getAvailableTopics(): TopicDefinition[] {
  return PREDEFINED_TOPICS
}

// Mock data generators (fallback)
function generateMockPredefinedQuiz(topicName: string, count: number, difficulty: string): any[] {
  const mockQuiz = []
  const questionTypes = [
    {
      question: `What is the primary architecture used in ${topicName}?`,
      options: ['Transformer', 'CNN', 'RNN', 'LSTM'],
      correctAnswer: 0,
      explanation: `The transformer architecture is fundamental to ${topicName}.`
    },
    {
      question: `Which technique is most effective for improving ${topicName} performance?`,
      options: ['Data augmentation', 'Model pruning', 'Fine-tuning', 'Feature selection'],
      correctAnswer: 2,
      explanation: `Fine-tuning allows models to adapt to specific tasks in ${topicName}.`
    },
    {
      question: `What is a common challenge in ${topicName} deployment?`,
      options: ['Memory usage', 'Training time', 'Model size', 'All of these'],
      correctAnswer: 3,
      explanation: `All these factors are important considerations for ${topicName} deployment.`
    }
  ]
  
  for (let i = 0; i < count; i++) {
    const questionType = questionTypes[i % questionTypes.length]
    mockQuiz.push({
      id: `mock_quiz_${i + 1}`,
      question: questionType.question,
      options: questionType.options,
      correctAnswer: questionType.correctAnswer,
      explanation: questionType.explanation,
      category: 'AI/ML',
      difficulty: difficulty,
      source: topicName
    })
  }
  return mockQuiz
}

function generateMockPredefinedFlashcards(topicName: string, count: number): any[] {
  const mockFlashcards = []
  const questionTypes = [
    {
      question: `What is the core architecture of ${topicName}?`,
      answer: `The core architecture involves transformer-based models with attention mechanisms for processing sequential data.`
    },
    {
      question: `How does fine-tuning work in ${topicName}?`,
      answer: `Fine-tuning adapts pre-trained models to specific tasks by updating model parameters on task-specific data.`
    },
    {
      question: `What are the main challenges in ${topicName} deployment?`,
      answer: `Key challenges include computational requirements, memory usage, latency optimization, and maintaining model quality.`
    }
  ]
  
  for (let i = 0; i < count; i++) {
    const questionType = questionTypes[i % questionTypes.length]
    mockFlashcards.push({
      id: `mock_flashcard_${i + 1}`,
      question: questionType.question,
      answer: questionType.answer,
      category: 'AI/ML',
      difficulty: 'Hard',
      source: topicName
    })
  }
  return mockFlashcards
}
