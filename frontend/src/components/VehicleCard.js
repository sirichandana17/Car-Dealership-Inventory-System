import React from 'react';
import { formatINR, formatUSD } from '../utils/price';

const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

export default function VehicleCard({ vehicle, onPurchase, purchasing, onViewDetail }) {
  const outOfStock = Number(vehicle.quantity) === 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50">
      {/* Image — clickable */}
      <div className="relative h-48 overflow-hidden bg-zinc-800 cursor-pointer"
        onClick={() => onViewDetail(vehicle.id)}>
        <img
          src={vehicle.image_url || FALLBACK}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-700">
          {vehicle.category}
        </span>
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            SOLD OUT
          </span>
        )}
        {/* View details hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition bg-zinc-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-700">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-1 cursor-pointer" onClick={() => onViewDetail(vehicle.id)}>
          <h3 className="font-bold text-lg text-white leading-tight hover:text-red-400 transition">
            {vehicle.make} <span className="text-zinc-400">{vehicle.model}</span>
          </h3>
          <p className="text-zinc-600 text-xs mt-0.5">{vehicle.year}</p>
        </div>

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-zinc-800">
          <div>
            <p className="text-lg font-black text-white">{formatINR(vehicle.price)}</p>
            <p className="text-zinc-600 text-xs">{formatUSD(vehicle.price)}</p>
          </div>
          <div className="text-right">
            <p className={`text-xs font-bold ${outOfStock ? 'text-red-500' : 'text-green-400'}`}>
              {outOfStock ? 'Unavailable' : `${vehicle.quantity} units`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onPurchase(vehicle)}
          disabled={outOfStock || purchasing === vehicle.id}
          className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-all
            ${outOfStock
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 active:scale-95'
            }`}
        >
          {purchasing === vehicle.id ? 'Processing...' : outOfStock ? 'Out of Stock' : 'Purchase Now'}
        </button>
      </div>
    </div>
  );
}
