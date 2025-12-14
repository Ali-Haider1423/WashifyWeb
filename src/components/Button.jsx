import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-[--primary-color] to-[--secondary-color] text-white shadow-lg hover:shadow-xl",
        secondary: "bg-white text-[--primary-color] shadow-md border border-[--surface-color]",
        ghost: "bg-transparent text-[--text-color] hover:bg-gray-100",
    };

    // We are using inline styles for gradient since Tailwind classes might not be fully configured for custom properties yet
    // in a standard setup properly, but simulating standard CSS modules or classes here.
    // Actually, let's use standard style object for absolute certainty with CSS variables.

    const getStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(46, 134, 193, 0.3)',
                    border: 'none',
                };
            case 'secondary':
                return {
                    background: 'white',
                    color: 'var(--primary-color)',
                    border: '1px solid #eee',
                };
            case 'ghost':
                return {
                    background: 'transparent',
                    color: 'var(--text-color)',
                };
            default:
                return {};
        }
    };

    return (
        <button
            className={fullWidth ? 'w-full' : ''}
            style={{
                ...getStyle(),
                width: fullWidth ? '100%' : 'auto',
                padding: '12px 24px',
                borderRadius: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                ...props.style
            }}
            {...props}
        >
            {icon && <span className="icon">{icon}</span>}
            {children}
        </button>
    );
};
