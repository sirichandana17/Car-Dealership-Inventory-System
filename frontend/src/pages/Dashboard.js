import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import SearchFilters from '../components/SearchFilters';
import Loading from '../components/Loading';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const emptyFilters = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };

export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);
  const [purchasing, setPurchasing] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilter = Object.values(filters).some(v => v !== '');
      const params = hasFilter
        ? new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))).toString()
        : '';
      const { data } = await api.get(hasFilter ? `/vehicles/search?${params}` : '/vehicles');
      setVehicles(data.vehicles);
    } catch {
      setNotification({ message: 'Failed to load vehicles.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handlePurchase = async (vehicle) => {
    setPurchasing(vehicle.id);
    try {
      await api.post(`/vehicles/${vehicle.id}/purchase`);
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, quantity: v.quantity - 1 } : v));
      setNotification({ message: `${vehicle.make} ${vehicle.model} purchased!`, type: 'success' });
    } catch (err) {
      setNotification({ message: err.response?.data?.error || 'Purchase failed.', type: 'error' });
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      {/* Hero */}
      <div className="relative border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=60')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-widest mb-2">Welcome back, {user?.name}</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Our <span className="text-red-500">Showroom</span>
          </h1>
          <p className="text-zinc-500 text-lg">Browse and purchase from our exclusive collection.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilters filters={filters} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />

        {loading ? (
          <Loading text="Loading vehicles..." />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-24 border border-zinc-800 rounded-2xl">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-zinc-400">No vehicles found</h3>
            <p className="text-zinc-600 mt-2 text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-5">
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} onPurchase={handlePurchase} purchasing={purchasing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
