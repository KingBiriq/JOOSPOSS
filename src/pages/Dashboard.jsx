import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  PackageX, 
  PlusCircle, 
  ShoppingCart, 
  ArrowUpRight, 
  Package, 
  AlertCircle,
  Receipt,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from 'recharts';

export default function Dashboard() {
  const { sales, products } = useApp();
  const navigate = useNavigate();

  const totalSales = sales.reduce((a, s) => a + s.total, 0);
  const totalProfit = sales.reduce((a, s) => a + s.profit, 0);
  const lowStockItems = products.filter(p => p.stock <= p.min);

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+14.5%',
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      title: 'Total Sales Orders',
      value: sales.length,
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'from-indigo-500/20 to-blue-500/10 text-indigo-400 border-indigo-500/30',
      iconBg: 'bg-indigo-500/20 text-indigo-400'
    },
    {
      title: 'Estimated Profit',
      value: `$${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+18.9%',
      icon: TrendingUp,
      color: 'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/30',
      iconBg: 'bg-violet-500/20 text-violet-400'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.length,
      change: lowStockItems.length > 0 ? 'Requires Action' : 'All Stock OK',
      icon: PackageX,
      color: lowStockItems.length > 0 ? 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30' : 'from-slate-800 to-slate-900 text-slate-400 border-slate-700',
      iconBg: lowStockItems.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'
    }
  ];

  const chartData = products.map(p => ({
    name: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
    stock: p.stock,
    min: p.min
  }));

  return (
    <div className="space-y-8">
      {/* Top Banner / Quick Action Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-slate-900/60 to-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
            🚀 Performance Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Business Control Center</h1>
          <p className="text-sm text-slate-300 mt-1">Real-time inventory levels, cash flow analytics & sales summary</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/pos')}
            className="btn-primary py-3 px-5 rounded-2xl text-sm font-bold flex items-center gap-2.5"
          >
            <ShoppingCart size={18} />
            <span>Launch POS</span>
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Package size={18} />
            <span>Manage Inventory</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div 
              key={i} 
              className={`glass-card p-6 rounded-3xl border bg-gradient-to-br ${card.color} flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{card.title}</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{card.value}</h3>
                </div>
                <div className={`p-3.5 rounded-2xl ${card.iconBg} shadow-lg`}>
                  <Icon size={24} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <ArrowUpRight size={14} className="text-emerald-400" /> {card.change}
                </span>
                <span className="text-slate-500 font-medium">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Charts & Stock Alerts */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Recharts Stock Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">Inventory Stock Status</h3>
              <p className="text-xs text-slate-400">Current available quantities across products</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Stock Count
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Bar dataKey="stock" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.stock <= entry.min ? '#f43f5e' : '#6366f1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alert Panel */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-rose-400" size={20} />
                <h3 className="text-lg font-extrabold text-white">Stock Warnings</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                {lowStockItems.length} Low
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Package size={40} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-sm font-semibold">All products have sufficient stock!</p>
                </div>
              ) : (
                lowStockItems.map(item => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-400 font-black text-xs block">
                        {item.stock} left
                      </span>
                      <span className="text-[10px] text-slate-500">Min: {item.min}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate('/products')}
            className="w-full mt-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Update Product Quantities</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
