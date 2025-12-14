import React from 'react';

export const Input = ({
    label,
    icon: Icon,
    error,
    ...props
}) => {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text-color)'
                }}>
                    {label}
                </label>
            )}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
            }}>
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '16px',
                        color: 'var(--text-light)',
                        display: 'flex'
                    }}>
                        <Icon size={20} />
                    </div>
                )}
                <input
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        paddingLeft: Icon ? '48px' : '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'white',
                        fontSize: '16px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                    {...props}
                />
            </div>
            {error && (
                <span style={{
                    fontSize: '12px',
                    color: 'var(--danger)',
                    marginTop: '4px',
                    display: 'block'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};
