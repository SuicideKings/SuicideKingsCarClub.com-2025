import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="pt-28">
      {/* Hero Section */}
      <div className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/events/events-header.jpg"
            alt="Contact Us"
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Contact Us</h1>
          <p className="max-w-2xl mx-auto px-4 text-lg sm:text-xl">Get in touch with the Suicide Kings Car Club</p>
        </div>
      </div>

      {/* Contact Content */}
      <section className="bg-black py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send Us a Message</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium text-gray-300">
                        First Name
                      </label>
                      <Input id="first-name" placeholder="John" className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium text-gray-300">
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Doe" className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="Membership Inquiry"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-300">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      className="min-h-[150px] bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-700 hover:bg-red-800">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-red-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-400">info@suicidekingscarclub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-red-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-400">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-red-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Headquarters</h3>
                      <p className="text-gray-400">Inland Empire, California</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-red-500 mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Response Time</h3>
                      <p className="text-gray-400">Usually within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Chapter Contacts</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-bold text-lg">Inland Empire Chapter</h3>
                    <p className="text-gray-400">ie@suicidekingscarclub.com</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-bold text-lg">Los Angeles Chapter</h3>
                    <p className="text-gray-400">la@suicidekingscarclub.com</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-bold text-lg">Central Valley Chapter</h3>
                    <p className="text-gray-400">cv@suicidekingscarclub.com</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-bold text-lg">Northern California Chapter</h3>
                    <p className="text-gray-400">nc@suicidekingscarclub.com</p>
                  </div>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-bold text-lg">Washington Chapter</h3>
                    <p className="text-gray-400">wa@suicidekingscarclub.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
