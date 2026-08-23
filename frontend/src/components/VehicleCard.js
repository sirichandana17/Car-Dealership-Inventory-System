import React from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

export default function VehicleCard({ vehicle, onPurchase, purchasing }) {
  const outOfStock = Number(vehicle.quantity) === 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-800">
        <img
          src={vehicle.image_url || FALLBACK}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-700">
          {vehicle.category}
        </span>
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            SOLD OUT
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-white leading-tight">
            {vehicle.make} <span className="text-zinc-400">{vehicle.model}</span>
          </h3>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-2xl font-black text-white">
              ${Number(vehicle.price).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-0.5">Stock</p>
            <p className={`text-sm font-bold ${outOfStock ? 'text-red-500' : 'text-green-400'}`}>
              {outOfStock ? 'Unavailable' : `${vehicle.quantity} units`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onPurchase(vehicle)}
          disabled={outOfStock || purchasing === vehicle.id}
          className={`mt-4 w-full py-3 rounded-xl text-sm font-bold transition-all
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
