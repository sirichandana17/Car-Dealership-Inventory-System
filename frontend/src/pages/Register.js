import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function getPasswordStrength(pw) {
  const checks = {
    length:    pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number:    /\d/.test(pw),
    special:   /[!@#$%^&*()_+\-={}|:;<>?,./]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, passed };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const { checks, passed } = getPasswordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'][passed];
  const strengthColor = ['', 'bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][passed];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email || !form.password || !form.confirm)
      return setError('All fields are required.');
    if (!EMAIL_RE.test(form.email))
      return setError('Enter a valid email address (e.g. user@example.com).');
    if (passed < 5)
      return setError('Password must include uppercase, lowercase, number and special character.');
    if (form.password !== form.confirm)
      return setError('Passwords do not match.');
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
          alt="car" className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-16">
          <div className="w-12 h-1 bg-red-500 mb-6 rounded-full" />
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Join the<br /><span className="text-red-500">Elite</span><br />Showroom.
          </h1>
          <p className="text-zinc-400 text-lg max-w-sm">
            Create your account and get access to our exclusive vehicle inventory.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 overflow-y-auto">
        <div className="max-w-sm mx-auto w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/50">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white">AUTO<span className="text-red-500">DEALER</span></span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-1">Create account</h2>
          <p className="text-zinc-500 text-sm mb-8">Join AutoDealer today</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" value={form.name} onChange={handle}
                className="input-field" placeholder="John Smith" autoFocus />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                className="input-field" placeholder="you@example.com" />
              {form.email && !EMAIL_RE.test(form.email) && (
                <p className="text-red-400 text-xs mt-1">Enter a valid email like user@example.com</p>
              )}
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle}
                className="input-field" placeholder="Min. 8 characters" />
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passed ? strengthColor : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-semibold ${passed <= 2 ? 'text-red-400' : passed === 3 ? 'text-yellow-400' : passed === 4 ? 'text-blue-400' : 'text-green-400'}`}>
                      {strengthLabel}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {[
                      [checks.length,    '8+ characters'],
                      [checks.uppercase, 'Uppercase (A-Z)'],
                      [checks.lowercase, 'Lowercase (a-z)'],
                      [checks.number,    'Number (0-9)'],
                      [checks.special,   'Special char (!@#...)'],
                    ].map(([ok, label]) => (
                      <p key={label} className={`text-xs flex items-center gap-1 ${ok ? 'text-green-400' : 'text-zinc-600'}`}>
                        <span>{ok ? '✓' : '○'}</span>{label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handle}
                className="input-field" placeholder="Repeat password" />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-500 font-medium hover:text-red-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
