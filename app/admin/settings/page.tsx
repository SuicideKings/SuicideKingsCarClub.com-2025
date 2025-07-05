"use client"

import { useState, useEffect } from "react"
import { Loader2, Save, Settings, Globe, Mail, CreditCard, Shield, Bell, Users, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface Settings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    maintenanceMode: boolean
    memberRegistration: boolean
    publicGallery: boolean
  }
  email: {
    provider: string
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    fromEmail: string
    fromName: string
  }
  payment: {
    paypalEnabled: boolean
    paypalMode: string
    paypalClientId: string
    paypalClientSecret: string
    stripeEnabled: boolean
    stripePublishableKey: string
    stripeSecretKey: string
  }
  notifications: {
    emailNotifications: boolean
    membershipReminders: boolean
    eventReminders: boolean
    newMemberWelcome: boolean
    paymentConfirmations: boolean
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: string
    passwordRequirements: {
      minLength: number
      requireUppercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
    }
  }
}

export default function SettingsPage() {
  const { isLoading: authLoading } = useAuth()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setSettings({
        general: {
          siteName: "Suicide Kings Car Club",
          siteDescription: "The premier car club for automotive enthusiasts",
          contactEmail: "admin@suicidekingscc.com",
          maintenanceMode: false,
          memberRegistration: true,
          publicGallery: true
        },
        email: {
          provider: "smtp",
          smtpHost: "smtp.gmail.com",
          smtpPort: "587",
          smtpUser: "admin@suicidekingscc.com",
          smtpPassword: "",
          fromEmail: "noreply@suicidekingscc.com",
          fromName: "Suicide Kings Car Club"
        },
        payment: {
          paypalEnabled: true,
          paypalMode: "sandbox",
          paypalClientId: "",
          paypalClientSecret: "",
          stripeEnabled: false,
          stripePublishableKey: "",
          stripeSecretKey: ""
        },
        notifications: {
          emailNotifications: true,
          membershipReminders: true,
          eventReminders: true,
          newMemberWelcome: true,
          paymentConfirmations: true
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: "24",
          passwordRequirements: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialChars: false
          }
        }
      })
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    })
  }

  const updateNestedSetting = (section: keyof Settings, subSection: string, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [subSection]: {
          ...(settings[section] as any)[subSection],
          [key]: value
        }
      }
    })
  }

  if (authLoading || loading || !settings) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-white text-black hover:bg-gray-200"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Basic site configuration and general settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="siteName" className="text-white">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-white">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription" className="text-white">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.general.siteDescription}
                      onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      rows={3}
                    />
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Site Features</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Maintenance Mode</Label>
                        <p className="text-sm text-gray-400">Put the site in maintenance mode</p>
                      </div>
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Member Registration</Label>
                        <p className="text-sm text-gray-400">Allow new member registrations</p>
                      </div>
                      <Switch
                        checked={settings.general.memberRegistration}
                        onCheckedChange={(checked) => updateSetting('general', 'memberRegistration', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Public Gallery</Label>
                        <p className="text-sm text-gray-400">Allow public access to gallery</p>
                      </div>
                      <Switch
                        checked={settings.general.publicGallery}
                        onCheckedChange={(checked) => updateSetting('general', 'publicGallery', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure email settings for notifications and communications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emailProvider" className="text-white">Email Provider</Label>
                      <Select
                        value={settings.email.provider}
                        onValueChange={(value) => updateSetting('email', 'provider', value)}
                      >
                        <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smtp">SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="ses">Amazon SES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {settings.email.provider === 'smtp' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost" className="text-white">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={settings.email.smtpHost}
                          onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort" className="text-white">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          value={settings.email.smtpPort}
                          onChange={(e) => updateSetting('email', 'smtpPort', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser" className="text-white">SMTP Username</Label>
                        <Input
                          id="smtpUser"
                          value={settings.email.smtpUser}
                          onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPassword" className="text-white">SMTP Password</Label>
                        <Input
                          id="smtpPassword"
                          type="password"
                          value={settings.email.smtpPassword}
                          onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="bg-gray-800" />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail" className="text-white">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName" className="text-white">From Name</Label>
                      <Input
                        id="fromName"
                        value={settings.email.fromName}
                        onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5" />
                    Payment Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure payment processors for membership dues and events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white flex items-center gap-2">
                          PayPal
                          <Badge variant={settings.payment.paypalEnabled ? "default" : "secondary"}>
                            {settings.payment.paypalEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </Label>
                        <p className="text-sm text-gray-400">Accept payments via PayPal</p>
                      </div>
                      <Switch
                        checked={settings.payment.paypalEnabled}
                        onCheckedChange={(checked) => updateSetting('payment', 'paypalEnabled', checked)}
                      />
                    </div>

                    {settings.payment.paypalEnabled && (
                      <div className="ml-6 space-y-4 border-l-2 border-gray-800 pl-4">
                        <div className="space-y-2">
                          <Label htmlFor="paypalMode" className="text-white">PayPal Mode</Label>
                          <Select
                            value={settings.payment.paypalMode}
                            onValueChange={(value) => updateSetting('payment', 'paypalMode', value)}
                          >
                            <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                              <SelectItem value="live">Live (Production)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="paypalClientId" className="text-white">Client ID</Label>
                            <Input
                              id="paypalClientId"
                              type="password"
                              value={settings.payment.paypalClientId}
                              onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                              className="border-gray-700 bg-gray-800 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paypalClientSecret" className="text-white">Client Secret</Label>
                            <Input
                              id="paypalClientSecret"
                              type="password"
                              value={settings.payment.paypalClientSecret}
                              onChange={(e) => updateSetting('payment', 'paypalClientSecret', e.target.value)}
                              className="border-gray-700 bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white flex items-center gap-2">
                          Stripe
                          <Badge variant={settings.payment.stripeEnabled ? "default" : "secondary"}>
                            {settings.payment.stripeEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </Label>
                        <p className="text-sm text-gray-400">Accept credit card payments via Stripe</p>
                      </div>
                      <Switch
                        checked={settings.payment.stripeEnabled}
                        onCheckedChange={(checked) => updateSetting('payment', 'stripeEnabled', checked)}
                      />
                    </div>

                    {settings.payment.stripeEnabled && (
                      <div className="ml-6 space-y-4 border-l-2 border-gray-800 pl-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="stripePublishableKey" className="text-white">Publishable Key</Label>
                            <Input
                              id="stripePublishableKey"
                              value={settings.payment.stripePublishableKey}
                              onChange={(e) => updateSetting('payment', 'stripePublishableKey', e.target.value)}
                              className="border-gray-700 bg-gray-800 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="stripeSecretKey" className="text-white">Secret Key</Label>
                            <Input
                              id="stripeSecretKey"
                              type="password"
                              value={settings.payment.stripeSecretKey}
                              onChange={(e) => updateSetting('payment', 'stripeSecretKey', e.target.value)}
                              className="border-gray-700 bg-gray-800 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure email notifications and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Email Notifications</Label>
                        <p className="text-sm text-gray-400">Enable all email notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Membership Reminders</Label>
                        <p className="text-sm text-gray-400">Send renewal reminders to members</p>
                      </div>
                      <Switch
                        checked={settings.notifications.membershipReminders}
                        onCheckedChange={(checked) => updateSetting('notifications', 'membershipReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Event Reminders</Label>
                        <p className="text-sm text-gray-400">Send event reminders to registered members</p>
                      </div>
                      <Switch
                        checked={settings.notifications.eventReminders}
                        onCheckedChange={(checked) => updateSetting('notifications', 'eventReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">New Member Welcome</Label>
                        <p className="text-sm text-gray-400">Send welcome email to new members</p>
                      </div>
                      <Switch
                        checked={settings.notifications.newMemberWelcome}
                        onCheckedChange={(checked) => updateSetting('notifications', 'newMemberWelcome', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Payment Confirmations</Label>
                        <p className="text-sm text-gray-400">Send payment confirmation emails</p>
                      </div>
                      <Switch
                        checked={settings.notifications.paymentConfirmations}
                        onCheckedChange={(checked) => updateSetting('notifications', 'paymentConfirmations', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-white">Session Timeout (hours)</Label>
                      <Select
                        value={settings.security.sessionTimeout}
                        onValueChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                      >
                        <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Hour</SelectItem>
                          <SelectItem value="4">4 Hours</SelectItem>
                          <SelectItem value="8">8 Hours</SelectItem>
                          <SelectItem value="24">24 Hours</SelectItem>
                          <SelectItem value="72">72 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-gray-800" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Password Requirements</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minLength" className="text-white">Minimum Length</Label>
                      <Select
                        value={settings.security.passwordRequirements.minLength.toString()}
                        onValueChange={(value) => updateNestedSetting('security', 'passwordRequirements', 'minLength', parseInt(value))}
                      >
                        <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 characters</SelectItem>
                          <SelectItem value="8">8 characters</SelectItem>
                          <SelectItem value="12">12 characters</SelectItem>
                          <SelectItem value="16">16 characters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Require Uppercase Letters</Label>
                        <p className="text-sm text-gray-400">At least one uppercase letter required</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequirements.requireUppercase}
                        onCheckedChange={(checked) => updateNestedSetting('security', 'passwordRequirements', 'requireUppercase', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Require Numbers</Label>
                        <p className="text-sm text-gray-400">At least one number required</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequirements.requireNumbers}
                        onCheckedChange={(checked) => updateNestedSetting('security', 'passwordRequirements', 'requireNumbers', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-white">Require Special Characters</Label>
                        <p className="text-sm text-gray-400">At least one special character required</p>
                      </div>
                      <Switch
                        checked={settings.security.passwordRequirements.requireSpecialChars}
                        onCheckedChange={(checked) => updateNestedSetting('security', 'passwordRequirements', 'requireSpecialChars', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}