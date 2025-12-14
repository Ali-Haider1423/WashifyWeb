// Storage Keys
const USERS_KEY = 'washify_users';
const SESSION_KEY = 'washify_session';
const ORDERS_KEY = 'washify_orders';

// --- User Management ---

export const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

export const saveUser = (userData) => {
    const users = getUsers();

    if (users.some(u => u.email === userData.email)) {
        throw new Error('Email already registered');
    }

    const newUser = {
        id: Date.now().toString(),
        ...userData,
        rating: userData.role === 'seller' ? 0 : undefined,
        reviews: userData.role === 'seller' ? 0 : undefined,
        pricePerWash: userData.role === 'seller' ? 10 : undefined, // Default price
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
};

// Update Seller Price
export const updateSellerPrice = (userId, newPrice) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex].pricePerWash = parseFloat(newPrice);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Update session if it's the current user
        const session = getSession();
        if (session && session.userId === userId) {
            session.pricePerWash = parseFloat(newPrice);
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
        return true;
    }
    return false;
};

// --- Auth & Session ---

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
        area: user.area,
        pricePerWash: user.pricePerWash
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
};

export const getSession = () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

export const logoutUser = () => {
    localStorage.removeItem(SESSION_KEY);
};

// --- Order Management ---

export const getOrders = () => {
    const orders = localStorage.getItem(ORDERS_KEY);
    if (!orders) {
        return [];
    }
    return JSON.parse(orders);
};

export const saveOrder = (orderData) => {
    const orders = getOrders();
    const newOrder = {
        id: `#ORD-${Date.now()}`,
        ...orderData,
        status: 'Pending',
        date: new Date().toISOString(),
    };
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
};

export const updateOrderStatus = (orderId, newStatus) => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
        return orders[orderIndex];
    }
    throw new Error('Order not found');
};

// Initialize with some mock orders if empty (Helper for prototype)
export const seedOrders = (initialMockOrders) => {
    if (!localStorage.getItem(ORDERS_KEY)) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(initialMockOrders));
    }
};
export const CHATS_KEY = 'washify_chats';

export const getChats = () => {
    const chats = localStorage.getItem(CHATS_KEY);
    return chats ? JSON.parse(chats) : [];
};

export const createChat = (orderId, studentId, sellerId, studentName, sellerName) => {
    const chats = getChats();
    // Check if chat already exists for this order
    const existingChat = chats.find(c => c.orderId === orderId);
    if (existingChat) return existingChat;

    const newChat = {
        id: `chat_${Date.now()}`,
        orderId,
        participants: [studentId, sellerId],
        participantNames: { [studentId]: studentName, [sellerId]: sellerName },
        messages: [], // Array of { id, senderId, text, timestamp }
        lastUpdated: new Date().toISOString()
    };
    chats.push(newChat);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    return newChat;
};

export const sendMessage = (chatId, senderId, text) => {
    const chats = getChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return null;

    const newMessage = {
        id: `msg_${Date.now()}`,
        senderId,
        text,
        timestamp: new Date().toISOString()
    };

    chats[chatIndex].messages.push(newMessage);
    chats[chatIndex].lastUpdated = newMessage.timestamp;
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    return newMessage;
};

export const getChatForOrder = (orderId) => {
    const chats = getChats();
    return chats.find(c => c.orderId === orderId);
};
