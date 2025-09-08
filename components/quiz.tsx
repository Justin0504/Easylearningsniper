'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Brain,
  Target,
  Clock,
  Star,
  Zap,
  BookOpen
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  source: string
}

interface QuizProps {
  questions: QuizQuestion[]
}

export default function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds per question
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1) // Auto-submit with no answer
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(new Set())
    setTimeLeft(30)
    setQuizCompleted(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <Star className="h-4 w-4" />
      case 'Medium': return <Target className="h-4 w-4" />
      case 'Hard': return <Zap className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 90) return { message: "Excellent! 🎉", color: "text-green-600" }
    if (percentage >= 70) return { message: "Good job! 👍", color: "text-blue-600" }
    if (percentage >= 50) return { message: "Not bad! 💪", color: "text-yellow-600" }
    return { message: "Keep studying! 📚", color: "text-red-600" }
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No Quiz Available</h3>
            <p className="text-gray-600">Quiz questions will be generated based on today's posts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizCompleted) {
    const scoreInfo = getScoreMessage()
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className={`text-xl font-semibold ${scoreInfo.color}`}>
                {scoreInfo.message}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-gray-600 mb-4">
                {Math.round((score / questions.length) * 100)}% Correct
              </div>
              <Progress value={(score / questions.length) * 100} className="w-full" />
            </div>

            <Button onClick={handleRestart} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Quiz Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress and Timer */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <Badge className={`${getDifficultyColor(currentQuestion.difficulty)} flex items-center gap-1`}>
              {getDifficultyIcon(currentQuestion.difficulty)}
              {currentQuestion.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {currentQuestion.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className={timeLeft <= 10 ? 'text-red-600 font-bold' : ''}>
              {timeLeft}s
            </span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md "
            
            if (showResult) {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += "bg-green-100 border-green-500 text-green-800"
              } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                buttonClass += "bg-red-100 border-red-500 text-red-800"
              } else {
                buttonClass += "bg-gray-50 border-gray-200 text-gray-600"
              }
            } else {
              buttonClass += selectedAnswer === index 
                ? "bg-blue-100 border-blue-500 text-blue-800" 
                : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    showResult && index === currentQuestion.correctAnswer
                      ? 'bg-green-500 border-green-500 text-white'
                      : showResult && index === selectedAnswer
                      ? 'bg-red-500 border-red-500 text-white'
                      : selectedAnswer === index
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {showResult && index === currentQuestion.correctAnswer && <CheckCircle className="h-4 w-4" />}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && <XCircle className="h-4 w-4" />}
                    {!showResult && selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            )
          })}

          {showResult && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
              <p className="text-sm text-blue-600 mt-2">Source: {currentQuestion.source}</p>
            </div>
          )}

          {showResult && (
            <Button onClick={handleNext} className="w-full">
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Decorative Elements */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-bounce" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-300 rounded-full opacity-60 animate-bounce delay-1000" />
        <div className="absolute top-1/2 -right-6 w-4 h-4 bg-blue-300 rounded-full opacity-60 animate-bounce delay-500" />
      </div>
    </div>
  )
}
