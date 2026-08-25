import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useSummaryStore } from "../store/summary.store";

const TransactionSummary = () => {
  const totalIncome = useSummaryStore((s) => s.totalIncome);
  const totalExpenses = useSummaryStore((s) => s.totalExpenses);
  const balance = useSummaryStore((s) => s.totalBalance);

  const summaryCards = [
    {
      label: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      badgeIcon: ArrowUpRight,
      badgeColor: "bg-emerald-50 text-emerald-700",
      gradient: "from-emerald-50 to-white",
      borderColor: "border-emerald-100",
    },
    {
      label: "Total Expenses",
      amount: totalExpenses,
      icon: TrendingDown,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      badgeIcon: ArrowDownRight,
      badgeColor: "bg-red-50 text-red-700",
      gradient: "from-red-50 to-white",
      borderColor: "border-red-100",
    },
    {
      label: "Balance",
      amount: balance,
      icon: Wallet,
      iconBg: balance >= 0 ? "bg-blue-100" : "bg-amber-100",
      iconColor: balance >= 0 ? "text-blue-600" : "text-amber-600",
      badgeIcon: null,
      badgeColor: balance >= 0
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700",
      gradient: "from-blue-50 to-white",
      borderColor: "border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl border ${card.borderColor} p-5 hover:shadow-lg transition-all duration-300 group`}
          >
            {/* Background decorative circle */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/50 group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <Icon size={20} className={card.iconColor} />
                </div>
                {BadgeIcon && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${card.badgeColor}`}>
                    <BadgeIcon size={12} />
                    <span>{card.label === "Total Income" ? "Credit" : "Debit"}</span>
                  </div>
                )}
              </div>

              <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${
                card.label === "Total Income"
                  ? "text-emerald-700"
                  : card.label === "Total Expenses"
                  ? "text-red-600"
                  : balance >= 0
                  ? "text-blue-700"
                  : "text-amber-700"
              }`}>
                ₹{card.amount.toLocaleString("en-IN")}
              </p>

              {/* Mini progress bar for balance */}
              {card.label === "Balance" && totalIncome > 0 && (
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      balance >= 0 ? "bg-blue-500" : "bg-amber-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(balance) / totalIncome * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionSummary;
