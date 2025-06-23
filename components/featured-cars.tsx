import Image from "next/image"
import Link from "next/link"

const featuredCars = [
  {
    id: 1,
    year: 1961,
    model: "Lincoln Continental",
    description:
      "The first year of the iconic suicide doors design that defined an era of American luxury automobiles.",
    imageQuery: "1961 Lincoln Continental classic car black",
  },
  {
    id: 2,
    year: 1964,
    model: "Lincoln Continental",
    description:
      "Mid-decade refinement with improved power and luxury features while maintaining the classic silhouette.",
    imageQuery: "1964 Lincoln Continental classic car black",
  },
  {
    id: 3,
    year: 1967,
    model: "Lincoln Continental",
    description:
      "Late-60s evolution with enhanced styling and performance, representing the pinnacle of Continental design.",
    imageQuery: "1967 Lincoln Continental classic car black",
  },
]

export default function FeaturedCars() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {featuredCars.map((car) => (
        <div key={car.id} className="overflow-hidden rounded-lg bg-black">
          <div className="aspect-video w-full">
            <Image
              src={`/abstract-geometric-shapes.png?height=300&width=500&query=${car.imageQuery}`}
              alt={`${car.year} ${car.model}`}
              width={500}
              height={300}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="mb-2 text-xl font-bold">
              {car.year} {car.model}
            </h3>
            <p className="mb-4 text-gray-400">{car.description}</p>
            <Link
              href={`/cars/${car.year}`}
              className="inline-block text-sm text-white underline-offset-4 hover:underline"
            >
              View details
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
