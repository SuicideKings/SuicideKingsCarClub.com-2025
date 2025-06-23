import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import ChapterCards from "@/components/chapter-cards"
import FeaturedCars from "@/components/featured-cars"
import EventsList from "@/components/events-list"
import GalleryGrid from "@/components/gallery-grid"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <MainNav />

      {/* Announcement Banner - Can be toggled via admin panel */}
      <AnnouncementBanner />

      {/* Hero Section */}
      <div className="relative flex h-screen flex-col items-center justify-center">
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
                  Our biggest event of the year featuring Continental classics from all chapters.
                </p>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button size="lg" className="bg-red-700 text-white hover:bg-red-800" asChild>
                  <Link href="/events/2/tickets">Buy Tickets</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-400 bg-transparent text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/events/2">Event Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">About Suicide Kings</h2>
          <div className="mx-auto max-w-4xl">
            <p className="mb-6 text-lg">
              The Suicide Kings started in the Inland Empire of Southern California with just a few local Lincoln
              Continentals. The first official announcement of the start of the club was in August of 2016, at Sancho's
              Tacos in Huntington Beach. Since then the club has grown to include four chapters in California, and one
              in Washington state.
            </p>
            <p className="mb-6 text-lg">
              The goal of SK is to continue to grow, and provide a community for 60s Lincoln Continental owners to get
              together, share the love of these classics, and enjoy the brotherhood that comes with the experience.
            </p>
            <p className="mb-10 text-xl font-semibold text-center">
              Suicide Kings Car Club is about Honor, Loyalty, and Respect.
            </p>

            <h3 className="mb-6 text-center text-2xl font-bold">Our Chapters</h3>
            <ChapterCards />
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section id="cars" className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Featured Continentals</h2>
          <FeaturedCars />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Upcoming Events</h2>
          <EventsList />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Gallery</h2>
          <GalleryGrid />
        </div>
      </section>

      {/* Membership Section */}
      <section className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold">Join The Suicide Kings</h2>
            <p className="mb-8 text-lg text-gray-300">
              Become a member of our exclusive club dedicated to preserving and celebrating the legacy of the 1961-1969
              Lincoln Continental.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/membership">Apply for Membership</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-900 py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Contact Us</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
