import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Package, 
  Users, 
  Truck, 
  ReceiptText, 
  BarChart3, 
  Settings as SettingsIcon,
  X,
  Phone,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Printer,
  Image as ImageIcon
} from 'lucide-react';

const Box = ({ title, description, children, action }) => (
  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

// Products Table Component
export function Products() {
  const { products, setProducts, suppliers } = useApp();
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '', category: 'Cunto', supplier: 'Hodan Wholesale Group', buy: '', sell: '', stock: '', min: '5', image: ''
  });

  // Open modal to add product
  const handleOpenAdd = () => {
    setForm({ 
      name: '', 
      category: 'Cunto', 
      supplier: suppliers[0]?.name || 'Hodan Wholesale Group', 
      buy: '', 
      sell: '', 
      stock: '', 
      min: '5', 
      image: '' 
    });
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category || 'Cunto',
      supplier: p.supplier || suppliers[0]?.name || 'Hodan Wholesale Group',
      buy: String(p.buy),
      sell: String(p.sell),
      stock: String(p.stock),
      min: String(p.min || 5),
      image: p.image || ''
    });
    setEditingProduct(p);
    setModalOpen(true);
  };

  // Delete product
  const handleDelete = (id, name) => {
    if (window.confirm(`Ma hubtaa inaad tirto alaabta: "${name}"?`)) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('pos_products', JSON.stringify(updated));
    }
  };

  // Submit Add / Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.sell) return;

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: form.name,
            category: form.category,
            supplier: form.supplier,
            buy: Number(form.buy) || 0,
            sell: Number(form.sell) || 0,
            stock: Number(form.stock) || 0,
            min: Number(form.min) || 5,
            image: form.image
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem('pos_products', JSON.stringify(updatedProducts));
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        name: form.name,
        sku: 'BRQ-' + String(Math.floor(1000 + Math.random() * 9000)),
        category: form.category,
        supplier: form.supplier,
        buy: Number(form.buy) || 0,
        sell: Number(form.sell) || 0,
        stock: Number(form.stock) || 0,
        min: Number(form.min) || 5,
        image: form.image
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('pos_products', JSON.stringify(updatedProducts));
    }

    setModalOpen(false);
    setEditingProduct(null);
  };

  const filtered = products.filter(p => (p.name + p.sku + (p.category || '') + (p.supplier || '')).toLowerCase().includes(q.toLowerCase()));

  return (
    <Box 
      title="Products & Inventory Management" 
      description="Track stock levels, buying cost, selling prices, supplier info and edit/delete items"
      action={
        <button 
          onClick={handleOpenAdd}
          className="btn-primary py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Ku Dar Alaab Cusub</span>
        </button>
      }
    >
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-3 text-slate-400" size={18} />
        <input 
          placeholder="Raadi alaabta magaca, SKU ama qeybiyaha..." 
          value={q} 
          onChange={e => setQ(e.target.value)}
          className="w-full glass-input py-2.5 pl-11 pr-4 rounded-2xl text-xs"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Sawirka & Alaabta</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Qeybiyaha (Supplier)</th>
              <th className="p-4">Qeybta</th>
              <th className="p-4">Qiimaha Iibsi</th>
              <th className="p-4">Qiimaha Iibka</th>
              <th className="p-4">Tirada (Stock)</th>
              <th className="p-4">Xaaladda</th>
              <th className="p-4 text-center">Tallaabada (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden grid place-items-center flex-shrink-0">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
                    ) : (
                      <Package size={18} className="text-indigo-400" />
                    )}
                  </div>
                  <span>{p.name}</span>
                </td>
                <td className="p-4 font-mono text-slate-400">{p.sku}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">
                    {p.supplier || 'Hodan Wholesale Group'}
                  </span>
                </td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300">{p.category}</span></td>
                <td className="p-4 text-slate-400">${Number(p.buy).toFixed(2)}</td>
                <td className="p-4 font-bold text-indigo-400">${Number(p.sell).toFixed(2)}</td>
                <td className="p-4 font-bold">{p.stock}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    p.stock <= p.min 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {p.stock <= p.min ? 'Low Stock' : 'Active'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleOpenEdit(p)}
                      title="Edit Product"
                      className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Delete Product"
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handleSubmit} className="glass-panel max-w-md w-full p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">
                {editingProduct ? 'Wax Ka Beddel Alaabta (Edit)' : 'Ku Dar Alaab Cusub (Add)'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Magaca Alaabta (Product Name)</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Saliid Macsaro 1L" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Qeybiyaha / Shirkada (Supplier)</label>
              <select value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs">
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.company || s.name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Link-iga Sawirka (Image URL)</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 text-slate-500" size={16} />
                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full glass-input py-2.5 pl-9 pr-3 rounded-xl text-xs" placeholder="https://example.com/image.jpg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Qeybta (Category)</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs">
                  <option>Cunto</option>
                  <option>Cabitaan</option>
                  <option>Elektaroonik</option>
                  <option>Qalabka Xafiiska</option>
                  <option>Guud</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Tirada (Stock)</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Qiimaha Iibsi ($)</label>
                <input type="number" step="0.01" value={form.buy} onChange={e => setForm({...form, buy: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Qiimaha Iibka ($)</label>
                <input required type="number" step="0.01" value={form.sell} onChange={e => setForm({...form, sell: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3.5 rounded-xl font-bold text-xs mt-2">
              {editingProduct ? 'Kaydi Wax ka beddelka (Save Edit)' : 'Save Product'}
            </button>
          </form>
        </div>
      )}
    </Box>
  );
}

// Customers & Debt Management Component
export function Customers() {
  const { customers, setCustomers, sales, payCustomerDebt } = useApp();
  const [q, setQ] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'debtors', 'clean'
  const [modalOpen, setModalOpen] = useState(false);
  const [debtModalOpen, setDebtModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', initialDebt: '0' });

  // Add new customer
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setCustomers([
      ...customers, 
      { 
        id: Date.now(), 
        name: form.name, 
        phone: form.phone || 'N/A', 
        points: 0, 
        balance: Number(form.initialDebt) || 0 
      }
    ]);
    setForm({ name: '', phone: '', initialDebt: '0' });
    setModalOpen(false);
  };

  // Open Debt Repayment Modal
  const handleOpenPayDebt = (c) => {
    setSelectedCustomer(c);
    setPayAmount(String(c.balance || ''));
    setDebtModalOpen(true);
  };

  // Open Purchase History Modal
  const handleOpenHistory = (c) => {
    setSelectedCustomer(c);
    setHistoryModalOpen(true);
  };

  // Submit Debt Repayment
  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !payAmount) return;
    const success = payCustomerDebt(selectedCustomer.id, payAmount);
    if (success) {
      setDebtModalOpen(false);
      setSelectedCustomer(null);
      setPayAmount('');
    }
  };

  const totalDebt = customers.reduce((acc, c) => acc + (c.balance || 0), 0);
  const debtorsCount = customers.filter(c => (c.balance || 0) > 0).length;

  // Filter customers by Search + Tab
  const filtered = customers.filter(c => {
    const matchesSearch = (c.name + c.phone).toLowerCase().includes(q.toLowerCase());
    const hasDebt = (c.balance || 0) > 0;

    if (!matchesSearch) return false;
    if (filterTab === 'debtors') return hasDebt;
    if (filterTab === 'clean') return !hasDebt;
    return true;
  });

  // Calculate customer order history
  const getCustomerSales = (customerName) => {
    return sales.filter(s => s.customer === customerName);
  };

  return (
    <Box 
      title="Maamulka Macaamiisha & Taariikhda Iibsiga (Customer & Purchase History)" 
      description="Eeg macaamiisha daynta lagu leeyahay ama bilaashka ah, taariikhda mar kasta oo uu adeegtay, iyo bixinta daymaha"
      action={
        <button onClick={() => setModalOpen(true)} className="btn-primary py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} />
          <span>Ku Dar Macmiil Cusub</span>
        </button>
      }
    >
      {/* Top Debt Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Warta Daynta Lagu Leeyahay</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">${totalDebt.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 grid place-items-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Macaamiisha Daynta Ku Taalo</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{debtorsCount} Macmiil</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 grid place-items-center">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tirada Macaamiisha Guud</p>
            <h3 className="text-2xl font-black text-indigo-400 mt-1">{customers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 grid place-items-center">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            placeholder="Raadi macmiilka magaca ama taleefanka..." 
            value={q} 
            onChange={e => setQ(e.target.value)}
            className="w-full glass-input py-2.5 pl-11 pr-4 rounded-2xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Dhammaan' },
            { id: 'debtors', label: 'Kuwa Daynta Ku Taalo' },
            { id: 'clean', label: 'Kuwa Safiya (Bilaash)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Magaca Macmiilka</th>
              <th className="p-4">Taleefanka</th>
              <th className="p-4">Mararka Uu Adeegtay</th>
              <th className="p-4">Daynta Lagu Leeyahay</th>
              <th className="p-4">Xaaladda (Status)</th>
              <th className="p-4 text-center">Taariikhda & Tallaabada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map(c => {
              const hasDebt = (c.balance || 0) > 0;
              const customerSales = getCustomerSales(c.name);

              return (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 grid place-items-center flex-shrink-0">
                      <Users size={16} />
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{c.phone}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
                      {customerSales.length} Mara
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-sm">
                    <span className={hasDebt ? 'text-rose-400' : 'text-emerald-400'}>
                      ${Number(c.balance || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      hasDebt 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {hasDebt ? `Dayn Ku Taalo ($${c.balance})` : 'Deyn Malaaha (Clear)'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenHistory(c)}
                        className="py-1.5 px-3 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                      >
                        <ReceiptText size={14} />
                        <span>Eeg Taariikhda ({customerSales.length})</span>
                      </button>

                      {hasDebt && (
                        <button 
                          onClick={() => handleOpenPayDebt(c)}
                          className="btn-success py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
                        >
                          <DollarSign size={14} />
                          <span>Bixi Daynta</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handleAdd} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Ku Dar Macmiil Cusub</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Magaca Macmiilka</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Axmed Cali" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Taleefanka</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="061xxxxxxx" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Daynta Hada U Taalo ($)</label>
              <input type="number" step="0.01" value={form.initialDebt} onChange={e => setForm({...form, initialDebt: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
            </div>
            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-xs">Kaydi Macmiilka</button>
          </form>
        </div>
      )}

      {/* Repay Debt Modal */}
      {debtModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handlePaySubmit} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-emerald-500/40 space-y-4 shadow-2xl animate-pulse-glow">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <DollarSign size={20} />
                <h3 className="font-extrabold text-lg text-white">Bixinta Daynta Macmiilka</h3>
              </div>
              <button type="button" onClick={() => setDebtModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Macmiilka:</span>
                <span className="font-bold text-white">{selectedCustomer.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Daynta Hada Ku Taalo:</span>
                <span className="font-extrabold text-rose-400">${Number(selectedCustomer.balance || 0).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lacagta La Bixinayo ($)</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                max={selectedCustomer.balance}
                value={payAmount} 
                onChange={e => setPayAmount(e.target.value)} 
                className="w-full glass-input p-3.5 rounded-xl text-base font-black text-emerald-400" 
                placeholder="0.00" 
              />
            </div>

            <button type="submit" className="w-full btn-success py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg">
              Xeebeey & Bixi Lacagta (${payAmount || '0.00'})
            </button>
          </form>
        </div>
      )}

      {/* Customer Purchase History Modal */}
      {historyModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <div className="glass-panel max-w-xl w-full p-6 rounded-3xl border border-indigo-500/30 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto scrollbar">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-black text-lg text-white">Taariikhda Adeegga Macmiilka</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCustomer.name} | Tel: {selectedCustomer.phone}</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Customer Summary Cards */}
            {(() => {
              const cSales = getCustomerSales(selectedCustomer.name);
              const totalSpent = cSales.reduce((acc, s) => acc + s.total, 0);

              return (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Mararka Uu Adeegtay</p>
                      <p className="text-lg font-black text-indigo-400 mt-0.5">{cSales.length} Mara</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Warta Lacagta Uu Iibsaday</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">${totalSpent.toFixed(2)}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Daynta Hada U Taalo</p>
                      <p className="text-lg font-black text-rose-400 mt-0.5">${Number(selectedCustomer.balance || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Invoice History List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Invoices & Waxa Uu Iibsaday:</h4>

                    {cSales.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Macmiilkan wali iibsi toos ah laguma diiwaangelin nidaamka.
                      </div>
                    ) : (
                      cSales.map((s) => {
                        // Generate WhatsApp message content
                        const waText = `*JOOS POS STORE - RISIIDKA IIBKA* 📄\n` +
                          `Invoice: *${s.id}*\n` +
                          `Taariikhda: ${new Date(s.date).toLocaleDateString()}\n` +
                          `Macmiilka: ${s.customer}\n` +
                          `Warta Total: *$${s.total.toFixed(2)}*\n` +
                          `Payment: *${s.payment}*\n` +
                          `Iibiyaha: ${s.seller}\n` +
                          `Mahadsanid!`;
                        
                        const rawPhone = (selectedCustomer.phone || '').replace(/\D/g, '');
                        const formattedPhone = rawPhone.startsWith('252') ? rawPhone : `252${rawPhone.replace(/^0+/, '')}`;
                        const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(waText)}`;

                        return (
                          <div key={s.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono text-indigo-400">{s.id}</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                                  {s.payment}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">{new Date(s.date).toLocaleString()}</span>
                              <span className="font-black text-sm text-emerald-400">${s.total.toFixed(2)}</span>
                            </div>

                            {/* Items Breakdown */}
                            <div className="space-y-1 py-1 text-[11px] border-b border-slate-800/60">
                              {s.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-slate-300">
                                  <span>{item.qty}x {item.name}</span>
                                  <span className="font-semibold text-slate-400">${(item.sell * item.qty).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Actions: Print Receipt & WhatsApp Share */}
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1.5 px-3 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1.5"
                              >
                                <span>📱 Share WhatsApp</span>
                              </a>
                              <button
                                onClick={() => {
                                  // Open print receipt modal
                                  const win = window.open('', '_blank');
                                  win.document.write(`
                                    <html>
                                      <head>
                                        <title>Receipt ${s.id}</title>
                                        <style>
                                          body { font-family: monospace; padding: 20px; text-align: center; max-width: 300px; margin: auto; }
                                          h3 { margin-bottom: 2px; }
                                          .line { border-bottom: 1px dashed #000; margin: 10px 0; }
                                          .row { display: flex; justify-content: space-between; font-size: 12px; }
                                        </style>
                                      </head>
                                      <body>
                                        <h3>JOOS POS STORE</h3>
                                        <p style="font-size:10px;">Mogadishu, Somalia | Tel: 0615646084</p>
                                        <div class="line"></div>
                                        <div class="row"><span>Invoice:</span><span>${s.id}</span></div>
                                        <div class="row"><span>Customer:</span><span>${s.customer}</span></div>
                                        <div class="row"><span>Date:</span><span>${new Date(s.date).toLocaleDateString()}</span></div>
                                        <div class="row"><span>Payment:</span><span>${s.payment}</span></div>
                                        <div class="line"></div>
                                        ${s.items.map(i => `<div class="row"><span>${i.qty}x ${i.name}</span><span>$${(i.sell * i.qty).toFixed(2)}</span></div>`).join('')}
                                        <div class="line"></div>
                                        <div class="row" style="font-weight:bold; font-size:14px;"><span>TOTAL:</span><span>$${s.total.toFixed(2)}</span></div>
                                        <br/>
                                        <p style="font-size:10px;">Mahadsanid - Thank you!</p>
                                        <script>window.print(); setTimeout(() => window.close(), 500);</script>
                                      </body>
                                    </html>
                                  `);
                                }}
                                className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-[11px] font-bold flex items-center gap-1.5"
                              >
                                <Printer size={13} />
                                <span>Daabac (Print)</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </Box>
  );
}

// Wholesale Suppliers & Payables Management Component (International Standard)
export function Suppliers() {
  const { suppliers, setSuppliers, paySupplierBalance, products } = useApp();
  const [q, setQ] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'debtors', 'clean'
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ name: '', company: '', phone: '', location: '', initialDebt: '0' });

  // Add new supplier
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSuppliers([
      ...suppliers,
      {
        id: Date.now(),
        name: form.name,
        company: form.company || form.name,
        phone: form.phone || 'N/A',
        location: form.location || 'Mogadishu',
        balance: Number(form.initialDebt) || 0
      }
    ]);
    setForm({ name: '', company: '', phone: '', location: '', initialDebt: '0' });
    setModalOpen(false);
  };

  // Open Pay Supplier Debt Modal
  const handleOpenPay = (s) => {
    setSelectedSupplier(s);
    setPayAmount(String(s.balance || ''));
    setPayModalOpen(true);
  };

  // Open Supplied Products Modal
  const handleOpenProducts = (s) => {
    setSelectedSupplier(s);
    setProductsModalOpen(true);
  };

  // Submit Supplier Debt Repayment
  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplier || !payAmount) return;
    const success = paySupplierBalance(selectedSupplier.id, payAmount);
    if (success) {
      setPayModalOpen(false);
      setSelectedSupplier(null);
      setPayAmount('');
    }
  };

  const totalPayables = suppliers.reduce((acc, s) => acc + (s.balance || 0), 0);
  const debtorsCount = suppliers.filter(s => (s.balance || 0) > 0).length;

  // Filter suppliers
  const filtered = suppliers.filter(s => {
    const matchesSearch = (s.name + (s.company || '') + s.phone).toLowerCase().includes(q.toLowerCase());
    const hasDebt = (s.balance || 0) > 0;

    if (!matchesSearch) return false;
    if (filterTab === 'debtors') return hasDebt;
    if (filterTab === 'clean') return !hasDebt;
    return true;
  });

  // Get products supplied by a specific supplier
  const getSuppliedProducts = (supplierName) => {
    return products.filter(p => (p.supplier || 'Hodan Wholesale Group') === supplierName);
  };

  return (
    <Box 
      title="Maamulka Ganacsatada Qeybiyeyaasha (Wholesale Suppliers & Payables)" 
      description="Maamul ganacsatada guud oo aad alaabta ka soo iibsato, eeg alaabada shirkad kasta keenatay iyo daymaha lagu leeyahay"
      action={
        <button onClick={() => setModalOpen(true)} className="btn-primary py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} />
          <span>Ku Dar Qeybiye Cusub</span>
        </button>
      }
    >
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Daynta Lagu Leeyahay Ganacsatada</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">${totalPayables.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 grid place-items-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Ganacsatada Daynta Ku Taalo</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{debtorsCount} Shirkadood</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 grid place-items-center">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tirada Qeybiyeyaasha Guud</p>
            <h3 className="text-2xl font-black text-teal-400 mt-1">{suppliers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 grid place-items-center">
            <Truck size={20} />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            placeholder="Raadi qeybiyaha, shirkada ama taleefanka..." 
            value={q} 
            onChange={e => setQ(e.target.value)}
            className="w-full glass-input py-2.5 pl-11 pr-4 rounded-2xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Dhammaan' },
            { id: 'debtors', label: 'Kuwa Daynta Ku Taalo' },
            { id: 'clean', label: 'Bilaash (Paid)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Qeybiyaha & Shirkada</th>
              <th className="p-4">Taleefanka</th>
              <th className="p-4">Goobta (Location)</th>
              <th className="p-4">Alaabada Uu Keenay</th>
              <th className="p-4">Daynta Lagu Leeyahay (Balance)</th>
              <th className="p-4">Xaaladda (Status)</th>
              <th className="p-4 text-center">Tallaabada (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map(s => {
              const hasDebt = (s.balance || 0) > 0;
              const suppliedProducts = getSuppliedProducts(s.name);

              return (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 grid place-items-center flex-shrink-0">
                      <Truck size={16} />
                    </div>
                    <div>
                      <span>{s.name}</span>
                      {s.company && <p className="text-[10px] text-slate-400 font-medium">{s.company}</p>}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{s.phone}</td>
                  <td className="p-4 text-slate-300">{s.location || 'Mogadishu'}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-teal-300 font-bold">
                      {suppliedProducts.length} Alaabood
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-sm">
                    <span className={hasDebt ? 'text-rose-400' : 'text-emerald-400'}>
                      ${Number(s.balance || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      hasDebt 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {hasDebt ? `Dayn Lagu Leeyahay ($${s.balance})` : 'Bilaash (Fully Paid)'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenProducts(s)}
                        className="py-1.5 px-3 rounded-xl bg-teal-500/10 text-teal-300 hover:bg-teal-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
                      >
                        <Package size={14} />
                        <span>Eeg Alaabada ({suppliedProducts.length})</span>
                      </button>

                      {hasDebt && (
                        <button 
                          onClick={() => handleOpenPay(s)}
                          className="btn-success py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
                        >
                          <DollarSign size={14} />
                          <span>Bixi Daynta</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handleAdd} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-teal-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Ku Dar Qeybiye Cusub</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Magaca Qeybiyaha / Shirkada</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Bakaara Trade Co." />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Taleefanka</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="061xxxxxxx" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Goobta (Address / City)</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="Mogadishu, Somalia" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Daynta Lagu Leeyahay Hada ($)</label>
              <input type="number" step="0.01" value={form.initialDebt} onChange={e => setForm({...form, initialDebt: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
            </div>
            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-xs">Kaydi Qeybiyaha</button>
          </form>
        </div>
      )}

      {/* Pay Supplier Balance Modal */}
      {payModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handlePaySubmit} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-emerald-500/40 space-y-4 shadow-2xl animate-pulse-glow">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <DollarSign size={20} />
                <h3 className="font-extrabold text-lg text-white">Bixinta Daynta Ganacsadaha</h3>
              </div>
              <button type="button" onClick={() => setPayModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Shirkada / Qeybiyaha:</span>
                <span className="font-bold text-white">{selectedSupplier.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Daynta Lagu Leeyahay Hada:</span>
                <span className="font-extrabold text-rose-400">${Number(selectedSupplier.balance || 0).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lacagta La Bixinayo ($)</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                max={selectedSupplier.balance}
                value={payAmount} 
                onChange={e => setPayAmount(e.target.value)} 
                className="w-full glass-input p-3.5 rounded-xl text-base font-black text-emerald-400" 
                placeholder="0.00" 
              />
            </div>

            <button type="submit" className="w-full btn-success py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg">
              Siin & Bixi Daynta Shirkada (${payAmount || '0.00'})
            </button>
          </form>
        </div>
      )}

      {/* Supplied Products Inventory Modal */}
      {productsModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <div className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-teal-500/30 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto scrollbar">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-black text-lg text-white">Alaabta Uu Keenay Qeybiyaha</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSupplier.name} ({selectedSupplier.company || selectedSupplier.name}) | Tel: {selectedSupplier.phone}</p>
              </div>
              <button onClick={() => setProductsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Supplier Product Inventory Breakdown */}
            {(() => {
              const sProducts = getSuppliedProducts(selectedSupplier.name);
              const totalUnits = sProducts.reduce((acc, p) => acc + (p.stock || 0), 0);
              const totalStockValue = sProducts.reduce((acc, p) => acc + (p.buy * (p.stock || 0)), 0);

              return (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Muuqalka Alaabada</p>
                      <p className="text-lg font-black text-teal-400 mt-0.5">{sProducts.length} Nooc</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Warta Stock-ga Hada Yaala</p>
                      <p className="text-lg font-black text-indigo-400 mt-0.5">{totalUnits} Xabo</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Warta Qiimaha Iibsiga ($)</p>
                      <p className="text-lg font-black text-emerald-400 mt-0.5">${totalStockValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Liiska Alaabta Shirkadan Ka Timid:</h4>

                    {sProducts.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Wali alaab toos ah laguma diiwaangelin shirkadan. Waxaad alaab cusub ugu dari kartaa bogga Products-ka!
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="p-3">Alaabta</th>
                              <th className="p-3">SKU</th>
                              <th className="p-3">Qeybta</th>
                              <th className="p-3">Iibsi ($)</th>
                              <th className="p-3">Iibka ($)</th>
                              <th className="p-3">Stock Yaala</th>
                              <th className="p-3">Warta Qiimaha ($)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-medium">
                            {sProducts.map(p => (
                              <tr key={p.id} className="hover:bg-slate-800/40">
                                <td className="p-3 font-bold text-white flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden grid place-items-center flex-shrink-0">
                                    {p.image ? (
                                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Package size={14} className="text-teal-400" />
                                    )}
                                  </div>
                                  <span>{p.name}</span>
                                </td>
                                <td className="p-3 text-slate-400 font-mono text-[11px]">{p.sku}</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]">{p.category}</span></td>
                                <td className="p-3 text-slate-400">${Number(p.buy).toFixed(2)}</td>
                                <td className="p-3 font-bold text-indigo-400">${Number(p.sell).toFixed(2)}</td>
                                <td className="p-3 font-bold text-white">{p.stock}</td>
                                <td className="p-3 font-extrabold text-emerald-400">${(p.buy * p.stock).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </Box>
  );
}

// Resellers & Agent Commission Management Component
export function Resellers() {
  const { resellers, setResellers, payResellerBalance } = useApp();
  const [q, setQ] = useState('');
  const [filterTab, setFilterTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [form, setForm] = useState({ name: '', business: '', phone: '', commissionRate: '5', initialBalance: '0' });

  // Add new reseller
  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    setResellers([
      ...resellers,
      {
        id: Date.now(),
        name: form.name,
        business: form.business || form.name,
        phone: form.phone || 'N/A',
        commissionRate: Number(form.commissionRate) || 5,
        balance: Number(form.initialBalance) || 0,
        totalSales: 0
      }
    ]);
    setForm({ name: '', business: '', phone: '', commissionRate: '5', initialBalance: '0' });
    setModalOpen(false);
  };

  // Open Pay Commission Modal
  const handleOpenPay = (r) => {
    setSelectedReseller(r);
    setPayAmount(String(r.balance || ''));
    setPayModalOpen(true);
  };

  // Submit Commission Payout
  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!selectedReseller || !payAmount) return;
    const success = payResellerBalance(selectedReseller.id, payAmount);
    if (success) {
      setPayModalOpen(false);
      setSelectedReseller(null);
      setPayAmount('');
    }
  };

  const totalResellerBalances = resellers.reduce((acc, r) => acc + (r.balance || 0), 0);
  const activeResellersCount = resellers.length;
  const pendingPayoutsCount = resellers.filter(r => (r.balance || 0) > 0).length;

  const filtered = resellers.filter(r => {
    const matchesSearch = (r.name + (r.business || '') + r.phone).toLowerCase().includes(q.toLowerCase());
    const hasBalance = (r.balance || 0) > 0;

    if (!matchesSearch) return false;
    if (filterTab === 'pending') return hasBalance;
    if (filterTab === 'clean') return !hasBalance;
    return true;
  });

  return (
    <Box 
      title="Maamulka Wakiilada & Resellers-ka (Reseller Commission Management)" 
      description="Create resellers/agents, track commissions earned, total sales generated, and pay reseller balances"
      action={
        <button onClick={() => setModalOpen(true)} className="btn-primary py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} />
          <span>Ku Dar Reseller Cusub</span>
        </button>
      }
    >
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Warta Lacagta Resellers-ka Ku Leeyihiin ($)</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">${totalResellerBalances.toFixed(2)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 grid place-items-center">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Resellers-ka Bixinta Ku Taalo</p>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{pendingPayoutsCount} Wakiil</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 grid place-items-center">
            <Users size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tirada Wakiilada Guud</p>
            <h3 className="text-2xl font-black text-indigo-400 mt-1">{activeResellersCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 grid place-items-center">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            placeholder="Raadi reseller-ka, ganacsiga ama taleefanka..." 
            value={q} 
            onChange={e => setQ(e.target.value)}
            className="w-full glass-input py-2.5 pl-11 pr-4 rounded-2xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Dhammaan' },
            { id: 'pending', label: 'Lacag Ku Leeyahay' },
            { id: 'clean', label: 'Bilaash (Paid)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Reseller / Wakiilka</th>
              <th className="p-4">Taleefanka</th>
              <th className="p-4">Rate (%)</th>
              <th className="p-4">Warta Iibka Uu Keenay</th>
              <th className="p-4">Commission Balance ($)</th>
              <th className="p-4 text-center">Tallaabada (Action)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filtered.map(r => {
              const hasBalance = (r.balance || 0) > 0;

              return (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 grid place-items-center flex-shrink-0 font-black">
                      R
                    </div>
                    <div>
                      <span>{r.name}</span>
                      {r.business && <p className="text-[10px] text-slate-400 font-medium">{r.business}</p>}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{r.phone}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 font-bold">
                      {r.commissionRate || 5}%
                    </span>
                  </td>
                  <td className="p-4 font-bold text-indigo-400">${Number(r.totalSales || 0).toFixed(2)}</td>
                  <td className="p-4 font-extrabold text-sm">
                    <span className={hasBalance ? 'text-amber-400' : 'text-emerald-400'}>
                      ${Number(r.balance || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {hasBalance ? (
                      <button 
                        onClick={() => handleOpenPay(r)}
                        className="btn-success py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto shadow-md"
                      >
                        <DollarSign size={14} />
                        <span>Bixi Commission-ka</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold">Clean</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Reseller Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handleAdd} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-amber-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Ku Dar Reseller Cusub</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Magaca Wakiilka (Reseller Name)</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Cali Wakiil Bakaara" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Magaca Ganacsiga (Business Name)</label>
              <input value={form.business} onChange={e => setForm({...form, business: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Bakaara Agent" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Taleefanka</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="061xxxxxxx" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Commission Rate (%)</label>
                <input type="number" step="0.1" value={form.commissionRate} onChange={e => setForm({...form, commissionRate: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="5" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Balance-ka Hore ($)</label>
                <input type="number" step="0.01" value={form.initialBalance} onChange={e => setForm({...form, initialBalance: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-xs">Kaydi Reseller-ka</button>
          </form>
        </div>
      )}

      {/* Pay Reseller Balance Modal */}
      {payModalOpen && selectedReseller && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handlePaySubmit} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-amber-500/40 space-y-4 shadow-2xl animate-pulse-glow">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <DollarSign size={20} />
                <h3 className="font-extrabold text-lg text-white">Bixinta Commission-ka Reseller</h3>
              </div>
              <button type="button" onClick={() => setPayModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Wakiilka / Reseller:</span>
                <span className="font-bold text-white">{selectedReseller.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Commission Balance:</span>
                <span className="font-extrabold text-amber-400">${Number(selectedReseller.balance || 0).toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lacagta La Bixinayo ($)</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                max={selectedReseller.balance}
                value={payAmount} 
                onChange={e => setPayAmount(e.target.value)} 
                className="w-full glass-input p-3.5 rounded-xl text-base font-black text-amber-400" 
                placeholder="0.00" 
              />
            </div>

            <button type="submit" className="w-full btn-success py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg">
              Bixi Commission-ka Wakiilka (${payAmount || '0.00'})
            </button>
          </form>
        </div>
      )}
    </Box>
  );
}

// Expenses Table Component
export function Expenses() {
  const { expenses, setExpenses } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    setExpenses([{ id: Date.now(), title: form.title, amount: Number(form.amount), date: new Date().toISOString() }, ...expenses]);
    setForm({ title: '', amount: '' });
    setModalOpen(false);
  };

  return (
    <Box 
      title="Store Expenses" 
      description="Track operational overheads, utilities and rent costs"
      action={
        <button onClick={() => setModalOpen(true)} className="btn-primary py-3 px-5 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} />
          <span>Record Expense</span>
        </button>
      }
    >
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Expense Title</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {expenses.map(e => (
              <tr key={e.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 grid place-items-center">
                    <ReceiptText size={16} />
                  </div>
                  {e.title}
                </td>
                <td className="p-4 font-bold text-rose-400">${Number(e.amount).toFixed(2)}</td>
                <td className="p-4 text-slate-400">{new Date(e.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <form onSubmit={handleAdd} className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-indigo-500/30 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white">Record Expense</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Expense Description</label>
              <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="e.g. Electricity bill" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Amount ($)</label>
              <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full glass-input p-3 rounded-xl text-xs" placeholder="0.00" />
            </div>
            <button type="submit" className="w-full btn-primary py-3 rounded-xl font-bold text-xs">Save Expense</button>
          </form>
        </div>
      )}
    </Box>
  );
}

// Reports Component
export function Reports() {
  const { sales } = useApp();
  return (
    <Box title="Sales & Transaction Reports" description="Detailed transaction log with invoice breakdown and profit margin tracking">
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Cashier</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {sales.map(s => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-bold text-indigo-400 font-mono">{s.id}</td>
                <td className="p-4 text-slate-400">{new Date(s.date).toLocaleString()}</td>
                <td className="p-4 font-bold text-white">{s.customer}</td>
                <td className="p-4 text-slate-300">{s.seller}</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300">{s.payment}</span></td>
                <td className="p-4 font-black text-white">${Number(s.total).toFixed(2)}</td>
                <td className="p-4 font-bold text-emerald-400">${Number(s.profit).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

// Settings Component
export function Settings() {
  const [saved, setSaved] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box title="Store & System Settings" description="Configure store details, currency formats, receipt footers and taxes">
      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-5">
        {[
          { label: 'Store Name', val: 'JOOS POS Store' },
          { label: 'Phone Number', val: '0615646084' },
          { label: 'Business Address', val: 'Mogadishu, Somalia' },
          { label: 'Primary Currency', val: 'USD ($)' },
          { label: 'Tax Rate (%)', val: '0%' },
          { label: 'Receipt Footer Message', val: 'Thank you for shopping with us! Mahadsanid.' },
        ].map(item => (
          <div key={item.label}>
            <label className="text-xs font-bold text-slate-400 block mb-1">{item.label}</label>
            <input defaultValue={item.val} className="w-full glass-input p-3.5 rounded-2xl text-xs font-semibold" />
          </div>
        ))}

        <div className="md:col-span-2 pt-2 flex items-center gap-4">
          <button type="submit" className="btn-primary py-3.5 px-8 rounded-2xl font-extrabold text-xs">
            Save Settings
          </button>
          {saved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 size={16} /> Settings saved successfully!
            </span>
          )}
        </div>
      </form>
    </Box>
  );
}
