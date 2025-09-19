"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as "light" | "dark";
            if (savedTheme) {
                setTheme(savedTheme);
                document.documentElement.setAttribute("data-theme", savedTheme);
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const systemTheme = prefersDark ? "dark" : "light";
                setTheme(systemTheme);
                document.documentElement.setAttribute("data-theme", systemTheme);
            }
        }
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            onClick={handleThemeToggle}
            className="glass-button p-3 flex items-center mt-1 outline-none justify-center transition duration-300"
        >
            {theme === "light" ? (
                <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="text-yellow-500"
                >
                    <Sun className="w-6 h-6 text-foreground" />
                </motion.div>
            ) : (
                <motion.div
                    whileHover={{ scale: 1.3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-blue-500"
                >
                    <Moon className="w-6 h-6 text-foreground" />
                </motion.div>
            )}
        </button>
    );
}
