"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Code, Palette, Layout, Type, ImageIcon, Plus, Trash2, Settings } from "lucide-react"
import { toast } from "sonner"

interface PageElement {
  id: string
  type: "text" | "image" | "button" | "section" | "card"
  content: string
  styles: Record<string, string>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface Page {
  id: string
  name: string
  slug: string
  title: string
  description: string
  elements: PageElement[]
  styles: Record<string, string>
  isPublished: boolean
}

export default function VisualEditor() {
  const [pages, setPages] = useState<Page[]>([])
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load pages on component mount
  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const response = await fetch("/api/admin/pages")
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages || [])
        if (data.pages?.length > 0) {
          setCurrentPage(data.pages[0])
        }
      }
    } catch (error) {
      console.error("Failed to load pages:", error)
      toast.error("Failed to load pages")
    } finally {
      setLoading(false)
    }
  }

  const savePage = async () => {
    if (!currentPage) return

    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPage),
      })

      if (response.ok) {
        toast.success("Page saved successfully")
        loadPages()
      } else {
        throw new Error("Failed to save page")
      }
    } catch (error) {
      console.error("Failed to save page:", error)
      toast.error("Failed to save page")
    }
  }

  const createNewPage = () => {
    const newPage: Page = {
      id: `page_${Date.now()}`,
      name: "New Page",
      slug: "new-page",
      title: "New Page",
      description: "",
      elements: [],
      styles: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "Inter, sans-serif",
      },
      isPublished: false,
    }
    setCurrentPage(newPage)
    setPages([...pages, newPage])
  }

  const addElement = (type: PageElement["type"]) => {
    if (!currentPage) return

    const newElement: PageElement = {
      id: `element_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
    }

    setCurrentPage({
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    })
  }

  const getDefaultContent = (type: PageElement["type"]): string => {
    switch (type) {
      case "text":
        return "Edit this text"
      case "button":
        return "Click me"
      case "image":
        return "/placeholder.svg"
      case "section":
        return "Section content"
      case "card":
        return "Card content"
      default:
        return ""
    }
  }

  const getDefaultStyles = (type: PageElement["type"]): Record<string, string> => {
    const baseStyles = {
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    }

    switch (type) {
      case "text":
        return { ...baseStyles, fontSize: "16px", color: "#000000" }
      case "button":
        return { ...baseStyles, backgroundColor: "#3b82f6", color: "#ffffff", cursor: "pointer" }
      case "image":
        return { ...baseStyles, objectFit: "cover" }
      case "section":
        return { ...baseStyles, backgroundColor: "#f9fafb", minHeight: "200px" }
      case "card":
        return { ...baseStyles, backgroundColor: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
      default:
        return baseStyles
    }
  }

  const updateElement = (elementId: string, updates: Partial<PageElement>) => {
    if (!currentPage) return

    setCurrentPage({
      ...currentPage,
      elements: currentPage.elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)),
    })
  }

  const deleteElement = (elementId: string) => {
    if (!currentPage) return

    setCurrentPage({
      ...currentPage,
      elements: currentPage.elements.filter((el) => el.id !== elementId),
    })
    setSelectedElement(null)
  }

  const renderElement = (element: PageElement) => {
    const style = {
      ...element.styles,
      position: "absolute" as const,
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      cursor: previewMode ? "default" : "pointer",
      border: selectedElement?.id === element.id ? "2px solid #3b82f6" : element.styles.border,
    }

    const handleClick = () => {
      if (!previewMode) {
        setSelectedElement(element)
      }
    }

    switch (element.type) {
      case "text":
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            {element.content}
          </div>
        )
      case "button":
        return (
          <button key={element.id} style={style} onClick={handleClick}>
            {element.content}
          </button>
        )
      case "image":
        return (
          <img
            key={element.id}
            src={element.content || "/placeholder.svg"}
            alt="Element"
            style={style}
            onClick={handleClick}
          />
        )
      case "section":
        return (
          <section key={element.id} style={style} onClick={handleClick}>
            <div dangerouslySetInnerHTML={{ __html: element.content }} />
          </section>
        )
      case "card":
        return (
          <div key={element.id} style={style} onClick={handleClick}>
            <div dangerouslySetInnerHTML={{ __html: element.content }} />
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Visual Editor</h1>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={createNewPage}>
              <Plus className="w-4 h-4 mr-1" />
              New Page
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="w-4 h-4 mr-1" />
              {previewMode ? "Edit" : "Preview"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pages" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="p-4 space-y-2">
            <div className="space-y-2">
              {pages.map((page) => (
                <Card
                  key={page.id}
                  className={`cursor-pointer transition-colors ${
                    currentPage?.id === page.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{page.name}</h3>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                      <Badge variant={page.isPublished ? "default" : "secondary"}>
                        {page.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="elements" className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement("text")}
                disabled={!currentPage || previewMode}
              >
                <Type className="w-4 h-4 mr-1" />
                Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement("image")}
                disabled={!currentPage || previewMode}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement("button")}
                disabled={!currentPage || previewMode}
              >
                <Settings className="w-4 h-4 mr-1" />
                Button
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement("section")}
                disabled={!currentPage || previewMode}
              >
                <Layout className="w-4 h-4 mr-1" />
                Section
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addElement("card")}
                disabled={!currentPage || previewMode}
              >
                <Palette className="w-4 h-4 mr-1" />
                Card
              </Button>
            </div>

            {selectedElement && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Element Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Input
                      id="content"
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={selectedElement.size.width}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            size: { ...selectedElement.size, width: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={selectedElement.size.height}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            size: { ...selectedElement.size, height: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="x">X Position</Label>
                      <Input
                        id="x"
                        type="number"
                        value={selectedElement.position.x}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            position: { ...selectedElement.position, x: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="y">Y Position</Label>
                      <Input
                        id="y"
                        type="number"
                        value={selectedElement.position.y}
                        onChange={(e) =>
                          updateElement(selectedElement.id, {
                            position: { ...selectedElement.position, y: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteElement(selectedElement.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Element
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="styles" className="p-4 space-y-3">
            {currentPage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Page Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="pageName">Page Name</Label>
                    <Input
                      id="pageName"
                      value={currentPage.name}
                      onChange={(e) => setCurrentPage({ ...currentPage, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pageSlug">URL Slug</Label>
                    <Input
                      id="pageSlug"
                      value={currentPage.slug}
                      onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pageTitle">Page Title</Label>
                    <Input
                      id="pageTitle"
                      value={currentPage.title}
                      onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bgColor">Background Color</Label>
                    <Input
                      id="bgColor"
                      type="color"
                      value={currentPage.styles.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        setCurrentPage({
                          ...currentPage,
                          styles: { ...currentPage.styles, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={currentPage.isPublished}
                      onChange={(e) => setCurrentPage({ ...currentPage, isPublished: e.target.checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-gray-200">
          <Button onClick={savePage} disabled={!currentPage} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Page
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto">
        {currentPage ? (
          <div
            className="relative min-h-full"
            style={{
              backgroundColor: currentPage.styles.backgroundColor || "#ffffff",
              fontFamily: currentPage.styles.fontFamily || "Inter, sans-serif",
            }}
          >
            {currentPage.elements.map(renderElement)}

            {!previewMode && currentPage.elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Layout className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Start building your page</p>
                  <p className="text-sm">Add elements from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Code className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">No page selected</p>
              <p className="text-sm">Select a page from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
