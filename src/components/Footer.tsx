"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react"
import Link from "next/link"
import { CATEGORIES } from "@/constants/categories"

export default function Footer() {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Products", href: "/blog" },
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact-us" },
        { name: "Services", href: "/services" },
        { name: "My Orders", href: "/my-orders" },
      ],
    },
    {
      title: "Categories",
      links: CATEGORIES.map((cat) => ({
        name: cat.label,
        href: `/blog?category=${cat.value}`,
      })),
    },
    {
      title: "Customer Service",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Shipping Info", href: "/policies#shipping" },
        { name: "Returns", href: "/policies#returns" },
        { name: "FAQ", href: "/help" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-sky-900" },
    { icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
  ]

  return (
    <footer className="bg-deepBlack text-primaryWhite relative overflow-hidden">
      {/* 🔥 BACKGROUND PATTERN */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-Orange rounded-full" />
        <div className="absolute top-40 right-32 w-24 h-24 border border-Orange rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-Orange rounded-full" />
      </div>

      <div className="relative z-10">
        {/* 🔥 MAIN FOOTER CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* 🔥 BRAND SECTION */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* 🔥 LOGO */}
                <Link href="/" className="flex items-center">
                  <Image
                    src="/mainlogo.svg"
                    alt="Auroxa logo"
                    width={120}
                    height={40}
                    priority
                    className="h-12 -mt-2 w-auto select-none pointer-events-none"
                  />
                </Link>

                <p className="text-dark max-w-md leading-relaxed">
                  Discover premium fashion and lifestyle products curated for the modern individual. Quality, style, and
                  exceptional service - that's our promise.
                </p>

                {/* 🔥 CONTACT INFO */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-dark">
                    <Mail className="w-5 h-5 text-Orange" />
                    <span>syedalsudes52@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-dark">
                    <Phone className="w-5 h-5 text-Orange" />
                    <span>+92 317 2044347</span>
                  </div>
                  <div className="flex items-center gap-3 text-dark">
                    <MapPin className="w-5 h-5 text-Orange" />
                    <span>New York</span>
                  </div>
                </div>

                {/* 🔥 SOCIAL LINKS */}
                <div className="flex items-center gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 bg-gray800 text-Orange rounded-full flex items-center justify-center transition-colors ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 🔥 FOOTER LINKS */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-Orange">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-dark hover:text-Orange transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🔥 BOTTOM BAR */}
        <div className="border-t border-gray800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-7 text-gray400 text-sm">
                <span>© 2024 Auroxa. develop by
                  <a href="https://www.linkedin.com/in/syed-al-sudes-hussain-a9a163321/" className="ml-3">
                    SYED AL-SUDES
                  </a>
                </span>
                <span>All rights reserved.</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray400">
                <Link href="/policies#privacy" className="hover:text-Orange transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/policies#terms" className="hover:text-Orange transition-colors">
                  Terms of Service
                </Link>
                <Link href="/policies#payment" className="hover:text-Orange transition-colors">
                  Payment policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
