import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ChapterCards from "@/components/chapter-cards"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="pt-28">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-background-optimized.jpg"
            alt="Lincoln Continental Background"
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">About Suicide Kings</h1>
          <p className="max-w-2xl mx-auto px-4 text-lg sm:text-xl">Honor. Loyalty. Respect.</p>
        </div>
      </div>

      {/* About Content */}
      <section className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-3xl font-bold">Our Story</h2>
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

            <div className="my-12 border-t border-gray-800 pt-12">
              <h2 className="mb-8 text-3xl font-bold">Our Mission</h2>
              <p className="mb-6 text-lg">
                Our mission is to preserve and celebrate the legacy of the 1961-1969 Lincoln Continental, one of the
                most iconic American luxury cars ever produced. We aim to create a community where owners and
                enthusiasts can share knowledge, resources, and experiences.
              </p>
              <p className="mb-6 text-lg">
                Through regular meets, cruises, and shows, we foster a sense of camaraderie among members while
                showcasing these magnificent vehicles to the public. We're dedicated to helping members maintain and
                restore their Continentals to keep these classic cars on the road for generations to come.
              </p>
            </div>

            <div className="my-12 border-t border-gray-800 pt-12">
              <h2 className="mb-8 text-3xl font-bold">Our Chapters</h2>
              <p className="mb-6 text-lg">
                The Suicide Kings Car Club has expanded across multiple regions, with each chapter maintaining the core
                values while developing its own unique character. Our chapters host local events and participate in
                national gatherings, creating a nationwide network of Continental enthusiasts.
              </p>
              <ChapterCards />
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="bg-gradient-to-r from-red-900 to-black py-16 text-white">
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

      <Footer />
    </div>
  )
}
