import React, { useMemo } from 'react';
import { formatINR, formatUSD } from '../utils/price';

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat',
];

const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

export default function PurchaseConfirm({ vehicle, onClose }) {
  const orderNumber = useMemo(() => `AD-${Date.now().toString().slice(-8)}`, []);
  const city        = useMemo(() => CITIES[Math.floor(Math.random() * CITIES.length)], []);
  const days        = useMemo(() => Math.floor(Math.random() * 5) + 3, []); // 3–7 days
  const deliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }, [days]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Green success header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white">Purchase Confirmed!</h2>
          <p className="text-green-100 text-sm mt-1">Your order has been placed successfully</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Vehicle */}
          <div className="flex items-center gap-4 bg-zinc-800 rounded-xl p-4 border border-zinc-700">
            <img
              src={vehicle.image_url || FALLBACK}
              alt={vehicle.model}
              className="w-20 h-14 object-cover rounded-lg border border-zinc-700 flex-shrink-0"
              onError={(e) => { e.target.src = FALLBACK; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold truncate">{vehicle.make} {vehicle.model}</p>
              <p className="text-zinc-500 text-xs">{vehicle.year} · {vehicle.category}</p>
              <p className="text-white font-black mt-1">{formatINR(vehicle.price)}</p>
              <p className="text-zinc-600 text-xs">{formatUSD(vehicle.price)}</p>
            </div>
          </div>

          {/* Order details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2.5 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Order Number</span>
              <span className="text-white font-mono font-bold text-sm">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Payment Method</span>
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg">
                Pay at Delivery
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Nearest Showroom</span>
              <span className="text-white font-semibold text-sm">📍 {city}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-zinc-800">
              <span className="text-zinc-500 text-sm">Estimated Delivery</span>
              <span className="text-white font-semibold text-sm text-right">{days} business days</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-zinc-500 text-sm">Delivery Date</span>
              <span className="text-zinc-300 text-xs text-right">{deliveryDate}</span>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4">
            <p className="text-zinc-400 text-xs leading-relaxed">
              💳 <span className="text-zinc-300 font-semibold">Pay at Delivery</span> — Full payment is due when you collect your vehicle at the {city} showroom. Our team will contact you within 24 hours to confirm your appointment.
            </p>
          </div>

          <button onClick={onClose} className="btn-primary w-full">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
