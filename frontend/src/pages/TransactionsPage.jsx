
import { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../api/transactionApi';
import { getCategories } from '../api/categoryApi';
import TransactionForm from '../components/transactions/TransactionForm';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([getTransactions(), getCategories()]);
      setTransactions(txRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.log('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await deleteTransaction(id);
    fetchData();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t._id}>
                <td className="px-6 py-4">{t.description}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5">
                    {t.category?.name}
                    {t.categorySource === 'ai' && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize">{t.type}</td>
                <td className={`px-6 py-4 font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{t.amount}
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <TransactionForm
          categories={categories}
          editingTransaction={editingTransaction}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default TransactionsPage;