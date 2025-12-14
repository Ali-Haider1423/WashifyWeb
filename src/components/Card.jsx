export const Card = ({ children, className = '', noPadding = false, style = {}, ...props }) => {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '24px',
                padding: noPadding ? '0' : '20px',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '16px',
                border: '1px solid rgba(255,255,255,0.5)',
                ...style
            }}
            className={className}
            {...props}
        >
            {children}
        </div>
    );
};
