"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-background text-foreground px-4">
      {/* 404 Animation */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-7xl font-extrabold tracking-tight"
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl mt-4 font-semibold"
      >
        Page Not Found
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-md mt-2 text-muted-foreground max-w-md text-center"
      >
        Oops! The page you are looking for doesn’t exist
      </motion.p>

      {/* Back Button */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-6"
      >
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-md"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back Home
        </Link>
      </motion.div>
    </div>
  )
}
