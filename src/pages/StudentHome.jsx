import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, LogOut, Star, Receipt } from 'lucide-react';
import { sellers } from '../data/mockData';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const StudentHome = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSellers = sellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ background: '#F7F9FC' }}>
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
                    Find Laundry<br />Services Nearby
                </h1>
            </div>

            <div style={{ padding: '0 20px', marginTop: '-60px' }}>
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

                <Button
                    variant="secondary"
                    fullWidth
                    icon={<Receipt size={20} />}
                    onClick={() => navigate('/student/orders')}
                    style={{ marginBottom: '24px', justifyContent: 'center' }}
                >
                    View My Orders
                </Button>

                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Available Sellers</h2>

                <div style={{ paddingBottom: '40px' }}>
                    {filteredSellers.map(seller => (
                        <SellerCard key={seller.id} seller={seller} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SellerCard = ({ seller }) => {
    return (
        <Card
            noPadding
            className="fade-in"
            style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
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
                    {seller.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{seller.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>
                        <MapPin size={14} />
                        {seller.area}
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
                            {seller.rating}
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>({seller.reviews} reviews)</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        ${seller.pricePerKg}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>/kg</div>
                </div>
            </div>
        </Card>
    );
};

export default StudentHome;
