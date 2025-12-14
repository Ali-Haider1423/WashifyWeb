import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';
    const isStudent = role === 'student';
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        try {
            const session = login(formData.email, formData.password, role);
            // Redirect based on role
            if (session.role === 'student') {
                navigate('/student/home');
            } else {
                navigate('/seller/dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(180deg, #F0F4F8 0%, #FFFFFF 100%)'
        }}>
            <div className="fade-in">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 24px',
                        background: 'white',
                        borderRadius: '50%',
                        boxShadow: 'var(--shadow-md)',
                        padding: '12px'
                    }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        {isStudent ? 'Student Login' : 'Service Provider Login'}
                    </p>
                </div>

                <Card className="glass-panel">
                    <form onSubmit={handleLogin}>
                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            icon={Lock}
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        {error && (
                            <div style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginTop: '24px' }}>
                            <Button type="submit" fullWidth>Login</Button>
                        </div>
                    </form>
                </Card>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <span style={{ color: 'var(--text-light)' }}>Don't have an account? </span>
                    <button
                        onClick={() => navigate(`/register?role=${role}`)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
