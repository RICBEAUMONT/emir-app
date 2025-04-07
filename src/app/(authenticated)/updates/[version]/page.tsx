'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code2, FileCode2, Users2, AlertCircle } from 'lucide-react'
import { updates, type Update } from '@/lib/updates'

export default function UpdatePage() {
  const params = useParams()
  const version = params.version as string
  
  // Find the specific update
  const update = updates.find(u => u.version === version)
  
  // If update not found, show 404
  if (!update) {
    notFound()
  }

  const getTypeIcon = (type: Update['type']) => {
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
              Version {update.version} • {update.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getTypeIcon(update.type)}
            <span className="px-2 py-1 text-xs font-medium text-[#bea152] bg-[#bea152]/10 rounded-full">
              {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
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

          {update.technical_details && (
            <>
              {update.technical_details.affected_components && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Affected Components</h2>
                  <ul className="space-y-1">
                    {update.technical_details.affected_components.map((component, index) => (
                      <li key={index} className="text-gray-600">{component}</li>
                    ))}
                  </ul>
                </div>
              )}

              {update.technical_details.breaking_changes && update.technical_details.breaking_changes.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Breaking Changes</h2>
                  <ul className="space-y-1">
                    {update.technical_details.breaking_changes.map((change, index) => (
                      <li key={index} className="text-gray-600">{change}</li>
                    ))}
                  </ul>
                </div>
              )}

              {update.technical_details.dependencies_updated && update.technical_details.dependencies_updated.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Dependencies Updated</h2>
                  <ul className="space-y-1">
                    {update.technical_details.dependencies_updated.map((dep, index) => (
                      <li key={index} className="text-gray-600">
                        {dep.name} → {dep.version}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {update.technical_details.migration_notes && update.technical_details.migration_notes.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Migration Notes</h2>
                  <ul className="space-y-1">
                    {update.technical_details.migration_notes.map((note, index) => (
                      <li key={index} className="text-gray-600">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {update.contributors && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Contributors</h2>
              <div className="flex flex-wrap gap-2">
                {update.contributors.map((contributor, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                  >
                    {contributor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 