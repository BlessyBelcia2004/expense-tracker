"use client"

import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Head from "next/head"

// Pages that don't require authentication
const publicPages = ["/login", "/signup"]

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("token")
    const isPublicPage = publicPages.includes(router.pathname)

    if (!token && !isPublicPage) {
      // Redirect to sign-in page if not authenticated and trying to access a protected page
      router.push("/login")
    } else if (token && router.pathname === "/") {
      // If authenticated and on the root path, show the dashboard
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [router.pathname, router])

  return (
    <>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Track and manage your expenses" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">Loading...</div>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </>
  )
}
