import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initialOrders } from '../data/mockData'; // Assuming we export initialOrders
import { Card } from '../components/Card';
import { ChevronLeft } from 'lucide-react'; // Make sure to install lucide-react if not present, assumed standard icons

const OrderHistory = () => {
    const navigate = useNavigate();
    // Using initialOrders directly. In a real app, this would be state or context.
    const orders = initialOrders;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { bg: 'rgba(255, 159, 67, 0.1)', color: '#FF9F43' };
            case 'In Progress': return { bg: 'rgba(46, 134, 193, 0.1)', color: '#2E86C1' };
            case 'Completed': return { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' };
            default: return { bg: '#eee', color: '#666' };
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginRight: '8px' }}
                >
                    <ChevronLeft />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>My Orders</h1>
            </div>

            {orders.map((order, index) => {
                const { bg, color } = getStatusColor(order.status);
                return (
                    <Card key={order.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Order {order.id.split('-')[2]}</span>
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
                                <p style={{ fontWeight: '600' }}>{formatDate(order.deliveryDate)}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-light)' }}>Total Amount</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                ${order.amount.toFixed(2)}
                            </span>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default OrderHistory;
