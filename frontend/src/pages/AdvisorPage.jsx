import { useState, useEffect } from 'react';
import { getBudgetInsights } from '../api/advisorApi';

function AdvisorPage() {
  const [summary, setSummary] = useState([]);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await getBudgetInsights();
        setSummary(response.data.summary);
        setAdvice(response.data.advice);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <p className="text-slate-500">Analyzing your spending...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">AI Budget Advisor</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {advice && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✨</span>
            <h2 className="text-white font-semibold">Your Personalized Advice</h2>
          </div>
          <p className="text-blue-50 leading-relaxed">{advice}</p>
        </div>
      )}

      {summary.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-500">
          No budgets set for this month yet — set a budget to get AI insights
        </div>
      ) : (
        <div className="space-y-4">
          {summary.map((item, i) => {
            const barColor =
              item.percentageUsed >= 100 ? 'bg-red-500' : item.percentageUsed >= 75 ? 'bg-yellow-500' : 'bg-green-500';

            return (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900">{item.category}</span>
                  <span className={`text-sm font-medium ${item.remaining < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                    {item.remaining < 0
                      ? `₹${Math.abs(item.remaining)} over budget`
                      : `₹${item.remaining} remaining`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${barColor}`}
                    style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500">
                  ₹{item.spent} of ₹{item.budgetLimit} ({item.percentageUsed}%)
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdvisorPage;