export const users = [
  { id: 1, name: 'Joos', role: 'Milkiile', email: 'owner@joospos.com', password: 'Admin@123', pin: '1234' },
  { id: 2, name: 'Maamulaha Dukaanka', role: 'Maamule', email: 'manager@joospos.com', password: 'Manager@123', pin: '2222' },
  { id: 3, name: 'Axmed Ibraahim', role: 'Iabiiye', email: 'seller@joospos.com', password: 'Seller@123', pin: '3333' }
];

export const products = [
  { 
    id: 1, 
    name: 'Bariis Basmati Premium 5KG', 
    sku: 'BRQ-001', 
    category: 'Cunto', 
    supplier: 'Hodan Wholesale Group',
    buy: 8.00, 
    sell: 10.50, 
    stock: 34, 
    min: 8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 2, 
    name: 'Caano Ceeriin Latis 1L', 
    sku: 'BRQ-002', 
    category: 'Cabitaan', 
    supplier: 'Sahal Distributors',
    buy: 0.65, 
    sell: 1.00, 
    stock: 11, 
    min: 15,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 3, 
    name: 'Saliid Cunto Safi 3L', 
    sku: 'BRQ-003', 
    category: 'Cunto', 
    supplier: 'Hodan Wholesale Group',
    buy: 6.50, 
    sell: 8.50, 
    stock: 26, 
    min: 7,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 4, 
    name: 'Biyo Sifeeyan 500ml', 
    sku: 'BRQ-004', 
    category: 'Cabitaan', 
    supplier: 'Sahal Distributors',
    buy: 0.25, 
    sell: 0.50, 
    stock: 85, 
    min: 20,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 5, 
    name: 'Shaaniye Mobel USB-C Fast', 
    sku: 'BRQ-005', 
    category: 'Elektaroonik', 
    supplier: 'Bakaara Trade Co.',
    buy: 4.50, 
    sell: 7.50, 
    stock: 7, 
    min: 10,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 6, 
    name: 'Buugga Qoraalka A4 (200 Bog)', 
    sku: 'BRQ-006', 
    category: 'Qalabka Xafiiska', 
    supplier: 'Bakaara Trade Co.',
    buy: 1.10, 
    sell: 1.75, 
    stock: 42, 
    min: 10,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 7, 
    name: 'Sonkor Cad 10KG', 
    sku: 'BRQ-007', 
    category: 'Cunto', 
    supplier: 'Hodan Wholesale Group',
    buy: 9.00, 
    sell: 12.00, 
    stock: 18, 
    min: 5,
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 8, 
    name: 'Shaah Cagaaran Box', 
    sku: 'BRQ-008', 
    category: 'Cabitaan', 
    supplier: 'Sahal Distributors',
    buy: 1.50, 
    sell: 2.50, 
    stock: 30, 
    min: 8,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 9, 
    name: 'Bur Subag 5KG', 
    sku: 'BRQ-009', 
    category: 'Cunto', 
    supplier: 'Hodan Wholesale Group',
    buy: 5.50, 
    sell: 7.00, 
    stock: 22, 
    min: 6,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 10, 
    name: 'Headphone Bluetooth Original', 
    sku: 'BRQ-010', 
    category: 'Elektaroonik', 
    supplier: 'Bakaara Trade Co.',
    buy: 12.00, 
    sell: 18.00, 
    stock: 9, 
    min: 3,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'
  },
  { 
    id: 11, 
    name: 'Saliid Macsaro Pure 100L', 
    sku: 'BRQ-011', 
    category: 'Cunto', 
    supplier: 'Hodan Wholesale Group',
    buy: 180.00, 
    sell: 220.00, 
    stock: 15, 
    min: 3,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80'
  }
];

export const customers = [
  { id: 1, name: 'Maxamed Xasan', phone: '0612345678', points: 240, balance: 0 },
  { id: 2, name: 'Aamina Cali', phone: '0623456789', points: 95, balance: 12 },
  { id: 3, name: 'Yuusuf Cumar', phone: '0634567890', points: 160, balance: 0 },
  { id: 4, name: 'Fardowsa Axmed', phone: '0615554433', points: 310, balance: 5 }
];

export const suppliers = [
  { id: 1, name: 'Hodan Wholesale Group', company: 'Hodan Wholesale Group', phone: '0611111111', location: 'Bakaara, Mogadishu', balance: 350 },
  { id: 2, name: 'Sahal Distributors', company: 'Sahal Distributors', phone: '0622222222', location: 'Suuqa Xoolaha, Mogadishu', balance: 0 },
  { id: 3, name: 'Bakaara Trade Co.', company: 'Bakaara Trade Co.', phone: '0633333333', location: 'Hamar Weyne, Mogadishu', balance: 125 }
];

export const resellers = [
  { id: 1, name: 'Cali Wakiil Bakaara', business: 'Bakaara Express Agent', phone: '0619998877', commissionRate: 5, balance: 140, totalSales: 1200 },
  { id: 2, name: 'Faadumo Reseller', business: 'Hamar Weyne Retail Hub', phone: '0618887766', commissionRate: 7, balance: 0, totalSales: 850 }
];
