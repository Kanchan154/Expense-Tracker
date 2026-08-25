import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import type { DAILYSUMMARY } from "../types";
import { useSummaryStore } from "../store/summary.store";

interface TransactionChartsProps {
  year?: number;
  month?: string; // "01" - "12"
}

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#ef4444";

// Colors for pie slices, consistent with the category colors used in the app
const categoryColors: Record<string, string> = {
  Bills: "#f97316",
  Grocery: "#10b981",
  Vehicle: "#3b82f6",
  Party: "#a855f7",
  Food: "#f59e0b",
  Shopping: "#ec4899",
  Stationary: "#06b6d4",
  Medical: "#f43f5e",
  Travel: "#6366f1",
  Salary: "#22c55e",
  Family: "#eab308",
  Refund: "#14b8a6",
  Freelance: "#8b5cf6",
  Other: "#6b7280",
};

const fallbackPalette = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
  "#f97316",
  "#64748b",
];

const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

interface DayDatum {
  day: number;
  label: string;
  income: number;
  expenses: number;
  net: number;
}

interface PieDatum {
  name: string;
  value: number;
  color: string;
}

// Build a zero-filled series for every date of the month so the charts
// always show all dates, even days without any transactions.
const buildMonthSeries = (
  year: number,
  month: string,
  dailySummary: DAILYSUMMARY[]
): DayDatum[] => {
  const paddedMonth = String(Number(month)).padStart(2, "0");
  const daysInMonth = new Date(year, Number(paddedMonth), 0).getDate();
  const byDate = new Map(dailySummary.map((d) => [d.date, d]));
  const series: DayDatum[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${paddedMonth}-${String(day).padStart(2, "0")}`;
    const summary = byDate.get(dateKey);
    series.push({
      day,
      label: `${day} ${new Date(year, Number(paddedMonth) - 1, day).toLocaleDateString("en-US", { month: "short" })}`,
      income: summary?.totalIncome ?? 0,
      expenses: summary?.totalExpenses ?? 0,
      net: summary?.netAmount ?? 0,
    });
  }

  return series;
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
  fontSize: 13,
};

const TransactionCharts = ({ year, month }: TransactionChartsProps) => {
  const dailySummary = useSummaryStore((s) => s.dailySummary);
  const categorySummary = useSummaryStore((s) => s.categorySummary);
  const totalTransactionCount = useSummaryStore((s) => s.totalTransactionCount);

  const monthData = useMemo(() => {
    const resolvedYear =
      year ?? (dailySummary[0] ? Number(dailySummary[0].date.slice(0, 4)) : new Date().getFullYear());
    const resolvedMonth =
      month ?? (dailySummary[0]?.date.slice(5, 7) ?? new Date().toISOString().slice(5, 7));
    return buildMonthSeries(resolvedYear, resolvedMonth, dailySummary);
  }, [year, month, dailySummary]);

  const pieData = useMemo<PieDatum[]>(
    () =>
      categorySummary
        .filter((c) => c.totalExpenses > 0)
        .map((c) => ({
          name: c.category,
          value: c.totalExpenses,
          color: categoryColors[c.category] ?? fallbackPalette[c.category.length % fallbackPalette.length],
        })),
    [categorySummary]
  );

  const hasAnyExpense = pieData.length > 0;
  const totalSpent = pieData.reduce((sum, p) => sum + p.value, 0);

  if (totalTransactionCount === 0) return null;

  return (
    <section className="mt-8 space-y-4">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Monthly Analytics</h2>
          <p className="text-xs text-gray-400">
            Your income, expenses and category breakdown for the selected month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie chart - spending by category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <PieChartIcon size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Spending by Category</h3>
              <p className="text-xs text-gray-400">Where your money went</p>
            </div>
          </div>

          {hasAnyExpense ? (
            <div className="relative h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="45%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    strokeWidth={2}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatINR(Number(value))}
                    contentStyle={tooltipStyle}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: 12, paddingLeft: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Total Spent</p>
                <p className="text-xl font-bold text-gray-900">{formatINR(totalSpent)}</p>
              </div>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <PieChartIcon size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No expenses recorded yet</p>
            </div>
          )}
        </div>

        {/* Bar chart - daily income vs expenses */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Daily Income vs Expenses</h3>
              <p className="text-xs text-gray-400">Day-by-day comparison</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#f3f4f6" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={60}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatINR(Number(value))}
                  labelFormatter={(_, payload) => {
                    const day = payload?.[0]?.payload?.label;
                    return day ? day : "";
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[4, 4, 0, 0]} maxBarSize={14} />
                <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line chart - full month trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <LineChartIcon size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Monthly Trend</h3>
              <p className="text-xs text-gray-400">Income and expenses across all dates of the month</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#f3f4f6" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                  width={60}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatINR(Number(value))}
                  labelFormatter={(_, payload) => {
                    const day = payload?.[0]?.payload?.label;
                    return day ? day : "";
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke={INCOME_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: INCOME_COLOR, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke={EXPENSE_COLOR}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: EXPENSE_COLOR, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionCharts;
