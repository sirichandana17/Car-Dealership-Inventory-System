import React from 'react';

export default function PurchaseConfirm({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-confirmation-title"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 shadow-2xl text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute top-4 right-4 w-9 h-9 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          ×
        </button>
        <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 id="purchase-confirmation-title" className="text-2xl font-black text-white">Purchase Confirmed</h2>
        <p className="text-zinc-300 mt-4 leading-relaxed">
          Pay at delivery. We will contact you through email and phone number.
        </p>
      </div>
    </div>
  );
}
