'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, 
  Plus, 
  Minus, 
  RotateCcw,
  Brain,
  BookOpen,
  Star,
  Target,
  Zap,
  Shuffle
} from 'lucide-react'

interface AdvancedQuizControlsProps {
  onQuizCountChange: (count: number) => void
  onFlashcardCountChange: (count: number) => void
  onQuizDifficultyChange: (difficulty: string) => void
  onRefresh: () => void
  currentQuizCount: number
  currentFlashcardCount: number
  currentQuizDifficulty: string
  loading: boolean
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', icon: Star, color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'medium', label: 'Medium', icon: Target, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'hard', label: 'Hard', icon: Zap, color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: 'mixed', label: 'Mixed', icon: Shuffle, color: 'text-purple-600', bgColor: 'bg-purple-100' }
]

export default function AdvancedQuizControls({
  onQuizCountChange,
  onFlashcardCountChange,
  onQuizDifficultyChange,
  onRefresh,
  currentQuizCount,
  currentFlashcardCount,
  currentQuizDifficulty,
  loading
}: AdvancedQuizControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  const handleQuizCountChange = (change: number) => {
    const newCount = Math.max(1, Math.min(20, currentQuizCount + change))
    onQuizCountChange(newCount)
  }

  const handleFlashcardCountChange = (change: number) => {
    const newCount = Math.max(1, Math.min(30, currentFlashcardCount + change))
    onFlashcardCountChange(newCount)
  }

  const getDifficultyInfo = (difficulty: string) => {
    return difficultyOptions.find(opt => opt.value === difficulty) || difficultyOptions[3]
  }

  const currentDifficultyInfo = getDifficultyInfo(currentQuizDifficulty)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Advanced Learning Settings
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
        <CardContent className="space-y-6">
          {/* Quiz Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              Quiz Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiz Count */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Number of Questions</span>
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
                  <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[3rem] text-center">
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
                  Range: 1-20 questions (Default: 3)
                </p>
              </div>

              {/* Quiz Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Difficulty Level</span>
                  <Badge className={`${currentDifficultyInfo.bgColor} ${currentDifficultyInfo.color} flex items-center gap-1`}>
                    <currentDifficultyInfo.icon className="h-3 w-3" />
                    {currentDifficultyInfo.label}
                  </Badge>
                </div>
                <Select value={currentQuizDifficulty} onValueChange={onQuizDifficultyChange} disabled={loading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className={`h-4 w-4 ${option.color}`} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {currentQuizDifficulty === 'mixed' 
                    ? 'Mix of Easy, Medium, and Hard questions'
                    : `All questions will be ${currentDifficultyInfo.label.toLowerCase()}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Flashcard Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Flashcard Configuration
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Number of Cards</span>
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
                <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-[3rem] text-center">
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
                Range: 1-30 cards (Default: 3)
              </p>
            </div>
          </div>

          {/* Current Settings Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Current Settings</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Quiz:</span>
                <span className="ml-2 font-medium">{currentQuizCount} questions ({currentDifficultyInfo.label})</span>
              </div>
              <div>
                <span className="text-gray-600">Flashcards:</span>
                <span className="ml-2 font-medium">{currentFlashcardCount} cards</span>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Generating Learning Content...' : 'Generate Learning Content'}
            </Button>
            {loading && (
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-600 mb-2">
                  ⚡ Using optimized generation with parallel processing
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
