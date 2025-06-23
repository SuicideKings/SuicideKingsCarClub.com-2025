import Image from "next/image"
import Link from "next/link"

const chapters = [
  {
    id: "skie",
    name: "Inland Empire",
    description: "The founding chapter of the Suicide Kings Car Club.",
    fee: "$50.00 per Year",
    region: "Inland Empire, Southern California",
    mapImage: "/images/maps/skie-map.jpg",
  },
  {
    id: "skwa",
    name: "Washington",
    description: "Our Pacific Northwest chapter for Continental enthusiasts.",
    fee: "$50.00 per Year",
    region: "Washington State",
    mapImage: "/images/maps/skwa-map.jpg",
  },
  {
    id: "skla",
    name: "Los Angeles",
    description: "Representing the City of Angels with classic Continental style.",
    fee: "$50.00 per Year",
    region: "Los Angeles, California",
    mapImage: "/images/maps/skla-map.jpg",
  },
  {
    id: "skcv",
    name: "Coachella Valley",
    description: "Desert cruising with the finest Continentals in the valley.",
    fee: "$50.00 per Year",
    region: "Coachella Valley, California",
    mapImage: "/images/maps/skcv-map.jpg",
  },
  {
    id: "sknc",
    name: "Northern California",
    description: "Bringing Continental class to Northern California.",
    fee: "$50.00 per Year",
    region: "Northern California",
    mapImage: "/images/maps/sknc-map.jpg",
  },
]

export default function ChapterCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {chapters.map((chapter) => (
        <Link key={chapter.id} href={`/chapters/${chapter.id}`} className="group">
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-gray-600 hover:shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              {/* Map background */}
              <Image
                src={chapter.mapImage || "/placeholder.svg"}
                alt={`${chapter.name} Chapter Region Map`}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Logo overlay with low opacity */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-3/4 w-3/4">
                  <Image
                    src="/images/suicide-kings-car-club-logo.png"
                    alt="Suicide Kings Logo"
                    fill
                    className="object-contain opacity-20"
                  />
                </div>
              </div>

              {/* Chapter name overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-red-900/70 to-black/70">
                <h3 className="text-center text-2xl font-bold text-white">{chapter.name} Chapter</h3>
              </div>
            </div>
            <div className="p-6">
              <h4 className="mb-2 text-xl font-bold">{chapter.region}</h4>
              <p className="mb-3 text-gray-300">{chapter.description}</p>
              <p className="text-sm font-medium text-gray-400">{chapter.fee}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
