import React from 'react';
import { Card } from './Card';
import { MessageCircle, User } from 'lucide-react';

export const ChatList = ({ chats, onSelectChat, currentUserId }) => {
    if (chats.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                <MessageCircle size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No conversations yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chats.map(chat => {
                const otherParticipantId = chat.participants.find(id => id !== currentUserId);
                const otherParticipantName = chat.participantNames[otherParticipantId] || 'User';
                const lastMessage = chat.messages[chat.messages.length - 1];

                return (
                    <Card
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        style={{ cursor: 'pointer', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}
                        className="fade-in"
                    >
                        <div style={{
                            width: '48px', height: '48px',
                            borderRadius: '50%',
                            background: '#e0e0e0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#666'
                        }}>
                            <User size={24} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{otherParticipantName}</span>
                                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                                    {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    background: 'var(--surface-color)',
                                    color: 'var(--text-light)',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                }}>
                                    {chat.orderId?.split('-')[1] || 'ORDER'}
                                </span>
                                <p style={{
                                    fontSize: '14px',
                                    color: 'var(--text-color)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1
                                }}>
                                    {lastMessage ? lastMessage.text : 'No messages'}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
