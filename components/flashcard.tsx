'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  BookOpen,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react'

interface FlashcardData {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  source: string
}

interface FlashcardProps {
  flashcards: FlashcardData[]
}

export default function Flashcard({ flashcards }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set())

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]))
    }
  }

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setStudiedCards(new Set())
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

  if (flashcards.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No Flashcards Available</h3>
            <p className="text-gray-600">Flashcards will be generated based on today's posts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm text-gray-500">
            {studiedCards.size} studied
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <Card 
          className={`w-full max-w-2xl mx-auto cursor-pointer transition-all duration-500 transform hover:scale-105 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          <CardContent className="p-8 min-h-[300px] flex flex-col justify-center">
            <div className="text-center space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-center space-x-4">
                <Badge className={`${getDifficultyColor(currentCard.difficulty)} flex items-center gap-1`}>
                  {getDifficultyIcon(currentCard.difficulty)}
                  {currentCard.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  {currentCard.category}
                </Badge>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                {!isFlipped ? (
                  <>
                    <div className="text-6xl mb-4">❓</div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentCard.question}
                    </h3>
                    <p className="text-sm text-gray-500">Click to reveal answer</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">💡</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Answer:
                    </h3>
                    <p className="text-lg text-gray-700">
                      {currentCard.answer}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Source: {currentCard.source}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse" />
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-300 rounded-full opacity-60 animate-pulse delay-1000" />
        <div className="absolute top-1/2 -right-6 w-4 h-4 bg-blue-300 rounded-full opacity-60 animate-pulse delay-500" />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Restart
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Study Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{flashcards.length}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{studiedCards.size}</div>
            <div className="text-sm text-gray-600">Studied</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((studiedCards.size / flashcards.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </div>
    </div>
  )
}
