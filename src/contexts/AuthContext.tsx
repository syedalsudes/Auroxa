"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type { AuthContextType } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🔥 CUSTOM HOOK
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// 🏗️ AUTH PROVIDER
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isSignedIn: clerkIsSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // ✅ force boolean (no undefined allowed)
  const isSignedIn = clerkIsSignedIn ?? false

  // 🔑 Get admin IDs from environment
  const getAdminIds = (): string[] => {
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS
    if (!adminIds) {
      return []
    }
    return adminIds.split(",").map((id) => id.trim())
  }

  const adminIds = getAdminIds()

  // 🎯 Check if current user is admin
  const isAdmin = user?.id ? adminIds.includes(user.id) : false

  // 🔒 Check admin access method
  const checkAdminAccess = (): boolean => {
    return isAdmin
  }

  // 🚫 Redirect if not admin
  const redirectIfNotAdmin = () => {
    if (isLoaded && (!user || !isAdmin)) {
      router.push("/")
    }
  }

  const value: AuthContextType = {
    user,
    isSignedIn,
    isLoaded,
    isAdmin,
    adminIds,
    isCheckingAuth,
    checkAdminAccess,
    redirectIfNotAdmin,
    setCheckingAuth: setIsCheckingAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
