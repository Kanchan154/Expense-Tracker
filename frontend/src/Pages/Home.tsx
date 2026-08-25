import { LogOutIcon, Plus, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddTransactionDialogBox from "../components/AddTransactionDialogBox";
import TransactionCharts from "../components/TransactionCharts";
import TransactionList from "../components/TransactionList";
import YearAndMonthPicker from "../components/YearAndMonthPicker";
import { useTransactionStore } from "../store/transaction.store";
import { useUserStore } from "../store/user.store";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = (new Date().getMonth() + 1).toString().padStart(2, '0');
const Home = () => {
  const { viewTransaction, transactions, deleteTransaction } = useTransactionStore();
  const { user, logout } = useUserStore();

  const [year, setyear] = useState(CURRENT_YEAR);
  const [month, setmonth] = useState(CURRENT_MONTH);
  const [showDialog, setshowDialog] = useState(false);

  useEffect(() => {
    if (user && transactions.length === 0) {
      viewTransaction(`${year}-${month}`);
    }
  }, [user]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteTransaction(id);
  }, [deleteTransaction]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expense Tracker</h1>
                {user && (
                  <p className="text-xs text-gray-500">Welcome back, {user.name}</p>
                )}
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <button
                onClick={() => setshowDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Transaction</span>
              </button>
              <button className="bg-red-400 p-2 rounded-xl cursor-pointer">
                <LogOutIcon size={16} onClick={() => logout()} />
              </button>

            </div>
          </div>
        </div>
      </header>

      {
        showDialog && <AddTransactionDialogBox
          setShowDialog={setshowDialog}
        />
      }

      {/* month and year Picker */}
      <YearAndMonthPicker
        month={month}
        setmonth={setmonth}
        setyear={setyear}
        year={year}
        fetchTransactions={() => viewTransaction(`${year}-${month}`)}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={handleDelete}
        />
        <TransactionCharts year={year} month={month} />
      </main>
    </div>
  )
}

export default Home