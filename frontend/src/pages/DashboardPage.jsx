import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTransactions } from '../api/transactionApi';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data);
      } catch (error) {
        console.log('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category-wise expense breakdown for pie chart
  const categoryBreakdown = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const catName = t.category?.name || 'Uncategorized';
      acc[catName] = (acc[catName] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }));

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">₹{totalIncome}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Total Expense</p>
          <p className="text-2xl font-bold text-red-600">₹{totalExpense}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Transactions</p>
          <p className="text-2xl font-bold text-slate-900">{transactions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Spending by Category</h2>
          {pieData.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-12">No expense data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((t) => (
              <div key={t._id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{t.description}</p>
                  <p className="text-sm text-slate-500">{t.category?.name}</p>
                </div>
                <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;