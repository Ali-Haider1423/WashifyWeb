export const sellers = [
  {
    id: '1',
    name: 'Sarah Anderson',
    area: 'University Road',
    rating: 4.8,
    reviews: 124,
    pricePerKg: 2.5,
  },
  {
    id: '2',
    name: 'Martha Jenkins',
    area: 'North Campus',
    rating: 4.5,
    reviews: 89,
    pricePerKg: 2.0,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    area: 'University Road',
    rating: 4.9,
    reviews: 215,
    pricePerKg: 3.0,
  },
  {
    id: '4',
    name: 'Blue Bubbles Laundry',
    area: 'West End',
    rating: 4.2,
    reviews: 45,
    pricePerKg: 2.2,
  },
  {
    id: '5',
    name: 'Jessica Lee',
    area: 'Downtown',
    rating: 4.7,
    reviews: 156,
    pricePerKg: 2.8,
  },
];

export const initialOrders = [
  {
    id: '#ORD-2023-001',
    studentName: 'Ali Haider',
    status: 'Pending',
    date: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 15.0,
  },
  {
    id: '#ORD-2023-002',
    studentName: 'John Doe',
    status: 'In Progress',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 25.5,
  },
  {
    id: '#ORD-2023-003',
    studentName: 'Jane Smith',
    status: 'Completed',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    amount: 12.0,
  },
];
