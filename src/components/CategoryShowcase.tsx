"use client"

import { useState, useEffect, useRef } from "react"
import { motion, Variants } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Fashion & Apparel",
    value: "fashion-apparel",
    description: "Trendy clothing for every occasion",
    image: "/FashionandApparel.svg",
    itemCount: "200+ Items",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    name: "Topwear",
    value: "topwear",
    description: "Trendy tops and shirts",
    image: "/topwear.svg",
    itemCount: "150+ Items",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Bottomwear",
    value: "bottomwear",
    description: "Jeans, trousers & more",
    image: "/bottomwear.svg",
    itemCount: "300+ Items",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 4,
    name: "Footwear",
    value: "footwear",
    description: "Shoes, sneakers & sandals",
    image: "/footwear.svg",
    itemCount: "100+ Items",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 5,
    name: "Accessories",
    value: "accessories",
    description: "Bags, belts & fashion accessories",
    image: "/accessories.svg",
    itemCount: "250+ Items",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 6,
    name: "Toys & Hobbies",
    value: "toys-hobbies",
    description: "Games, hobbies & more",
    image: "/Toys.svg",
    itemCount: "180+ Items",
    color: "from-teal-500 to-cyan-500",
  },
]

export default function CategoryShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }
 
  return (
    <section ref={sectionRef} className="py-20 bg-lightGray">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-button text-Orange mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Shop by Category</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Explore Our Collections
          </h2>

          <p className="text-lg text-gray500 max-w-2xl mx-auto">
            From fashion to tech, discover premium products across all categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link href={`/blog?category=${category.value}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}
                  />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                    >
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                          {category.itemCount}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-white text-opacity-90 mb-4">{category.description}</p>

                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{
                          x: hoveredCategory === category.id ? 0 : -10,
                          opacity: hoveredCategory === category.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-yellow-300 font-semibold"
                      >
                        <span>Shop Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: hoveredCategory === category.id ? 1 : 0,
                      opacity: hoveredCategory === category.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
