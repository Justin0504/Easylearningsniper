import { Target, Zap } from 'lucide-react'
import Link from 'next/link'

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  className?: string
}

export function BrandLogo({ size = 'md', showSubtitle = true, className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  }

  const subtitleSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm'
  }

  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Target className={`${sizeClasses[size]} text-blue-600`} />
        <Zap className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-yellow-500 absolute -top-1 -right-1`} />
      </div>
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          EasyLearning Sniper
        </span>
        {showSubtitle && (
          <span className={`${subtitleSizes[size]} text-muted-foreground -mt-1`}>
            Precision AI Learning
          </span>
        )}
      </div>
    </Link>
  )
}
