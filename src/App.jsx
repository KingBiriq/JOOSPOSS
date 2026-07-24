import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import { Products, Customers, Suppliers, Resellers, Expenses, Reports, Settings } from './pages/Tables';

export default function App() {
  const { user } = useApp();

  if (!user) return <Login />;

  const isOwner = user.role === 'Milkiile' || user.role === 'Owner';

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {isOwner ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/resellers" element={<Resellers />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/pos" element={<POS />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="*" element={<Navigate to="/pos" />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
