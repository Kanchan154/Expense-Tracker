import React, { useState, useEffect, useRef } from "react";
import type { TRANSACTIONINPUTTYPE, TRANSACTIONTYPE } from "../types";
import { useTransactionStore } from "../store/transaction.store";
import {
  X,
  DollarSign,
  Tag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface UPDATEITEMSPOPOVERPROPS {
  transaction: TRANSACTIONTYPE;
  onClose: () => void;
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

type FormErrors = Partial<Record<keyof TRANSACTIONINPUTTYPE, string>>;

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getDateString = (date: Date) => {
  return new Date(date).toISOString().split("T")[0];
};

const UpdateTransactionPopOver = ({
  transaction,
  onClose,
}: UPDATEITEMSPOPOVERPROPS) => {
  const { updateTransaction } = useTransactionStore();
  const [form, setForm] = useState<TRANSACTIONINPUTTYPE>({
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    paymentMethod: transaction.paymentMethod,
    transactionDate: new Date(transaction.transactionDate),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
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
      await updateTransaction(transaction._id, {
        ...form,
        title: form.title.trim(),
        amount: Number(form.amount),
      });
      toast.success("Transaction updated successfully!", {
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
        error?.response?.data?.message || "Failed to update transaction";
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
      className={`absolute top-0 right-0 z-50 transition-all duration-200 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-95"
      }`}
    >
      <div className="w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Save size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Update Transaction
              </h2>
              <p className="text-[11px] text-gray-500">Edit the details below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-none">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Transaction Type
            </label>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
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
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  form.type === "Expense"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowDownRight size={14} />
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
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  form.type === "Income"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <ArrowUpRight size={14} />
                Income
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="update-title"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <div className="relative">
              <Tag
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={titleInputRef}
                id="update-title"
                type="text"
                placeholder="e.g., Grocery shopping"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-amber-500/20 focus:border-amber-500"
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-0.5 text-[11px] text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="update-amount"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="update-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount || ""}
                onChange={(e) =>
                  setField("amount", parseFloat(e.target.value) || 0)
                }
                className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors.amount
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-amber-500/20 focus:border-amber-500"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-0.5 text-[11px] text-red-500">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setField("category", cat.value as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
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
              <p className="mt-0.5 text-[11px] text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setField("paymentMethod", method.value as any)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 border ${
                    form.paymentMethod === method.value
                      ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">{method.icon}</span>
                  <span>{method.label}</span>
                </button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="mt-0.5 text-[11px] text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="update-transactionDate"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Transaction Date
            </label>
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                id="update-transactionDate"
                type="date"
                value={
                  form.transactionDate
                    ? getDateString(form.transactionDate)
                    : getTodayString()
                }
                max={getTodayString()}
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : new Date();
                  setField("transactionDate", date);
                }}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Update Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransactionPopOver;
