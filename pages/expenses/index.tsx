// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/router"
// import { Plus, Search, Filter, ArrowUpDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function ExpensesPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("all")
//   const [sortBy, setSortBy] = useState("date-desc")

//   useEffect(() => {
//     // Check if user is authenticated
//     const token = localStorage.getItem("token")
//     if (!token) {
//       router.push("/login")
//     } else {
//       setIsLoading(false)
//     }
//   }, [router])

//   if (isLoading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>
//   }

//   // Sample data - would come from API in real app
//   const expenses = [
//     {
//       id: 1,
//       name: "Grocery Shopping",
//       amount: 85.2,
//       category: "Food",
//       date: "2023-04-10",
//       tags: ["weekly", "essentials"],
//     },
//     {
//       id: 2,
//       name: "Netflix Subscription",
//       amount: 15.99,
//       category: "Entertainment",
//       date: "2023-04-08",
//       tags: ["subscription", "monthly"],
//     },
//     { id: 3, name: "Gas Station", amount: 45.5, category: "Transportation", date: "2023-04-07", tags: ["car", "fuel"] },
//     { id: 4, name: "Restaurant Dinner", amount: 78.3, category: "Food", date: "2023-04-05", tags: ["dining out"] },
//     {
//       id: 5,
//       name: "Electricity Bill",
//       amount: 120.45,
//       category: "Utilities",
//       date: "2023-04-03",
//       tags: ["monthly", "bills"],
//     },
//     {
//       id: 6,
//       name: "Gym Membership",
//       amount: 50.0,
//       category: "Health",
//       date: "2023-04-01",
//       tags: ["subscription", "monthly"],
//     },
//     { id: 7, name: "Movie Tickets", amount: 32.5, category: "Entertainment", date: "2023-03-28", tags: ["weekend"] },
//     { id: 8, name: "Uber Ride", amount: 18.75, category: "Transportation", date: "2023-03-25", tags: ["travel"] },
//   ]

//   // Filter expenses based on search query and category
//   const filteredExpenses = expenses.filter((expense) => {
//     const matchesSearch =
//       expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       expense.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

//     const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter

//     return matchesSearch && matchesCategory
//   })

//   // Sort expenses
//   const sortedExpenses = [...filteredExpenses].sort((a, b) => {
//     switch (sortBy) {
//       case "date-asc":
//         return new Date(a.date).getTime() - new Date(b.date).getTime()
//       case "date-desc":
//         return new Date(b.date).getTime() - new Date(a.date).getTime()
//       case "amount-asc":
//         return a.amount - b.amount
//       case "amount-desc":
//         return b.amount - a.amount
//       case "name-asc":
//         return a.name.localeCompare(b.name)
//       case "name-desc":
//         return b.name.localeCompare(a.name)
//       default:
//         return 0
//     }
//   })

//   // Get unique categories for filter
//   const categories = ["all", ...new Set(expenses.map((expense) => expense.category))]

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="border-b">
//         <div className="container flex h-16 items-center px-4 sm:px-6">
//           <h1 className="text-lg font-semibold">ExpenseTracker</h1>
//           <nav className="ml-auto flex gap-4 sm:gap-6">
//             <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push("/expense-tracker")}>
//               Dashboard
//             </Button>
//             <Button variant="ghost" size="sm" className="text-primary" onClick={() => router.push("/expenses")}>
//               Expenses
//             </Button>
//             <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push("/budget")}>
//               Budget
//             </Button>
//           </nav>
//         </div>
//       </header>

//       <main className="container py-6 px-4 sm:px-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
//             <p className="text-muted-foreground">View and manage your expenses</p>
//           </div>
//           <Button className="mt-4 sm:mt-0" onClick={() => router.push("/expenses/new")}>
//             <Plus className="mr-2 h-4 w-4" /> Add Expense
//           </Button>
//         </div>

//         <Tabs defaultValue="all" className="mb-6">
//           <TabsList>
//             <TabsTrigger value="all">All Expenses</TabsTrigger>
//             <TabsTrigger value="recent">Recent</TabsTrigger>
//             <TabsTrigger value="recurring">Recurring</TabsTrigger>
//           </TabsList>
//           <TabsContent value="all" className="mt-4">
//             <Card>
//               <CardHeader>
//                 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//                   <div className="relative w-full sm:w-96">
//                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       type="search"
//                       placeholder="Search expenses..."
//                       className="pl-8 w-full"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </div>
//                   <div className="flex gap-2 w-full sm:w-auto">
//                     <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                       <SelectTrigger className="w-full sm:w-[180px]">
//                         <Filter className="mr-2 h-4 w-4" />
//                         <SelectValue placeholder="Category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {categories.map((category) => (
//                           <SelectItem key={category} value={category}>
//                             {category === "all" ? "All Categories" : category}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <Select value={sortBy} onValueChange={setSortBy}>
//                       <SelectTrigger className="w-full sm:w-[180px]">
//                         <ArrowUpDown className="mr-2 h-4 w-4" />
//                         <SelectValue placeholder="Sort by" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="date-desc">Date (Newest)</SelectItem>
//                         <SelectItem value="date-asc">Date (Oldest)</SelectItem>
//                         <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
//                         <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
//                         <SelectItem value="name-asc">Name (A-Z)</SelectItem>
//                         <SelectItem value="name-desc">Name (Z-A)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {sortedExpenses.length === 0 ? (
//                     <div className="text-center py-6 text-muted-foreground">
//                       No expenses found. Try adjusting your filters.
//                     </div>
//                   ) : (
//                     sortedExpenses.map((expense) => (
//                       <div
//                         key={expense.id}
//                         className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
//                         onClick={() => router.push(`/expenses/${expense.id}`)}
//                       >
//                         <div className="flex flex-col">
//                           <div className="font-medium">{expense.name}</div>
//                           <div className="text-sm text-muted-foreground">{expense.date}</div>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             <Badge variant="outline">{expense.category}</Badge>
//                             {expense.tags.map((tag) => (
//                               <Badge key={tag} variant="secondary" className="text-xs">
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="text-lg font-semibold mt-2 sm:mt-0">${expense.amount.toFixed(2)}</div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <div className="text-sm text-muted-foreground">
//                   Showing {sortedExpenses.length} of {expenses.length} expenses
//                 </div>
//                 <Button variant="outline" size="sm" disabled>
//                   Load More
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>
//           <TabsContent value="recent">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Expenses</CardTitle>
//                 <CardDescription>Your expenses from the last 7 days</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {expenses.slice(0, 4).map((expense) => (
//                     <div
//                       key={expense.id}
//                       className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
//                       onClick={() => router.push(`/expenses/${expense.id}`)}
//                     >
//                       <div className="flex flex-col">
//                         <div className="font-medium">{expense.name}</div>
//                         <div className="text-sm text-muted-foreground">{expense.date}</div>
//                         <div className="flex flex-wrap gap-1 mt-1">
//                           <Badge variant="outline">{expense.category}</Badge>
//                         </div>
//                       </div>
//                       <div className="text-lg font-semibold mt-2 sm:mt-0">${expense.amount.toFixed(2)}</div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="recurring">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recurring Expenses</CardTitle>
//                 <CardDescription>Your regular monthly expenses</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {expenses
//                     .filter((e) => e.tags.includes("subscription") || e.tags.includes("monthly"))
//                     .map((expense) => (
//                       <div
//                         key={expense.id}
//                         className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
//                         onClick={() => router.push(`/expenses/${expense.id}`)}
//                       >
//                         <div className="flex flex-col">
//                           <div className="font-medium">{expense.name}</div>
//                           <div className="text-sm text-muted-foreground">{expense.date}</div>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             <Badge variant="outline">{expense.category}</Badge>
//                             {expense.tags.map((tag) => (
//                               <Badge key={tag} variant="secondary" className="text-xs">
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="text-lg font-semibold mt-2 sm:mt-0">${expense.amount.toFixed(2)}</div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   )
// }