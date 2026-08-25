import { AlertCircle, Receipt } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../constants";
import type { TRANSACTIONTYPE } from "../types";
import TransactionCard from "./TransactionCard";
import type { SortOption, TransactionType } from "./TransactionFilters";
import TransactionFilters from "./TransactionFilters";
import TransactionSummary from "./TransactionSummary";
import UpdateTransactionPopOver from "./UpdateTransactionPopOver";

interface TransactionListProps {
  transactions: TRANSACTIONTYPE[];
  onDeleteTransaction?: (id: string) => void;
}

const TransactionList = ({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSummary, setShowSummary] = useState(true);
  const [selectedTransaction, setselectedTransaction] = useState<TRANSACTIONTYPE | null>(null)

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower) ||
          t.paymentMethod.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
        case "oldest":
          return new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  const hasTransactions = transactions.length > 0;
  const hasResults = filteredAndSortedTransactions.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {showSummary && hasTransactions && (
        <div className="relative">
          <button
            onClick={() => setShowSummary(false)}
            className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center text-xs transition-colors"
            title="Hide summary"
          >
            ✕
          </button>
          <TransactionSummary />
        </div>
      )}

      {!showSummary && hasTransactions && (
        <button
          onClick={() => setShowSummary(true)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <span>Show Summary</span>
        </button>
      )}

      {/* Filters */}
      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {/* Transaction Count */}
      {hasTransactions && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {hasResults ? (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredAndSortedTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {transactions.length}
                </span>{" "}
                transactions
              </>
            ) : (
              "No transactions match your filters"
            )}
          </p>
        </div>
      )}

      {/* Transactions List */}
      {hasResults ? (
        <div className="space-y-2.5">
          {filteredAndSortedTransactions.map((transaction) => (
            <div key={transaction._id} className="relative">
            <TransactionCard
              transaction={transaction}
              setSelectedTransaction={setselectedTransaction}
              selectedTransaction={selectedTransaction}
              onDelete={onDeleteTransaction}
              />
              {selectedTransaction === transaction && <UpdateTransactionPopOver
              onClose={() => setselectedTransaction(null)} transaction={selectedTransaction}/>}
              </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          {hasTransactions ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">
                No matching transactions
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or filters
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Receipt size={28} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium mb-1">
                No transactions yet
              </p>
              <p className="text-sm text-gray-400">
                Add your first transaction to get started
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
