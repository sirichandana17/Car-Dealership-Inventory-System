import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import VehicleForm from '../components/VehicleForm';
import AdminVehicleRow from '../components/AdminVehicleRow';
import SearchFilters from '../components/SearchFilters';
import Loading from '../components/Loading';
import Notification from '../components/Notification';

const emptyFilters = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [filters, setFilters] = useState(emptyFilters);
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => setNotification({ message, type });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilter = Object.values(filters).some(v => v !== '');
      const params = hasFilter
        ? new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))).toString()
        : '';
      const { data } = await api.get(hasFilter ? `/vehicles/search?${params}` : '/vehicles');
      setVehicles(data.vehicles);
    } catch { notify('Failed to load vehicles.', 'error'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleAdd = async (form) => {
    setFormLoading(true);
    try {
      await api.post('/vehicles', form);
      notify('Vehicle added!');
      setShowAddForm(false);
      fetchVehicles();
    } catch (err) { notify(err.response?.data?.error || 'Failed to add.', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (form) => {
    setFormLoading(true);
    try {
      await api.put(`/vehicles/${editing.id}`, form);
      notify('Vehicle updated!');
      setEditing(null);
      fetchVehicles();
    } catch (err) { notify(err.response?.data?.error || 'Failed to update.', 'error'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await api.delete(`/vehicles/${id}`); notify('Vehicle deleted.'); fetchVehicles(); }
    catch { notify('Delete failed.', 'error'); }
  };

  const handleRestock = async (id, amount) => {
    try { await api.post(`/vehicles/${id}/restock`, { amount }); notify(`+${amount} units restocked.`); fetchVehicles(); }
    catch (err) { notify(err.response?.data?.error || 'Restock failed.', 'error'); }
  };

  const stats = [
    { label: 'Total Models',  value: vehicles.length,                               color: 'text-white' },
    { label: 'In Stock',      value: vehicles.filter(v => v.quantity > 0).length,   color: 'text-green-400' },
    { label: 'Out of Stock',  value: vehicles.filter(v => v.quantity === 0).length, color: 'text-red-500' },
    { label: 'Total Units',   value: vehicles.reduce((s, v) => s + Number(v.quantity), 0), color: 'text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="text-3xl font-black text-white">Inventory Management</h1>
            </div>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setEditing(null); }}
              className={showAddForm ? 'btn-secondary' : 'btn-primary'}>
              {showAddForm ? '✕ Cancel' : '+ Add Vehicle'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {stats.map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add form */}
        {showAddForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-5">Add New Vehicle</h2>
            <VehicleForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} loading={formLoading} />
          </div>
        )}

        {/* Edit form */}
        {editing && (
          <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Edit Vehicle</h2>
            <p className="text-zinc-500 text-sm mb-5">{editing.make} {editing.model}</p>
            <VehicleForm
              initial={{ ...editing, image_url: editing.image_url || '' }}
              onSubmit={handleEdit}
              onCancel={() => setEditing(null)}
              loading={formLoading}
            />
          </div>
        )}

        <SearchFilters filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />

        {loading ? (
          <Loading text="Loading inventory..." />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 border border-zinc-800 rounded-2xl">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-zinc-400">No vehicles found</h3>
            <p className="text-zinc-600 mt-2 text-sm">Add your first vehicle above.</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-800">
                  <tr>
                    {['Image', 'Make', 'Model', 'Year', 'Category', 'Price', 'Qty', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <AdminVehicleRow key={v.id} vehicle={v} onEdit={setEditing} onDelete={handleDelete} onRestock={handleRestock} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
