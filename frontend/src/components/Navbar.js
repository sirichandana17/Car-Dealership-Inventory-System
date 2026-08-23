import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const active = (path) => location.pathname === path
    ? 'text-red-500 font-semibold'
    : 'text-zinc-400 hover:text-white transition';

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/login'}
            className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">AUTO<span className="text-red-500">DEALER</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className={active('/dashboard')}>Showroom</Link>
                {isAdmin && <Link to="/admin" className={active('/admin')}>Admin Panel</Link>}
                <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Signed in as</p>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                  </div>
                  {isAdmin && (
                    <span className="bg-red-600/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-md border border-red-600/30">
                      ADMIN
                    </span>
                  )}
                  <button onClick={handleLogout}
                    className="ml-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-1.5 rounded-lg text-sm font-medium transition">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={active('/login')}>Sign In</Link>
                <Link to="/register"
                  className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow-lg shadow-red-900/30">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-zinc-300 hover:text-white px-2" onClick={() => setMenuOpen(false)}>Showroom</Link>
                {isAdmin && <Link to="/admin" className="text-zinc-300 hover:text-white px-2" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                <div className="px-2 pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-2">{user.name} {isAdmin && '· Admin'}</p>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Sign Out</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-zinc-300 hover:text-white px-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="text-zinc-300 hover:text-white px-2" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
