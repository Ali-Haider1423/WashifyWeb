import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, DollarSign, Shirt, Receipt, Home, Clock, CheckCircle, Settings, Edit2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { getOrders, updateOrderStatus, updateSellerPrice, getSession, seedOrders } from '../utils/storage';
import { initialOrders } from '../data/mockData';

const SellerDashboard = () => {
    const { logout, user } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState('Pending'); // Pending, In Progress, Completed
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [priceInput, setPriceInput] = useState(user?.pricePerWash || 10);

    // Stats
    const activeJobsCount = orders.filter(o => o.status === 'In Progress').length;
    const earnings = orders
        .filter(o => o.status === 'Completed')
        .reduce((acc, curr) => acc + curr.amount, 0);

    // Load Data
    useEffect(() => {
        // Seed data if empty for prototype
        seedOrders(initialOrders);
        refreshOrders();
    }, []);

    const refreshOrders = () => {
        setOrders(getOrders());
    };

    const handleStatusUpdate = (newStatus) => {
        if (selectedOrder) {
            updateOrderStatus(selectedOrder.id, newStatus);
            refreshOrders(); // Refresh to move to new tab
            setSelectedOrder(null);
        }
    };

    const handlePriceUpdate = (e) => {
        e.preventDefault();
        if (updateSellerPrice(user.userId, priceInput)) {
            setShowPriceModal(false);
            // Ideally update context, but simple reload works for prototype consistency or wait for context refresh
            window.location.reload();
        }
    };

    // Filter orders for current tab
    const currentOrders = orders.filter(o => o.status === activeTab);

    const getTabIcon = (tabName) => {
        switch (tabName) {
            case 'Pending': return <Home size={20} />;
            case 'In Progress': return <Clock size={20} />;
            case 'Completed': return <CheckCircle size={20} />;
            default: return <Home size={20} />;
        }
    };

    return (
        <div className="container" style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh', background: '#F7F9FC' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Partner Dashboard</h1>
                    <p style={{ color: 'var(--text-light)' }}>Welcome, {user?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setShowPriceModal(true)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            background: 'white',
                            border: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            color: 'var(--primary-color)'
                        }}
                    >
                        <Settings size={16} />
                        ${user?.pricePerWash || 10}/wash
                    </button>
                    <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                        <LogOut size={20} color="var(--danger)" />
                    </button>
                </div>
            </div>

            {/* Stats (Always Visible) */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <StatCard
                    title="Active Jobs"
                    value={activeJobsCount}
                    icon={<Shirt size={24} color="white" />}
                    gradient="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
                />
                <StatCard
                    title="Earnings"
                    value={`$${earnings}`}
                    icon={<DollarSign size={24} color="white" />}
                    gradient="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
                />
            </div>

            {/* Tab Content Header */}
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)' }}>
                {activeTab} Orders
            </h2>

            {/* Order List */}
            {currentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                    <p>No orders in {activeTab}</p>
                </div>
            ) : (
                currentOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => setSelectedOrder(order)}
                    />
                ))
            )}

            {/* Bottom Navigation */}
            <div style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                background: 'white',
                boxShadow: '0 -5px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '12px',
                maxWidth: '480px', // Match container
                margin: '0 auto',
                borderRadius: '24px 24px 0 0',
                zIndex: 100
            }}>
                {['Pending', 'In Progress', 'Completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            border: 'none',
                            background: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-light)',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {getTabIcon(tab)}
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{tab}</span>
                    </button>
                ))}
            </div>

            {/* Modals */}
            {selectedOrder && (
                <StatusModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={handleStatusUpdate}
                />
            )}

            {showPriceModal && (
                <PriceModal
                    price={priceInput}
                    setPrice={setPriceInput}
                    onClose={() => setShowPriceModal(false)}
                    onSave={handlePriceUpdate}
                />
            )}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '12px' }}>{order.id}</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>${order.amount}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const StatusModal = ({ order, onClose, onUpdate }) => {
    // Removed isCompleted check to allow full manual control as requested

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '320px'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Update Status</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                </div>
                <p style={{ marginBottom: '16px', color: 'var(--text-light)' }}>Current: <b>{order.status}</b></p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Pending', 'In Progress', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => onUpdate(status)}
                            style={{
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid #eee',
                                background: order.status === status ? 'var(--surface-color)' : 'white',
                                fontWeight: '600',
                                color: order.status === status ? 'var(--primary-color)' : 'var(--text-color)',
                                cursor: 'pointer',
                                textAlign: 'left'
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

const PriceModal = ({ price, setPrice, onClose, onSave }) => (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    }} onClick={onClose}>
        <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '320px'
        }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Set Pricing</h3>
            <form onSubmit={onSave}>
                <Input
                    label="Price per Wash ($)"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
                    <Button type="submit" fullWidth>Save</Button>
                </div>
            </form>
        </div>
    </div>
);

export default SellerDashboard;
