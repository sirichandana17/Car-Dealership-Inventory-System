import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('All fields are required.');
    if (!EMAIL_RE.test(form.email)) return setError('Enter a valid email address.');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => setForm({ email: 'admin@autodealer.com', password: 'Admin@1234' });

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80"
          alt="car" className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <div className="w-12 h-1 bg-red-500 mb-6 rounded-full" />
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Premium<br />Vehicles.<br /><span className="text-red-500">Delivered.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-sm">
            Browse our exclusive collection of luxury and performance vehicles.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white">AUTO<span className="text-red-500">DEALER</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-zinc-500 text-sm mb-8">Sign in to your account</p>

          {registered && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
              ✓ Account created! Sign in below.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                className="input-field" placeholder="you@example.com" autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Admin quick-fill */}
          <div className="mt-6 p-4 bg-zinc-900 border border-zinc-700 rounded-xl">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Demo Admin Access</p>
            <div className="text-xs text-zinc-500 space-y-1 mb-3">
              <p>Email: <span className="text-zinc-300 font-mono">admin@autodealer.com</span></p>
              <p>Password: <span className="text-zinc-300 font-mono">Admin@1234</span></p>
            </div>
            <button onClick={fillAdmin}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 px-3 py-1.5 rounded-lg transition w-full">
              Fill Admin Credentials
            </button>
          </div>

          <p className="text-center text-sm text-zinc-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-500 font-medium hover:text-red-400">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
