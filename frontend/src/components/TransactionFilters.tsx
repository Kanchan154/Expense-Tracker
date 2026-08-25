import { Search, Filter, ArrowDownUp, X } from "lucide-react";
import { useState } from "react";

type TransactionType = "All" | "Income" | "Expense";
type SortOption = "newest" | "oldest" | "highest" | "lowest";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: TransactionType;
  onTypeFilterChange: (value: TransactionType) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: string[];
}

const typeOptions: TransactionType[] = ["All", "Income", "Expense"];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

const TransactionFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  categories,
}: TransactionFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = typeFilter !== "All" || categoryFilter !== "All" || sortBy !== "newest";

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Quick Type Filters */}
      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => onTypeFilterChange(type)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                typeFilter === type
                  ? type === "All"
                    ? "bg-white text-gray-900 shadow-sm"
                    : type === "Income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-red-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort Button */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowDownUp
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Toggle Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2 rounded-lg transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? "bg-blue-50 text-blue-600"
              : "bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          <Filter size={16} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onCategoryFilterChange("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  categoryFilter === "All"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryFilterChange(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                    categoryFilter === cat
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
export type { TransactionType, SortOption };
