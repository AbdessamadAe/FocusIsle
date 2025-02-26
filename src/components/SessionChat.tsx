import React, { useState, useRef, useEffect } from 'react';
import { useFocusSession } from './FocusSessionContext';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

interface SessionChatProps {
  visible: boolean;
}

export function SessionChat({ visible }: SessionChatProps) {
  const { currentUser, currentSession } = useFocusSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (visible) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [visible, messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      height: '400px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#4CAF50'
        }} />
        <span style={{ fontWeight: 500 }}>Break Time Chat</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          {currentSession?.users.length || 0} online
        </span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: message.userId === currentUser?.id ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div style={{
              fontSize: '0.8rem',
              color: '#666',
              marginBottom: '4px'
            }}>
              {message.userId === currentUser?.id ? 'You' : message.userName}
            </div>
            <div style={{
              background: message.userId === currentUser?.id ? '#4CAF50' : '#f0f0f0',
              color: message.userId === currentUser?.id ? 'white' : '#333',
              padding: '8px 12px',
              borderRadius: '12px',
              borderBottomRightRadius: message.userId === currentUser?.id ? '4px' : '12px',
              borderBottomLeftRadius: message.userId === currentUser?.id ? '12px' : '4px',
              fontSize: '0.9rem'
            }}>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} style={{
        padding: '16px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          style={{
            padding: '8px 16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: inputValue.trim() ? 1 : 0.7
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
} 