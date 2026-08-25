import { create } from "zustand";
import { categories } from "../constants";
import type { CATEGORYSUMMARY, DAILYSUMMARY, TRANSACTIONTYPE } from "../types";
import { useTransactionStore } from "./transaction.store";

interface SUMMARYSTOREINTERFACE {
    dailySummary: DAILYSUMMARY[];
    categorySummary: CATEGORYSUMMARY[];
    totalIncome: number;
    totalExpenses: number;
    totalBalance: number;
    totalTransactionCount: number;
    computeSummary: (transactions: TRANSACTIONTYPE[]) => void;
}

const formatDayKey = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export const useSummaryStore = create<SUMMARYSTOREINTERFACE>((set) => ({
    dailySummary: [],
    categorySummary: [],
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    totalTransactionCount: 0,

    computeSummary: (transactions) => {
        let totalIncome = 0;
        let totalExpenses = 0;

        const dayMap = new Map<string, DAILYSUMMARY>();
        const categoryMap = new Map<string, CATEGORYSUMMARY>(
            categories.map((category) => [
                category,
                { category, transactionCount: 0, totalIncome: 0, totalExpenses: 0, netAmount: 0 },
            ])
        );

        transactions.forEach((transaction) => {
            const amount = transaction.amount;
            const isIncome = transaction.type === "Income";

            // Overall totals
            if (isIncome) totalIncome += amount;
            else totalExpenses += amount;

            // Category summary
            const categorySummary =
                categoryMap.get(transaction.category) ?? {
                    category: transaction.category,
                    transactionCount: 0,
                    totalIncome: 0,
                    totalExpenses: 0,
                    netAmount: 0,
                };
            categorySummary.transactionCount += 1;
            if (isIncome) categorySummary.totalIncome += amount;
            else categorySummary.totalExpenses += amount;
            categorySummary.netAmount = categorySummary.totalIncome - categorySummary.totalExpenses;
            categoryMap.set(transaction.category, categorySummary);

            // Daily summary
            const dayKey = formatDayKey(transaction.transactionDate);
            let daySummary = dayMap.get(dayKey);
            if (!daySummary) {
                daySummary = {
                    date: dayKey,
                    displayDate: formatDisplayDate(transaction.transactionDate),
                    transactionCount: 0,
                    totalIncome: 0,
                    totalExpenses: 0,
                    netAmount: 0,
                    categories: {},
                };
                dayMap.set(dayKey, daySummary);
            }
            daySummary.transactionCount += 1;
            if (isIncome) daySummary.totalIncome += amount;
            else daySummary.totalExpenses += amount;
            daySummary.netAmount = daySummary.totalIncome - daySummary.totalExpenses;
            daySummary.categories[transaction.category] =
                (daySummary.categories[transaction.category] ?? 0) + (isIncome ? amount : -amount);
        });

        const dailySummary = Array.from(dayMap.values()).sort((a, b) =>
            b.date.localeCompare(a.date)
        );
        const categorySummary = Array.from(categoryMap.values()).sort(
            (a, b) => b.totalExpenses - a.totalExpenses
        );

        set({
            dailySummary,
            categorySummary,
            totalIncome,
            totalExpenses,
            totalBalance: totalIncome - totalExpenses,
            totalTransactionCount: transactions.length,
        });
    },
}));

// Keep the summary store in sync with the transaction store automatically.
// Whenever the loaded transactions change, recompute the summary.
useTransactionStore.subscribe((state, prevState) => {
    if (state.transactions !== prevState.transactions) {
        useSummaryStore.getState().computeSummary(state.transactions);
    }
});

// Initial sync in case transactions were loaded before this store was imported.
useSummaryStore.getState().computeSummary(useTransactionStore.getState().transactions);
