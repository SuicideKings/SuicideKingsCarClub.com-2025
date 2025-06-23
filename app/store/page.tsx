import Image from "next/image"
import Link from "next/link"
import { Filter, ShoppingCart, Tag, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would typically come from a database
const productCategories = [
  { id: "apparel", name: "Apparel" },
  { id: "accessories", name: "Accessories" },
  { id: "parts", name: "Parts" },
  { id: "collectibles", name: "Collectibles" },
  { id: "literature", name: "Literature" },
]

const featuredProducts = [
  {
    id: 1,
    name: "Suicide Kings T-Shirt",
    price: 24.99,
    image: "/images/store/product-1.jpg",
    category: "apparel",
    featured: true,
    bestseller: false,
    rating: 4.8,
    reviews: 32,
  },
  {
    id: 2,
    name: "Lincoln Continental Scale Model",
    price: 129.99,
    image: "/images/store/product-2.jpg",
    category: "collectibles",
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviews: 47,
  },
  {
    id: 3,
    name: "Suicide Kings Hoodie",
    price: 49.99,
    image: "/images/store/product-3.jpg",
    category: "apparel",
    featured: true,
    bestseller: true,
    rating: 4.7,
    reviews: 28,
  },
]

const products = [
  {
    id: 4,
    name: "Suicide Kings Cap",
    price: 19.99,
    image: "/images/store/product-4.jpg",
    category: "apparel",
    featured: false,
    bestseller: false,
    rating: 4.5,
    reviews: 18,
  },
  {
    id: 5,
    name: "Continental Service Manual",
    price: 39.99,
    image: "/images/store/product-5.jpg",
    category: "literature",
    featured: false,
    bestseller: false,
    rating: 4.9,
    reviews: 12,
  },
  {
    id: 6,
    name: "Continental Emblem Keychain",
    price: 14.99,
    image: "/images/store/product-6.jpg",
    category: "accessories",
    featured: false,
    bestseller: true,
    rating: 4.6,
    reviews: 24,
  },
  {
    id: 7,
    name: "Suicide Kings Mug",
    price: 12.99,
    image: "/images/store/product-7.jpg",
    category: "accessories",
    featured: false,
    bestseller: false,
    rating: 4.4,
    reviews: 15,
  },
  {
    id: 8,
    name: "Continental Door Handle",
    price: 149.99,
    image: "/images/store/product-8.jpg",
    category: "parts",
    featured: false,
    bestseller: false,
    rating: 4.8,
    reviews: 7,
  },
  {
    id: 9,
    name: "Suicide Kings Poster",
    price: 18.99,
    image: "/images/store/product-9.jpg",
    category: "collectibles",
    featured: false,
    bestseller: false,
    rating: 4.7,
    reviews: 9,
  },
]

export default function StorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Page Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-64 w-full bg-black">
            <Image
              src="/images/store/store-header.jpg"
              alt="Suicide Kings Store"
              fill
              className="object-cover opacity-50"
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Suicide Kings Store</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Official merchandise, collectibles, and parts for Lincoln Continental enthusiasts.
          </p>
        </div>
      </div>

      {/* Store Filters */}
      <div className="sticky top-16 z-20 bg-gray-900 py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter Products:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800">
                All Products
              </Button>
              {productCategories.map((category) => (
                <Button key={category.id} variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                  {category.name}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Bestsellers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="bg-gradient-to-r from-red-900 to-black py-12 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Featured Products</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-lg border-2 border-gray-700 bg-black transition-all duration-300 hover:border-gray-500"
              >
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  {product.bestseller && (
                    <div className="absolute left-0 top-0 bg-red-700 px-3 py-1 text-sm font-bold">Bestseller</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-500" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <span className="rounded bg-gray-800 px-2 py-1 text-xs">
                      {productCategories.find((c) => c.id === product.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">All Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-gray-600"
              >
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  {product.bestseller && (
                    <div className="absolute left-0 top-0 bg-red-700 px-2 py-1 text-xs font-bold">Bestseller</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-bold">{product.name}</h3>
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-500" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <span className="rounded bg-gray-800 px-2 py-0.5 text-xs">
                      {productCategories.find((c) => c.id === product.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="mt-12 text-center">
            <Button className="bg-white text-black hover:bg-gray-200">Load More Products</Button>
          </div>
        </div>
      </section>

      {/* Member Discount */}
      <section className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-800 bg-black p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Member Discounts</h2>
            <p className="mb-6">
              Suicide Kings members receive exclusive discounts on all merchandise and parts. Login to your account to
              access member pricing.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/login">Member Login</Link>
              </Button>
              <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800" asChild>
                <Link href="/membership">
                  <Tag className="mr-2 h-4 w-4" />
                  Join Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
