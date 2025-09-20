// components/UserMenu.tsx
"use client"

import React, { useState, useEffect } from "react"
import { User, Shield, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useClerk, UserButton } from "@clerk/nextjs"
import { useAuth } from "@/contexts"

const UserMenu = () => {
    const { openSignIn } = useClerk()
    const { isSignedIn, isLoaded, isAdmin } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted || !isLoaded) {
        return <div className="w-10 h-10 bg-gray400 rounded-full animate-pulse" />
    }

    if (isSignedIn) {
        return (
            <div className="relative">
                {!mounted ? (
                    <div className="w-10 h-10 bg-gray400 rounded-full animate-pulse" />
                ) : !isLoaded ? (
                    <div className="w-10 h-10 bg-gray400 rounded-full animate-pulse" />
                ) : isSignedIn ? (
                    <div className="relative">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 mt-2",
                                    userButtonBox: "focus:outline-none ring-0 shadow-none",
                                    userButtonTrigger: "focus:outline-none ring-0 shadow-none",
                                },
                            }}
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="My Orders"
                                    labelIcon={<Package className="h-4 w-4" />}
                                    href="/my-orders"
                                />
                                {isAdmin && (
                                    <UserButton.Link
                                        label="Admin Dashboard"
                                        labelIcon={<Shield className="h-4 w-4" />}
                                        href="/admin"
                                    />
                                )}
                            </UserButton.MenuItems>
                        </UserButton>

                        {isAdmin && (
                            <span
                                className="absolute right-3 -top-6 text-[40px] -rotate-[45deg] drop-shadow-[0_0_3px_gold] select-none"
                                role="img"
                                aria-label="admin-crown"
                            >
                                👑
                            </span>
                        )}
                    </div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openSignIn()}
                        className="glass-button p-3"
                    >
                        <User className="w-6 h-6 text-foreground" />
                    </motion.button>
                )}
            </div>
        )
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openSignIn()}
            className="glass-button p-3"
        >
            <User className="w-6 h-6 text-foreground" />
        </motion.button>
    )
}

export default UserMenu
