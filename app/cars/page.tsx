import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default function CarsPage() {
  // Sample car data
  const featuredCars = [
    {
      id: 1,
      year: 1963,
      model: "Lincoln Continental Convertible",
      owner: "John D.",
      chapter: "Inland Empire",
      image: "/images/gallery/gallery-1.jpg",
      description:
        "Restored to original factory specifications with a custom sound system. Finished in Presidential Black with red leather interior.",
    },
    {
      id: 2,
      year: 1965,
      model: "Lincoln Continental Sedan",
      owner: "Mike R.",
      chapter: "Los Angeles",
      image: "/images/events/past-event-1.jpg",
      description: "Lowered with air suspension, custom wheels, and a modern engine swap. Finished in Candy Apple Red.",
    },
    {
      id: 3,
      year: 1967,
      model: "Lincoln Continental Convertible",
      owner: "Sarah T.",
      chapter: "Washington",
      image: "/images/events/past-event-2.jpg",
      description:
        "Numbers-matching survivor with only 42,000 original miles. Finished in Vintage Burgundy with white interior.",
    },
    {
      id: 4,
      year: 1961,
      model: "Lincoln Continental Sedan",
      owner: "Robert J.",
      chapter: "Central Valley",
      image: "/images/events/past-event-3.jpg",
      description:
        "Full custom build with modern drivetrain and technology. Finished in Midnight Blue with custom interior.",
    },
    {
      id: 5,
      year: 1966,
      model: "Lincoln Continental Convertible",
      owner: "David M.",
      chapter: "Northern California",
      image: "/images/events/past-event-4.jpg",
      description: "Award-winning restoration completed in 2021. Finished in Pearl White with black interior.",
    },
    {
      id: 6,
      year: 1964,
      model: "Lincoln Continental Sedan",
      owner: "Lisa K.",
      chapter: "Inland Empire",
      image: "/images/gallery/gallery-1.jpg",
      description: "Daily driver with subtle modifications for reliability and comfort. Finished in Silver Gray.",
    },
  ]

  return (
    <div className="pt-28">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/vintage-lincoln-continental.png"
            alt="Lincoln Continental"
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Featured Continentals</h1>
          <p className="max-w-2xl mx-auto px-4 text-lg sm:text-xl">
            Showcasing the finest Lincoln Continentals from our members
          </p>
        </div>
      </div>

      {/* Cars Content */}
      <section className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-red-700 transition-all"
              >
                <div className="relative h-64">
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={`${car.year} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">
                      {car.year} {car.model}
                    </h3>
                    <span className="bg-red-800 text-white text-xs px-2 py-1 rounded">{car.chapter}</span>
                  </div>
                  <p className="text-gray-400 mb-4">Owner: {car.owner}</p>
                  <p className="text-gray-300 mb-4">{car.description}</p>
                  <Button variant="outline" className="w-full border-red-700 hover:bg-red-700/30">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-8">Own a Continental?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Join the Suicide Kings Car Club to showcase your Lincoln Continental and connect with other enthusiasts.
            </p>
            <Button size="lg" className="bg-red-700 hover:bg-red-800" asChild>
              <Link href="/membership">Join The Club</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
