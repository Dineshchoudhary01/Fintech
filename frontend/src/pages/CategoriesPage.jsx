import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api/categoryApi';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.log('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCategory({ name, type });
      setName('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete category');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Categories</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Default Categories</h2>
            </div>
            <div className="p-6 flex flex-wrap gap-2">
              {defaultCategories.map((c) => (
                <span
                  key={c._id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    c.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Your Categories</h2>
            </div>
            {customCategories.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No custom categories yet</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {customCategories.map((c) => (
                  <div key={c._id} className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{c.name}</span>
                      <span className="text-xs text-slate-400 capitalize">({c.type})</span>
                    </div>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 text-sm hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Add Category</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gym Membership"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;