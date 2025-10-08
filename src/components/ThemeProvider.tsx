"use client"

import { ReactNode, useEffect } from "react"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("theme") || "light"
      document.documentElement.setAttribute("data-theme", theme)
    } catch (_) {}
  }, [])

  return <>{children}</>
}
