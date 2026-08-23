import React, { useState, useEffect } from 'react';

const empty = { make: '', model: '', category: '', year: '2024', price: '', quantity: '', fuel_type: 'Petrol', transmission: 'Automatic', mileage: '', description: '', image_url: '' };

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
        <div>
          <label className="label">Make</label>
          <input name="make" value={form.make} onChange={handle} className="input-field" placeholder="e.g. BMW" required />
        </div>
        <div>
          <label className="label">Model</label>
          <input name="model" value={form.model} onChange={handle} className="input-field" placeholder="e.g. M4" required />
        </div>
        <div>
          <label className="label">Category</label>
          <select name="category" value={form.category} onChange={handle} className="input-field">
            <option value="">Select category</option>
            {['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Truck', 'Van'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Year</label>
          <input name="year" value={form.year} onChange={handle} className="input-field" type="number" min="1990" max="2025" required />
        </div>
        <div>
          <label className="label">Price (₹ INR)</label>
          <input name="price" value={form.price} onChange={handle} className="input-field" type="number" min="0" placeholder="e.g. 5000000" required />
        </div>
        <div>
          <label className="label">Quantity</label>
          <input name="quantity" value={form.quantity} onChange={handle} className="input-field" type="number" min="0" required />
        </div>
        <div>
          <label className="label">Fuel Type</label>
          <select name="fuel_type" value={form.fuel_type} onChange={handle} className="input-field">
            {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Transmission</label>
          <select name="transmission" value={form.transmission} onChange={handle} className="input-field">
            {['Automatic', 'Manual'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Mileage</label>
          <input name="mileage" value={form.mileage} onChange={handle} className="input-field" placeholder="e.g. 12 kmpl or 400 km range" />
        </div>
        <div>
          <label className="label">Image URL <span className="text-zinc-600 normal-case font-normal">(optional)</span></label>
          <input name="image_url" value={form.image_url} onChange={handle} className="input-field" placeholder="https://..." type="url" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea name="description" value={form.description} onChange={handle}
            className="input-field resize-none" rows={3} placeholder="Brief description of the vehicle..." />
        </div>
      </div>

      {form.image_url && (
        <img src={form.image_url} alt="preview"
          className="h-24 w-full object-cover rounded-xl border border-zinc-700"
          onError={(e) => { e.target.style.display = 'none'; }} />
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>}
      </div>
    </form>
  );
}
