import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { saveUser } from '../utils/storage';

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';
    const isStudent = role === 'student';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        area: isStudent ? '' : '', // Only for reference if needed, critically for Seller
    });

    const [error, setError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (!isStudent && !formData.area) {
            setError('Service area is required for partners');
            return;
        }

        try {
            saveUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: role,
                area: formData.area
            });
            // Redirect to login after successful registration
            navigate(`/login?role=${role}`);
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
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-light)' }}>
                        Join as a {isStudent ? 'student' : 'service provider'}
                    </p>
                </div>

                <Card className="glass-panel">
                    <form onSubmit={handleRegister}>
                        <Input
                            label="Full Name"
                            icon={User}
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
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

                        {!isStudent && (
                            <Input
                                label="Service Area"
                                icon={MapPin}
                                type="text"
                                placeholder="e.g. North Campus"
                                value={formData.area}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                required
                            />
                        )}

                        {error && (
                            <div style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ marginTop: '24px' }}>
                            <Button type="submit" fullWidth>Create Account</Button>
                        </div>
                    </form>
                </Card>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <span style={{ color: 'var(--text-light)' }}>Already have an account? </span>
                    <button
                        onClick={() => navigate(`/login?role=${role}`)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
