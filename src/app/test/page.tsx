'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch('/api/git-updates?limit=1')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }
    testAPI()
  }, [])

  return (
    <div className="p-8">
      <h1>API Test</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
