// On Vercel the backend and frontend are served from the same domain, so a
// relative path is used in production. In local development, Vite proxies
// "/api" requests to the backend (see vite.config.ts).
export const BACKEND_URL = "/api";

export const categories = [
    "Bills",
    "Grocery",
    "Vehicle",
    "Party",
    "Food",
    "Shopping",
    "Stationary",
    "Medical",
    "Travel",
    "Salary",
    "Family",
    "Refund",
    "Freelance",
    "Other",
];
