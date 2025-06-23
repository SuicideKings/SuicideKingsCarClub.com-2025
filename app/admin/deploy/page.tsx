"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Cloud, Database, Settings, Rocket, Download } from "lucide-react"
import { toast } from "sonner"

interface DeploymentConfig {
  hosting: string
  database: string
  region?: string
  credentials: Record<string, string>
}

const hostingProviders = [
  {
    id: "vercel",
    name: "Vercel",
    icon: "🚀",
    description: "Zero-config deployments with edge functions",
    free: true,
    features: ["Auto SSL", "CDN", "Serverless Functions", "Analytics"],
    credentials: ["VERCEL_TOKEN"],
  },
  {
    id: "netlify",
    name: "Netlify",
    icon: "🌐",
    description: "JAMstack platform with continuous deployment",
    free: true,
    features: ["Forms", "Functions", "Identity", "Analytics"],
    credentials: ["NETLIFY_TOKEN"],
  },
  {
    id: "cloudflare",
    name: "Cloudflare Pages",
    icon: "☁️",
    description: "Fast, secure, and free static site hosting",
    free: true,
    features: ["Workers", "KV Storage", "Analytics", "R2 Storage"],
    credentials: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
  },
  {
    id: "aws",
    name: "AWS Amplify",
    icon: "🔶",
    description: "Full-stack development platform",
    free: true,
    features: ["CI/CD", "Auth", "Storage", "APIs"],
    credentials: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
  },
  {
    id: "firebase",
    name: "Firebase Hosting",
    icon: "🔥",
    description: "Google's web app hosting platform",
    free: true,
    features: ["Firestore", "Auth", "Functions", "Analytics"],
    credentials: ["FIREBASE_TOKEN"],
  },
  {
    id: "github",
    name: "GitHub Pages",
    icon: "🐙",
    description: "Static site hosting from GitHub repositories",
    free: true,
    features: ["Custom Domains", "HTTPS", "Jekyll Support"],
    credentials: ["GITHUB_TOKEN"],
  },
]

const databaseProviders = [
  {
    id: "neon",
    name: "Neon",
    icon: "⚡",
    description: "Serverless PostgreSQL with branching",
    free: true,
    features: ["Auto-scaling", "Branching", "Point-in-time Recovery"],
    credentials: ["NEON_DATABASE_URL"],
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: "🟢",
    description: "Open source Firebase alternative",
    free: true,
    features: ["Auth", "Real-time", "Storage", "Edge Functions"],
    credentials: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_KEY"],
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    icon: "🪐",
    description: "Serverless MySQL platform",
    free: true,
    features: ["Branching", "Schema Changes", "Analytics"],
    credentials: ["PLANETSCALE_DATABASE_URL"],
  },
  {
    id: "upstash",
    name: "Upstash Redis",
    icon: "🔴",
    description: "Serverless Redis for caching and sessions",
    free: true,
    features: ["REST API", "Global Replication", "Analytics"],
    credentials: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  },
  {
    id: "mongodb",
    name: "MongoDB Atlas",
    icon: "🍃",
    description: "Cloud-native document database",
    free: true,
    features: ["Auto-scaling", "Global Clusters", "Charts"],
    credentials: ["MONGODB_URI"],
  },
  {
    id: "turso",
    name: "Turso (SQLite)",
    icon: "🐚",
    description: "Edge-hosted SQLite database",
    free: true,
    features: ["Edge Replication", "Embedded Replicas", "LibSQL"],
    credentials: ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"],
  },
]

export default function DeployPage() {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<DeploymentConfig>({
    hosting: "",
    database: "",
    credentials: {},
  })
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "deploying" | "success" | "error">("idle")
  const [deploymentUrl, setDeploymentUrl] = useState("")

  const selectedHosting = hostingProviders.find((p) => p.id === config.hosting)
  const selectedDatabase = databaseProviders.find((p) => p.id === config.database)

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus("deploying")

    try {
      const response = await fetch("/api/admin/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const result = await response.json()

      if (result.success) {
        setDeploymentStatus("success")
        setDeploymentUrl(result.url)
        toast.success("Deployment successful!")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setDeploymentStatus("error")
      toast.error("Deployment failed: " + (error as Error).message)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deploy Your Site</h1>
        <p className="text-gray-600">Choose your hosting platform and database, then deploy with one click</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Choose Hosting</span>
          <span>Choose Database</span>
          <span>Configure</span>
          <span>Deploy</span>
        </div>
      </div>

      <Tabs value={step.toString()} className="w-full">
        {/* Step 1: Choose Hosting */}
        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Choose Hosting Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostingProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      config.hosting === provider.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setConfig((prev) => ({ ...prev, hosting: provider.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          {provider.free && (
                            <Badge variant="secondary" className="text-xs">
                              Free Tier
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                      <div className="space-y-1">
                        {provider.features.map((feature) => (
                          <div key={feature} className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button onClick={() => setStep(2)} disabled={!config.hosting} className="px-8">
                  Next: Choose Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Choose Database */}
        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Choose Database Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {databaseProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      config.database === provider.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setConfig((prev) => ({ ...prev, database: provider.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          {provider.free && (
                            <Badge variant="secondary" className="text-xs">
                              Free Tier
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                      <div className="space-y-1">
                        {provider.features.map((feature) => (
                          <div key={feature} className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!config.database} className="px-8">
                  Next: Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Configure Credentials */}
        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configure Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hosting Credentials */}
              {selectedHosting && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-xl">{selectedHosting.icon}</span>
                    {selectedHosting.name} Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedHosting.credentials.map((cred) => (
                      <div key={cred}>
                        <Label htmlFor={cred}>{cred}</Label>
                        <Input
                          id={cred}
                          type="password"
                          placeholder={`Enter your ${cred}`}
                          value={config.credentials[cred] || ""}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              credentials: { ...prev.credentials, [cred]: e.target.value },
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Database Credentials */}
              {selectedDatabase && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="text-xl">{selectedDatabase.icon}</span>
                    {selectedDatabase.name} Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDatabase.credentials.map((cred) => (
                      <div key={cred}>
                        <Label htmlFor={cred}>{cred}</Label>
                        <Input
                          id={cred}
                          type="password"
                          placeholder={`Enter your ${cred}`}
                          value={config.credentials[cred] || ""}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              credentials: { ...prev.credentials, [cred]: e.target.value },
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <div>
                <h3 className="font-semibold mb-3">Additional Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Deployment Region</Label>
                    <Select
                      value={config.region}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="domain">Custom Domain (Optional)</Label>
                    <Input
                      id="domain"
                      placeholder="yourdomain.com"
                      value={config.credentials.domain || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          credentials: { ...prev.credentials, domain: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="px-8">
                  Next: Deploy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Deploy */}
        <TabsContent value="4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Deploy Your Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Deployment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Deployment Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Hosting Platform</p>
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-lg">{selectedHosting?.icon}</span>
                        {selectedHosting?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Database</p>
                      <p className="font-medium flex items-center gap-2">
                        <span className="text-lg">{selectedDatabase?.icon}</span>
                        {selectedDatabase?.name}
                      </p>
                    </div>
                    {config.region && (
                      <div>
                        <p className="text-sm text-gray-600">Region</p>
                        <p className="font-medium">{config.region}</p>
                      </div>
                    )}
                    {config.credentials.domain && (
                      <div>
                        <p className="text-sm text-gray-600">Custom Domain</p>
                        <p className="font-medium">{config.credentials.domain}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Deployment Status */}
                {deploymentStatus !== "idle" && (
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {deploymentStatus === "deploying" && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                      {deploymentStatus === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {deploymentStatus === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
                      <h3 className="font-semibold">
                        {deploymentStatus === "deploying" && "Deploying..."}
                        {deploymentStatus === "success" && "Deployment Successful!"}
                        {deploymentStatus === "error" && "Deployment Failed"}
                      </h3>
                    </div>

                    {deploymentStatus === "success" && deploymentUrl && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Your site is now live at:</p>
                        <a
                          href={deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {deploymentUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Deploy Button */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)} disabled={isDeploying}>
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const response = await fetch("/api/admin/deploy/download", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(config),
                      })

                      if (response.ok) {
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `suicide-kings-${config.hosting}-${config.database}.zip`
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        document.body.removeChild(a)
                        toast.success("Files downloaded successfully!")
                      } else {
                        toast.error("Download failed")
                      }
                    }}
                    className="px-8"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Files
                  </Button>
                  <Button
                    onClick={handleDeploy}
                    disabled={isDeploying || deploymentStatus === "success"}
                    className="px-8"
                  >
                    {isDeploying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : deploymentStatus === "success" ? (
                      "Deployed Successfully"
                    ) : (
                      "Deploy Now"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
