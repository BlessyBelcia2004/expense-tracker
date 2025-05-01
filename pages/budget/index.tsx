"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { PieChart, BarChart, ArrowUpDown, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export default function BudgetPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Budget state
  const [budgetData, setBudgetData] = useState([
    { name: "Food", budget: 500, spent: 450, color: "#ff6384" },
    { name: "Housing", budget: 1200, spent: 1200, color: "#36a2eb" },
    { name: "Transportation", budget: 300, spent: 250, color: "#ffce56" },
    { name: "Entertainment", budget: 200, spent: 180, color: "#4bc0c0" },
    { name: "Utilities", budget: 150, spent: 130, color: "#9966ff" },
    { name: "Shopping", budget: 200, spent: 220, color: "#ff9f40" },
    { name: "Health", budget: 100, spent: 80, color: "#c9cbcf" },
    { name: "Other", budget: 150, spent: 120, color: "#8a2be2" },
  ])

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0)
  const remainingBudget = totalBudget - totalSpent
  const remainingPercentage = (remainingBudget / totalBudget) * 100

  const handleBudgetChange = (index: number, value: number) => {
    const newBudgetData = [...budgetData]
    newBudgetData[index].budget = value
    setBudgetData(newBudgetData)
  }

  const handleSaveBudget = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would be an API call to save the budget
      // For demo purposes, we'll just simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving budget:", err)
    } finally {
      setIsSaving(false)
    }
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
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => router.push("/budget")}>
              Budget
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
            <p className="text-muted-foreground">Manage your monthly budget</p>
          </div>
          {isEditing ? (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBudget} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button className="mt-4 sm:mt-0" onClick={() => setIsEditing(true)}>
              Edit Budget
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Monthly budget allocation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${remainingBudget.toFixed(2)}</div>
              <Progress value={remainingPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {remainingPercentage.toFixed(1)}% of budget remaining
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Your monthly budget allocation</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="budget"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, "Budget"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>
                  <div className="space-y-4">
                    {budgetData.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm">${category.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                          <Progress
                            value={(category.budget / totalBudget) * 100}
                            className="h-2"
                            style={
                              {
                                "--progress-background": category.color,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>
                  {isEditing ? "Adjust your budget allocation by category" : "Your budget allocation by category"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgetData.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </Label>
                        <div className="text-sm">
                          <span className="font-medium">${category.spent}</span>
                          <span className="text-muted-foreground"> / ${category.budget}</span>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-4">
                          <Slider
                            defaultValue={[category.budget]}
                            max={2000}
                            step={10}
                            onValueChange={(value) => handleBudgetChange(index, value[0])}
                          />
                          <Input
                            type="number"
                            value={category.budget}
                            onChange={(e) => handleBudgetChange(index, Number(e.target.value))}
                            className="w-20"
                          />
                        </div>
                      ) : (
                        <Progress
                          value={(category.spent / category.budget) * 100}
                          className="h-2"
                          style={
                            {
                              "--progress-background": category.color,
                            } as React.CSSProperties
                          }
                        />
                      )}

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((category.spent / category.budget) * 100).toFixed(0)}% used</span>
                        <span>${category.budget - category.spent} remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter>
                  <Button className="ml-auto" onClick={handleSaveBudget} disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget History</CardTitle>
                <CardDescription>Your budget changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Budget history data will be available after 3 months of usage.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
