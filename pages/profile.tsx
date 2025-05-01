"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { User, Mail, Phone, Home, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      // In a real app, fetch user data from API
      // For demo, we'll use sample data from localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData({
          name: parsedUser.name || "Demo User",
          email: parsedUser.email || "user@example.com",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
        })
      }
      setIsLoading(false)
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll just update localStorage
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.setItem("user", JSON.stringify(userData))
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold">ExpenseTracker</h1>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push("/expense-tracker")}>
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => router.push("/expenses")}
            >
              Expenses
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push("/budget")}>
              Budget
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-6 px-4 sm:px-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => router.push("/expense-tracker")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-5">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>View and manage your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder-user.jpg" alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{userData.name}</h3>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
              <Button variant="outline" size="sm" className="mt-4">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex">
                      <User className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <Phone className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex">
                      <Home className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="security">
                  <div className="text-center py-8 text-muted-foreground">
                    Security settings will be available in a future update.
                  </div>
                </TabsContent>
                <TabsContent value="preferences">
                  <div className="text-center py-8 text-muted-foreground">
                    Preference settings will be available in a future update.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isSaving} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
