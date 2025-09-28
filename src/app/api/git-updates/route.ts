import { execSync } from 'child_process'
import { NextResponse } from 'next/server'

export interface GitUpdate {
  version: string
  date: string
  title: string
  description: string
  changes: string[]
  type: 'feature' | 'enhancement' | 'bugfix' | 'initial'
  hash: string
  author: string
}

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Function to parse commit message and extract type
const parseCommitType = (message: string): 'feature' | 'enhancement' | 'bugfix' | 'initial' => {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.startsWith('feat:')) return 'feature'
  if (lowerMessage.startsWith('fix:')) return 'bugfix'
  if (lowerMessage.startsWith('enhance:') || lowerMessage.startsWith('improve:')) return 'enhancement'
  if (lowerMessage.startsWith('initial') || lowerMessage.startsWith('first')) return 'initial'
  return 'enhancement' // default
}

// Function to extract title from commit message
const extractTitle = (message: string): string => {
  // Remove type prefix (feat:, fix:, etc.)
  const cleanMessage = message.replace(/^(feat|fix|enhance|improve|initial|chore|docs|style|refactor|perf|test|build|ci|revert):\s*/i, '')
  
  // Take first line and clean it up
  const firstLine = cleanMessage.split('\n')[0].trim()
  
  // Capitalize first letter
  return firstLine.charAt(0).toUpperCase() + firstLine.slice(1)
}

// Function to extract changes from commit message
const extractChanges = (message: string): string[] => {
  const lines = message.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const changes: string[] = []
  
  // Look for bullet points or numbered lists
  for (const line of lines) {
    if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
      changes.push(line.replace(/^[-*\d.]\s/, '').trim())
    }
  }
  
  // If no bullet points found, split by sentences
  if (changes.length === 0) {
    const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 10)
    changes.push(...sentences.slice(0, 3).map(s => s.trim()))
  }
  
  return changes.slice(0, 5) // Limit to 5 changes
}

// Function to get git commits
const getGitCommits = (limit: number = 10): GitUpdate[] => {
  try {
    // Get git log with format: hash|author|date|message
    const gitCommand = `git log --oneline --format="%H|%an|%ad|%s" --date=short -${limit}`
    const output = execSync(gitCommand, { encoding: 'utf-8' })
    
    const commits: GitUpdate[] = []
    const lines = output.trim().split('\n').filter(line => line.length > 0)
    
    for (const line of lines) {
      const [hash, author, date, message] = line.split('|')
      
      if (!hash || !author || !date || !message) continue
      
      const commitDate = new Date(date)
      const type = parseCommitType(message)
      const title = extractTitle(message)
      const changes = extractChanges(message)
      
      // Generate version number based on commit count
      const versionNumber = commits.length + 1
      const version = `1.${Math.floor(versionNumber / 10)}.${versionNumber % 10}`
      
      commits.push({
        version,
        date: formatDate(commitDate),
        title,
        description: title, // Use title as description for now
        changes: changes.length > 0 ? changes : [title],
        type,
        hash: hash.substring(0, 8), // Short hash
        author
      })
    }
    
    return commits
  } catch (error) {
    console.error('Error fetching git commits:', error)
    // Return fallback data if git is not available
    return [
      {
        version: '1.0.0',
        date: formatDate(new Date()),
        title: 'Initial Release',
        description: 'First release of EMIR - Social Media Asset Manager',
        changes: ['Initial application setup', 'User authentication system', 'Dashboard implementation'],
        type: 'initial',
        hash: '00000000',
        author: 'System'
      }
    ]
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  
  try {
    const commits = getGitCommits(limit)
    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error in git updates API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch git updates' },
      { status: 500 }
    )
  }
}
