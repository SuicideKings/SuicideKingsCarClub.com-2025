"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage("Thank you for your message. We'll get back to you soon!")
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    }, 1500)

    // In a real implementation, you would send the form data to your API
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formState)
    // })
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-800 bg-black p-8">
      {submitMessage ? (
        <div className="text-center">
          <p className="text-lg text-green-400">{submitMessage}</p>
          <Button className="mt-4 bg-red-700 text-white hover:bg-red-800" onClick={() => setSubmitMessage("")}>
            Send Another Message
          </Button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formState.subject}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
              placeholder="How can we help?"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formState.message}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-white"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full bg-red-700 text-white hover:bg-red-800" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  )
}
