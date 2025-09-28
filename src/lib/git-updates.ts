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

// Function to get git commits from API
export const getGitCommits = async (limit: number = 10): Promise<GitUpdate[]> => {
  try {
    const response = await fetch(`/api/git-updates?limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch git updates')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching git commits:', error)
    // Return fallback data if API is not available
    return [
      {
        version: '1.0.0',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
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

// Function to get recent updates (5 latest)
export const getRecentUpdates = async (): Promise<GitUpdate[]> => {
  return await getGitCommits(5)
}

// Function to get all updates
export const getAllUpdates = async (): Promise<GitUpdate[]> => {
  return await getGitCommits(50) // Get more commits for full updates page
}