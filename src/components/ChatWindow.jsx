import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { Input } from './Input';
import { sendMessage } from '../utils/storage';

export const ChatWindow = ({ chat, currentUser, onBack, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic update handled by parent or re-fetch
        sendMessage(chat.id, currentUser.userId, newMessage);
        onSendMessage(); // Callback to refresh parent state
        setNewMessage('');
    };

    const otherParticipantId = chat.participants.find(id => id !== currentUser.userId);
    const otherParticipantName = chat.participantNames[otherParticipantId] || 'User';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F7F9FC' }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #eee',
                position: 'sticky', top: 0, zIndex: 10
            }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{otherParticipantName}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)', margin: 0 }}>Order #{chat.orderId?.split('-')[1]}</p>
                </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {chat.messages.map(msg => {
                    const isMe = msg.senderId === currentUser.userId;
                    return (
                        <div key={msg.id} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                            background: isMe ? 'var(--primary-color)' : 'white',
                            color: isMe ? 'white' : 'var(--text-color)',
                            padding: '12px 16px',
                            borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            wordBreak: 'break-word'
                        }}>
                            <p style={{ margin: 0 }}>{msg.text}</p>
                            <span style={{
                                fontSize: '10px',
                                opacity: 0.7,
                                display: 'block',
                                textAlign: 'right',
                                marginTop: '4px'
                            }}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            width: '48px',
                            height: '48px', // Match Input height roughly
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: newMessage.trim() ? 'pointer' : 'default',
                            opacity: newMessage.trim() ? 1 : 0.5
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};
