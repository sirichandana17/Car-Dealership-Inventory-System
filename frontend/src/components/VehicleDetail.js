import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatINR, formatUSD } from '../utils/price';
import { useAuth } from '../context/AuthContext';

const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

const BADGE = {
  Petrol:    'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Diesel:    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Electric:  'bg-green-500/20 text-green-400 border-green-500/30',
  Hybrid:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Automatic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Manual:    'bg-red-500/20 text-red-400 border-red-500/30',
};

function Spec({ label, value, badge }) {
  return (
    <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/50">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      {badge
        ? <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${BADGE[value] || 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{value}</span>
        : <p className="text-white font-semibold text-sm">{value}</p>
      }
    </div>
  );
}

export default function VehicleDetail({ vehicleId, onClose, onPurchase, purchasing }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/vehicles/${vehicleId}`)
      .then(r => setData(r.data))
      .catch(() => onClose())
      .finally(() => setLoading(false));
  }, [vehicleId, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
    </div>
  );

  if (!data) return null;
  const { vehicle: v, similar } = data;
  const outOfStock = Number(v.quantity) === 0;
  const { inr, usd } = { inr: formatINR(v.price), usd: formatUSD(v.price) };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl my-auto shadow-2xl">

        {/* Header image */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden">
          <img src={v.image_url || FALLBACK} alt={`${v.make} ${v.model}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACK; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <button onClick={onClose}
            className="absolute top-4 right-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white w-9 h-9 rounded-xl flex items-center justify-center transition text-lg">
            ✕
          </button>
          <div className="absolute bottom-4 left-5">
            <span className="bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {v.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Title + price */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-white">{v.make} {v.model}</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Year of Manufacturing: <span className="text-zinc-300 font-semibold">{v.year}</span></p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-white">{inr}</p>
              <p className="text-zinc-500 text-sm">{usd}</p>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            <Spec label="Category"     value={v.category} />
            <Spec label="Year"         value={v.year} />
            <Spec label="Fuel Type"    value={v.fuel_type}    badge />
            <Spec label="Transmission" value={v.transmission} badge />
            <Spec label="Mileage"      value={v.mileage || '—'} />
            <Spec label="Stock"        value={outOfStock ? 'Out of Stock' : `${v.quantity} units`} />
          </div>

          {/* Description */}
          {v.description && (
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-4 mb-5">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">About this vehicle</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{v.description}</p>
            </div>
          )}

          {/* Purchase button */}
          {user && (
            <button
              onClick={() => { onClose(); onPurchase(v); }}
              disabled={outOfStock || purchasing === v.id}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all mb-6
                ${outOfStock
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 active:scale-95'
                }`}>
              {outOfStock ? 'Out of Stock' : 'Purchase Now'}
            </button>
          )}

          {/* Similar models */}
          {similar && similar.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">More from {v.make}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similar.map(s => (
                  <div key={s.id} className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-500 transition"
                    onClick={() => { onClose(); setTimeout(() => onClose(s.id), 50); }}>
                    <img src={s.image_url || FALLBACK} alt={s.model}
                      className="w-full h-20 object-cover"
                      onError={(e) => { e.target.src = FALLBACK; }} />
                    <div className="p-2">
                      <p className="text-white text-xs font-semibold truncate">{s.model}</p>
                      <p className="text-zinc-500 text-xs">{formatINR(s.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
