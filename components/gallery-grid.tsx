import Image from "next/image"
import Link from "next/link"

const galleryImages = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Classic Lincoln Continental" },
  { src: "/images/events/summer-cruise.jpg", alt: "Summer Cruise Event" },
  { src: "/images/events/show-shine.jpg", alt: "Show & Shine Event" },
  { src: "/images/events/fall-road-trip.jpg", alt: "Fall Road Trip" },
  { src: "/images/events/ie-monthly-meet.jpg", alt: "Inland Empire Meet" },
  { src: "/images/events/wa-cruise.jpg", alt: "Washington Cruise" },
  { src: "/images/events/desert-run.jpg", alt: "Desert Run" },
  { src: "/vintage-lincoln-continental.png", alt: "Vintage Lincoln Continental" },
]

export default function GalleryGrid() {
  return (
    <section className="bg-gray-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Gallery</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Explore stunning photos from our events and member car showcases
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {galleryImages.map((image, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 transition-colors duration-300">
              <Image
                src={image.src}
                alt={image.alt}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link 
            href="/gallery" 
            className="inline-block text-sm text-red-500 hover:text-red-400 underline-offset-4 hover:underline transition-colors duration-200"
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  )
}
