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
    <div className="mx-auto max-w-4xl rounded-2xl border border-gray-700/50 bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-xl p-8 lg:p-12 shadow-2xl">
      {submitMessage ? (
        <div className="text-center">
          <p className="text-lg text-green-400">{submitMessage}</p>
          <Button className="mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold" onClick={() => setSubmitMessage("")}>
            Send Another Message
          </Button>
        </div>
      ) : (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-3 block text-base font-semibold text-gray-200">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm px-6 py-4 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-lg"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-3 block text-base font-semibold text-gray-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm px-6 py-4 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-lg"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="mb-3 block text-base font-semibold text-gray-200">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={formState.subject}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm px-6 py-4 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-lg"
              placeholder="How can we help?"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-3 block text-base font-semibold text-gray-200">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={formState.message}
              onChange={handleChange}
              className="w-full rounded-xl border-2 border-gray-700 bg-gray-900/50 backdrop-blur-sm px-6 py-4 text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-lg resize-none"
              placeholder="Your message..."
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </div>
  )
}
