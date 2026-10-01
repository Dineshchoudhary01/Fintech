import { useState, useEffect } from 'react';
import { getBudgets, createBudget, deleteBudget } from '../api/budgetApi';
import { getCategories } from '../api/categoryApi';

function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [error, setError] = useState('');

  const getCurrentMonthFirstDay = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetRes, catRes] = await Promise.all([getBudgets(), getCategories()]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.log('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createBudget({
        category,
        monthlyLimit: Number(monthlyLimit),
        month: getCurrentMonthFirstDay(),
      });
      setCategory('');
      setMonthlyLimit('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create budget');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    await deleteBudget(id);
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Budgets</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {budgets.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-500">
              No budgets set for this month yet
            </div>
          ) : (
            budgets.map((b) => {
              const spent = b.spent || 0;
              const percentage = Math.min(Math.round((spent / b.monthlyLimit) * 100), 100);
              const barColor =
                percentage >= 100 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500';

              return (
                <div key={b._id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-slate-900">{b.category?.name}</span>
                    <button onClick={() => handleDelete(b._id)} className="text-red-600 text-sm hover:underline">
                      Delete
                    </button>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-sm text-slate-500">
                    ₹{spent} of ₹{b.monthlyLimit} ({percentage}%)
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Set Budget</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Limit</label>
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Set Budget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BudgetsPage;