import React, { useState, useEffect, useRef } from "react";
import type { TRANSACTIONINPUTTYPE } from "../types";
import { useTransactionStore } from "../store/transaction.store";
import {
  X,
  DollarSign,
  Tag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

interface ADDTRANSACTIONINTERFACE {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const EXPENSE_CATEGORIES = [
  { value: "Greocery", label: "Grocery" },
  { value: "Vehicle", label: "Vehicle" },
  { value: "Bills", label: "Bills" },
  { value: "Party", label: "Party" },
  { value: "Food", label: "Food" },
  { value: "Shopping", label: "Shopping" },
  { value: "Stationary", label: "Stationary" },
  { value: "Medical", label: "Medical" },
  { value: "Travel", label: "Travel" },
  { value: "Family", label: "Family" },
  { value: "Other", label: "Other" },
] as const;

const INCOME_CATEGORIES = [
  { value: "Salary", label: "Salary" },
  { value: "Family", label: "Family" },
  { value: "Refund", label: "Refund" },
  { value: "Freelance", label: "Freelance" },
  { value: "Other", label: "Other" },
] as const;

const PAYMENT_METHODS = [
  { value: "UPI", label: "UPI", icon: "💳" },
  { value: "Debit Card", label: "Debit Card", icon: "🏦" },
  { value: "Credit Card", label: "Credit Card", icon: "💳" },
  { value: "Net Banking", label: "Net Banking", icon: "🏛️" },
  { value: "Cash", label: "Cash", icon: "💵" },
  { value: "Other", label: "Other", icon: "📋" },
] as const;

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

type FormErrors = Partial<Record<keyof TRANSACTIONINPUTTYPE, string>>;

const initialFormState: TRANSACTIONINPUTTYPE = {
  title: "",
  amount: 0,
  type: "Expense",
  category: "Other",
  paymentMethod: "Cash",
  transactionDate: new Date(),
};

const AddTransactionDialogBox = ({
  setShowDialog,
}: ADDTRANSACTIONINTERFACE) => {
  const { addTransaction } = useTransactionStore();
  const [form, setForm] = useState<TRANSACTIONINPUTTYPE>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    titleInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowDialog(false), 200);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!form.amount || form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (form.amount > 999999999) {
      newErrors.amount = "Amount is too large";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addTransaction({
        ...form,
        title: form.title.trim(),
        amount: Number(form.amount),
      });
      toast.success("Transaction added successfully!", {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "12px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10B981",
        },
      });
      handleClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to add transaction";
      toast.error(message, {
        style: {
          background: "#EF4444",
          color: "#fff",
          borderRadius: "12px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setField = <K extends keyof TRANSACTIONINPUTTYPE>(
    key: K,
    value: TRANSACTIONINPUTTYPE[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const categories =
    form.type === "Expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center "
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200  ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Plus size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Add Transaction
              </h2>
              <p className="text-xs text-gray-500">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto scrollbar-none">
          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => {
                  setField("type", "Expense");
                  if (
                    !EXPENSE_CATEGORIES.some(
                      (c) => c.value === form.category
                    )
                  ) {
                    setField("category", "Other");
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  form.type === "Expense"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowDownRight size={16} />
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setField("type", "Income");
                  if (
                    !INCOME_CATEGORIES.some(
                      (c) => c.value === form.category
                    )
                  ) {
                    setField("category", "Other");
                  }
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  form.type === "Income"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowUpRight size={16} />
                Income
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Title
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={titleInputRef}
                id="title"
                type="text"
                placeholder="e.g., Grocery shopping"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Amount
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount || ""}
                onChange={(e) =>
                  setField("amount", parseFloat(e.target.value) || 0)
                }
                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors.amount
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setField("category", cat.value as any)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    form.category === cat.value
                      ? form.type === "Expense"
                        ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                        : "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setField("paymentMethod", method.value as any)}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                    form.paymentMethod === method.value
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{method.icon}</span>
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-xs text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label
              htmlFor="transactionDate"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Transaction Date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="transactionDate"
                type="date"
                value={
                  form.transactionDate
                    ? new Date(form.transactionDate).toISOString().split("T")[0]
                    : getTodayString()
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : new Date();
                  setField("transactionDate", date);
                }}
                max={getTodayString()}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Defaults to today's date
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionDialogBox;