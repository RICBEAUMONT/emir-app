'use client'

import { useState } from 'react'
import { StaffProfileEditor } from '../../../components/editors/staff-profile-editor'
import JSZip from 'jszip'

export default function StaffProfilesPage() {
  const [previewUrls, setPreviewUrls] = useState<{ standard: string | null; square: string | null }>({
    standard: null,
    square: null
  })
  const [name, setName] = useState<string>('')
  const [quarter, setQuarter] = useState<string>('')
  const [year, setYear] = useState<string>('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Staff Profile Images</h1>
        <p className="mt-2 text-gray-600">
          Create professional staff profile images in two sizes simultaneously
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Editor Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <StaffProfileEditor 
                      onPreviewUpdate={setPreviewUrls}
                      onNameUpdate={setName}
                      onQuarterUpdate={setQuarter}
                      onYearUpdate={setYear}
                    />
          </div>
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Preview
            </h2>
            
            {/* Both Images Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Standard Size Preview */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Image (400x450px)</h3>
                <div className="aspect-[400/450] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewUrls.standard ? (
                    <img src={previewUrls.standard} alt="Profile Image Preview" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-gray-500 text-sm">Profile preview will appear here</p>
                  )}
                </div>
              </div>

              {/* Square Size Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Business Card Image (1440x1440px)</h3>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewUrls.square ? (
                    <img src={previewUrls.square} alt="Business Card Image Preview" className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-gray-500 text-sm">Business card preview will appear here</p>
                  )}
                </div>
              </div>
            </div>

            {/* Download Button */}
            {previewUrls.standard && previewUrls.square && (
              <div>
                <button
                  onClick={async () => {
                    // Create a ZIP file with both images
                    const JSZip = (await import('jszip')).default
                    const zip = new JSZip()
                    
                    // Convert data URLs to blobs
                    const standardBlob = await fetch(previewUrls.standard!).then(r => r.blob())
                    const squareBlob = await fetch(previewUrls.square!).then(r => r.blob())
                    
                    // Add images to ZIP with specific naming format
                    const nameSuffix = name ? `_${name.replace(/[^a-zA-Z0-9]/g, '_')}` : ''
                    const quarterSuffix = quarter ? `_${quarter}` : ''
                    const yearSuffix = year ? `-${year}` : ''
                    
                    // Profile Image: EMIR_Website_Profile-Image_"Name"_"Quarter"-"Year"
                    const profileFilename = `EMIR_Website_Profile-Image${nameSuffix}${quarterSuffix}${yearSuffix}.png`
                    
                    // Business Card: EMIR_Hi-Hello_Profile-Image_"Name"_"Quarter"-"Year"
                    const businessCardFilename = `EMIR_Hi-Hello_Profile-Image${nameSuffix}${quarterSuffix}${yearSuffix}.png`
                    
                    zip.file(profileFilename, standardBlob)
                    zip.file(businessCardFilename, squareBlob)
                    
                    // Generate and download ZIP
                    const zipBlob = await zip.generateAsync({ type: 'blob' })
                    const link = document.createElement('a')
                    const zipName = name ? `EMIR_Staff-Profile_${name.replace(/[^a-zA-Z0-9]/g, '_')}.zip` : 'EMIR_Staff-Profile_Both-Sizes.zip'
                    link.download = zipName
                    link.href = URL.createObjectURL(zipBlob)
                    link.click()
                  }}
                  className="w-full px-4 py-2 bg-[#bea152] text-white rounded-md text-sm font-medium hover:bg-[#bea152]/90 transition-colors"
                >
                  Download Both Images (ZIP)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
