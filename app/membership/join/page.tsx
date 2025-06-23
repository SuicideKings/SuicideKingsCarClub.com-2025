"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

const chapters = {
  skie: {
    id: "skie",
    name: "SKIE - Inland Empire",
    fee: "$50.00 per Year",
    paypalAccount: "payments-ie@suicidekingscc.com",
  },
  skwa: {
    id: "skwa",
    name: "SKWA - Washington",
    fee: "$50.00 per Year",
    paypalAccount: "payments-wa@suicidekingscc.com",
  },
  skla: {
    id: "skla",
    name: "SKLA - Los Angeles",
    fee: "$50.00 per Year",
    paypalAccount: "payments-la@suicidekingscc.com",
  },
  skcv: {
    id: "skcv",
    name: "SKCV - Coachella Valley",
    fee: "$50.00 per Year",
    paypalAccount: "payments-cv@suicidekingscc.com",
  },
  sknc: {
    id: "sknc",
    name: "SKNC - Northern California",
    fee: "$50.00 per Year",
    paypalAccount: "payments-nc@suicidekingscc.com",
  },
}

export default function JoinPage() {
  const searchParams = useSearchParams()
  const chapterId = searchParams.get("chapter") || "skie"
  const chapter = chapters[chapterId as keyof typeof chapters]

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    carYear: "",
    carModel: "",
    carColor: "",
    howDidYouHear: "",
    agreeToTerms: false,
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value

    setFormState({
      ...formState,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(3) // Move to payment step
    }, 1500)

    // In a real implementation, you would send the form data to your API
    // const response = await fetch('/api/membership/apply', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...formState, chapterId })
    // })
  }

  const handlePayment = () => {
    // In a real implementation, this would redirect to PayPal or process payment
    setStep(4) // Move to confirmation step
  }

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
          <h1 className="mb-4 text-4xl font-bold">Join {chapter.name}</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Complete the form below to apply for membership to the {chapter.name} chapter.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-black py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-white" : "text-gray-500"}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
              >
                1
              </div>
              <span className="mt-2 text-sm">Information</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? "text-white" : "text-gray-500"}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
              >
                2
              </div>
              <span className="mt-2 text-sm">Review</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? "text-white" : "text-gray-500"}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
              >
                3
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
            <div className={`flex flex-col items-center ${step >= 4 ? "text-white" : "text-gray-500"}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 4 ? "bg-white text-black" : "bg-gray-800 text-gray-400"}`}
              >
                4
              </div>
              <span className="mt-2 text-sm">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="flex-1 bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-800 bg-black p-8">
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep(2)
                }}
              >
                <h2 className="mb-6 text-2xl font-bold">Personal Information</h2>

                <div className="mb-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="address" className="mb-2 block text-sm font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="mb-6 grid gap-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="mb-2 block text-sm font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formState.city}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="mb-2 block text-sm font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formState.state}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="mb-2 block text-sm font-medium">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formState.zip}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <h2 className="mb-6 mt-10 text-2xl font-bold">Vehicle Information</h2>

                <div className="mb-6 grid gap-6 md:grid-cols-3">
                  <div>
                    <label htmlFor="carYear" className="mb-2 block text-sm font-medium">
                      Year
                    </label>
                    <select
                      id="carYear"
                      name="carYear"
                      value={formState.carYear}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    >
                      <option value="">Select Year</option>
                      {[1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="carModel" className="mb-2 block text-sm font-medium">
                      Model
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      name="carModel"
                      value={formState.carModel}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      placeholder="Continental"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="carColor" className="mb-2 block text-sm font-medium">
                      Color
                    </label>
                    <input
                      type="text"
                      id="carColor"
                      name="carColor"
                      value={formState.carColor}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="howDidYouHear" className="mb-2 block text-sm font-medium">
                    How did you hear about us?
                  </label>
                  <select
                    id="howDidYouHear"
                    name="howDidYouHear"
                    value={formState.howDidYouHear}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="existing_member">Existing Member</option>
                    <option value="car_show">Car Show</option>
                    <option value="social_media">Social Media</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formState.agreeToTerms}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-white"
                      required
                    />
                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm">
                      I agree to the club's code of conduct and understand that membership is subject to approval.
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button type="submit" className="bg-white text-black hover:bg-gray-200">
                    Continue to Review
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">Review Your Information</h2>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Personal Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p>
                        {formState.firstName} {formState.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{formState.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{formState.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      <p>
                        {formState.address}, {formState.city}, {formState.state} {formState.zip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Vehicle Information</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-gray-400">Year</p>
                      <p>{formState.carYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Model</p>
                      <p>{formState.carModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Color</p>
                      <p>{formState.carColor}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Membership Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-400">Chapter</p>
                      <p>{chapter.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Membership Fee</p>
                      <p>{chapter.fee}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setStep(1)}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit Application"}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">Payment</h2>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Membership Summary</h3>
                  <div className="mb-4 flex justify-between">
                    <span>Annual Membership - {chapter.name}</span>
                    <span>{chapter.fee}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>$50.00</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Payment Method</h3>
                  <p className="mb-4">
                    Please select your preferred payment method. Your payment will be processed securely.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center rounded-lg border border-gray-700 bg-black p-4">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        className="h-4 w-4"
                        defaultChecked
                      />
                      <label htmlFor="paypal" className="ml-3 block">
                        <span className="font-medium">PayPal</span>
                        <span className="block text-sm text-gray-400">Pay securely using your PayPal account</span>
                      </label>
                    </div>

                    <div className="flex items-center rounded-lg border border-gray-700 bg-black p-4">
                      <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" className="h-4 w-4" />
                      <label htmlFor="creditCard" className="ml-3 block">
                        <span className="font-medium">Credit Card</span>
                        <span className="block text-sm text-gray-400">
                          Pay with Visa, Mastercard, or American Express
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button className="bg-white text-black hover:bg-gray-200" onClick={handlePayment}>
                    Complete Payment
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="mb-4 text-2xl font-bold">Application Submitted!</h2>
                <p className="mb-6">
                  Thank you for applying to join the {chapter.name} chapter of the Suicide Kings Car Club. Your
                  application has been received and is being reviewed.
                </p>

                <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6 text-left">
                  <h3 className="mb-4 text-xl font-bold">What's Next?</h3>
                  <ol className="list-inside list-decimal space-y-2">
                    <li>Your application will be reviewed by chapter leadership</li>
                    <li>You'll receive an email confirmation within 24-48 hours</li>
                    <li>Once approved, you'll receive your membership details</li>
                    <li>You'll be invited to the next chapter meeting</li>
                  </ol>
                </div>

                <div className="mt-8">
                  <Button className="bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/">Return to Homepage</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
