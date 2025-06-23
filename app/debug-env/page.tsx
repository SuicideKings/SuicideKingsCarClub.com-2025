import { ALL_ENV } from "@/lib/env-direct"

export default function DebugEnvPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Environment Debug</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Direct Environment Variables</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Database URL:</h3>
            <div className="bg-gray-100 p-2 rounded">
              {ALL_ENV.DATABASE_URL ? (
                <span className="text-green-600">✓ Available</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Auth Secret:</h3>
            <div className="bg-gray-100 p-2 rounded">
              {ALL_ENV.AUTH_SECRET ? (
                <span className="text-green-600">✓ Available</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Blob Token:</h3>
            <div className="bg-gray-100 p-2 rounded">
              {ALL_ENV.BLOB_TOKEN ? (
                <span className="text-green-600">✓ Available</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
