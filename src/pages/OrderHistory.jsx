import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../utils/storage';
import { Card } from '../components/Card';
import { ChevronLeft, Package } from 'lucide-react';

const OrderHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            const allOrders = getOrders();
            // Filter orders for the current student
            const myOrders = allOrders
                .filter(o => o.studentId === user.userId)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first
            setOrders(myOrders);
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { bg: 'rgba(255, 159, 67, 0.1)', color: '#FF9F43' };
            case 'In Progress': return { bg: 'rgba(46, 134, 193, 0.1)', color: '#2E86C1' };
            case 'Completed': return { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' };
            default: return { bg: '#eee', color: '#666' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDeliveryDate = (orderDate) => {
        if (!orderDate) return 'N/A';
        const date = new Date(orderDate);
        date.setDate(date.getDate() + 2); // Add 2 days for estimated delivery
        return formatDate(date.toISOString());
    };

    return (
        <div className="container" style={{ padding: '20px', minHeight: '100vh', background: '#F7F9FC' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '8px' }}
                >
                    <ChevronLeft />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: '#e0e0e0',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        color: 'white'
                    }}>
                        <Package size={40} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No Orders Yet</h3>
                    <p>Place your first laundry order to see it here.</p>
                </div>
            ) : (
                orders.map((order, index) => {
                    const { bg, color } = getStatusColor(order.status);
                    return (
                        <Card key={order.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Order {order.id.split('-')[1]}</span>
                                <span style={{
                                    background: bg,
                                    color: color,
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {order.status}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Ordered On</p>
                                    <p style={{ fontWeight: '600' }}>{formatDate(order.date)}</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Est. Delivery</p>
                                    <p style={{ fontWeight: '600' }}>{getDeliveryDate(order.date)}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Service Provider</p>
                                <p style={{ fontWeight: '600' }}>{order.sellerName || 'Unknown Seller'}</p>
                            </div>

                            <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-light)' }}>Total Amount</span>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    ${order.amount.toFixed(2)}
                                </span>
                            </div>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default OrderHistory;
