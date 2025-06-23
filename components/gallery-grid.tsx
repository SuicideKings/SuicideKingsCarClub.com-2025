import Image from "next/image"
import Link from "next/link"

export default function GalleryGrid() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-lg">
            <Image
              src={`/vintage-lincoln-continental.png?key=0ir95&height=300&width=300&query=vintage Lincoln Continental ${1961 + (i % 9)} classic car`}
              alt={`Lincoln Continental Gallery Image ${i + 1}`}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/gallery" className="inline-block text-sm text-white underline-offset-4 hover:underline">
          View Full Gallery
        </Link>
      </div>
    </>
  )
}
