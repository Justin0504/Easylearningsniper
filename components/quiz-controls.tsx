'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  Minus, 
  RotateCcw,
  Brain,
  BookOpen
} from 'lucide-react'

interface QuizControlsProps {
  onQuizCountChange: (count: number) => void
  onFlashcardCountChange: (count: number) => void
  onRefresh: () => void
  currentQuizCount: number
  currentFlashcardCount: number
  loading: boolean
}

export default function QuizControls({
  onQuizCountChange,
  onFlashcardCountChange,
  onRefresh,
  currentQuizCount,
  currentFlashcardCount,
  loading
}: QuizControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  const handleQuizCountChange = (change: number) => {
    const newCount = Math.max(1, Math.min(20, currentQuizCount + change))
    onQuizCountChange(newCount)
  }

  const handleFlashcardCountChange = (change: number) => {
    const newCount = Math.max(1, Math.min(30, currentFlashcardCount + change))
    onFlashcardCountChange(newCount)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Learning Settings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide' : 'Show'} Settings
          </Button>
        </div>
      </CardHeader>
      
      {showSettings && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quiz Count Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Quiz Questions</span>
                <Badge variant="secondary">{currentQuizCount}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuizCountChange(-1)}
                  disabled={currentQuizCount <= 1 || loading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                  {currentQuizCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuizCountChange(1)}
                  disabled={currentQuizCount >= 20 || loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Range: 1-20 questions
              </p>
            </div>

            {/* Flashcard Count Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Flashcards</span>
                <Badge variant="secondary">{currentFlashcardCount}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFlashcardCountChange(-1)}
                  disabled={currentFlashcardCount <= 1 || loading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                  {currentFlashcardCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFlashcardCountChange(1)}
                  disabled={currentFlashcardCount >= 30 || loading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Range: 1-30 cards
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="w-full"
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating...' : 'Refresh Learning Content'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
