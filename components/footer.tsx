import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black py-12 text-gray-400">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <Image src="/images/suicide-kings-car-club-logo.png" alt="Suicide Kings Logo" width={200} height={100} />
        </div>

        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-lg font-bold text-white">Navigation</h3>
            <ul className="space-y-2">
              {["Home", "About", "Cars", "Events", "Gallery", "Store", "Forum", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                    className="hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <h3 className="mb-4 text-lg font-bold text-white">Chapters</h3>
            <ul className="space-y-2">
              {[
                "SKIE - Inland Empire",
                "SKWA - Washington",
                "SKLA - Los Angeles",
                "SKCV - Coachella Valley",
                "SKNC - Northern California",
              ].map((chapter) => (
                <li key={chapter}>
                  <Link href={`/chapters/${chapter.split(" - ")[0].toLowerCase()}`} className="hover:text-white">
                    {chapter}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h3 className="mb-4 text-lg font-bold text-white">Connect With Us</h3>
            <div className="mb-4 flex justify-center space-x-4 md:justify-end">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
            <p className="text-sm">
              Contact us at:
              <br />
              <a href="mailto:info@suicidekingscc.com" className="hover:text-white">
                info@suicidekingscc.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p>© {new Date().getFullYear()} Suicide Kings Lincoln Continental Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
