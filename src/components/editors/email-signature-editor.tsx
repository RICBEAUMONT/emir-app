'use client'

import React, { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { Tooltip } from '../ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

type EmailTemplate = 'professional' | 'minimal'

interface EmailSignatureData {
  fullName: string
  jobTitle: string
  companyName: string
  email: string
  phone: string
  whatsapp: string
  website: string
  address: string
  linkedinUrl: string
  twitterUrl: string
  instagramUrl: string
  youtubeUrl: string
  logoUrl: string
  animatedBannerUrl: string
  tagline: string
  colorScheme: string
}

interface EmailSignatureEditorProps {
  template: EmailTemplate
  onPreviewUpdate?: (html: string) => void
}

const defaultSignatureData: EmailSignatureData = {
  fullName: 'Alastair Young',
  jobTitle: 'PARTNER',
  companyName: 'EMIR Intelligence',
  email: '',
  phone: '+971 4 558 8197',
  whatsapp: '+971 52 149 9013',
  website: 'www.emirintelligence.com',
  address: 'Level 1, Office 124, Building 9 Dubai Media City,\nDubai U.A.E. P.O. Box 503014',
  linkedinUrl: 'https://www.linkedin.com/company/emiradvisory/',
  twitterUrl: '',
  instagramUrl: '',
  youtubeUrl: 'https://www.youtube.com/@emiradvisory',
  logoUrl: 'https://www.emirintelligence.com/wp-content/uploads/2024/04/EMIR_Logo.png',
  animatedBannerUrl: 'https://emirintelligence.imgix.net/2024/04/EMIR_Marcomms_Animated-Email-Banner_Q1-2024.gif',
  tagline: 'For complementary insights, follow EMIR:',
  colorScheme: '#bea152'
}

export function EmailSignatureEditor({ template, onPreviewUpdate }: EmailSignatureEditorProps) {
  const [signatureData, setSignatureData] = useState<EmailSignatureData>(defaultSignatureData)
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Live preview - no validation required

  // Generate HTML signature when form data changes - LIVE PREVIEW
  useEffect(() => {
    const html = generateSignatureHtml(signatureData, template)
    setGeneratedHtml(html)
    if (onPreviewUpdate) {
      onPreviewUpdate(html)
    }
  }, [signatureData, template, onPreviewUpdate])

  const updateSignatureData = (updates: Partial<EmailSignatureData>) => {
    setSignatureData(prev => ({ ...prev, ...updates }))
  }

  const generateSignatureHtml = (data: EmailSignatureData, template: EmailTemplate): string => {
    if (template === 'minimal') {
      return generateMinimalSignature(data)
    }
    
    return generateProfessionalSignature(data)
  }

  const generateProfessionalSignature = (data: EmailSignatureData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>EMIR Email Signature</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; width: 450px;">
        <table>
            <tr>
                <td>
                    <p style="font-size: 0.9em;">Kind Regards,</p>
                    <b style="font-size: 1.2em;">${data.fullName}</b><br>
                    <span style="font-size: 0.8em;">${data.jobTitle}</span>
                    <a href="https://hubs.li/Q02lv_xh0"><div style="margin-top: 20px; margin-bottom: 20px;">
                        <img src="${data.logoUrl}" alt="EMIR Logo" width="180">
                    </div></a>
                </td>
            </tr>
            <tr>
                <td style="font-size: 0.9em; margin-bottom: 12px;">
                    ${data.address ? `${data.address.replace(/\n/g, '<br>')}<br>` : ''}
                    ${data.phone ? `Phone: ${data.phone}<br>` : ''}
                    ${data.whatsapp ? `EMIR WhatsApp: ${data.whatsapp}<br>` : ''}
                    ${data.email ? `<a href="mailto:${data.email}" style="color: #bea152;">${data.email}</a><br>` : ''}
                    ${data.website ? `<a href="http://${data.website}" style="color: #bea152;"><b>${data.website}</b></a>` : ''}
                </td>
            </tr>
            <tr>
                <td style="font-size: 0.8em;">
                    <br>
                    ${data.tagline}
                </td>
            </tr>
            <tr>
                <td>
                    <table>
                        <tr>
                            ${data.linkedinUrl ? `
                                <td class="social-icons">
                                    <a href="${data.linkedinUrl}" target="_blank"><img src="https://emirintelligence.imgix.net/2024/04/linkedin.jpg" alt="EMIR Linkedin"></a>
                                </td>
                            ` : ''}
                            ${data.twitterUrl ? `
                                <td class="social-icons">
                                    <a href="${data.twitterUrl}" target="_blank"><img src="https://emirintelligence.imgix.net/2024/04/twitter.jpg" alt="EMIR Twitter"></a>
                                </td>
                            ` : ''}
                            ${data.instagramUrl ? `
                                <td class="social-icons">
                                    <a href="${data.instagramUrl}" target="_blank"><img src="https://emirintelligence.imgix.net/2024/04/instagram.jpg" alt="EMIR Instagram"></a>
                                </td>
                            ` : ''}
                            ${data.youtubeUrl ? `
                                <td class="social-icons">
                                    <a href="${data.youtubeUrl}" target="_blank"><img src="https://emirintelligence.imgix.net/2024/04/youtube.jpg" alt="EMIR Youtube"></a>
                                </td>
                            ` : ''}
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 20px;">
                    <a href="https://hubs.li/Q02lv_xh0" target="_blank"><img src="${data.animatedBannerUrl}" alt="EMIR Marketing Communications Animated Email Banner Q1-2024" width="420"></a>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`
  }

  const generateMinimalSignature = (data: EmailSignatureData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <title>EMIR Email Signature</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; width: 450px;">
        <table>
            <tr>
                <td>
                    <p style="font-size: 0.9em;">Kind Regards,</p>
                    <b style="font-size: 1.2em;">${data.fullName}</b><br>
                    <span style="font-size: 0.8em;">${data.jobTitle}</span>
                    <a href="https://hubs.li/Q02lv_xh0"><div style="margin-top: 20px; margin-bottom: 20px;">
                        <img src="${data.logoUrl}" alt="EMIR Logo" width="180">
                    </div></a>
                </td>
            </tr>
            <tr>
                <td style="font-size: 0.9em; margin-bottom: 12px;">
                    ${data.address ? `${data.address.replace(/\n/g, '<br>')}<br>` : ''}
                    ${data.phone ? `Phone: ${data.phone}<br>` : ''}
                    ${data.whatsapp ? `EMIR WhatsApp: ${data.whatsapp}<br>` : ''}
                    ${data.email ? `<a href="mailto:${data.email}" style="color: #bea152;">${data.email}</a><br>` : ''}
                    ${data.website ? `<a href="http://${data.website}" style="color: #bea152;"><b>${data.website}</b></a>` : ''}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`
  }

  return (
    <div className="space-y-6">
      <form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Personal Information
                  <Tooltip content="Enter your personal and professional details">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <input
                    id="fullName"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="John Doe"
                    value={signatureData.fullName}
                    onChange={(e) => updateSignatureData({ fullName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <input
                    id="jobTitle"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Senior Marketing Manager"
                    value={signatureData.jobTitle}
                    onChange={(e) => updateSignatureData({ jobTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <input
                    id="companyName"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="EMIR Intelligence"
                    value={signatureData.companyName}
                    onChange={(e) => updateSignatureData({ companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="your.name@emirintelligence.com"
                    value={signatureData.email}
                    onChange={(e) => updateSignatureData({ email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <input
                    id="phone"
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="+971 4 558 8197"
                    value={signatureData.phone}
                    onChange={(e) => updateSignatureData({ phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">EMIR WhatsApp</Label>
                  <input
                    id="whatsapp"
                    type="tel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="+971 52 149 9013"
                    value={signatureData.whatsapp}
                    onChange={(e) => updateSignatureData({ whatsapp: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <input
                    id="website"
                    type="url"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="www.emirintelligence.com"
                    value={signatureData.website}
                    onChange={(e) => updateSignatureData({ website: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Additional Information
                  <Tooltip content="Optional details to enhance your signature">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="Level 1, Office 124, Building 9 Dubai Media City,\nDubai U.A.E. P.O. Box 503014"
                    value={signatureData.address}
                    onChange={(e) => updateSignatureData({ address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <input
                    id="tagline"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="For complementary insights, follow EMIR:"
                    value={signatureData.tagline}
                    onChange={(e) => updateSignatureData({ tagline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <input
                    id="logoUrl"
                    type="url"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://www.emirintelligence.com/wp-content/uploads/2024/04/EMIR_Logo.png"
                    value={signatureData.logoUrl}
                    onChange={(e) => updateSignatureData({ logoUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animatedBannerUrl">Animated Banner URL</Label>
                  <input
                    id="animatedBannerUrl"
                    type="url"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://emirintelligence.imgix.net/2024/04/EMIR_Marcomms_Animated-Email-Banner_Q1-2024.gif"
                    value={signatureData.animatedBannerUrl}
                    onChange={(e) => updateSignatureData({ animatedBannerUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Social Media & Styling */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Social Media Links
                  <Tooltip content="Add your social media profiles">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <input
                    id="linkedinUrl"
                    type="url"
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      signatureData.linkedinUrl ? 'border-input bg-background' : 'border-gray-300 bg-gray-50 border-dashed'
                    }`}
                    placeholder="Enter LinkedIn URL (optional)"
                    value={signatureData.linkedinUrl}
                    onChange={(e) => updateSignatureData({ linkedinUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter URL</Label>
                  <input
                    id="twitterUrl"
                    type="url"
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      signatureData.twitterUrl ? 'border-input bg-background' : 'border-gray-300 bg-gray-50 border-dashed'
                    }`}
                    placeholder="Enter Twitter URL (optional)"
                    value={signatureData.twitterUrl}
                    onChange={(e) => updateSignatureData({ twitterUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">Instagram URL</Label>
                  <input
                    id="instagramUrl"
                    type="url"
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      signatureData.instagramUrl ? 'border-input bg-background' : 'border-gray-300 bg-gray-50 border-dashed'
                    }`}
                    placeholder="Enter Instagram URL (optional)"
                    value={signatureData.instagramUrl}
                    onChange={(e) => updateSignatureData({ instagramUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <input
                    id="youtubeUrl"
                    type="url"
                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      signatureData.youtubeUrl ? 'border-input bg-background' : 'border-gray-300 bg-gray-50 border-dashed'
                    }`}
                    placeholder="Enter YouTube URL (optional)"
                    value={signatureData.youtubeUrl}
                    onChange={(e) => updateSignatureData({ youtubeUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Styling
                  <Tooltip content="Customize the appearance of your signature">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="colorScheme">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="colorScheme"
                      type="color"
                      className="h-10 w-16 rounded-md border border-input cursor-pointer"
                      value={signatureData.colorScheme}
                      onChange={(e) => updateSignatureData({ colorScheme: e.target.value })}
                    />
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={signatureData.colorScheme}
                      onChange={(e) => updateSignatureData({ colorScheme: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </form>
    </div>
  )
}
