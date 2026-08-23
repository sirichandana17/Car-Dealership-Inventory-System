import React from 'react';

const CATEGORIES = ['', 'Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Truck', 'Van'];

export default function SearchFilters({ filters, onChange, onReset }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  const activeCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="text-zinc-400 text-sm font-semibold">Filter Vehicles</span>
          {activeCount > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-zinc-500 hover:text-red-400 transition font-medium">
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Make */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Brand / Make
          </label>
          <input
            name="make" value={filters.make} onChange={handle}
            type="text" placeholder="e.g. BMW, Toyota..."
            className="input-field text-sm py-2.5"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Model
          </label>
          <input
            name="model" value={filters.model} onChange={handle}
            type="text" placeholder="e.g. M4, Supra..."
            className="input-field text-sm py-2.5"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Body Type
          </label>
          <select
            name="category" value={filters.category} onChange={handle}
            className="input-field text-sm py-2.5"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === '' ? 'All Types' : c}</option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Min Price (₹)
          </label>
          <input
            name="minPrice" value={filters.minPrice} onChange={handle}
            type="number" min="0" placeholder="e.g. 5000000"
            className="input-field text-sm py-2.5"
            onWheel={(e) => e.target.blur()}
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium">
            Max Price (₹)
          </label>
          <input
            name="maxPrice" value={filters.maxPrice} onChange={handle}
            type="number" min="0" placeholder="e.g. 20000000"
            className="input-field text-sm py-2.5"
            onWheel={(e) => e.target.blur()}
          />
        </div>
      </div>

      {/* Active filter tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800">
          {Object.entries(filters).filter(([, v]) => v !== '').map(([key, val]) => (
            <span key={key}
              className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full">
              <span className="text-zinc-500 capitalize">
                {key === 'minPrice' ? 'Min ₹' : key === 'maxPrice' ? 'Max ₹' : key}:
              </span>
              {key === 'minPrice' || key === 'maxPrice'
                ? `₹${Number(val).toLocaleString('en-IN')}`
                : val}
              <button
                onClick={() => onChange({ ...filters, [key]: '' })}
                className="text-zinc-500 hover:text-red-400 transition ml-0.5">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
