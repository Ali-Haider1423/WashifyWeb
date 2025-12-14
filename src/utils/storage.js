// Storage Keys
const USERS_KEY = 'washify_users';
const SESSION_KEY = 'washify_session';

// Helper to get all users
export const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save a new user
export const saveUser = (userData) => {
    const users = getUsers();

    // Check for duplicate email
    if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already registered');
    }

    const newUser = {
        id: Date.now().toString(),
        ...userData,
        // Add default fields for sellers if not present
        rating: userData.role === 'seller' ? 0 : undefined,
        reviews: userData.role === 'seller' ? 0 : undefined,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
};

// Start Session
export const loginUser = (email, password, expectedRole) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (user.role !== expectedRole) {
        throw new Error(`Invalid role. Please login as a ${user.role}.`);
    }

    // Set Session
    const session = {
        userId: user.id,
        name: user.name,
        role: user.role,
        area: user.area // useful for sellers
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
};

// Get Current Session
export const getSession = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

// Logout
export const logoutUser = () => {
    localStorage.removeItem(SESSION_KEY);
};
