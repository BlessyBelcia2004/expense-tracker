// lib/api-client.ts

const apiClient = {
    async request(url: string, options: RequestInit = {}) {
      const token = localStorage.getItem("token") // or cookie/context/etc.
  
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Request failed")
      }
  
      return res.json()
    },
  
    async createExpense(data: any) {
      return this.request("/api/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  
    async getExpenses() {
      return this.request("/api/expenses")
    },
  }
  
  export default apiClient
  