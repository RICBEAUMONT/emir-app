import React from 'react'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

interface PreviewProps {
  platform: 'twitter' | 'linkedin' | 'instagram'
  content: string
  hashtags: string[]
  media?: File[]
  callToAction?: string
}

const platformConfig = {
  twitter: {
    icon: Twitter,
    maxLength: 280,
    name: 'Twitter',
    className: 'bg-sky-50 dark:bg-sky-900',
  },
  linkedin: {
    icon: Linkedin,
    maxLength: 3000,
    name: 'LinkedIn',
    className: 'bg-blue-50 dark:bg-blue-900',
  },
  instagram: {
    icon: Instagram,
    maxLength: 2200,
    name: 'Instagram',
    className: 'bg-purple-50 dark:bg-purple-900',
  },
}

export function SocialPreview({
  platform,
  content,
  hashtags,
  callToAction,
}: PreviewProps) {
  const config = platformConfig[platform]
  const Icon = config.icon

  const formattedContent = [
    content,
    hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' '),
    callToAction,
  ].filter(Boolean).join('\n\n')

  const isOverLimit = formattedContent.length > config.maxLength

  return (
    <div className={`rounded-lg p-4 ${config.className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5" />
        <h4 className="font-medium">{config.name} Preview</h4>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="prose prose-sm dark:prose-invert">
          {content && <p className="whitespace-pre-wrap">{content}</p>}
          
          {hashtags.length > 0 && (
            <p className="text-blue-600 dark:text-blue-400">
              {hashtags.map(tag => `#${tag.replace(/^#/, '')}`).join(' ')}
            </p>
          )}
          
          {callToAction && (
            <p className="font-medium">{callToAction}</p>
          )}
        </div>

        {isOverLimit && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            Content exceeds {config.name}'s {config.maxLength} character limit by{' '}
            {formattedContent.length - config.maxLength} characters
          </p>
        )}

        <div className="text-sm text-gray-500 mt-2">
          Click &apos;Generate&apos; to create your social media card
        </div>
      </div>
    </div>
  )
} 