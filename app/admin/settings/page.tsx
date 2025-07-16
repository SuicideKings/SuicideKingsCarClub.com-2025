"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Save, 
  Globe,
  Shield,
  Mail,
  Database,
  Palette,
  Bell
} from "lucide-react"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 1000)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-400 mt-2">
              Configure application settings and preferences
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
          <TabsTrigger value="general" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Database className="w-4 h-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Basic application configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white">Site Name</Label>
                  <Input
                    id="siteName"
                    placeholder="Suicide Kings Car Club"
                    className="bg-black/40 border-gray-700 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteUrl" className="text-white">Site URL</Label>
                  <Input
                    id="siteUrl"
                    placeholder="https://suicidekingscarclub.com"
                    className="bg-black/40 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-white">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  placeholder="Official website for the Suicide Kings Car Club"
                  className="bg-black/40 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance" className="text-white">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Enable maintenance mode for the entire site</p>
                </div>
                <Switch id="maintenance" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registrations" className="text-white">User Registrations</Label>
                  <p className="text-sm text-gray-400">Allow new user registrations</p>
                </div>
                <Switch id="registrations" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Security configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure email delivery and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mail className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Email configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Database Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Database configuration and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Database configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}