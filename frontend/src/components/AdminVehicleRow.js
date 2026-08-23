import React, { useState } from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=60';

export default function AdminVehicleRow({ vehicle, onEdit, onDelete, onRestock }) {
  const [restockAmt, setRestockAmt] = useState('');
  const [showRestock, setShowRestock] = useState(false);

  const handleRestock = () => {
    if (!restockAmt || Number(restockAmt) <= 0) return;
    onRestock(vehicle.id, Number(restockAmt));
    setRestockAmt('');
    setShowRestock(false);
  };

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
      <td className="px-4 py-3">
        <img src={vehicle.image_url || FALLBACK} alt={vehicle.make}
          className="w-16 h-10 object-cover rounded-lg border border-zinc-700"
          onError={(e) => { e.target.src = FALLBACK; }} />
      </td>
      <td className="px-4 py-3 font-semibold text-white">{vehicle.make}</td>
      <td className="px-4 py-3 text-zinc-400">{vehicle.model}</td>
      <td className="px-4 py-3">
        <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-lg border border-zinc-700">
          {vehicle.category}
        </span>
      </td>
      <td className="px-4 py-3 font-bold text-white">${Number(vehicle.price).toLocaleString()}</td>
      <td className="px-4 py-3">
        <span className={`font-bold text-sm ${vehicle.quantity === 0 ? 'text-red-500' : 'text-green-400'}`}>
          {vehicle.quantity}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => onEdit(vehicle)}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition">
            Edit
          </button>
          <button onClick={() => onDelete(vehicle.id)}
            className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition">
            Delete
          </button>
          {showRestock ? (
            <div className="flex items-center gap-1">
              <input type="number" min="1" value={restockAmt}
                onChange={(e) => setRestockAmt(e.target.value)}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white"
                placeholder="Qty" />
              <button onClick={handleRestock}
                className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1.5 rounded-lg transition">✓</button>
              <button onClick={() => setShowRestock(false)}
                className="text-xs text-zinc-600 hover:text-zinc-400 px-1">✕</button>
            </div>
          ) : (
            <button onClick={() => setShowRestock(true)}
              className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition">
              Restock
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
