"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Sparkles, Users, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MainNav from "@/components/main-nav"
import ChapterCards from "@/components/chapter-cards"
import FeaturedCars from "@/components/featured-cars"
import EventsList from "@/components/events-list"
import GalleryGrid from "@/components/gallery-grid"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <MainNav />

      {/* Announcement Banner - Can be toggled via admin panel */}
      <AnnouncementBanner />

      {/* Enhanced Hero Section with Parallax and Animations */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-24">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black/50 to-gray-900/80 z-[1]" />
        
        {/* Floating Particles */}
        {isMounted && (
          <div className="absolute inset-0 z-[2]">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${((i * 37 + 17) % 100)}%`,
                  top: `${((i * 53 + 29) % 100)}%`,
                  animationDelay: `${(i * 0.3) % 3}s`,
                  animationDuration: `${2 + (i * 0.2) % 4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Hero Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
          style={{
            transform: isMounted ? `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0) scale(1.1)` : 'scale(1.1)'
          }}
        >
          <Image
            src="/images/1967-lincoln-continental-convertable-bg.png"
            alt="Suicide Kings Car Club Background"
            fill
            className="object-cover brightness-[0.25] contrast-110 transition-all duration-1000"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Animated Logo with Glow Effect */}
<div className="z-10 mt-4 mb-4 w-full max-w-sm sm:max-w-md px-4 transform transition-all duration-1000 hover:scale-105">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
            <Image
              src="/images/suicide-kings-car-club-logo.png"
              alt="Suicide Kings Logo"
              width={400}
              height={200}
              className="mx-auto relative z-10 drop-shadow-2xl animate-in fade-in duration-1000"
            />
          </div>
        </div>

        {/* Enhanced Hero Content with Typewriter Effect */}
        <div className="z-10 text-center text-white max-w-5xl px-6">
          {/* Premium Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-red-600 to-orange-600 text-white border-none px-4 py-2 text-sm font-semibold animate-in slide-in-from-top duration-1000 delay-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Est. 2016 • Premium Car Club
          </Badge>
          
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-in slide-in-from-bottom duration-1000 delay-500 drop-shadow-2xl">
            Suicide Kings Car Club
          </h1>
          
          <p className="mb-8 max-w-4xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-700 drop-shadow-lg">
            A brotherhood of automotive enthusiasts united by our passion for classic cars and the legendary suicide door Lincoln Continentals. 
            <span className="block mt-3 text-red-400 font-bold text-lg sm:text-xl md:text-2xl">Honor • Loyalty • Respect</span>
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center items-center animate-in slide-in-from-bottom duration-1000 delay-1000">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-2xl hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold group border-2 border-red-500/30"
              asChild
            >
              <Link href="/membership">
                <Users className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Join The Club
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/40 bg-black/30 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60 shadow-xl transform hover:scale-110 transition-all duration-300 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold group"
              asChild
            >
              <Link href="/events">
                <Calendar className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Upcoming Events
              </Link>
            </Button>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 text-center animate-in slide-in-from-bottom duration-1000 delay-1200">
            <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border border-red-500/30 shadow-xl hover:shadow-red-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400 mb-1 sm:mb-2">5+</div>
              <div className="text-sm sm:text-base md:text-lg text-gray-200 font-semibold">Chapters</div>
            </div>
            <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border border-red-500/30 shadow-xl hover:shadow-red-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400 mb-1 sm:mb-2">200+</div>
              <div className="text-sm sm:text-base md:text-lg text-gray-200 font-semibold">Members</div>
            </div>
            <div className="bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-lg sm:rounded-xl px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border border-red-500/30 shadow-xl hover:shadow-red-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-400 mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base md:text-lg text-gray-200 font-semibold">Events/Year</div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white animate-in slide-in-from-bottom duration-1000 delay-1500">
          <div className="flex flex-col items-center space-y-2 cursor-pointer group" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">Discover More</span>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:bg-white/40 transition-all" />
              <ChevronDown size={32} className="relative animate-bounce group-hover:animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Featured Event Section */}
      <div className="relative bg-gradient-to-br from-red-950 via-black to-gray-900 py-28 lg:py-36 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-red-600 to-orange-600 text-white border-none px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Featured Event
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Annual Summer Show & Shine
              </h2>
            </div>
            
            {/* Event Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Event Image */}
                  <div className="lg:w-1/2 relative h-64 lg:h-80">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Image
                      src="/images/events/show-shine.jpg"
                      alt="Show & Shine Event"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <Badge className="bg-red-600 text-white">
                        <Calendar className="w-4 h-4 mr-1" />
                        June 15, 2025
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <div className="mb-4">
                      <div className="flex items-center text-red-400 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Live Event</span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold mb-4">Summer Show & Shine</h3>
                      <p className="text-xl text-gray-300 mb-2">Los Angeles, California</p>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        Our biggest celebration of the year featuring Continental classics from all chapters. 
                        Join us for a weekend of automotive excellence, community, and unforgettable memories.
                      </p>
                    </div>
                    
                    {/* Event Features */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-red-400">100+</div>
                        <div className="text-sm text-gray-400">Classic Cars</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="text-2xl font-bold text-red-400">$5K</div>
                        <div className="text-sm text-gray-400">In Prizes</div>
                      </div>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex-1 group"
                        asChild
                      >
                        <Link href="/events/2/tickets">
                          <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                          Get Tickets
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/30 transform hover:scale-105 transition-all duration-300 flex-1"
                        asChild
                      >
                        <Link href="/events/2">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="bg-black py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="mb-16 text-center text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">About Suicide Kings</h2>
          <div className="mx-auto max-w-4xl">
            <p className="mb-8 text-lg lg:text-xl leading-relaxed text-gray-200">
              The Suicide Kings started in the Inland Empire of Southern California with just a few local Lincoln
              Continentals. The first official announcement of the start of the club was in August of 2016, at Sancho's
              Tacos in Huntington Beach. Since then the club has grown to include four chapters in California, and one
              in Washington state.
            </p>
            <p className="mb-8 text-lg lg:text-xl leading-relaxed text-gray-200">
              The goal of SK is to continue to grow, and provide a community for 60s Lincoln Continental owners to get
              together, share the love of these classics, and enjoy the brotherhood that comes with the experience.
            </p>
            <p className="mb-16 text-xl lg:text-2xl font-semibold text-center text-red-400">
              Suicide Kings Car Club is about Honor, Loyalty, and Respect.
            </p>

            <h3 className="mb-12 text-center text-3xl lg:text-4xl font-bold tracking-tight">Our Chapters</h3>
            <ChapterCards />
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section id="cars" className="bg-gray-900 py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="mb-16 text-center text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">Featured Continentals</h2>
          <FeaturedCars />
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="bg-black py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="mb-16 text-center text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">Upcoming Events</h2>
          <EventsList />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-gray-900 py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="mb-16 text-center text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">Gallery</h2>
          <GalleryGrid />
        </div>
      </section>

      {/* Membership Section */}
      <section className="bg-black py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">Join The Suicide Kings</h2>
            <p className="mb-12 text-lg lg:text-xl leading-relaxed text-gray-200">
              Become a member of our exclusive club dedicated to preserving and celebrating the legacy of the 1961-1969
              Lincoln Continental.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300" asChild>
              <Link href="/membership">Apply for Membership</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-900 py-24 lg:py-32 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="mb-16 text-center text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">Contact Us</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
