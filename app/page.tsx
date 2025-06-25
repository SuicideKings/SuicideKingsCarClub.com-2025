import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import ChapterCards from "@/components/chapter-cards"
import FeaturedCars from "@/components/featured-cars"
import EventsList from "@/components/events-list"
import GalleryGrid from "@/components/gallery-grid"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative flex h-screen flex-col items-center justify-center pt-28 md:pt-28">
        {/* Hero Background Image - Optimized for faster loading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/1967-lincoln-continental-convertable-bg.png"
            alt="1967 Lincoln Continental Convertible"
            fill
            className="object-cover brightness-[0.6]"
            priority
            sizes="100vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
          />
        </div>

        {/* Logo */}
        <div className="z-10 mb-8 w-full max-w-md px-4">
          <Image
            src="/images/suicide-kings-car-club-logo.png"
            alt="Suicide Kings Logo"
            width={400}
            height={200}
            className="mx-auto"
          />
        </div>

        {/* Hero Content */}
        <div className="z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            1961-1969 Lincoln Continental
          </h1>
          <p className="mb-8 max-w-2xl px-4 text-lg sm:text-xl">
            A community of enthusiasts dedicated to the iconic Lincoln Continental with its legendary suicide doors
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/membership">Join The Club</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/events">Upcoming Events</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white">
          <ChevronDown size={32} />
        </div>
      </div>

      {/* Enhanced Featured Event Banner - More prominent and eye-catching */}
      <div className="bg-gradient-to-r from-red-900 to-black py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg border-2 border-gray-700">
            {/* Background pattern for visual interest */}
            <div className="absolute inset-0 opacity-10">
              <Image
                src="/images/suicide-kings-car-club-logo.png"
                alt="Background Pattern"
                fill
                className="object-cover"
              />
            </div>

            {/* Content with enhanced styling */}
            <div className="relative flex flex-col items-center justify-between gap-6 bg-gradient-to-r from-black/80 to-black/60 p-8 md:flex-row">
              <div className="flex-1">
                <div className="mb-2 inline-block rounded bg-red-800 px-3 py-1 text-sm font-bold uppercase tracking-wider">
                  Featured Event
                </div>
                <h2 className="mb-2 text-3xl font-bold">Annual Summer Show & Shine</h2>
                <p className="mb-2 text-lg">June 15, 2025 • Los Angeles, CA</p>
                <p className="text-gray-300">
                  Join us for our biggest event of the year featuring classic Lincolns, awards, and community
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button size="lg" className="bg-red-700 hover:bg-red-600" asChild>
                  <Link href="/events">Register Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-400 text-white hover:bg-white/10" asChild>
                  <Link href="/events">View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Cards Section */}
      <ChapterCards />

      {/* Featured Cars Section */}
      <FeaturedCars />

      {/* Events Section */}
      <EventsList />

      {/* Gallery Section */}
      <GalleryGrid />

      {/* Contact Section */}
      <ContactForm />

      {/* Footer */}
      <Footer />
    </div>
  )
}
