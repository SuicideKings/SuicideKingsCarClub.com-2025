import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

const chapters = [
  {
    id: "sknc",
    name: "SKNC - Northern California",
    description: "Bringing Continental class to Northern California.",
    fee: "$50.00 per Year",
    location: "Northern California",
  },
  {
    id: "skie",
    name: "SKIE - Inland Empire",
    description: "The founding chapter of the Suicide Kings Car Club.",
    fee: "$50.00 per Year",
    location: "Inland Empire, Southern California",
  },
  {
    id: "skla",
    name: "SKLA - Los Angeles",
    description: "Representing the City of Angels with classic Continental style.",
    fee: "$50.00 per Year",
    location: "Los Angeles, California",
  },
  {
    id: "skwa",
    name: "SKWA - Washington",
    description: "Our Pacific Northwest chapter for Continental enthusiasts.",
    fee: "$50.00 per Year",
    location: "Washington State",
  },
  {
    id: "skcv",
    name: "SKCV - Coachella Valley",
    description: "Desert cruising with the finest Continentals in the valley.",
    fee: "$50.00 per Year",
    location: "Coachella Valley, California",
  },
]

export default function MembershipPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Page Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-64 w-full bg-black">
            <Image
              src="/images/1967-lincoln-continental-convertable-bg.png"
              alt="Lincoln Continental"
              fill
              className="object-cover opacity-30"
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Join The Suicide Kings</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Become a member of our exclusive club dedicated to preserving and celebrating the legacy of the 1961-1969
            Lincoln Continental.
          </p>
        </div>
      </div>

      {/* Membership Benefits */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Membership Benefits</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Community</h3>
              <p>
                Connect with fellow Lincoln Continental enthusiasts who share your passion for these iconic vehicles.
              </p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Events</h3>
              <p>Exclusive access to club events, cruises, shows, and gatherings throughout the year.</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Resources</h3>
              <p>Access to our network of parts suppliers, mechanics, and restoration experts.</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Knowledge</h3>
              <p>Tap into decades of collective experience in maintaining and restoring these classic automobiles.</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Forum Access</h3>
              <p>Full access to our members-only forum where you can ask questions and share your experiences.</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
              <h3 className="mb-3 text-xl font-bold">Merchandise</h3>
              <p>Exclusive member discounts on club merchandise and partner products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Selection */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Select Your Chapter</h2>
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="rounded-lg border border-gray-800 bg-black p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{chapter.name}</h3>
                    <p className="text-gray-400">{chapter.location}</p>
                    <p className="mt-2 text-sm text-gray-300">{chapter.description}</p>
                    <p className="mt-2 font-medium">{chapter.fee}</p>
                  </div>
                  <Button className="bg-white text-black hover:bg-gray-200" asChild>
                    <Link href={`/membership/join?chapter=${chapter.id}`}>Join This Chapter</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Requirements */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Membership Requirements</h2>
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-800 bg-gray-900 p-8">
            <ul className="list-inside list-disc space-y-4">
              <li>Own or be in the process of acquiring a 1961-1969 Lincoln Continental</li>
              <li>Commitment to attending chapter meetings and events</li>
              <li>Passion for preserving and celebrating these classic automobiles</li>
              <li>Uphold the club's values of Honor, Loyalty, and Respect</li>
              <li>Annual membership fee of $50.00 per year</li>
            </ul>
            <div className="mt-8 text-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/membership/application">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
