"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Plus, Target, Edit, Trash2, AlertCircle, TrendingUp, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format, differenceInDays, differenceInMonths } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GoalsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  // Add this interface at the top of the file, after the imports
  interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    startDate: Date;
    targetDate: Date;
    category: string;
    description: string;
    isCompleted: boolean;
  }
  
  // Update the state definition
  const [goals, setGoals] = useState<Goal[]>([])
  
  // Update the form data type
  interface FormData {
    name: string;
    targetAmount: string;
    currentAmount: string;
    targetDate: Date;
    category: string;
    description: string;
  }
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    category: "",
    description: "",
  })
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    } else {
      // In a real app, fetch goals from API
      // For demo, we'll use sample data
      const sampleData = [
        {
          id: "1",
          name: "Emergency Fund",
          targetAmount: 10000,
          currentAmount: 5000,
          startDate: new Date(2023, 0, 1),
          targetDate: new Date(2023, 11, 31),
          category: "Savings",
          description: "Build a 3-month emergency fund",
          isCompleted: false,
        },
        {
          id: "2",
          name: "New Car",
          targetAmount: 25000,
          currentAmount: 8000,
          startDate: new Date(2023, 0, 1),
          targetDate: new Date(2024, 5, 30),
          category: "Major Purchase",
          description: "Save for a new car",
          isCompleted: false,
        },
        {
          id: "3",
          name: "Vacation Fund",
          targetAmount: 3000,
          currentAmount: 2500,
          startDate: new Date(2023, 1, 15),
          targetDate: new Date(2023, 6, 1),
          category: "Travel",
          description: "Summer vacation to Europe",
          isCompleted: false,
        },
        {
          id: "4",
          name: "Home Down Payment",
          targetAmount: 50000,
          currentAmount: 15000,
          startDate: new Date(2022, 5, 1),
          targetDate: new Date(2025, 5, 1),
          category: "Major Purchase",
          description: "Save for a house down payment",
          isCompleted: false,
        },
      ]
      setGoals(sampleData)
      setIsLoading(false)
    }
  }, [router])

  const handleOpenDialog = (goal: Goal | null = null) => {
    if (goal) {
      setSelectedGoal(goal)
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        targetDate: goal.targetDate,
        category: goal.category,
        description: goal.description || "",
      })
    } else {
      setSelectedGoal(null)
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        category: "",
        description: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date as Date,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newGoal = {
      id: selectedGoal ? selectedGoal.id : Date.now().toString(),
      name: formData.name,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount),
      startDate: selectedGoal ? selectedGoal.startDate : new Date(),
      targetDate: formData.targetDate,
      category: formData.category,
      description: formData.description,
      isCompleted: Number.parseFloat(formData.currentAmount) >= Number.parseFloat(formData.targetAmount),
    }

    if (selectedGoal) {
      // Update existing goal
      setGoals(goals.map((g) => (g.id === selectedGoal.id ? newGoal : g)))
    } else {
      // Add new goal
      setGoals([...goals, newGoal])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just update the local state
    if (selectedGoal) { // Add null check
      setGoals(goals.filter((g) => g.id !== selectedGoal.id))
      setIsDeleteDialogOpen(false)
    }
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const calculateMonthlyTarget = (goal: Goal) => {
    const monthsLeft = Math.max(1, differenceInMonths(goal.targetDate, new Date()))
    const amountLeft = goal.targetAmount - goal.currentAmount
    return amountLeft / monthsLeft
  }

  const getTotalSaved = () => {
    return goals.reduce((total, goal) => total + goal.currentAmount, 0)
  }

  const getTotalTarget = () => {
    return goals.reduce((total, goal) => total + goal.targetAmount, 0)
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
            <p className="text-muted-foreground">Track your progress towards financial goals</p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Goal
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalSaved().toFixed(2)}</div>
              <Progress value={(getTotalSaved() / getTotalTarget()) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {((getTotalSaved() / getTotalTarget()) * 100).toFixed(1)}% of total goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.filter((g) => !g.isCompleted).length}</div>
              <p className="text-xs text-muted-foreground">Number of goals in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.filter((g) => g.isCompleted).length}</div>
              <p className="text-xs text-muted-foreground">Number of achieved goals</p>
            </CardContent>
          </Card>
        </div>

        {goals.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No savings goals</AlertTitle>
            <AlertDescription>
              You haven't set up any savings goals yet. Click the "Add New Goal" button to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className={goal.isCompleted ? "border-green-200 bg-green-50 dark:bg-green-950/20" : ""}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          {goal.isCompleted && <Badge className="bg-green-500">Completed</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Target: ${goal.targetAmount.toFixed(2)} by {format(goal.targetDate, "MMM d, yyyy")}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{goal.category}</Badge>
                          {!goal.isCompleted && (
                            <Badge variant="secondary">${calculateMonthlyTarget(goal).toFixed(2)}/month needed</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(goal)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(goal)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">
                          ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={calculateProgress(goal.currentAmount, goal.targetAmount)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{calculateProgress(goal.currentAmount, goal.targetAmount)}% complete</span>
                        {!goal.isCompleted && (
                          <span>{differenceInDays(goal.targetDate, new Date())} days remaining</span>
                        )}
                      </div>
                    </div>

                    {goal.description && <div className="text-sm mt-2">{goal.description}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedGoal ? "Edit Savings Goal" : "Add Savings Goal"}</DialogTitle>
            <DialogDescription>
              {selectedGoal
                ? "Update the details of your savings goal."
                : "Enter the details of your new savings goal."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Goal Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetAmount" className="text-right">
                  Target Amount
                </Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentAmount" className="text-right">
                  Current Amount
                </Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Major Purchase">Major Purchase</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Retirement">Retirement</SelectItem>
                    <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetDate" className="text-right">
                  Target Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="targetDate">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.targetDate ? format(formData.targetDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.targetDate}
                        onSelect={(date) => handleDateChange("targetDate", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedGoal ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Savings Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this savings goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedGoal && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">{selectedGoal.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${selectedGoal.currentAmount.toFixed(2)} saved of ${selectedGoal.targetAmount.toFixed(2)} target
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
