import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { products as initialProducts, customers as initialCustomers, suppliers as initialSuppliers, resellers as initialResellers, users } from '../data/seed';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pos_user');
    if (!saved) return null;
    try {
      const u = JSON.parse(saved);
      if (u && (u.role === 'Milkiile' || u.role === 'Owner')) {
        u.name = 'Joos';
        localStorage.setItem('pos_user', JSON.stringify(u));
      }
      return u;
    } catch {
      return null;
    }
  });
  
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pos_products');
    if (!saved) return initialProducts;
    try {
      let parsed = JSON.parse(saved);
      parsed = parsed.map(p => {
        const seedItem = initialProducts.find(x => x.sku === p.sku || x.id === p.id);
        if (!p.image && seedItem?.image) {
          return { ...p, image: seedItem.image };
        }
        return p;
      });
      initialProducts.forEach(item => {
        if (!parsed.some(p => p.sku === item.sku)) {
          parsed.push(item);
        }
      });
      localStorage.setItem('pos_products', JSON.stringify(parsed));
      return parsed;
    } catch {
      return initialProducts;
    }
  });

  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('pos_sales') || '[]'));
  
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('pos_customers');
    if (!saved) return initialCustomers;
    try {
      return JSON.parse(saved);
    } catch {
      return initialCustomers;
    }
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('pos_suppliers');
    if (!saved) return initialSuppliers;
    try {
      return JSON.parse(saved);
    } catch {
      return initialSuppliers;
    }
  });

  const [resellers, setResellers] = useState(() => {
    const saved = localStorage.getItem('pos_resellers');
    if (!saved) return initialResellers;
    try {
      return JSON.parse(saved);
    } catch {
      return initialResellers;
    }
  });

  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Kireenta Internet-ka', amount: 30, date: new Date().toISOString() },
    { id: 2, title: 'Bilaash korontada', amount: 45, date: new Date().toISOString() }
  ]);

  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const login = (email, password, pin) => {
    const u = users.find(x => x.email === email && x.password === password && x.pin === pin);
    if (u) {
      setUser(u);
      save('pos_user', u);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos_user');
  };

  // Complete sale and handle Credit debt auto-addition
  const completeSale = (items, payment, customerName) => {
    const total = items.reduce((a, i) => a + i.sell * i.qty, 0);
    const cost = items.reduce((a, i) => a + i.buy * i.qty, 0);
    const selectedCustomer = customerName || 'Gadaade Guud (Walk-in)';

    const sale = {
      id: `INV-${String(sales.length + 1).padStart(5, '0')}`,
      date: new Date().toISOString(),
      items,
      total,
      cost,
      profit: total - cost,
      payment,
      customer: selectedCustomer,
      seller: user?.name || 'Ilaaliye'
    };

    const ns = [sale, ...sales];
    setSales(ns);
    save('pos_sales', ns);

    // Stock deduction
    const np = products.map(p => {
      const item = items.find(x => x.id === p.id);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    });
    setProducts(np);
    save('pos_products', np);

    // Automatic debt balance addition if payment method is Credit (Dayn)
    if (payment === 'Credit' && selectedCustomer !== 'Gadaade Guud (Walk-in)') {
      const updatedCustomers = customers.map(c => {
        if (c.name === selectedCustomer) {
          return { ...c, balance: (c.balance || 0) + total };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      save('pos_customers', updatedCustomers);
    }

    return sale;
  };

  // Pay/Repay Customer Debt
  const payCustomerDebt = (customerId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    const updatedCustomers = customers.map(c => {
      if (c.id === customerId) {
        const newBalance = Math.max(0, (c.balance || 0) - numAmount);
        return { ...c, balance: newBalance };
      }
      return c;
    });

    setCustomers(updatedCustomers);
    save('pos_customers', updatedCustomers);
    return true;
  };

  // Pay Supplier Balance
  const paySupplierBalance = (supplierId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    const updatedSuppliers = suppliers.map(s => {
      if (s.id === supplierId) {
        const newBalance = Math.max(0, (s.balance || 0) - numAmount);
        return { ...s, balance: newBalance };
      }
      return s;
    });

    setSuppliers(updatedSuppliers);
    save('pos_suppliers', updatedSuppliers);
    return true;
  };

  // Pay / Payout Reseller Balance / Commission
  const payResellerBalance = (resellerId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;

    const updatedResellers = resellers.map(r => {
      if (r.id === resellerId) {
        const newBalance = Math.max(0, (r.balance || 0) - numAmount);
        return { ...r, balance: newBalance };
      }
      return r;
    });

    setResellers(updatedResellers);
    save('pos_resellers', updatedResellers);
    return true;
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    products,
    setProducts,
    sales,
    completeSale,
    customers,
    setCustomers,
    suppliers,
    setSuppliers,
    resellers,
    setResellers,
    expenses,
    setExpenses,
    payCustomerDebt,
    paySupplierBalance,
    payResellerBalance
  }), [user, products, sales, customers, suppliers, resellers, expenses]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
