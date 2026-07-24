import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  ShoppingCart, 
  CreditCard, 
  CheckCircle2, 
  User, 
  DollarSign, 
  X, 
  Receipt,
  Sparkles,
  Zap,
  Phone,
  Package,
  ChevronUp,
  ArrowRight,
  Check,
  QrCode,
  Tag,
  Clock,
  Volume2
} from 'lucide-react';

const categories = ['Dhammaan', 'Cunto', 'Cabitaan', 'Elektaroonik', 'Qalabka Xafiiska'];

// Web Audio API beep sound generator for Barcode Scanner
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200; // Crisp high beep
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Ignore audio context errors if blocked by browser
  }
};

export default function POS() {
  const { products, completeSale, customers } = useApp();
  const [q, setQ] = useState('');
  const [skuInput, setSkuInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('Dhammaan');
  const [cart, setCart] = useState([]);
  const [payment, setPayment] = useState('EVC Plus');
  const [customer, setCustomer] = useState('Gadaade Guud (Walk-in)');
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' or 'percent'
  const [discountVal, setDiscountVal] = useState(0);
  const [cashTendered, setCashTendered] = useState('');
  const [completedSale, setCompletedSale] = useState(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [heldOrders, setHeldOrders] = useState(() => JSON.parse(localStorage.getItem('pos_held_orders') || '[]'));
  const [heldOrdersModalOpen, setHeldOrdersModalOpen] = useState(false);

  // Add item to cart
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    playBeep();
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Barcode / SKU Scan Handler
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!skuInput.trim()) return;
    const matched = products.find(p => p.sku.toLowerCase() === skuInput.trim().toLowerCase());
    if (matched && matched.stock > 0) {
      addToCart(matched);
      setSkuInput('');
    } else {
      alert(`Alaab laha SKU-ga "${skuInput}" laguma helin ama stock-ga ayaa dhammaaday!`);
    }
  };

  // Adjust item quantity
  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, Math.min(item.stock, item.qty + delta));
            return { ...item, qty: newQty };
          }
          return item;
        })
    );
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Hold / Park Cart Order
  const parkCurrentOrder = () => {
    if (!cart.length) return;
    const newHeld = [
      {
        id: `DRAFT-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString(),
        cart,
        customer,
        payment
      },
      ...heldOrders
    ];
    setHeldOrders(newHeld);
    localStorage.setItem('pos_held_orders', JSON.stringify(newHeld));
    setCart([]);
    setDiscountVal(0);
    alert('Iibka waa la baxeeyay (Order Parked)! Waxaad soo celin kartaa markaad rabto.');
  };

  // Recall Parked Order
  const recallParkedOrder = (heldItem) => {
    setCart(heldItem.cart);
    setCustomer(heldItem.customer || 'Gadaade Guud (Walk-in)');
    setPayment(heldItem.payment || 'EVC Plus');
    const updated = heldOrders.filter(h => h.id !== heldItem.id);
    setHeldOrders(updated);
    localStorage.setItem('pos_held_orders', JSON.stringify(updated));
    setHeldOrdersModalOpen(false);
  };

  // Totals calculation
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.sell * item.qty, 0), [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'percent') {
      return (subtotal * (Number(discountVal) || 0)) / 100;
    }
    return Number(discountVal) || 0;
  }, [subtotal, discountType, discountVal]);

  const finalTotal = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);
  const totalItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  // Cash Change Due
  const numTendered = parseFloat(cashTendered) || 0;
  const changeDue = useMemo(() => Math.max(0, numTendered - finalTotal), [numTendered, finalTotal]);

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'Dhammaan' || p.category === activeCategory;
      const matchesSearch = (p.name + p.sku).toLowerCase().includes(q.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, q]);

  // Checkout action
  const handleCheckout = () => {
    if (!cart.length) return;
    const saleRecord = completeSale(cart, payment, customer);
    setCompletedSale({ ...saleRecord, tendered: numTendered, change: changeDue });
    setCart([]);
    setDiscountVal(0);
    setCashTendered('');
    setMobileCartOpen(false);
  };

  return (
    <div className="grid xl:grid-cols-12 gap-6 items-start pb-20 xl:pb-0">
      {/* Left Column: Products Terminal (7 Cols on XL, 8 Cols on 2XL) */}
      <div className="xl:col-span-7 2xl:col-span-8 space-y-5">
        {/* INSTANT LIVE QUICK PAY BANNER */}
        {cart.length > 0 && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-emerald-950/90 border-2 border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-glow">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 grid place-items-center flex-shrink-0">
                <ShoppingCart size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    {totalItemCount} Alaab
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Bixinta lacagta daqiiqada ah</span>
                </div>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  Warta: <span className="text-emerald-400">${finalTotal.toFixed(2)}</span>
                </h3>
              </div>
            </div>

            {/* Quick Payment Options & Direct Pay Action */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="glass-input py-2.5 px-3 rounded-xl text-xs font-bold border-indigo-500/40 bg-slate-950"
              >
                {['EVC Plus', 'Zaad', 'eDahab', 'Cash', 'Card', 'Credit'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <button
                onClick={handleCheckout}
                className="btn-success py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <Zap size={16} />
                <span>Bixi Hada (Pay Now)</span>
              </button>
            </div>
          </div>
        )}

        {/* Search, Barcode Scanner & Filter Header */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Raadi magaca alaabta..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full glass-input py-3 pl-12 pr-10 rounded-2xl text-sm font-medium"
              />
              {q && (
                <button 
                  onClick={() => setQ('')}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Hardware / SKU Barcode Scanner Form */}
            <form onSubmit={handleBarcodeSubmit} className="relative w-full">
              <QrCode className="absolute left-3.5 top-3.5 text-indigo-400" size={18} />
              <input
                type="text"
                placeholder="Scan / Gali SKU..."
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                className="w-full glass-input py-2.5 sm:py-3 pl-10 pr-16 rounded-2xl text-xs sm:text-sm font-bold border-indigo-500/40 text-indigo-300 placeholder:text-slate-500"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 py-1.5 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-md"
              >
                Add
              </button>
            </form>
          </div>

          {/* Quick Category Badges - Touch Swipeable */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filteredProducts.map((p) => {
            const inCart = cart.find((item) => item.id === p.id);
            const isOutOfStock = p.stock <= 0;

            return (
              <button
                key={p.id}
                disabled={isOutOfStock}
                onClick={() => addToCart(p)}
                className={`
                  relative glass-card p-3 rounded-2xl border border-slate-800/80 text-left transition-all group flex flex-col justify-between
                  ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500/50 active:scale-98'}
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[9px] font-bold">
                      {p.sku}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      p.stock <= p.min 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isOutOfStock ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>

                  {/* PERFECT TRUE SQUARE (1:1 Ratio) Image Container */}
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 shadow-inner overflow-hidden relative flex items-center justify-center p-1.5 group-hover:border-indigo-500/60 transition-all">
                    {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => { e.target.style.display='none'; }} 
                      />
                    ) : (
                      <Package size={28} className="text-slate-500" />
                    )}

                    {/* PROMINENT STOCK BADGE OVERLAY ON TOP OF IMAGE */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase border shadow-lg backdrop-blur-md z-10 ${
                      isOutOfStock 
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500/50' 
                        : p.stock <= p.min 
                          ? 'bg-amber-950/90 text-amber-300 border-amber-500/50' 
                          : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                    }`}>
                      {isOutOfStock ? 'Dhammaaday' : `${p.stock} U Yaal`}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                  <span className="text-sm font-black text-indigo-400">
                    ${p.sell.toFixed(2)}
                  </span>
                  
                  <div className={`p-1.5 rounded-lg transition-all ${
                    inCart 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}>
                    <Plus size={14} />
                  </div>
                </div>

                {inCart && (
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-500 text-white text-[11px] font-black grid place-items-center shadow-lg animate-bounce z-10">
                    {inCart.qty}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-3 right-3 z-30 xl:hidden">
          <button
            onClick={() => setMobileCartOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold flex items-center justify-between shadow-2xl shadow-indigo-600/50 border border-indigo-400/40 animate-pulse-glow"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 grid place-items-center text-xs font-black">
                {totalItemCount}
              </div>
              <div className="text-left">
                <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Order Summary</p>
                <p className="text-sm font-black">${finalTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs uppercase tracking-wider font-extrabold bg-white/10 px-3 py-1.5 rounded-xl">
              <span>View Cart & Pay</span>
              <ChevronUp size={16} />
            </div>
          </button>
        </div>
      )}

      {/* Right Column: Checkout Cart Drawer */}
      <div className={`
        fixed xl:sticky top-0 xl:top-24 bottom-0 xl:bottom-auto right-0 z-50 xl:z-10 w-full sm:w-96 xl:w-auto xl:col-span-5 2xl:col-span-4 glass-card p-5 sm:p-6 rounded-none xl:rounded-3xl border-l xl:border border-slate-800 space-y-4 overflow-y-auto max-h-screen xl:max-h-none transition-transform duration-300
        ${mobileCartOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0 hidden xl:block'}
      `}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Current Order</h2>
              <p className="text-xs text-slate-400">{cart.length} item types selected</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {heldOrders.length > 0 && (
              <button
                onClick={() => setHeldOrdersModalOpen(true)}
                className="py-1 px-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
              >
                <Clock size={13} />
                <span>Parked ({heldOrders.length})</span>
              </button>
            )}

            {cart.length > 0 && (
              <button
                onClick={parkCurrentOrder}
                className="py-1 px-2 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold"
                title="Hold / Park this sale for later"
              >
                Park Order
              </button>
            )}

            <button
              onClick={() => setMobileCartOpen(false)}
              className="xl:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <ShoppingCart size={36} className="mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-semibold">Your cart is empty</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Click any product or scan barcode</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{item.name}</h4>
                  <span className="text-[11px] font-semibold text-indigo-400 block mt-0.5">
                    ${item.sell.toFixed(2)} each
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 rounded-lg text-slate-300 hover:bg-slate-700"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center font-extrabold text-xs text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 rounded-lg text-slate-300 hover:bg-slate-700"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="font-extrabold text-xs text-white w-12 text-right">
                    ${(item.sell * item.qty).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Customer & Payment Selectors */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Customer
            </label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full glass-input py-2 px-3 rounded-xl text-xs font-semibold"
            >
              <option value="Gadaade Guud (Walk-in)">Gadaade Guud (Walk-in)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['EVC Plus', 'Zaad', 'eDahab', 'Cash', 'Card', 'Credit'].map((m) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    payment === m
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Cash Tendered Selector (Shown when Cash selected) */}
          {payment === 'Cash' && (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Quick Cash Tendered ($)</span>
                <span className="font-extrabold text-emerald-400">Change: ${changeDue.toFixed(2)}</span>
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="Gali lacagta uu ku siiyay..."
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                className="w-full glass-input p-2 rounded-xl text-xs font-bold text-white"
              />
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { label: 'Exact', val: finalTotal },
                  { label: '$10', val: 10 },
                  { label: '$20', val: 20 },
                  { label: '$50', val: 50 },
                  { label: '$100', val: 100 }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashTendered(String(btn.val))}
                    className="flex-1 py-1 px-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-bold"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discount Section */}
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Tag size={13} className="text-amber-400" />
                <span>Discount / Sicir Dhimis</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${discountType === 'fixed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  $
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('percent')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${discountType === 'percent' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  %
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              placeholder={discountType === 'fixed' ? '0.00 $' : '0 %'}
              value={discountVal}
              onChange={(e) => setDiscountVal(e.target.value)}
              className="w-full glass-input p-2 rounded-xl text-xs font-bold text-amber-300"
            />
          </div>
        </div>

        {/* Financial Summary & Checkout CTA */}
        <div className="space-y-1.5 pt-3 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-amber-400 font-semibold">
              <span>Discount Amount</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-black text-white pt-1">
            <span>Total Payable</span>
            <span className="text-indigo-400">${finalTotal.toFixed(2)}</span>
          </div>

          <button
            disabled={!cart.length}
            onClick={handleCheckout}
            className={`
              w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all mt-2
              ${cart.length 
                ? 'btn-success cursor-pointer hover:scale-[1.01]' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}
            `}
          >
            <Zap size={16} />
            <span>Complete Sale & Pay</span>
          </button>
        </div>
      </div>

      {/* Held / Parked Orders Drawer Modal */}
      {heldOrdersModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-amber-500/40 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <Clock size={20} />
                <h3 className="font-extrabold text-lg text-white">Draft / Parked Orders</h3>
              </div>
              <button onClick={() => setHeldOrdersModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto scrollbar">
              {heldOrders.map((held) => {
                const heldTotal = held.cart.reduce((a, i) => a + i.sell * i.qty, 0);
                return (
                  <div key={held.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold font-mono text-amber-400">{held.id}</span>
                      <p className="text-slate-400 text-[10px]">{new Date(held.date).toLocaleTimeString()} - {held.customer}</p>
                      <p className="font-semibold text-slate-300 mt-1">{held.cart.length} items (${heldTotal.toFixed(2)})</p>
                    </div>
                    <button
                      onClick={() => recallParkedOrder(held)}
                      className="py-1.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all shadow-md"
                    >
                      Recall Order
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {completedSale && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 grid place-items-center p-4">
          <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-indigo-500/30 space-y-6 text-center shadow-2xl animate-pulse-glow">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center mx-auto border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Transaction Successful!</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">Invoice: {completedSale.id}</p>
            </div>

            {/* Thermal Print Preview Container */}
            <div id="printable-receipt" className="bg-white text-slate-900 p-5 rounded-2xl text-left text-xs font-mono border border-slate-200">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <h4 className="font-extrabold text-base text-slate-900">JOOS POS STORE</h4>
                <p className="text-[10px] text-slate-600">Mogadishu, Somalia | Tel: 0615646084</p>
                <p className="text-[10px] text-slate-500 mt-1">{new Date(completedSale.date).toLocaleString()}</p>
              </div>

              <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>Customer:</span>
                  <span>{completedSale.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span>{completedSale.payment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{completedSale.seller}</span>
                </div>
              </div>

              <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
                {completedSale.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.qty}x {item.name.slice(0, 15)}</span>
                    <span className="font-bold">${(item.sell * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {completedSale.tendered > 0 && (
                <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Cash Tendered:</span>
                    <span>${completedSale.tendered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Change Due:</span>
                    <span>${completedSale.change.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="pt-3 font-extrabold flex justify-between text-sm">
                <span>TOTAL PAID:</span>
                <span>${completedSale.total.toFixed(2)}</span>
              </div>

              <div className="text-center pt-4 text-[10px] text-slate-500">
                Thank you for shopping with us!
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-500"
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="py-3 px-5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
