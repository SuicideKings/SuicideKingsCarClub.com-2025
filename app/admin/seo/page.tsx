"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Globe, 
  TrendingUp, 
  Settings, 
  Save, 
  Eye, 
  BarChart3,
  Link as LinkIcon,
  Tag,
  FileText,
  Image as ImageIcon,
  Zap,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOSettings {
  siteTitle: string
  siteDescription: string
  siteKeywords: string[]
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  twitterSite: string
  robotsTxt: string
  structuredData: {
    enabled: boolean
    organizationName: string
    organizationUrl: string
    organizationLogo: string
    socialProfiles: string[]
  }
  urlSettings: {
    enableFriendlyUrls: boolean
    forumCategoryPrefix: string
    forumTopicPrefix: string
    removeTrailingSlash: boolean
  }
}

const defaultSEOSettings: SEOSettings = {
  siteTitle: "Suicide Kings Car Club - Lincoln Continental Enthusiasts",
  siteDescription: "Join the premier car club for 1961-1969 Lincoln Continental owners. Connect with fellow enthusiasts, share your passion, and preserve automotive history.",
  siteKeywords: ["lincoln continental", "suicide doors", "car club", "classic cars", "1961-1969", "automotive enthusiasts"],
  canonicalUrl: "https://suicidekingscarclub.com",
  ogTitle: "Suicide Kings Car Club - Lincoln Continental Community",
  ogDescription: "The premier community for Lincoln Continental enthusiasts. Honor • Loyalty • Respect",
  ogImage: "https://suicidekingscarclub.com/images/og-image.jpg",
  twitterCard: "summary_large_image",
  twitterSite: "@SuicideKingsCC",
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /member/private/
Disallow: /api/

Sitemap: https://suicidekingscarclub.com/sitemap.xml`,
  structuredData: {
    enabled: true,
    organizationName: "Suicide Kings Car Club",
    organizationUrl: "https://suicidekingscarclub.com",
    organizationLogo: "https://suicidekingscarclub.com/images/logo.png",
    socialProfiles: [
      "https://facebook.com/suicidekingscarclub",
      "https://instagram.com/suicidekingscc",
      "https://youtube.com/@suicidekingscarclub"
    ]
  },
  urlSettings: {
    enableFriendlyUrls: true,
    forumCategoryPrefix: "forum",
    forumTopicPrefix: "topic",
    removeTrailingSlash: true
  }
}

export default function SEOAdminPage() {
  const [settings, setSettings] = useState<SEOSettings>(defaultSEOSettings)
  const [loading, setLoading] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [seoScore, setSeoScore] = useState(85)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastSaved(new Date())
      // Update SEO score based on settings
      calculateSEOScore()
    } catch (error) {
      console.error("Failed to save SEO settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSEOScore = () => {
    let score = 0
    
    // Title optimization (max 20 points)
    if (settings.siteTitle.length >= 30 && settings.siteTitle.length <= 60) score += 20
    else if (settings.siteTitle.length > 0) score += 10
    
    // Description optimization (max 20 points)
    if (settings.siteDescription.length >= 120 && settings.siteDescription.length <= 160) score += 20
    else if (settings.siteDescription.length > 0) score += 10
    
    // Keywords (max 15 points)
    if (settings.siteKeywords.length >= 3 && settings.siteKeywords.length <= 8) score += 15
    else if (settings.siteKeywords.length > 0) score += 8
    
    // OpenGraph (max 20 points)
    if (settings.ogTitle && settings.ogDescription && settings.ogImage) score += 20
    else if (settings.ogTitle || settings.ogDescription) score += 10
    
    // Structured Data (max 15 points)
    if (settings.structuredData.enabled) score += 15
    
    // URL Settings (max 10 points)
    if (settings.urlSettings.enableFriendlyUrls) score += 10
    
    setSeoScore(Math.min(score, 100))
  }

  const addKeyword = (keyword: string) => {
    if (keyword && !settings.siteKeywords.includes(keyword)) {
      setSettings(prev => ({
        ...prev,
        siteKeywords: [...prev.siteKeywords, keyword]
      }))
    }
  }

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      siteKeywords: prev.siteKeywords.filter(k => k !== keyword)
    }))
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600"
    if (score >= 60) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getSEOScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", icon: CheckCircle, color: "text-green-400" }
    if (score >= 60) return { label: "Good", icon: AlertTriangle, color: "text-yellow-400" }
    return { label: "Needs Work", icon: AlertTriangle, color: "text-red-400" }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SEO Administration
                </h1>
                <p className="text-gray-400 mt-2">
                  Optimize your site for search engines and improve visibility
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-sm text-gray-400">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* SEO Score Card */}
          <Card className="mb-8 bg-black/40 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                SEO Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getSEOScoreColor(seoScore)} flex items-center justify-center`}>
                      <span className="text-2xl font-bold text-white">{seoScore}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const status = getSEOScoreStatus(seoScore)
                      const StatusIcon = status.icon
                      return (
                        <>
                          <StatusIcon className={`w-5 h-5 ${status.color}`} />
                          <span className={`font-semibold ${status.color}`}>{status.label}</span>
                        </>
                      )
                    })()}
                  </div>
                  <p className="text-gray-400">
                    Your SEO configuration is performing well. Continue optimizing for better search visibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
              <TabsTrigger value="general" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Globe className="w-4 h-4 mr-2" />
                Social Media
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Zap className="w-4 h-4 mr-2" />
                Technical
              </TabsTrigger>
              <TabsTrigger value="urls" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <LinkIcon className="w-4 h-4 mr-2" />
                URL Structure
              </TabsTrigger>
            </TabsList>

            {/* General SEO Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Basic SEO Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure the fundamental SEO elements for your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Site Title</Label>
                    <Input
                      value={settings.siteTitle}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Enter your site title"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Recommended: 30-60 characters</span>
                      <span className={settings.siteTitle.length > 60 ? "text-red-400" : "text-green-400"}>
                        {settings.siteTitle.length}/60
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Meta Description</Label>
                    <Textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white min-h-20"
                      placeholder="Enter your site description"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Recommended: 120-160 characters</span>
                      <span className={settings.siteDescription.length > 160 ? "text-red-400" : "text-green-400"}>
                        {settings.siteDescription.length}/160
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Keywords</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {settings.siteKeywords.map((keyword) => (
                        <Badge 
                          key={keyword} 
                          className="bg-red-600/20 text-red-400 border-red-500/30 cursor-pointer hover:bg-red-600/30"
                          onClick={() => removeKeyword(keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add keyword and press Enter"
                      className="bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyword(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <p className="text-xs text-gray-400">
                      Click on keywords to remove them. Recommended: 3-8 keywords.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Canonical URL</Label>
                    <Input
                      value={settings.canonicalUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://your-domain.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media SEO */}
            <TabsContent value="social" className="space-y-6">
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Open Graph & Twitter Cards</CardTitle>
                  <CardDescription className="text-gray-400">
                    Optimize how your content appears when shared on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Open Graph</h3>
                      <div className="space-y-2">
                        <Label className="text-gray-300">OG Title</Label>
                        <Input
                          value={settings.ogTitle}
                          onChange={(e) => setSettings(prev => ({ ...prev, ogTitle: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">OG Description</Label>
                        <Textarea
                          value={settings.ogDescription}
                          onChange={(e) => setSettings(prev => ({ ...prev, ogDescription: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">OG Image URL</Label>
                        <Input
                          value={settings.ogImage}
                          onChange={(e) => setSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="https://your-domain.com/og-image.jpg"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Twitter Cards</h3>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Twitter Card Type</Label>
                        <select
                          value={settings.twitterCard}
                          onChange={(e) => setSettings(prev => ({ ...prev, twitterCard: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
                        >
                          <option value="summary">Summary</option>
                          <option value="summary_large_image">Summary Large Image</option>
                          <option value="app">App</option>
                          <option value="player">Player</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Twitter Site Handle</Label>
                        <Input
                          value={settings.twitterSite}
                          onChange={(e) => setSettings(prev => ({ ...prev, twitterSite: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder="@yourtwitterhandle"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical SEO */}
            <TabsContent value="technical" className="space-y-6">
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Technical SEO Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure robots.txt, structured data, and other technical aspects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Robots.txt Content</Label>
                    <Textarea
                      value={settings.robotsTxt}
                      onChange={(e) => setSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm min-h-32"
                    />
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => window.open('/robots.txt', '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigator.clipboard.writeText(settings.robotsTxt)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Structured Data (JSON-LD)</h3>
                        <p className="text-sm text-gray-400">Enable rich snippets and better search understanding</p>
                      </div>
                      <Switch
                        checked={settings.structuredData.enabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            structuredData: { ...prev.structuredData, enabled: checked }
                          }))
                        }
                      />
                    </div>

                    {settings.structuredData.enabled && (
                      <div className="space-y-4 pl-6 border-l-2 border-red-500">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Organization Name</Label>
                          <Input
                            value={settings.structuredData.organizationName}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              structuredData: { ...prev.structuredData, organizationName: e.target.value }
                            }))}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Organization URL</Label>
                          <Input
                            value={settings.structuredData.organizationUrl}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              structuredData: { ...prev.structuredData, organizationUrl: e.target.value }
                            }))}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Logo URL</Label>
                          <Input
                            value={settings.structuredData.organizationLogo}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              structuredData: { ...prev.structuredData, organizationLogo: e.target.value }
                            }))}
                            className="bg-gray-800 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* URL Structure */}
            <TabsContent value="urls" className="space-y-6">
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">URL Structure & SEO-Friendly URLs</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure how URLs are structured for better SEO
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Enable SEO-Friendly URLs</h3>
                      <p className="text-sm text-gray-400">Use descriptive URLs instead of IDs</p>
                    </div>
                    <Switch
                      checked={settings.urlSettings.enableFriendlyUrls}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          urlSettings: { ...prev.urlSettings, enableFriendlyUrls: checked }
                        }))
                      }
                    />
                  </div>

                  {settings.urlSettings.enableFriendlyUrls && (
                    <div className="space-y-6 pl-6 border-l-2 border-red-500">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">URL Examples:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Old:</span>
                            <code className="bg-gray-800 px-2 py-1 rounded text-red-400">/forum/category/2</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">New:</span>
                            <code className="bg-gray-800 px-2 py-1 rounded text-green-400">/forum/technical-help</code>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Forum Category Prefix</Label>
                          <Input
                            value={settings.urlSettings.forumCategoryPrefix}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              urlSettings: { ...prev.urlSettings, forumCategoryPrefix: e.target.value }
                            }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="forum"
                          />
                          <p className="text-xs text-gray-400">
                            Example: /{settings.urlSettings.forumCategoryPrefix}/technical-help
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-300">Topic Prefix</Label>
                          <Input
                            value={settings.urlSettings.forumTopicPrefix}
                            onChange={(e) => setSettings(prev => ({ 
                              ...prev, 
                              urlSettings: { ...prev.urlSettings, forumTopicPrefix: e.target.value }
                            }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            placeholder="topic"
                          />
                          <p className="text-xs text-gray-400">
                            Example: /{settings.urlSettings.forumTopicPrefix}/engine-rebuild-tips
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">Remove Trailing Slashes</h4>
                          <p className="text-sm text-gray-400">Prevent duplicate content issues</p>
                        </div>
                        <Switch
                          checked={settings.urlSettings.removeTrailingSlash}
                          onCheckedChange={(checked) => 
                            setSettings(prev => ({ 
                              ...prev, 
                              urlSettings: { ...prev.urlSettings, removeTrailingSlash: checked }
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Tools */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">SEO Tools & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                      onClick={() => window.open('/sitemap.xml', '_blank')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Sitemap
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                      onClick={() => window.open('/robots.txt', '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Robots.txt
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                      onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Search Console
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start"
                      onClick={() => window.open('https://developers.facebook.com/tools/debug/', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      OG Debugger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  )
}