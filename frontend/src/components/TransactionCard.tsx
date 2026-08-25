import type { TRANSACTIONTYPE } from "../types";
import {
  ShoppingCart,
  Car,
  FileText,
  PartyPopper,
  UtensilsCrossed,
  ShoppingBag,
  Pen,
  HeartPulse,
  Plane,
  MoreHorizontal,
  Wallet,
  Users,
  ArrowLeft,
  Laptop,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Greocery: ShoppingCart,
  Grocery: ShoppingCart,
  Vehicle: Car,
  Bills: FileText,
  Party: PartyPopper,
  Food: UtensilsCrossed,
  Shopping: ShoppingBag,
  Stationary: Pen,
  MEdical: HeartPulse,
  Medical: HeartPulse,
  Travel: Plane,
  Other: MoreHorizontal,
  Salary: Wallet,
  Family: Users,
  Refund: ArrowLeft,
  Freelance: Laptop,
};

const categoryColors: Record<string, string> = {
  Greocery: "bg-emerald-100 text-emerald-600",
  Grocery: "bg-emerald-100 text-emerald-600",
  Vehicle: "bg-blue-100 text-blue-600",
  Bills: "bg-red-100 text-red-600",
  Party: "bg-purple-100 text-purple-600",
  Food: "bg-orange-100 text-orange-600",
  Shopping: "bg-pink-100 text-pink-600",
  Stationary: "bg-cyan-100 text-cyan-600",
  MEdical: "bg-rose-100 text-rose-600",
  Medical: "bg-rose-100 text-rose-600",
  Travel: "bg-indigo-100 text-indigo-600",
  Other: "bg-gray-100 text-gray-600",
  Salary: "bg-green-100 text-green-600",
  Family: "bg-yellow-100 text-yellow-600",
  Refund: "bg-teal-100 text-teal-600",
  Freelance: "bg-violet-100 text-violet-600",
};

const paymentMethodColors: Record<string, string> = {
  UPI: "bg-blue-50 text-blue-700 border-blue-200",
  "Debit Card": "bg-purple-50 text-purple-700 border-purple-200",
  "Credit Card": "bg-orange-50 text-orange-700 border-orange-200",
  "Net Banking": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Cash: "bg-green-50 text-green-700 border-green-200",
  Other: "bg-gray-50 text-gray-700 border-gray-200",
};

interface TransactionCardProps {
  transaction: TRANSACTIONTYPE;
  selectedTransaction: TRANSACTIONTYPE | null,
  onDelete?: (id: string) => void;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<TRANSACTIONTYPE | null>>
}

const TransactionCard = ({ transaction, onDelete, setSelectedTransaction }: TransactionCardProps) => {
  const IconComponent = categoryIcons[transaction.category] || MoreHorizontal;
  const colorClass = categoryColors[transaction.category] || "bg-gray-100 text-gray-600";
  const paymentColor = paymentMethodColors[transaction.paymentMethod] || "bg-gray-50 text-gray-700 border-gray-200";

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = d.toDateString() === today.toDateString();
    const isYesterday = d.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} transition-transform duration-200 group-hover:scale-110`}>
          <IconComponent size={22} />
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {transaction.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${paymentColor}`}>
              {transaction.paymentMethod}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="capitalize">{transaction.category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{formatDate(transaction.transactionDate)}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{formatTime(transaction.transactionDate)}</span>
          </div>
        </div>

        {/* Amount and Type */}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-lg font-bold ${transaction.type === "Income"
              ? "text-emerald-600"
              : "text-red-500"
              }`}
          >
            {transaction.type === "Income" ? "+" : "-"}₹
            {transaction.amount.toLocaleString("en-IN")}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${transaction.type === "Income"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
              }`}
          >
            {transaction.type}
          </span>
        </div>

        {/* button groups */}
        <div className="flex items-center flex-col gap-1">
          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction._id)}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* update */}
          <button
            onClick={() => {
              setSelectedTransaction(transaction)
            }}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Pen size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
