import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

interface CarYearPageProps {
  params: Promise<{ year: string }>
}

// Car specifications data by year
const carData: Record<string, {
  year: number
  model: string
  description: string
  specs: {
    engine: string
    transmission: string
    wheelbase: string
    length: string
    weight: string
    production: string
  }
  highlights: string[]
  image: string
}> = {
  "1961": {
    year: 1961,
    model: "Lincoln Continental",
    description: "The inaugural year of the fourth-generation Continental that introduced the iconic suicide doors. This revolutionary design eliminated the running boards and featured a clean, unadorned aesthetic that would define luxury for the decade.",
    specs: {
      engine: "430 cu in (7.0 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "123 in (3,124 mm)",
      length: "212.4 in (5,395 mm)",
      weight: "4,927 lb (2,235 kg)",
      production: "25,164 units"
    },
    highlights: [
      "Introduction of rear-hinged 'suicide doors'",
      "Unibody construction",
      "Clean, minimalist styling",
      "Available in sedan and convertible"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1962": {
    year: 1962,
    model: "Lincoln Continental",
    description: "Building on the success of 1961, the 1962 Continental featured subtle refinements and improvements while maintaining the revolutionary styling that made it an instant classic.",
    specs: {
      engine: "430 cu in (7.0 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "123 in (3,124 mm)",
      length: "212.4 in (5,395 mm)",
      weight: "4,966 lb (2,253 kg)",
      production: "31,061 units"
    },
    highlights: [
      "Refined interior appointments",
      "Improved build quality",
      "Enhanced comfort features",
      "Continued suicide door design"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1963": {
    year: 1963,
    model: "Lincoln Continental",
    description: "The 1963 Continental received subtle updates including revised trim and continued to exemplify American luxury with its distinctive suicide door configuration.",
    specs: {
      engine: "430 cu in (7.0 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "123 in (3,124 mm)",
      length: "212.4 in (5,395 mm)",
      weight: "4,985 lb (2,261 kg)",
      production: "31,233 units"
    },
    highlights: [
      "Updated interior trim",
      "Refined exterior details",
      "Improved reliability",
      "Presidential vehicle of choice"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1964": {
    year: 1964,
    model: "Lincoln Continental",
    description: "The mid-decade Continental featured enhanced power and luxury appointments while maintaining the timeless silhouette that defined the series.",
    specs: {
      engine: "430 cu in (7.0 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "216.3 in (5,494 mm)",
      weight: "5,055 lb (2,293 kg)",
      production: "36,297 units"
    },
    highlights: [
      "Increased wheelbase",
      "Enhanced interior space",
      "Improved ride quality",
      "Updated styling details"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1965": {
    year: 1965,
    model: "Lincoln Continental",
    description: "The 1965 Continental continued the legacy with refined styling and improved mechanical components, representing the pinnacle of mid-60s luxury.",
    specs: {
      engine: "430 cu in (7.0 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "216.3 in (5,494 mm)",
      weight: "5,080 lb (2,304 kg)",
      production: "40,180 units"
    },
    highlights: [
      "Peak production year",
      "Refined mechanicals",
      "Enhanced luxury features",
      "Improved reliability"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1966": {
    year: 1966,
    model: "Lincoln Continental",
    description: "The 1966 Continental featured updated styling cues and continued to represent the epitome of American luxury with its distinctive suicide door design.",
    specs: {
      engine: "462 cu in (7.6 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "220.9 in (5,611 mm)",
      weight: "5,190 lb (2,354 kg)",
      production: "54,755 units"
    },
    highlights: [
      "Larger 462 cu in engine",
      "Updated grille design",
      "Enhanced performance",
      "Record production numbers"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1967": {
    year: 1967,
    model: "Lincoln Continental",
    description: "The 1967 Continental represented the final evolution of the original suicide door design, featuring the most refined styling and performance of the series.",
    specs: {
      engine: "462 cu in (7.6 L) MEL V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "220.9 in (5,611 mm)",
      weight: "5,200 lb (2,359 kg)",
      production: "45,667 units"
    },
    highlights: [
      "Peak styling refinement",
      "Enhanced luxury appointments",
      "Improved build quality",
      "Final year of original design"
    ],
    image: "/images/1967-lincoln-continental-convertable-bg.png"
  },
  "1968": {
    year: 1968,
    model: "Lincoln Continental",
    description: "The 1968 Continental marked a transition year with updated federal safety requirements while maintaining the classic suicide door configuration.",
    specs: {
      engine: "460 cu in (7.5 L) 385 V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "224.8 in (5,710 mm)",
      weight: "5,269 lb (2,390 kg)",
      production: "39,134 units"
    },
    highlights: [
      "New 460 cu in 385-series engine",
      "Federal safety compliance",
      "Updated interior features",
      "Continued suicide door design"
    ],
    image: "/vintage-lincoln-continental.png"
  },
  "1969": {
    year: 1969,
    model: "Lincoln Continental",
    description: "The final year of the iconic suicide door Continental, the 1969 model represented the end of an era for this revolutionary design that defined luxury for nearly a decade.",
    specs: {
      engine: "460 cu in (7.5 L) 385 V8",
      transmission: "3-speed automatic",
      wheelbase: "126 in (3,200 mm)",
      length: "224.8 in (5,710 mm)",
      weight: "5,280 lb (2,395 kg)",
      production: "29,719 units"
    },
    highlights: [
      "Final year of suicide doors",
      "Enhanced safety features",
      "Collector status today",
      "End of an iconic era"
    ],
    image: "/vintage-lincoln-continental.png"
  }
}

export default async function CarYearPage({ params }: CarYearPageProps) {
  const { year } = await params
  const car = carData[year]

  if (!car) {
    notFound()
  }

  return (
    <div className="pt-28 bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={car.image}
            alt={`${car.year} ${car.model}`}
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {car.year} {car.model}
          </h1>
          <p className="max-w-3xl mx-auto px-4 text-lg sm:text-xl">
            {car.description}
          </p>
        </div>
      </div>

      {/* Car Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Specifications */}
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-red-400">Specifications</h2>
              <div className="space-y-4">
                {Object.entries(car.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="font-medium text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-red-400">Key Highlights</h2>
              <ul className="space-y-3">
                {car.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-3">•</span>
                    <span className="text-gray-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-to-r from-red-900 to-black rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">Own a {car.year} Continental?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join the Suicide Kings Car Club and connect with other {car.year} Continental owners and enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-700 hover:bg-red-800" asChild>
                <Link href="/membership">Join The Club</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-400 hover:bg-white/10" asChild>
                <Link href="/cars">View All Years</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
