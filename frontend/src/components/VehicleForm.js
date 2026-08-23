import React, { useState, useEffect } from 'react';

const empty = { make: '', model: '', category: '', price: '', quantity: '', image_url: '' };

export default function VehicleForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || empty);
  const [error, setError] = useState('');

  useEffect(() => { setForm(initial || empty); }, [initial]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.make.trim() || !form.model.trim() || !form.category.trim())
      return setError('Make, model and category are required.');
    if (Number(form.price) < 0) return setError('Price must be >= 0.');
    if (Number(form.quantity) < 0) return setError('Quantity must be >= 0.');
    try { await onSubmit(form); }
    catch (err) { setError(err.response?.data?.error || 'Something went wrong.'); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'make',     label: 'Make',       placeholder: 'e.g. BMW',       type: 'text'   },
          { name: 'model',    label: 'Model',      placeholder: 'e.g. M4',        type: 'text'   },
          { name: 'category', label: 'Category',   placeholder: 'e.g. Coupe',     type: 'text'   },
          { name: 'price',    label: 'Price ($)',   placeholder: '0.00',           type: 'number' },
          { name: 'quantity', label: 'Quantity',   placeholder: '0',              type: 'number' },
        ].map(f => (
          <div key={f.name}>
            <label className="label">{f.label}</label>
            <input name={f.name} value={form[f.name]} onChange={handle}
              className="input-field" placeholder={f.placeholder} type={f.type}
              min={f.type === 'number' ? '0' : undefined} required />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="label">Image URL <span className="text-zinc-600 normal-case font-normal">(optional)</span></label>
          <input name="image_url" value={form.image_url} onChange={handle}
            className="input-field" placeholder="https://images.unsplash.com/..." type="url" />
          {form.image_url && (
            <img src={form.image_url} alt="preview"
              className="mt-2 h-24 w-full object-cover rounded-xl border border-zinc-700"
              onError={(e) => { e.target.style.display = 'none'; }} />
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
      </div>
    </form>
  );
}
