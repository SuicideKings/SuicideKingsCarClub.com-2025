import Image from "next/image"
import Link from "next/link"
import { Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would typically come from a database
const galleryCategories = [
  { id: "all", name: "All Photos" },
  { id: "sknc", name: "Northern California" },
  { id: "skie", name: "Inland Empire" },
  { id: "skla", name: "Los Angeles" },
  { id: "skwa", name: "Washington" },
  { id: "skcv", name: "Coachella Valley" },
  { id: "events", name: "Events" },
  { id: "cars", name: "Cars" },
]

// Generate gallery images
const galleryImages = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Gallery Image ${i + 1}`,
  description: `Lincoln Continental classic car photo ${i + 1}`,
  chapter: galleryCategories[Math.floor(Math.random() * 5) + 1].id,
  category: Math.random() > 0.5 ? "events" : "cars",
  image: `/images/gallery/gallery-${i + 1}.jpg`,
}))

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Page Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-64 w-full bg-black">
            <Image
              src="/images/gallery/gallery-header.jpg"
              alt="Lincoln Continental Gallery"
              fill
              className="object-cover opacity-50"
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Gallery</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Browse our collection of Lincoln Continental photos from across all chapters.
          </p>
        </div>
      </div>

      {/* Gallery Filters */}
      <div className="sticky top-16 z-20 bg-gray-900 py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter Gallery:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {galleryCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className={
                    category.id === "all" ? "border-gray-700 bg-gray-800" : "border-gray-700 hover:bg-gray-800"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image.image || "/placeholder.svg"}
                  alt={image.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-lg font-bold">{image.title}</h3>
                  <p className="text-sm text-gray-300">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <Button className="bg-white text-black hover:bg-gray-200">Load More Photos</Button>
          </div>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Featured Albums</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((id) => (
              <Link key={id} href={`/gallery/album/${id}`} className="group">
                <div className="overflow-hidden rounded-lg border border-gray-800 bg-black transition-all duration-300 hover:border-gray-600">
                  <div className="relative aspect-video">
                    <Image
                      src={`/images/gallery/album-${id}.jpg`}
                      alt={`Album ${id}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold">Featured Album {id}</h3>
                      <p className="text-sm text-gray-300">24 photos</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Photos */}
      <section className="bg-black py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Share Your Photos</h2>
            <p className="mb-6">
              Are you a member with great photos of your Lincoln Continental? Submit them to be featured in our gallery.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/gallery/submit">Submit Photos</Link>
              </Button>
              <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800" asChild>
                <Link href="/gallery/guidelines">
                  <Download className="mr-2 h-4 w-4" />
                  Photo Guidelines
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
