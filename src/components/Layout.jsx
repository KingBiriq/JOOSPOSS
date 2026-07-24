import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Truck, 
  ReceiptText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Store,
  Menu,
  X,
  Bell,
  Clock,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const allLinks = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/pos', label: 'POS Terminal', icon: ShoppingCart, highlight: true },
  { path: '/products', label: 'Products & Inventory', icon: Package },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/suppliers', label: 'Suppliers', icon: Truck },
  { path: '/resellers', label: 'Resellers & Wakiilada', icon: UserCheck },
  { path: '/expenses', label: 'Expenses', icon: ReceiptText },
  { path: '/reports', label: 'Analytics & Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, logout, products } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lowStockModalOpen, setLowStockModalOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isOwner = user?.role === 'Milkiile' || user?.role === 'Owner';
  const lowStockCount = products ? products.filter(p => p.stock <= p.min).length : 0;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter navigation links strictly based on role
  const navItems = isOwner 
    ? allLinks 
    : allLinks.filter(item => ['/pos', '/customers'].includes(item.path));

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-800/80 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Logo & Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 grid place-items-center shadow-lg shadow-indigo-500/30 text-white font-black text-xl">
                <Store size={26} />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                  JOOS <span className="text-indigo-400">POS</span>
                </h1>
                <p className="text-xs text-indigo-300/80 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isOwner ? 'Milkiile Access' : 'POS Cashier Mode'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick POS Action CTA */}
          <div className="mb-6">
            <button 
              onClick={() => { navigate('/pos'); setMobileOpen(false); }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-white font-bold flex items-center justify-between shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-white/20">
                  <ShoppingCart size={18} />
                </div>
                <span className="text-sm tracking-wide">POS Terminal</span>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            <div className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {isOwner ? 'Milkiilaha Menu' : 'Shaqaalaha Menu'}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    relative flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-600/10' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}
                  `}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'} />
                    <span>{item.label}</span>
                  </div>

                  {item.path === '/products' && lowStockCount > 0 && isOwner && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {lowStockCount} alert
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500 shadow-glow" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 mt-auto border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold grid place-items-center shadow-md">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-slate-100 truncate">{user?.name || 'User'}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs text-indigo-300 font-medium">{user?.role || 'Staff'}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 px-4 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20 text-sm font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={18} />
            <span>Ka Bax (Log Out)</span>
          </button>
        </div>
      </aside>

      {/* Main App Workspace */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                Soo dhawoow, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isOwner ? 'Milkiilaha Nidaamka JOOS POS' : 'Terminal-ka Iibinta (Cashier Mode)'}
              </p>
            </div>
          </div>

          {/* Right Header Widget bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Low Stock Alert Bell Button */}
            {lowStockCount > 0 && (
              <button
                onClick={() => setLowStockModalOpen(true)}
                className="relative p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
                title={`${lowStockCount} items below minimum stock`}
              >
                <Bell size={18} className="animate-bounce" />
                <span className="text-xs font-bold hidden sm:inline">{lowStockCount} Low Stock</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] grid place-items-center">
                  {lowStockCount}
                </span>
              </button>
            )}

            {/* Live Clock Widget */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs font-semibold text-slate-300">
              <Clock size={15} className="text-indigo-400" />
              <span>{timeStr}</span>
            </div>

            {/* Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="hidden sm:inline">System</span> Online
            </div>
          </div>
        </header>

        {/* Low Stock Notification Modal */}
        {lowStockModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
            <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-rose-500/40 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-rose-400">
                  <Bell size={20} />
                  <h3 className="font-extrabold text-lg text-white">Alaabta Sigaarka ah ee Dhamaanaya</h3>
                </div>
                <button onClick={() => setLowStockModalOpen(false)} className="text-slate-400"><X size={20} /></button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto scrollbar">
                {products.filter(p => p.stock <= p.min).map(p => (
                  <div key={p.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{p.name}</span>
                      <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku} | Qeybiyaha: {p.supplier || 'N/A'}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-black text-xs border border-rose-500/30">
                      {p.stock === 0 ? 'Dhammaaday' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-800/90 py-2 px-3 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-400 animate-pulse' : ''} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
