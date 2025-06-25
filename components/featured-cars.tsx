import Image from "next/image"
import Link from "next/link"

const featuredCars = [
  {
    id: 1,
    year: 1961,
    model: "Lincoln Continental",
    description:
      "The first year of the iconic suicide doors design that defined an era of American luxury automobiles.",
    image: "/vintage-lincoln-continental.png",
  },
  {
    id: 2,
    year: 1964,
    model: "Lincoln Continental",
    description:
      "Mid-decade refinement with improved power and luxury features while maintaining the classic silhouette.",
    image: "/images/gallery/gallery-1.jpg",
  },
  {
    id: 3,
    year: 1967,
    model: "Lincoln Continental",
    description:
      "Late-60s evolution with enhanced styling and performance, representing the pinnacle of Continental design.",
    image: "/images/1967-lincoln-continental-convertable-bg.png",
  },
]

export default function FeaturedCars() {
  return (
    <section className="bg-gray-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Featured Cars</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Discover the legendary Lincoln Continentals that made history with their distinctive suicide doors
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car) => (
            <div key={car.id} className="overflow-hidden rounded-lg bg-black border border-gray-800 hover:border-gray-600 transition-colors duration-300">
              <div className="aspect-video w-full">
                <Image
                  src={car.image}
                  alt={`${car.year} ${car.model}`}
                  width={500}
                  height={300}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {car.year} {car.model}
                </h3>
                <p className="mb-4 text-gray-400">{car.description}</p>
                <Link
                  href={`/cars/${car.year}`}
                  className="inline-block text-sm text-red-500 hover:text-red-400 underline-offset-4 hover:underline transition-colors duration-200"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
