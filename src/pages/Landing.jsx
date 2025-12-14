import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Briefcase, GraduationCap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
            background: 'white'
        }}>
            <div className="fade-in" style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 32px',
                    background: 'white',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <img src="/logo.png" alt="Washify Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    background: 'var(--primary-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Washify
                </h1>
                <p style={{ color: 'var(--text-light)', fontSize: '18px' }}>
                    Laundry made easy for students
                </p>
            </div>

            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                    Choose your role
                </h2>

                <RoleCard
                    title="Student"
                    description="Find laundry services nearby"
                    icon={<GraduationCap size={32} color="var(--primary-color)" />}
                    onClick={() => navigate('/login?role=student')}
                    isPrimary
                />

                <RoleCard
                    title="Service Provider"
                    description="Manage orders and earn"
                    icon={<Briefcase size={32} color="var(--text-color)" />}
                    onClick={() => navigate('/login?role=seller')}
                />
            </div>
        </div>
    );
};

const RoleCard = ({ title, description, icon, onClick, isPrimary }) => (
    <div
        onClick={onClick}
        style={{
            padding: '20px',
            marginBottom: '16px',
            borderRadius: '24px',
            border: isPrimary ? '1.5px solid rgba(46, 134, 193, 0.3)' : '1.5px solid #eee',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'white',
            transition: 'all 0.2s',
            boxShadow: isPrimary ? '0 4px 15px rgba(46, 134, 193, 0.1)' : 'none'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = isPrimary ? '0 4px 15px rgba(46, 134, 193, 0.1)' : 'none';
        }}
    >
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: isPrimary ? 'rgba(46, 134, 193, 0.1)' : '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>{description}</p>
        </div>
    </div>
);

export default Landing;
