'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code2, FileCode2, Users2, AlertCircle, GitCommit } from 'lucide-react'
import { getAllUpdates, GitUpdate } from '@/lib/git-updates'
import { useEffect, useState } from 'react'

export default function UpdatePage() {
  const params = useParams()
  const version = params.version as string
  const [updates, setUpdates] = useState<GitUpdate[]>([])
  const [update, setUpdate] = useState<GitUpdate | null>(null)
  
  useEffect(() => {
    const fetchUpdates = async () => {
      const allUpdates = await getAllUpdates()
      setUpdates(allUpdates)
      
      // Find the specific update
      const foundUpdate = allUpdates.find(u => u.version === version)
      setUpdate(foundUpdate || null)
    }
    fetchUpdates()
  }, [version])

  // If update not found, show 404
  if (!update) {
    notFound()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <FileCode2 className="h-5 w-5" />
      case 'enhancement':
        return <Code2 className="h-5 w-5" />
      case 'bugfix':
        return <AlertCircle className="h-5 w-5" />
      case 'initial':
        return <Users2 className="h-5 w-5" />
      default:
        return <Code2 className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 text-blue-800'
      case 'bugfix': return 'bg-red-100 text-red-800'
      case 'enhancement': return 'bg-green-100 text-green-800'
      case 'initial': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'feature': return 'Feature'
      case 'bugfix': return 'Bug Fix'
      case 'enhancement': return 'Enhancement'
      case 'initial': return 'Initial'
      default: return 'Update'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/updates"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Updates
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{update.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Version {update.version} • {update.date} • by {update.author}
            </p>
            <p className="text-xs text-gray-400 font-mono mt-1">
              Commit: {update.hash}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getTypeIcon(update.type)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(update.type)}`}>
              {getTypeLabel(update.type)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{update.description}</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-3">Changes</h2>
            <ul className="space-y-2">
              {update.changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bea152] mt-2" />
                  {change}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <GitCommit className="h-5 w-5" />
              Git Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Commit Hash:</span>
                <p className="font-mono text-gray-600">{update.hash}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Author:</span>
                <p className="text-gray-600">{update.author}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-600">{update.date}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <p className="text-gray-600">{update.version}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}