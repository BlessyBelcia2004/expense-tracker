"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Plus, Calendar, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react"
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
import { format, addMonths, addWeeks, addDays, addYears } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the RecurringExpense interface
interface RecurringExpense {
  id: string
  name: string
  amount: number
  category: string
  description: string
  frequency: string
  startDate: Date
  endDate: Date | null
  isActive: boolean
  nextPayment: Date
}

// Define the FormData interface
interface FormData {
  name: string
  amount: string
  category: string
  description: string
  frequency: string
  startDate: Date
  endDate: Date | null
  isActive: boolean
}

export default function RecurringExpensesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<RecurringExpense | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: new Date(),
    endDate: null,
    isActive: true,
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      // In a real app, fetch recurring expenses from API
      // For demo, we'll use sample data
      const sampleData: RecurringExpense[] = [
        {
          id: "1",
          name: "Netflix Subscription",
          amount: 15.99,
          category: "Entertainment",
          description: "Monthly streaming service",
          frequency: "monthly",
          startDate: new Date(2023, 0, 15),
          endDate: null,
          isActive: true,
          nextPayment: new Date(2023, 4, 15),
        },
        {
          id: "2",
          name: "Gym Membership",
          amount: 49.99,
          category: "Health",
          description: "Monthly gym subscription",
          frequency: "monthly",
          startDate: new Date(2023, 1, 1),
          endDate: new Date(2023, 12, 31),
          isActive: true,
          nextPayment: new Date(2023, 4, 1),
        },
        {
          id: "3",
          name: "Rent Payment",
          amount: 1200,
          category: "Housing",
          description: "Monthly apartment rent",
          frequency: "monthly",
          startDate: new Date(2023, 0, 1),
          endDate: null,
          isActive: true,
          nextPayment: new Date(2023, 4, 1),
        },
        {
          id: "4",
          name: "Phone Bill",
          amount: 65,
          category: "Utilities",
          description: "Monthly phone service",
          frequency: "monthly",
          startDate: new Date(2023, 0, 20),
          endDate: null,
          isActive: true,
          nextPayment: new Date(2023, 4, 20),
        },
        {
          id: "5",
          name: "Car Insurance",
          amount: 120,
          category: "Insurance",
          description: "Car insurance premium",
          frequency: "monthly",
          startDate: new Date(2023, 0, 10),
          endDate: null,
          isActive: true,
          nextPayment: new Date(2023, 4, 10),
        },
      ]
      // Fix: Set the recurringExpenses to sampleData directly, not [sampleData]
      setRecurringExpenses(sampleData)
      setIsLoading(false)
    }
  }, [router])

  const handleOpenDialog = (expense: RecurringExpense | null = null) => {
    if (expense) {
      setSelectedExpense(expense)
      setFormData({
        name: expense.name,
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || "",
        frequency: expense.frequency,
        startDate: expense.startDate,
        endDate: expense.endDate,
        isActive: expense.isActive,
      })
    } else {
      setSelectedExpense(null)
      setFormData({
        name: "",
        amount: "",
        category: "",
        description: "",
        frequency: "monthly",
        startDate: new Date(),
        endDate: null,
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenDeleteDialog = (expense: RecurringExpense) => {
    setSelectedExpense(expense)
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

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData({
      ...formData,
      [name]: date,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would be an API call
    // For demo purposes, we'll just update the local state

    const newExpense: RecurringExpense = {
      id: selectedExpense ? selectedExpense.id : Date.now().toString(),
      name: formData.name,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      nextPayment: getNextPaymentDate(formData.startDate, formData.frequency),
    }

    if (selectedExpense) {
      // Update existing expense
      setRecurringExpenses(recurringExpenses.map((exp) => (exp.id === selectedExpense.id ? newExpense : exp)))
    } else {
      // Add new expense
      setRecurringExpenses([...recurringExpenses, newExpense])
    }

    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just update the local state
    if (selectedExpense) {
      setRecurringExpenses(recurringExpenses.filter((exp) => exp.id !== selectedExpense.id))
    }
    setIsDeleteDialogOpen(false)
  }

  const getNextPaymentDate = (startDate: Date, frequency: string): Date => {
    const today = new Date()
    let nextDate = new Date(startDate)

    while (nextDate < today) {
      switch (frequency) {
        case "daily":
          nextDate = addDays(nextDate, 1)
          break
        case "weekly":
          nextDate = addWeeks(nextDate, 1)
          break
        case "monthly":
          nextDate = addMonths(nextDate, 1)
          break
        case "yearly":
          nextDate = addYears(nextDate, 1)
          break
        default:
          nextDate = addMonths(nextDate, 1)
      }
    }

    return nextDate
  }

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      case "yearly":
        return "Yearly"
      default:
        return "Monthly"
    }
  }

  const getTotalMonthly = (): number => {
    return recurringExpenses
      .filter((exp) => exp.isActive)
      .reduce((total, exp) => {
        switch (exp.frequency) {
          case "daily":
            return total + exp.amount * 30
          case "weekly":
            return total + exp.amount * 4.33
          case "monthly":
            return total + exp.amount
          case "yearly":
            return total + exp.amount / 12
          default:
            return total + exp.amount
        }
      }, 0)
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
            <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
            <p className="text-muted-foreground">Manage your regular payments and subscriptions</p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Recurring Expense
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Monthly</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalMonthly().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total recurring expenses per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recurringExpenses.filter((exp) => exp.isActive).length}</div>
              <p className="text-xs text-muted-foreground">Number of active recurring expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {recurringExpenses.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">
                    {format(
                      new Date(
                        Math.min(
                          ...recurringExpenses.filter((exp) => exp.isActive).map((exp) => exp.nextPayment.getTime()),
                        ),
                      ),
                      "MMM d, yyyy",
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Date of your next recurring payment</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">N/A</div>
                  <p className="text-xs text-muted-foreground">No upcoming payments</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {recurringExpenses.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No recurring expenses</AlertTitle>
            <AlertDescription>
              You haven't set up any recurring expenses yet. Click the "Add Recurring Expense" button to get started.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {recurringExpenses.map((expense) => (
              <Card key={expense.id} className={expense.isActive ? "" : "opacity-70"}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{expense.name}</h3>
                        {!expense.isActive && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getFrequencyLabel(expense.frequency)} payment of ${expense.amount.toFixed(2)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{expense.category}</Badge>
                        <Badge variant="secondary">Next: {format(expense.nextPayment, "MMM d, yyyy")}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(expense)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(expense)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
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
            <DialogTitle>{selectedExpense ? "Edit Recurring Expense" : "Add Recurring Expense"}</DialogTitle>
            <DialogDescription>
              {selectedExpense
                ? "Update the details of your recurring expense."
                : "Enter the details of your recurring expense."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
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
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
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
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select value={formData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                  <SelectTrigger id="frequency" className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date: Date | undefined) => handleDateChange("startDate", date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : <span>No end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.endDate || undefined}
                        onSelect={(date: Date | undefined) => handleDateChange("endDate", date || null)}
                        initialFocus
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="isActive" className="text-sm text-muted-foreground">
                    {formData.isActive ? "This recurring expense is active" : "This recurring expense is inactive"}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedExpense ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Recurring Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recurring expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedExpense && (
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">{selectedExpense.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {getFrequencyLabel(selectedExpense.frequency)} payment of ${selectedExpense.amount.toFixed(2)}
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
