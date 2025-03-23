import React from 'react'
import { Quote, Image, UserPlus } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const categories: Category[] = [
  {
    id: 'quote-cards',
    name: 'Quote Cards',
    description: 'Create branded quote cards with custom content',
    icon: Quote,
  },
  {
    id: 'rf-thumbnails',
    name: 'RF Thumbnails',
    description: 'Generate RF branded thumbnails',
    icon: Image,
  },
  {
    id: 'welcome-esa',
    name: 'Welcome ESA',
    description: 'Create welcome messages for ESA',
    icon: UserPlus,
  },
]

interface CategorySelectorProps {
  onSelect: (categoryId: string) => void
  selectedCategory: string | null
}

export function CategorySelector({ onSelect, selectedCategory }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {categories.map((category) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.id
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              relative p-8 rounded-lg border transition-all duration-300
              ${isSelected 
                ? 'border-accent bg-accent/5 dark:bg-accent/10' 
                : 'border-neutral-200 dark:border-neutral-800 hover:border-accent/50'
              }
              group overflow-hidden
            `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, #BEA152, #BEA152 1px, transparent 1px, transparent 20px)`,
                backgroundSize: '28px 28px',
              }} />
            </div>

            {/* Content */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${isSelected ? 'bg-accent/10' : 'bg-muted'}
                transition-colors duration-300
              `}>
                <Icon className={`
                  w-8 h-8 transition-colors duration-300
                  ${isSelected ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'}
                `} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg transition-colors duration-300 group-hover:text-accent">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
} 