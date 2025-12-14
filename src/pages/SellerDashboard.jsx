import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, DollarSign, Shirt, Receipt } from 'lucide-react';
import { initialOrders } from '../data/mockData';
import { Card } from '../components/Card';

const SellerDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate(); // Kept for consistency if needed
    // Using local state to simulate backend updates for the prototype
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleStatusUpdate = (newStatus) => {
        if (selectedOrder) {
            const updatedOrders = orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            setSelectedOrder(null);
        }
    };

    const StatusModal = () => {
        if (!selectedOrder) return null;
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }} onClick={() => setSelectedOrder(null)}>
                <div style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '24px',
                    width: '90%',
                    maxWidth: '320px'
                }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Update Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['Pending', 'In Progress', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid #eee',
                                    background: selectedOrder.status === status ? 'var(--surface-color)' : 'white',
                                    fontWeight: '600',
                                    color: selectedOrder.status === status ? 'var(--primary-color)' : 'var(--text-color)',
                                    cursor: 'pointer'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container" style={{ padding: '20px' }}>
            <StatusModal />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Partner Dashboard</h1>
                    <p style={{ color: 'var(--text-light)' }}>Welcome, {user?.name}</p>
                </div>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <LogOut />
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <StatCard
                    title="Active Jobs"
                    value="3"
                    icon={<Shirt size={24} color="white" />}
                    gradient="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
                />
                <StatCard
                    title="Earnings"
                    value="$450"
                    icon={<DollarSign size={24} color="white" />}
                    gradient="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
                />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Recent Orders</h2>

            {orders.map(order => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                />
            ))}
        </div>
    );
};

const StatCard = ({ title, value, icon, gradient }) => (
    <Card style={{ flex: 1 }}>
        <div style={{
            width: '48px', height: '48px',
            borderRadius: '16px',
            background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px'
        }}>
            {icon}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--dark-color)' }}>{value}</div>
        <div style={{ color: 'var(--text-light)', fontSize: '14px' }}>{title}</div>
    </Card>
);

const OrderCard = ({ order, onClick }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return { bg: 'rgba(255, 159, 67, 0.1)', color: '#FF9F43' };
            case 'In Progress': return { bg: 'rgba(46, 134, 193, 0.1)', color: '#2E86C1' };
            case 'Completed': return { bg: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' };
            default: return { bg: '#eee', color: '#666' };
        }
    };
    const { bg, color } = getStatusColor(order.status);

    return (
        <Card
            onClick={onClick}
            style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '20px' }}
            className="fade-in"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', background: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Receipt size={24} color="#bdc3c7" />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold' }}>{order.studentName}</span>
                        <span style={{ background: bg, color, padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                            {order.status}
                        </span>
                    </div>
                    <div style={{ color: 'var(--text-light)', fontSize: '12px' }}>{order.id}</div>
                </div>
            </div>
        </Card>
    );
};

export default SellerDashboard;
