'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, BookOpen, Brain, Zap, Star, Target, Settings, Sparkles, Target as TargetIcon, BookMarked } from 'lucide-react'
import Flashcard from './flashcard'
import Quiz from './quiz'
import AdvancedQuizControls from './advanced-quiz-controls'

interface DailySummaryProps {
  communityId: string
}

interface LearningData {
  flashcards: any[]
  quiz: any[]
  postCount: number
  generatedAt: string
}

export default function LearningSection({ communityId }: DailySummaryProps) {
  const [learningData, setLearningData] = useState<LearningData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('flashcards')
  const [quizCount, setQuizCount] = useState(3)
  const [flashcardCount, setFlashcardCount] = useState(3)
  const [quizDifficulty, setQuizDifficulty] = useState('hard')
  const [enhanced, setEnhanced] = useState(false) // 是否使用增强版
  const [simplified, setSimplified] = useState(false) // 是否使用简化版（只关注主题关键词）
  const [predefinedTopic, setPredefinedTopic] = useState(true) // 默认使用预定义主题
  const [selectedTopic, setSelectedTopic] = useState('genAI') // 选中的主题
  const [availableTopics, setAvailableTopics] = useState<any[]>([]) // 可用主题列表

  const fetchLearningData = async () => {
    try {
      const startTime = Date.now()
      console.log('🚀 Starting challenging learning content generation...')
      
      let response
      if (predefinedTopic) {
        // Use predefined topics
        response = await fetch(`/api/topics/learning?topic=${selectedTopic}&type=both&quizCount=${quizCount}&flashcardCount=${flashcardCount}&quizDifficulty=${quizDifficulty}`)
      } else {
        // Use community posts
        response = await fetch(`/api/communities/${communityId}/learning?type=both&quizCount=${quizCount}&flashcardCount=${flashcardCount}&quizDifficulty=${quizDifficulty}&enhanced=${enhanced}&simplified=${simplified}`)
      }
      
      if (response.ok) {
        const data = await response.json()
        setLearningData(data)
        
        const endTime = Date.now()
        console.log(`⚡ Challenging learning content generated in ${endTime - startTime}ms`)
      } else {
        console.error('Failed to fetch learning data')
      }
    } catch (error) {
      console.error('Error fetching learning data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch available topics
  const fetchAvailableTopics = async () => {
    try {
      const response = await fetch('/api/topics/learning', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setAvailableTopics(data.topics || [])
      }
    } catch (error) {
      console.error('Error fetching available topics:', error)
    }
  }

  useEffect(() => {
    fetchAvailableTopics()
    fetchLearningData()
  }, [communityId, enhanced, simplified, predefinedTopic, selectedTopic])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchLearningData()
  }

  const handleQuizCountChange = (count: number) => {
    setQuizCount(count)
  }

  const handleFlashcardCountChange = (count: number) => {
    setFlashcardCount(count)
  }

  const handleQuizDifficultyChange = (difficulty: string) => {
    setQuizDifficulty(difficulty)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Challenge Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Generating challenging questions...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Challenge Learning
            {predefinedTopic && (
              <Badge variant="default" className="ml-2">
                <BookMarked className="h-3 w-3 mr-1" />
                {selectedTopic}
              </Badge>
            )}
            {simplified && !predefinedTopic && (
              <Badge variant="secondary" className="ml-2">
                <TargetIcon className="h-3 w-3 mr-1" />
                Topic-Based
              </Badge>
            )}
            {enhanced && !simplified && !predefinedTopic && (
              <Badge variant="secondary" className="ml-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Enhanced
              </Badge>
            )}
            {!enhanced && !simplified && !predefinedTopic && (
              <Badge variant="outline" className="ml-2">
                Standard
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant={predefinedTopic ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPredefinedTopic(true)
                  setSimplified(false)
                  setEnhanced(false)
                }}
                className="flex items-center gap-1"
              >
                <BookMarked className="h-4 w-4" />
                Predefined
              </Button>
              <Button
                variant={simplified && !predefinedTopic ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPredefinedTopic(false)
                  setSimplified(true)
                  setEnhanced(false)
                }}
                className="flex items-center gap-1"
              >
                <TargetIcon className="h-4 w-4" />
                Topic
              </Button>
              <Button
                variant={enhanced && !simplified && !predefinedTopic ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPredefinedTopic(false)
                  setSimplified(false)
                  setEnhanced(true)
                }}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Enhanced
              </Button>
              <Button
                variant={!enhanced && !simplified && !predefinedTopic ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPredefinedTopic(false)
                  setSimplified(false)
                  setEnhanced(false)
                }}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Standard
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>
        {predefinedTopic && (
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium">Topic:</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              {availableTopics.map((topic) => (
                <option key={topic.name} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {learningData && (
          <div className="text-sm text-gray-600">
            <p>
              {predefinedTopic ? (
                <>Generated for {selectedTopic} topic • </>
              ) : (
                <>Generated from {learningData.postCount} posts • </>
              )}
              {learningData.flashcards.length} flashcards • 
              {learningData.quiz.length} quiz questions
            </p>
            {predefinedTopic && (
              <p className="text-xs text-purple-600 mt-1">
                🎯 Predefined topic mode: AI generates challenging questions based on curated knowledge points
              </p>
            )}
            {simplified && !predefinedTopic && (
              <p className="text-xs text-green-600 mt-1">
                🎯 Topic-based mode: AI extracts discussion topics and generates challenging questions that test deep knowledge
              </p>
            )}
            {enhanced && !simplified && !predefinedTopic && (
              <p className="text-xs text-blue-600 mt-1">
                ✨ Enhanced mode: AI analyzes post content, extracts key topics, and generates more targeted questions
              </p>
            )}
            {!enhanced && !simplified && !predefinedTopic && (
              <p className="text-xs text-gray-500 mt-1">
                📚 Standard mode: Basic AI learning content generation
              </p>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {learningData ? (
          <div className="space-y-6">
            <AdvancedQuizControls
              onQuizCountChange={handleQuizCountChange}
              onFlashcardCountChange={handleFlashcardCountChange}
              onQuizDifficultyChange={handleQuizDifficultyChange}
              onRefresh={handleRefresh}
              currentQuizCount={quizCount}
              currentFlashcardCount={flashcardCount}
              currentQuizDifficulty={quizDifficulty}
              loading={refreshing}
            />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flashcards" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Flashcards
                <Badge variant="secondary" className="ml-2">
                  {learningData.flashcards.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Quiz
                <Badge variant="secondary" className="ml-2">
                  {learningData.quiz.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards" className="space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Easy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    <span className="text-sm text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-600">Hard</span>
                  </div>
                </div>
                <p className="text-gray-600">
                  Interactive flashcards generated from today's community posts
                </p>
              </div>
              <Flashcard flashcards={learningData.flashcards} />
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Easy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    <span className="text-sm text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-600">Hard</span>
                  </div>
                </div>
                <p className="text-gray-600">
                  Test your knowledge with quiz questions based on today's discussions
                </p>
              </div>
              <Quiz questions={learningData.quiz} />
            </TabsContent>
          </Tabs>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Learning content will be generated from today's posts</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
