export type USERLOGINTYPE = {
    email: string,
    password: string
}

export type USERREGISTERTYPE = {
    name: string,
    email: string,
    password: string,
}

export type USERTYPE = {
    name: string,
    email: string,
}

export type TRANSACTIONTYPE = {
    _id: string,
    title: string,
    amount: number,
    type: "Income" | "Expense",
    category: "Greocery" | "Vehicle" | "Bills" | "Party" | "Food" | "Shopping" | "Stationary" | "MEdical" | "Travel" | "Other" | "Salary" | "Family" | "Refund" | "Freelance"
    user: string,
    paymentMethod: "UPI" | "Debit Card" | "Credit Card" | "Net Banking" | "Cash" | "Other",
    transactionDate: Date
}

export type TRANSACTIONINPUTTYPE = {
    amount: number,
    title: string,
    type: "Income" | "Expense",
    category: "Greocery" | "Vehicle" | "Bills" | "Party" | "Food" | "Shopping" | "Stationary" | "MEdical" | "Travel" | "Other" | "Salary" | "Family" | "Refund" | "Freelance"
    paymentMethod: "UPI" | "Debit Card" | "Credit Card" | "Net Banking" | "Cash" | "Other",
    transactionDate: Date
}

// Summary of a single category across all the loaded transactions
export type CATEGORYSUMMARY = {
    category: string,
    transactionCount: number,
    totalIncome: number,
    totalExpenses: number,
    netAmount: number,
}

// Summary of a single day across all the loaded transactions
export type DAILYSUMMARY = {
    date: string, // YYYY-MM-DD
    displayDate: string, // e.g. "31 Jul"
    transactionCount: number,
    totalIncome: number,
    totalExpenses: number,
    netAmount: number,
    // net amount (income - expense) per category for that day
    categories: Record<string, number>,
}