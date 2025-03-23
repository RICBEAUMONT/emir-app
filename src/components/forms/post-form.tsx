import React from 'react'
import { Button } from '../ui/button'

interface PostFormData {
  content: string
  hashtags: string[]
  media?: File[]
  callToAction?: string
}

export function PostForm() {
  const [formData, setFormData] = React.useState<PostFormData>({
    content: '',
    hashtags: [],
    media: [],
    callToAction: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Post Content
        </label>
        <textarea
          id="content"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Write your post content here..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Hashtags
        </label>
        <input
          type="text"
          id="hashtags"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Add hashtags (comma separated)"
          value={formData.hashtags.join(', ')}
          onChange={(e) => setFormData({ ...formData, hashtags: e.target.value.split(',').map(tag => tag.trim()) })}
        />
      </div>

      <div>
        <label htmlFor="cta" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Call to Action
        </label>
        <input
          type="text"
          id="cta"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Add a call to action"
          value={formData.callToAction}
          onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Media
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 dark:border-gray-600">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600 dark:text-gray-300">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setFormData({ ...formData, media: files })
                  }}
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Generate Posts
        </Button>
      </div>
    </form>
  )
} 