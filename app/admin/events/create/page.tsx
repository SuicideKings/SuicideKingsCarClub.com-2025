"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CalendarPlus, Upload, MapPin, DollarSign, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ImageUpload from "@/components/image-upload"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface EventForm {
  title: string
  description: string
  date: string
  time: string
  endTime: string
  location: string
  address: string
  city: string
  state: string
  zipCode: string
  chapter: string
  category: string
  maxAttendees: string
  price: string
  isPublic: boolean
  requiresApproval: boolean
  allowWaitlist: boolean
  sendReminders: boolean
  imageUrl: string
  tags: string[]
  requirements: string
  whatToBring: string
  contactInfo: string
}

const initialForm: EventForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  endTime: "",
  location: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  chapter: "",
  category: "",
  maxAttendees: "",
  price: "0",
  isPublic: true,
  requiresApproval: false,
  allowWaitlist: true,
  sendReminders: true,
  imageUrl: "",
  tags: [],
  requirements: "",
  whatToBring: "",
  contactInfo: ""
}

export default function CreateEventPage() {
  const router = useRouter()
  const { isLoading: authLoading } = useAuth()
  const [form, setForm] = useState<EventForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState("")

  const updateForm = (field: keyof EventForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !form.tags.includes(currentTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!form.title || !form.description || !form.date || !form.time || !form.location || !form.chapter) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Event created successfully!")
      router.push("/admin/events")
    } catch (error) {
      toast.error("Failed to create event")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Create New Event</h1>
            <p className="text-gray-400">Create a new event for club members</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Event Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <CalendarPlus className="h-5 w-5" />
                      Event Details
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Basic information about the event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Event Title *</Label>
                      <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => updateForm('title', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Monthly Car Meet"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description *</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Describe what the event is about..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="chapter" className="text-white">Chapter *</Label>
                        <Select value={form.chapter} onValueChange={(value) => updateForm('chapter', value)}>
                          <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                            <SelectValue placeholder="Select chapter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skie">Inland Empire</SelectItem>
                            <SelectItem value="skla">Los Angeles</SelectItem>
                            <SelectItem value="skwa">Washington</SelectItem>
                            <SelectItem value="sknc">Northern California</SelectItem>
                            <SelectItem value="skcv">Coachella Valley</SelectItem>
                            <SelectItem value="all">All Chapters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-white">Category</Label>
                        <Select value={form.category} onValueChange={(value) => updateForm('category', value)}>
                          <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meetup">Meetup</SelectItem>
                            <SelectItem value="track_day">Track Day</SelectItem>
                            <SelectItem value="car_show">Car Show</SelectItem>
                            <SelectItem value="cruise">Cruise</SelectItem>
                            <SelectItem value="social">Social Event</SelectItem>
                            <SelectItem value="charity">Charity Event</SelectItem>
                            <SelectItem value="meeting">Club Meeting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Clock className="h-5 w-5" />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-white">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={form.date}
                          onChange={(e) => updateForm('date', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-white">Start Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={form.time}
                          onChange={(e) => updateForm('time', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-white">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={form.endTime}
                          onChange={(e) => updateForm('endTime', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MapPin className="h-5 w-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-white">Venue Name *</Label>
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => updateForm('location', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Santa Monica Pier"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="200 Santa Monica Pier"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-white">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                          placeholder="Santa Monica"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-white">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(e) => updateForm('state', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                          placeholder="CA"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode" className="text-white">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={form.zipCode}
                          onChange={(e) => updateForm('zipCode', e.target.value)}
                          className="border-gray-700 bg-gray-800 text-white"
                          placeholder="90401"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="requirements" className="text-white">Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={form.requirements}
                        onChange={(e) => updateForm('requirements', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Safety gear required, valid driver's license..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatToBring" className="text-white">What to Bring</Label>
                      <Textarea
                        id="whatToBring"
                        value={form.whatToBring}
                        onChange={(e) => updateForm('whatToBring', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Helmet, water bottle, snacks..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactInfo" className="text-white">Contact Information</Label>
                      <Textarea
                        id="contactInfo"
                        value={form.contactInfo}
                        onChange={(e) => updateForm('contactInfo', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="Event coordinator contact details..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="border-gray-700 bg-gray-800 text-white"
                          placeholder="Add a tag..."
                        />
                        <Button type="button" onClick={addTag} variant="outline" className="border-gray-700 text-white">
                          Add
                        </Button>
                      </div>
                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-gray-400 hover:text-white"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Upload className="h-5 w-5" />
                      Event Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      onUpload={(data) => updateForm('imageUrl', data.url)}
                      folder="events"
                      aspectRatio="video"
                    />
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="h-5 w-5" />
                      Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxAttendees" className="text-white">Max Attendees</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        value={form.maxAttendees}
                        onChange={(e) => updateForm('maxAttendees', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="50"
                        min="1"
                      />
                      <p className="text-xs text-gray-400">Leave empty for unlimited</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={form.price}
                        onChange={(e) => updateForm('price', e.target.value)}
                        className="border-gray-700 bg-gray-800 text-white"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Public Event</Label>
                          <p className="text-xs text-gray-400">Visible to non-members</p>
                        </div>
                        <Switch
                          checked={form.isPublic}
                          onCheckedChange={(checked) => updateForm('isPublic', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Requires Approval</Label>
                          <p className="text-xs text-gray-400">Admin must approve registrations</p>
                        </div>
                        <Switch
                          checked={form.requiresApproval}
                          onCheckedChange={(checked) => updateForm('requiresApproval', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Allow Waitlist</Label>
                          <p className="text-xs text-gray-400">When event is full</p>
                        </div>
                        <Switch
                          checked={form.allowWaitlist}
                          onCheckedChange={(checked) => updateForm('allowWaitlist', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Send Reminders</Label>
                          <p className="text-xs text-gray-400">Email reminders to attendees</p>
                        </div>
                        <Switch
                          checked={form.sendReminders}
                          onCheckedChange={(checked) => updateForm('sendReminders', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white text-black hover:bg-gray-200"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Event...
                          </>
                        ) : (
                          "Create Event"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 text-white hover:bg-gray-800"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}