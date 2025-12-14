import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, LogOut, Star, Receipt, Shirt, Home, MessageCircle, Package } from 'lucide-react';
import { getUsers, saveOrder } from '../utils/storage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import OrderHistory from './OrderHistory';

const StudentHome = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('Home');
    const [searchTerm, setSearchTerm] = useState('');
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);

    useEffect(() => {
        const allUsers = getUsers();
        const realSellers = allUsers.filter(u => u.role === 'seller');
        setSellers(realSellers);
    }, []);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const filteredSellers = sellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (seller.area && seller.area.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handlePlaceOrder = (quantity) => {
        if (!user) {
            alert('Please login to place an order');
            navigate('/');
            return;
        }
        if (!selectedSeller) return;

        try {
            const price = selectedSeller.pricePerWash || 10;
            const totalAmount = quantity * price;

            saveOrder({
                studentId: user.userId,
                studentName: user.name,
                sellerId: selectedSeller.id,
                sellerName: selectedSeller.name,
                items: [{ name: 'Suits', quantity: parseInt(quantity) }],
                amount: totalAmount,
                quantity: quantity
            });

            setSelectedSeller(null);
            alert('Order placed successfully!');
            setActiveTab('Orders'); // Switch to Orders tab
        } catch (error) {
            alert('Failed to place order: ' + error.message);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Orders':
                return <OrderHistory embed={true} />;
            case 'Chats':
                return (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            background: '#e0e0e0',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: 'white'
                        }}>
                            <MessageCircle size={40} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Chat Coming Soon</h3>
                        <p>You will be able to chat with sellers here.</p>
                    </div>
                );
            case 'Home':
            default:
                return (
                    <>
                        {/* Search */}
                        <div style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <Search color="var(--text-light)" />
                            <input
                                placeholder="Search areas, sellers..."
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    marginLeft: '12px',
                                    fontSize: '16px'
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Available Sellers</h2>

                        <div style={{ paddingBottom: '40px' }}>
                            {filteredSellers.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)' }}>
                                    {sellers.length === 0 ? 'No service providers found anywhere.' : 'No sellers match your search.'}
                                </div>
                            ) : (
                                filteredSellers.map(seller => (
                                    <SellerCard key={seller.id} seller={seller} onClick={() => setSelectedSeller(seller)} />
                                ))
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="container" style={{ background: '#F7F9FC', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                background: 'var(--primary-gradient)',
                padding: '24px',
                paddingBottom: '80px',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px',
                color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <p style={{ fontSize: '12px', opacity: 0.8 }}>Welcome, {user?.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                            <MapPin size={16} />
                            University Road, NY
                        </div>
                    </div>
                    <button onClick={logout} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                        <LogOut size={20} />
                    </button>
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', lineHeight: 1.2 }}>
                    {activeTab === 'Orders' ? 'Your Orders' : activeTab === 'Chats' ? 'Your Chats' : <span>Find Laundry<br />Services Nearby</span>}
                </h1>
            </div>

            <div style={{ padding: '0 20px', marginTop: '-60px' }}>
                {renderContent()}
            </div>

            {selectedSeller && (
                <OrderModal
                    seller={selectedSeller}
                    onClose={() => setSelectedSeller(null)}
                    onConfirm={handlePlaceOrder}
                />
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
                maxWidth: '480px',
                margin: '0 auto',
                borderRadius: '24px 24px 0 0',
                zIndex: 100
            }}>
                {[
                    { id: 'Home', icon: Home, label: 'Home' },
                    { id: 'Orders', icon: Package, label: 'Orders' },
                    { id: 'Chats', icon: MessageCircle, label: 'Chats' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            border: 'none',
                            background: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-light)',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        <tab.icon size={24} />
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};



const SellerCard = ({ seller, onClick }) => {
    return (
        <Card
            noPadding
            className="fade-in"
            style={{ padding: '16px', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '16px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {seller.name ? seller.name[0].toUpperCase() : 'S'}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{seller.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>
                        <MapPin size={14} />
                        {seller.area || 'No location set'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <div style={{
                            background: 'rgba(241, 196, 15, 0.1)',
                            color: '#F1C40F',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Star size={12} fill="#F1C40F" />
                            {seller.rating || 'N/A'}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>({seller.reviews || 0} reviews)</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        ${seller.pricePerWash || 10}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>/wash</div>
                </div>
            </div>

            <Button onClick={onClick} fullWidth icon={<Shirt size={20} />}>
                Place Order
            </Button>
        </Card>
    );
};

const OrderModal = ({ seller, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);
    const price = seller.pricePerWash || 10;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity > 0) {
            onConfirm(quantity);
        }
    };

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
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Place Order</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--text-light)', marginBottom: '4px' }}>Service Provider</p>
                    <p style={{ fontWeight: 'bold', fontSize: '16px' }}>{seller.name}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Number of Suits"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        icon={Shirt}
                        required
                    />

                    <div style={{
                        background: 'var(--surface-color)',
                        padding: '16px',
                        borderRadius: '12px',
                        marginTop: '16px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-light)' }}>Price per suit</span>
                            <span>${price}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: 'var(--primary-color)' }}>
                            <span>Total</span>
                            <span>${(quantity * price).toFixed(2)}</span>
                        </div>
                    </div>

                    <Button type="submit" fullWidth>Confirm Order</Button>
                </form>
            </div>
        </div>
    );
};

export default StudentHome;
