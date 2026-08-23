import React from 'react';

export default function SearchFilters({ filters, onChange, onReset }) {
  const handle = (e) => onChange({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { name: 'make',     placeholder: 'Make',      type: 'text'   },
          { name: 'model',    placeholder: 'Model',     type: 'text'   },
          { name: 'category', placeholder: 'Category',  type: 'text'   },
          { name: 'minPrice', placeholder: 'Min Price', type: 'number' },
          { name: 'maxPrice', placeholder: 'Max Price', type: 'number' },
        ].map(f => (
          <input key={f.name} name={f.name} value={filters[f.name]}
            onChange={handle} type={f.type} placeholder={f.placeholder}
            className="input-field text-xs py-2.5"
          />
        ))}
        <button onClick={onReset}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition">
          Clear
        </button>
      </div>
    </div>
  );
}
