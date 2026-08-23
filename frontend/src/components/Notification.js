import React, { useEffect } from 'react';

export default function Notification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: 'bg-zinc-900 border-green-500/50 text-green-400',
    error:   'bg-zinc-900 border-red-500/50 text-red-400',
    info:    'bg-zinc-900 border-blue-500/50 text-blue-400',
  };
  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl shadow-black/50 ${styles[type]}`}>
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="text-sm font-medium text-zinc-200">{message}</span>
      <button onClick={onClose} className="ml-2 text-zinc-600 hover:text-zinc-400 text-lg leading-none">×</button>
    </div>
  );
}
