import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Store, LockKeyhole, ShieldCheck, Key, UserCheck, AlertCircle } from 'lucide-react';
import { users } from '../data/seed';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('owner@joospos.com');
  const [password, setPassword] = useState('Admin@123');
  const [pin, setPin] = useState('1234');
  const [err, setErr] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password, pin);
    if (!success) {
      setErr('Fadlan hubi Email, Password ama PIN (Invalid Credentials)');
    }
  };

  const selectDemoUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setPin(user.pin);
    setErr('');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans grid place-items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white grid place-items-center mx-auto shadow-xl shadow-indigo-500/40 mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">JOOS POS</h1>
          <p className="text-xs text-indigo-300 font-medium mt-1">Smart Point of Sale & Business Management</p>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Accounts
          </label>
          <div className="grid grid-cols-3 gap-2">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => selectDemoUser(u)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  email === u.email
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-md'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {u.role}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input p-3.5 rounded-2xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input p-3.5 rounded-2xl text-xs font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Security PIN (4-Digits)</label>
            <input
              type="text"
              required
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full glass-input p-3.5 rounded-2xl text-xs font-mono font-bold tracking-widest text-center"
            />
          </div>

          {err && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{err}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            <LockKeyhole size={18} />
            <span>Sign In to System</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500">
            Powered by JOOS POS • Version 2.0 LTS
          </p>
        </div>
      </div>
    </div>
  );
}
