import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <Image
            src="/images/suicide-kings-car-club-logo.png"
            alt="Suicide Kings Logo"
            width={200}
            height={100}
            className="mx-auto"
          />
        </div>
        <div className="mb-4">
          <div className="mx-auto h-2 w-48 overflow-hidden rounded bg-gray-800">
            <div className="h-full w-full animate-pulse bg-red-600"></div>
          </div>
        </div>
        <p className="text-gray-400 animate-pulse">Loading Suicide Kings Car Club...</p>
      </div>
    </div>
  )
}
